import type { PlayerBuildConfig } from "../types/game.types";

export const DEFAULT_PLAYER_BUILD_CONFIG: PlayerBuildConfig = {
  id: "blade-adept-default",
  name: "Blade Adept Starter",
  characterId: "blade-adept",
  characterName: "Blade Adept",
  abilityAssignments: [
    {
      slotId: "basic-attack",
      abilityId: "basic-attack",
    },
    {
      slotId: "active-ability",
      abilityId: "dash",
    },
  ],
};

export const PLAYER_BUILD_CONFIGS: PlayerBuildConfig[] = [DEFAULT_PLAYER_BUILD_CONFIG];
