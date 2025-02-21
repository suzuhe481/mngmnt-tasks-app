import { useState } from "react";

import { ICustomField } from "../../types/types";

interface IModalProps {
  title: string;
  description?: string;
  confirmAction: (columnToDelete: string) => void;
  cancelAction: () => void;
  customFields: ICustomField[];
}

export const DeleteColumnModal = ({
  title,
  description = "",
  confirmAction,
  cancelAction,
  customFields,
}: IModalProps) => {
  // Sets the state to the first value in customFields if it is not undefined
  const [columnToDelete, setColumnToDelete] = useState<string>(() => {
    return customFields[0] !== undefined ? customFields[0].title : "";
  });

  // Form submission to delete a column
  const ConfirmDeleteColumn = () => {
    confirmAction(columnToDelete);

    // Closes form
    cancelAction();
  };

  // Handles switching between columns
  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setColumnToDelete(value);
  };

  return (
    <div
      onClick={cancelAction}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full overflow-hidden"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white p-4 rounded-xl w-[90vw] lg:w-[50vw]"
      >
        <div>
          <div className="font-bold text-2xl">{title}</div>
          <div className="mb-2">{description}</div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="priority" className="mb-1">
              Column
            </label>
            <select
              name="priority"
              id="priority"
              required
              value={columnToDelete}
              onChange={handleColumnChange}
              className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
            >
              {customFields.map((field) => {
                return (
                  <option value={field.title}>
                    {field.title}: {field.type}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-row justify-end items-center w-full gap-4 mt-8 text-lg">
            <button
              className="px-2 py-1 border-2 border-sky-400 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={cancelAction}
            >
              Cancel
            </button>
            <button
              className="bg-sky-400 text-white font-bold px-2 py-1 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={ConfirmDeleteColumn}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
