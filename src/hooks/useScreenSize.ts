import { useEffect, useState } from "react";
import { useStdout } from "ink";

interface Dimensions {
  height: number;
  width: number;
}

export const useScreenSize = () => {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: stdout.columns,
    width: stdout.rows,
  });

  useEffect(() => {
    const handler = () =>
      setDimensions({
        height: stdout.columns,
        width: stdout.rows,
      });
    stdout.on("resize", handler);
    return () => {
      stdout.off("resize", handler);
    };
  }, [stdout]);

  return dimensions;
};
