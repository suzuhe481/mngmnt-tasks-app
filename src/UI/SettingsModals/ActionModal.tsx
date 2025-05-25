import { RefObject, use, useState } from "react";
import { DataContext } from "../../context/DataContext";

import NotificationModal from "../NotificationModal/NotificationModal";
import { AddNewColumnModal } from "../FormModals/AddNewColumnModal";
import { DeleteColumnModal } from "../FormModals/DeleteColumnModal";
import { DeleteBulkModal } from "../FormModals/DeleteBulkModal";
import { EditBulkModal } from "../FormModals/EditBulkModal";

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
  const [deleteBulkModalOpen, setDeleteBulkModalOpen] =
    useState<boolean>(false);
  const [editBulkModalOpen, setEditBulkModalOpen] = useState<boolean>(false);
  const [deleteDataModalOpen, setDeleteDataModalOpen] =
    useState<boolean>(false);

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const {
    importExampleData,
    addNewColumn,
    deleteColumn,
    customFields,
    resetFilters,
    deleteBulkTasks,
    editBulkTasks,
    tasksData,
    deleteAllData,
  } = context;

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

  // Calculates how many tasks are selected
  const tasksSelected = tasksData.reduce((acc, curr) => {
    return curr.selected ? acc + 1 : acc;
  }, 0);

  // Title and Description for Deleting Multiple Tasks Modal.
  const DeleteBulkTitle = "Delete Multiple Tasks";
  const DeleteBulkDesc = `This will PERMANENTLY delete ${
    tasksSelected === 1 ? `${tasksSelected} task.` : `${tasksSelected} tasks.`
  }`;

  // Opens the Delete Column Modal
  const openDeleteBulkModal = () => {
    setDeleteBulkModalOpen(true);
  };

  // Closes the Delete Column Modal
  const closeDeleteBulkModal = () => {
    setDeleteBulkModalOpen(false);
  };

  // Confirms removing a column
  const confirmDeleteBulk = () => {
    deleteBulkTasks();

    // Closes Action modal
    cancelAction();
  };

  // Title and Description for Editing Multiple Tasks Modal.
  const EditBulkTitle = "Edit Multiple Tasks";
  const EditBulkDesc = `This will PERMANENTLY edit ${
    tasksSelected === 1 ? `${tasksSelected} task.` : `${tasksSelected} tasks.`
  }`;

  // Opens the Delete Column Modal
  const openEditBulkModal = () => {
    setEditBulkModalOpen(true);
  };

  // Closes the Delete Column Modal
  const closeEditBulkModal = () => {
    setEditBulkModalOpen(false);
  };

  // Confirms removing a column
  const confirmEditBulk = (column: string, newValue: string) => {
    editBulkTasks(column, newValue);

    // Closes Action modal
    cancelAction();
  };

  // Title and Description for Deleting Column Modal.
  const DeleteColumnTitle = "Delete a column";
  const DeleteColumnDesc =
    "Pick a column to PERMANENTLY delete. This will also delete it's data from tasks.";

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

  // Resets filters and search settings
  const confirmResetFilters = () => {
    resetFilters();

    // Closes Action modal
    cancelAction();
  };

  // Title and Description for Import Data modal.
  const DeleteDataTitle = "DELETE ALL TASKS AND DATA?";
  const DeleteDataDesc =
    "Are you sure? This will PERMANENTLY DELETE ALL of your TASKS and STORED SETTINGS.";

  // Opens Import Data Modal
  const openDeleteDataModal = () => {
    setDeleteDataModalOpen(true);
  };

  // Closes Import Data Modal
  const closeDeleteDataModal = () => {
    setDeleteDataModalOpen(false);
  };

  // Deletes all data
  const confirmDeleteAllData = () => {
    deleteAllData();

    // Closes Action modal
    cancelAction();
  };

  return (
    <div
      ref={ref}
      className="animate-fadeInSlideDown absolute flex flex-col w-[200px] z-20 rounded-xl overflow-hidden bg-slate-100 border-1 border-slate-400 right-0 top-full mt-1 shadow-lg"
    >
      {importModalOpen ? (
        <NotificationModal
          title={ImportDataTitle}
          description={ImportDataDesc}
          confirmAction={confirmImport}
          cancelAction={closeImportModalModal}
        />
      ) : null}
      {addNewColumnModalOpen ? (
        <AddNewColumnModal
          title={NewColumnTitle}
          description={NewColumnDesc}
          confirmAction={confirmAddNewColumn}
          cancelAction={closeAddNewColumnModal}
        />
      ) : null}
      {deleteColumnModalOpen ? (
        <DeleteColumnModal
          title={DeleteColumnTitle}
          description={DeleteColumnDesc}
          confirmAction={confirmRemoveColumn}
          cancelAction={closeDeleteColumnModal}
          customFields={customFields}
        />
      ) : null}
      {deleteBulkModalOpen ? (
        <DeleteBulkModal
          title={DeleteBulkTitle}
          description={DeleteBulkDesc}
          confirmAction={confirmDeleteBulk}
          cancelAction={closeDeleteBulkModal}
        />
      ) : null}
      {editBulkModalOpen ? (
        <EditBulkModal
          title={EditBulkTitle}
          description={EditBulkDesc}
          confirmAction={confirmEditBulk}
          cancelAction={closeEditBulkModal}
        />
      ) : null}
      {deleteDataModalOpen ? (
        <NotificationModal
          title={DeleteDataTitle}
          description={DeleteDataDesc}
          confirmAction={confirmDeleteAllData}
          cancelAction={closeDeleteDataModal}
        />
      ) : null}
      <button
        onClick={confirmResetFilters}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600 bg-slate-100 hover:bg-blue-200`}
      >
        Reset Filters
      </button>
      <button
        onClick={openImportModalModal}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600 bg-slate-100 hover:bg-blue-200`}
      >
        Load Example Data
      </button>
      <button
        onClick={openDeleteBulkModal}
        disabled={tasksSelected < 1 ? true : false}
        className={`font-bold border-b-1 border-slate-400 py-4 text-slate-600 bg-red-200 hover:bg-red-400 ${
          tasksSelected < 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        Delete Multiple ({tasksSelected})
      </button>
      <button
        onClick={openEditBulkModal}
        disabled={tasksSelected < 1 ? true : false}
        className={`font-bold border-b-1 border-slate-400 py-4 text-slate-600 bg-yellow-200 hover:bg-yellow-400 ${
          tasksSelected < 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        Edit Multiple ({tasksSelected})
      </button>
      <button
        onClick={openAddNewColumnModal}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600 last:border-0 bg-slate-100 hover:bg-blue-200`}
      >
        Add New Column
      </button>
      <button
        onClick={openDeleteColumnModal}
        disabled={customFields[0] === undefined ? true : false}
        className={`font-bold border-b-1 border-slate-400 py-4 text-slate-600 last:border-0 bg-slate-100 hover:bg-blue-200 ${
          customFields[0] === undefined
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        Remove Column
      </button>
      <button
        onClick={openDeleteDataModal}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-black bg-red-400 hover:bg-red-600`}
      >
        DELETE ALL DATA!
      </button>
    </div>
  );
};

export default ActionModal;
