import type { Organization } from "../types/organization";

type SortKey = "name" | "director" | null;
type SortDir = "asc" | "desc";

type Listener = () => void;

export function createOrgStore() {
  // --- state ---
  let organizations: Organization[] = [
    {
      id: "1",
      name: 'ООО "Вектор"',
      director: "Иванов И.И.",
      phone: "+7 000 123 45 67",
      address: { city: "Москва", street: "Ленина", house: "1" },
    },
    {
      id: "2",
      name: "ИП Сидоров С.С.",
      director: "Сидоров С.С.",
      phone: "+7 000 56 78 99",
      address: { city: "Санкт-Петербург", street: "Невский", house: "2" },
    },
  ];

  let search = "";
  let sortKey: SortKey = null;
  let sortDir: SortDir = "asc";

  const listeners: Listener[] = [];

  // --- internal notify ---
  function notify() {
    listeners.forEach((cb) => cb());
  }

  // --- CRUD ---
  function addOrg(org: Organization) {
    organizations.push({
      ...org,
      id: Math.random().toString(36).slice(2, 9),
    });
    notify();
  }

  function updateOrg(org: Organization) {
    const idx = organizations.findIndex((o) => o.id === org.id);
    if (idx !== -1) {
      organizations[idx] = { ...org };
      notify();
    }
  }

  function deleteOrg(id: string) {
    organizations = organizations.filter((o) => o.id !== id);
    notify();
  }

  // --- фильтр и сортировка ---
  function getFilteredOrgs(): Organization[] {
    let list = [...organizations];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((o) => o.director.toLowerCase().includes(q));
    }

    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      list.sort(
        (a, b) => String(a[sortKey!]).localeCompare(String(b[sortKey!])) * dir
      );
    }

    return list;
  }

  // --- setters ---
  function setSearch(value: string) {
    search = value;
    notify();
  }

  function setSort(key: SortKey, dir: SortDir) {
    sortKey = key;
    sortDir = dir;
    notify();
  }

  // --- подписка ---
  function subscribe(cb: Listener) {
    listeners.push(cb);
    return () => {
      const i = listeners.indexOf(cb);
      if (i !== -1) listeners.splice(i, 1);
    };
  }

  // --- публичный API ---
  return {
    // state getters
    getOrgs: () => organizations,
    getFilteredOrgs,
    getSearch: () => search,
    getSort: () => ({ sortKey, sortDir }),

    // actions
    addOrg,
    updateOrg,
    deleteOrg,
    setSearch,
    setSort,

    // реактивность
    subscribe,
  };
}
