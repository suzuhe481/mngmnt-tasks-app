import React, { useState, useEffect } from "react";
import { DataContext } from "./DataContext";
import { exampleData } from "../exampleData/data";

import { formatPriority } from "../components/TableView/TasksTable/components/functions/formatData";

// Types
import {
  ITask,
  INewTask,
  ISortedFilteredSettings,
  ICustomField,
  ICustomData,
  IKanbanTasks,
  ITaskStatus,
} from "../types/types";

interface IDataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<IDataProviderProps> = ({ children }) => {
  // Stores all unmodified original tasks.
  // Gets and sets tasksData from localStorage
  const [tasksData, setTasksData] = useState<ITask[] | []>(() => {
    const storedTasks = localStorage.getItem("tasksData");

    // Get tasks from localStorage
    if (storedTasks) {
      return JSON.parse(storedTasks);
    }
    // If no data, create empty ITask[]
    else {
      localStorage.setItem("tasksData", JSON.stringify([]));
      return [];
    }
  });

  const [kanbanTasksData, setKanbanTasksData] = useState<IKanbanTasks>(() => {
    const storedTasks = localStorage.getItem("kanbanTasksData");

    // Get tasks from localStorage
    if (storedTasks) {
      return JSON.parse(storedTasks);
    }
    // If no data, create empty ITask[]
    else {
      const emptyKanbanTasks: IKanbanTasks = {
        "Not Started": [],
        "In Progress": [],
        Completed: [],
      };

      localStorage.setItem("kanbanTasksData", JSON.stringify(emptyKanbanTasks));
      return emptyKanbanTasks;
    }
  });

  // Gets and sets schema for customFields in localStorage
  const [customFields, setCustomFields] = useState<ICustomField[]>(() => {
    const storedCustomFields = localStorage.getItem("customFields");

    // Get tasks from localStorage
    if (storedCustomFields) {
      return JSON.parse(storedCustomFields);
    }
    // If no data, create empty ICustomField[]
    else {
      localStorage.setItem("customFields", JSON.stringify([]));
      return [];
    }
  });

  // Stores some settings in localStorage
  // Sorts currentIndex
  // INDEX STARTS AT 1
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem("settings");

    // Get settings from localStorage
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    // No data, create default settings
    else {
      localStorage.setItem("settings", JSON.stringify({ currentIndex: 1 }));
      return { currentIndex: 1 };
    }
  });

  // Stores tasks to be displayed.
  // Can be filtered, sorted, and paginated.
  const [displayedData, setDisplayedData] = useState<ITask[] | []>([]);

  // Determines whether tasks are displayed in table view or kanban view.
  const [kanbanView, setKanbanView] = useState<boolean>(false);

  // Stores if all tasks have been selected.
  const [allTasksSelected, setAllTasksSelected] = useState<boolean>(false);

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
  const addTask = (task: INewTask) => {
    const mapStatusToITaskStatus = (status: string): ITaskStatus => {
      switch (status) {
        case "not_started":
        case "Not Started":
          return "Not Started";
        case "in_progress":
        case "In Progress":
          return "In Progress";
        case "completed":
        case "Completed":
          return "Completed";
        default:
          throw new Error(`Invalid status: ${status}`);
      }
    };

    // Adding id to task, increment id, save to state and localstorage
    const newTask: ITask = {
      id: settings.currentIndex,
      ...task,
    };

    newTask.id = settings.currentIndex;
    const newSettings = settings;
    newSettings.currentIndex++;
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));

    // Creates shallow copy of tasksData.
    const updatedTasksData: ITask[] = [...tasksData];

    // Adds task
    updatedTasksData.push(newTask);

    // Paginate using current settings before storing as displayed.
    const paginatedTasks = paginateTasks(
      updatedTasksData,
      currentPage,
      pageSize
    );

    newTask.status = mapStatusToITaskStatus(newTask.status);

    setDisplayedData(paginatedTasks);

    // Creates shallow copy of kanbanTasksData
    const updatedKanbanTasks: IKanbanTasks = { ...kanbanTasksData };

    // Adds task
    updatedKanbanTasks[newTask.status].push(newTask);

    // Save tasks
    setTasksData(updatedTasksData);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasksData));

    // Save kanban tasks
    setKanbanTasksData(updatedKanbanTasks);
    localStorage.setItem("kanbanTasksData", JSON.stringify(updatedKanbanTasks));
  };

  // Edits an existing task in tasksData.
  const editTask = (editTask: ITask) => {
    // Checks for id.
    if (editTask.id === undefined) {
      return;
    }

    // Updates the task at the id of editTask.id.
    const updatedTasksData = tasksData.map((task) => {
      return task.id === editTask.id ? { ...task, ...editTask } : task;
    });

    // Paginate using current settings before storing as displayed.
    const paginatedTasks = paginateTasks(
      updatedTasksData,
      currentPage,
      pageSize
    );

    setDisplayedData(paginatedTasks);

    // Saves tasks for table view
    setTasksData(updatedTasksData);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasksData));

    const updatedKanbanTasks: IKanbanTasks = {
      "Not Started": [],
      "In Progress": [],
      Completed: [],
    };

    // Creates updated kanbanTasksData
    Object.entries(kanbanTasksData).forEach(([status, tasks]) => {
      tasks.forEach((task: ITask) => {
        if (task.id === editTask.id) {
          // If status changed, push to the new status column
          updatedKanbanTasks[editTask.status].push({
            ...task,
            ...editTask,
          });
        } else {
          // Keep original task
          updatedKanbanTasks[status as ITaskStatus].push(task);
        }
      });
    });

    // Save kanban tasks
    setKanbanTasksData(updatedKanbanTasks);
    localStorage.setItem("kanbanTasksData", JSON.stringify(updatedKanbanTasks));
  };

  // Edits an existing task in tasksData.
  const deleteTask = (deleteTask: ITask) => {
    // Checks for id.
    if (deleteTask.id === undefined) {
      return;
    }

    // Updates the task at the id of deleteTask.id.
    const updatedTasksData = tasksData.filter((task) => {
      return task.id !== deleteTask.id;
    });

    // Paginate using current settings before storing as displayed.
    const paginatedTasks = paginateTasks(
      updatedTasksData,
      currentPage,
      pageSize
    );

    setDisplayedData(paginatedTasks);

    // Resets currentIndex to 1 if all tasks were deleted
    if (updatedTasksData.length === 0) {
      const newSettings = settings;
      newSettings.currentIndex = 1;
      setSettings(newSettings);
      localStorage.setItem("settings", JSON.stringify(newSettings));
    }

    setTasksData(updatedTasksData);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasksData));

    const updatedKanbanTasks: IKanbanTasks = {
      "Not Started": [],
      "In Progress": [],
      Completed: [],
    };

    // Creates updated kanbanTasksData with deleted task
    Object.entries(kanbanTasksData).forEach(([status, tasks]) => {
      tasks.forEach((task: ITask) => {
        if (task.id !== deleteTask.id) {
          updatedKanbanTasks[status as ITaskStatus].push(task);
        }
      });
    });

    // Save kanban tasks
    setKanbanTasksData(updatedKanbanTasks);
    localStorage.setItem("kanbanTasksData", JSON.stringify(updatedKanbanTasks));
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
      "Not Started": 1,
      "In Progress": 2,
      Completed: 3,
    };

    const sortedByStatus = sortedAndFilteredTasks.sort((a, b) => {
      return sortedAsc
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status];
    });

    return sortedByStatus;
  };

  // CustomField
  // Sorts text and boolean
  // Returns sorted tasksData based on text and customField.
  const sortByCustom = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    const sortedAsc = newSettings.sortedAscending;

    // Sort function for array
    const sortedByTitle = sortedAndFilteredTasks.sort((a, b) => {
      // Gets the fields to compare
      const aCustomField = a.customFields?.[newSettings.columnSorted].value;
      const bCustomField = b.customFields?.[newSettings.columnSorted].value;

      // If both fields are undefined, return 0. Don't change order.
      if (aCustomField === undefined && bCustomField === undefined) {
        return 0;
      }
      // If only 1 is undefined, sort
      if (aCustomField === undefined) return sortedAsc ? -1 : 1;
      if (bCustomField === undefined) return sortedAsc ? 1 : -1;

      // Normal sort between 2 defined values
      if (aCustomField < bCustomField) return sortedAsc ? -1 : 1;
      if (aCustomField > bCustomField) return sortedAsc ? 1 : -1;
      return 0;
    });

    return sortedByTitle;
  };

  // CustomField
  // Returns sorted taskData based on number and customField.
  const sortByNumber = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    const sortedAsc = newSettings.sortedAscending;

    const sortedByNumber = sortedAndFilteredTasks.sort((a, b) => {
      const aCustomField = a.customFields?.[newSettings.columnSorted]?.value;
      const bCustomField = b.customFields?.[newSettings.columnSorted]?.value;

      // If both fields are undefined, return 0. Don't change order.
      if (aCustomField === undefined && bCustomField === undefined) {
        return 0;
      }
      // If only 1 is undefined, sort
      if (aCustomField === undefined) return sortedAsc ? -1 : 1;
      if (bCustomField === undefined) return sortedAsc ? 1 : -1;

      // Parse numbers
      const aParsed = parseFloat(aCustomField as string);
      const bParsed = parseFloat(bCustomField as string);

      // Normal sort between 2 defined values
      if (aParsed < bParsed) return sortedAsc ? -1 : 1;
      if (aParsed > bParsed) return sortedAsc ? 1 : -1;
      return 0;
    });

    return sortedByNumber;
  };

  // Returns sorted tasksData based on sorting setting.
  // Current newSettings and tasks are passed as arguments.
  const runSort = (
    newSettings: ISortedFilteredSettings,
    sortedAndFilteredTasks: ITask[]
  ) => {
    // Gets the column and it's type
    const column = newSettings.columnSorted;
    const columnType = customFields.find(
      (field) => field.title === column
    )?.type;

    // Runs the proper sort based on the column selected
    switch (true) {
      case column === "title":
        return (
          sortByTitle(newSettings, sortedAndFilteredTasks) ||
          sortedAndFilteredTasks
        );
      case column === "priority":
        return (
          sortByPriority(newSettings, sortedAndFilteredTasks) ||
          sortedAndFilteredTasks
        );
      case column === "status":
        return (
          sortByStatus(newSettings, sortedAndFilteredTasks) ||
          sortedAndFilteredTasks
        );
      case customFields.some((field) => field.title === column):
        if (columnType === "text") {
          return (
            sortByCustom(newSettings, sortedAndFilteredTasks) ||
            sortedAndFilteredTasks
          );
        } else if (columnType === "number") {
          return (
            sortByNumber(newSettings, sortedAndFilteredTasks) ||
            sortedAndFilteredTasks
          );
        } else {
          return (
            sortByCustom(newSettings, sortedAndFilteredTasks) ||
            sortedAndFilteredTasks
          );
        }
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
      const statusMatch = task.status.toLowerCase().includes(filterText);
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

    // Stops when tasks are empty.
    // Prevents setting a 0 value for newCurrentPage.
    if (tasksData.length === 0) {
      return;
    }

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

  // Imports example data
  const importExampleData = () => {
    const mapStatusToITaskStatus = (status: string): ITaskStatus => {
      switch (status) {
        case "not_started":
        case "Not Started":
          return "Not Started";
        case "in_progress":
        case "In Progress":
          return "In Progress";
        case "completed":
        case "Completed":
          return "Completed";
        default:
          throw new Error(`Invalid status: ${status}`);
      }
    };

    const mappingTasksForKanban = (tasks: ITask[]) => {
      const kanbanTasks: IKanbanTasks = {
        "Not Started": [],
        "In Progress": [],
        Completed: [],
      };

      tasks.forEach((task: ITask) => {
        kanbanTasks[mapStatusToITaskStatus(task.status)].push(task);
      });

      return kanbanTasks;
    };

    const mappedExampleData = exampleData.map((task) => ({
      ...task,
      status: mapStatusToITaskStatus(task.status),
    }));

    setTasksData(mappedExampleData);

    const mappedKanbanTasks = mappingTasksForKanban(mappedExampleData);

    setKanbanTasksData(mappedKanbanTasks);
    localStorage.setItem("kanbanTasksData", JSON.stringify(mappedKanbanTasks));

    // Resets custom fields
    setCustomFields([]);

    // Saving new index based on example data
    const newSettings = settings;
    newSettings.currentIndex = mappedExampleData.length + 1;
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));

    // Paginate using current settings before storing as displayed.
    const paginatedTasks = paginateTasks(tasksData, currentPage, pageSize);
    setDisplayedData(paginatedTasks);
  };

  // Adds a new column.
  // Updates every task with the new column with appropriate default value
  // Updates customField state and localStorage.
  const addNewColumn = (newColumn: ICustomField) => {
    // Object storing default columns by type
    const DefaultColumns = {
      text: { type: "text", value: "" },
      number: { type: "number", value: 0 },
      checkbox: { type: "checkbox", value: false },
    };

    // Update each task's customFields
    const updatedTasks = tasksData.map((task) => {
      const updatedTask = { ...task };
      // Adds custom field if it doesn't exist.
      if (updatedTask.customFields === undefined) {
        updatedTask.customFields = {};
      }

      // Creates default column data
      const newColumnData: ICustomData = {
        type: newColumn.type,
        value:
          DefaultColumns[newColumn.type as keyof typeof DefaultColumns].value,
      };

      // Updates task with new column
      updatedTask.customFields[newColumn.title] = newColumnData;

      return updatedTask;
    });

    // Saves updated customFields in state and localStorage
    const updatedCustomFields = customFields;
    updatedCustomFields.push(newColumn);
    setCustomFields(updatedCustomFields);
    localStorage.setItem("customFields", JSON.stringify(updatedCustomFields));

    // Saves tasks in state and localStorage
    setTasksData(updatedTasks);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasks));
  };

  // Removes a given custom column
  // Updates every task by removing the column's data from it's customFields
  // Updates customField state and localStorage.
  const deleteColumn = (columnToDelete: string) => {
    // Update each task's customFields
    const updatedTasks = tasksData.map((task) => {
      const updatedTask = { ...task };
      // Adds custom field if it doesn't exist.
      if (updatedTask.customFields === undefined) {
        updatedTask.customFields = {};
      }

      // Deletes column from task
      delete updatedTask.customFields[columnToDelete];

      return updatedTask;
    });

    // Updates the customFields by removing column
    const updatedCustomFields = customFields.filter(
      (field) => field.title !== columnToDelete
    );

    // Saves updated customFields in state and localStorage
    setCustomFields(updatedCustomFields);
    localStorage.setItem("customFields", JSON.stringify(updatedCustomFields));

    // Saves tasks in state and localStorage
    setTasksData(updatedTasks);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasks));
  };

  // Resets filters to default values
  const resetFilters = () => {
    const resetFilters = {
      sorted: false,
      sortedAscending: false,
      columnSorted: "",
      filtered: false,
      filterType: "title",
      filteredText: "",
    };

    setSortedOrFilteredSettings(resetFilters);

    sortAndFilter(resetFilters);
  };

  // Toggles every tasks's selected state between true/false
  const toggleSelectedTasks = () => {
    // Sets all task's selected to false.
    if (allTasksSelected) {
      const updatedTasks = tasksData.map((task) => {
        return { ...task, selected: false };
      });

      setTasksData(updatedTasks);
      setAllTasksSelected(false);

      setTasksData(updatedTasks);
      localStorage.setItem("tasksData", JSON.stringify(updatedTasks));
    } else {
      // Sets all tasks's selected to true.
      const updatedTasks = tasksData.map((task) => {
        return { ...task, selected: true };
      });

      setTasksData(updatedTasks);
      setAllTasksSelected(true);

      setTasksData(updatedTasks);
      localStorage.setItem("tasksData", JSON.stringify(updatedTasks));
    }
  };

  // Toggles a single task's selected property between true/false
  const toggleTask = (selectedTaskID: number) => {
    const updatedTasks = tasksData.map((task) => {
      return task.id === selectedTaskID
        ? { ...task, selected: !task.selected }
        : task;
    });

    setTasksData(updatedTasks);
    setAllTasksSelected(false);

    setTasksData(updatedTasks);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasks));
  };

  // Deletes all selected tasks
  const deleteBulkTasks = () => {
    // Filters out selected tasks.
    const updatedTasksData = tasksData
      .filter((task) => {
        return !task.selected;
      })
      // Sets all task's selected to false
      .map((task) => {
        return { ...task, selected: false };
      });

    const deletedTaskIds = tasksData
      .filter((task) => {
        return task.selected;
      })
      .map((task) => {
        return task.id;
      });

    setAllTasksSelected(false);

    // Resets currentIndex to 1 if all tasks were deleted
    if (updatedTasksData.length === 0) {
      const newSettings = settings;
      newSettings.currentIndex = 1;
      setSettings(newSettings);
      localStorage.setItem("settings", JSON.stringify(newSettings));
    }

    // Paginate using current settings before storing as displayed.
    const paginatedTasks = paginateTasks(
      updatedTasksData,
      currentPage,
      pageSize
    );

    setDisplayedData(paginatedTasks);

    setTasksData(updatedTasksData);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasksData));

    const updatedKanbanTasks: IKanbanTasks = {
      "Not Started": [],
      "In Progress": [],
      Completed: [],
    };

    Object.entries(kanbanTasksData).forEach(([status, tasks]) => {
      updatedKanbanTasks[status as ITaskStatus] = tasks.filter(
        (task: ITask) => !deletedTaskIds.includes(task.id)
      );
    });

    setKanbanTasksData(updatedKanbanTasks);
    localStorage.setItem("kanbanTasksData", JSON.stringify(updatedKanbanTasks));
  };

  // Edits all selected tasks on the given with the given value
  const editBulkTasks = (column: string, newValue: string) => {
    // Changing only the selected tasks to the the given newValue on the given column
    // Unselects task
    const updatedTasksData = tasksData.map((task) => {
      return task.selected
        ? { ...task, selected: false, [column]: newValue }
        : task;
    });

    // IDs of tasks that will be edited
    const editedTaskIds = tasksData
      .filter((task) => {
        return task.selected;
      })
      .map((task) => {
        return task.id;
      });

    setAllTasksSelected(false);

    // Paginate using current settings before storing as displayed.
    const paginatedTasks = paginateTasks(
      updatedTasksData,
      currentPage,
      pageSize
    );

    setDisplayedData(paginatedTasks);

    setTasksData(updatedTasksData);
    localStorage.setItem("tasksData", JSON.stringify(updatedTasksData));

    const updatedKanbanTasks: IKanbanTasks = {
      "Not Started": [],
      "In Progress": [],
      Completed: [],
    };

    Object.entries(kanbanTasksData).forEach(([status, tasks]) => {
      tasks.forEach((task: ITask) => {
        if (editedTaskIds.includes(task.id)) {
          const updatedTask = {
            ...task,
            selected: false,
            [column]: newValue,
          };

          const targetStatus =
            column === "status"
              ? (newValue as ITaskStatus)
              : (task.status as ITaskStatus);

          updatedKanbanTasks[targetStatus].push(updatedTask);
        } else {
          updatedKanbanTasks[status as ITaskStatus].push(task);
        }
      });
    });

    setKanbanTasksData(updatedKanbanTasks);
    localStorage.setItem("kanbanTasksData", JSON.stringify(updatedKanbanTasks));
  };

  // Toggles switching between table and kanban view
  const toggleKanbanView = () => {
    setKanbanView((prev) => !prev);
  };

  // Deletes all data from localStorage and resets state.
  const deleteAllData = () => {
    setTasksData([]);
    setKanbanTasksData({
      "Not Started": [],
      "In Progress": [],
      Completed: [],
    });
    setSettings({ currentIndex: 1 });
    setCustomFields([]);

    localStorage.removeItem("tasksData");
    localStorage.removeItem("kanbanTasksData");
    localStorage.removeItem("settings");
    localStorage.removeItem("customFields");
  };

  // useEffect to sync tasksData with localStorage
  useEffect(() => {
    if (tasksData && tasksData.length > 0) {
      localStorage.setItem("tasksData", JSON.stringify(tasksData));

      // Paginate using current settings before storing as displayed.
      const paginatedTasks = paginateTasks(tasksData, currentPage, pageSize);
      setDisplayedData(paginatedTasks);
    } else {
      setDisplayedData([]);
    }
  }, [tasksData, kanbanTasksData, currentPage, pageSize, settings]);

  return (
    <DataContext.Provider
      value={{
        tasksData,
        setTasksData,
        kanbanTasksData,
        setKanbanTasksData,
        displayedData,
        addTask,
        editTask,
        deleteTask,
        sortedOrFilteredSettings,
        changeColumnSorted,
        changeFilterType,
        updateFilterText,
        changePageSize,
        changeCurrentPage,
        currentPage,
        pageSize,
        paginationLoading,
        setPaginationLoading,
        importExampleData,
        addNewColumn,
        deleteColumn,
        customFields,
        resetFilters,
        allTasksSelected,
        toggleSelectedTasks,
        toggleTask,
        deleteBulkTasks,
        editBulkTasks,
        kanbanView,
        toggleKanbanView,
        deleteAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
