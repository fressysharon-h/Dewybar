// ============================================================
//  DEWY BAR — app.js v3.0 (STANDALONE / OFFLINE MODE)
//  Semua data produk tersimpan lokal, keranjang pakai localStorage
//  TIDAK membutuhkan backend / server Flask
// ============================================================

// ── STATIC DATA: Farmers & Products ─────────────────────────
const FARMERS_DATA = [
  {id:1, name:"Pak Budi Santoso",  location:"Batu, Malang",           specialty:"Apel Organik",      photo:"👨‍🌾", bio:"Petani apel berpengalaman 15 tahun di lereng Gunung Arjuno. Menggunakan metode pertanian organik dan ramah lingkungan.", product_ids:[1,2]},
  {id:2, name:"Bu Sari Dewi",      location:"Probolinggo, Jawa Timur", specialty:"Mangga Premium",    photo:"👩‍🌾", bio:"Perkebunan mangga organik seluas 2 hektar. Menghasilkan mangga harum manis kualitas ekspor.", product_ids:[3]},
  {id:3, name:"Pak Hendra",        location:"Lumajang, Jawa Timur",    specialty:"Pisang Organik",    photo:"🧑‍🌾", bio:"Kebun pisang organik di kaki Gunung Semeru. Pisang dipanen pada tingkat kematangan optimal.", product_ids:[4]},
  {id:4, name:"Pak Agus",          location:"Ngawi, Jawa Timur",       specialty:"Semangka Non-Biji", photo:"👨‍🌾", bio:"Spesialis semangka non-biji dengan metode pertanian modern dan irigasi tetes.", product_ids:[5]},
  {id:5, name:"Pak Joko",          location:"Dieng, Wonosobo",         specialty:"Stroberi Organik",  photo:"🧑‍🌾", bio:"Perkebunan stroberi organik di ketinggian 2000 mdpl dengan udara segar dan suhu dingin.", product_ids:[8]},
  {id:6, name:"Dapur Dewy Bar",    location:"Malang, Jawa Timur",      specialty:"Olahan Buah Segar", photo:"👩‍🍳", bio:"Tim ahli nutrisi Dewy Bar yang mengolah buah pilihan menjadi minuman segar tanpa pengawet.", product_ids:[9,10,11,12,13,14,16]},
];

const PRODUCTS_DATA = [
  {id:1,  name:"Apel Fuji Premium",      category:"buah",   price:35000, sale_price:25000, weight:500,  rating:4.8, flash_sale:true,  best_seller:true,  farmer_id:1, description:"Apel Fuji segar langsung dari kebun pegunungan Batu. Rasa manis-asam sempurna, renyah, dan kaya vitamin.", vitamins:"Vitamin C, Vitamin K, Kalium, Serat Pangan", fun_fact:"Satu apel sehari bisa mengurangi risiko penyakit jantung hingga 20%!"},
  {id:2,  name:"Apel Hijau Granny Smith",category:"buah",   price:38000, sale_price:28000, weight:500,  rating:4.5, flash_sale:false, best_seller:false, farmer_id:1, description:"Apel hijau asam segar, cocok untuk jus, salad buah, atau camilan diet sehat.", vitamins:"Vitamin C, Vitamin K, Serat, Kalium", fun_fact:"Apel hijau memiliki kandungan gula lebih rendah dibanding apel merah – ideal untuk diet!"},
  {id:3,  name:"Mangga Harum Manis",     category:"buah",   price:28000, sale_price:20000, weight:600,  rating:4.9, flash_sale:true,  best_seller:true,  farmer_id:2, description:"Mangga harum manis asli Probolinggo, daging tebal, manis legit, aroma khas yang menggoda.", vitamins:"Vitamin A, Vitamin C, Vitamin B6, Folat", fun_fact:"Mangga adalah buah tropis terpopuler di dunia, dikonsumsi lebih dari 1 miliar orang setiap harinya!"},
  {id:4,  name:"Pisang Cavendish",       category:"buah",   price:18000, sale_price:13000, weight:700,  rating:4.6, flash_sale:false, best_seller:true,  farmer_id:3, description:"Pisang Cavendish matang sempurna, manis alami, cocok untuk sarapan atau camilan sehat.", vitamins:"Vitamin B6, Kalium, Vitamin C, Magnesium", fun_fact:"Pisang mengandung tryptophan yang diubah tubuh menjadi serotonin — hormon kebahagiaan!"},
  {id:5,  name:"Semangka Non-Biji",      category:"buah",   price:32000, sale_price:22000, weight:2000, rating:4.7, flash_sale:true,  best_seller:true,  farmer_id:4, description:"Semangka non-biji super segar, daging merah renyah, manis dingin, kandungan air 92%.", vitamins:"Vitamin A, Vitamin C, Likopen, Kalium", fun_fact:"Semangka mengandung 92% air — buah terbaik untuk hidrasi di hari panas!"},
  {id:6,  name:"Jeruk Sunkist",          category:"buah",   price:42000, sale_price:30000, weight:500,  rating:4.6, flash_sale:false, best_seller:false, farmer_id:1, description:"Jeruk Sunkist segar pilihan, rasa asam-manis seimbang, kulit tipis, berair.", vitamins:"Vitamin C, Folat, Kalium, Thiamin", fun_fact:"Satu jeruk Sunkist mengandung hampir 100% kebutuhan vitamin C harian!"},
  {id:7,  name:"Anggur Merah Seedless",  category:"buah",   price:65000, sale_price:48000, weight:500,  rating:4.8, flash_sale:false, best_seller:true,  farmer_id:2, description:"Anggur merah impor tanpa biji, manis, berair, kaya antioksidan resveratrol.", vitamins:"Vitamin C, Vitamin K, Tembaga, Mangan", fun_fact:"Resveratrol dalam anggur merah dikaitkan dengan umur panjang dan kesehatan jantung!"},
  {id:8,  name:"Stroberi Segar",         category:"buah",   price:38000, sale_price:28000, weight:250,  rating:4.7, flash_sale:true,  best_seller:false, farmer_id:5, description:"Stroberi segar dari Dieng, merah sempurna, manis-asam, aroma bunga yang khas.", vitamins:"Vitamin C, Mangan, Folat, Kalium", fun_fact:"Stroberi adalah satu-satunya buah yang memiliki biji di luar dagingnya!"},
  {id:9,  name:"Jus Mangga Segar",       category:"olahan", price:18000, sale_price:13000, weight:300,  rating:4.9, flash_sale:true,  best_seller:true,  farmer_id:6, description:"Jus mangga 100% asli tanpa gula tambahan, segar diperah langsung dari mangga pilihan.", vitamins:"Vitamin A, Vitamin C, Vitamin B6", fun_fact:"Minum jus mangga rutin dapat meningkatkan produksi kolagen untuk kulit lebih sehat!"},
  {id:10, name:"Smoothie Hijau Detoks",  category:"olahan", price:22000, sale_price:16000, weight:350,  rating:4.7, flash_sale:false, best_seller:true,  farmer_id:6, description:"Blend bayam, apel hijau, jahe, dan lemon — minuman detoks harian yang menyegarkan.", vitamins:"Vitamin K, Vitamin C, Vitamin B, Zat Besi", fun_fact:"Smoothie hijau rutin dapat meningkatkan energi dan membantu detoksifikasi hati!"},
  {id:11, name:"Jus Semangka Mint",      category:"olahan", price:16000, sale_price:11000, weight:300,  rating:4.6, flash_sale:true,  best_seller:false, farmer_id:6, description:"Jus semangka segar dengan daun mint, tanpa gula tambahan, menyegarkan.", vitamins:"Vitamin A, Vitamin C, Likopen, Kalium", fun_fact:"Jus semangka membantu memulihkan otot lebih cepat setelah olahraga intens!"},
  {id:12, name:"Smoothie Pisang Cokelat",category:"olahan", price:20000, sale_price:15000, weight:350,  rating:4.8, flash_sale:false, best_seller:true,  farmer_id:6, description:"Smoothie pisang dengan dark cocoa powder, susu almond, dan madu — lezat dan sehat.", vitamins:"Vitamin B6, Magnesium, Kalium, Serat", fun_fact:"Kombinasi pisang dan cokelat mengandung tryptophan yang membuat mood lebih baik!"},
  {id:13, name:"Jus Jeruk Segar",        category:"olahan", price:15000, sale_price:11000, weight:250,  rating:4.5, flash_sale:true,  best_seller:false, farmer_id:6, description:"Jus jeruk peras segar 100% tanpa gula, kaya vitamin C.", vitamins:"Vitamin C, Folat, Thiamin, Kalium", fun_fact:"Minum jus jeruk tiap pagi membantu penyerapan zat besi dari makanan lainnya!"},
  {id:14, name:"Mix Fruit Bowl",         category:"olahan", price:28000, sale_price:20000, weight:400,  rating:4.9, flash_sale:false, best_seller:true,  farmer_id:6, description:"Mangkuk buah segar campur: mangga, semangka, stroberi, anggur, pepaya — siap santap.", vitamins:"Multi-Vitamin A, B, C, K, Folat, Kalium", fun_fact:"Mengonsumsi 5 jenis buah berbeda sehari memberikan semua micronutrient yang dibutuhkan!"},
  {id:15, name:"Pepaya California",      category:"buah",   price:22000, sale_price:16000, weight:800,  rating:4.5, flash_sale:false, best_seller:false, farmer_id:3, description:"Pepaya California segar, daging oranye tebal, manis, kaya enzim papain.", vitamins:"Vitamin C, Vitamin A, Folat, Kalium", fun_fact:"Enzim papain dalam pepaya membantu memecah protein dan mempercepat penyembuhan luka!"},
  {id:16, name:"Smoothie Tropicana",     category:"olahan", price:24000, sale_price:18000, weight:350,  rating:4.7, flash_sale:true,  best_seller:true,  farmer_id:6, description:"Blend mangga, nanas, dan kelapa muda — tropical vibes dalam satu gelas segar!", vitamins:"Vitamin C, Vitamin B1, Mangan, Kalium", fun_fact:"Nanas mengandung bromelain yang membantu pencernaan protein dan mengurangi peradangan!"},
];

const PROMOS_DATA = {
  "DEWYBAR10": {type:"percent", value:10,   label:"Diskon 10%"},
  "FRESH5K":   {type:"fixed",   value:5000, label:"Diskon Rp 5.000"},
  "SEHAT2025": {type:"percent", value:15,   label:"Diskon 15%"},
};

// ── Auth Session (localStorage) ──────────────────────────────
const Auth = {
  getToken:    () => localStorage.getItem("dewybar_token") || "",
  getUser:     () => JSON.parse(localStorage.getItem("dewybar_user") || "null"),
  setSession(token, user) {
    localStorage.setItem("dewybar_token", token);
    localStorage.setItem("dewybar_user",  JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem("dewybar_token");
    localStorage.removeItem("dewybar_user");
    localStorage.removeItem("dewybar_order_id");
    localStorage.removeItem("dewybar_order_total");
    localStorage.removeItem("dewybar_checkout_discount");
    localStorage.removeItem("dewybar_last_order");
  },
  isLoggedIn: () => !!localStorage.getItem("dewybar_token"),
  uid: () => { const u = Auth.getUser(); return u ? (u.uid || u.id || "") : ""; }
};

// ── Cart (localStorage) ───────────────────────────────────────
const Cart = {
  _key: () => "dewybar_cart_" + (Auth.uid() || "guest"),

  getItems() {
    try { return JSON.parse(localStorage.getItem(this._key()) || "[]"); }
    catch(e) { return []; }
  },

  saveItems(items) {
    localStorage.setItem(this._key(), JSON.stringify(items));
  },

  add(productId, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.product_id === productId);
    if (existing) existing.qty += qty;
    else items.push({ product_id: productId, qty });
    this.saveItems(items);
    return this.buildResponse();
  },

  update(productId, qty) {
    let items = this.getItems();
    if (qty <= 0) items = items.filter(i => i.product_id !== productId);
    else { const item = items.find(i => i.product_id === productId); if (item) item.qty = qty; }
    this.saveItems(items);
    return this.buildResponse();
  },

  remove(productId) {
    const items = this.getItems().filter(i => i.product_id !== productId);
    this.saveItems(items);
    return this.buildResponse();
  },

  clear() {
    this.saveItems([]);
    return { items: [], total: 0, count: 0 };
  },

  buildResponse() {
    const cartItems = this.getItems();
    let result = [], total = 0;
    for (const ci of cartItems) {
      const p = PRODUCTS_DATA.find(p => p.id === ci.product_id);
      if (p) {
        const price = p.flash_sale ? p.sale_price : p.price;
        result.push({ ...p, qty: ci.qty });
        total += price * ci.qty;
      }
    }
    return { items: result, total, count: cartItems.reduce((s, i) => s + i.qty, 0) };
  }
};

// ── Simulated Auth (no Firebase needed) ──────────────────────
const Auth2 = {
  login: async ({ email, password }) => {
    // Dev mode: accept any valid email + password >= 6 chars
    const users = JSON.parse(localStorage.getItem("dewybar_users") || "[]");
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("Email tidak terdaftar.");
    if (user.password !== password) throw new Error("Password salah.");
    const token = btoa(email + ":" + Date.now());
    return {
      token,
      user: { uid: user.uid, name: user.name, email: user.email, phone: user.phone||"", address: user.address||"" },
      message: `Selamat datang, ${user.name}! 🌿`
    };
  },

  register: async ({ name, email, phone, address, password }) => {
    if (!name || !email || !password) throw new Error("Semua field wajib diisi.");
    if (password.length < 6) throw new Error("Password minimal 6 karakter.");
    const users = JSON.parse(localStorage.getItem("dewybar_users") || "[]");
    if (users.find(u => u.email === email)) throw new Error("Email ini sudah terdaftar. Silakan login.");
    const uid = "usr_" + Date.now();
    const newUser = { uid, name, email, phone: phone||"", address: address||"", password };
    users.push(newUser);
    localStorage.setItem("dewybar_users", JSON.stringify(users));
    const token = btoa(email + ":" + Date.now());
    return {
      token,
      user: { uid, name, email, phone: phone||"", address: address||"" },
      message: "Akun berhasil dibuat! Selamat datang di Dewy Bar 🌿"
    };
  },

  logout: async () => {
    return {};
  },

  updateProfile: async (data) => {
    const u = Auth.getUser();
    if (!u) throw new Error("Tidak terautentikasi");
    const users = JSON.parse(localStorage.getItem("dewybar_users") || "[]");
    const idx = users.findIndex(x => x.uid === u.uid);
    if (idx >= 0) { users[idx] = { ...users[idx], ...data }; localStorage.setItem("dewybar_users", JSON.stringify(users)); }
    const updated = { ...u, ...data };
    Auth.setSession(Auth.getToken(), updated);
    return { success: true };
  }
};

// ── Main API Object ───────────────────────────────────────────
const API = {
  // Auth
  login:         (data) => Auth2.login(data),
  register:      (data) => Auth2.register(data),
  logout:        ()     => Auth2.logout(),
  me:            ()     => Promise.resolve(Auth.getUser()),
  updateProfile: (data) => Auth2.updateProfile(data),

  // Products (from local data)
  getProducts: (params = {}) => {
    let result = [...PRODUCTS_DATA];
    if (params.category)         result = result.filter(p => p.category === params.category);
    if (params.flash_sale==="true") result = result.filter(p => p.flash_sale);
    if (params.best_seller==="true") result = result.filter(p => p.best_seller);
    if (params.q) result = result.filter(p => p.name.toLowerCase().includes(params.q.toLowerCase()));
    return Promise.resolve(result);
  },

  getProduct: (id) => {
    const p = PRODUCTS_DATA.find(p => p.id === parseInt(id));
    if (!p) return Promise.reject(new Error("Produk tidak ditemukan"));
    const farmer = FARMERS_DATA.find(f => f.id === p.farmer_id);
    return Promise.resolve(farmer ? { ...p, farmer } : { ...p });
  },

  // Farmers
  getFarmers: () => Promise.resolve(FARMERS_DATA),
  getFarmer: (id) => {
    const f = FARMERS_DATA.find(f => f.id === parseInt(id));
    if (!f) return Promise.reject(new Error("Petani tidak ditemukan"));
    return Promise.resolve({ ...f, products: PRODUCTS_DATA.filter(p => f.product_ids.includes(p.id)) });
  },

  // Cart (localStorage)
  getCart:        ()         => Promise.resolve(Cart.buildResponse()),
  addToCart:      ({product_id, qty}) => { const r = Cart.add(product_id, qty||1); return Promise.resolve(r); },
  updateCart:     (pid, qty) => Promise.resolve(Cart.update(pid, qty)),
  removeFromCart: (pid)      => Promise.resolve(Cart.remove(pid)),
  clearCart:      ()         => Promise.resolve(Cart.clear()),

  // Promo
  validatePromo: (code, total) => {
    const promo = PROMOS_DATA[code.trim().toUpperCase()];
    if (!promo) return Promise.reject(new Error("Kode promo tidak valid"));
    const discount = promo.type === "percent" ? total * promo.value / 100 : promo.value;
    return Promise.resolve({ valid: true, code, label: promo.label, discount });
  },

  // Orders (localStorage)
  createOrder: (data) => {
    const cart = Cart.buildResponse();
    if (!cart.items.length) return Promise.reject(new Error("Keranjang belanja kosong"));
    const discount = parseFloat(data.discount || 0);
    const total = Math.max(0, cart.total - discount);
    const oid = "DBR" + Date.now() + Math.floor(Math.random()*900+100);
    const order = {
      order_id: oid, uid: Auth.uid(),
      items: cart.items, subtotal: cart.total, discount, total,
      address: data.address||"", delivery_date: data.delivery_date||"",
      payment_method: data.payment_method||"QRIS",
      status: "pending_payment",
      created_at: new Date().toISOString()
    };
    const orders = JSON.parse(localStorage.getItem("dewybar_orders") || "[]");
    orders.push(order);
    localStorage.setItem("dewybar_orders", JSON.stringify(orders));
    Cart.clear();
    localStorage.setItem("dewybar_last_order", JSON.stringify(order));
    return Promise.resolve({ order_id: oid, total, message: "Pesanan berhasil dibuat!" });
  },

  getOrders: () => {
    const uid = Auth.uid();
    const orders = JSON.parse(localStorage.getItem("dewybar_orders") || "[]");
    return Promise.resolve(orders.filter(o => o.uid === uid).reverse());
  },

  confirmPayment: (oid) => {
    const orders = JSON.parse(localStorage.getItem("dewybar_orders") || "[]");
    const order = orders.find(o => o.order_id === oid && o.uid === Auth.uid());
    if (!order) return Promise.reject(new Error("Pesanan tidak ditemukan"));
    order.status = "paid";
    order.paid_at = new Date().toISOString();
    localStorage.setItem("dewybar_orders", JSON.stringify(orders));
    localStorage.setItem("dewybar_last_order", JSON.stringify(order));
    return Promise.resolve({ success: true, message: "Pembayaran berhasil dikonfirmasi!", order });
  },

  // Pre-orders
  createPreOrder: (data) => {
    const po = {
      po_id: "PO" + Date.now(), uid: Auth.uid(),
      location: data.location||"", date: data.date||"",
      items: data.items||[], status: "scheduled",
      created_at: new Date().toISOString()
    };
    const pos = JSON.parse(localStorage.getItem("dewybar_preorders") || "[]");
    pos.push(po);
    localStorage.setItem("dewybar_preorders", JSON.stringify(pos));
    return Promise.resolve({ po_id: po.po_id, message: "Pre-order berhasil dijadwalkan!" });
  },

  getPreOrders: () => {
    const uid = Auth.uid();
    const pos = JSON.parse(localStorage.getItem("dewybar_preorders") || "[]");
    return Promise.resolve(pos.filter(p => p.uid === uid).reverse());
  },

  getLocationCount: (date, location) => {
    const pos = JSON.parse(localStorage.getItem("dewybar_preorders") || "[]");
    const count = pos.filter(p => p.location === location && p.date === date).length;
    return Promise.resolve({ location, date, count });
  }
};

// ── Toast notifications ──────────────────────────────────────
function showToast(icon, title, msg, duration = 3500) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast"; el.className = "toast";
    el.innerHTML = `<div class="toast-icon" id="toast-icon"></div>
      <div><div class="toast-title" id="toast-title"></div>
      <div class="toast-msg" id="toast-msg"></div></div>`;
    document.body.appendChild(el);
  }
  document.getElementById("toast-icon").textContent  = icon;
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-msg").textContent   = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), duration);
}

// ── Cart badge ───────────────────────────────────────────────
function updateCartBadge() {
  const count = Cart.buildResponse().count;
  document.querySelectorAll(".cart-badge").forEach(b => b.textContent = count || 0);
}

// ── Fade-up observer ─────────────────────────────────────────
function initFadeUps() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: .1 });
  document.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
}

// ── Sticky navbar ─────────────────────────────────────────────
function initNavbar() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20));
}

// ── Helpers ──────────────────────────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating), half = rating % 1 >= .5 ? 1 : 0, empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}
function formatRp(val) { return "Rp " + Number(val).toLocaleString("id-ID"); }
function goTo(page)    { window.location.href = page; }

// ── Auth guards ───────────────────────────────────────────────
function requireAuth() {
  if (!Auth.isLoggedIn()) { goTo("login.html"); return false; }
  return true;
}
function redirectIfLoggedIn() {
  if (Auth.isLoggedIn()) goTo("home-loggedin.html");
}

// ── Modal helpers ─────────────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add("open");    document.body.style.overflow = "hidden"; }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); document.body.style.overflow = ""; }

// ── Page init ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initFadeUps();
  updateCartBadge();

  const ham = document.querySelector(".hamburger");
  const nl  = document.querySelector(".nav-links");
  if (ham && nl) ham.addEventListener("click", () => nl.classList.toggle("open"));

  document.querySelectorAll(".modal-overlay").forEach(o => {
    o.addEventListener("click", e => { if (e.target === o) closeModal(o.id); });
  });
});
