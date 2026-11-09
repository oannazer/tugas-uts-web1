/* Interaksi DOM seluruh halaman Pustaka. Semua penyimpanan hanya di browser lokal. */
(() => {
	"use strict";
	const $ = (selector, root = document) => root.querySelector(selector);
	const $$ = (selector, root = document) => [
		...root.querySelectorAll(selector),
	];
	const safeRead = (key, fallback) => {
		try {
			return JSON.parse(localStorage.getItem(key)) ?? fallback;
		} catch {
			return fallback;
		}
	};
	const safeWrite = (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch {
			tampilkanNotifikasi("Penyimpanan browser tidak tersedia.", "gagal");
			return false;
		}
	};
	const priceNumber = (value) =>
		typeof value === "number"
			? value
			: Number(String(value).replace(/[^\d]/g, "")) || 0;
	const books = () => [
		...dataKatalogBuku.map((book) => ({
			id: book.kodeBarang,
			judul: book.namaBarang,
			penulis: "",
			kategori: book.jenisBarang,
			edisi: book.edisi,
			harga: priceNumber(book.harga),
			stok: Number(book.stok),
			cover: book.cover,
			coverInk: "#6149bf",
		})),
		...safeRead(PUSTAKA_KEYS.addedBooks, []),
	];
	const cart = () => safeRead(PUSTAKA_KEYS.cart, []);
	const orders = () => safeRead(PUSTAKA_KEYS.orders, []);
	const rupiah = (value) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		}).format(value);
	const escapeHTML = (value) =>
		String(value).replace(
			/[&<>"']/g,
			(char) =>
				({
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&#39;",
				})[char],
		);

	function tampilkanNotifikasi(teks, jenis = "berhasil") {
		let area = document.getElementById("areaNotifikasi");
		if (!area) area = document.getElementById("toastRegion");
		if (!area) return;
		const notifikasi = document.createElement("div");
		notifikasi.className = "notifikasi " + jenis;
		notifikasi.textContent = teks;
		area.appendChild(notifikasi);
		setTimeout(function () {
			notifikasi.remove();
		}, 3600);
	}
	function openModal(id) {
		const modal = document.getElementById(id);
		if (modal) {
			modal.hidden = false;
			document.body.style.overflow = "hidden";
			const focusTarget = $("input,button", modal);
			if (focusTarget) window.setTimeout(() => focusTarget.focus(), 30);
		}
	}
	function closeModal(modal) {
		modal.hidden = true;
		document.body.style.overflow = "";
	}
	function bindModals() {
		$$("[data-modal]").forEach((button) =>
			button.addEventListener("click", () => {
				if (button.dataset.modal === "reportModal") renderReport();
				if (button.dataset.modal === "historyModal") renderHistory();
				openModal(button.dataset.modal);
			}),
		);
		$$(".modal-backdrop").forEach((modal) => {
			modal.addEventListener("click", (event) => {
				if (event.target === modal || event.target.closest(".modal-close"))
					closeModal(modal);
			});
		});
		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape")
				$$(".modal-backdrop:not([hidden])").forEach(closeModal);
		});
	}
	function ikatHalamanMasuk() {
		const formMasuk = document.getElementById("formMasuk");
		if (!formMasuk) return;
		const inputEmail = document.getElementById("emailMasuk");
		const inputKataSandi = document.getElementById("kataSandiMasuk");
		const tombolLihatKataSandi = document.getElementById(
			"tombolLihatKataSandi",
		);
		const ikonKataSandi = document.getElementById("ikonKataSandi");

		tombolLihatKataSandi.addEventListener("click", function () {
			if (inputKataSandi.type === "password") {
				inputKataSandi.type = "text";
				ikonKataSandi.src =
					"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/icons/eye-slash.svg";
				ikonKataSandi.alt = "Sembunyikan password";
			} else {
				inputKataSandi.type = "password";
				ikonKataSandi.src =
					"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/icons/eye.svg";
				ikonKataSandi.alt = "Tampilkan password";
			}
		});
		document
			.getElementById("bukaLupaKataSandi")
			.addEventListener("click", function () {
				document.getElementById("dialogLupaKataSandi").showModal();
			});
		document
			.getElementById("bukaDaftarAkun")
			.addEventListener("click", function () {
				document.getElementById("dialogDaftarAkun").showModal();
			});
		document
			.getElementById("tutupLupaKataSandi")
			.addEventListener("click", function () {
				document.getElementById("dialogLupaKataSandi").close();
			});
		document
			.getElementById("tutupDialogDaftarAkun")
			.addEventListener("click", function () {
				document.getElementById("dialogDaftarAkun").close();
			});
		formMasuk.addEventListener("submit", function (peristiwa) {
			peristiwa.preventDefault();
			const emailMasuk = inputEmail.value.trim();
			const kataSandi = inputKataSandi.value;
			let masukBerhasil = false;
			let namaPengguna = "";
			for (let i = 0; i < dataPengguna.length; i++) {
				if (
					dataPengguna[i].email.toLowerCase() === emailMasuk.toLowerCase() &&
					dataPengguna[i].password === kataSandi
				) {
					masukBerhasil = true;
					namaPengguna = dataPengguna[i].nama;
				}
			}
			if (masukBerhasil) {
				sessionStorage.setItem("namaPengguna", namaPengguna);
				window.location.href = "dashboard.html";
			} else
				tampilkanNotifikasi(
					"Email atau password yang dimasukkan salah.",
					"gagal",
				);
		});
		const formLupaKataSandi = document.getElementById("formLupaKataSandi");
		formLupaKataSandi.addEventListener("submit", function (peristiwa) {
			peristiwa.preventDefault();
			const emailLupa = document
				.getElementById("emailLupaKataSandi")
				.value.trim()
				.toLowerCase();
			let emailTerdaftar = false;
			for (let i = 0; i < dataPengguna.length; i++) {
				if (dataPengguna[i].email.toLowerCase() === emailLupa)
					emailTerdaftar = true;
			}
			if (emailTerdaftar) {
				document.getElementById("dialogLupaKataSandi").close();
				tampilkanNotifikasi(
					"Email terdaftar. Permintaan reset password berhasil diperiksa.",
				);
				formLupaKataSandi.reset();
			} else {
				document.getElementById("dialogLupaKataSandi").close();
				tampilkanNotifikasi(
					"Email belum terdaftar. Silakan buat akun terlebih dahulu.",
					"gagal",
				);
			}
		});
		const formDaftarAkun = document.getElementById("formDaftarAkun");
		formDaftarAkun.addEventListener("submit", function (peristiwa) {
			peristiwa.preventDefault();
			const emailBaru = document.getElementById("emailDaftarAkun").value.trim();
			let emailSudahAda = false;
			for (let i = 0; i < dataPengguna.length; i++) {
				if (dataPengguna[i].email.toLowerCase() === emailBaru.toLowerCase())
					emailSudahAda = true;
			}
			if (emailSudahAda) {
				document.getElementById("dialogDaftarAkun").close();
				tampilkanNotifikasi(
					"Email sudah terdaftar. Silakan masuk atau gunakan email lain.",
					"gagal",
				);
			} else {
				const akunBaru = {
					id: dataPengguna.length + 1,
					nama: document.getElementById("namaDaftarAkun").value.trim(),
					email: emailBaru,
					password: document.getElementById("kataSandiDaftarAkun").value,
					role: "User",
				};
				dataPengguna.push(akunBaru);
				document.getElementById("dialogDaftarAkun").close();
				tampilkanNotifikasi(
					"Pendaftaran berhasil. Akun ditambahkan ke dataPengguna untuk sesi ini. Silakan masuk sebelum halaman dimuat ulang.",
				);
				formDaftarAkun.reset();
			}
		});
	}
	function renderBookCard(book) {
		const cover = book.cover
			? `<img class="book-cover-image" src="${escapeHTML(book.cover)}" alt="Sampul ${escapeHTML(book.judul)}" loading="lazy">`
			: `<div class="book-cover" style="--cover:${escapeHTML(book.coverColor || "#eee9ff")};--cover-ink:${escapeHTML(book.coverInk || "#6149bf")}"><span class="cover-initial">${escapeHTML(book.judul.slice(0, 1))}</span></div>`;
		return `<article class="book-card">${cover}<div class="book-info"><span class="book-category">${escapeHTML(book.kategori)}${book.edisi ? ` · Edisi ${escapeHTML(book.edisi)}` : ""}</span><h3>${escapeHTML(book.judul)}</h3><p class="book-author">${book.penulis ? escapeHTML(book.penulis) : `Kode: ${escapeHTML(book.id)}`}</p><div class="book-meta"><strong class="book-price">${rupiah(book.harga)}</strong><span class="stock-pill ${book.stok < 5 ? "low" : ""}">Stok ${book.stok}</span></div><div class="book-actions"><button type="button" class="button button-secondary" data-add="${escapeHTML(book.id)}" ${book.stok < 1 ? "disabled" : ""}>Tambah pesanan</button></div></div></article>`;
	}
	function tampilkanKatalog(kataKunci = "") {
		const container = $("#daftarBuku");
		if (!container) return;
		const daftarSemuaBuku = books();
		const kataCari = kataKunci.toLowerCase();
		const daftarCocok = [];
		for (let i = 0; i < daftarSemuaBuku.length; i++) {
			const buku = daftarSemuaBuku[i];
			if (
				buku.judul.toLowerCase().includes(kataCari) ||
				buku.id.toLowerCase().includes(kataCari)
			)
				daftarCocok.push(buku);
		}
		document.getElementById("jumlahBuku").textContent =
			daftarCocok.length + " judul buku";
		document.getElementById("pesanKosong").textContent =
			daftarCocok.length === 0
				? "Buku tidak ditemukan. Coba kata kunci lain."
				: "";
		let isiKatalog = "";
		for (let i = 0; i < daftarCocok.length; i++) {
			const buku = daftarCocok[i];
			let gambarSampul = "<div>" + escapeHTML(buku.judul.charAt(0)) + "</div>";
			if (buku.cover)
				gambarSampul =
					'<img src="' +
					escapeHTML(buku.cover) +
					'" alt="Sampul ' +
					escapeHTML(buku.judul) +
					'">';
			let tandaStok = "";
			if (buku.stok <= 200) tandaStok = " stok-menipis";
			isiKatalog +=
				"<article" +
				(tandaStok ? ' class="stok-menipis"' : "") +
				">" +
				gambarSampul +
				"<h3>" +
				escapeHTML(buku.judul) +
				"</h3><p>Kode: " +
				escapeHTML(buku.id) +
				"</p><p>Jenis: " +
				escapeHTML(buku.kategori) +
				" · Edisi: " +
				escapeHTML(buku.edisi || "-") +
				"</p><p>Stok: " +
				buku.stok +
				"</p><strong>" +
				rupiah(buku.harga) +
				'</strong><button id="tombolPesan' +
				i +
				'" type="button"' +
				(buku.stok < 1 ? " disabled" : "") +
				">Tambah ke pesanan</button></article>";
		}
		container.innerHTML = isiKatalog;
		for (let i = 0; i < daftarCocok.length; i++) {
			document
				.getElementById("tombolPesan" + i)
				.addEventListener("click", function () {
					addToCart(daftarCocok[i].id);
				});
		}
	}
	function renderFeatured() {
		const target = $("#featuredBooks");
		if (target) {
			target.innerHTML = books().slice(0, 3).map(renderBookCard).join("");
			$$("[data-add]", target).forEach((button) =>
				button.addEventListener("click", () => addToCart(button.dataset.add)),
			);
		}
	}
	function addToCart(id) {
		const book = books().find((item) => item.id === id);
		if (!book) return;
		const items = cart();
		const line = items.find((item) => item.id === id);
		if ((line?.qty || 0) >= book.stok)
			return tampilkanNotifikasi(
				"Jumlah pesanan sudah mencapai stok tersedia.",
				"gagal",
			);
		if (line) line.qty += 1;
		else items.push({ id, qty: 1 });
		safeWrite(PUSTAKA_KEYS.cart, items);
		updateCartCount();
		tampilkanKeranjang();
		tampilkanNotifikasi(`${book.judul} ditambahkan ke pesanan.`);
	}
	function updateCartCount() {
		const count = $("#cartCount");
		if (count)
			count.textContent = cart().reduce((sum, line) => sum + line.qty, 0);
	}
	function tampilkanKeranjang() {
		const target = document.getElementById("daftarKeranjang");
		if (!target) return;
		const daftarPesanan = cart();
		const daftarBuku = books();
		let isiKeranjang = "";
		let total = 0;
		for (let i = 0; i < daftarPesanan.length; i++) {
			let buku = null;
			for (let j = 0; j < daftarBuku.length; j++) {
				if (daftarBuku[j].id === daftarPesanan[i].id) buku = daftarBuku[j];
			}
			if (buku !== null) {
				const subtotal = buku.harga * daftarPesanan[i].qty;
				total += subtotal;
				isiKeranjang +=
					"<article><h3>" +
					escapeHTML(buku.judul) +
					"</h3><p>" +
					rupiah(buku.harga) +
					' per buku</p><div><button id="kurangiJumlah' +
					i +
					'" type="button">−</button> ' +
					daftarPesanan[i].qty +
					' <button id="tambahJumlah' +
					i +
					'" type="button"' +
					(daftarPesanan[i].qty >= buku.stok ? " disabled" : "") +
					">+</button>" +
					'<button id="hapusBuku' +
					i +
					'" type="button">Hapus</button></div><strong>Subtotal: ' +
					rupiah(subtotal) +
					"</strong></article>";
			}
		}
		if (isiKeranjang === "")
			isiKeranjang =
				'<p>Keranjang masih kosong. <a href="stok.html">Pilih buku dari katalog</a>.</p>';
		target.innerHTML = isiKeranjang;
		document.getElementById("totalPembayaran").textContent =
			"Total pembayaran: " + rupiah(total);
		for (let i = 0; i < daftarPesanan.length; i++) {
			const nomorBuku = daftarPesanan[i].id;
			const tombolKurangi = document.getElementById("kurangiJumlah" + i);
			const tombolTambah = document.getElementById("tambahJumlah" + i);
			const tombolHapus = document.getElementById("hapusBuku" + i);
			if (tombolKurangi)
				tombolKurangi.addEventListener("click", function () {
					ubahJumlahPesanan(nomorBuku, -1);
				});
			if (tombolTambah)
				tombolTambah.addEventListener("click", function () {
					ubahJumlahPesanan(nomorBuku, 1);
				});
			if (tombolHapus)
				tombolHapus.addEventListener("click", function () {
					hapusBukuDariPesanan(nomorBuku);
				});
		}
	}
	function ubahJumlahPesanan(nomorBuku, perubahan) {
		const daftarPesanan = cart();
		const daftarBuku = books();
		for (let i = 0; i < daftarPesanan.length; i++) {
			if (daftarPesanan[i].id === nomorBuku) {
				for (let j = 0; j < daftarBuku.length; j++) {
					if (
						daftarBuku[j].id === nomorBuku &&
						perubahan > 0 &&
						daftarPesanan[i].qty >= daftarBuku[j].stok
					) {
						tampilkanNotifikasi("Jumlah pesanan melebihi stok buku.", "gagal");
						return;
					}
				}
				daftarPesanan[i].qty += perubahan;
				if (daftarPesanan[i].qty < 1) daftarPesanan.splice(i, 1);
			}
		}
		safeWrite(PUSTAKA_KEYS.cart, daftarPesanan);
		updateCartCount();
		tampilkanKeranjang();
	}
	function hapusBukuDariPesanan(nomorBuku) {
		const daftarPesanan = cart();
		for (let i = 0; i < daftarPesanan.length; i++) {
			if (daftarPesanan[i].id === nomorBuku) daftarPesanan.splice(i, 1);
		}
		safeWrite(PUSTAKA_KEYS.cart, daftarPesanan);
		updateCartCount();
		tampilkanKeranjang();
	}
	function ikatFormTambahBuku() {
		const form = document.getElementById("formTambahBuku");
		if (!form) return;
		document
			.getElementById("bukaFormBuku")
			.addEventListener("click", function () {
				document.getElementById("dialogTambahBuku").showModal();
			});
		document
			.getElementById("tutupFormBuku")
			.addEventListener("click", function () {
				document.getElementById("dialogTambahBuku").close();
			});
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			const kodeBuku = document.getElementById("kodeBukuBaru").value.trim();
			let kodeSudahAda = false;
			const semuaBuku = books();
			for (let i = 0; i < semuaBuku.length; i++) {
				if (semuaBuku[i].id.toLowerCase() === kodeBuku.toLowerCase())
					kodeSudahAda = true;
			}
			if (kodeSudahAda) {
				tampilkanNotifikasi(
					"Kode buku sudah dipakai. Gunakan kode lain.",
					"gagal",
				);
				return;
			}
			const daftarBukuTambahan = safeRead(PUSTAKA_KEYS.addedBooks, []);
			daftarBukuTambahan.push({
				id: kodeBuku,
				judul: document.getElementById("namaBukuBaru").value.trim(),
				penulis: "",
				kategori: document.getElementById("jenisBukuBaru").value.trim(),
				edisi: document.getElementById("edisiBukuBaru").value.trim(),
				harga: Number(document.getElementById("hargaBukuBaru").value),
				stok: Number(document.getElementById("stokBukuBaru").value),
				cover: "",
			});
			safeWrite(PUSTAKA_KEYS.addedBooks, daftarBukuTambahan);
			document.getElementById("dialogTambahBuku").close();
			form.reset();
			tampilkanKatalog(document.getElementById("pencarianBuku").value);
			renderFeatured();
			updateStats();
			tampilkanNotifikasi("Buku berhasil ditambahkan ke katalog.");
		});
	}
	function ikatFormCheckout() {
		const form = document.getElementById("formCheckout");
		if (!form) return;
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			const daftarPesanan = cart();
			if (daftarPesanan.length === 0) {
				return tampilkanNotifikasi(
					"Tambahkan minimal satu buku ke keranjang.",
					"gagal",
				);
			}
			let total = 0;
			const daftarBuku = books();
			for (let i = 0; i < daftarPesanan.length; i++) {
				for (let j = 0; j < daftarBuku.length; j++) {
					if (daftarPesanan[i].id === daftarBuku[j].id) {
						total += daftarBuku[j].harga * daftarPesanan[i].qty;
					}
				}
			}
			const number = `${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
			const order = {
				nomor: number,
				nama: document.getElementById("namaPemesan").value.trim(),
				email: document.getElementById("emailPemesan").value.trim(),
				telepon: document.getElementById("teleponPemesan").value.trim(),
				alamat: document.getElementById("alamatPengiriman").value.trim(),
				pembayaran: document.getElementById("metodePembayaran").value,
				total,
				dibuat: new Date().toLocaleDateString("id-ID", { dateStyle: "medium" }),
				status: "Pesanan diproses",
				tahap: 1,
				items: daftarPesanan,
			};
			const daftarRiwayatPesanan = orders();
			daftarRiwayatPesanan.unshift(order);
			safeWrite(PUSTAKA_KEYS.orders, daftarRiwayatPesanan);
			safeWrite(PUSTAKA_KEYS.cart, []);
			form.reset();
			updateCartCount();
			tampilkanKeranjang();
			updateStats();
			tampilkanNotifikasi(`Pesanan dibuat. Nomor delivery order: ${number}`);
		});
	}
	function tampilkanTracking(pesanan) {
		const target = document.getElementById("hasilTracking");
		if (!target) return;
		if (pesanan === null) {
			document.getElementById("pesanTracking").textContent =
				"Nomor DO tidak ditemukan. Periksa kembali nomornya atau buat pesanan baru.";
			target.innerHTML = "";
			return;
		}
		document.getElementById("pesanTracking").textContent = "";
		const tahapan = [
			"Pesanan diproses",
			"Dalam perjalanan",
			"Pesanan diterima",
		];
		let isiProgres = "";
		for (let i = 0; i < tahapan.length; i++) {
			let kelasProgres = "";
			if (i < pesanan.tahap) kelasProgres = "selesai";
			isiProgres += '<li class="' + kelasProgres + '">' + tahapan[i] + "</li>";
		}
		let isiRiwayat = "";
		if (pesanan.perjalanan) {
			for (let i = 0; i < pesanan.perjalanan.length; i++) {
				isiRiwayat +=
					"<li><strong>" +
					escapeHTML(pesanan.perjalanan[i].keterangan) +
					"</strong><br><small>" +
					escapeHTML(pesanan.perjalanan[i].waktu) +
					"</small></li>";
			}
		}
		if (isiRiwayat === "")
			isiRiwayat = "<li>Riwayat perjalanan belum tersedia.</li>";
		let isiBuku = pesanan.buku || "";
		if (pesanan.items) {
			const daftarBuku = books();
			for (let i = 0; i < pesanan.items.length; i++) {
				for (let j = 0; j < daftarBuku.length; j++) {
					if (pesanan.items[i].id === daftarBuku[j].id) {
						isiBuku +=
							daftarBuku[j].judul + " (" + pesanan.items[i].qty + "), ";
					}
				}
			}
		}
		if (isiBuku === "") isiBuku = "Buku pilihan";
		let tanggal = pesanan.tanggalKirim || pesanan.dibuat || "Belum tersedia";
		let kurir = pesanan.ekspedisi || "Menunggu kurir";
		let paket = pesanan.jenisPaket || pesanan.paket || "Reguler";
		target.innerHTML =
			"<article><h2>Nomor DO: " +
			escapeHTML(pesanan.nomor) +
			"</h2><p>Pemesan: " +
			escapeHTML(pesanan.nama) +
			"</p><p>Status: <strong>" +
			escapeHTML(pesanan.status) +
			"</strong></p><h3>Progres pesanan</h3><ol>" +
			isiProgres +
			"</ol><p>Ekspedisi: " +
			escapeHTML(kurir) +
			"</p><p>Tanggal kirim: " +
			escapeHTML(tanggal) +
			"</p><p>Jenis paket: " +
			escapeHTML(paket) +
			"</p><p>Total pembayaran: " +
			rupiah(priceNumber(pesanan.total)) +
			"</p><p>Isi paket: " +
			escapeHTML(isiBuku) +
			"</p><h3>Riwayat perjalanan</h3><ul>" +
			isiRiwayat +
			"</ul></article>";
	}
	function cariPesanan(nomorDO) {
		const kodeCari = nomorDO.trim().toUpperCase();
		let hasil = null;
		for (let nomor in dataTracking) {
			if (nomor.toUpperCase() === kodeCari) {
				const pesananAwal = dataTracking[nomor];
				let nomorTahap = 1;
				if (
					pesananAwal.status.toLowerCase().includes("perjalanan") ||
					pesananAwal.status.toLowerCase().includes("dikirim")
				)
					nomorTahap = 2;
				if (
					pesananAwal.status.toLowerCase().includes("selesai") ||
					pesananAwal.status.toLowerCase().includes("diterima")
				)
					nomorTahap = 3;
				hasil = {
					nomor: pesananAwal.nomorDO,
					nama: pesananAwal.nama,
					status: pesananAwal.status,
					tahap: nomorTahap,
					ekspedisi: pesananAwal.ekspedisi,
					tanggalKirim: pesananAwal.tanggalKirim,
					paket: pesananAwal.paket,
					total: pesananAwal.total,
					perjalanan: pesananAwal.perjalanan,
				};
			}
		}
		const daftarPesananLokal = orders();
		for (let i = 0; i < daftarPesananLokal.length; i++) {
			if (daftarPesananLokal[i].nomor.toUpperCase() === kodeCari)
				hasil = daftarPesananLokal[i];
		}
		tampilkanTracking(hasil);
	}
	function ikatFormTracking() {
		const form = document.getElementById("formTracking");
		if (!form) return;
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			cariPesanan(document.getElementById("nomorDO").value);
		});
		document
			.getElementById("tombolDemoSatu")
			.addEventListener("click", function () {
				document.getElementById("nomorDO").value = "2025-20230012";
				cariPesanan("2025-20230012");
			});
		document
			.getElementById("tombolDemoDua")
			.addEventListener("click", function () {
				document.getElementById("nomorDO").value = "2025-20230013";
				cariPesanan("2025-20230013");
			});
	}
	function updateStats() {
		const count = $("#bookCount");
		if (!count) return;
		const list = books();
		$("#bookCount").textContent = list.length;
		$("#stockCount").textContent = list.reduce(
			(sum, book) => sum + book.stok,
			0,
		);
		$("#orderCount").textContent = orders().length;
	}
	function renderReport() {
		const target = $("#reportContent");
		if (!target) return;
		const list = books();
		target.innerHTML = `<div class="report-tile"><strong>${list.length}</strong><span>judul buku di katalog</span></div><div class="report-tile"><strong>${list.reduce((sum, book) => sum + book.stok, 0)}</strong><span>eksemplar tersedia</span></div><div class="report-tile"><strong>${list.filter((book) => book.stok < 5).length}</strong><span>judul dengan stok rendah</span></div><div class="report-tile"><strong>${orders().length}</strong><span>pesanan lokal tersimpan</span></div>`;
	}
	function renderHistory() {
		const target = $("#historyContent");
		if (!target) return;
		const list = orders();
		if (!list.length) {
			target.innerHTML =
				'<div class="empty-table">Belum ada transaksi. Pesanan yang dibuat akan muncul di sini.</div>';
			return;
		}
		target.innerHTML = `<table class="data-table"><thead><tr><th>Nomor DO</th><th>Pemesan</th><th>Tanggal</th><th>Status</th><th>Total</th></tr></thead><tbody>${list.map((order) => `<tr><td>${escapeHTML(order.nomor)}</td><td>${escapeHTML(order.nama)}</td><td>${escapeHTML(order.dibuat)}</td><td>${escapeHTML(order.status)}</td><td>${rupiah(order.total)}</td></tr>`).join("")}</tbody></table>`;
	}
	function siapkanDashboard() {
		if (!document.getElementById("sapaanWaktu")) return;
		const namaPengguna = sessionStorage.getItem("namaPengguna") || "Admin";
		const jamSekarang = new Date().getHours();
		let sapaan = "Selamat malam";
		if (jamSekarang < 11) sapaan = "Selamat pagi";
		else if (jamSekarang < 15) sapaan = "Selamat siang";
		else if (jamSekarang < 18) sapaan = "Selamat sore";
		document.getElementById("sapaanWaktu").textContent =
			sapaan + ", " + namaPengguna;
		document.getElementById("namaAdmin").textContent = namaPengguna;
		document.getElementById("tanggalHariIni").textContent =
			new Date().toLocaleDateString("id-ID");

		const daftarBuku = books();
		const daftarPesanan = [];
		for (let nomorDO in dataTracking) {
			const pesananAwal = dataTracking[nomorDO];
			daftarPesanan.push({
				nomor: pesananAwal.nomorDO,
				nama: pesananAwal.nama,
				tanggal: pesananAwal.tanggalKirim,
				status: pesananAwal.status,
				total: priceNumber(pesananAwal.total),
			});
		}
		const daftarPesananLokal = orders();
		for (let i = 0; i < daftarPesananLokal.length; i++) {
			daftarPesanan.push({
				nomor: daftarPesananLokal[i].nomor,
				nama: daftarPesananLokal[i].nama,
				tanggal: daftarPesananLokal[i].dibuat,
				status: daftarPesananLokal[i].status,
				total: daftarPesananLokal[i].total,
			});
		}

		let jumlahStok = 0;
		let jumlahStokMenipis = 0;
		const daftarStokMenipis = document.getElementById("daftarStokMenipis");
		daftarStokMenipis.innerHTML = "";
		for (let i = 0; i < daftarBuku.length; i++) {
			const buku = daftarBuku[i];
			jumlahStok += Number(buku.stok);
			if (Number(buku.stok) <= 200) {
				const itemBuku = document.createElement("li");
				itemBuku.textContent = buku.judul + " - stok " + buku.stok;
				daftarStokMenipis.appendChild(itemBuku);
				jumlahStokMenipis++;
			}
		}
		document.getElementById("jumlahJudulBuku").textContent = daftarBuku.length;
		document.getElementById("jumlahStokBuku").textContent = jumlahStok;
		document.getElementById("jumlahPesanan").textContent = daftarPesanan.length;
		if (jumlahStokMenipis === 0) {
			document.getElementById("pesanStok").textContent =
				"Semua stok buku masih mencukupi.";
		} else {
			document.getElementById("pesanStok").textContent =
				"Buku dengan stok 200 atau kurang:";
		}

		const isiLaporan = document.getElementById("isiLaporan");
		const ringkasanLaporan = [
			"Jumlah judul buku: " + daftarBuku.length,
			"Total stok: " + jumlahStok,
			"Jumlah pesanan: " + daftarPesanan.length,
			"Buku dengan stok 200 atau kurang: " + jumlahStokMenipis,
		];
		isiLaporan.innerHTML = "";
		for (let i = 0; i < ringkasanLaporan.length; i++) {
			const barisLaporan = document.createElement("li");
			barisLaporan.textContent = ringkasanLaporan[i];
			isiLaporan.appendChild(barisLaporan);
		}
		for (let i = 0; i < daftarPesanan.length; i++) {
			const barisLaporan = document.createElement("li");
			barisLaporan.textContent =
				daftarPesanan[i].nomor +
				" - " +
				daftarPesanan[i].nama +
				" - " +
				daftarPesanan[i].status +
				" - " +
				rupiah(daftarPesanan[i].total);
			isiLaporan.appendChild(barisLaporan);
		}

		const isiRiwayat = document.getElementById("isiRiwayat");
		isiRiwayat.innerHTML = "";
		if (daftarPesanan.length === 0) {
			const pesanKosong = document.createElement("li");
			pesanKosong.textContent = "Belum ada histori transaksi.";
			isiRiwayat.appendChild(pesanKosong);
		}
		for (let i = 0; i < daftarPesanan.length; i++) {
			const pesanan = daftarPesanan[i];
			const barisRiwayat = document.createElement("li");
			barisRiwayat.textContent =
				pesanan.nomor +
				" - " +
				pesanan.nama +
				" - " +
				pesanan.tanggal +
				" — " +
				pesanan.status +
				" - " +
				rupiah(pesanan.total);
			isiRiwayat.appendChild(barisRiwayat);
		}

		document
			.getElementById("bukaLaporan")
			.addEventListener("click", function () {
				document.getElementById("dialogLaporan").showModal();
			});
		document
			.getElementById("tutupLaporan")
			.addEventListener("click", function () {
				document.getElementById("dialogLaporan").close();
			});
		document
			.getElementById("bukaRiwayat")
			.addEventListener("click", function () {
				document.getElementById("dialogRiwayat").showModal();
			});
		document
			.getElementById("tutupRiwayat")
			.addEventListener("click", function () {
				document.getElementById("dialogRiwayat").close();
			});
		document
			.getElementById("tombolKeluar")
			.addEventListener("click", function () {
				sessionStorage.removeItem("namaPengguna");
				window.location.href = "index.html";
			});
	}
	function siapkanMenuNavigasi() {
		const tombolBukaMenu = document.getElementById("tombolBukaMenu");
		if (!tombolBukaMenu) return;
		const menuNavigasi = document.querySelector("aside");
		const tombolTutupMenu = document.getElementById("tombolTutupMenu");
		tombolBukaMenu.addEventListener("click", function () {
			menuNavigasi.classList.add("menu-terbuka");
		});
		tombolTutupMenu.addEventListener("click", function () {
			menuNavigasi.classList.remove("menu-terbuka");
		});
		const pilihanMenu = menuNavigasi.querySelectorAll("nav a, nav button");
		for (let i = 0; i < pilihanMenu.length; i++) {
			pilihanMenu[i].addEventListener("click", function () {
				menuNavigasi.classList.remove("menu-terbuka");
			});
		}
	}
	function init() {
		bindModals();
		ikatHalamanMasuk();
		siapkanMenuNavigasi();
		siapkanDashboard();
		const search = document.getElementById("pencarianBuku") || $("#bookSearch");
		if (search) {
			tampilkanKatalog();
			search.addEventListener("input", function () {
				tampilkanKatalog(search.value);
			});
		}
		ikatFormTambahBuku();
		updateCartCount();
		tampilkanKeranjang();
		ikatFormCheckout();
		ikatFormTracking();
		$$("[data-logout]").forEach((button) =>
			button.addEventListener("click", () => {
				sessionStorage.removeItem("pustaka-signed-in");
				location.href = "index.html";
			}),
		);
	}
	document.addEventListener("DOMContentLoaded", init);
})();
