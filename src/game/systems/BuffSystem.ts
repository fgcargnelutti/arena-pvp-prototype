import type {
  ActiveBuff,
  BuffDefinition,
  BuffEffectType,
  BuffId,
  PlayerState,
} from "../types/game.types";

export class BuffSystem {
  private readonly definitions: Record<BuffId, BuffDefinition>;

  public constructor(definitions: Record<BuffId, BuffDefinition>) {
    this.definitions = definitions;
  }

  public update(player: PlayerState, deltaSeconds: number): void {
    for (let index = player.activeBuffs.length - 1; index >= 0; index -= 1) {
      const buff = player.activeBuffs[index];
      buff.remainingSeconds = Math.max(buff.remainingSeconds - deltaSeconds, 0);

      if (buff.remainingSeconds === 0) {
        player.activeBuffs.splice(index, 1);
      }
    }
  }

  public addOrRefresh(player: PlayerState, buffId: BuffId): void {
    const definition = this.definitions[buffId];
    const activeBuff = this.findActiveBuff(player, buffId);

    if (activeBuff) {
      activeBuff.remainingSeconds = definition.durationSeconds;
      return;
    }

    player.activeBuffs.push({
      id: buffId,
      remainingSeconds: definition.durationSeconds,
    });
  }

  public getRemainingRatio(player: PlayerState, buffId: BuffId): number {
    const activeBuff = this.findActiveBuff(player, buffId);

    if (!activeBuff) {
      return 0;
    }

    return activeBuff.remainingSeconds / this.definitions[buffId].durationSeconds;
  }

  public getEffectMultiplier(player: PlayerState, effectType: BuffEffectType): number {
    return player.activeBuffs.reduce((multiplier, activeBuff) => {
      const definition = this.definitions[activeBuff.id];
      const matchingEffects = definition.effects.filter((effect) => effect.type === effectType);

      return matchingEffects.reduce(
        (nextMultiplier, effect) => nextMultiplier * effect.value,
        multiplier,
      );
    }, 1);
  }

  public clear(player: PlayerState): void {
    player.activeBuffs.length = 0;
  }

  private findActiveBuff(player: PlayerState, buffId: BuffId): ActiveBuff | undefined {
    return player.activeBuffs.find((buff) => buff.id === buffId);
  }
}
