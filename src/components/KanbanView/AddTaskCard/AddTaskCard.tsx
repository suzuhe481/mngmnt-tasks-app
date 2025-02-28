interface IAddTaskCard {
  key: string;
  columnType: string;
}

export const AddTaskCard = ({ columnType }: IAddTaskCard) => {
  const addTask = () => {
    console.log(`Adding task to ${columnType}`);
  };

  return (
    <button
      onClick={addTask}
      className="bg-white p-2 w-[90%] rounded-sm min-h-16 cursor-pointer border-1 border-black shadow-xl"
    >
      Add New Task
    </button>
  );
};
