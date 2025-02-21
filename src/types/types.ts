// Record is used so now the title of a field is a key in
// the object, and it's value is ICustomData
export interface ITask {
  id?: number;
  title: string;
  status: string;
  priority: string;
  customFields?: Record<string, ICustomData>;
}

export interface ISortedFilteredSettings {
  sorted: boolean;
  sortedAscending: boolean;
  columnSorted: string;
  filtered: boolean;
  filterType: string;
  filteredText: string;
}
