import { Box as InkBox, type BoxProps as InkBoxProps } from "ink";

type ExcludeBorder =
  | "borderTop"
  | "borderBottom"
  | "borderLeft"
  | "borderRight"
  | "borderColor"
  | "borderTopColor"
  | "borderBottomColor"
  | "borderLeftColor"
  | "borderRightColor"
  | "borderDimColor"
  | "borderTopDimColor"
  | "borderBottomDimColor"
  | "borderLeftDimColor"
  | "borderRightDimColor";

export interface BoxProps extends Omit<InkBoxProps, ExcludeBorder> {
  size?: number | string;
  children?: React.ReactNode | undefined;

  border?: boolean;
  borderX?: boolean;
  borderY?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;

  borderColor?: InkBoxProps["borderColor"];
  borderXColor?: InkBoxProps["borderColor"];
  borderYColor?: InkBoxProps["borderColor"];
  borderTopColor?: InkBoxProps["borderColor"];
  borderBottomColor?: InkBoxProps["borderColor"];
  borderLeftColor?: InkBoxProps["borderColor"];
  borderRightColor?: InkBoxProps["borderColor"];

  borderDimColor?: boolean;
  borderXDimColor?: boolean;
  borderYDimColor?: boolean;
  borderTopDimColor?: boolean;
  borderBottomDimColor?: boolean;
  borderLeftDimColor?: boolean;
  borderRightDimColor?: boolean;
}

function resolveBool(
  side: boolean | undefined,
  axis: boolean | undefined,
  all: boolean | undefined,
): boolean {
  return side ?? axis ?? all ?? false;
}

function resolveColor(
  side: string | undefined,
  axis: string | undefined,
  all: string | undefined,
): string | undefined {
  return side ?? axis ?? all;
}

function resolveDim(
  side: boolean | undefined,
  axis: boolean | undefined,
  all: boolean | undefined,
): boolean | undefined {
  return side ?? axis ?? all;
}

export function Box({ size, width, height, children, ...props }: BoxProps) {
  const {
    border,
    borderX,
    borderY,
    borderTop,
    borderBottom,
    borderLeft,
    borderRight,

    borderColor,
    borderXColor,
    borderYColor,
    borderTopColor,
    borderBottomColor,
    borderLeftColor,
    borderRightColor,

    borderDimColor,
    borderXDimColor,
    borderYDimColor,
    borderTopDimColor,
    borderBottomDimColor,
    borderLeftDimColor,
    borderRightDimColor,

    borderStyle,

    ...boxProps
  } = props;

  const hasBorder =
    resolveBool(borderTop, borderY, border) ||
    resolveBool(borderBottom, borderY, border) ||
    resolveBool(borderLeft, borderX, border) ||
    resolveBool(borderRight, borderX, border);

  return (
    <InkBox
      width={size ? size : width}
      height={size ? size : height}
      borderTop={resolveBool(borderTop, borderY, border)}
      borderBottom={resolveBool(borderBottom, borderY, border)}
      borderLeft={resolveBool(borderLeft, borderX, border)}
      borderRight={resolveBool(borderRight, borderX, border)}
      borderTopColor={resolveColor(borderTopColor, borderYColor, borderColor)}
      borderBottomColor={resolveColor(borderBottomColor, borderYColor, borderColor)}
      borderLeftColor={resolveColor(borderLeftColor, borderXColor, borderColor)}
      borderRightColor={resolveColor(borderRightColor, borderXColor, borderColor)}
      borderTopDimColor={resolveDim(borderTopDimColor, borderYDimColor, borderDimColor)}
      borderBottomDimColor={resolveDim(borderBottomDimColor, borderYDimColor, borderDimColor)}
      borderLeftDimColor={resolveDim(borderLeftDimColor, borderXDimColor, borderDimColor)}
      borderRightDimColor={resolveDim(borderRightDimColor, borderXDimColor, borderDimColor)}
      borderStyle={borderStyle ?? (hasBorder ? "single" : undefined)}
      {...boxProps}
    >
      {children}
    </InkBox>
  );
}
