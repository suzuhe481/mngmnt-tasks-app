import { useState, use } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import EditTaskModal from "../../../../UI/FormModals/EditTaskModal";
import DeleteTaskModal from "../../../../UI/FormModals/DeleteTaskModal";

// Functions
import { formatPriority } from "./functions/formatData";

// Context
import { DataContext } from "../../../../context/DataContext";

// Types
import { ITask } from "../../../../types/types";

interface ITaskCard {
  task: ITask;
}

export const TaskCard = ({ task }: ITaskCard) => {
  const [editTaskModalOpen, setEditTaskModalOpen] = useState<boolean>(false);
  const [deleteTaskModalOpen, setDeleteTaskModalOpen] =
    useState<boolean>(false);

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { editTask, deleteTask, customFields, toggleTask } = context;

  const title = task.title;
  const status = task.status;
  const priority = formatPriority(task.priority);

  // Title for Edit Task modal.
  const EditTaskTitle = "Edit Task";

  // Opens Edit Task Modal
  const openEditTaskModal = () => {
    setEditTaskModalOpen(true);
  };

  // Closes Edit Task Modal
  const closeEditTaskModal = () => {
    setEditTaskModalOpen(false);
  };

  // Confirms editing a task
  const confirmEditTask = (editedTask: ITask) => {
    editTask(editedTask);
  };

  // Title for Delete Task modal.
  const DeleteTaskTitle = "Delete Task";
  const DeleteTaskDescription =
    "Are you sure you want to PERMANENTELY delete this task? ";

  // Opens Delete Task Modal
  const openDeleteTaskModal = () => {
    setDeleteTaskModalOpen(true);
  };

  // Closes Delete Task Modal
  const closeDeleteTaskModal = () => {
    setDeleteTaskModalOpen(false);
  };

  // Confirms deleting a task
  const confirmDeleteTask = (deletedTask: ITask) => {
    deleteTask(deletedTask);
  };

  return (
    <tr className="bg-slate-30000">
      {editTaskModalOpen ? (
        <EditTaskModal
          title={EditTaskTitle}
          confirmAction={confirmEditTask}
          cancelAction={closeEditTaskModal}
          task={task}
        />
      ) : null}
      {deleteTaskModalOpen ? (
        <DeleteTaskModal
          title={DeleteTaskTitle}
          description={DeleteTaskDescription}
          confirmAction={confirmDeleteTask}
          cancelAction={closeDeleteTaskModal}
          task={task}
        />
      ) : null}
      <td className="px-6 py-3 border-2 border-gray-300">
        <label htmlFor="select" className="h-full">
          <div className="flex flex-col justify-center items-center">
            <input
              type="checkbox"
              id="select"
              className="w-6 h-6 cursor-pointer"
              checked={task.selected ? task.selected : false}
              onClick={() => toggleTask(task.id ? task.id : 0)}
            />
          </div>
        </label>
      </td>
      <td className="px-6 py-3 border-2 border-gray-300 text-center align-middle">
        <FontAwesomeIcon
          icon={faPencil}
          onClick={openEditTaskModal}
          className="animate-all text-xl text-yellow-400 cursor-pointer hover:text-yellow-800"
        />
      </td>
      <td className="px-6 py-3 border-2 border-gray-300 text-center align-middle">
        <FontAwesomeIcon
          icon={faTrash}
          onClick={openDeleteTaskModal}
          className="animate-all text-xl text-red-400 cursor-pointer hover:text-red-900"
        />
      </td>
      <td className="p-2 border-2 border-gray-300 text-left">{title}</td>
      <td className="p-2 border-2 border-gray-300 text-left">{status}</td>
      <td className="p-2 border-2 border-gray-300 text-left">{priority}</td>
      {customFields.map((field) => {
        if (task.customFields === undefined) return;

        const customFieldData = task.customFields[field.title];

        if (!customFieldData) return null;

        const valueToDisplay =
          typeof customFieldData.value === "boolean"
            ? customFieldData.value.toString()
            : customFieldData.value;

        return (
          <td className="p-2 border-2 border-gray-300 text-left">
            {valueToDisplay}
          </td>
        );
      })}
    </tr>
  );
};
