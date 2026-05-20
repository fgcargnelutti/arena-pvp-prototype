import type { BuffDefinition, BuffId } from "../types/game.types";

export const CREEP_SPEED_BUFF: BuffDefinition = {
  id: "creep-speed",
  name: "Creep Momentum",
  durationSeconds: 5,
  effects: [
    {
      type: "move-speed-multiplier",
      value: 1.2,
    },
  ],
};

export const BUFF_DEFINITIONS: Record<BuffId, BuffDefinition> = {
  "creep-speed": CREEP_SPEED_BUFF,
};
