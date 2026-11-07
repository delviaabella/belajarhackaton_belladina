let keranjangData = [];

const daftarKeranjang = document.getElementById("daftar-keranjang");
const totalBarang = document.getElementById("total-barang");
const totalPoin = document.getElementById("total-poin");
const totalHarga = document.getElementById("total-harga");
const tombolCheckout = document.getElementById("tombol-checkout");
const ONGKIR = 5000;

const formatRupiah = (jumlah) =>
    `Rp ${jumlah.toLocaleString("id-ID")}`;

function perbaruiTampilanKeranjang() {
    daftarKeranjang.replaceChildren();

    keranjangData.forEach((item) => {
        const elemenItem = document.createElement("li");
        elemenItem.className = "item-keranjang";

        const deskripsiItem = document.createElement("span");
        deskripsiItem.className = "deskripsi-item-keranjang";
        const subtotal = item.harga * item.qty;
        deskripsiItem.textContent =
            `${item.nama} — ${item.qty} × ${formatRupiah(item.harga)} = ${formatRupiah(subtotal)}`;

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.className = "tombol-hapus-item";
        tombolHapus.textContent = "Hapus";
        tombolHapus.setAttribute("aria-label", `Hapus ${item.nama} dari keranjang`);
        tombolHapus.addEventListener("click", () => hapusItemKeranjang(item.id));

        elemenItem.append(deskripsiItem, tombolHapus);
        daftarKeranjang.appendChild(elemenItem);
    });

    const jumlahBarang = keranjangData.reduce(
        (jumlah, item) => jumlah + item.qty,
        0
    );
    const jumlahPoin = keranjangData.reduce(
        (jumlah, item) => jumlah + item.poin * item.qty,
        0
    );
    const subtotalPesanan = keranjangData.reduce(
        (jumlah, item) => jumlah + item.harga * item.qty,
        0
    );
    const jumlahBayar =
        keranjangData.length === 0 ? 0 : subtotalPesanan + ONGKIR;

    totalBarang.textContent = jumlahBarang;
    totalPoin.textContent = `${jumlahPoin} Poin`;
    totalHarga.textContent = formatRupiah(jumlahBayar);
}

function hapusItemKeranjang(id) {
    keranjangData = keranjangData.filter((item) => item.id !== id);
    perbaruiTampilanKeranjang();
}

document.querySelectorAll(".tombol-tambah-keranjang").forEach((tombol) => {
    tombol.addEventListener("click", () => {
        const kartuProduk = tombol.closest(".kartu-produk");
        if (!kartuProduk) return;

        const nama = kartuProduk.querySelector("h3")?.textContent.trim();
        const { productId: id, price, poin } = kartuProduk.dataset;
        const harga = Number(price);
        const jumlahPoin = Number(poin);

        if (
            !nama ||
            !id ||
            !Number.isFinite(harga) ||
            !Number.isFinite(jumlahPoin)
        ) {
            return;
        }

        const itemAda = keranjangData.find((item) => item.id === id);
        if (itemAda) {
            itemAda.qty += 1;
        } else {
            keranjangData.push({
                id,
                nama,
                harga,
                poin: jumlahPoin,
                qty: 1
            });
        }

        perbaruiTampilanKeranjang();
    });
});

tombolCheckout.addEventListener("click", () => {
    if (keranjangData.length === 0) {
        window.alert("Pilih menu makanan terlebih dahulu!");
        return;
    }

    const subtotalPesanan = keranjangData.reduce(
        (jumlah, item) => jumlah + item.harga * item.qty,
        0
    );
    const jumlahBayar = subtotalPesanan + ONGKIR;

    window.alert(
        `Pesanan ShopeeFood berhasil dibuat! Total biaya: ${formatRupiah(jumlahBayar)}`
    );
    keranjangData = [];
    perbaruiTampilanKeranjang();
});

document.addEventListener("DOMContentLoaded", perbaruiTampilanKeranjang);
