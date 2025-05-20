import { renderFullScreen } from "./fullscreen";
export * from "./router";
export * from "./components/ink";

export const render = (element: React.ReactNode) => {
  const enterAltScreenCommand = "\x1b[?1049h";
  const leaveAltScreenCommand = "\x1b[?1049l";
  process.stdout.write(enterAltScreenCommand);
  process.on("exit", () => {
    process.stdout.write(leaveAltScreenCommand);
  });

  renderFullScreen(element);
};
