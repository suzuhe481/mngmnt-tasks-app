import React, { useState } from "react";
import { DataContext } from "./DataContext";
import { exampleData } from "../exampleData/data";

import {
  formatStatus,
  formatPriority,
} from "../components/TasksTable/components/functions/formatData";

// Types
import { ITask, ISortedFilteredSettings } from "../types/types";

interface IDataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<IDataProviderProps> = ({ children }) => {
  // const [tasksData, setTasksData] = useState<ITask[]>([]);
  // Stores all of the original tasks.
  const [tasksData, setTasksData] = useState<ITask[]>(exampleData);

  // Stores tasks to be displayed.
  // Can be filtered, sorted, and paginated.
  const [displayedData, setDisplayedData] = useState<ITask[] | []>([]);

  // Stores length of tasks to use as id.
  // Currently using exampleData
  // INDEX STARTS AT 1
  const [currentIndex, setCurrentIndex] = useState(exampleData.length);
  // const [currentIndex, setCurrentIndex] = useState<number>(1);

  // Pagination variables
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);

  // Stores settings for how to sort or filter through the data.
  // Can only sorted through 1 column at a time
  const [sortedOrFilteredSettings, setSortedOrFilteredSettings] =
    useState<ISortedFilteredSettings>({
      sorted: false,
      sortedAscending: false,
      columnSorted: "",
      filtered: false,
      filterType: "title",
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

    // New settings are passed to use for current sorting and textFiltering.
    sortAndFilter(newSettings);
  };

  // Returns sorted tasksData based on title column and direction.
  const sortByTitle = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    const sortedAsc = newSettings.sortedAscending;

    // Sort function for array
    const sortedByTitle = sortedAndFilteredTasks.sort((a, b) => {
      if (a.title < b.title) return sortedAsc ? -1 : 1;
      if (a.title > b.title) return sortedAsc ? 1 : -1;
      return 0;
    });

    return sortedByTitle;
  };

  // Returns sorted tasksData based on priority column.
  const sortByPriority = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    const sortedAsc = newSettings.sortedAscending;

    const priorityOrder: { [key: string]: number } = {
      none: 1,
      low: 2,
      medium: 3,
      high: 4,
      urgent: 5,
    };

    const sortedByPriority = sortedAndFilteredTasks.sort((a, b) => {
      return sortedAsc
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return sortedByPriority;
  };

  // Returns sorted tasksData based on status column.
  const sortByStatus = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    const sortedAsc = newSettings.sortedAscending;

    const statusOrder: { [key: string]: number } = {
      not_started: 1,
      in_progress: 2,
      completed: 3,
    };

    const sortedByStatus = sortedAndFilteredTasks.sort((a, b) => {
      return sortedAsc
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status];
    });

    return sortedByStatus;
  };

  // Returns sorted tasksData based on sorting setting.
  // Current newSettings and tasks are passed as arguments.
  const runSort = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    const column = newSettings.columnSorted;

    switch (column) {
      case "title":
        return (
          sortByTitle(newSettings, sortedAndFilteredTasks) ||
          sortedAndFilteredTasks
        );
      case "priority":
        return (
          sortByPriority(newSettings, sortedAndFilteredTasks) ||
          sortedAndFilteredTasks
        );
      case "status":
        return (
          sortByStatus(newSettings, sortedAndFilteredTasks) ||
          sortedAndFilteredTasks
        );
    }

    // Returns default array to avoid returning undefined
    return sortedAndFilteredTasks;
  };

  // Changes the filter type.
  const changeFilterType = (newFilterType: string) => {
    // New settings.
    // Updates only the filter type settings.
    const newSettings = {
      ...sortedOrFilteredSettings,
      filterType: newFilterType,
      filtered: true,
    };

    // Updates settings
    setSortedOrFilteredSettings(newSettings);

    // Runs sort and filter based on new settings
    sortAndFilter(newSettings);
  };

  // Updates the text string used for filtering.
  const updateFilterText = (newText: string) => {
    // New settings.
    // Updates only the filter type settings.
    const newSettings = {
      ...sortedOrFilteredSettings,
      filteredText: newText,
      filtered: true,
    };

    // Updates settings
    setSortedOrFilteredSettings(newSettings);

    // Runs sort and filter based on new settings
    sortAndFilter(newSettings);
  };

  // Filters tasks based on provided text.
  // Current newSettings are passed
  const runTextFilter = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    const filterText = newSettings.filteredText.toLowerCase();
    const filterType = newSettings.filterType;

    const filteredTasks = sortedAndFilteredTasks.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(filterText);
      const statusMatch = formatStatus(task.status)
        .toLowerCase()
        .includes(filterText);
      const priorityMatch = formatPriority(task.priority)
        .toLowerCase()
        .includes(filterText);

      // Return true if any of the conditions match
      return filterType === "title"
        ? titleMatch
        : filterType === "status"
        ? statusMatch
        : filterType === "priority"
        ? priorityMatch
        : titleMatch;
    });

    // Empty array to avoid returning undefined
    return filteredTasks || sortedAndFilteredTasks;
  };

  // Sorts and filters copy of tasks through runSort and runTextFilter
  const sortAndFilter = (newSettings: ISortedFilteredSettings) => {
    // Creates shallow copy of tasksData.
    let sortedAndFilteredTasks: ITask[] = [...tasksData];

    // Sorts if true
    if (newSettings.sorted) {
      sortedAndFilteredTasks = runSort(newSettings, sortedAndFilteredTasks);
    }

    // Filters if text isn't empty
    if (newSettings.filteredText !== "") {
      sortedAndFilteredTasks = runTextFilter(
        newSettings,
        sortedAndFilteredTasks
      );
    }

    const paginatedSortedFiltered = paginateTasks(
      sortedAndFilteredTasks,
      currentPage,
      pageSize
    );

    setDisplayedData(paginatedSortedFiltered);
  };

  // Changes page size.
  // Adjusts current page if user is on a higher page number than is available.
  // Paginates data with new values.
  const changePageSize = (newSize: number) => {
    setPageSize(newSize);

    const totalTasks = tasksData.length;
    const totalPages = Math.ceil(totalTasks / newSize);

    const newCurrentPage = currentPage > totalPages ? totalPages : currentPage;
    setCurrentPage(newCurrentPage);

    const paginatedTasks = paginateTasks(tasksData, newCurrentPage, newSize);

    setDisplayedData(paginatedTasks);
  };

  // Changes current page.
  // Adjusts page to not go under 1 or greater than the totalPages.
  // Paginates data with new values.
  const changeCurrentPage = (newPage: number) => {
    // Prevents running when loading.
    if (paginationLoading) {
      return;
    }
    const totalTasks = tasksData.length;
    const totalPages = Math.ceil(totalTasks / pageSize);
    let newCurrentPage = newPage;

    // Calculates if newPage is within bounds of totalPages.
    if (newPage < 1) {
      newCurrentPage = 1;
    } else if (newPage > totalPages) {
      newCurrentPage = totalPages;
    }
    setCurrentPage(newCurrentPage);

    const paginatedTasks = paginateTasks(tasksData, newCurrentPage, pageSize);

    setDisplayedData(paginatedTasks);
    setPaginationLoading(false);
  };

  // Returns paginated tasks.
  const paginateTasks = (tasks: ITask[], newPage: number, newSize: number) => {
    const tasksSkipped = (newPage - 1) * newSize;

    return tasks.slice(tasksSkipped, tasksSkipped + newSize);
  };

  return (
    <DataContext.Provider
      value={{
        tasksData,
        sortedFilteredData,
        addTask,
        editTask,
        deleteTask,
        sortedOrFilteredSettings,
        changeColumnSorted,
        changeFilterType,
        updateFilterText,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
