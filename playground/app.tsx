import { Text } from "ink";
import { Router, Route, Font, Box } from "..";

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
