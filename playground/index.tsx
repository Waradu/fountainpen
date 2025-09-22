import { render } from "ink";
import { Box, GlobalInputProvider } from "..";
import App from "./app";

render(
  <GlobalInputProvider>
    <Box flexGrow={1} paddingTop={1} flexDirection="column">
      <App />
    </Box>
  </GlobalInputProvider>,
  { exitOnCtrlC: true },
);
