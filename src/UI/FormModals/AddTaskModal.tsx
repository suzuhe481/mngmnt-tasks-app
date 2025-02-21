import { useState, use, useEffect } from "react";
import { ITask } from "../../types/types";

import { CustomInputs } from "./CustomInputs";

import { DataContext } from "../../context/DataContext";

interface IModalProps {
  title: string;
  description?: string;
  confirmAction: (newTask: ITask) => void;
  cancelAction: () => void;
}

// Used in reduce
// Define the type for the custom fields object
interface CustomFieldObject {
  [key: string]: {
    type: string;
    value: string | number | boolean;
  };
}

// Define default values for each field
const DefaultFields = {
  text: { type: "text", value: "" },
  number: { type: "number", value: 0 },
  checkbox: { type: "checkbox", value: false },
};

const AddTaskModal = ({
  title,
  description = "",
  confirmAction,
  cancelAction,
}: IModalProps) => {
  const [newTask, setNewTask] = useState<ITask>({
    title: "",
    status: "not_started",
    priority: "none",
    customFields: {},
  });

  // This effect sets the default customField for the newTask state when on page load.
  useEffect(() => {
    // Creates default custom fields
    const initialCustomFields: CustomFieldObject = customFields.reduce(
      (acc, field) => {
        // Gets the default value for current field
        const defaultValue =
          DefaultFields[field.type as keyof typeof DefaultFields];

        // Assigns default value for current field
        if (defaultValue) {
          acc[field.title] = {
            type: field.type,
            value: defaultValue.value,
          };
        }

        return acc;
      },
      {} as CustomFieldObject
    );

    // Set the new task custom fields with the initial values
    setNewTask((prevTask) => ({
      ...prevTask,
      customFields: initialCustomFields,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { customFields } = context;

  // Handles form changes for new task
  const handleTaskChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  // Handle custom field change to update newTask state
  const handleCustomFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setNewTask((prevTask) => ({
      ...prevTask,
      customFields: {
        ...prevTask.customFields,
        [name]: { type, value: newValue },
      },
    }));
  };

  // Form submission to add new task.
  const ConfirmAddTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Prevents empty title
    if (newTask.title === "") {
      return;
    }

    // Adds task
    confirmAction(newTask);

    // Closes modal
    cancelAction();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full overflow-hidden">
      <div
        onClick={(event) => event.stopPropagation()}
        className="animate-fadeInSlideUp bg-white p-4 rounded-xl w-[90vw] lg:w-[50vw] max-h-[70vh] overflow-y-auto"
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
            customFields={newTask.customFields}
            handleCustomFieldChange={handleCustomFieldChange}
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
              onClick={ConfirmAddTask}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
