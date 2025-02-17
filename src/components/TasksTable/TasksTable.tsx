import { Header } from "./components/Header";
import { TaskCard } from "./components/TaskCard";

import { exampleData } from "../../exampleData/data";

export const TasksTable = () => {
  return (
    <div className="overflow-x-auto px-4">
      <table className="min-w-full table-auto">
        <Header />
        {exampleData.map((task) => (
          <TaskCard task={task} />
        ))}
      </table>
    </div>
  );
};
