import Tiny from "../fonts/tiny.json";

export const fonts = {
  tiny: Tiny
};

export function getFont(name: keyof typeof fonts) {
  const font = fonts[name];
  if (!font) throw new Error("Font not found");
  return font;
}