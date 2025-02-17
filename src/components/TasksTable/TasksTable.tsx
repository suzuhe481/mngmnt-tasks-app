import { use } from "react";

import { Header } from "./components/Header";
import { TaskCard } from "./components/TaskCard";

import { DataContext } from "../../context/DataContext";

export const TasksTable = () => {
  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  const { tasksData } = context;

  return (
    <div className="overflow-x-auto px-4">
      <table className="min-w-full table-auto">
        <Header />
        {tasksData.map((task) => (
          <TaskCard task={task} />
        ))}
      </table>
    </div>
  );
};
