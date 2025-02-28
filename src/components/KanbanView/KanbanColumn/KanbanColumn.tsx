import { Card } from "../Card/Card";
import { AddTaskCard } from "../AddTaskCard/AddTaskCard";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";

interface ITask {
  id: number;
  title: string;
}

interface IKanbanColumn {
  title: string;
  tasks: ITask[];
}

export const KanbanColumn = ({ title, tasks }: IKanbanColumn) => {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <SortableContext
      items={tasks.length > 0 ? tasks : ["placeholder"]}
      id={title}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="flex flex-col justify-start items-center gap-2 w-[500px] my-4 px-4 py-2 min-h-[200px] bg-gray-300 rounded-2xl"
      >
        <div className=" w-full text-left font-bold">{title}</div>
        {tasks.map((task) => {
          if (!task) return;
          return <Card key={task.id} task={task} cardType="card" />;
        })}

        <AddTaskCard key={title} columnType={title} />
      </div>
    </SortableContext>
  );
};
