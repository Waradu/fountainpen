import { Text } from "ink";
import { Router, Route, Font, Box } from "..";
import Table from "../src/components/table";

export default function () {
  return (
    <Router>
      <Route path="/">
        <Box flexDirection="column" gap={1}>
          <Font font="tiny">Tiny Font</Font>
          <Table<{ name: string; type: string }>
            data={[
              {
                name: "TST-001",
                type: "Test",
              },
              {
                name: "TST-002",
                type: "Test",
              },
              {
                name: "APP-001",
                type: "App",
              },
            ]}
          />
        </Box>
      </Route>
    </Router>
  );
}
