import { use } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";

// Context
import { DataContext } from "../../../context/DataContext";

export const Header = () => {
  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { sortedOrFilteredSettings, changeColumnSorted, customFields } =
    context;

  const sorted = sortedOrFilteredSettings.sorted;
  const caretDirectionUp = sortedOrFilteredSettings.sortedAscending;
  const columnSorted = sortedOrFilteredSettings.columnSorted;

  const activeColumnStyles = "text-white bg-slate-500";

  // Handles sorting when a column header is clicked.
  const handleColumnClick = (column: string) => {
    changeColumnSorted(column);
  };

  /*
  Mandatory Columns
  -Select all checkbox
  -Space for edit icon
  -Space for delete icon
  -Title
  -Status
  -Priority

  Additional columns created for custom fields.
  */
  return (
    <thead className="bg-blue-200">
      <tr>
        <th className="p-2 border-2 border-slate-300 w-2">
          <div className="flex flex-col justify-center items-center">
            <input type="checkbox" id="select-all" className="w-6 h-6" />
          </div>
        </th>
        <th className="p-2 border-2 border-slate-300"></th>
        <th className="p-2 border-2 border-slate-300"></th>
        <th
          onClick={() => handleColumnClick("title")}
          className={`${
            columnSorted === "title" ? activeColumnStyles : ""
          } p-2 border-2 border-slate-300 min-w-3xs text-slate-700 cursor-pointer active:bg-slate-500 active:text-white hover:bg-slate-500 hover:text-white focus:outline-none`}
        >
          <div className="flex flex-row justify-between items-center">
            <div>Title</div>
            {sorted && columnSorted === "title" ? (
              <FontAwesomeIcon
                icon={faCaretUp}
                className={`opacity-100 ${
                  caretDirectionUp ? "" : "rotate-180"
                }`}
              />
            ) : null}
          </div>
        </th>
        <th
          onClick={() => handleColumnClick("status")}
          className={`${
            columnSorted === "status" ? activeColumnStyles : ""
          } p-2 border-2 border-slate-300 min-w-48 text-left text-slate-700 cursor-pointer hover:bg-slate-500 hover:text-white`}
        >
          <div className="flex flex-row justify-between items-center">
            <div>Status</div>
            {sorted && columnSorted === "status" ? (
              <FontAwesomeIcon
                icon={faCaretUp}
                className={`opacity-100 ${
                  caretDirectionUp ? "" : "rotate-180"
                }`}
              />
            ) : null}
          </div>
        </th>
        <th
          onClick={() => handleColumnClick("priority")}
          className={` ${
            columnSorted === "priority" ? activeColumnStyles : ""
          } p-2 border-2 border-slate-300 min-w-36 text-left text-slate-700 cursor-pointer hover:bg-slate-500 hover:text-white`}
        >
          <div className="flex flex-row justify-between items-center">
            <div>Priority</div>
            {sorted && columnSorted === "priority" ? (
              <FontAwesomeIcon
                icon={faCaretUp}
                className={`opacity-100 ${
                  caretDirectionUp ? "" : "rotate-180"
                }`}
              />
            ) : null}
          </div>
        </th>
        {customFields.map((field) => {
          return (
            <th
              onClick={() => handleColumnClick(field.title)}
              className={` ${
                columnSorted === field.title ? activeColumnStyles : ""
              } p-2 border-2 border-slate-300 min-w-36 text-left text-slate-700 cursor-pointer hover:bg-slate-500 hover:text-white`}
            >
              <div className="flex flex-row justify-between items-center">
                <div>{field.title}</div>
                {sorted && columnSorted === field.title ? (
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    className={`opacity-100 ${
                      caretDirectionUp ? "" : "rotate-180"
                    }`}
                  />
                ) : null}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
