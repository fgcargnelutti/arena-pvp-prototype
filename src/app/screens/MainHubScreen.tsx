type MainHubScreenProps = {
  onHeroes: () => void;
  onItems: () => void;
  onNpcTrader: () => void;
  onFindMatch: () => void;
};

function MainHubScreen({ onHeroes, onItems, onNpcTrader, onFindMatch }: MainHubScreenProps) {
  return (
    <main className="hub-screen">
      <header className="hub-toolbar">
        <strong>Arena PvP</strong>
        <nav>
          <button type="button" onClick={onHeroes}>
            Heroes
          </button>
          <button type="button" onClick={onItems}>
            Items
          </button>
          <button type="button" onClick={onNpcTrader}>
            NPC Trader
          </button>
          <button type="button" disabled>
            Events/Store
          </button>
        </nav>
      </header>

      <section className="hub-grid">
        <article className="hub-panel hub-news">
          <p className="screen-kicker">News</p>
          <h1>Prototype Season</h1>
          <p>Placeholder events, patch notes, and featured duel announcements.</p>
        </article>
        <article className="hub-panel">
          <p className="screen-kicker">Featured Arena</p>
          <h2>Mid Duel Arena</h2>
          <p>Carousel placeholder for future arenas, bosses, and limited-time modes.</p>
        </article>
      </section>

      <button type="button" className="find-match-button" onClick={onFindMatch}>
        Find Match
      </button>
    </main>
  );
}

export default MainHubScreen;
