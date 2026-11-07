"use strict";

// Shared action data used by the dashboard, report table, and category chart.
let actionsData = [
    { id: 1, nama: "Membawa Botol Tumbler Sendiri", kategori: "Reduksi Plastik", poin: 10 },
];

let navLinks;
let tabContents;
let actionForm;
let inputNama;
let inputKategori;
let inputPoin;
let actionList;
let errorMessage;
let statTotalAksi;
let statTotalPoin;
let btnClearAll;
let tableLaporanBody;
let statPlastik;
let barPlastik;
let percentPlastik;
let statEnergi;
let barEnergi;
let percentEnergi;
let statDaur;
let barDaur;
let percentDaur;

// Render the action list and update the dashboard totals.
function renderDashboardList() {
    const fragment = document.createDocumentFragment();
    const totalPoin = actionsData.reduce((sum, action) => sum + action.poin, 0);

    actionsData.forEach((action) => {
        const item = document.createElement("li");
        item.className = "action-item";
        item.dataset.actionId = String(action.id);

        const text = document.createElement("span");
        text.className = "item-text";
        text.textContent = `[${action.kategori}] ${action.nama} (${action.poin} Poin)`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-delete";
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.setAttribute("aria-label", `Hapus aksi ${action.nama}`);
        deleteButton.addEventListener("click", () => deleteAction(action.id));

        item.append(text, deleteButton);
        fragment.appendChild(item);
    });

    actionList.replaceChildren(fragment);
    statTotalAksi.textContent = actionsData.length;
    statTotalPoin.textContent = totalPoin;
}

// Render all action records in the report tab.
function renderLaporanTable() {
    const fragment = document.createDocumentFragment();

    actionsData.forEach((action, index) => {
        const row = document.createElement("tr");
        [index + 1, action.nama, action.kategori, action.poin].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.appendChild(cell);
        });
        fragment.appendChild(row);
    });

    tableLaporanBody.replaceChildren(fragment);
}

// Calculate category totals and update the corresponding progress bars.
function renderStatistikProgress() {
    const totalPoin = actionsData.reduce((sum, action) => sum + action.poin, 0);
    const categoryTotals = {
        "Reduksi Plastik": { points: statPlastik, bar: barPlastik, percent: percentPlastik },
        "Hemat Energi": { points: statEnergi, bar: barEnergi, percent: percentEnergi },
        "Daur Ulang": { points: statDaur, bar: barDaur, percent: percentDaur },
    };

    Object.entries(categoryTotals).forEach(([category, elements]) => {
        const points = actionsData
            .filter((action) => action.kategori === category)
            .reduce((sum, action) => sum + action.poin, 0);
        const percent = totalPoin ? Math.round((points / totalPoin) * 100) : 0;

        elements.points.textContent = points;
        elements.percent.textContent = `${percent}%`;
        elements.bar.style.width = `${percent}%`;
        elements.bar.parentElement.setAttribute("aria-valuenow", String(percent));
    });

    document.getElementById("statistics-summary").textContent =
        `Total ${totalPoin} poin dari ${actionsData.length} aksi tercatat.`;
}

// Refresh every view that depends on action data.
function updateAll() {
    renderDashboardList();
    renderLaporanTable();
    renderStatistikProgress();
}

// Delete one action by its unique id and synchronize all views.
function deleteAction(id) {
    actionsData = actionsData.filter((action) => action.id !== id);
    updateAll();
}

// Clear the shared action list and refresh every dependent view.
function clearAllActions() {
    actionsData = [];
    updateAll();
}

// Switch the visible tab and the active navigation item.
function showTab(targetId) {
    navLinks.forEach((link) => {
        const isActive = link.dataset.target === targetId;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    tabContents.forEach((tab) => {
        const isActive = tab.id === targetId;
        tab.classList.toggle("active", isActive);
        tab.hidden = !isActive;
    });

    const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    document.getElementById("current-tab-title").textContent =
        activeLink ? activeLink.textContent.trim() : "Dashboard";
}

// Validate form values and add a new action to shared state.
function handleFormSubmit(event) {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const kategori = inputKategori.value;
    const poin = Number(inputPoin.value);

    if (!nama || Number.isNaN(poin) || poin <= 0) {
        errorMessage.textContent = "Harap isi nama aksi dan poin lebih dari 0.";
        return;
    }

    actionsData.push({
        id: Date.now(),
        nama,
        kategori,
        poin,
    });

    errorMessage.textContent = "";
    actionForm.reset();
    updateAll();
    inputNama.focus();
}

// Initialize selectors, event handlers, tab state, and the first render.
document.addEventListener("DOMContentLoaded", () => {
    navLinks = document.querySelectorAll(".nav-link");
    tabContents = document.querySelectorAll(".tab-content");
    actionForm = document.getElementById("action-form");
    inputNama = document.getElementById("input-nama");
    inputKategori = document.getElementById("input-kategori");
    inputPoin = document.getElementById("input-poin");
    actionList = document.getElementById("action-list");
    errorMessage = document.getElementById("error-message");
    statTotalAksi = document.getElementById("stat-total-aksi");
    statTotalPoin = document.getElementById("stat-total-poin");
    btnClearAll = document.getElementById("btn-clear-all");
    tableLaporanBody = document.getElementById("table-laporan-body");
    statPlastik = document.getElementById("stat-plastik");
    barPlastik = document.getElementById("bar-plastik");
    percentPlastik = document.getElementById("percent-plastik");
    statEnergi = document.getElementById("stat-energi");
    barEnergi = document.getElementById("bar-energi");
    percentEnergi = document.getElementById("percent-energi");
    statDaur = document.getElementById("stat-daur");
    barDaur = document.getElementById("bar-daur");
    percentDaur = document.getElementById("percent-daur");

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showTab(link.dataset.target);
        });
    });

    actionForm.addEventListener("submit", handleFormSubmit);
    btnClearAll.addEventListener("click", clearAllActions);

    document.getElementById("today-label").textContent =
        new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date());

    updateAll();
});
