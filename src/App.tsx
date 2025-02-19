import { Header } from "./components/Header/Header";
import { Actions } from "./components/Actions/Actions";
import { Search } from "./components/Search/Search";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { Pagination } from "./components/PaginationControls/Pagination";

function App() {
  return (
    <div className="w-full">
      <Header />
      <Actions />
      <Search />
      <TasksTable />
      <Pagination />
    </div>
  );
}

export default App;
