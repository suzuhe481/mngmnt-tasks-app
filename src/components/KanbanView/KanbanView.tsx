import { Header } from "../Header/Header";
import { KanbanTable } from "./KanbanTable/KanbanTable";

export const KanbanView = () => {
  return (
    <div className="w-full">
      <Header />
      <KanbanTable />
    </div>
  );
};
