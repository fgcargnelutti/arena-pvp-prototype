import type { AbilitySlotDefinition, AbilitySlotId } from "../types/game.types";

export const ABILITY_SLOTS: AbilitySlotDefinition[] = [
  {
    id: "basic-attack",
    label: "Basic Attack",
    kind: "basic-attack",
    inputLabel: "F",
    isRequired: true,
  },
  {
    id: "active-ability",
    label: "Active Ability",
    kind: "active",
    inputLabel: "Space",
    isRequired: true,
  },
];

export const ABILITY_SLOT_DEFINITIONS: Record<AbilitySlotId, AbilitySlotDefinition> =
  ABILITY_SLOTS.reduce(
    (definitions, slot) => ({
      ...definitions,
      [slot.id]: slot,
    }),
    {} as Record<AbilitySlotId, AbilitySlotDefinition>,
  );
