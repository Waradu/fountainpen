import { Box as InkBox, type BoxProps as InkBoxProps } from "ink";

export interface BoxProps extends InkBoxProps {
  size?: number | string;
  children?: React.ReactNode | undefined;
}

export function Box({ size, width, height, children, ...props }: BoxProps) {
  return (
    <InkBox
      width={size ? size : width}
      height={size ? size : height}
      {...props}
    >
      {children}
    </InkBox>
  );
}
