// Returns the formatted status.
// eg. not_started => "Not Started"
export function formatStatus(status: string) {
  const statusMap: { [key: string]: string } = {
    not_started: "Not Started",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return statusMap[status];
}

// Returns the formatted priority.
// eg. medium => "Medium"
export function formatPriority(priority: string) {
  const priorityMap: { [key: string]: string } = {
    none: "None",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return priorityMap[priority];
}
