
import { saveData } from "./storage.js";


export function deleteItem(storageKey, array, index, renderFn) {
  array.splice(index, 1);
  saveData(storageKey, array);
  renderFn();
}


export function renderTable(tableBodyId, data, columns, actionRenderer, formatters = {}) {
  const tbody = document.getElementById(tableBodyId);
  tbody.innerHTML = "";

  if (!data.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="${columns.length + (actionRenderer ? 1 : 0)}" 
          class="border p-4 text-center text-gray-500">
        Nothing to show
      </td>`;
    tbody.appendChild(tr);
    return;
  }

  data.forEach((item, index) => {
    const tr = document.createElement("tr");

    columns.forEach(col => {
      const td = document.createElement("td");

      if (formatters[col]) {
        td.textContent = formatters[col](item[col], item);
      } else {
        td.textContent = item[col];
      }

      td.classList.add("border", "p-2");
      tr.appendChild(td);
    });

    if (actionRenderer) {
      const td = document.createElement("td");
      td.appendChild(actionRenderer(item, index));
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });
}
