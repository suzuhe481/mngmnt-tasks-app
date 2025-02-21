interface IModalProps {
  title: string;
  description?: string;
  confirmAction: () => void;
  cancelAction: () => void;
}

const NotificationModal = ({
  title,
  description = "",
  confirmAction,
  cancelAction,
}: IModalProps) => {
  const ConfirmImportData = () => {
    // Confirms action given
    confirmAction();

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
        <form>
          <div className="font-bold text-2xl">{title}</div>
          <div>{description}</div>

          <div className="flex flex-row justify-end items-center w-full gap-4 mt-8 text-lg">
            <button
              className="animate-all px-2 py-1 border-2 border-sky-400 rounded-lg hover:brightness-50 cursor-pointer"
              onClick={cancelAction}
            >
              Cancel
            </button>
            <button
              className="animate-all bg-sky-400 text-white font-bold px-2 py-1 rounded-lg hover:brightness-75 cursor-pointer"
              onClick={ConfirmImportData}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
