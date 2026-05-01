import { useEffect } from "react";

type SplashScreenProps = {
  onContinue: () => void;
};

function SplashScreen({ onContinue }: SplashScreenProps) {
  useEffect(() => {
    window.addEventListener("keydown", onContinue);

    return () => {
      window.removeEventListener("keydown", onContinue);
    };
  }, [onContinue]);

  return (
    <main className="screen splash-screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">Steam Prototype</p>
        <h1>Arena PvP</h1>
        <p>Fast arena duels, PvM pressure, and dynamic match events.</p>
        <button type="button" onClick={onContinue}>
          Continue
        </button>
        <p className="screen-hint">Press any key to continue</p>
      </section>
    </main>
  );
}

export default SplashScreen;
