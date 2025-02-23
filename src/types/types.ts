// Used inside tasksData
export interface ICustomData {
  type: string;
  value: string | number | boolean;
}

// Used for editing values in custom columns
export interface ICustomValue {
  title: string;
  data: ICustomData;
}

// Used for adding new columns
export interface ICustomField {
  title: string;
  type: string;
}

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
