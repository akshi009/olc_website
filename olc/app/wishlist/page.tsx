"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import "./style/index.css";

export default function Wishlist() {
    const { user } = useAuthContext();
    const router = useRouter();
    const userId = user?._id || user?.id || "";

    const { data: wishlist, isLoading, refetch } = useQuery({
        queryKey: ["wishlist", userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`
            );
            const data = await res.json();
            return data?.wishlist || [];
        },
        enabled: !!userId,
    });

    const removeItem = async (productId: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId }),
        });
        refetch();
    };

    if (isLoading) {
        return (
            <>
                {/* HEADER — same as home */}
                <header className="header">
                    <div className="logo" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
                        Lumer<span>a</span>
                    </div>
                    <nav className="header-nav">
                        <button className="nav-btn" onClick={() => router.push("/login")}>Login</button>
                        <button className="nav-btn outline">Sign Up</button>
                        <div className="divider" />
                        <button className="icon-btn" title="Wishlist" onClick={() => router.push("/wishlist")}>♡</button>
                        <button className="icon-btn" title="Cart">◻</button>
                    </nav>
                </header>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                    <p className="section-tag" style={{ letterSpacing: "0.2em", opacity: 0.6 }}>Loading your wishlist…</p>
                </div>
            </>
        );
    }

    console.log(wishlist);

    return (
        <>
            {/* HEADER — same as home */}
            <header className="header">
                <div className="logo" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
                    Lumer<span>a</span>
                </div>
                <nav className="header-nav">
                    <button className="nav-btn" onClick={() => router.push("/login")}>Login</button>
                    <button className="nav-btn outline">Sign Up</button>
                    <div className="divider" />
                    <button
                        className="icon-btn"
                        title="Wishlist"
                        onClick={() => router.push("/wishlist")}
                    >
                        ♥
                        {wishlist?.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </button>
                    <button className="icon-btn" title="Cart">◻</button>
                </nav>
            </header>

            {/* WISHLIST BODY — reuses section styles */}
            <section className="section" style={{ minHeight: "80vh" }}>
                <div className="section-header">
                    <p className="section-tag">Your Collection</p>
                    <h2 className="section-title">Saved Scents</h2>
                </div>

                {wishlist?.length === 0 ? (
                    /* Empty state — mirrors the hero aesthetic */
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1.2rem",
                            padding: "5rem 1rem",
                            textAlign: "center",
                            position: "relative",
                        }}
                    >
                        {/* soft glow blob */}
                        <div
                            style={{
                                position: "absolute",
                                width: 260,
                                height: 260,
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(214,167,97,0.12) 0%, transparent 70%)",
                                pointerEvents: "none",
                            }}
                        />
                        <div style={{ fontSize: "2.8rem", opacity: 0.5 }}>♡</div>
                        <h2
                            style={{
                                fontFamily: "var(--font-display, Georgia, serif)",
                                fontSize: "1.8rem",
                                fontWeight: 400,
                                color: "var(--text-primary, #f0e6d3)",
                                margin: 0,
                            }}
                        >
                            No candles saved yet
                        </h2>
                        <p
                            style={{
                                color: "var(--text-muted, rgba(240,230,211,0.55))",
                                maxWidth: 320,
                                lineHeight: 1.6,
                                margin: 0,
                            }}
                        >
                            Explore our collection and add your favourite scents to find them here.
                        </p>
                        <button className="hero-cta" onClick={() => router.push("/")}>
                            Browse Collection →
                        </button>
                    </div>
                ) : (
                    /* Grid — exact same markup/classes as product-grid on home */
                    <div className="product-grid">
                        {wishlist?.map((item: any) => (
                            <div key={item._id} className="product-card">
                                <div className="product-visual">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="product-image"
                                    />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{item.productId?.name}</h3>
                                    <p className="product-desc">{item.productId?.description}</p>
                                    <div className="product-meta">
                                        <span className="meta-chip">{item.productId?.weight}</span>
                                        <span className="meta-chip">{item.productId?.burnTime}</span>
                                    </div>
                                    <div className="product-actions">
                                        <div className="product-price">
                                            <span>₹</span>{item.productId?.price}
                                        </div>
                                        <div className="action-row">
                                            {/* heart always filled — it's already wishlisted */}
                                            <button
                                                title="Remove from Wishlist"
                                                onClick={() => removeItem(item.productId?._id)}
                                            >
                                                ♥
                                            </button>
                                            <button className="add-btn">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}