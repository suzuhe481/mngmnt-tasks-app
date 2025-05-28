import { useState, use } from "react";

import AddTaskModal from "../../../UI/FormModals/AddTaskModal";
import EditTaskModal from "../../../UI/FormModals/EditTaskModal";

import { DataContext } from "../../../context/DataContext";

import { Card } from "../Card/Card";
import { AddTaskCard } from "../AddTaskCard/AddTaskCard";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";

import { ITask, INewTask } from "../../../types/types";

interface IKanbanColumn {
  title: string;
  tasks: ITask[];
}

export const KanbanColumn = ({ title, tasks }: IKanbanColumn) => {
  const [addTaskModalOpen, setAddTaskModalOpen] = useState<boolean>(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState<boolean>(false);
  const [columnToAddTask, setColumnToAddTask] = useState<string>("");
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);

  // Title for Add Task modal.
  const AddTaskTitle = "Add Task";

  // Opens Add Task Modal
  const openAddTaskModal = (columnType: string) => {
    setAddTaskModalOpen(true);
    setColumnToAddTask(columnType);
  };

  // Closes Add Task Modal
  const closeAddTaskModal = () => {
    setAddTaskModalOpen(false);
    setColumnToAddTask("");
  };

  // Confirms adding task
  const confirmAddTask = (newTask: INewTask) => {
    addTask(newTask);
  };

  // Title for Edit Task modal.
  const EditTaskTitle = "Edit Task";

  // Opens Edit Task Modal
  const openEditTaskModal = () => {
    setEditTaskModalOpen(true);
  };

  // Closes Edit Task Modal
  const closeEditTaskModal = () => {
    setEditTaskModalOpen(false);
    setTaskToEdit(null);
  };

  // Confirms editing a task
  const confirmEditTask = (editedTask: ITask) => {
    editTask(editedTask);
  };

  const { setNodeRef } = useDroppable({ id: title });

  const tasksToRender = tasks ? tasks : [];

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { addTask, editTask } = context;

  return (
    <SortableContext
      items={tasksToRender.length > 0 ? tasksToRender : ["placeholder"]}
      id={title}
      strategy={verticalListSortingStrategy}
    >
      {addTaskModalOpen ? (
        <AddTaskModal
          title={AddTaskTitle}
          confirmAction={confirmAddTask}
          cancelAction={closeAddTaskModal}
          columnToAddTask={columnToAddTask}
        />
      ) : null}
      {editTaskModalOpen && taskToEdit ? (
        <EditTaskModal
          title={EditTaskTitle}
          confirmAction={confirmEditTask}
          cancelAction={closeEditTaskModal}
          task={taskToEdit}
        />
      ) : null}
      <div
        ref={setNodeRef}
        className="flex flex-col justify-start items-center gap-2 w-[70vw] md:w-[500px] my-4 px-4 py-2 min-h-[200px] bg-gray-300 rounded-2xl"
      >
        <div className=" w-full text-left font-bold">{title}</div>
        {tasksToRender.map((task) => {
          if (!task) return;
          return (
            <Card
              key={task.id}
              task={task}
              cardType="card"
              openEditTaskModal={openEditTaskModal}
              setTaskToEdit={setTaskToEdit}
            />
          );
        })}

        <AddTaskCard
          key={title}
          columnType={title}
          openAddTaskModal={openAddTaskModal}
        />
      </div>
    </SortableContext>
  );
};
