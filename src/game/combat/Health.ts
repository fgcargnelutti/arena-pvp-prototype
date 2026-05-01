export type HealthState = {
  maxHealth: number;
  currentHealth: number;
};

export class Health {
  public readonly state: HealthState;

  public constructor(maxHealth: number) {
    this.state = {
      maxHealth,
      currentHealth: maxHealth,
    };
  }

  public takeDamage(amount: number): void {
    this.state.currentHealth = clampHealth(this.state.currentHealth - amount, this.state.maxHealth);
  }

  public heal(amount: number): void {
    this.state.currentHealth = clampHealth(this.state.currentHealth + amount, this.state.maxHealth);
  }

  public isAlive(): boolean {
    return this.state.currentHealth > 0;
  }
}

const clampHealth = (value: number, maxHealth: number): number => {
  return Math.min(Math.max(value, 0), maxHealth);
};
