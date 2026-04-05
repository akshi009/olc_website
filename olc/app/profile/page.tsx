"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import './style/index.css'

export default function ProfilePage() {
    const { user, logout } = useAuthContext();
    const userId = user?._id || user?.id || "";
    const router = useRouter();
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<"details" | "orders">("details");
    const [form, setForm] = useState<{ address: string | null; phone: string | null; role: string }>({ address: null, phone: null, role: "customer" });

    const { data: profileData, isLoading } = useQuery({
        queryKey: ["profile", userId],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${userId}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data?.profile;
        },
        enabled: !!userId,
    });

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ["orders", userId],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${userId}`);
            if (!res.ok) return [];
            const data = await res.json();
            return data?.orders ?? [];
        },
        enabled: !!userId && activeTab === "orders",
    });

    useEffect(() => {
        if (profileData) {
            setForm({
                address: profileData.address ?? "",
                phone: profileData.phone ?? "",
                role: "customer",
            });
        }
    }, [profileData]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const isNew = !profileData;
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/profile/add`
                : `${process.env.NEXT_PUBLIC_BASE_URL}/profile/update/${userId}`;
            const method = isNew ? "POST" : "PUT";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, ...form }),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", userId] });
            setEditing(false);
        },
    });

    if (!user) {
        return (
            <div className="profile-unauth">
                <p>Please <button onClick={() => router.push("/login")}>log in</button> to view your profile.</p>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const getStatusMeta = (status: string) => {
        switch (status?.toLowerCase()) {
            case "delivered": return { label: "Delivered", cls: "status-delivered" };
            case "shipped": return { label: "Shipped", cls: "status-shipped" };
            case "processing": return { label: "Processing", cls: "status-processing" };
            case "cancelled": return { label: "Cancelled", cls: "status-cancelled" };
            default: return { label: status ?? "Pending", cls: "status-pending" };
        }
    };

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-logo" onClick={() => router.push("/")}>
                    Lumer<span>a</span>
                </div>
                <button className="back-btn" onClick={() => router.push("/")}>
                    ← Back to Shop
                </button>
            </header>

            <div className="profile-body">
                {/* Hero */}
                <div className="profile-hero">
                    <div className="profile-avatar">
                        {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="profile-intro">
                        <h1>{user?.name ?? "Valued Customer"}</h1>
                        <p>{user?.email ?? ""}</p>
                    </div>
                </div>

                <div className="profile-divider" />

                {/* Tab Nav */}
                <div className="profile-tabs">
                    <button
                        className={`profile-tab ${activeTab === "details" ? "profile-tab--active" : ""}`}
                        onClick={() => setActiveTab("details")}
                    >
                        Personal Details
                    </button>
                    <button
                        className={`profile-tab ${activeTab === "orders" ? "profile-tab--active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        My Orders
                    </button>
                </div>

                {/* ── Details Tab ── */}
                {activeTab === "details" && (
                    <>
                        <p className="profile-section-title">Personal Details</p>
                        <div className="profile-card">
                            {isLoading ? (
                                <div className="empty-profile">
                                    <span>🕯</span>
                                    Loading your profile...
                                </div>
                            ) : (
                                <>
                                    <div className="profile-field">
                                        <span className="field-label">Name</span>
                                        <span className="field-value">{user?.name ?? "—"}</span>
                                    </div>
                                    <div className="profile-field">
                                        <span className="field-label">Email</span>
                                        <span className="field-value">{user?.email ?? "—"}</span>
                                    </div>
                                    <div className="profile-field">
                                        <span className="field-label">Phone</span>
                                        {editing ? (
                                            <input
                                                className="field-input"
                                                value={form.phone || ""}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="Your phone number"
                                            />
                                        ) : (
                                            <span className="field-value">{profileData?.phone || "—"}</span>
                                        )}
                                    </div>
                                    <div className="profile-field">
                                        <span className="field-label">Address</span>
                                        {editing ? (
                                            <input
                                                className="field-input"
                                                value={form.address || ""}
                                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                                placeholder="Your delivery address"
                                            />
                                        ) : (
                                            <span className="field-value">{profileData?.address || "—"}</span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="profile-actions">
                            {editing ? (
                                <>
                                    <button
                                        className="btn-primary"
                                        onClick={() => saveMutation.mutate()}
                                        disabled={saveMutation.isPending}
                                    >
                                        {saveMutation.isPending ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button className="btn-ghost" onClick={() => setEditing(false)}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="btn-primary" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </button>
                            )}
                            <button className="btn-ghost" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                )}

                {/* ── Orders Tab ── */}
                {activeTab === "orders" && (
                    <>
                        <p className="profile-section-title">Order History</p>

                        {ordersLoading ? (
                            <div className="empty-profile">
                                <span>🕯</span>
                                Retrieving your orders...
                            </div>
                        ) : !ordersData?.length ? (
                            <div className="empty-profile orders-empty">
                                <span>✦</span>
                                No orders placed yet.
                                <button className="btn-primary orders-shop-btn" onClick={() => router.push("/")}>
                                    Explore Collection
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {ordersData.map((order: any) => {
                                    const { label, cls } = getStatusMeta(order.status);
                                    return (
                                        <div key={order._id ?? order.id} className="order-card">
                                            <div className="order-card-header">
                                                <div className="order-meta">
                                                    <span className="order-id">#{(order._id ?? order.id)?.slice(-8).toUpperCase()}</span>
                                                    <span className="order-date">
                                                        {order.createdAt
                                                            ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                                                            : "—"}
                                                    </span>
                                                </div>
                                                <span className={`order-status ${cls}`}>{label}</span>
                                            </div>

                                            <div className="order-items">
                                                {(order.items ?? order.products ?? []).map((item: any, idx: number) => (
                                                    <div key={idx} className="order-item">
                                                        {item.image && (
                                                            <img src={item.image} alt={item.name} className="order-item-img" />
                                                        )}
                                                        <div className="order-item-info">
                                                            <span className="order-item-name">{item.name ?? item.title ?? "Product"}</span>
                                                            {item.variant && <span className="order-item-variant">{item.variant}</span>}
                                                        </div>
                                                        <div className="order-item-right">
                                                            <span className="order-item-qty">× {item.quantity ?? 1}</span>
                                                            <span className="order-item-price">
                                                                ₹{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString("en-IN")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="order-card-footer">
                                                {order.address && (
                                                    <span className="order-address">📍 {order.address}</span>
                                                )}
                                                <span className="order-total">
                                                    Total&ensp;
                                                    <strong>₹{(order.totalAmount ?? order.total ?? 0).toLocaleString("en-IN")}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="profile-actions">
                            <button className="btn-ghost" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}