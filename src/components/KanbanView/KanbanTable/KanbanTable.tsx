import { useState } from "react";
import { KanbanColumn } from "../KanbanColumn/KanbanColumn";
import { Card } from "../Card/Card";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  closestCorners,
  UniqueIdentifier,
} from "@dnd-kit/core";

import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

interface ITask {
  id: number;
  title: string;
}

interface IKanbanTasks {
  "Not Started": ITask[];
  "In Progress": ITask[];
  Completed: ITask[];
}

export const KanbanTable = () => {
  // Storing tasks in state.
  const [tasks, setTasks] = useState<IKanbanTasks>({
    "Not Started": [
      { id: 1, title: "task 1" },
      { id: 2, title: "somethin to do" },
      { id: 3, title: "experiment" },
    ],
    "In Progress": [
      { id: 4, title: "testing" },
      { id: 5, title: "task 5" },
      { id: 6, title: "another" },
    ],
    Completed: [
      { id: 7, title: "new thing" },
      { id: 8, title: "thing" },
      { id: 9, title: "old thing" },
    ],
  });

  // Stores the id of the task card being dragged and its column
  const [draggedTask, setDraggedTask] = useState<number | null>(null);

  // Sensors for dndkit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Given the id of a task, return the column the task belongs to.
  const findContainer = (id: UniqueIdentifier) => {
    if (id in tasks) {
      return id;
    }

    return Object.keys(tasks).find((key) =>
      tasks[key as keyof IKanbanTasks].some((task) => task.id === Number(id))
    );
  };

  // Returns a task based in the given id.
  const findTaskById = (id: number) => {
    console.log(id);

    for (const column in tasks) {
      const task = tasks[column as keyof IKanbanTasks].find(
        (task) => task.id === id
      );

      if (task) {
        return task;
      }
    }

    return { id: -1, title: "" };
  };

  // Drag start
  // Stores the id of the dragged task in state.
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const { id } = active;

    setDraggedTask(Number(id));
  };

  // Drag over
  // Reorders tasks in the tasks state when switching between columns.
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;
    const overId = over.id;

    if (overId === null || active.id in tasks) {
      return;
    }

    // Finding the column titles (eg. "Not Started, "In Progress")
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);

    // Return if no active or over container.
    if (!activeContainer || !overContainer) {
      return;
    }

    // Task is switching columns
    if (activeContainer !== overContainer) {
      // Gets the array of tasks for the column being switched to
      const overItems = tasks[overContainer as keyof IKanbanTasks];

      // Get indices for task being dragged(active) and task underneath(over).
      const activeIndex = tasks[
        activeContainer as keyof IKanbanTasks
      ].findIndex((task) => task.id === Number(active.id));
      const overIndex = tasks[overContainer as keyof IKanbanTasks].findIndex(
        (task) => task.id === Number(overId)
      );

      // Determines the new index of where the task should be placed depending on it's position in the array.
      let newIndex: number;
      if (overId in tasks) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      // Updates dragged task to new column
      const updatedTasks = {
        ...tasks,
        [activeContainer]: [
          ...tasks[activeContainer as keyof IKanbanTasks].filter(
            (task) => task.id !== active.id
          ),
        ],
        [overContainer]: [
          ...tasks[overContainer as keyof IKanbanTasks].slice(0, newIndex),
          tasks[activeContainer as keyof IKanbanTasks][activeIndex],
          ...tasks[overContainer as keyof IKanbanTasks].slice(
            newIndex,
            tasks[overContainer as keyof IKanbanTasks].length
          ),
        ],
      };

      setTasks(updatedTasks);
    }
  };

  // Handles sorting when a task it dropped into a column.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    const overId = over.id;

    // Finding the column titles (eg. "Not Started, "In Progress")
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    // Return if no active or over container.
    if (!activeContainer || !overContainer) {
      return;
    }

    // Get indices for task being dragged(active) and task underneath(over).
    const activeIndex = tasks[activeContainer as keyof IKanbanTasks].findIndex(
      (task) => task.id === Number(active.id)
    );
    const overIndex = tasks[overContainer as keyof IKanbanTasks].findIndex(
      (task) => task.id === Number(overId)
    );

    // Updates and sets tasks if task is dragged to a new spot.
    if (activeIndex !== overIndex) {
      // Updates tasks
      const updatedTasks = {
        ...tasks,
        [overContainer]: arrayMove(
          tasks[overContainer as keyof IKanbanTasks],
          activeIndex,
          overIndex
        ),
      };

      // Sets tasks
      setTasks(updatedTasks);
    }

    setDraggedTask(null);
  }

  return (
    <div className="flex flex-row justify-center min-w-screen">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-row gap-4 w-[90vw] justify-center items-start">
          <KanbanColumn title="Not Started" tasks={tasks["Not Started"]} />
          <KanbanColumn title="In Progress" tasks={tasks["In Progress"]} />
          <KanbanColumn title="Completed" tasks={tasks.Completed} />
          <DragOverlay>
            {draggedTask ? (
              <Card
                key={draggedTask}
                task={findTaskById(draggedTask)}
                cardType="overlay"
              />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};
