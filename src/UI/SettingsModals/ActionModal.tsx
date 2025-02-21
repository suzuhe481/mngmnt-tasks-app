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
