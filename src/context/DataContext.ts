import { createContext } from "react";

// Types
import { ITask, ISortedFilteredSettings, ICustomField } from "../types/types";

interface IDataContextProps {
  tasksData: ITask[] | [];
  displayedData: ITask[] | [];
  customFields: ICustomField[];

  addTask: (newTask: ITask) => void;
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
}

export const DataContext = createContext<IDataContextProps | undefined>(
  undefined
);
