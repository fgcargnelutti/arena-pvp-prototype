import { useState } from "react";
import BossBattleLobbyScreen from "./app/screens/BossBattleLobbyScreen";
import GameScreen from "./app/screens/GameScreen";
import HeroesScreen from "./app/screens/HeroesScreen";
import ItemsScreen from "./app/screens/ItemsScreen";
import MainHubScreen from "./app/screens/MainHubScreen";
import MatchModeSelectScreen from "./app/screens/MatchModeSelectScreen";
import NpcTraderScreen from "./app/screens/NpcTraderScreen";
import PvpLobbyScreen from "./app/screens/PvpLobbyScreen";
import ResultsScreen from "./app/screens/ResultsScreen";
import SplashScreen from "./app/screens/SplashScreen";
import { matchPhaseLabels, type MatchPhase } from "./app/matchFlow";

type AppScreen =
  | "splash"
  | "main-hub"
  | "heroes"
  | "items"
  | "npc-trader"
  | "match-mode-select"
  | "pvp-lobby"
  | "boss-battle-lobby"
  | "game"
  | "results";

type MatchContext = {
  modeLabel: string;
  arenaLabel: string;
};

const defaultMatchContext: MatchContext = {
  modeLabel: "PvP Skirmish",
  arenaLabel: "Mid Duel Arena",
};

function App() {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [matchPhase, setMatchPhase] = useState<MatchPhase>("lobby");
  const [matchContext, setMatchContext] = useState<MatchContext>(defaultMatchContext);

  if (screen === "splash") {
    return <SplashScreen onContinue={() => setScreen("main-hub")} />;
  }

  if (screen === "main-hub") {
    return (
      <MainHubScreen
        onHeroes={() => setScreen("heroes")}
        onItems={() => setScreen("items")}
        onNpcTrader={() => setScreen("npc-trader")}
        onFindMatch={() => setScreen("match-mode-select")}
      />
    );
  }

  if (screen === "heroes") {
    return <HeroesScreen onBack={() => setScreen("main-hub")} />;
  }

  if (screen === "items") {
    return <ItemsScreen onBack={() => setScreen("main-hub")} />;
  }

  if (screen === "npc-trader") {
    return <NpcTraderScreen onBack={() => setScreen("main-hub")} />;
  }

  if (screen === "match-mode-select") {
    return (
      <MatchModeSelectScreen
        onBack={() => setScreen("main-hub")}
        onPvp={() => {
          setMatchPhase("lobby");
          setScreen("pvp-lobby");
        }}
        onBossBattle={() => {
          setMatchPhase("lobby");
          setScreen("boss-battle-lobby");
        }}
      />
    );
  }

  if (screen === "pvp-lobby") {
    return (
      <PvpLobbyScreen
        onBack={() => setScreen("match-mode-select")}
        onStart={(selectedArena) => {
          setMatchContext({ modeLabel: "PvP Skirmish", arenaLabel: selectedArena });
          setMatchPhase("in-game");
          setScreen("game");
        }}
      />
    );
  }

  if (screen === "boss-battle-lobby") {
    return (
      <BossBattleLobbyScreen
        onBack={() => setScreen("match-mode-select")}
        onStart={() => {
          setMatchContext({ modeLabel: "Boss Battle", arenaLabel: "Ancient Lion Lair" });
          setMatchPhase("in-game");
          setScreen("game");
        }}
      />
    );
  }

  if (screen === "game") {
    return (
      <GameScreen
        modeLabel={matchContext.modeLabel}
        arenaLabel={matchContext.arenaLabel}
        matchPhaseLabel={matchPhaseLabels[matchPhase]}
        onFinish={() => {
          setMatchPhase("end");
          setScreen("results");
        }}
      />
    );
  }

  return (
    <ResultsScreen
      modeLabel={matchContext.modeLabel}
      arenaLabel={matchContext.arenaLabel}
      matchPhaseLabel={matchPhaseLabels[matchPhase]}
      onFindAnother={() => {
        setMatchPhase("lobby");
        setScreen("match-mode-select");
      }}
      onMainHub={() => setScreen("main-hub")}
    />
  );
}

export default App;
