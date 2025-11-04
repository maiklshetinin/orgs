import type { Organization } from "../types/organization";
import { createOrgStore } from "../store/orgStore";

export function createOrgForm(
  container: HTMLElement,
  store: ReturnType<typeof createOrgStore>
) {
  let overlay: HTMLDivElement | null = null;
  let currentOrg: Organization | null = null;

  function open(org: Organization | null = null) {
    currentOrg = org;
    render(org);
  }

  function close() {
    overlay?.remove();
    overlay = null;
    currentOrg = null;
  }

  function render(org: Organization | null) {
    close();

    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" style="width:520px; position:relative;">
        <h2 class="modal-title">
          ${org ? "Редактировать организацию" : "Добавить организацию"}
        </h2>

        <form class="org-form">
          <div class="form-group">
            <label>Название</label>
            <input id="name" type="text" class="input" required />
          </div>

          <div class="form-group">
            <label>ФИО директора</label>
            <input id="director" type="text" class="input" required />
          </div>

          <div class="form-group">
            <label>Номер телефона</label>
            <input id="phone" type="text" class="input" required />
          </div>

          <div class="form-row">
            <div class="form-col">
              <label>Город</label>
              <input id="city" type="text" class="input" required />
            </div>
            <div class="form-col wide">
              <label>Улица</label>
              <input id="street" type="text" class="input" required />
            </div>
            <div class="form-col small">
              <label>Дом</label>
              <input id="house" type="text" class="input" required />
            </div>
          </div>

          <div class="form-footer">
            <button type="button" id="cancel" class="btn cancel">Отмена</button>
            <button type="submit" id="save" class="btn primary" disabled>OK</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    // Крестик закрытия
    const modal = overlay.querySelector(".modal")!;
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", close);
    modal.appendChild(closeBtn);

    // Закрытие по клику на оверлей
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    const form = overlay.querySelector("form")!;
    const name = form.querySelector("#name") as HTMLInputElement;
    const director = form.querySelector("#director") as HTMLInputElement;
    const phone = form.querySelector("#phone") as HTMLInputElement;
    const city = form.querySelector("#city") as HTMLInputElement;
    const street = form.querySelector("#street") as HTMLInputElement;
    const house = form.querySelector("#house") as HTMLInputElement;
    const saveBtn = form.querySelector("#save") as HTMLButtonElement;

    // Если редактируем (заполняем поля)
    if (org) {
      name.value = org.name;
      director.value = org.director;
      phone.value = org.phone;
      city.value = org.address.city;
      street.value = org.address.street;
      house.value = org.address.house;
    }

    const cancelBtn = form.querySelector("#cancel")!;
    cancelBtn.addEventListener("click", close);

    // Проверка заполнения всех полей
    const inputs = [name, director, phone, city, street, house];

    function validateForm() {
      const allFilled = inputs.every((input) => input.value.trim() !== "");
      saveBtn.disabled = !allFilled;
    }

    // Подписка на изменения всех полей
    inputs.forEach((input) => {
      input.addEventListener("input", validateForm);
    });

    // Проверяем при открытии (актуально при редактировании)
    validateForm();

    // Сабмит формы
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (saveBtn.disabled) return;

      const newOrg: Organization = {
        id: org ? org.id : Math.random().toString(36).slice(2, 9),
        name: name.value.trim(),
        director: director.value.trim(),
        phone: phone.value.trim(),
        address: {
          city: city.value.trim(),
          street: street.value.trim(),
          house: house.value.trim(),
        },
      };

      if (org) {
        store.updateOrg(newOrg);
      } else {
        store.addOrg(newOrg);
      }

      close();
    });
  }

  return { open, close };
}
