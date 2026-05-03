# ART_STYLE_GUIDE.md
## Arena PvP Prototype Art Style Guide

This guide is the single source of truth for visual style decisions in the gameplay prototype. It should be used when adding or adjusting arena, character, enemy, feedback, and HUD visuals.

---

## 1. Style Overview

The prototype uses a modern pixel-art style inspired by games similar to Drakantos.

The goal is not retro 8-bit art. The visual language should feel clean, readable, and slightly tactical, with enough depth to support gameplay clarity.

- Modern pixel art
- Semi-realistic proportions
- Clean and readable shapes
- Gameplay-first visual clarity
- Clean MOBA-style readability
- Controlled contrast and visual hierarchy

---

## 2. Visual Principles

- Gameplay readability comes before visual detail.
- Player, enemy, arena, and UI must be distinguishable at a glance.
- Shapes should be simple but intentional.
- Avoid pure black and pure white.
- Avoid overly saturated colors.
- Avoid noisy dithering, pixel clutter, heavy texture, and decorative detail.
- Use soft outlines instead of thick black borders.
- Use subtle shading to suggest depth.
- Lighting direction is top-down, slightly from the upper-left.
- The arena should support the action, not compete with it.

---

## 3. Color Philosophy

The palette should be slightly desaturated and controlled.

- Use muted colors with enough contrast for gameplay readability.
- Avoid pure black and pure white.
- Avoid overly saturated colors.
- Keep contrast intentional: high for gameplay objects, lower for environment detail.
- Player and enemy identity colors should be readable even during movement.
- UI colors should support clarity without pulling attention away from combat.

---

## 4. Color Palette

The source of truth in code is:

`src/game/utils/colors.ts`

### Arena

| Use | Color |
| --- | --- |
| Background | `#171b20` |
| Floor | `#2a3037` |
| Floor shade | `#232930` |
| Grid | `#343c45` |
| Strong grid | `#3d4651` |
| Border | `#596877` |
| Border highlight | `#738292` |

### Player

| Use | Color |
| --- | --- |
| Primary | `#5fb98f` |
| Shade | `#3f8069` |
| Light | `#9bd8bb` |
| Outline | `#223d39` |
| Shadow | `#15191c` |

### Enemy

| Use | Color |
| --- | --- |
| Primary | `#b85d62` |
| Shade | `#7f3947` |
| Light | `#d99a9a` |
| Outline | `#472833` |
| Hit flash | `#e6d3c7` |
| Shadow | `#15191c` |

### Accent

| Use | Color |
| --- | --- |
| Primary accent | `#d7b45f` |
| Light accent | `#ead18c` |
| Danger accent | `#c96b5c` |

### UI

| Use | Color |
| --- | --- |
| Panel | `#15191f` |
| Transparent panel | `#15191fdb` |
| Border | `#4d5a66` |
| Light border | `#798896` |
| Text | `#e6edf2` |
| Muted text | `#aeb9c3` |
| Empty bar | `#20262d` |
| Bar shade | `#11151a` |

---

## 5. Shapes & Rendering Guidelines

Current rendering uses simple PixiJS `Graphics`.

- Build characters and arena elements from simple geometry.
- Simulate depth through color, not complex detail.
- Use soft outlines, inner shade shapes, small highlights, and subtle shadows.
- Keep silhouettes readable from the gameplay camera distance.
- Avoid heavy black outlines.
- Avoid dense texture, dithering, and tiny decorative pixels.
- Do not add sprites, animation systems, or particles during this prototype stage.

---

## 6. Character Shape Language

### Player

The player should be the most readable gameplay object.

Current direction:

- Green primary color to separate the player from enemy and arena.
- Soft dark outline.
- Small upper-left highlight.
- Lower shading block to suggest volume.
- Subtle ground shadow.
- Simple silhouette built from PixiJS `Graphics`.

Do:

- Keep the player brighter than the arena.
- Keep the shape clean and readable while moving.
- Use green as the identity color.

Do not:

- Add sprite assets yet.
- Add animation systems yet.
- Add particle trails or noisy effects.

### Enemy

The dummy enemy should be instantly distinguishable from the player.

Current direction:

- Desaturated red primary color.
- Dark red outline.
- Pale red upper-left highlight.
- Lower shade area.
- Brief warm hit flash.
- Subtle ground shadow.

Do:

- Keep enemy colors warmer and more hostile than the player.
- Preserve strong contrast against the arena floor.

Do not:

- Make the enemy use player greens.
- Use pure red or overly saturated red.
- Add complex detail before gameplay needs it.

---

## 7. Arena Style

The arena should feel like a subdued stone or metal combat floor.

Current direction:

- Dark neutral base.
- Low-contrast grid.
- Slightly stronger grid lines every larger interval.
- Soft border and inner border highlight.
- Subtle lower/right shading to create depth.

Do:

- Keep the floor muted.
- Keep grid visibility low enough that it does not distract.
- Use arena detail mainly to support positioning and scale.

Do not:

- Add high-frequency texture.
- Add heavy dithering.
- Use bright floor colors.
- Let arena detail compete with characters.

---

## 8. UI Style

The UI should be minimal, unobtrusive, and readable.

Current direction:

- Dark translucent panel.
- Thin muted border.
- Player health uses player green.
- Enemy health uses enemy red.
- Cooldown uses warm accent gold.
- Bars use subtle top highlight and dark empty state.

Do:

- Keep HUD compact.
- Reuse gameplay colors for related information.
- Favor clarity over decoration.

Do not:

- Add large decorative frames.
- Use pure white outlines.
- Let HUD cover important gameplay space.

---

## 9. Feedback Colors

Feedback should be noticeable but controlled.

Current usage:

- Hit flash: `#e6d3c7`
- Cooldown ready progress: `#d7b45f`
- Highlight glint: `#ead18c`
- Danger accent: `#c96b5c`

Do:

- Use accent colors only for state, feedback, or important interaction.
- Keep flashes brief.

Do not:

- Turn feedback into particles yet.
- Add screen shake or animation systems as part of style work.

---

## 10. Do & Don't

| Do | Don't |
| --- | --- |
| Prioritize gameplay readability. | Add detail that makes combat harder to read. |
| Use slightly desaturated colors. | Use pure black, pure white, or overly saturated colors. |
| Keep the player clearly separated from the arena. | Let the floor compete visually with characters. |
| Use soft outlines and subtle shading. | Use thick black outlines or noisy dithering. |
| Use simple geometry while prototyping. | Add sprites before the gameplay prototype needs them. |
| Reuse the shared palette. | Create one-off colors without updating the guide. |
| Keep UI compact and readable. | Add large decorative UI frames. |
| Use accent colors for important feedback. | Use accent colors as general decoration. |

---

## 11. Current Technical Constraints

For this prototype stage:

- Use PixiJS `Graphics`.
- Do not add sprites yet.
- Do not add animation systems yet.
- Do not add particles yet.
- Do not refactor rendering architecture only for art.
- Do not modify gameplay logic for visual polish.

The current style system is intentionally small and data-driven through `src/game/utils/colors.ts`.

---

## 12. Future Art Direction Notes

When sprites are introduced later, they should follow the same rules:

- Semi-realistic proportions.
- Readable top-down silhouette.
- Slight desaturation.
- Soft outlines.
- Upper-left/top-down lighting.
- Minimal internal detail.
- Strong player/enemy/team readability.

Future assets should be validated in-game at normal camera distance before adding detail.
