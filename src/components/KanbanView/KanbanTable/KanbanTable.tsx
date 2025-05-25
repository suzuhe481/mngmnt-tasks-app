import { useState, use } from "react";
import { KanbanColumn } from "../KanbanColumn/KanbanColumn";
import { Card } from "../Card/Card";

import { DataContext } from "../../../context/DataContext";

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

import { IKanbanTasks, ITaskStatus } from "../../../types/types";

export const KanbanTable = () => {
  const context = use(DataContext);

  if (!context) {
    throw new Error("DataContext is not provided");
  }

  const { kanbanTasksData, setKanbanTasksData, tasksData, setTasksData } =
    context;

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
    if (id in kanbanTasksData) {
      return id;
    }

    return Object.keys(kanbanTasksData).find((key) =>
      kanbanTasksData[key as keyof IKanbanTasks].some(
        (task) => task.id === Number(id)
      )
    );
  };

  // Returns a task based in the given id.
  const findTaskById = (id: number) => {
    for (const column in kanbanTasksData) {
      const task = kanbanTasksData[column as keyof IKanbanTasks].find(
        (task) => task.id === id
      );

      if (task) {
        return task;
      }
    }

    return { id: -1, title: "", status: "", priority: "" };
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

    if (overId === null || active.id in kanbanTasksData) {
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
      const overItems = kanbanTasksData[overContainer as keyof IKanbanTasks];

      // Get indices for task being dragged(active) and task underneath(over).
      const activeIndex = kanbanTasksData[
        activeContainer as keyof IKanbanTasks
      ].findIndex((task) => task.id === Number(active.id));
      const overIndex = kanbanTasksData[
        overContainer as keyof IKanbanTasks
      ].findIndex((task) => task.id === Number(overId));

      // Determines the new index of where the task should be placed depending on it's position in the array.
      let newIndex: number;
      if (overId in kanbanTasksData) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      // Updates dragged task to new column
      const updatedTasks = {
        ...kanbanTasksData,
        [activeContainer]: [
          ...kanbanTasksData[activeContainer as keyof IKanbanTasks].filter(
            (task) => task.id !== active.id
          ),
        ],
        [overContainer]: [
          ...kanbanTasksData[overContainer as keyof IKanbanTasks].slice(
            0,
            newIndex
          ),
          kanbanTasksData[activeContainer as keyof IKanbanTasks][activeIndex],
          ...kanbanTasksData[overContainer as keyof IKanbanTasks].slice(
            newIndex,
            kanbanTasksData[overContainer as keyof IKanbanTasks].length
          ),
        ],
      };

      // Saves tasks for kanbanData in state and localStorage
      setKanbanTasksData(updatedTasks);
      localStorage.setItem("kanbanTasksData", JSON.stringify(updatedTasks));

      // Updates the task's status for tasksData in state and localstorage
      const updatedTasksData = tasksData.map((task) => {
        return task.id === active.id
          ? { ...task, status: overContainer as ITaskStatus }
          : task;
      });
      setTasksData(updatedTasksData);
      localStorage.setItem("tasksData", JSON.stringify(updatedTasksData));
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
    const activeIndex = kanbanTasksData[
      activeContainer as keyof IKanbanTasks
    ].findIndex((task) => task.id === Number(active.id));
    const overIndex = kanbanTasksData[
      overContainer as keyof IKanbanTasks
    ].findIndex((task) => task.id === Number(overId));

    // Updates and sets tasks if task is dragged to a new spot.
    if (activeIndex !== overIndex) {
      // Updates tasks
      const updatedTasks = {
        ...kanbanTasksData,
        [overContainer]: arrayMove(
          kanbanTasksData[overContainer as keyof IKanbanTasks],
          activeIndex,
          overIndex
        ),
      };

      // Saves tasks for kanbanData in state and localStorage
      setKanbanTasksData(updatedTasks);
      localStorage.setItem("kanbanTasksData", JSON.stringify(updatedTasks));

      // Updates the task's status for tasksData in state and localstorage
      const updatedTasksData = tasksData.map((task) => {
        return task.id === active.id
          ? { ...task, status: overContainer as ITaskStatus }
          : task;
      });
      setTasksData(updatedTasksData);
      localStorage.setItem("tasksData", JSON.stringify(updatedTasksData));
    }

    setDraggedTask(null);
  }

  return (
    <div className="flex flex-row px-4 overflow-x-auto min-w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-row gap-8">
          <KanbanColumn
            title="Not Started"
            tasks={kanbanTasksData["Not Started"]}
          />
          <KanbanColumn
            title="In Progress"
            tasks={kanbanTasksData["In Progress"]}
          />
          <KanbanColumn title="Completed" tasks={kanbanTasksData.Completed} />
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
