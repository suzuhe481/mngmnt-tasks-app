import { use } from "react";

import { DataContext } from "../../context/DataContext";

export const Header = () => {
  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  const { kanbanView, toggleKanbanView } = context;

  return (
    <div className="relative flex flex-row justify-center py-4 bg-slate-700">
      <button
        onClick={toggleKanbanView}
        className="animate-all absolute left-2 text-white cursor-pointer border-1 border-white p-2 rounded-md text-[0.8rem] lg:text-base top-1/2 -translate-y-1/2 hover:bg-slate-300 hover:text-slate-800"
      >
        Switch to {kanbanView ? "Table" : "Kanban"}
      </button>
      <p className="font-mono text-4xl text-white">MNGMNT</p>
    </div>
  );
};
