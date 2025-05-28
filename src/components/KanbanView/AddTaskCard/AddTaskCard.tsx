interface IAddTaskCard {
  key: string;
  columnType: string;
  openAddTaskModal: (columnType: string) => void;
}

export const AddTaskCard = ({ columnType, openAddTaskModal }: IAddTaskCard) => {
  const confirmAddTask = () => {
    openAddTaskModal(columnType);
  };

  return (
    <button
      onClick={confirmAddTask}
      className="bg-white p-2 w-[90%] rounded-sm min-h-16 cursor-pointer border-1 border-black shadow-xl"
    >
      Add New Task
    </button>
  );
};
