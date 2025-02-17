import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export const Actions = () => {
  return (
    <div className="flex flex-row justify-end items-center gap-2 py-2 mx-4">
      <button className="bg-blue-400 h-12 rounded-sm px-4 font-bold text-white">
        New Task
      </button>
      <button className="bg-slate-100 border-2 border-slate-300 rounded-sm p-1 w-12 h-12">
        <FontAwesomeIcon icon={faEllipsis} className="text-slate-600" />
      </button>
    </div>
  );
};
