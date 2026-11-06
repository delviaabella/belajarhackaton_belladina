"use strict";

const WEEKLY_POINT_TARGET = 100;

const starterActions = [
    { id: 1, name: "Membawa botol tumbler sendiri", category: "Reduksi Plastik", points: 10 },
    { id: 2, name: "Berangkat kuliah naik sepeda", category: "Hemat Energi", points: 20 },
    { id: 3, name: "Memilah sampah kertas untuk didaur ulang", category: "Daur Ulang", points: 15 },
    { id: 4, name: "Mematikan lampu setelah kelas selesai", category: "Hemat Energi", points: 10 },
    { id: 5, name: "Membawa tas belanja pakai ulang", category: "Reduksi Plastik", points: 10 },
];

let actions = starterActions.map((action) => ({ ...action }));

const actionForm = document.getElementById("action-form");
const inputNama = document.getElementById("input-nama");
const inputKategori = document.getElementById("input-kategori");
const inputPoin = document.getElementById("input-poin");
const inputSearch = document.getElementById("input-search");
const inputFilter = document.getElementById("input-filter");
const actionList = document.getElementById("action-list");
const errorMessage = document.getElementById("error-message");
const emptyState = document.getElementById("empty-state");
const emptyTitle = document.getElementById("empty-title");
const emptyCopy = document.getElementById("empty-copy");
const clearAllButton = document.getElementById("btn-clear-all");

function formatDate(date) {
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function updateStats() {
    const totalPoints = actions.reduce((sum, action) => sum + action.points, 0);
    const targetProgress = Math.min(totalPoints, WEEKLY_POINT_TARGET);
    const progressPercent = Math.min((totalPoints / WEEKLY_POINT_TARGET) * 100, 100);

    document.getElementById("stat-total-aksi").textContent = actions.length;
    document.getElementById("stat-total-poin").textContent = totalPoints;
    document.getElementById("stat-target-progress").textContent = targetProgress;
    document.getElementById("stat-target").textContent = WEEKLY_POINT_TARGET;

    const progressBar = document.getElementById("target-progress-bar");
    progressBar.style.width = `${progressPercent}%`;
    progressBar.parentElement.setAttribute("aria-valuenow", String(targetProgress));
}

function createActionItem(action) {
    const item = document.createElement("li");
    item.className = "action-item";
    item.dataset.actionId = String(action.id);

    const categoryIcon = document.createElement("span");
    categoryIcon.className = `category-icon ${getCategoryClass(action.category)}`;
    categoryIcon.setAttribute("aria-hidden", "true");
    categoryIcon.textContent = getCategoryIcon(action.category);

    const content = document.createElement("div");
    content.className = "action-content";

    const name = document.createElement("strong");
    name.className = "action-name";
    name.textContent = action.name;

    const category = document.createElement("span");
    category.className = "action-category";
    category.textContent = action.category;
    content.append(name, category);

    const points = document.createElement("span");
    points.className = "action-points";
    points.textContent = `+${action.points} poin`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.type = "button";
    deleteButton.dataset.deleteId = String(action.id);
    deleteButton.setAttribute("aria-label", `Hapus aksi ${action.name}`);
    deleteButton.textContent = "×";

    item.append(categoryIcon, content, points, deleteButton);
    return item;
}

function getCategoryClass(category) {
    if (category === "Reduksi Plastik") return "category-plastic";
    if (category === "Hemat Energi") return "category-energy";
    return "category-recycle";
}

function getCategoryIcon(category) {
    if (category === "Reduksi Plastik") return "↘";
    if (category === "Hemat Energi") return "ϟ";
    return "⟳";
}

function getVisibleActions() {
    const query = inputSearch.value.trim().toLocaleLowerCase("id-ID");
    const selectedCategory = inputFilter.value;

    return actions.filter((action) => {
        const matchesName = action.name.toLocaleLowerCase("id-ID").includes(query);
        const matchesCategory = selectedCategory === "all" || action.category === selectedCategory;
        return matchesName && matchesCategory;
    });
}

function renderActions() {
    const visibleActions = getVisibleActions();
    const fragment = document.createDocumentFragment();

    visibleActions.forEach((action) => {
        fragment.appendChild(createActionItem(action));
    });

    actionList.replaceChildren(fragment);
    emptyState.hidden = visibleActions.length > 0;
    clearAllButton.disabled = actions.length === 0;
    document.getElementById("list-count").textContent =
        `Menampilkan ${visibleActions.length} dari ${actions.length} aksi`;

    if (actions.length === 0) {
        emptyTitle.textContent = "Belum ada aksi tercatat";
        emptyCopy.textContent = "Mulai dari satu langkah kecil dan catat aksi pertamamu.";
    } else {
        emptyTitle.textContent = "Aksi tidak ditemukan";
        emptyCopy.textContent = "Coba ubah kata kunci atau filter kategori.";
    }

    updateStats();
}

function showError(message) {
    errorMessage.textContent = message;
    inputNama.setAttribute("aria-invalid", "true");
}

function clearError() {
    errorMessage.textContent = "";
    inputNama.removeAttribute("aria-invalid");
}

function addAction(event) {
    event.preventDefault();

    const name = inputNama.value.trim();
    const category = inputKategori.value;
    const points = Number(inputPoin.value);

    if (!name) {
        showError("Nama aksi tidak boleh kosong.");
        inputNama.focus();
        return;
    }

    if (!Number.isInteger(points) || points <= 0 || points > 1000) {
        showError("Poin harus berupa bilangan bulat antara 1 dan 1000.");
        inputPoin.focus();
        return;
    }

    clearError();
    actions.unshift({
        id: Date.now(),
        name,
        category,
        points,
    });

    actionForm.reset();
    inputKategori.value = "Reduksi Plastik";
    renderActions();
    inputNama.focus();
}

function deleteAction(id) {
    actions = actions.filter((action) => action.id !== id);
    renderActions();
}

function clearAllActions() {
    actions = [];
    renderActions();
}

actionForm.addEventListener("submit", addAction);
inputSearch.addEventListener("input", renderActions);
inputFilter.addEventListener("change", renderActions);
clearAllButton.addEventListener("click", clearAllActions);

actionList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button) return;
    deleteAction(Number(button.dataset.deleteId));
});

inputNama.addEventListener("input", clearError);
inputPoin.addEventListener("input", clearError);
document.getElementById("today-label").textContent = formatDate(new Date());
renderActions();
