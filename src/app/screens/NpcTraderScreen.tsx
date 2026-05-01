type NpcTraderScreenProps = {
  onBack: () => void;
};

function NpcTraderScreen({ onBack }: NpcTraderScreenProps) {
  return (
    <main className="screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">NPC Trader</p>
        <h1>Reward Exchange</h1>
        <div className="placeholder-list">
          <span>Trade rewards for cosmetics</span>
          <span>Unlock or buy skills</span>
          <span>Exchange boss rewards</span>
        </div>
        <button type="button" onClick={onBack}>
          Back to Main Hub
        </button>
      </section>
    </main>
  );
}

export default NpcTraderScreen;
