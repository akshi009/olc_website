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

    console.log(userId, "user");

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
    }

    return (
        <>

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
                                {/* <div className="profile-field">
                                    <span className="field-label">Role</span>
                                    {editing ? (
                                        <input
                                            className="field-input"
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            placeholder="e.g. Customer"
                                        />
                                    ) : (
                                        <span className="field-value">{profileData?.role || "—"}</span>
                                    )}
                                </div> */}
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
                </div>
            </div>
        </>
    );
}