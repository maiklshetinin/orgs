import { createOrgStore } from "./store/orgStore.js";
import { createOrgTable } from "./components/OrgTable.js";
import { createOrgForm } from "./components/OrgForm.js";

const store = createOrgStore();

const app = document.getElementById("app")!;

// Основной контейнер
const container = document.createElement("div");
container.className = "container";

//<header/>
const header = document.createElement("header");
header.className = "header";

// Заголовок
const title = document.createElement("h1");
title.textContent = "Справочник организаций";

// Блок действий (поиск + кнопка)
const actions = document.createElement("div");
actions.className = "actions";

// Поиск
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Найти по ФИО директора...";
searchInput.className = "search-input";

searchInput.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).value;
  store.setSearch(value);
  rerender();
});

// Кнопка добавления
const addBtn = document.createElement("button");
addBtn.textContent = "Добавить";
addBtn.className = "add-btn";
addBtn.addEventListener("click", () => form.open());

// Вставляем элементы в actions и header
actions.append(searchInput, addBtn);
header.append(title, actions);

// Контейнер для таблицы и формы
const contentWrapper = document.createElement("div");
contentWrapper.className = "content-wrapper";

const formContainer = document.createElement("div");
const tableContainer = document.createElement("div");
contentWrapper.append(formContainer, tableContainer);

// Добавляем всё в container
container.append(header, contentWrapper);
app.append(container);

//Логика таблицы и формы
const form = createOrgForm(formContainer, store);

let table = createOrgTable(tableContainer, store, {
  onEdit: (org) => form.open(org),
  onDelete: (id) => {
    store.deleteOrg(id);
    rerender();
  },
});

//Функция перерисовки
function rerender() {
  table.render();
}

//Первый рендер
rerender();
