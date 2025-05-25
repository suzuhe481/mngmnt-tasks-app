import { Header } from "../Header/Header";
import { Actions } from "./Actions/Actions";
import { Search } from "./Search/Search";
import { TasksTable } from "./TasksTable/TasksTable";
import { Pagination } from "./PaginationControls/Pagination";

export const TableView = () => {
  return (
    <div className="w-full">
      <Header />
      <Actions />
      <Search />
      <TasksTable />
      <Pagination />
    </div>
  );
};
