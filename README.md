# Arena PvP Prototype

This project is a prototype for a future desktop PvP arena game intended for Steam.

The goal is to validate gameplay mechanics before building the full production system.

## 🎮 Concept

The game is inspired by 1v1 mid duels from Dota/Dota 2.

Core features:
- 1v1 PvP arena combat
- Free movement (not tile-based)
- MOBA-style semi-fixed camera
- Dynamic arenas with hazards and events
- PvP + PvM combined gameplay

## 🧠 Key Differentiator

Characters are not fixed.

Each player has:
- their own progression
- custom builds
- unlocked abilities

The same character can be different across accounts.

## 🔁 Game Loop

1. Select character
2. Configure build
3. Select arena pool
4. Matchmaking
5. Arena is randomly selected
6. PvP + PvM battle
7. Rewards and progression
8. Repeat

## ⚙️ Tech Stack (Prototype)

- Vite
- React
- TypeScript
- PixiJS

## 🚧 Current Scope

This is an early prototype.

Current goals:
- basic movement
- camera system
- simple combat
- one arena
- one enemy dummy

No multiplayer yet.

## 🔮 Future Plans

- Multiplayer (Go backend)
- Matchmaking
- Character progression system
- PvE boss fights
- Steam release

## 🚀 Getting Started

```bash
npm install
npm run dev