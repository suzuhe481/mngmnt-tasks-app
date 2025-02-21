import { useState, useEffect, useRef, use } from "react";

import FilterModal from "../../UI/SettingsModals/FilterModal";

import { DataContext } from "../../context/DataContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export const Search = () => {
  const [search, setSearch] = useState<string>("");
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

  // Refs for Filter Icon and Modal
  const FilterModalRef = useRef<HTMLDivElement>(null);
  const FilterIconRef = useRef<HTMLButtonElement>(null);

  // Handles when clicking on screen to close Filter Modal.
  function handleClickOutsideMenu(event: MouseEvent) {
    const target = event.target as Node;

    // If icon is clicked while modal is open,
    // Modal remains open.
    // Reason: Without this, modal will flash when clicking the icon.
    if (
      filterModalOpen &&
      FilterIconRef.current &&
      FilterIconRef.current.contains(target)
    ) {
      // Does nothing
    }
    // If anywhere else on the page is clicked that isn't inside the menu, close the menu.
    else if (
      filterModalOpen &&
      FilterModalRef.current &&
      !FilterModalRef.current.contains(target)
    ) {
      setFilterModalOpen(false);
    }
  }

  // Adds/removes event listener for closing the FilterModal on outside button click.
  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener("mousedown", handleClickOutsideMenu, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  });

  // Updates the filteredText in settings.
  // Delay of 300ms after keystroke before running.
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      updateFilterText(search);
    }, 300);

    return () => clearTimeout(timeOutId);
    // updateFilterText cannot be included since it's declared after
    // this useEffect, and cannot be declared before it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const context = use(DataContext);

  // Checks for undefined context.
  if (!context) {
    return;
  }

  // Using context
  const { sortedOrFilteredSettings, updateFilterText } = context;

  const filterType =
    sortedOrFilteredSettings.filterType === "title"
      ? "Title"
      : sortedOrFilteredSettings.filterType === "status"
      ? "Status"
      : sortedOrFilteredSettings.filterType === "priority"
      ? "Priority"
      : "";

  return (
    <div className="relative flex z-10 flex-row justify-end items-center rounded-xl gap-4 my-2 right-4">
      <input
        type="text"
        placeholder={`Search by ${filterType}...`}
        onClick={() => setFilterModalOpen(false)}
        onChange={(event) => setSearch(event.target.value)}
        className="rounded-md border-2 border-slate-400 p-2 w-3/4 focus:outline-none focus:border-[#75C1FF] focus:shadow-[0_0_0_2px_#B3E0FF]"
      />
      <button ref={FilterIconRef}>
        <FontAwesomeIcon
          icon={faFilter}
          onClick={() => setFilterModalOpen(!filterModalOpen)}
          className={`animate-all text-3xl text-slate-400 hover:text-slate-700 cursor-pointer ${
            sortedOrFilteredSettings.sorted ? "text-slate-700" : ""
          }`}
        />
      </button>
      {filterModalOpen ? <FilterModal ref={FilterModalRef} /> : null}
    </div>
  );
};
