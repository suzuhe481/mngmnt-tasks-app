import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ITask {
  id: number;
  title: string;
}

interface ICard {
  key: number;
  task: ITask;
  cardType: "card" | "overlay";
}

export const Card = (props: ICard) => {
  const { task, cardType } = props;

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

  const cardStyles = `${
    isDragging ? "opacity-70 bg-gray-400" : ""
  } bg-white p-2 w-full touch-none rounded-sm min-h-28 cursor-grab border-1 border-black shadow-xl`;

  const overlayStyles =
    "p-2 w-[90%] animate-pulse rotate-6 touch-none rounded-sm min-h-28 bg-white cursor-grab border-1 border-black shadow-xl";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${cardType === "card" ? cardStyles : overlayStyles}`}
    >
      <div>
        <div className="text-xl font-bold">{task.title}</div>
      </div>
    </div>
  );
};
