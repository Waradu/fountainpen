import { useStdout } from "ink";
import { useCallback, useEffect, useState } from "react";

export function useScreenSize() {
  const { stdout } = useStdout();

  const getDimensions = useCallback(
    () => ({ height: stdout.rows, width: stdout.columns }),
    [stdout],
  );

  const [dimensions, setDimensions] = useState(getDimensions);

  useEffect(() => {
    const resize = () => {
      setDimensions(getDimensions());
    };

    stdout.on("resize", resize);

    return () => {
      stdout.off("resize", resize);
    };

  }, [stdout, getDimensions]);

  return dimensions;
}