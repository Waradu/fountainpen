import { Text, Box } from "ink";
import { Router, Route } from "../src";
import Font from "../src/components/font";

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
