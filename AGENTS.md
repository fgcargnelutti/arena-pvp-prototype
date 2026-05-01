You are helping build a game prototype.

-------------------------------------
PROJECT CONTEXT
-------------------------------------

This is a prototype for a future desktop PvP arena game intended for Steam.

The goal is to validate gameplay mechanics first, not to build the final production system.

-------------------------------------
GAME CONCEPT
-------------------------------------

The game is inspired by 1v1 mid duels from Dota/Dota 2.

Core idea:
- 1v1 PvP arena combat
- Free movement (NOT tile-based)
- Top-down camera similar to MOBA games
- Semi-fixed camera: player is always visible, camera can slightly move but never lose the character

Each match happens inside an arena.

Arenas are dynamic and can contain:
- environmental hazards (closing walls, spikes, etc.)
- PvM elements (creeps, monsters, lions, etc.)
- timed events

Gameplay is:
PvP + PvM + environment

Players can gain temporary advantages from PvM performance.

-------------------------------------
CHARACTER SYSTEM
-------------------------------------

Characters are not fixed.

Each player has:
- their own progression
- custom builds
- unlocked abilities

The same character can be different across accounts.

-------------------------------------
GAME LOOP
-------------------------------------

1. Select character
2. Configure build
3. Select arena pool
4. Matchmaking
5. Arena is randomly selected
6. PvP + PvM battle
7. Rewards and progression
8. Repeat

-------------------------------------
TECH STACK (CURRENT PROTOTYPE)
-------------------------------------

- Vite
- React
- TypeScript
- PixiJS

Backend (future, not now):
- Go
- WebSockets
- Server authoritative model

-------------------------------------
IMPORTANT ARCHITECTURE RULES
-------------------------------------

DO NOT build a monolithic structure.

You MUST separate:

- rendering (PixiJS)
- game loop
- input handling
- camera
- entities
- combat logic
- systems (movement, combat, collision)
- data
- network layer (mock)
- shared types

Game logic must NOT be tightly coupled to PixiJS rendering.

React must NOT handle real-time game logic.

-------------------------------------
PROJECT STRUCTURE
-------------------------------------

Use this structure:

src/
  app/
  components/
  game/
    core/
    entities/
    systems/
    combat/
    data/
    network/
    types/

-------------------------------------
PROTOTYPE SCOPE
-------------------------------------

Implement ONLY:

- one arena
- one player
- one dummy enemy
- free movement
- semi-fixed camera
- basic attack
- one ability with cooldown
- health system
- simple win/lose condition

-------------------------------------
DO NOT IMPLEMENT
-------------------------------------

- multiplayer
- backend
- login/auth
- persistence
- inventory
- ranking
- monetization
- Steam integration

-------------------------------------
FUTURE BACKEND PREPARATION
-------------------------------------

Assume later:

- client sends input (intent)
- server validates
- server owns game state
- client renders and predicts

For now, use local simulation or mock server patterns.

-------------------------------------
DEVELOPMENT PRINCIPLES
-------------------------------------

- keep code modular
- small files
- small commits
- no "God classes"
- avoid overengineering
- use TypeScript types
- separate systems clearly

-------------------------------------
FIRST TASK
-------------------------------------

Set up the base game structure and implement:

- PixiJS initialization
- Game loop
- One controllable player
- Free movement
- Semi-fixed camera that follows player

Do NOT implement combat yet.

-------------------------------------
IMPORTANT
-------------------------------------

This is a gameplay prototype.

Do not focus on UI or backend.

Focus on movement, camera, and core feel of the game.

## Task Tracking Rule

The project uses `TASKS.md` as the source of truth for roadmap progress.

After completing any implementation task, you MUST:

1. Check `TASKS.md`
2. Identify whether the completed work matches an existing task or subtask
3. Mark completed items with `[x]`
4. Do not mark unrelated items as complete
5. If the completed work is not listed, add it under the most relevant section
6. Keep task descriptions concise
7. Never delete unfinished tasks unless explicitly instructed

Every code change task must include a `TASKS.md` update when applicable.