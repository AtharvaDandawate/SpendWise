const STORAGE_KEY = "spendwise-expenses-v1";
const THEME_KEY = "spendwise-theme-v1";
const CATEGORIES = {
  Food: "🍽️", Travel: "🚆", Shopping: "🛍️", Bills: "🧾",
  Health: "💊", Education: "📚", Entertainment: "🎬", Other: "✦"
};

const $ = (selector) => document.querySelector(selector);
const form = $("#expenseForm");
const expenseList = $("#transactionList");
let expenses = loadExpenses();
let pendingDeleteId = null;
let toastTimeout;

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(isValidExpense) : [];
  } catch (error) {
    console.warn("Could not read saved expenses:", error);
    return [];
  }
}

function isValidExpense(item) {
  return item && typeof item.id === "string" &&
    typeof item.title === "string" && Number.isFinite(Number(item.amount)) &&
    Number(item.amount) > 0 && typeof item.category === "string" &&
    typeof item.date === "string";
}

function saveExpenses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    showToast("Could not save data. Check browser storage settings.");
    console.error(error);
  }
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  }).format(value);
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function getVisibleExpenses() {
  const search = $("#search").value.trim().toLowerCase();
  const category = $("#filterCategory").value;
  const month = $("#filterMonth").value;
  const sortBy = $("#sortBy").value;

  const visible = expenses.filter((expense) => {
    const matchesSearch = `${expense.title} ${expense.category} ${expense.note || ""}`.toLowerCase().includes(search);
    const matchesCategory = category === "all" || expense.category === category;
    const matchesMonth = !month || expense.date.startsWith(month);
    return matchesSearch && matchesCategory && matchesMonth;
  });

  const sorters = {
    newest: (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
    oldest: (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
    high: (a, b) => Number(b.amount) - Number(a.amount),
    low: (a, b) => Number(a.amount) - Number(b.amount),
    az: (a, b) => a.title.localeCompare(b.title)
  };
  return visible.sort(sorters[sortBy] || sorters.newest);
}

function render() {
  const visible = getVisibleExpenses();
  renderSummary(visible);
  renderTransactions(visible);
  renderBreakdown(visible);
  $("#visibleCount").textContent = `${visible.length} transaction${visible.length === 1 ? "" : "s"}`;
}

function renderSummary(visible) {
  const total = visible.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const categoryTotals = visible.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount);
    return totals;
  }, {});
  const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  $("#totalSpent").textContent = money(total);
  $("#expenseCount").textContent = visible.length.toLocaleString("en-IN");
  $("#topCategory").textContent = top ? top[0] : "—";
  $("#topCategoryAmount").textContent = top ? `${money(top[1])} spent` : "No spending yet";
  const month = $("#filterMonth").value;
  $("#periodLabel").textContent = month
    ? `For ${new Date(`${month}-02T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`
    : "Across matching expenses";
}

function renderTransactions(visible) {
  if (visible.length === 0) {
    const hasExpenses = expenses.length > 0;
    expenseList.innerHTML = `<div class="empty-state"><strong>${hasExpenses ? "No matching expenses" : "Nothing here just yet"}</strong><span>${hasExpenses ? "Try changing your search or filters." : "Add your first expense to get started."}</span></div>`;
    return;
  }

  expenseList.innerHTML = visible.map((expense) => `
    <article class="transaction-item">
      <div class="transaction-primary">
        <span class="category-icon" aria-hidden="true">${CATEGORIES[expense.category] || "✦"}</span>
        <div class="transaction-info">
          <p class="transaction-title">${escapeHTML(expense.title)}</p>
          <p class="transaction-meta">${escapeHTML(expense.category)} · ${formatDate(expense.date)}${expense.note ? ` · ${escapeHTML(expense.note)}` : ""}</p>
        </div>
      </div>
      <span class="transaction-amount">${money(Number(expense.amount))}</span>
      <div class="transaction-actions">
        <button class="small-action" type="button" data-action="edit" data-id="${escapeHTML(expense.id)}">Edit</button>
        <button class="small-action delete" type="button" data-action="delete" data-id="${escapeHTML(expense.id)}">Delete</button>
      </div>
    </article>`).join("");
}

function renderBreakdown(visible) {
  const totals = visible.reduce((result, expense) => {
    result[expense.category] = (result[expense.category] || 0) + Number(expense.amount);
    return result;
  }, {});
  const categories = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const grandTotal = categories.reduce((sum, [, amount]) => sum + amount, 0);

  if (!categories.length) {
    $("#categoryBreakdown").innerHTML = '<p class="muted small">Category totals will appear after you add expenses.</p>';
    return;
  }

  $("#categoryBreakdown").innerHTML = categories.map(([category, amount]) => {
    const percent = grandTotal ? (amount / grandTotal) * 100 : 0;
    return `<div class="breakdown-item">
      <div class="breakdown-top"><strong>${CATEGORIES[category] || "✦"} ${escapeHTML(category)}</strong><span>${money(amount)}</span></div>
      <div class="breakdown-track" role="progressbar" aria-label="${escapeHTML(category)} spending" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent.toFixed(0)}"><div class="breakdown-fill" style="width:${percent.toFixed(2)}%"></div></div>
      <p class="breakdown-sub">${percent.toFixed(0)}% of total</p>
    </div>`;
  }).join("");
}

function resetForm() {
  form.reset();
  $("#expenseId").value = "";
  $("#date").value = new Date().toLocaleDateString("en-CA");
  $("#formTitle").textContent = "Add an expense";
  $("#saveExpense").textContent = "Save expense";
  $("#cancelEdit").classList.add("hidden");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function startEdit(id) {
  const expense = expenses.find((item) => item.id === id);
  if (!expense) return;
  $("#expenseId").value = expense.id;
  $("#title").value = expense.title;
  $("#amount").value = expense.amount;
  $("#category").value = expense.category;
  $("#date").value = expense.date;
  $("#note").value = expense.note || "";
  $("#formTitle").textContent = "Edit expense";
  $("#saveExpense").textContent = "Update expense";
  $("#cancelEdit").classList.remove("hidden");
  $("#formPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#title").focus({ preventScroll: true });
}

function askToDelete(id) {
  pendingDeleteId = id;
  const dialog = $("#confirmDialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
  else if (window.confirm("Delete this expense?")) deleteExpense(id);
}

function deleteExpense(id) {
  const originalLength = expenses.length;
  expenses = expenses.filter((expense) => expense.id !== id);
  if (expenses.length === originalLength) return;
  saveExpenses();
  render();
  if ($("#expenseId").value === id) resetForm();
  showToast("Expense deleted.");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const id = $("#expenseId").value;
  const existing = expenses.find((expense) => expense.id === id);
  const expense = {
    id: id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    title: $("#title").value.trim(),
    amount: Number($("#amount").value),
    category: $("#category").value,
    date: $("#date").value,
    note: $("#note").value.trim()
  };

  if (expense.title.length < 2 || !Number.isFinite(expense.amount) || expense.amount <= 0 || !expense.category || !expense.date) {
    showToast("Please check each required field.");
    return;
  }

  if (existing) {
    expenses = expenses.map((item) => item.id === id ? expense : item);
    showToast("Expense updated.");
  } else {
    expenses.push(expense);
    showToast("Expense added.");
  }

  saveExpenses();
  resetForm();
  render();
});

expenseList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "edit") startEdit(id);
  if (action === "delete") askToDelete(id);
});

$("#confirmDelete").addEventListener("click", (event) => {
  event.preventDefault();
  if (pendingDeleteId) deleteExpense(pendingDeleteId);
  pendingDeleteId = null;
  $("#confirmDialog").close();
});

$("#cancelEdit").addEventListener("click", resetForm);
$("#addExpenseTop").addEventListener("click", () => {
  $("#formPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#title").focus({ preventScroll: true });
});
["#search", "#filterCategory", "#filterMonth", "#sortBy"].forEach((selector) => {
  $(selector).addEventListener("input", render);
  $(selector).addEventListener("change", render);
});
$("#clearFilters").addEventListener("click", () => {
  $("#search").value = "";
  $("#filterCategory").value = "all";
  $("#filterMonth").value = "";
  $("#sortBy").value = "newest";
  render();
});

$("#exportCsv").addEventListener("click", () => {
  if (!expenses.length) {
    showToast("Add an expense before exporting.");
    return;
  }
  const columns = ["Title", "Amount (INR)", "Category", "Date", "Note"];
  const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = expenses.map((item) => [item.title, item.amount, item.category, item.date, item.note]);
  const csv = [columns, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "spendwise-expenses.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("CSV export downloaded.");
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  $("#themeToggle").textContent = dark ? "☀" : "☾";
  $("#themeToggle").setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  try { localStorage.setItem(THEME_KEY, theme); } catch (error) { console.warn("Theme preference could not be saved.", error); }
}

function initTheme() {
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem(THEME_KEY) || "light"; } catch (error) { /* Use light theme if storage is unavailable. */ }
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}
$("#themeToggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

$("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
initTheme();
resetForm();
render();
