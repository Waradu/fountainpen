import { Text, Box } from "ink";
import { Router, Route, Font } from "../src";

export default function () {
  return (
    <Router>
      <Route path="/">
        <Box flexDirection="column" gap={1}>
          <Font font="tiny">Tiny Font</Font>
        </Box>
      </Route>
    </Router>
  );
}
