import { ITask } from "../../types/types";

import { CustomInputs } from "./CustomInputs";

interface IModalProps {
  title: string;
  description?: string;
  confirmAction: (newTask: ITask) => void;
  cancelAction: () => void;
  task: ITask;
}

const DeleteTaskModal = ({
  title,
  description = "",
  confirmAction,
  cancelAction,
  task,
}: IModalProps) => {
  // Form submission to delete a task.
  const ConfirmDeleteTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Calls function to delete task
    confirmAction(task);

    // Closes modal
    cancelAction();
  };

  return (
    <div
      onClick={cancelAction}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full overflow-hidden"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="animate-fadeInSlideUp bg-white p-4 rounded-xl w-[90vw] lg:w-[50vw] max-h-[70vh] overflow-y-auto"
      >
        <div>
          <div className="font-bold text-2xl">{title}</div>
          <div className="mb-2">{description}</div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="title" className="mb-1">
              Task
            </label>
            <textarea
              name="title"
              required
              rows={5}
              value={task.title}
              disabled={true}
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
              value={task.status}
              disabled={true}
              className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
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
              value={task.status}
              disabled={true}
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
            customFields={task.customFields}
            disabledInputs={true}
          />

          <div className="flex flex-row justify-end items-center w-full gap-4 mt-8 text-lg">
            <button
              className="animate-all px-2 py-1 border-2 border-sky-400 rounded-lg hover:brightness-50 cursor-pointer"
              onClick={cancelAction}
            >
              Cancel
            </button>
            <button
              className="animate-all bg-sky-400 text-white font-bold px-2 py-1 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={ConfirmDeleteTask}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
