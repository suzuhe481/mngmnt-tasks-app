import { createContext } from "react";

// Types
import { ITask } from "../types/types";

interface IDataContextProps {
  tasksData: ITask[];
  addTask: (newTask: ITask) => void;
  editTask: (editedTask: ITask) => void;
}

export const DataContext = createContext<IDataContextProps | undefined>(
  undefined
);
