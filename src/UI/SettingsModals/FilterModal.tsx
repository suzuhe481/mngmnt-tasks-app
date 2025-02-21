import { RefObject, use } from "react";
import { DataContext } from "../../context/DataContext";

interface IFilterModalProps {
  ref: RefObject<HTMLDivElement | null>;
}

const FilterModal = ({ ref }: IFilterModalProps) => {
  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { sortedOrFilteredSettings, changeFilterType } = context;

  // Store the active button.
  const activeButton = sortedOrFilteredSettings.filterType;

  return (
    <div
      ref={ref}
      className="animate-fadeInSlideDown absolute flex flex-col w-[200px] rounded-xl overflow-hidden bg-slate-100 border-1 border-slate-400 right-0 top-full mt-1 shadow-lg"
    >
      <button
        onClick={() => changeFilterType("title")}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600 ${
          activeButton === "title"
            ? "text-white bg-slate-600"
            : "text-slate-600 bg-slate-100 hover:bg-blue-200"
        }`}
      >
        Title
      </button>
      <button
        onClick={() => changeFilterType("status")}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 text-slate-600 ${
          activeButton === "status"
            ? "text-white bg-slate-600"
            : "text-slate-600 bg-slate-100 hover:bg-blue-200"
        }`}
      >
        Status
      </button>
      <button
        onClick={() => changeFilterType("priority")}
        className={`font-bold cursor-pointer border-b-1 border-slate-400 py-4 last:border-0 text-slate-600 ${
          activeButton === "priority"
            ? "text-white bg-slate-600"
            : "text-slate-600 bg-slate-100 hover:bg-blue-200"
        }`}
      >
        Priority
      </button>
    </div>
  );
};

export default FilterModal;
