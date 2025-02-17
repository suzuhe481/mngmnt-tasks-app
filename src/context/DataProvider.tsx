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
  const [currentIndex, setCurrentIndex] = useState(exampleData.length);
  // const [currentIndex, setCurrentIndex] = useState<number>(0);

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

  return (
    <DataContext.Provider value={{ tasksData, addTask }}>
      {children}
    </DataContext.Provider>
  );
};
