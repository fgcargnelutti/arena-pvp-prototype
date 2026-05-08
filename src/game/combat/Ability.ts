export type AbilityId = "dash";

export type AbilityTargeting = "self" | "direction" | "point" | "unit";

export type AbilityDefinition = {
  id: AbilityId;
  name: string;
  cooldownSeconds: number;
  targeting: AbilityTargeting;
};
