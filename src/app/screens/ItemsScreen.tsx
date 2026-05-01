type ItemsScreenProps = {
  onBack: () => void;
};

function ItemsScreen({ onBack }: ItemsScreenProps) {
  return (
    <main className="screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">Items</p>
        <h1>Inventory Placeholder</h1>
        <div className="placeholder-list">
          <span>Consumables - disabled</span>
          <span>Cosmetics - future unlocks</span>
          <span>Boss rewards - future exchange materials</span>
        </div>
        <button type="button" onClick={onBack}>
          Back to Main Hub
        </button>
      </section>
    </main>
  );
}

export default ItemsScreen;
