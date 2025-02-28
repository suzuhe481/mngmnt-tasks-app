import { Header } from "../TableView/Header/Header";
import { Search } from "../TableView/Search/Search";
import { KanbanTable } from "./KanbanTable/KanbanTable";
// import { KanbanTable } from "./KanbanTable/KanbanTable";

export const KanbanView = () => {
  return (
    <div className="w-full">
      <Header />
      <Search />
      <KanbanTable />
    </div>
  );
};
