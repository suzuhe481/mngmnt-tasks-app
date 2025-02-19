import { useState, use, useRef, useEffect } from "react";

import AddTaskModal from "../../UI/FormModals/AddTaskModal";
import ActionModal from "../../UI/SettingsModals/ActionModal";

import { ITask } from "../../types/types";

import { DataContext } from "../../context/DataContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export const Actions = () => {
  const [addTaskModalOpen, setAddTaskModalOpen] = useState<boolean>(false);

  const [actionModalOpen, setActionModalOpen] = useState<boolean>(false);

  // Refs for Action Icon and Modal
  const ActionModalRef = useRef<HTMLDivElement>(null);
  const ActionIconRef = useRef<HTMLButtonElement>(null);

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

  // Handles when clicking on screen to close Filter Modal.
  function handleClickOutsideMenu(event: MouseEvent) {
    const target = event.target as Node;

    // If icon is clicked while modal is open,
    // Modal remains open.
    // Reason: Without this, modal will flash when clicking the icon.
    if (
      actionModalOpen &&
      ActionIconRef.current &&
      ActionIconRef.current.contains(target)
    ) {
      // Does nothing
    }
    // If anywhere else on the page is clicked that isn't inside the menu, close the menu.
    else if (
      actionModalOpen &&
      ActionModalRef.current &&
      !ActionModalRef.current.contains(target)
    ) {
      setActionModalOpen(false);
    }
  }

  // Adds/removes event listener for closing the FilterModal on outside button click.
  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener("mousedown", handleClickOutsideMenu, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  });

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { addTask, changePageSize, pageSize } = context;

  return (
    <div className="relative flex flex-row justify-between items-center gap-2 py-2 mx-4">
      {addTaskModalOpen ? (
        <AddTaskModal
          title={AddTaskTitle}
          confirmAction={confirmAddTask}
          cancelAction={closeAddTaskModal}
        />
      ) : null}
      <div>
        <label htmlFor="size" className="mb-1">
          Page Size:
        </label>
        <select
          name="size"
          id="size"
          required
          value={pageSize}
          onChange={(event) => changePageSize(Number(event.target.value))}
          className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
      <div className="flex flex-row gap-2">
        <button
          onClick={openAddTaskModal}
          className="bg-blue-500 h-12 rounded-sm px-4 hover:bg-blue-600 font-bold text-white cursor-pointer"
        >
          New Task
        </button>
        <button
          ref={ActionIconRef}
          onClick={() => setActionModalOpen(!actionModalOpen)}
          className="bg-slate-100 border-2 border-slate-300 hover:bg-slate-400 rounded-sm p-1 w-12 h-12 cursor-pointer"
        >
          <FontAwesomeIcon icon={faEllipsis} className="text-slate-600" />
        </button>
        {actionModalOpen ? <ActionModal ref={ActionModalRef} /> : null}
      </div>
    </div>
  );
};
