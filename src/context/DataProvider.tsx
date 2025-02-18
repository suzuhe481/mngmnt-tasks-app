import React, { useState } from "react";
import { DataContext } from "./DataContext";
import { exampleData } from "../exampleData/data";

// Types
import { ITask, ISortedFilteredSettings } from "../types/types";

interface IDataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<IDataProviderProps> = ({ children }) => {
  // const [tasksData, setTasksData] = useState<ITask[]>([]);
  const [tasksData, setTasksData] = useState<ITask[]>(exampleData);
  const [sortedFilteredData, setSortedFilteredData] = useState<ITask[] | []>(
    []
  );

  // Stores length of tasks to use as id.
  // Currently using exampleData
  // INDEX STARTS AT 1
  const [currentIndex, setCurrentIndex] = useState(exampleData.length);
  // const [currentIndex, setCurrentIndex] = useState<number>(1);

  // Stores settings for how to sort or filter through the data.
  // Can only sorted through 1 column at a time
  const [sortedOrFilteredSettings, setSortedOrFilteredSettings] =
    useState<ISortedFilteredSettings>({
      sorted: false,
      sortedAscending: false,
      columnSorted: "",
      filtered: false,
      filteredText: "",
    });

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

  // Edits an existing task in tasksData.
  const deleteTask = (deleteTask: ITask) => {
    // Checks for id.
    if (deleteTask.id === undefined) {
      return;
    }

    // console.log(`Deleting task:`);
    // console.log(deleteTask);

    // Updates the task at the id of editTask.id.
    const updatedTasksData = tasksData.filter((task) => {
      return task.id !== deleteTask.id;
    });

    setTasksData(updatedTasksData);
  };

  // Updates sorting/filtering settings when a column is clicked.
  const changeColumnSorted = (newColumn: string) => {
    // Checks if the clicked column the same or a new column.
    // Used to adjust the defaul sort to ascending for a new column.
    const columnSwitched =
      newColumn === sortedOrFilteredSettings.columnSorted ? false : true;

    // New settings.
    // Updates only the sort settings.
    const newSettings = {
      ...sortedOrFilteredSettings,
      sorted: true,
      sortedAscending: columnSwitched
        ? true
        : !sortedOrFilteredSettings.sortedAscending,
      columnSorted: newColumn,
    };

    // Updates settings
    setSortedOrFilteredSettings(newSettings);
    // New settings are passed to use for current sorting.
    runSort(newSettings);
  };

  // Sorts tasksData based on title column and direction.
  const sortByTitle = (newSettings: ISortedFilteredSettings) => {
    const sortedAsc = newSettings.sortedAscending;

    // Sort function for array
    const sortedByTitle = tasksData.sort((a, b) => {
      if (a.title < b.title) return sortedAsc ? -1 : 1;
      if (a.title > b.title) return sortedAsc ? 1 : -1;
      return 0;
    });

    setSortedFilteredData(sortedByTitle);
  };

  // Sorts tasksData based on priority column.
  const sortByPriority = (newSettings: ISortedFilteredSettings) => {
    const sortedAsc = newSettings.sortedAscending;

    const priorityOrder: { [key: string]: number } = {
      none: 1,
      low: 2,
      medium: 3,
      high: 4,
      urgent: 5,
    };

    const sortedByPriority = tasksData.sort((a, b) => {
      return sortedAsc
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setSortedFilteredData(sortedByPriority);
  };

  // Sorts tasksData based on status column.
  const sortByStatus = (newSettings: ISortedFilteredSettings) => {
    const sortedAsc = newSettings.sortedAscending;

    const statusOrder: { [key: string]: number } = {
      not_started: 1,
      in_progress: 2,
      completed: 3,
    };

    const sortedByStatus = tasksData.sort((a, b) => {
      return sortedAsc
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status];
    });

    setSortedFilteredData(sortedByStatus);
  };

  // Sorts tasksData based on sorting setting.
  // Current newSettings are passed
  const runSort = (newSettings: ISortedFilteredSettings) => {
    const column = newSettings.columnSorted;

    switch (column) {
      case "title":
        sortByTitle(newSettings);
        break;
      case "priority":
        sortByPriority(newSettings);
        break;
      case "status":
        sortByStatus(newSettings);
        break;
    }
  };

  return (
    <DataContext.Provider value={{ tasksData, addTask, editTask, deleteTask }}>
      {children}
    </DataContext.Provider>
  );
};
