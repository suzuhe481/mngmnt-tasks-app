# MNGMNT Tasks App

This is MNGMNT. An application used to help organize your tasks, inspired by other task managers such as Jira and Trello.

The clever origin of the name is that it's just the word "Management" without the vowels.

## Features

- Task organization in a table display.
- Add, edit, delete tasks.
- Sort and filter through tasks by column or text.
- Paginate through tasks to easily find what you're looking for.

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
