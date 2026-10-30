# SpendWise — Expense Tracker

A responsive personal expense tracker built with **HTML5, CSS3, and vanilla JavaScript**. No frameworks, build tools, or API keys are required.

## Features

- Add, edit, and delete expenses with form validation and delete confirmation.
- Track each expense by title, amount, category, date, and optional note.
- View total spending, transaction count, top category, and category breakdown.
- Search expenses and filter by category or month.
- Sort by date, amount, or title.
- Save expense records and dark/light theme preference in `localStorage`.
- Export all recorded expenses as a CSV file.
- Responsive layout for mobile, tablet, and desktop.
- Print-friendly stylesheet.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser. For a more realistic local development setup, use the VS Code Live Server extension.
3. Add a test expense, refresh the page, and verify that the record remains.

All data is stored locally in the browser. Clearing site data or switching browsers/devices will not carry entries over.

## Project structure

```text
spendwise/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Concepts demonstrated

Semantic HTML, CSS Grid and Flexbox, media queries, form validation, DOM manipulation, event delegation, array methods (`filter`, `reduce`, `sort`, `find`), JSON serialization, `localStorage`, CSV export, and theme persistence.

## Deploy on Netlify

1. Push the project folder to a GitHub repository.
2. Sign in to Netlify and choose **Add new site → Import an existing project**.
3. Connect GitHub and select this repository.
4. Since this is a static site, leave the build command blank and set the publish directory to the repository root (`.`).
5. Deploy, then open the generated URL and test it on a phone-sized viewport.

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Select the static/other framework option if prompted. No build command is required; use `.` as the output directory if the setup asks for one.
4. Deploy and verify the live URL.

## Suggested Git workflow

Make small commits as each feature is completed; do not wait until the end.

```bash
git init
git add index.html style.css script.js README.md
git commit -m "chore: create SpendWise project structure"

# After implementing and testing the form
git add .
git commit -m "feat: add expense form and validation"

# After implementing persistence and CRUD
git add .
git commit -m "feat: persist expenses and support editing"

# After filters, theme, and export are tested
git add .
git commit -m "feat: add filters theme toggle and CSV export"

git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/spendwise.git
git push -u origin main
```

Replace the example remote URL with your own repository URL. Commit regularly throughout development and keep the README up to date.

## Final testing checklist

- [ ] Add an expense with valid data.
- [ ] Try submitting the form with missing fields and an invalid amount.
- [ ] Edit an existing expense.
- [ ] Delete an expense and cancel a deletion to test confirmation.
- [ ] Search, filter by category/month, and test each sort option.
- [ ] Refresh the page and confirm expenses persist.
- [ ] Toggle dark/light mode, refresh, and confirm the theme persists.
- [ ] Export CSV and open the downloaded file.
- [ ] Test mobile, tablet, and desktop layouts.
- [ ] Confirm the deployed website loads and the GitHub repository includes this README.
