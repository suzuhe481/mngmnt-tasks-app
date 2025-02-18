import { createContext } from "react";

// Types
import { ITask, ISortedFilteredSettings } from "../types/types";

interface IDataContextProps {
  tasksData: ITask[];
  sortedFilteredData: ITask[] | [];
  addTask: (newTask: ITask) => void;
  editTask: (editedTask: ITask) => void;
  deleteTask: (deleteTask: ITask) => void;
  sortedOrFilteredSettings: ISortedFilteredSettings;
  changeColumnSorted: (newColumn: string) => void;
}

export const DataContext = createContext<IDataContextProps | undefined>(
  undefined
);
