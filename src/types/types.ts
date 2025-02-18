export interface ITask {
  id?: number;
  title: string;
  status: string;
  priority: string;
}

export interface ISortedFilteredSettings {
  sorted: boolean;
  sortedAscending: boolean;
  columnSorted: string;
  filtered: boolean;
  filterType: string;
  filteredText: string;
}
