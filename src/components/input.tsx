import { useInput, type Key } from "ink";
import React, { createContext, useContext, useRef } from "react";

type KeyHandler = (input: string, key: Key) => void;

const GlobalInputContext = createContext<{
  subscribe: (handler: KeyHandler) => () => void;
} | null>(null);

export const GlobalInputProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handlersRef = useRef<Set<KeyHandler>>(new Set());

  useInput((input, key) => {
    handlersRef.current.forEach((handler) => handler(input, key));
  });

  const subscribe = (handler: KeyHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  };

  return (
    <GlobalInputContext.Provider value={{ subscribe }}>
      {children}
    </GlobalInputContext.Provider>
  );
};

export const useGlobalInput = (handler: KeyHandler) => {
  const context = useContext(GlobalInputContext);
  React.useEffect(() => {
    if (!context) return;
    return context.subscribe(handler);
  }, [handler, context]);
};
