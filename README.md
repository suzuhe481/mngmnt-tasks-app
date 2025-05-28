# MNGMNT Tasks App

This is MNGMNT. An application used to help organize your tasks, inspired by other task managers such as Jira and Trello.

The clever origin of the name is that it's just the word "Management" without the vowels.

[Live Demo](https://mngmnt.hectorsuazo.com)

## Features

- Task organization in a table or Kanban display.
- Add, edit, delete tasks.
- Sort and filter through tasks by column or text.
- Paginate through tasks to easily find what you're looking for.
- Refreshed the page or closed your browser? Your data is stored locally and stays there until you return.
- Load example data to see what it looks like to be really busy.
- Create your own custom columns. Add and remove columns and they can be text, numbers, or a checkbox.
- Reset the filters back to their default.
- Want to change multiple tasks quickly? Now you can edit/deletes multiple tasks. Bulk editing only works on the Status and Priority properties.
- Subtle animations.
- Drag task cards in Kanban view for organization and easily change your task's status.

## Run Locally

Clone the project.

Go to the project directory.

```bash
  cd mngmnt-tasks-app
```

Install dependencies.

```bash
  npm install
```

Start the server with either one of these three.

```bash
  npm run dev

  npm run preview

  npm run host
```

- **dev**: Runs the development version of the project.
- **preview**: Runs the preview of the production version of the project.
- **host**: Runs the developer version of the project in your LAN, so that it can be accessed via your IP address on other devices, such as mobile phones or other computers.

## Releases

### 1.2.0

- Can now toggle between table view and Kanban view.
- Reset the filters back to their default.
- Want to change multiple tasks quickly? Now you can edit/deletes multiple tasks. Bulk editing only works on the Status and Priority properties.
- Transparent background modals.
- Easily delete all of your data
- New action to quickly delete all of your data.
- Can now add and edit tasks in kanban view without switching back to table view. Add a task with the Add Task button at the top and bottom of each column, or edit a task by simply clicking on it.

### 1.1.0

- Added subtle animations and transitions to make things feel sleeker.

### 1.0.0

- Added the ability for users to add/remove their own custom columns.
- Settings and custom column data stored in localStorage for persistance.

### 0.5.1

- Bug fix to pagination on imported tasks.
- Bug fix to prevent setting currentPage to 0 when tasksData is empty.

### 0.5.0

- Data now persists between reloads and browser closings.
- Can import example data to populate the table.

### 0.4.0

- Pagination for tasks.
- Users can change page number and page size.
- Some hover styles changes on buttons.

### 0.3.1

- Bug fix when filtering functions. Correct tasks are displayed when switching filtered type without needing to type in the text input.

### 0.3.0

- Tasks can be sorted through by column type in either ascending or descending.
- Tasks can be filtered by text and by column type.
- Sorting and filtering work in tandem.

### 0.2.0

- Tasks can be added, edited, and deleted.

### 0.1.0

- Initial setup and configuration
- Installed packages such as FontAwesome and Tailwind for design.
- Created the initial layout of the application, including the application header, action components and search bar, and displays example data.
