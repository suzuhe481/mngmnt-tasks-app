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

  const { tasksData, sortedFilteredData, sortedOrFilteredSettings } = context;

  // Detects if data has been sorted or filtered to determine
  // which tasks to display.
  const isSortedOrFiltered =
    sortedOrFilteredSettings.sorted || sortedOrFilteredSettings.filtered;

  return (
    <div className="overflow-x-auto px-4">
      <table className="min-w-full table-auto">
        <Header />
        {isSortedOrFiltered
          ? sortedFilteredData.map((task) => <TaskCard task={task} />)
          : tasksData.map((task) => <TaskCard task={task} />)}
      </table>
    </div>
  );
};
