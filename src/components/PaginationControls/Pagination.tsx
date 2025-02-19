import { use } from "react";

import { DataContext } from "../../context/DataContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const Pagination = () => {
  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  const {
    tasksData,
    currentPage,
    pageSize,
    changeCurrentPage,
    paginationLoading,
    setPaginationLoading,
  } = context;

  const totalTasks = tasksData.length;
  const totalPages = Math.ceil(totalTasks / pageSize);

  // Creates an array of pages starting at 1
  // Used to create the <option> tags for page selection.
  // When array is empty (new user), have a single page.
  const pagesArray =
    totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [1];

  const handlePageChange = (newPage: number) => {
    setPaginationLoading(true);
    changeCurrentPage(newPage);
  };

  return (
    <div className="flex flex-row justify-center items-center my-8 gap-4">
      <button
        disabled={paginationLoading || currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={`bg-slate-100 border-2 border-slate-300 hover:bg-blue-200 rounded-sm p-1 w-12 h-12  ${
          currentPage <= 1 ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-slate-600" />
      </button>
      <div>
        <select
          value={currentPage}
          name="size"
          id="size"
          required
          onChange={(event) => handlePageChange(Number(event.target.value))}
          className="border-2 border-slate-400 py-2 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
        >
          {pagesArray.map((page) => {
            return <option value={page}>Page {page}</option>;
          })}
        </select>
      </div>
      <button
        disabled={paginationLoading || currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`bg-slate-100 border-2 border-slate-300 hover:bg-blue-200 rounded-sm p-1 w-12 h-12  ${
          currentPage >= totalPages ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <FontAwesomeIcon icon={faArrowRight} className="text-slate-600" />
      </button>
    </div>
  );
};
