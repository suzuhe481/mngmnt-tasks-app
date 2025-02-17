import React, { useState } from "react";
import { DataContext } from "./DataContext";
import { exampleData } from "../exampleData/data";

// Types
import { ITask } from "../types/types";

interface IDataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<IDataProviderProps> = ({ children }) => {
  // const [tasksData, setTasksData] = useState<ITask[]>([]);
  const [tasksData, setTasksData] = useState<ITask[]>(exampleData);

  // Stores length of tasks to use as id.
  // Currently using exampleData
  // INDEX STARTS AT 1
  const [currentIndex, setCurrentIndex] = useState(exampleData.length);
  // const [currentIndex, setCurrentIndex] = useState<number>(1);

  // Adds a new task to tasksData.
  const addTask = (newTask: ITask) => {
    // Adding id to task
    newTask.id = currentIndex;
    setCurrentIndex((prevIndex) => prevIndex + 1);

    // console.log(`Adding new task:`);
    // console.log(newTask);

    // Creates shallow copy of tasksData.
    const updatedTasksData: ITask[] = [...tasksData];

    // Adds task
    updatedTasksData.push(newTask);

    setTasksData(updatedTasksData);
  };

  // Edits an existing task in tasksData.
  const editTask = (editTask: ITask) => {
    // Checks for id.
    if (editTask.id === undefined) {
      return;
    }

    // console.log(`Editting task:`);
    // console.log(editTask);

    // Updates the task at the id of editTask.id.
    const updatedTasksData = tasksData.map((task) => {
      return task.id === editTask.id ? { ...task, ...editTask } : task;
    });

    setTasksData(updatedTasksData);
  };

  return (
    <DataContext.Provider value={{ tasksData, addTask, editTask }}>
      {children}
    </DataContext.Provider>
  );
};
