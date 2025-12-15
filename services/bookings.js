// services/bookings.js
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

export async function createBooking(booking) {
  const user = auth.currentUser;
  if (!user) throw new Error("Ingen bruger logget ind.");

  const slotKey = `${booking.venueId}_${booking.dateISO}_${booking.time}`;
  const slotRef = doc(db, "slots", slotKey);

  // Vi opretter booking-doc via addDoc INDE i transaction med et forudlavet id
  // Så vi kan skrive begge docs atomisk.
  const bookingRef = doc(collection(db, "bookings"));

  await runTransaction(db, async (transaction) => {
    const slotSnap = await transaction.get(slotRef);

    if (slotSnap.exists()) {
      throw new Error("Tiden er allerede booket.");
    }

    // 1) lås slot (globalt)
    transaction.set(slotRef, {
      bookedBy: user.uid,
      venueId: booking.venueId,
      dateISO: booking.dateISO,
      time: booking.time,
      createdAt: serverTimestamp(),
    });

    // 2) opret booking (til brugeren)
    transaction.set(bookingRef, {
      userId: user.uid,
      slotKey,
      ...booking,
      createdAt: serverTimestamp(),
    });
  });

  return { id: bookingRef.id, slotKey };
}

export async function getMyBookings() {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "bookings"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteMyBooking(bookingId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Ingen bruger er logget ind.");

  const bookingRef = doc(db, "bookings", bookingId);

  await runTransaction(db, async (transaction) => {
    // 1) READ booking først
    const bookingSnap = await transaction.get(bookingRef);
    if (!bookingSnap.exists()) return;

    const data = bookingSnap.data();
    if (data.userId !== user.uid) {
      throw new Error("Ingen adgang.");
    }

    // 2) READ slot lock (hvis findes)
    let slotRef = null;
    if (data.slotKey) {
      slotRef = doc(db, "slots", data.slotKey);
      await transaction.get(slotRef); // vigtigt: read før delete
    }

    // 3) WRITE: slet booking
    transaction.delete(bookingRef);

    // 4) WRITE: slet slot lock
    if (slotRef) {
      transaction.delete(slotRef);
    }
  });
}


export async function clearMyBookings() {
  const user = auth.currentUser;
  if (!user) throw new Error("Ingen bruger er logget ind.");

  const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
  const snap = await getDocs(q);

  // Slet én ad gangen (hver sletning er sin egen transaction)
  for (const d of snap.docs) {
    await deleteMyBooking(d.id);
  }
}


