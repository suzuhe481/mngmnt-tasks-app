import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// Functions
import { formatStatus, formatPriority } from "./functions/formatData";

// Types
import { ITask } from "../../../types/types";

interface ITaskCard {
  task: ITask;
}

export const TaskCard = ({ task }: ITaskCard) => {
  const title = task.title;
  const status = formatStatus(task.status);
  const priority = formatPriority(task.priority);

  return (
    <tr className="bg-slate-30000">
      <td className="px-6 py-3 border-2 border-gray-300">
        <label htmlFor="select" className="h-full">
          <div className="flex flex-col justify-center items-center">
            <input type="checkbox" id="select" className="w-6 h-6" />
          </div>
        </label>
      </td>
      <td className="px-6 py-3 border-2 border-gray-300 text-center align-middle">
        <FontAwesomeIcon icon={faPencil} className="text-xl text-yellow-600" />
      </td>
      <td className="px-6 py-3 border-2 border-gray-300 text-center align-middle">
        <FontAwesomeIcon icon={faTrash} className="text-xl text-red-700" />
      </td>
      <td className="p-2 border-2 border-gray-300 text-left">{title}</td>
      <td className="p-2 border-2 border-gray-300 text-left">{status}</td>
      <td className="p-2 border-2 border-gray-300 text-left">{priority}</td>
    </tr>
  );
};
