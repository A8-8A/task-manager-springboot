# Changelog

## [1.1.0] - 2026-02-22

### Fixed
- Removed duplicate `getTaskByIdFromTable()` definition in `app.js` that contained a syntax error (stray `f` character before a `fetch()` call) — this was causing the entire script to fail, making all buttons throw "not defined" errors
- Added missing `getTaskById()` function that was being called by the "Get Task By ID" button but was never defined, causing a `ReferenceError` on every click
- Moved `<div class="container">` in `index.html` from between `</head>` and `<body>` (invalid HTML) to inside `<body>`, fixing broken layout styles such as centering, max-width, and padding

### Added
- Edit button in the Tasks Table for each row — clicking it populates the form with the task's existing data and switches to Update mode
- Update mode fires a `PUT /api/tasks/{id}` request on submit
- Cancel Edit button to return the form to Create mode and clear all fields

### Changed
- Table now starts empty on page load — nothing loads automatically
- "Get Task By ID" now reflects the result in the table, not just in the raw JSON output below
- After creating a task, the table shows only that new task so the assigned ID is immediately visible
- "List All Tasks" acts as the full table reset and is the only way to load all tasks
- Removed the redundant "Refresh Table" button as it was identical to "List All Tasks"