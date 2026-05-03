export const gameColors = {
  arena: {
    background: "#171b20",
    floor: "#2a3037",
    floorShade: "#232930",
    grid: "#343c45",
    gridStrong: "#3d4651",
    border: "#596877",
    borderHighlight: "#738292",
  },
  player: {
    primary: "#5fb98f",
    shade: "#3f8069",
    light: "#9bd8bb",
    outline: "#223d39",
    shadow: "#15191c",
  },
  enemy: {
    primary: "#b85d62",
    shade: "#7f3947",
    light: "#d99a9a",
    outline: "#472833",
    hit: "#e6d3c7",
    shadow: "#15191c",
  },
  accent: {
    primary: "#d7b45f",
    light: "#ead18c",
    danger: "#c96b5c",
  },
  ui: {
    panel: "#15191f",
    panelTransparent: "#15191fdb",
    border: "#4d5a66",
    borderLight: "#798896",
    text: "#e6edf2",
    mutedText: "#aeb9c3",
    emptyBar: "#20262d",
    barShade: "#11151a",
  },
} as const;

export type GameColors = typeof gameColors;
