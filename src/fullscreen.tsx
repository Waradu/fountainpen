import { type BoxProps, Box, render } from "ink";
import React, { useState, useEffect, type PropsWithChildren } from "react";

function useStdoutDimensions(): [number, number] {
  const { columns, rows } = process.stdout;
  const [size, setSize] = useState({ columns, rows });
  useEffect(() => {
    function onResize() {
      const { columns, rows } = process.stdout;
      setSize({ columns, rows });
    }
    process.stdout.on("resize", onResize);
    return () => {
      process.stdout.off("resize", onResize);
    };
  }, []);
  return [size.columns, size.rows];
}

const FullScreen: React.FC<PropsWithChildren<BoxProps>> = ({
  children,
  ...styles
}) => {
  const [columns, rows] = useStdoutDimensions();
  return (
    <Box width={columns} height={rows} {...styles}>
      {children}
    </Box>
  );
};

export const renderFullScreen = (element: React.ReactNode) => {
  const instance = render(<FullScreen>{element}</FullScreen>);

  return instance;
};
