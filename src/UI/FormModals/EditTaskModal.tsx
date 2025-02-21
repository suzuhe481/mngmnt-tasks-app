import { useState } from "react";
import { ITask } from "../../types/types";

import { CustomInputs } from "./CustomInputs";

interface IModalProps {
  title: string;
  description?: string;
  confirmAction: (newTask: ITask) => void;
  cancelAction: () => void;
  task: ITask;
}

const EditTaskModal = ({
  title,
  description = "",
  confirmAction,
  cancelAction,
  task,
}: IModalProps) => {
  const [editedTask, setEditedTask] = useState<ITask>({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    customFields: task.customFields,
  });

  // Handles form changes for new task
  const handleTaskChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setEditedTask({
      ...editedTask,
      [name]: value,
    });
  };

  // Handles custom field change to update newTask state
  const handleCustomFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setEditedTask((prevTask) => ({
      ...prevTask,
      customFields: {
        ...prevTask.customFields,
        [name]: { type, value: newValue },
      },
    }));
  };

  // Form submission to edit a task.
  const ConfirmEditTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Prevents empty title
    if (editedTask.title === "") {
      return;
    }

    // Edit task
    confirmAction(editedTask);

    // Closes modal
    cancelAction();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full overflow-hidden">
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white p-4 rounded-xl w-[90vw] lg:w-[50vw]"
      >
        <form>
          <div className="font-bold text-2xl">{title}</div>
          <div>{description}</div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="title" className="mb-1">
              Task
            </label>
            <textarea
              name="title"
              required
              rows={5}
              value={editedTask.title}
              onChange={handleTaskChange}
              className="rounded-md border-2 border-slate-400 py-3 px-4 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            />
          </div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="status" className="mb-1">
              Status
            </label>
            <select
              name="status"
              id="status"
              required
              value={editedTask.status}
              onChange={handleTaskChange}
              className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="priority" className="mb-1">
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              required
              value={editedTask.status}
              onChange={handleTaskChange}
              className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            >
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <CustomInputs
            customFields={editedTask.customFields}
            handleCustomFieldChange={handleCustomFieldChange}
          />

          <div className="flex flex-row justify-end items-center w-full gap-4 mt-8 text-lg">
            <button
              className="px-2 py-1 border-2 border-sky-400 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={cancelAction}
            >
              Cancel
            </button>
            <button
              className="bg-sky-400 text-white font-bold px-2 py-1 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={ConfirmEditTask}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
