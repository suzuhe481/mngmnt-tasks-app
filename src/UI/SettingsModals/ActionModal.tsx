import { RefObject, use, useState } from "react";
import { DataContext } from "../../context/DataContext";

import NotificationModal from "../NotificationModal/NotificationModal";
import { AddNewColumnModal } from "../FormModals/AddNewColumnModal";
import { DeleteColumnModal } from "../FormModals/DeleteColumnModal";

import { ICustomField } from "../../types/types";

interface IFilterModalProps {
  ref: RefObject<HTMLDivElement | null>;
  cancelAction: () => void;
}

const ActionModal = ({ ref, cancelAction }: IFilterModalProps) => {
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [addNewColumnModalOpen, setAddNewColumnModalOpen] =
    useState<boolean>(false);
  const [deleteColumnModalOpen, setDeleteColumnModalOpen] =
    useState<boolean>(false);

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { importExampleData, addNewColumn, deleteColumn, customFields } =
    context;

  // Title and Description for Import Data modal.
  const ImportDataTitle = "Import Example Data?";
  const ImportDataDesc =
    "Are you sure? This will PERMANENTLY overwrite your current tasks.";

  // Opens Import Data Modal
  const openImportModalModal = () => {
    setImportModalOpen(true);
  };

  // Closes Import Data Modal
  const closeImportModalModal = () => {
    setImportModalOpen(false);
  };

  // Confirms adding task
  const confirmImport = () => {
    importExampleData();
    setImportModalOpen(false);

    // Closes Action modal
    cancelAction();
  };

  // Title and Description for Adding Column modal.
  const NewColumnTitle = "Add New Custom Column";
  const NewColumnDesc = "New columns can be text, a number, or a checkbox.";

  // Opens Add New Column Modal
  const openAddNewColumnModal = () => {
    setAddNewColumnModalOpen(true);
  };

  // Closes Add New Column Modal
  const closeAddNewColumnModal = () => {
    setAddNewColumnModalOpen(false);
  };

  // Confirms adding new column
  const confirmAddNewColumn = (newColumn: ICustomField) => {
    // Add new column
    addNewColumn(newColumn);

    // Closes Action modal
    cancelAction();
  };

  // Title and Description for Deleting Column Modal.
  const DeleteColumnTitle = "Delete a column";
  const DeleteColumnDesc =
    "Pick a column to PERMANENTLY delete. This will alos delete it's data from tasks.";

  // Opens the Delete Column Modal
  const openDeleteColumnModal = () => {
    setDeleteColumnModalOpen(true);
  };

  // Closes the Delete Column Modal
  const closeDeleteColumnModal = () => {
    setDeleteColumnModalOpen(false);
  };

  // Confirms removing a column
  const confirmRemoveColumn = (columnToDelete: string) => {
    deleteColumn(columnToDelete);
  };

  return (
    <div
      ref={ref}
      className="absolute flex flex-col w-[200px] z-20 rounded-xl overflow-hidden bg-slate-100 border-1 border-slate-400 right-0 top-full mt-1 shadow-lg"
    >
      {importModalOpen ? (
        <NotificationModal
          title={ImportDataTitle}
          description={ImportDataDesc}
          confirmAction={confirmImport}
          cancelAction={closeImportModalModal}
        />
      ) : null}
      <button
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600  bg-slate-100 hover:bg-blue-200`}
      >
        Reset Filters
      </button>
      <button
        onClick={openImportModalModal}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600 last:border-0 bg-slate-100 hover:bg-blue-200`}
      >
        Load Example Data
      </button>
    </div>
  );
};

export default ActionModal;
