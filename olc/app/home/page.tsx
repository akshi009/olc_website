"use client";
import { useState } from "react";
import "./style/index.css"
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";


export default function Home() {
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [cart, setCart] = useState<number[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const navigation = useRouter()
    const { user } = useAuthContext();
    const userId = user?._id || user?.id || "";

    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);
            const data = await res.json();
            return data;
        },
    })
    const toggleWishlist = async (id: number) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                productId: id,
            }),
        });
        refetch();
        const data = await res.json();
        setWishlist((w) => (w.includes(id) ? w.filter((i) => i !== id) : [...w, id]));
    }

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`);
            const data = await res.json();
            return data?.wishlist;
        } catch (error) {
            console.log(error);
        }
    }

    const { data: wishlistList, isLoading, refetch } = useQuery({ queryKey: ["wishlist"], queryFn: fetchWishlist, enabled: !!user })

    const addToCart = (id: number) => setCart((c) => [...c, id]);

    const removeWishlist = async (id: number) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                productId: id,
            }),
        });
        const data = await res.json();
        refetch();
        console.log(data);
        setWishlist((w) => w.filter((i) => i !== id));
    }


    const handleLogin = () => {
        navigation.push('/login')
    }

    return (
        <>
            {/* HEADER */}
            <header className="header">
                <div className="logo">Lumer<span>a</span></div>
                <nav className="header-nav">
                    <button className="nav-btn" onClick={handleLogin}>Login</button>
                    <button className="nav-btn outline">Sign Up</button>
                    <div className="divider" />
                    <button className="icon-btn" title="Wishlist" onClick={() => navigation.push('/wishlist')}>
                        ♡
                        {wishlistList?.length > 0 && <span className="badge">{wishlistList?.length}</span>}
                    </button>
                    <button className="icon-btn" title="Cart" onClick={() => setCartOpen(true)}>
                        ◻
                        {cart.length > 0 && <span className="badge">{cart.length}</span>}
                    </button>
                </nav>
            </header>

            {/* HERO */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-glow" />
                <div>
                    <div className="flame" />
                    <div className="hero-candle" />
                </div>

                <div className="hero-content">
                    <p className="hero-tag">Artisan Hand-Poured Candles</p>
                    <h1 className="hero-title">
                        Light that<br /><em>lingers</em>
                    </h1>
                    <p className="hero-sub">
                        Each candle is crafted in small batches with ethically-sourced waxes and rare botanicals — made to transform any space into sanctuary.
                    </p>
                    <button className="hero-cta">Shop Collection →</button>
                </div>
            </section>

            {/* PRODUCTS */}
            <section className="section">
                <div className="section-header">
                    <p className="section-tag">New Arrivals</p>
                    <h2 className="section-title">Signature Scents</h2>
                </div>
                <div className="product-grid">
                    {products.map((p: any) => (
                        <div key={p.id} className="product-card">
                            <div className="product-visual" style={{ background: p.bg }}>
                                <div
                                    className="glow-dot"
                                    style={{ background: p.color }}
                                />
                                <div className="product-candle-wrap">
                                    <div className="product-flame" />
                                    <div
                                        className="product-candle-body"
                                        style={{
                                            background: `linear-gradient(135deg, ${p.color}cc 0%, ${p.color}88 50%, ${p.color}aa 100%)`,
                                        }}
                                    >
                                        <div className="product-candle-label">{p.name}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{p.name}</h3>
                                <p className="product-desc">{p.desc}</p>
                                <div className="product-meta">
                                    <span className="meta-chip">{p.weight}</span>
                                    <span className="meta-chip">{p.burnTime}</span>
                                </div>
                                <div className="product-actions">
                                    <div className="product-price">
                                        <span>$</span>{p.price}
                                    </div>
                                    <div className="action-row">
                                        <button
                                            // className={`wish-btn${wishlistList?.map((item: any) => item.productId === p.id ? " active" : "")}`}
                                            onClick={() => wishlistList.some((item: any) => item.productId === p.id) ? removeWishlist(p.id) : toggleWishlist(p.id)}
                                            title="Wishlist"
                                        >
                                            {wishlistList?.some((item: any) => item.productId === p.id) ? "♥" : "♡"}
                                        </button>
                                        <button className="add-btn" onClick={() => addToCart(p.id)}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CART DRAWER */}
            <div className={`cart-overlay${cartOpen ? " open" : ""}`} onClick={() => setCartOpen(false)} />
            <div className={`cart-drawer${cartOpen ? " open" : ""}`}>
                <div className="cart-head">
                    <span className="cart-title">Your Cart</span>
                    <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
                </div>
                {cart.length === 0 ? (
                    <p className="cart-empty">Your cart is empty.</p>
                ) : (
                    cart.map((id, i) => {
                        const p = products.find((x: any) => x.id === id)!;
                        return (
                            <div key={i} className="cart-item">
                                <div className="cart-item-dot" style={{ background: p.color }} />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{p.name}</div>
                                    <div className="cart-item-price">${p.price}</div>
                                </div>
                            </div>
                        );
                    })
                )}
                {cart.length > 0 && (
                    <button className="checkout-btn">
                        Checkout · ${cart.reduce((s, id) => s + (products.find((x: any) => x.id === id)?.price ?? 0), 0)}
                    </button>
                )}
            </div>
        </>
    );
}