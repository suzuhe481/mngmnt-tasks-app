import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ITask } from "../../../types/types";

interface ICard {
  key: number;
  task: ITask | { id: number; title: string; status: string; priority: string };
  cardType: "card" | "overlay";
  openEditTaskModal?: () => void;
  setTaskToEdit?: React.Dispatch<React.SetStateAction<ITask | null>>;
}

export const Card = (props: ICard) => {
  const { task, cardType, openEditTaskModal, setTaskToEdit } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Checks if the given task is an ITask
  function isITask(
    task: { id: number; title: string; status: string; priority: string } | null
  ): task is ITask {
    return (
      task != null &&
      typeof task.id === "number" &&
      typeof task.title === "string" &&
      ["Not Started", "In Progress", "Completed"].includes(task.status) &&
      typeof task.priority === "string"
    );
  }

  // Confirms opening the edit task modal.
  // Checks if the openEditTaskModal and setTaskToEdit functions exist and if the task is an ITask.
  const confirmOpenEditTaskModal = () => {
    if (!openEditTaskModal || !setTaskToEdit || !isITask(task)) {
      return;
    }

    setTaskToEdit(task);
    openEditTaskModal();
  };

  const cardStyles = `${
    isDragging ? "opacity-70 bg-gray-400" : ""
  } bg-white p-2 w-full animate-all hover:scale-[103%] touch-none rounded-sm min-h-28 cursor-grab border-1 border-black shadow-xl`;

  const overlayStyles =
    "p-2 w-[90%] animate-pulse rotate-6 touch-none rounded-sm min-h-28 bg-white cursor-grab border-1 border-black shadow-xl";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${cardType === "card" ? cardStyles : overlayStyles}`}
      onClick={confirmOpenEditTaskModal}
    >
      <div>
        <div className="text-xl font-bold">{task.title}</div>
      </div>
    </div>
  );
};
