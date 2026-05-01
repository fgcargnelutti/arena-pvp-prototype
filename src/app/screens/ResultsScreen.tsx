type ResultsScreenProps = {
  modeLabel: string;
  arenaLabel: string;
  onFindAnother: () => void;
  onMainHub: () => void;
};

function ResultsScreen({ modeLabel, arenaLabel, onFindAnother, onMainHub }: ResultsScreenProps) {
  return (
    <main className="screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">Results</p>
        <h1>Match Complete</h1>
        <div className="placeholder-list">
          <span>Mode: {modeLabel}</span>
          <span>Arena: {arenaLabel}</span>
          <span>XP: placeholder reward</span>
          <span>Rewards: placeholder loot</span>
        </div>
        <div className="screen-actions">
          <button type="button" onClick={onMainHub}>
            Return to Main Hub
          </button>
          <button type="button" onClick={onFindAnother}>
            Find Another Match
          </button>
        </div>
      </section>
    </main>
  );
}

export default ResultsScreen;
