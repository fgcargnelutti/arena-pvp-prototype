type MatchModeSelectScreenProps = {
  onBack: () => void;
  onPvp: () => void;
  onBossBattle: () => void;
};

function MatchModeSelectScreen({ onBack, onPvp, onBossBattle }: MatchModeSelectScreenProps) {
  return (
    <main className="screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">Find Match</p>
        <h1>Choose Mode</h1>
        <div className="mode-grid">
          <button type="button" onClick={onPvp}>
            <strong>PvP Skirmish</strong>
            <span>Simulated 1v1 arena lobby</span>
          </button>
          <button type="button" onClick={onBossBattle}>
            <strong>Boss Battle</strong>
            <span>Simulated PvM co-op lobby</span>
          </button>
        </div>
        <button type="button" onClick={onBack}>
          Back to Main Hub
        </button>
      </section>
    </main>
  );
}

export default MatchModeSelectScreen;
