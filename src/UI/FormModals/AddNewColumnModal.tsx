import { useState, use } from "react";

import { DataContext } from "../../context/DataContext";

import { ICustomField } from "../../types/types";

interface IModalProps {
  title: string;
  description?: string;
  confirmAction: (newColumn: ICustomField) => void;
  cancelAction: () => void;
}

export const AddNewColumnModal = ({
  title,
  description = "",
  confirmAction,
  cancelAction,
}: IModalProps) => {
  const [newColumn, setNewColumn] = useState<ICustomField>({
    title: "",
    type: "text",
  });

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { customFields } = context;

  // Handles input change for title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setNewColumn({
      ...newColumn,
      title: value,
    });
  };

  // Handles column type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setNewColumn({
      ...newColumn,
      type: value,
    });
  };

  // Confirms adding a new column
  const ConfirmAddColumn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Prevents empty column name
    if (newColumn.title === "") {
      return;
    }

    // Prevent submitting an already existing column.
    if (customFields.some((field) => field.title === newColumn.title)) {
      return;
    }

    confirmAction(newColumn);

    cancelAction();
  };

  return (
    <div
      onClick={cancelAction}
      className="fixed inset-0 flex items-center justify-center z-50 w-full overflow-hidden"
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div
        onClick={(event) => event.stopPropagation()}
        className="animate-fadeInSlideUp bg-white p-4 rounded-xl w-[90vw] lg:w-[50vw] max-h-[70vh] overflow-y-auto z-10"
      >
        <form>
          <div className="font-bold text-2xl">{title}</div>
          <div>{description}</div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="name" className="mb-1">
              Column Name
            </label>
            <input
              name="name"
              required
              onChange={handleTitleChange}
              className="rounded-md border-2 border-slate-400 py-3 px-4 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            />
          </div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="type" className="mb-1">
              Type
            </label>
            <select
              name="type"
              id="type"
              required
              onChange={handleTypeChange}
              className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="checkbox">Check Box</option>
            </select>
          </div>

          <div className="flex flex-row justify-end items-center w-full gap-4 mt-8 text-lg">
            <button
              className="animate-all px-2 py-1 border-2 border-sky-400 rounded-lg hover:brightness-50 cursor-pointer"
              onClick={cancelAction}
            >
              Cancel
            </button>
            <button
              className="animate-all bg-sky-400 text-white font-bold px-2 py-1 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={ConfirmAddColumn}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
