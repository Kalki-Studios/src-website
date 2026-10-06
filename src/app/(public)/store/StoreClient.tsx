"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Package, Search, X, Plus, Minus, MessageCircle, Star, Tag } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/db/schema";

type CartItem = { product: Product; qty: number };

type Props = {
  products: Product[];
  categories: ProductCategory[];
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function buildWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map(
    ({ product, qty }) =>
      `• ${product.name} × ${qty} — ${formatPrice(product.price * qty)}`
  );
  const total = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  return encodeURIComponent(
    `Hi! I'd like to order the following components from SRC e-solutions:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability and delivery details. Thank you!`
  );
}

export function StoreClient({ products, categories }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // ─── Cart helpers ─────────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));

  const changeQty = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage(cart);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const handleBuyNow = (product: Product) => {
    const msg = encodeURIComponent(
      `Hi! I'd like to order:\n\n• ${product.name} × 1 — ${formatPrice(product.price)}\n\nPlease confirm availability and delivery. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  // ─── Filtering ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const result = products.filter(p => {
      if (selectedCat !== "all" && p.category !== (selectedCat || null)) return false;
      if (stockFilter === "in" && !p.inStock) return false;
      if (stockFilter === "out" && p.inStock) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !(p.description ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
    
    return result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [products, selectedCat, stockFilter, search]);

  return (
    <div className="pt-14 pb-20">
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden border-b py-20 px-6 bg-white" style={{ borderColor: "var(--rule)" }}>
        {/* Grid texture background */}
        <div className="absolute inset-0 grid-texture-faint pointer-events-none" />
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--ink)] uppercase tracking-widest mb-6 border bg-white shadow-sm px-4 py-1.5 rounded-full" style={{ borderColor: "var(--rule)" }}>
              <Package size={14} className="text-[var(--go)]" /> Components Store
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[var(--ink)] tracking-tight mb-5 leading-[1.1]">
              Build It <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ink)] to-gray-500">Yourself.</span>
            </h1>
            <p className="text-[var(--mute)] text-lg mb-8 font-medium leading-relaxed max-w-md">
              Microcontrollers, sensors, and modules for your next big project. Direct from SRC e-solutions.
            </p>
            <div className="flex items-center gap-3 text-base font-semibold text-[var(--ink)]">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </span>
              <span>Fast WhatsApp Ordering</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
          <div className="relative w-full md:max-w-xs shadow-sm group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--ink)] transition-colors" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm font-medium border rounded-full outline-none focus:border-[var(--ink)] focus:ring-4 focus:ring-gray-100 transition-all bg-white"
              style={{ borderColor: "var(--rule)" }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-start sm:items-center">
            {/* Stock filter pills (Replacing the basic dropdown) */}
            <div className="flex bg-gray-100/50 p-1 rounded-full border shadow-inner" style={{ borderColor: "var(--rule)" }}>
              {(["all", "in", "out"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setStockFilter(mode)}
                  className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all capitalize ${
                    stockFilter === mode ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--mute)] hover:text-[var(--ink)]"
                  }`}
                >
                  {mode === "all" ? "All Stock" : `${mode} Stock`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCat("all")}
            className={`text-xs px-4 py-2 rounded-full font-bold transition-all shadow-sm ${
              selectedCat === "all" ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--mute)] border hover:border-[var(--ink)] hover:text-[var(--ink)]"
            }`}
            style={{ borderColor: selectedCat === "all" ? "transparent" : "var(--rule)" }}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.name)}
              className={`text-xs px-4 py-2 rounded-full font-bold transition-all shadow-sm ${
                selectedCat === c.name ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--mute)] border hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
              style={{ borderColor: selectedCat === c.name ? "transparent" : "var(--rule)" }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-[var(--mute)] bg-gray-50/50 rounded-3xl border border-dashed" style={{ borderColor: "var(--rule)" }}>
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold text-[var(--ink)]">No products found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onBuyNow={handleBuyNow} inCart={cart.some(i => i.product.id === p.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-3.5 bg-[var(--ink)] text-white rounded-full shadow-2xl hover:-translate-y-1 transition-all animate-in slide-in-from-bottom-4 duration-300 font-bold text-sm border border-white/10"
        >
          <ShoppingCart size={18} />
          <span>{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
          <span className="opacity-50">|</span>
          <span>{formatPrice(cartTotal)}</span>
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--rule)" }}>
              <div>
                <h2 className="font-extrabold text-[var(--ink)] text-xl tracking-tight">Your Cart</h2>
                <p className="text-sm font-semibold text-[var(--mute)] mt-1">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 text-[var(--mute)] hover:text-[var(--ink)] hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "var(--rule)" }}>
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 p-6 items-center">
                  {(product.images as string[])?.[0] ? (
                    <img src={(product.images as string[])[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl border shadow-sm shrink-0" style={{ borderColor: "var(--rule)" }} />
                  ) : (
                    <div className="w-16 h-16 bg-gray-50 rounded-xl border flex items-center justify-center shrink-0 shadow-sm" style={{ borderColor: "var(--rule)" }}>
                      <Package size={24} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[var(--ink)] truncate mb-1">{product.name}</div>
                    <div className="text-xs font-semibold text-[var(--mute)]">{formatPrice(product.price)} each</div>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => changeQty(product.id, -1)} className="w-7 h-7 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors shadow-sm text-[var(--ink)]" style={{ borderColor: "var(--rule)" }}>
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-extrabold w-4 text-center">{qty}</span>
                      <button onClick={() => changeQty(product.id, 1)} className="w-7 h-7 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors shadow-sm text-[var(--ink)]" style={{ borderColor: "var(--rule)" }}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <div className="font-extrabold text-base text-[var(--ink)]">{formatPrice(product.price * qty)}</div>
                    <button onClick={() => removeFromCart(product.id)} className="text-[10px] font-bold uppercase tracking-wider text-[var(--mute)] hover:text-red-500 mt-2 transition-colors px-2 py-1 bg-gray-50 rounded-full">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t p-6 space-y-5 bg-gray-50/50" style={{ borderColor: "var(--rule)" }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[var(--mute)] uppercase tracking-wider">Total</span>
                <span className="text-2xl font-extrabold text-[var(--ink)]">{formatPrice(cartTotal)}</span>
              </div>
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-[#25D366] text-white rounded-xl font-extrabold text-base hover:bg-[#1fba58] hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Order via WhatsApp
              </button>
              <p className="text-xs font-medium text-center text-[var(--mute)]">
                This will open WhatsApp with your order pre-filled.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product Card Component ────────────────────────────────────────
function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  inCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  inCart: boolean;
}) {
  const images = product.images as string[] ?? [];

  return (
    <div className={`bg-white border rounded-2xl flex flex-col h-full transition-all duration-300 ${product.inStock ? "group hover:shadow-xl" : ""}`} style={{ borderColor: "var(--rule)" }}>
      {/* Image Area */}
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative rounded-t-2xl border-b" style={{ borderColor: "var(--rule)" }}>
        {images[0] ? (
          <img 
            src={images[0]} 
            alt={product.name} 
            className={`w-full h-full object-cover mix-blend-multiply transition-transform duration-500 ${product.inStock ? "group-hover:scale-110" : "grayscale opacity-50"}`} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className={`text-gray-300 ${!product.inStock && "opacity-50"}`} />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.featured && (
            <div className="w-7 h-7 bg-white/90 backdrop-blur rounded-full shadow-sm flex items-center justify-center border" style={{ borderColor: "var(--rule)" }}>
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>

        {/* Diagonal Out of Stock Ribbon */}
        {!product.inStock && (
          <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden z-20 pointer-events-none">
            <div className="absolute top-6 -right-8 w-[140px] flex justify-center rotate-45 bg-[#f07b7b] text-white text-[11px] font-bold py-1.5 shadow-sm uppercase tracking-wider">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className={`p-4 flex flex-col flex-1 ${!product.inStock ? "opacity-80" : ""}`}>
        {product.category && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-[10px] font-bold text-[var(--mute)] uppercase tracking-wider rounded-md">
              <Tag size={10} />
              {product.category}
            </span>
          </div>
        )}
        
        <h3 className={`text-sm font-extrabold text-[var(--ink)] leading-tight mb-1.5 line-clamp-2 transition-colors ${product.inStock ? "group-hover:text-blue-600" : ""}`}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-xs font-medium text-[var(--mute)] line-clamp-2 mb-3 flex-1">{product.description}</p>
        )}
        
        <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--rule)" }}>
          <div className={`flex items-baseline gap-1 ${!product.inStock ? "opacity-70" : ""}`}>
            <span className="font-extrabold text-xl text-[var(--ink)]">
              ₹ {(product.price / 100).toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-[#8c939e]">
              (Incl. GST)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4">
          {product.inStock ? (
            <button
              onClick={() => onAddToCart(product)}
              className={`w-full text-xs font-bold py-2.5 rounded-full transition-all border shadow-sm ${
                inCart
                  ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                  : "bg-white border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-gray-50"
              }`}
            >
              {inCart ? "✓ Added" : "Add to Cart"}
            </button>
          ) : (
            <button disabled className="w-full text-xs font-bold py-2.5 rounded-full bg-gray-100 text-[var(--mute)] cursor-not-allowed opacity-70">
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
