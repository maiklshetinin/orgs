// src/components/OrgTable.ts
import type { Organization } from "../types/organization";
import { createOrgStore } from "../store/orgStore";

interface Handlers {
  onEdit?: (org: Organization) => void;
  onDelete?: (id: string) => void;
}

export function createOrgTable(
  container: HTMLElement,
  store: ReturnType<typeof createOrgStore>,
  handlers: Handlers = {}
) {
  let currentPage = 1;
  const pageSize = 5;

  function render() {
    container.innerHTML = "";

    const orgs = store.getFilteredOrgs();
    const start = (currentPage - 1) * pageSize;
    const paginated = orgs.slice(start, start + pageSize);

    //Создаём таблицу
    const table = document.createElement("table");
    table.className = "org-table";
    table.style.width = "100%";

    //Заголовок таблицы
    table.innerHTML = `
      <thead>
        <tr>
          <th data-key="name" class="sortable">Название</th>
          <th data-key="director" class="sortable">ФИО директора</th>
          <th>Номер телефона</th>
          <th>Адрес</th>
          <th class="actions-col"></th>
        </tr>
      </thead>
      <tbody>
        ${paginated
          .map(
            (o) => `
            <tr data-id="${o.id}">
              <td>${o.name}</td>
              <td>${o.director}</td>
              <td>${o.phone}</td>
              <td>${o.address.city}, ${o.address.street}, ${o.address.house}</td>
              <td class="delete-cell">
                <button class="delete-btn">✖</button>
              </td>
            </tr>`
          )
          .join("")}
      </tbody>
    `;

    //Сортировка по клику на заголовок
    table.querySelectorAll("th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.getAttribute("data-key") as "name" | "director";
        const { sortKey, sortDir } = store.getSort();
        const newDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
        store.setSort(key, newDir);
      });
    });

    //Обработка кликов по строкам и кнопкам удаления
    table.querySelectorAll("tbody tr").forEach((row) => {
      const id = row.getAttribute("data-id")!;
      const delBtn = row.querySelector(".delete-btn")! as HTMLButtonElement;

      // Клик по кнопке удаления
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handlers.onDelete?.(id);
      });

      // Клик по строке таблицы (открываем режим редактирования)
      row.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).classList.contains("delete-btn")) return;
        const org = orgs.find((o) => o.id === id);
        if (org) handlers.onEdit?.(org);
      });
    });

    container.appendChild(table);

    //Пагинация
    const totalPages = Math.ceil(orgs.length / pageSize);
    if (totalPages > 1) {
      const pagination = document.createElement("div");
      pagination.className = "pagination";

      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = String(i);
        if (i === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => {
          currentPage = i;
          render();
        });
        pagination.appendChild(btn);
      }

      container.appendChild(pagination);
    }
  }

  //Подписка на обновления стора
  store.subscribe(render);

  return { render };
}
