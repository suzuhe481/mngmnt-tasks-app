import { use } from "react";

import { TableView } from "./components/TableView/TableView";
import { KanbanView } from "./components/KanbanView/KanbanView";

import { DataContext } from "./context/DataContext";

function App() {
  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  const { kanbanView } = context;

  return <>{kanbanView ? <KanbanView /> : <TableView />};</>;
}

export default App;
