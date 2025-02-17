import { useState, use } from "react";

import AddTaskModal from "../../UI/FormModals/AddTaskModal";

import { ITask } from "../../types/types";

import { DataContext } from "../../context/DataContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export const Actions = () => {
  const [addTaskModalOpen, setAddTaskModalOpen] = useState<boolean>(false);

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { addTask } = context;

  // Title for Add Task modal.
  const AddTaskTitle = "Add Task";

  // Opens Add Task Modal
  const openAddTaskModal = () => {
    setAddTaskModalOpen(true);
  };

  // Closes Add Task Modal
  const closeAddTaskModal = () => {
    setAddTaskModalOpen(false);
  };

  // Confirms adding task
  const confirmAddTask = (newTask: ITask) => {
    addTask(newTask);
  };

  return (
    <div className="flex flex-row justify-end items-center gap-2 py-2 mx-4">
      {addTaskModalOpen ? (
        <AddTaskModal
          title={AddTaskTitle}
          confirmAction={confirmAddTask}
          cancelAction={closeAddTaskModal}
        />
      ) : null}
      <button
        onClick={openAddTaskModal}
        className="bg-blue-400 h-12 rounded-sm px-4 font-bold text-white cursor-pointer"
      >
        New Task
      </button>
      <button className="bg-slate-100 border-2 border-slate-300 rounded-sm p-1 w-12 h-12 cursor-pointer">
        <FontAwesomeIcon icon={faEllipsis} className="text-slate-600" />
      </button>
    </div>
  );
};
