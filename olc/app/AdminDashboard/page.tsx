"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./style/index.css"

/* ─── types ─────────────────────────────────────────── */
interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    weight: string;
    burnTime: string;
    image: string;
    color?: string;
}

interface OrderItem {
    productId: { name: string; price: number };
    quantity: number;
}

interface Order {
    _id: string;
    userId: { name?: string; email?: string } | string;
    items: OrderItem[];
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
    paymentId?: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";

const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const STATUS_COLOR: Record<string, string> = {
    pending: "#f59e0b",
    processing: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444",
};

export default function AdminDashboard() {
    const [active, setActive] = useState<"overview" | "products" | "orders">("overview");
    const [productModal, setProductModal] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", price: "", weight: "", burnTime: "", image: "", color: "#f5c27a" });
    const [formError, setFormError] = useState("");
    const qc = useQueryClient();

    /* ── data ── */
    const { data: products = [] } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: () => fetch(`${BASE}/products`).then(r => r.json()),
    });

    const { data: orders = [] } = useQuery<Order[]>({
        queryKey: ["admin-orders"],
        queryFn: () => fetch(`${BASE}/orders/`).then(r => r.json()).catch((e) => console.log(e)),
    });

    /* ── mutations ── */
    const addProduct = useMutation({
        mutationFn: (body: object) =>
            fetch(`${BASE}/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); setProductModal(false); resetForm(); },
    });

    const deleteProduct = useMutation({
        mutationFn: (id: string) =>
            fetch(`${BASE}/products/${id}`, { method: "DELETE" }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
    });

    const updateOrderStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            fetch(`${BASE}/orders/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
    });

    /* ── form helpers ── */
    const resetForm = () => { setForm({ name: "", description: "", price: "", weight: "", burnTime: "", image: "", color: "#f5c27a" }); setFormError(""); };
    const handleSubmit = () => {
        if (!form.name || !form.price) { setFormError("Name and price are required."); return; }
        addProduct.mutate({ ...form, price: Number(form.price) });
    };

    /* ── stats ── */
    const totalRevenue = orders?.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount, 0);
    const totalOrders = orders?.length;
    const pendingOrders = orders?.filter(o => o.status === "pending").length;


    return (
        <>

            <div className="ad-shell">
                {/* ── SIDEBAR ── */}
                <aside className="ad-sidebar">
                    <div className="ad-brand">
                        <span className="ad-flame">🕯</span>
                        <div>
                            <div className="ad-brand-name">OhLittleCandle</div>
                            <div className="ad-brand-role">Admin Console</div>
                        </div>
                    </div>

                    <nav className="ad-nav">
                        {(["overview", "products", "orders"] as const).map(tab => (
                            <button
                                key={tab}
                                className={`ad-nav-btn${active === tab ? " active" : ""}`}
                                onClick={() => setActive(tab)}
                            >
                                <span className="ad-nav-icon">{tab === "overview" ? "◈" : tab === "products" ? "⬡" : "◎"}</span>
                                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="ad-sidebar-footer">
                        <div className="ad-stat-pill">{products.length} products</div>
                        <div className="ad-stat-pill">{totalOrders} orders</div>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <main className="ad-main">
                    <header className="ad-topbar">
                        <h1 className="ad-page-title">
                            {active === "overview" && "Dashboard Overview"}
                            {active === "products" && "Product Catalogue"}
                            {active === "orders" && "Order Management"}
                        </h1>
                        {active === "products" && (
                            <button className="ad-cta" onClick={() => setProductModal(true)}>+ New Product</button>
                        )}
                    </header>

                    {/* ── OVERVIEW ── */}
                    {active === "overview" && (
                        <div className="ad-content">
                            <div className="ad-kpi-row">
                                <KpiCard label="Total Revenue" value={fmt(totalRevenue)} sub={`${totalOrders} orders`} accent="#f5c27a" />
                                <KpiCard label="Pending Orders" value={String(pendingOrders)} sub="awaiting action" accent="#f59e0b" />
                                <KpiCard label="Products Listed" value={String(products.length)} sub="active catalogue" accent="#a78bfa" />
                                <KpiCard label="Delivered" value={String(orders.filter(o => o.status === "delivered").length)} sub="fulfilled orders" accent="#34d399" />
                            </div>

                            <div className="ad-two-col">
                                {/* Recent orders */}
                                <div className="ad-card">
                                    <div className="ad-card-head">Recent Orders</div>
                                    <div className="ad-table-wrap">
                                        <table className="ad-table">
                                            <thead><tr><th>Order ID</th><th>Amount</th><th>Status</th></tr></thead>
                                            <tbody>
                                                {orders.slice(0, 6).map(o => (
                                                    <tr key={o._id}>
                                                        <td className="ad-mono">#{o._id.slice(-6).toUpperCase()}</td>
                                                        <td>{fmt(o.totalAmount)}</td>
                                                        <td><span className="ad-badge" style={{ background: STATUS_COLOR[o.status] + "22", color: STATUS_COLOR[o.status] }}>{o.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Top products */}
                                <div className="ad-card">
                                    <div className="ad-card-head">Products at a Glance</div>
                                    <div className="ad-product-mini-list">
                                        {products.slice(0, 5).map(p => (
                                            <div key={p._id} className="ad-product-mini">
                                                <div className="ad-product-mini-dot" style={{ background: p.color ?? "#f5c27a" }} />
                                                <div className="ad-product-mini-name">{p.name}</div>
                                                <div className="ad-product-mini-price">{fmt(p.price)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── PRODUCTS ── */}
                    {active === "products" && (
                        <div className="ad-content">
                            <div className="ad-product-grid">
                                {products.map(p => (
                                    <div key={p._id} className="ad-prod-card">
                                        <div className="ad-prod-img-wrap">
                                            {p.image
                                                ? <img src={p.image} alt={p.name} className="ad-prod-img" />
                                                : <div className="ad-prod-placeholder">🕯</div>}
                                            <div className="ad-prod-price-tag">{fmt(p.price)}</div>
                                        </div>
                                        <div className="ad-prod-body">
                                            <div className="ad-prod-name">{p.name}</div>
                                            <div className="ad-prod-desc">{p.description}</div>
                                            <div className="ad-prod-chips">
                                                {p.weight && <span className="ad-chip">{p.weight}</span>}
                                                {p.burnTime && <span className="ad-chip">{p.burnTime}</span>}
                                            </div>
                                        </div>
                                        <button className="ad-delete-btn" onClick={() => deleteProduct.mutate(p._id)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── ORDERS ── */}
                    {active === "orders" && (
                        <div className="ad-content">
                            <div className="ad-card" style={{ marginBottom: 0 }}>
                                <div className="ad-table-wrap">
                                    <table className="ad-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(o => {
                                                const customer = typeof o.userId === "object"
                                                    ? o.userId?.email ?? o.userId?.name ?? "—"
                                                    : String(o.userId).slice(-8);
                                                return (
                                                    <tr key={o._id}>
                                                        <td className="ad-mono">#{o._id.slice(-6).toUpperCase()}</td>
                                                        <td>{customer}</td>
                                                        <td>{o.items.length}</td>
                                                        <td>{fmt(o.totalAmount)}</td>
                                                        <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                                                        <td>
                                                            <span className="ad-badge" style={{ background: STATUS_COLOR[o.status] + "22", color: STATUS_COLOR[o.status] }}>
                                                                {o.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="ad-select"
                                                                value={o.status}
                                                                onChange={e => updateOrderStatus.mutate({ id: o._id, status: e.target.value })}
                                                            >
                                                                {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ── ADD PRODUCT MODAL ── */}
            {productModal && (
                <div className="ad-modal-overlay" onClick={() => setProductModal(false)}>
                    <div className="ad-modal" onClick={e => e.stopPropagation()}>
                        <div className="ad-modal-head">
                            <span>Add New Product</span>
                            <button className="ad-modal-close" onClick={() => { setProductModal(false); resetForm(); }}>✕</button>
                        </div>
                        <div className="ad-modal-body">
                            {formError && <div className="ad-form-error">{formError}</div>}
                            <div className="ad-form-grid">
                                <label className="ad-label">
                                    Product Name *
                                    <input className="ad-input" placeholder="e.g. Amber Dusk" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </label>
                                <label className="ad-label">
                                    Price (₹) *
                                    <input className="ad-input" type="number" placeholder="499" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                                </label>
                                <label className="ad-label" style={{ gridColumn: "1/-1" }}>
                                    Description
                                    <textarea className="ad-input ad-textarea" placeholder="A warm amber fragrance…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </label>
                                <label className="ad-label">
                                    Weight
                                    <input className="ad-input" placeholder="150g" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
                                </label>
                                <label className="ad-label">
                                    Burn Time
                                    <input className="ad-input" placeholder="40 hrs" value={form.burnTime} onChange={e => setForm(f => ({ ...f, burnTime: e.target.value }))} />
                                </label>
                                <label className="ad-label" style={{ gridColumn: "1/-1" }}>
                                    Image URL
                                    <input className="ad-input" placeholder="https://…" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                                </label>
                                <label className="ad-label">
                                    Accent Color
                                    <input className="ad-input ad-color-input" type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
                                </label>
                            </div>
                        </div>
                        <div className="ad-modal-foot">
                            <button className="ad-btn-ghost" onClick={() => { setProductModal(false); resetForm(); }}>Cancel</button>
                            <button className="ad-cta" onClick={handleSubmit} disabled={addProduct.isPending}>
                                {addProduct.isPending ? "Saving…" : "Save Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ─── KPI Card ────────────────────────────────────────── */
function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
    return (
        <div className="ad-kpi-card" style={{ "--accent": accent } as React.CSSProperties}>
            <div className="ad-kpi-label">{label}</div>
            <div className="ad-kpi-value">{value}</div>
            <div className="ad-kpi-sub">{sub}</div>
            <div className="ad-kpi-bar" />
        </div>
    );
}
