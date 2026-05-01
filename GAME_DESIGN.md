# Game Design Document (GDD)
## Arena PvP Prototype

---

## 🎯 Vision

Arena PvP is a competitive 1v1 arena game inspired by mid duels in Dota/Dota 2.

The goal is to create a fast, replayable combat experience where:

- PvP skill matters
- PvM interaction creates strategic variation
- Arena events introduce unpredictability
- Player builds define playstyle

---

## 🧠 Core Concept

A 1v1 duel inside a dynamic arena.

The match is influenced by:

- direct combat (PvP)
- environmental hazards
- PvM enemies
- temporary buffs

The arena is not static — it actively affects the outcome.

---

## 🎮 Core Gameplay Pillars

### 1. Mechanical Skill
- movement
- positioning
- timing
- ability usage

### 2. Strategic Adaptation
- reacting to arena events
- choosing when to engage PvM
- deciding risk vs reward

### 3. Build Diversity
- different skill combinations
- different playstyles
- progression-based customization

---

## 🔁 Game Loop

1. Player selects a character
2. Player configures build (skills)
3. Player selects arena pool
4. Player enters matchmaking
5. Match is found
6. Arena is randomly selected
7. Battle starts
8. PvP + PvM + events unfold
9. Winner is determined
10. Rewards and XP are distributed
11. Player returns to preparation phase

---

## 🧍 Character System

Characters are not fixed.

Each player account has:

- unlocked abilities
- selected builds
- progression level

Same character can differ between players.

---

## ⚔️ Combat System (Prototype Scope)

Current prototype includes:

- free movement
- basic attack
- one ability
- health system

Future expansion:

- multiple abilities
- cooldown management
- damage types
- status effects

---

## 🗺️ Arena Design

Arenas are a core differentiator.

Each arena may include:

- hazards (spikes, walls, traps)
- timed events
- PvM enemies
- environmental pressure

### Example Arena: Coliseum

- after 30s → walls start closing
- after 90s → lions spawn
- hazards activate over time

---

## 🧠 PvM System

PvM is not the main objective, but a strategic layer.

Players may:

- kill monsters
- gain temporary buffs
- control map resources

---

## 🎥 Camera

- top-down perspective
- inspired by MOBA games
- semi-fixed behavior
- player always visible
- slight movement allowed

---

## 🕹️ Movement

- fully free movement
- not tile-based
- smooth directional control
- bounded by arena

---

## 🏆 Win Condition

- eliminate opponent (health reaches zero)

Future possibilities:

- time-based win
- objective-based win
- arena-specific win conditions

---

## 🎁 Rewards (Future)

Winner:
- more XP
- progression rewards

Loser:
- reduced rewards
- still progresses

---

## 🔮 Future Features

- multiplayer (server authoritative)
- matchmaking system
- persistent progression
- PvE boss fights (co-op)
- exclusive abilities and skins
- ranking system

---

## ⚠️ Design Constraints (Prototype)

- no multiplayer yet
- no persistence
- no backend
- focus on gameplay feel
- avoid overengineering

---

## 🎯 Current Development Focus

- movement feel
- camera behavior
- combat responsiveness
- arena readability
- basic gameplay loop