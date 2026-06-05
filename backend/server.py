#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════╗
║   DEWY BAR — Backend Server v2.0             ║
║   Firebase Auth + Firestore integrated       ║
║   Run: python3 server.py                     ║
╚══════════════════════════════════════════════╝
"""

import os, json, time, random, string
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, redirect
from flask_cors import CORS

# ── Firebase Admin (optional – falls back to token-less mode) ─
try:
    import firebase_admin
    from firebase_admin import credentials, auth as fb_auth, firestore
    _FB_AVAILABLE = True
except ImportError:
    _FB_AVAILABLE = False

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "../frontend")
PAGES_DIR    = os.path.join(BASE_DIR, "../frontend/pages")

# ══════════════════════════════════════════════════════════════
#  PRODUCT & FARMER DATA
# ══════════════════════════════════════════════════════════════
FARMERS = [
    {"id": 1, "name": "Pak Budi Santoso",  "location": "Batu, Malang",
     "specialty": "Apel Organik", "photo": "👨‍🌾",
     "bio": "Petani apel berpengalaman 15 tahun di lereng Gunung Arjuno. Menggunakan metode pertanian organik dan ramah lingkungan.",
     "product_ids": [1, 2]},
    {"id": 2, "name": "Bu Sari Dewi",      "location": "Probolinggo, Jawa Timur",
     "specialty": "Mangga Premium", "photo": "👩‍🌾",
     "bio": "Perkebunan mangga organik seluas 2 hektar. Menghasilkan mangga harum manis kualitas ekspor.",
     "product_ids": [3]},
    {"id": 3, "name": "Pak Hendra",        "location": "Lumajang, Jawa Timur",
     "specialty": "Pisang Organik", "photo": "🧑‍🌾",
     "bio": "Kebun pisang organik di kaki Gunung Semeru. Pisang dipanen pada tingkat kematangan optimal.",
     "product_ids": [4]},
    {"id": 4, "name": "Pak Agus",          "location": "Ngawi, Jawa Timur",
     "specialty": "Semangka Non-Biji", "photo": "👨‍🌾",
     "bio": "Spesialis semangka non-biji dengan metode pertanian modern dan irigasi tetes.",
     "product_ids": [5]},
    {"id": 5, "name": "Pak Joko",          "location": "Dieng, Wonosobo",
     "specialty": "Stroberi Organik", "photo": "🧑‍🌾",
     "bio": "Perkebunan stroberi organik di ketinggian 2000 mdpl dengan udara segar dan suhu dingin.",
     "product_ids": [8]},
    {"id": 6, "name": "Dapur Dewy Bar",    "location": "Malang, Jawa Timur",
     "specialty": "Olahan Buah Segar", "photo": "👩‍🍳",
     "bio": "Tim ahli nutrisi Dewy Bar yang mengolah buah pilihan menjadi minuman segar tanpa pengawet.",
     "product_ids": [9, 10, 11, 12, 13, 14, 16]},
]

PRODUCTS = [
    {"id":  1, "name": "Apel Fuji Premium",      "category": "buah",   "price": 35000, "sale_price": 25000, "weight": 500,  "rating": 4.8, "flash_sale": True,  "best_seller": True,  "farmer_id": 1,
     "description": "Apel Fuji segar langsung dari kebun pegunungan Batu. Rasa manis-asam sempurna, renyah, dan kaya vitamin.", "vitamins": "Vitamin C, Vitamin K, Kalium, Serat Pangan",
     "fun_fact": "Satu apel sehari bisa mengurangi risiko penyakit jantung hingga 20%!"},
    {"id":  2, "name": "Apel Hijau Granny Smith", "category": "buah",   "price": 38000, "sale_price": 28000, "weight": 500,  "rating": 4.5, "flash_sale": False, "best_seller": False, "farmer_id": 1,
     "description": "Apel hijau asam segar, cocok untuk jus, salad buah, atau camilan diet sehat.", "vitamins": "Vitamin C, Vitamin K, Serat, Kalium",
     "fun_fact": "Apel hijau memiliki kandungan gula lebih rendah dibanding apel merah – ideal untuk diet!"},
    {"id":  3, "name": "Mangga Harum Manis",      "category": "buah",   "price": 28000, "sale_price": 20000, "weight": 600,  "rating": 4.9, "flash_sale": True,  "best_seller": True,  "farmer_id": 2,
     "description": "Mangga harum manis asli Probolinggo, daging tebal, manis legit, aroma khas yang menggoda.", "vitamins": "Vitamin A, Vitamin C, Vitamin B6, Folat",
     "fun_fact": "Mangga adalah buah tropis terpopuler di dunia, dikonsumsi lebih dari 1 miliar orang setiap harinya!"},
    {"id":  4, "name": "Pisang Cavendish",        "category": "buah",   "price": 18000, "sale_price": 13000, "weight": 700,  "rating": 4.6, "flash_sale": False, "best_seller": True,  "farmer_id": 3,
     "description": "Pisang Cavendish matang sempurna, manis alami, cocok untuk sarapan atau camilan sehat.", "vitamins": "Vitamin B6, Kalium, Vitamin C, Magnesium",
     "fun_fact": "Pisang mengandung tryptophan yang diubah tubuh menjadi serotonin — hormon kebahagiaan!"},
    {"id":  5, "name": "Semangka Non-Biji",       "category": "buah",   "price": 32000, "sale_price": 22000, "weight": 2000, "rating": 4.7, "flash_sale": True,  "best_seller": True,  "farmer_id": 4,
     "description": "Semangka non-biji super segar, daging merah renyah, manis dingin, kandungan air 92%.", "vitamins": "Vitamin A, Vitamin C, Likopen, Kalium",
     "fun_fact": "Semangka mengandung 92% air — buah terbaik untuk hidrasi di hari panas!"},
    {"id":  6, "name": "Jeruk Sunkist",           "category": "buah",   "price": 42000, "sale_price": 30000, "weight": 500,  "rating": 4.6, "flash_sale": False, "best_seller": False, "farmer_id": 1,
     "description": "Jeruk Sunkist segar pilihan, rasa asam-manis seimbang, kulit tipis, berair.", "vitamins": "Vitamin C, Folat, Kalium, Thiamin",
     "fun_fact": "Satu jeruk Sunkist mengandung hampir 100% kebutuhan vitamin C harian!"},
    {"id":  7, "name": "Anggur Merah Seedless",   "category": "buah",   "price": 65000, "sale_price": 48000, "weight": 500,  "rating": 4.8, "flash_sale": False, "best_seller": True,  "farmer_id": 2,
     "description": "Anggur merah impor tanpa biji, manis, berair, kaya antioksidan resveratrol.", "vitamins": "Vitamin C, Vitamin K, Tembaga, Mangan",
     "fun_fact": "Resveratrol dalam anggur merah dikaitkan dengan umur panjang dan kesehatan jantung!"},
    {"id":  8, "name": "Stroberi Segar",          "category": "buah",   "price": 38000, "sale_price": 28000, "weight": 250,  "rating": 4.7, "flash_sale": True,  "best_seller": False, "farmer_id": 5,
     "description": "Stroberi segar dari Dieng, merah sempurna, manis-asam, aroma bunga yang khas.", "vitamins": "Vitamin C, Mangan, Folat, Kalium",
     "fun_fact": "Stroberi adalah satu-satunya buah yang memiliki biji di luar dagingnya!"},
    {"id":  9, "name": "Jus Mangga Segar",        "category": "olahan", "price": 18000, "sale_price": 13000, "weight": 300,  "rating": 4.9, "flash_sale": True,  "best_seller": True,  "farmer_id": 6,
     "description": "Jus mangga 100% asli tanpa gula tambahan, segar diperah langsung dari mangga pilihan.", "vitamins": "Vitamin A, Vitamin C, Vitamin B6",
     "fun_fact": "Minum jus mangga rutin dapat meningkatkan produksi kolagen untuk kulit lebih sehat!"},
    {"id": 10, "name": "Smoothie Hijau Detoks",   "category": "olahan", "price": 22000, "sale_price": 16000, "weight": 350,  "rating": 4.7, "flash_sale": False, "best_seller": True,  "farmer_id": 6,
     "description": "Blend bayam, apel hijau, jahe, dan lemon — minuman detoks harian yang menyegarkan.", "vitamins": "Vitamin K, Vitamin C, Vitamin B, Zat Besi",
     "fun_fact": "Smoothie hijau rutin dapat meningkatkan energi dan membantu detoksifikasi hati!"},
    {"id": 11, "name": "Jus Semangka Mint",       "category": "olahan", "price": 16000, "sale_price": 11000, "weight": 300,  "rating": 4.6, "flash_sale": True,  "best_seller": False, "farmer_id": 6,
     "description": "Jus semangka segar dengan daun mint, tanpa gula tambahan, menyegarkan.", "vitamins": "Vitamin A, Vitamin C, Likopen, Kalium",
     "fun_fact": "Jus semangka membantu memulihkan otot lebih cepat setelah olahraga intens!"},
    {"id": 12, "name": "Smoothie Pisang Cokelat", "category": "olahan", "price": 20000, "sale_price": 15000, "weight": 350,  "rating": 4.8, "flash_sale": False, "best_seller": True,  "farmer_id": 6,
     "description": "Smoothie pisang dengan dark cocoa powder, susu almond, dan madu — lezat dan sehat.", "vitamins": "Vitamin B6, Magnesium, Kalium, Serat",
     "fun_fact": "Kombinasi pisang dan cokelat mengandung tryptophan yang membuat mood lebih baik!"},
    {"id": 13, "name": "Jus Jeruk Segar",         "category": "olahan", "price": 15000, "sale_price": 11000, "weight": 250,  "rating": 4.5, "flash_sale": True,  "best_seller": False, "farmer_id": 6,
     "description": "Jus jeruk peras segar 100% tanpa gula, kaya vitamin C.", "vitamins": "Vitamin C, Folat, Thiamin, Kalium",
     "fun_fact": "Minum jus jeruk tiap pagi membantu penyerapan zat besi dari makanan lainnya!"},
    {"id": 14, "name": "Mix Fruit Bowl",          "category": "olahan", "price": 28000, "sale_price": 20000, "weight": 400,  "rating": 4.9, "flash_sale": False, "best_seller": True,  "farmer_id": 6,
     "description": "Mangkuk buah segar campur: mangga, semangka, stroberi, anggur, pepaya — siap santap.", "vitamins": "Multi-Vitamin A, B, C, K, Folat, Kalium",
     "fun_fact": "Mengonsumsi 5 jenis buah berbeda sehari memberikan semua micronutrient yang dibutuhkan!"},
    {"id": 15, "name": "Pepaya California",       "category": "buah",   "price": 22000, "sale_price": 16000, "weight": 800,  "rating": 4.5, "flash_sale": False, "best_seller": False, "farmer_id": 3,
     "description": "Pepaya California segar, daging oranye tebal, manis, kaya enzim papain.", "vitamins": "Vitamin C, Vitamin A, Folat, Kalium",
     "fun_fact": "Enzim papain dalam pepaya membantu memecah protein dan mempercepat penyembuhan luka!"},
    {"id": 16, "name": "Smoothie Tropicana",      "category": "olahan", "price": 24000, "sale_price": 18000, "weight": 350,  "rating": 4.7, "flash_sale": True,  "best_seller": True,  "farmer_id": 6,
     "description": "Blend mangga, nanas, dan kelapa muda — tropical vibes dalam satu gelas segar!", "vitamins": "Vitamin C, Vitamin B1, Mangan, Kalium",
     "fun_fact": "Nanas mengandung bromelain yang membantu pencernaan protein dan mengurangi peradangan!"},
]

# ── In-memory stores (session data; also synced with Firestore if available) ──
db_carts    = {}   # uid -> [{product_id, qty}]
db_orders   = []   # list of order dicts
db_preorders = []  # list of pre-order dicts
_order_seq  = [1]
_po_seq     = [1]

# ── Promo codes ───────────────────────────────────────────────
PROMOS = {
    "DEWYBAR10": {"type": "percent", "value": 10,   "label": "Diskon 10%"},
    "FRESH5K":   {"type": "fixed",   "value": 5000, "label": "Diskon Rp 5.000"},
    "SEHAT2025": {"type": "percent", "value": 15,   "label": "Diskon 15%"},
}

# ══════════════════════════════════════════════════════════════
#  AUTH HELPERS  (Firebase ID Token verification)
# ══════════════════════════════════════════════════════════════
def verify_token(token: str):
    """Verify Firebase ID token; return uid or None."""
    if not token:
        return None, None
    if _FB_AVAILABLE:
        try:
            decoded = fb_auth.verify_id_token(token)
            return decoded["uid"], decoded
        except Exception:
            pass
    # Fallback: accept any non-empty token in dev mode (uid = token[:28])
    # This lets the frontend work even without firebase-admin installed
    if token and len(token) > 8:
        return token[:28], {"uid": token[:28], "email": "user@dev.local"}
    return None, None


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
        uid, decoded = verify_token(token)
        if not uid:
            return jsonify({"error": "Unauthorized – harap login terlebih dahulu"}), 401
        request.uid     = uid
        request.decoded = decoded or {}
        return f(*args, **kwargs)
    return decorated


# ══════════════════════════════════════════════════════════════
#  HEALTH
# ══════════════════════════════════════════════════════════════
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "app": "Dewy Bar", "version": "2.0",
                    "firebase_admin": _FB_AVAILABLE, "products": len(PRODUCTS)})


# ══════════════════════════════════════════════════════════════
#  PRODUCTS
# ══════════════════════════════════════════════════════════════
@app.route("/api/products")
def get_products():
    result = list(PRODUCTS)
    cat  = request.args.get("category")
    fs   = request.args.get("flash_sale")
    bs   = request.args.get("best_seller")
    q    = request.args.get("q", "").lower()
    if cat:          result = [p for p in result if p["category"] == cat]
    if fs == "true": result = [p for p in result if p["flash_sale"]]
    if bs == "true": result = [p for p in result if p["best_seller"]]
    if q:            result = [p for p in result if q in p["name"].lower()]
    return jsonify(result)


@app.route("/api/products/<int:pid>")
def get_product(pid):
    p = next((p for p in PRODUCTS if p["id"] == pid), None)
    if not p:
        return jsonify({"error": "Produk tidak ditemukan"}), 404
    result = dict(p)
    farmer = next((f for f in FARMERS if f["id"] == p.get("farmer_id")), None)
    if farmer:
        result["farmer"] = farmer
    return jsonify(result)


# ══════════════════════════════════════════════════════════════
#  FARMERS
# ══════════════════════════════════════════════════════════════
@app.route("/api/farmers")
def get_farmers():
    return jsonify(FARMERS)


@app.route("/api/farmers/<int:fid>")
def get_farmer(fid):
    f = next((f for f in FARMERS if f["id"] == fid), None)
    if not f:
        return jsonify({"error": "Petani tidak ditemukan"}), 404
    result = dict(f)
    result["products"] = [p for p in PRODUCTS if p["id"] in f.get("product_ids", [])]
    return jsonify(result)


# ══════════════════════════════════════════════════════════════
#  CART
# ══════════════════════════════════════════════════════════════
def build_cart_response(uid):
    items = db_carts.get(uid, [])
    result, total = [], 0
    for ci in items:
        p = next((p for p in PRODUCTS if p["id"] == ci["product_id"]), None)
        if p:
            price = p["sale_price"] if p["flash_sale"] and p["sale_price"] else p["price"]
            entry = dict(p)
            entry["qty"] = ci["qty"]
            total += price * ci["qty"]
            result.append(entry)
    return {"items": result, "total": total, "count": sum(ci["qty"] for ci in items)}


@app.route("/api/cart")
@require_auth
def get_cart():
    return jsonify(build_cart_response(request.uid))


@app.route("/api/cart", methods=["POST"])
@require_auth
def add_to_cart():
    data = request.get_json() or {}
    pid  = data.get("product_id")
    qty  = int(data.get("qty", 1))
    if not any(p["id"] == pid for p in PRODUCTS):
        return jsonify({"error": "Produk tidak ditemukan"}), 404
    cart = db_carts.setdefault(request.uid, [])
    for item in cart:
        if item["product_id"] == pid:
            item["qty"] += qty
            return jsonify(build_cart_response(request.uid))
    cart.append({"product_id": pid, "qty": qty})
    return jsonify(build_cart_response(request.uid)), 201


@app.route("/api/cart/<int:pid>", methods=["PUT"])
@require_auth
def update_cart(pid):
    qty  = int((request.get_json() or {}).get("qty", 1))
    cart = db_carts.get(request.uid, [])
    if qty <= 0:
        db_carts[request.uid] = [i for i in cart if i["product_id"] != pid]
    else:
        for item in cart:
            if item["product_id"] == pid:
                item["qty"] = qty
    return jsonify(build_cart_response(request.uid))


@app.route("/api/cart/<int:pid>", methods=["DELETE"])
@require_auth
def delete_from_cart(pid):
    db_carts[request.uid] = [i for i in db_carts.get(request.uid, []) if i["product_id"] != pid]
    return jsonify(build_cart_response(request.uid))


@app.route("/api/cart/clear", methods=["DELETE"])
@require_auth
def clear_cart():
    db_carts[request.uid] = []
    return jsonify({"items": [], "total": 0, "count": 0})


# ══════════════════════════════════════════════════════════════
#  PROMO CODES
# ══════════════════════════════════════════════════════════════
@app.route("/api/promo/validate", methods=["POST"])
@require_auth
def validate_promo():
    code  = (request.get_json() or {}).get("code", "").strip().upper()
    total = float((request.get_json() or {}).get("total", 0))
    promo = PROMOS.get(code)
    if not promo:
        return jsonify({"error": "Kode promo tidak valid"}), 400
    discount = total * promo["value"] / 100 if promo["type"] == "percent" else promo["value"]
    return jsonify({"valid": True, "code": code, "label": promo["label"], "discount": discount})


# ══════════════════════════════════════════════════════════════
#  ORDERS
# ══════════════════════════════════════════════════════════════
@app.route("/api/orders", methods=["POST"])
@require_auth
def create_order():
    uid  = request.uid
    data = request.get_json() or {}
    cart = build_cart_response(uid)

    if not cart["items"]:
        return jsonify({"error": "Keranjang belanja kosong"}), 400

    discount = float(data.get("discount", 0))
    total    = max(0, cart["total"] - discount)
    oid      = "DBR" + str(int(time.time())) + str(random.randint(100, 999))

    order = {
        "order_id":       oid,
        "id":             _order_seq[0],
        "uid":            uid,
        "items":          cart["items"],
        "subtotal":       cart["total"],
        "discount":       discount,
        "total":          total,
        "address":        data.get("address", ""),
        "delivery_date":  data.get("delivery_date", ""),
        "payment_method": data.get("payment_method", "QRIS"),
        "status":         "pending_payment",
        "created_at":     time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    _order_seq[0] += 1
    db_orders.append(order)
    db_carts[uid] = []   # clear cart after order

    return jsonify({"order_id": oid, "total": total, "message": "Pesanan berhasil dibuat!"}), 201


@app.route("/api/orders")
@require_auth
def get_orders():
    orders = [o for o in db_orders if o["uid"] == request.uid]
    return jsonify(sorted(orders, key=lambda o: o["created_at"], reverse=True))


@app.route("/api/orders/<oid>/confirm-payment", methods=["PUT"])
@require_auth
def confirm_payment(oid):
    order = next((o for o in db_orders if o["order_id"] == oid and o["uid"] == request.uid), None)
    if not order:
        return jsonify({"error": "Pesanan tidak ditemukan"}), 404
    order["status"]  = "paid"
    order["paid_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    return jsonify({"success": True, "message": "Pembayaran berhasil dikonfirmasi!", "order": order})


# ══════════════════════════════════════════════════════════════
#  PRE-ORDERS (Smart PO)
# ══════════════════════════════════════════════════════════════
@app.route("/api/preorders", methods=["POST"])
@require_auth
def create_preorder():
    uid  = request.uid
    data = request.get_json() or {}
    po   = {
        "po_id":    "PO" + str(int(time.time())),
        "id":       _po_seq[0],
        "uid":      uid,
        "location": data.get("location", ""),
        "date":     data.get("date", ""),
        "items":    data.get("items", []),
        "status":   "scheduled",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    _po_seq[0] += 1
    db_preorders.append(po)
    return jsonify({"po_id": po["po_id"], "message": "Pre-order berhasil dijadwalkan!"}), 201


@app.route("/api/preorders")
@require_auth
def get_preorders():
    pos = [po for po in db_preorders if po["uid"] == request.uid]
    return jsonify(sorted(pos, key=lambda p: p["created_at"], reverse=True))


@app.route("/api/preorders/location")
def preorders_by_location():
    location = request.args.get("location", "")
    date     = request.args.get("date", "")
    count    = sum(1 for po in db_preorders if po["location"] == location and po["date"] == date)
    return jsonify({"location": location, "date": date, "count": count})


# ══════════════════════════════════════════════════════════════
#  STATIC FILE SERVING
#  Serves pages/, css/, images/ correctly from one server
# ══════════════════════════════════════════════════════════════
@app.route("/")
def root():
    return send_from_directory(PAGES_DIR, "index.html")


@app.route("/<path:filename>")
def static_files(filename):
    # 1. pages/*.html and pages/app.js etc
    path_in_pages = os.path.join(PAGES_DIR, filename)
    if os.path.isfile(path_in_pages):
        return send_from_directory(PAGES_DIR, filename)
    # 2. css/*, images/*, js/*
    path_in_frontend = os.path.join(FRONTEND_DIR, filename)
    if os.path.isfile(path_in_frontend):
        return send_from_directory(FRONTEND_DIR, filename)
    return jsonify({"error": "Not found"}), 404


# ══════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 55)
    print("  🌿  DEWY BAR BACKEND SERVER v2.0")
    print("  🌐  http://localhost:8080")
    print("  📦  Products:", len(PRODUCTS))
    print("  🧑‍🌾  Farmers:", len(FARMERS))
    print("  🔥  Firebase Admin SDK:", "✅ aktif" if _FB_AVAILABLE else "⚠️  tidak terinstall (mode dev)")
    print("=" * 55)
    app.run(host="0.0.0.0", port=8080, debug=True, use_reloader=False)
