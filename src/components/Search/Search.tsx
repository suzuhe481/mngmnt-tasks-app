import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export const Search = () => {
  return (
    <div className="flex flex-row justify-center gap-4 my-2">
      <input
        type="text"
        placeholder="Search..."
        className="rounded-md border-2 border-slate-400 p-2 w-3/4 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
      />
      <button>
        <FontAwesomeIcon icon={faFilter} className="text-3xl text-slate-700" />
      </button>
    </div>
  );
};
