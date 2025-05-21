import { renderFullScreen } from "./fullscreen";
export * from "./router";
export * from "./components/ink";

export const render = (element: React.ReactNode) => {
  return renderFullScreen(element);
};
