import type { AbilityId, AbilitySlotKind } from "../types/game.types";

export type AbilityCatalogEntry = {
  id: AbilityId;
  label: string;
  slotKind: AbilitySlotKind;
  inputLabel: string;
  description: string;
};

export type MovementAbilityTuning = {
  id: Extract<AbilityId, "dash" | "quick-step">;
  distance: number;
  cooldownSeconds: number;
};

export const ABILITY_CATALOG: AbilityCatalogEntry[] = [
  {
    id: "basic-attack",
    label: "Basic Attack",
    slotKind: "basic-attack",
    inputLabel: "F",
    description: "Short melee strike.",
  },
  {
    id: "dash",
    label: "Dash",
    slotKind: "active",
    inputLabel: "Space",
    description: "Longer burst of movement with a slower cooldown.",
  },
  {
    id: "quick-step",
    label: "Quick Step",
    slotKind: "active",
    inputLabel: "Space",
    description: "Shorter reposition with a faster cooldown.",
  },
];

export const ABILITY_LABELS: Record<AbilityId, string> = ABILITY_CATALOG.reduce(
  (labels, ability) => ({
    ...labels,
    [ability.id]: ability.label,
  }),
  {} as Record<AbilityId, string>,
);

export const ACTIVE_ABILITY_OPTIONS = ABILITY_CATALOG.filter(
  (ability) => ability.slotKind === "active",
);

export const MOVEMENT_ABILITY_TUNING: Record<MovementAbilityTuning["id"], MovementAbilityTuning> =
  {
    dash: {
      id: "dash",
      distance: 180,
      cooldownSeconds: 1.8,
    },
    "quick-step": {
      id: "quick-step",
      distance: 115,
      cooldownSeconds: 1,
    },
  };
