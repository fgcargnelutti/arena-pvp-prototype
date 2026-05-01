type HeroesScreenProps = {
  onBack: () => void;
};

function HeroesScreen({ onBack }: HeroesScreenProps) {
  return (
    <main className="screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">Heroes</p>
        <h1>Hero Roster</h1>
        <div className="placeholder-list">
          <span>Blade Adept - close-range duel placeholder</span>
          <span>Storm Duelist - mobility build placeholder</span>
          <span>Iron Mystic - sustain build placeholder</span>
        </div>
        <button type="button" onClick={onBack}>
          Back to Main Hub
        </button>
      </section>
    </main>
  );
}

export default HeroesScreen;
