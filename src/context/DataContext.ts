import { createContext } from "react";

// Types
import {
  ITask,
  INewTask,
  IKanbanTasks,
  ISortedFilteredSettings,
  ICustomField,
} from "../types/types";

interface IDataContextProps {
  tasksData: ITask[] | [];
  setTasksData: React.Dispatch<React.SetStateAction<ITask[]>>;
  displayedData: ITask[] | [];
  customFields: ICustomField[];

  addTask: (newTask: INewTask) => void;
  editTask: (editedTask: ITask) => void;
  deleteTask: (deleteTask: ITask) => void;

  sortedOrFilteredSettings: ISortedFilteredSettings;
  changeColumnSorted: (newColumn: string) => void;
  changeFilterType: (newFilterType: string) => void;
  updateFilterText: (newText: string) => void;

  changePageSize: (newSize: number) => void;
  changeCurrentPage: (newPage: number) => void;
  currentPage: number;
  pageSize: number;
  paginationLoading: boolean;
  setPaginationLoading: React.Dispatch<React.SetStateAction<boolean>>;

  importExampleData: () => void;

  addNewColumn: (newColumn: ICustomField) => void;
  deleteColumn: (columnToDelete: string) => void;

  resetFilters: () => void;

  allTasksSelected: boolean;
  toggleSelectedTasks: () => void;
  toggleTask: (selectedTaskID: number) => void;
  deleteBulkTasks: () => void;
  editBulkTasks: (column: string, newValue: string) => void;

  kanbanView: boolean;
  toggleKanbanView: () => void;

  kanbanTasksData: IKanbanTasks;
  setKanbanTasksData: React.Dispatch<React.SetStateAction<IKanbanTasks>>;

  deleteAllData: () => void;
}

export const DataContext = createContext<IDataContextProps | undefined>(
  undefined
);
