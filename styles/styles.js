// styles/styles.js
import { StyleSheet, Platform } from 'react-native';

/* ---------- Design tokens (sports theme) ---------- */
export const colors = {
  // Brand (turf green)
  primary:      '#22C55E', // green-500
  primaryDark:  '#166534', // green-800
  primarySoft:  '#DCFCE7', // green-100

  // Neutrals (dark UI)
  bg:           '#0B1220', // deep sport night
  surface:      '#0F172A', // slate-900
  surfaceAlt:   '#111827', // gray-900
  card:         '#111827',
  border:       '#1F2937', // gray-800

  // Text
  text:         '#E5E7EB', // gray-200
  textMuted:    '#94A3B8', // slate-400
  textInverse:  '#0B1220',

  // alias (nogle skærme bruger colors.muted)
  muted:        '#94A3B8',

  // States
  success:      '#22C55E',
  warning:      '#F59E0B',
  danger:       '#EF4444',
};

/* ---------- Shadows ---------- */
const shadowSm = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  android: { elevation: 2 },
});

const shadowMd = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
});

/* ---------- Global styles (g) ---------- */
export const g = StyleSheet.create({
  /* Layout */
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  content: { flex: 1 },
  flex1: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  /* Typography */
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: colors.text,
    marginTop: 6,
    marginBottom: 12,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  muted: { color: colors.textMuted },

  /* Cards / Surfaces */
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
    ...shadowSm,
  },
  cardElev: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    ...shadowMd,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 12,
  },

  /* Buttons */
  btn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1220', // læsbar på grøn
  },
  btnTextDark: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  /* Explore: sport chips grid */
  sportListContent: { paddingVertical: 12, paddingBottom: 120 },
  sportRow: { justifyContent: 'space-between', marginBottom: 12 },
  sportChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginHorizontal: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadowSm,
  },
  sportIcon: { fontSize: 30, marginBottom: 6, color: colors.text },
  sportName: { fontSize: 16, fontWeight: '700', color: colors.text },

  /* Venue list item */
  venueImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: colors.card,
    marginBottom: 10,
  },
  venueTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  venueMeta: {
    marginTop: 2,
    color: colors.textMuted,
  },

  /* Generic chips (Booking date/time) */
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  chipText: { color: colors.textMuted, fontWeight: '700' },
  chipTextActive: { color: colors.primaryDark, fontWeight: '800' },

  /* Progress steps (Sport → Venue → Book) */
  progressTop: {
    borderTopWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: colors.bg,
    marginBottom: 8,
  },
  progressWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.border,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  stepCircleDone: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  stepLabel: {
    marginLeft: 6,
    marginRight: 10,
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  stepLabelDone: {
    color: colors.text,
    fontWeight: '800',
  },
  connector: {
    width: 28,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 6,
    borderRadius: 1,
  },
  connectorActive: { backgroundColor: colors.primary },

  /* BottomBar (fixed) */
  bottomBarContainer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: colors.bg,
  },
  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 88,
  },
  bottomLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2, fontWeight: '600' },

  // Skærme der skal have plads til BottomBar nederst
  screenWithBar: { paddingBottom: 80 },

  /* Empty state (Bookinger) */
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: 'center',
    ...shadowSm,
  },
  emptyText: {
    color: colors.textMuted,
    fontWeight: '600',
  },

  /* Profile: stats & lists */
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  statCard: { backgroundColor: colors.card, borderRadius: 12, padding: 14, width: '48%', marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { color: colors.textMuted, marginTop: 4 },

  sportThumb: { width: 44, height: 44, borderRadius: 10, marginRight: 10 },

  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  listThumb: { width: 42, height: 42, borderRadius: 10, marginRight: 10 },
  listTitle: { fontWeight: '700', color: colors.text },
  listSubtitle: { color: colors.textMuted, marginTop: 2 },
  listPrice: { fontWeight: '800', color: colors.text, marginLeft: 8 },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 6 },

    /* Forms (Auth / inputs) */
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  },
  inputLabel: {
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

});
