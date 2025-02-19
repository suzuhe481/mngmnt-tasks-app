import { RefObject, use, useState } from "react";
import { DataContext } from "../../context/DataContext";

interface IFilterModalProps {
  ref: RefObject<HTMLDivElement | null>;
}

const ActionModal = ({ ref }: IFilterModalProps) => {
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { importExampleData } = context;

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
      <button
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600  bg-slate-100 hover:bg-blue-200`}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ActionModal;
