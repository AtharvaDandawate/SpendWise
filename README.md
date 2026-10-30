# SpendWise — Expense Tracker

A responsive personal expense tracker built with **HTML5, CSS3, and vanilla JavaScript**. SpendWise helps users record, organize, and monitor daily expenses through a clean and simple dashboard.

## Live Demo

🌐 **Website:** https://my-spend-wise-tracker.netlify.app/

💻 **GitHub Repository:** https://github.com/AtharvaDandawate/SpendWise

## Features

- Add, edit, and delete expenses with form validation and delete confirmation.
- Track each expense by title, amount, category, date, and optional note.
- View total spending, transaction count, top category, and category breakdown.
- Search expenses and filter by category or month.
- Sort transactions by date, amount, or title.
- Save expense records and dark/light theme preference in browser `localStorage`.
- Export recorded expenses as a CSV file.
- Responsive layout for mobile, tablet, and desktop.
- Print-friendly stylesheet.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

## Run Locally

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a modern browser.
4. Alternatively, use the VS Code Live Server extension.
5. Add a test expense, refresh the page, and verify that the record remains.

**Note:** All data is stored locally in the browser. Clearing site data or switching browsers/devices will not carry entries over.

## Project Structure

```text
spendwise/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Concepts Demonstrated

- Semantic HTML
- CSS Grid and Flexbox
- Responsive design and media queries
- Form validation
- DOM manipulation
- Event delegation
- JavaScript array methods (`filter`, `reduce`, `sort`, `find`)
- JSON serialization
- Browser localStorage
- CSV export
- Theme persistence

## Deployment

This project is deployed using Netlify.

**Live website:** https://my-spend-wise-tracker.netlify.app/

The application is a static website and does not require a backend server, build command, or API keys.

## Git Workflow

The project is maintained using Git and GitHub. Meaningful commits are used to track development progress.

Example commands for future updates:

```bash
git add .
git commit -m "feat: improve expense tracker"
git push
```

## Final Testing Checklist

- [ ] Add an expense with valid data.
- [ ] Test form validation with missing fields and invalid amounts.
- [ ] Edit an existing expense.
- [ ] Delete an expense and test deletion confirmation.
- [ ] Search and filter expenses.
- [ ] Test all sorting options.
- [ ] Refresh the page and confirm expenses persist.
- [ ] Toggle dark/light mode and confirm the preference persists.
- [ ] Export CSV and open the downloaded file.
- [ ] Test mobile, tablet, and desktop layouts.
- [ ] Confirm the deployed website loads successfully.

## Author

**Atharva Dandawate**

Developed as a Web Technology project.
