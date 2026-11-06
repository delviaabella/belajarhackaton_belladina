"use strict";

const TARGET_POIN = 100;
const dummyData = [
    { nama: "Bawa Tumbler Sendiri", kategori: "Reduksi Plastik", poin: 10 },
    { nama: "Matikan Lampu Kelas", kategori: "Hemat Energi", poin: 15 },
    { nama: "Daur Ulang Kertas", kategori: "Daur Ulang", poin: 20 },
];

let actionsData = [];
let totalAksi = 1;
let totalPoin = 10;

document.addEventListener("DOMContentLoaded", () => {
    const actionForm = document.getElementById("action-form");
    const inputNama = document.getElementById("input-nama");
    const inputKategori = document.getElementById("input-kategori");
    const inputPoin = document.getElementById("input-poin");
    const actionList = document.getElementById("action-list");
    const errorMessage = document.getElementById("error-message");
    const reportTableBody = document.getElementById("report-table-body");
    const categoryFilter = document.getElementById("report-category-filter");
    const emptyState = document.getElementById("empty-state");
    const clearAllButton = document.getElementById("btn-clear-all");

    // Load the starter row from HTML into the single source of truth.
    function readInitialActions() {
        actionsData = Array.from(actionList.querySelectorAll(".action-item"), (item) => ({
            id: Number(item.dataset.actionId),
            nama: item.dataset.nama,
            kategori: item.dataset.kategori,
            poin: Number(item.dataset.poin),
            status: item.dataset.status || "Terverifikasi",
        }));

        if (actionsData.length) {
            totalAksi = actionsData.length;
            totalPoin = actionsData.reduce((sum, action) => sum + action.poin, 0);
        }
    }

    // Display the current action totals and monthly target status.
    function updateStats() {
        totalAksi = actionsData.length;
        totalPoin = actionsData.reduce((sum, action) => sum + action.poin, 0);
        document.getElementById("stat-total-aksi").textContent = totalAksi;
        document.getElementById("stat-total-poin").textContent = totalPoin;
        document.getElementById("stat-target").textContent =
            totalPoin >= TARGET_POIN ? "Tercapai" : "Aktif";
    }

    // Build a safely rendered action row for the dashboard list.
    function createActionItem(action) {
        const item = document.createElement("li");
        item.className = "action-item";
        item.dataset.actionId = String(action.id);
        item.dataset.poin = String(action.poin);

        const text = document.createElement("span");
        text.className = "item-text";
        text.textContent = `[${action.kategori}] ${action.nama} (${action.poin} Poin)`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-delete";
        deleteButton.type = "button";
        deleteButton.dataset.deleteId = String(action.id);
        deleteButton.setAttribute("aria-label", `Hapus aksi ${action.nama}`);
        deleteButton.textContent = "Hapus";

        item.append(text, deleteButton);
        return item;
    }

    // Render the dashboard's recent-action list from actionsData.
    function renderActionList() {
        const fragment = document.createDocumentFragment();
        actionsData.forEach((action) => fragment.appendChild(createActionItem(action)));
        actionList.replaceChildren(fragment);

        const isEmpty = actionsData.length === 0;
        emptyState.hidden = !isEmpty;
        document.getElementById("list-count").textContent = `${actionsData.length} aksi tercatat`;
    }

    // Create a table cell and assign its content as text, not markup.
    function createTableCell(value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        return cell;
    }

    // Render filtered report rows, including their verification badges.
    function renderReportTable() {
        const selectedCategory = categoryFilter.value;
        const filteredActions = actionsData.filter((action) =>
            selectedCategory === "all" || action.kategori === selectedCategory
        );
        const fragment = document.createDocumentFragment();

        filteredActions.forEach((action, index) => {
            const row = document.createElement("tr");
            row.append(
                createTableCell(String(index + 1)),
                createTableCell(action.nama),
                createTableCell(action.kategori),
                createTableCell(String(action.poin)),
            );

            const statusCell = document.createElement("td");
            const badge = document.createElement("span");
            badge.className = `status-badge${action.status === "Terverifikasi" ? "" : " status-pending"}`;
            badge.textContent = action.status;
            statusCell.appendChild(badge);
            row.appendChild(statusCell);
            fragment.appendChild(row);
        });

        reportTableBody.replaceChildren(fragment);
        document.getElementById("report-empty-state").hidden = filteredActions.length > 0;
        document.getElementById("report-count").textContent =
            `Menampilkan ${filteredActions.length} dari ${actionsData.length} aksi`;
    }

    // Calculate each category's points and share, then update its progress bar.
    function renderCategoryStats() {
        const categories = [
            { name: "Reduksi Plastik", key: "plastic" },
            { name: "Hemat Energi", key: "energy" },
            { name: "Daur Ulang", key: "recycle" },
        ];
        const allPoints = actionsData.reduce((sum, action) => sum + action.poin, 0);

        categories.forEach(({ name, key }) => {
            const points = actionsData
                .filter((action) => action.kategori === name)
                .reduce((sum, action) => sum + action.poin, 0);
            const percent = allPoints ? Math.round((points / allPoints) * 100) : 0;
            const progress = document.getElementById(`${key}-progress`);

            document.getElementById(`${key}-points`).textContent = points;
            document.getElementById(`${key}-percent`).textContent = `${percent}%`;
            progress.style.width = `${percent}%`;
            progress.parentElement.setAttribute("aria-valuenow", String(percent));
        });

        document.getElementById("statistics-summary").textContent =
            `Total ${allPoints} poin kontribusi dari ${actionsData.length} aksi kampus.`;
    }

    // Refresh every view that depends on the shared action data.
    function renderAllViews() {
        updateStats();
        renderActionList();
        renderReportTable();
        renderCategoryStats();
    }

    // Add three sample actions only when both the list and state are empty.
    function initDummyData() {
        if (actionsData.length || actionList.children.length) return;

        actionsData = dummyData.map((action, index) => ({
            ...action,
            id: index + 1,
            status: "Terverifikasi",
        }));
        renderAllViews();
    }

    // Add a new action after validating the form values.
    function handleFormSubmit(event) {
        event.preventDefault();

        const nama = inputNama.value.trim();
        const kategori = inputKategori.value;
        const poin = Number(inputPoin.value);

        if (!nama || !Number.isFinite(poin) || poin <= 0) {
            errorMessage.textContent = "Harap isi semua kolom dengan nilai angka poin yang valid!";
            return;
        }

        errorMessage.textContent = "";
        actionsData.unshift({
            id: Date.now(),
            nama,
            kategori,
            poin,
            status: "Menunggu Verifikasi",
        });
        actionForm.reset();
        renderAllViews();
        inputNama.focus();
    }

    // Remove an action from shared state so all tabs update together.
    function deleteAction(id) {
        actionsData = actionsData.filter((action) => action.id !== id);
        renderAllViews();
    }

    // Clear all actions and immediately refresh every dashboard view.
    function clearAllActions() {
        actionsData = [];
        renderAllViews();
    }

    // Switch visible SPA tab and keep the selected sidebar link in sync.
    function showTab(tabName) {
        const tabs = document.querySelectorAll(".tab-content");
        const links = document.querySelectorAll(".nav-menu [data-tab]");
        const target = document.getElementById(`${tabName}-tab`);

        if (!target) return;

        tabs.forEach((tab) => {
            const isActive = tab === target;
            tab.classList.toggle("active", isActive);
            tab.hidden = !isActive;
        });

        links.forEach((link) => {
            const isActive = link.dataset.tab === tabName;
            link.classList.toggle("active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        document.getElementById("current-tab-title").textContent = {
            dashboard: "Dashboard",
            laporan: "Laporan Aksi",
            statistik: "Statistik Kampus",
        }[tabName];
    }

    document.querySelectorAll(".nav-menu [data-tab]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showTab(link.dataset.tab);
        });
    });

    document.querySelectorAll("[data-open-tab]").forEach((button) => {
        button.addEventListener("click", () => showTab(button.dataset.openTab));
    });

    actionForm.addEventListener("submit", handleFormSubmit);
    categoryFilter.addEventListener("change", renderReportTable);
    clearAllButton.addEventListener("click", clearAllActions);

    actionList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-delete-id]");
        if (button) deleteAction(Number(button.dataset.deleteId));
    });

    document.getElementById("today-label").textContent =
        new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date());

    readInitialActions();
    initDummyData();
    renderAllViews();

    const initialTab = window.location.hash.slice(1);
    if (["dashboard", "laporan", "statistik"].includes(initialTab)) {
        showTab(initialTab);
    }
});
