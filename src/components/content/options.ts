/**
 * Content vocabularies, mirroring the API's rules (spec v4). The API validates everything again;
 * these only shape the editors so admins can't pick a combination the API would refuse.
 */

export type Phase = "MENSTRUAL" | "FOLLICULAR" | "OVULATION" | "LUTEAL";
export type Position = "EARLY" | "MID" | "LATE" | "UNIQUE";

export const PHASES: { value: Phase; label: string }[] = [
  { value: "MENSTRUAL", label: "Menstrual" },
  { value: "FOLLICULAR", label: "Follicular" },
  { value: "OVULATION", label: "Ovulation" },
  { value: "LUTEAL", label: "Luteal" },
];

export const POSITION_LABELS: Record<Position, string> = {
  EARLY: "Early",
  MID: "Mid",
  LATE: "Late",
  UNIQUE: "Unique",
};

/** Smart cards: Ovulation is one window ("Unique"); the other phases have thirds. */
export const CARD_POSITIONS: Record<Phase, Position[]> = {
  MENSTRUAL: ["EARLY", "MID", "LATE"],
  FOLLICULAR: ["EARLY", "MID", "LATE"],
  OVULATION: ["UNIQUE"],
  LUTEAL: ["EARLY", "MID", "LATE"],
};

/** Cycle-day lines: Ovulation has Early and Late only. */
export const DAY_POSITIONS: Record<Phase, Position[]> = {
  MENSTRUAL: ["EARLY", "MID", "LATE"],
  FOLLICULAR: ["EARLY", "MID", "LATE"],
  OVULATION: ["EARLY", "LATE"],
  LUTEAL: ["EARLY", "MID", "LATE"],
};

export const TIMES = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
  { value: "EVENING", label: "Evening" },
] as const;

export const CONTENT_TYPES = [
  "mindset",
  "movement",
  "nutrition",
  "mood",
  "sleep",
  "energy",
  "education",
  "recovery",
  "body awareness",
];

export const TONES = [
  "Empowering",
  "Encouraging",
  "Energising",
  "Gentle",
  "Grounding",
  "Informative",
  "Permissive",
  "Practical",
  "Reflective",
  "Validating",
];

/** Spec v4 §C2: the drop row (hydration) belongs to Menstrual, Ovulation and Late Luteal. */
export const expectsHydration = (phase: Phase, position: Position) =>
  phase === "MENSTRUAL" || phase === "OVULATION" || (phase === "LUTEAL" && position === "LATE");

export const DYK_CATEGORIES = [
  "Cycle and Body",
  "Health and Nutrition",
  "Mental Wellness",
  "Reproduction",
  "Sport and Movement",
  "Women Pioneers",
];

/** The blog's interest tags (same list the API checks). */
export const INTEREST_TAGS = ["Movement", "Nutrition", "Sleep", "Hormonal Health", "Fertility", "Wellbeing"];

/** Detail icons the app can draw on an insight. */
export const DETAIL_ICONS = [
  { value: "moon", label: "Moon" },
  { value: "bolt", label: "Energy" },
  { value: "heart", label: "Heart" },
  { value: "bulb", label: "Idea" },
  { value: "sparkles", label: "Sparkles" },
];

export const phaseLabel = (phase?: string | null) => PHASES.find((item) => item.value === phase)?.label ?? "Any phase";
