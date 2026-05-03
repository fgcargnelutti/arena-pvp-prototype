# TASKS.md
## Arena PvP Prototype Roadmap

Use this pattern to indicate the tasks status:
TO DO - [ ] 
DONE - [X] 

---

# 🔥 NOW (Current Focus)

## 1. Core Architecture Stabilization

Goal: Ensure the current working prototype is modular and scalable.

### Subtasks

- [x] Refactor Game.ts into smaller modules
  - [x] extract types into `types/game.types.ts`
  - [x] extract math utilities into `utils/math.ts`
  - [x] extract input handling into `core/Input.ts`
  - [x] extract camera logic into `core/Camera.ts`
  - [x] extract movement logic into `systems/MovementSystem.ts`

- [ ] Ensure Game.ts only orchestrates systems
- [x] Keep behavior identical after refactor

---

## 2. Game Loop Validation

Goal: Ensure the game loop is stable and ready for future systems.

### Subtasks

- [x] Confirm delta time handling is correct
- [x] Cap delta time to avoid spikes
- [x] Ensure update() and render() separation is clear

---

## 3. Player Movement Polish

Goal: Make movement feel responsive and predictable.

### Subtasks

- [x] Normalize diagonal movement (already done, verify)
- [ ] Adjust player speed tuning
- [x] Validate arena boundary constraints
- [ ] Test edge collision behavior

---

## 4. Camera System Validation

Goal: Ensure camera behavior matches design intention.

### Subtasks

- [x] Validate dead zone behavior
- [ ] Adjust follow lerp for smoothness
- [x] Ensure player never leaves screen
- [x] Test camera limits near arena edges

---

# 🚀 NEXT (Gameplay Foundation)

## 5. Combat System (Basic)

Goal: Introduce the first combat interaction.

### Subtasks

- [x] Create Attack system
  - [x] define attack input
  - [x] define attack cooldown
  - [x] define attack range

- [x] Implement basic hit detection
  - [x] distance-based check
  - [x] no physics engine

- [x] Create Health system
  - [x] max health
  - [x] current health
  - [x] damage application

- [x] Create dummy enemy
  - [x] static or minimal movement
  - [x] receives damage

- [x] Add win condition
  - [x] enemy health reaches zero

- [x] Render dummy enemy in the arena
- [x] Add basic attack hit feedback
- [x] Add basic attack cooldown feedback

---

## 6. Ability System (First Version)

Goal: Add one active ability.

### Subtasks

- [ ] Create Ability type
- [ ] Implement cooldown system
- [ ] Add one simple ability (e.g. dash or ranged attack)
- [ ] Bind ability to input
- [ ] Show basic feedback (console or simple visual)

---

## 7. Basic HUD (Minimal)

Goal: Provide minimal player feedback.

### Subtasks

- [x] Display player health
- [x] Display enemy health
- [ ] Display ability cooldown
- [ ] Keep UI simple (React components)
- [x] Display basic attack cooldown

---

## 7.1 Visual Style System

Goal: Give the gameplay prototype a consistent modern pixel-art visual identity.

### Subtasks

- [x] Define a shared gameplay color palette
- [x] Centralize runtime game colors in `src/game/utils/colors.ts`
- [x] Apply palette to player, dummy enemy, arena, grid, and HUD bars
- [x] Refine simple Graphics shapes with soft outlines and subtle shading
- [x] Document visual decisions in `ART_STYLE_GUIDE.md`

---

# 🧩 LATER (Arena & PvM)

## 8. Arena Events System

Goal: Introduce dynamic arena behavior.

### Subtasks

- [ ] Create event system structure
- [ ] Implement timed events
- [ ] Add first arena event (e.g. shrinking walls)

---

## 9. PvM System (Basic)

Goal: Add non-player enemies.

### Subtasks

- [ ] Create enemy entity type
- [ ] Add simple AI (follow or idle)
- [ ] Add spawn logic
- [ ] Reward player for killing enemies (temporary buff)

---

## 10. Buff System

Goal: Add temporary gameplay modifiers.

### Subtasks

- [ ] Define buff structure
- [ ] Implement duration system
- [ ] Apply buff effects (e.g. speed, damage)

---

# 🌐 FUTURE (Multiplayer & Progression)

## 11. Network Layer Preparation

Goal: Prepare for Go backend integration.

### Subtasks

- [x] Define message types
- [x] Create MockServer
- [x] Simulate server responses
- [x] Separate client vs server responsibilities

---

## 12. Match Flow System

Goal: Simulate match lifecycle.

### Subtasks

- [ ] Create match states (lobby, in-game, end)
- [x] Transition between states
- [x] Reset game after match
- [x] Create initial React screen flow (superseded by Steam-style shell)
- [x] Replace login flow with Steam-style app shell

---

## 13. Character Build System

Goal: Introduce customization.

### Subtasks

- [ ] Define ability slots
- [ ] Create build configuration
- [ ] Allow swapping abilities

---

## 14. Multiple Arenas

Goal: Introduce arena variety.

### Subtasks

- [ ] Create arena config structure
- [ ] Load arena dynamically
- [ ] Implement arena selection pool

---

# 🧠 DEVELOPMENT RULES

- Always implement ONE subtask at a time
- Never batch multiple systems in one change
- Test after each change
- Keep commits small
- Follow AGENTS.md strictly


# 🧭 APP SHELL & USER FLOW

## 1. Splash Screen

Goal: Introduce the game before entering the main hub.

### Subtasks

- [x] Create `SplashScreen`
- [x] Show game title/logo placeholder
- [x] Add "Press any key" or auto-continue behavior
- [x] Navigate to `MainHubScreen`

---

## 2. Main Hub Screen

Goal: Create the main game landing screen, inspired by MOBA-style hubs.

### Subtasks

- [x] Create `MainHubScreen`
- [x] Add top navigation toolbar
- [x] Add center news/events area
- [x] Add featured arena/event carousel placeholder
- [x] Add bottom-right "Find Match" button
- [x] Add navigation placeholders for Heroes, Items, NPC/Trader, and Store/Future tabs

---

## 3. Top Navigation Sections

Goal: Create static placeholder screens for main hub sections.

### Subtasks

- [x] Create `HeroesScreen`
- [x] Create `ItemsScreen`
- [x] Create `NpcTraderScreen`
- [x] Create placeholder section for future store/events
- [x] Allow returning to `MainHubScreen`

---

## 4. Match Mode Selection

Goal: Let the player choose what type of match to search.

### Subtasks

- [x] Create `MatchModeSelectScreen`
- [x] Add PvP / Skirmish mode option
- [x] Add Boss Battle mode option
- [x] Add "Find Match" action
- [x] Keep matchmaking simulated only

---

## 5. PvP Match Lobby

Goal: Simulate the pre-match flow for a 1v1 PvP battle.

### Subtasks

- [x] Create `PvpLobbyScreen`
- [x] Show local player slot
- [x] Show opponent placeholder slot
- [x] Add character selection
- [x] Add arena pool selection
- [x] Allow selecting 1-2 arenas
- [x] Add "Ready" confirmation
- [x] Simulate opponent ready state
- [x] Reveal selected opponent placeholder
- [x] Randomly select one arena from the selected pool
- [x] Start match and navigate to `GameScreen`

---

## 6. Boss Battle Lobby

Goal: Simulate the cooperative PvM boss battle flow.

### Subtasks

- [x] Create `BossBattleLobbyScreen`
- [x] Show boss selection placeholder
- [x] Show required key/drop placeholder
- [x] Show two player slots
- [x] Simulate teammate found
- [x] Add "Ready" confirmation
- [x] Start boss battle placeholder flow

---

## 7. Game Screen Integration

Goal: Keep the existing PixiJS gameplay connected to the app shell.

### Subtasks

- [x] Ensure `GameScreen` renders existing `GameCanvas`
- [x] Pass selected mode/character/arena as placeholder props if needed
- [x] Do not change PixiJS gameplay behavior yet

---

## 8. Results Screen

Goal: Show post-match results after a match ends.

### Subtasks

- [x] Create `ResultsScreen`
- [x] Show match result placeholder
- [x] Show XP/reward placeholder
- [x] Add "Return to Main Hub" button
- [x] Add "Find Another Match" button placeholder

---

## 9. NPC Trader / Rewards Concept

Goal: Represent the future NPC used for reward exchange and skill unlocks.

### Subtasks

- [x] Add NPC/trader page placeholder
- [x] Show reward exchange placeholder
- [x] Show cosmetic unlock placeholder
- [x] Show skill unlock placeholder
- [x] Do not implement real economy or inventory yet
