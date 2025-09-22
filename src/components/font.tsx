import {
  Box,
  Text as InkText,
  Text,
  type TextProps as InkTextProps,
} from "ink";
import { fonts, getFont } from "../utils/font";

export interface TextProps extends InkTextProps {
  font?: keyof typeof fonts;
  children: string;
}

export function Font({ font = "tiny", children, ...props }: TextProps) {
  const fontData = getFont(font);

  let height = fontData.lines;
  let letters: string[][] = [];

  for (const letter of children?.toUpperCase().split("")) {
    if (!(letter in fontData.chars))
      throw new Error(`Character '${letter}' does not exist in font '${font}'`);
    const symbol = fontData.chars[letter as keyof typeof fontData.chars];
    letters.push(symbol);
  }

  return (
    <Box gap={fontData.space}>
      {letters.map((letter, i) => {
        return (
          <Box key={`${letter}-${i}`} height={height} flexDirection="column">
            {letter.map((letterPart, i) => (
              <Text key={`${letterPart}-${i}`} {...props}>
                {letterPart}
              </Text>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
