import { useState } from "react";

interface IModalProps {
  title: string;
  description?: string;
  confirmAction: (column: string, newValue: string) => void;
  cancelAction: () => void;
}

export const EditBulkModal = ({
  title,
  description = "",
  confirmAction,
  cancelAction,
}: IModalProps) => {
  const [column, setColumnPicked] = useState("status"); // Default starting values
  const [newValue, setNewValue] = useState("not_started"); // Default starting values

  const ConfirmEditBulk = () => {
    confirmAction(column, newValue);

    // Closes the form
    cancelAction();
  };

  const StatusForm = () => {
    return (
      <div className="flex flex-col w-full mb-6">
        <label htmlFor="status" className="mb-1">
          Status
        </label>
        <select
          name="status"
          id="status"
          required
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    );
  };

  const PriorityForm = () => {
    return (
      <div className="flex flex-col w-full mb-6">
        <label htmlFor="priority" className="mb-1">
          Priority
        </label>
        <select
          name="priority"
          id="priority"
          required
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
        >
          <option value="none">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    );
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
        <form>
          <div className="font-bold text-2xl">{title}</div>
          <div>{description}</div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="title" className="mb-1">
              Changing...
            </label>
            <select
              name="status"
              id="status"
              required
              value={column}
              onChange={(e) => setColumnPicked(e.target.value)}
              className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            >
              <option value="status">Status</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {column === "status" ? (
            <StatusForm />
          ) : column === "priority" ? (
            <PriorityForm />
          ) : null}

          <div className="flex flex-row justify-end items-center w-full gap-4 mt-8 text-lg">
            <button
              className="animate-all px-2 py-1 border-2 border-sky-400 rounded-lg hover:brightness-50 cursor-pointer"
              onClick={cancelAction}
            >
              Cancel
            </button>
            <button
              className="animate-all bg-sky-400 text-white font-bold px-2 py-1 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={ConfirmEditBulk}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
