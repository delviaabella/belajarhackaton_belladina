// Gunakan deklarasi ini hanya jika cartData belum ada di script.js.
let cartData = [];

const cartList = document.getElementById("cart-list");

// Render ulang isi keranjang.
function renderCart() {
    cartList.replaceChildren();

    cartData.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent =
            `${item.nama} — ${item.qty} × Rp${item.harga.toLocaleString("id-ID")} (${item.poin} poin)`;
        cartList.appendChild(listItem);
    });
}

// Event delegation untuk tombol tambah ke keranjang.
document.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-add-cart");
    if (!button) return;

    const productCard = button.closest(".product-card");
    if (!productCard) return;

    const productData = button.dataset.productId
        ? button.dataset
        : productCard.dataset;

    const nama = productCard.querySelector("h3")?.textContent.trim();
    const id = productData.productId;
    const harga = Number(productData.price);
    const poin = Number(productData.poin);

    if (!nama || !id || !Number.isFinite(harga) || !Number.isFinite(poin)) return;

    const existingItem = cartData.find((item) => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cartData.push({ id, nama, harga, poin, qty: 1 });
    }

    renderCart();
});