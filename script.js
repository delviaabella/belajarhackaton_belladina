"use strict";

const dummyData = [
    { nama: "Membawa Tumbler", kategori: "Reduksi Plastik", poin: 10 },
    { nama: "Hemat Listrik AC", kategori: "Hemat Energi", poin: 20 },
    { nama: "Daur Ulang Kertas", kategori: "Daur Ulang", poin: 15 },
    { nama: "Membawa Tas Belanja Pakai Ulang", kategori: "Reduksi Plastik", poin: 10 },
    { nama: "Mematikan Lampu Setelah Kelas", kategori: "Hemat Energi", poin: 15 },
];

const TARGET_POIN = 100;
let totalAksi = 1;
let totalPoin = 10;

document.addEventListener("DOMContentLoaded", () => {
    const actionForm = document.getElementById("action-form");
    const actionList = document.getElementById("action-list");
    const inputNama = document.getElementById("input-nama");
    const inputKategori = document.getElementById("input-kategori");
    const inputPoin = document.getElementById("input-poin");
    const errorMessage = document.getElementById("error-message");
    const clearAllButton = document.getElementById("btn-clear-all");
    const emptyState = document.querySelector("#empty-state");

    function updateStats() {
        document.getElementById("stat-total-aksi").textContent = totalAksi;
        document.getElementById("stat-total-poin").textContent = totalPoin;

        const targetStatus = document.getElementById("stat-target");
        const targetReached = totalPoin >= TARGET_POIN;
        targetStatus.textContent = targetReached ? "Tercapai" : "Dalam progres";
        targetStatus.classList.toggle("is-complete", targetReached);
    }

    function updateEmptyState() {
        const isEmpty = actionList.children.length === 0;
        emptyState.hidden = !isEmpty;
        document.getElementById("list-count").textContent = `${totalAksi} aksi tercatat`;
    }

    function getCategoryClass(category) {
        if (category === "Reduksi Plastik") return "category-plastic";
        if (category === "Hemat Energi") return "category-energy";
        return "category-recycle";
    }

    function createActionItem(action) {
        const item = document.createElement("li");
        item.className = "action-item";
        item.dataset.poin = String(action.poin);

        const categoryIcon = document.createElement("span");
        categoryIcon.className = `category-icon ${getCategoryClass(action.kategori)}`;
        categoryIcon.setAttribute("aria-hidden", "true");
        categoryIcon.textContent = action.kategori === "Reduksi Plastik"
            ? "↘"
            : action.kategori === "Hemat Energi" ? "ϟ" : "⟳";

        const text = document.createElement("span");
        text.className = "item-text";
        text.textContent = `[${action.kategori}] ${action.nama} (${action.poin} Poin)`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-delete";
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.setAttribute("aria-label", `Hapus aksi ${action.nama}`);
        deleteButton.addEventListener("click", () => deleteAction(item));

        item.append(categoryIcon, text, deleteButton);
        return item;
    }

    function addAction(action) {
        const item = createActionItem(action);
        actionList.appendChild(item);
        totalAksi += 1;
        totalPoin += action.poin;
    }

    function deleteAction(item) {
        const points = Number(item.dataset.poin);
        item.remove();
        totalAksi -= 1;
        totalPoin -= points;
        updateStats();
        updateEmptyState();
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function addActionFromForm(event) {
        event.preventDefault();

        const nama = inputNama.value.trim();
        const kategori = inputKategori.value;
        const poin = Number(inputPoin.value);

        if (nama === "" || !Number.isFinite(poin) || poin <= 0) {
            showError("Harap isi semua kolom dengan nilai angka poin yang valid!");
            return;
        }

        errorMessage.textContent = "";
        addAction({ nama, kategori, poin });
        updateStats();
        updateEmptyState();
        actionForm.reset();
        inputNama.focus();
    }

    function clearAllActions() {
        actionList.innerHTML = "";
        totalAksi = 0;
        totalPoin = 0;
        updateStats();
        updateEmptyState();
    }

    actionForm.addEventListener("submit", addActionFromForm);
    clearAllButton.addEventListener("click", clearAllActions);

    const defaultDeleteButton = document.querySelector("#action-list .btn-delete");
    defaultDeleteButton.addEventListener("click", () => {
        deleteAction(defaultDeleteButton.closest(".action-item"));
    });

    // Data pertama sudah ditampilkan sebagai aksi bawaan di HTML.
    dummyData.slice(1).forEach(addAction);

    document.getElementById("today-label").textContent =
        new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date());

    updateStats();
    updateEmptyState();
});
