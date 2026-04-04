"use client";
import { useEffect, useState } from "react";
import './style/index.css'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../header/page";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { DropdownMenuCheckboxes } from "./dropdown";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    weight: string;
    burnTime: string;
    image: string;
    color?: string[];
    category?: string[];
}

type ProductForm = Omit<Product, "image"> & { image: string | File };

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
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [productModal, setProductModal] = useState(false);
    const [formError, setFormError] = useState("");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageDragging, setImageDragging] = useState(false);
    const [colors, setColors] = useState<string[]>(['#ffffffff']);
    const [categories, setCategories] = useState<string[]>([]);
    const qc = useQueryClient();

    const handleImageFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        setImagePreview(URL.createObjectURL(file));
        setValue("image", file);
    };

    const { data: products = [] } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: () => fetch(`${BASE}/products`).then(r => r.json()),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { data: orders = [] } = useQuery<Order[]>({
        queryKey: ["admin-orders"],
        queryFn: () => fetch(`${BASE}/orders`).then(r => r.json()),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const addProduct = useMutation({
        mutationFn: async (body: any) => {
            const fd = new FormData();
            fd.append("name", body.name);
            fd.append("description", body.description ?? "");
            fd.append("price", String(body.price));
            fd.append("weight", body.weight ?? "");
            fd.append("burnTime", body.burnTime ?? "");
            (body.color || []).forEach((c: string) => fd.append("color", c));
            (body.category || []).forEach((c: string) => fd.append("category", c));
            if (body.image instanceof File) {
                fd.append("image", body.image);
            } else if (typeof body.image === "string" && body.image.length > 0) {
                fd.append("image", body.image);
            }
            if (selectedProduct?._id) {
                return axios.put(`${BASE}/products/${selectedProduct._id}`, fd);
            } else {
                return axios.post(`${BASE}/products/add`, fd);
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
            setProductModal(false);
            toast.success("Product added successfully");
        },
        onError: () => toast.error('Something went wrong'),
    });

    const deleteProduct = useMutation({
        mutationFn: (id: string) =>
            fetch(`${BASE}/products/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product deleted successfully");
        },
        onError: () => toast.error('Something went wrong'),
    });

    const updateOrderStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            fetch(`${BASE}/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin-orders"] });
            toast.success("Order status updated successfully");
        },
        onError: () => toast.error('Something went wrong'),
    });

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProductForm>();

    const resetForm = () => {
        reset({
            name: "",
            description: "",
            price: 0,
            weight: "",
            burnTime: "",
            image: "",
            color: [],
            category: [],
        });
    };

    const onSubmit = (data: ProductForm) => {
        if (!data.name || !data.price) {
            setFormError("Name and price are required.");
            return;
        }
        addProduct.mutate({ ...data, price: Number(data.price), color: colors, category: categories });
    };

    const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;

    const handleColor = (value: string, index: number) => {
        const update = [...colors];
        update[index] = value;
        setColors(update);
    };

    useEffect(() => {
        if (selectedProduct) {
            setColors(selectedProduct?.color || []);
            setCategories(selectedProduct?.category || []);
            setImagePreview(
                selectedProduct.image.startsWith("data:") || selectedProduct.image.startsWith("http")
                    ? selectedProduct.image
                    : `data:image/png;base64,${selectedProduct.image}`
            );
        }
    }, [selectedProduct]);

    return (
        <>
            <div className="ad-shell">
                <Toaster />
                <aside className="ad-sidebar">
                    <div className="ad-brand">
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
                                <span className="ad-nav-icon">◎</span>
                                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="ad-sidebar-footer">
                        <div className="ad-stat-pill">{products.length} products</div>
                        <div className="ad-stat-pill">{totalOrders} orders</div>
                    </div>
                </aside>

                <main className="ad-main">
                    <Header />

                    {/* OVERVIEW */}
                    {active === "overview" && (
                        <div className="ad-content">
                            <div className="ad-kpi-row">
                                <KpiCard label="Total Revenue" value={fmt(totalRevenue)} sub={`${totalOrders} orders`} accent="#f5c27a" />
                                <KpiCard label="Pending Orders" value={String(pendingOrders)} sub="awaiting action" accent="#f59e0b" />
                                <KpiCard label="Products Listed" value={String(products.length)} sub="active catalogue" accent="#a78bfa" />
                                <KpiCard label="Delivered" value={String(orders.filter(o => o.status === "delivered").length)} sub="fulfilled orders" accent="#34d399" />
                            </div>
                            <div className="ad-two-col">
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
                                <div className="ad-card">
                                    <div className="ad-card-head">Products at a Glance</div>
                                    <div className="ad-product-mini-list">
                                        {products.slice(-5).map(p => (
                                            <div key={p._id} className="ad-product-mini">
                                                {p.color?.map((i) => (
                                                    <div key={i} className="ad-product-mini-dot" style={{ background: i }} />
                                                ))}
                                                <div className="ad-product-mini-name">{p.name}</div>
                                                <div className="ad-product-mini-price">{fmt(p.price)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS */}
                    {active === "products" && (
                        <div className="ad-content">
                            <div className="flex items-center justify-end">
                                <button
                                    className="ad-cta"
                                    onClick={() => {
                                        setProductModal(true);
                                        setColors(['#ffffffff']);
                                        setCategories([]);
                                        setSelectedProduct(undefined);
                                        setImagePreview("");
                                        resetForm();
                                    }}
                                >
                                    + New Product
                                </button>
                            </div>
                            <div className="ad-product-grid mt-4">
                                {products.map(p => (
                                    <div key={p._id} onClick={() => {
                                        setProductModal(true);
                                        setSelectedProduct(p);
                                        reset(p);
                                    }} className="ad-prod-card cursor-pointer">
                                        <div className="ad-prod-img-wrap">
                                            {p.image
                                                ? <img
                                                    src={p.image?.startsWith("data:") || p.image?.startsWith("http") ? p.image : `data:image/png;base64,${p.image}`}
                                                    alt={p.name}
                                                    className="ad-prod-img"
                                                />
                                                : <div className="ad-prod-placeholder">🕯</div>}
                                        </div>
                                        <div className="ad-prod-body">
                                            <div className="ad-prod-name">{p.name}</div>
                                            <div className="text-sm text-gray-500 line-clamp-2 mb-5">{p.description}</div>
                                            <div className="ad-prod-chips">
                                                {p.color?.map((i) => <span key={i} className="color_chip" style={{ backgroundColor: i }}></span>)}
                                                {p.category?.map((i) => <span key={i} className="ad-chip">{i}</span>)}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="ad-prod-chips">
                                                    {p.weight && <span className="ad-chip">{p.weight}</span>}
                                                    {p.burnTime && <span className="ad-chip">{p.burnTime}</span>}
                                                </div>
                                                <div className="text-[#b5722a] font-medium text-lg">{fmt(p.price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ORDERS */}
                    {active === "orders" && (
                        <div className="ad-content">
                            <div className="ad-card" style={{ marginBottom: 0 }}>
                                <div className="ad-table-wrap">
                                    <table className="ad-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th><th>Customer</th><th>Items</th>
                                                <th>Total</th><th>Date</th><th>Status</th><th>Update</th>
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

            {/* MODAL */}
            {productModal && (
                <div className="ad-modal-overlay" onClick={() => setProductModal(false)}>
                    <div className="ad-modal" onClick={e => e.stopPropagation()}>
                        <div className="ad-modal-head">
                            <span>{selectedProduct ? "Edit Product" : "Add New Product"}</span>
                            <div className="flex items-center gap-10">
                                {selectedProduct && (
                                    <div
                                        onClick={() => { deleteProduct.mutate(selectedProduct._id!); setProductModal(false); }}
                                        className="text-sm border border-red-500 px-2 py-1 rounded-sm text-red-500 cursor-pointer"
                                    >
                                        Delete
                                    </div>
                                )}
                                <button className="ad-modal-close" onClick={() => { setProductModal(false); reset(); }}>✕</button>
                            </div>
                        </div>

                        <div className="ad-modal-body">
                            {formError && <div className="ad-form-error">{formError}</div>}
                            <div className="ad-form-grid">
                                <label className="ad-label">
                                    Product Name *
                                    <input className="ad-input" placeholder="e.g. Amber Dusk" {...register("name", { required: "Name is required" })} />
                                </label>
                                <label className="ad-label">
                                    Price (₹) *
                                    <input className="ad-input" type="number" placeholder="499" {...register("price", { required: "Price is required", valueAsNumber: true })} />
                                </label>
                                <label className="ad-label" style={{ gridColumn: "1/-1" }}>
                                    Description
                                    <textarea className="ad-input ad-textarea" placeholder="A warm amber fragrance…" {...register("description")} />
                                </label>
                                <label className="ad-label">
                                    Weight
                                    <input className="ad-input" placeholder="150g" {...register("weight")} />
                                </label>
                                <label className="ad-label">
                                    Burn Time
                                    <input className="ad-input" placeholder="40 hrs" {...register("burnTime")} />
                                </label>

                                {/* COLORS */}
                                <label className="ad-label">
                                    Candle Colors
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                                        {colors.map((value, index) => (
                                            <div key={index} style={{ position: "relative", width: 40, height: 40 }}>
                                                <input
                                                    type="color"
                                                    value={value}
                                                    onChange={(e) => handleColor(e.target.value, index)}
                                                    style={{ width: "100%", height: "100%", border: "none", padding: 0, cursor: "pointer" }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setColors(colors.filter((_, i) => i !== index))}
                                                    style={{
                                                        position: "absolute", top: -6, right: -6,
                                                        width: 18, height: 18, border: "none", borderRadius: "50%",
                                                        background: "#000", color: "#fff", fontSize: 10,
                                                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                                    }}
                                                >✕</button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => setColors([...colors, "#46a4f6ff"])}>+ Add Color</button>
                                </label>

                                {/* CATEGORIES */}
                                <label className="ad-label">
                                    Category
                                    <div className="mt-1">
                                        <DropdownMenuCheckboxes
                                            heading="Categories"
                                            options={["Diwali", "Holi", "Eid", "Christmas", "Birthday", "Wedding"]}
                                            selected={categories}
                                            onChange={(vals) => {
                                                setCategories(vals);
                                                setValue("category", vals);
                                            }}
                                        />
                                    </div>
                                    {categories.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {categories.map(cat => (
                                                <span key={cat} className="ad-chip">{cat}</span>
                                            ))}
                                        </div>
                                    )}
                                </label>

                                {/* IMAGE */}
                                <div className="ad-label" style={{ gridColumn: "1/-1" }}>
                                    Product Image
                                    <div
                                        className={`ad-upload-zone${imageDragging ? " dragging" : ""}${imagePreview ? " has-image" : ""}`}
                                        onDragOver={e => { e.preventDefault(); setImageDragging(true); }}
                                        onDragLeave={() => setImageDragging(false)}
                                        onDrop={e => { e.preventDefault(); setImageDragging(false); const file = e.dataTransfer.files[0]; if (file) handleImageFile(file); }}
                                        onClick={() => document.getElementById("ad-file-input")?.click()}
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="preview" className="ad-upload-preview" />
                                                <button className="ad-upload-clear" onClick={e => { e.stopPropagation(); setImagePreview(""); setValue("image", ""); }}>✕ Remove</button>
                                            </>
                                        ) : (
                                            <div className="ad-upload-placeholder">
                                                <span className="ad-upload-icon">↑</span>
                                                <span className="ad-upload-text">Click or drag & drop an image</span>
                                                <span className="ad-upload-sub">PNG, JPG, WEBP — max 5MB</span>
                                            </div>
                                        )}
                                    </div>
                                    <input id="ad-file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (file) handleImageFile(file); }} />
                                    <input type="hidden" {...register("image")} />
                                </div>
                            </div>
                        </div>

                        <div className="ad-modal-foot">
                            <button className="ad-btn-ghost" onClick={() => { setProductModal(false); reset(); }}>Cancel</button>
                            <button className="ad-cta" onClick={handleSubmit(onSubmit)} disabled={addProduct.isPending}>
                                {addProduct.isPending ? "Saving…" : "Save Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

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