"use client";
import { useState } from "react";
import "./style/index.css"
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { Avatar } from "@heroui/avatar";

export default function Home() {
    const [cartOpen, setCartOpen] = useState(false);
    const navigation = useRouter();
    const { user } = useAuthContext();
    const userId = user?._id || user?.id || "";

    // ✅ Products
    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);
            return res.json();
        },
    });

    // ✅ Wishlist
    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`);
            const data = await res.json();
            return data?.wishlist ?? [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: wishlistList = [], refetch } = useQuery({
        queryKey: ["wishlist"],
        queryFn: fetchWishlist,
        enabled: !!user,
    });

    const toggleWishlist = async (id: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId: id }),
        });
        refetch();
    };

    const removeWishlist = async (id: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId: id }),
        });
        refetch();
    };

    // ✅ Cart
    const getCart = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${userId}`);
            const data = await res.json();
            return data?.cart ?? { items: [] };
        } catch (error) {
            console.log(error);
            return { items: [] };
        }
    };

    const { data: cartList, refetch: cartRefetch } = useQuery({
        queryKey: ["cart"],
        queryFn: getCart,
        enabled: !!user,
    });

    const addToCart = async (productId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // ✅ Backend now handles quantity increment, just send productId
                body: JSON.stringify({ userId, productId, quantity: 1 }),
            });
            cartRefetch();
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/remove`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });
            cartRefetch();
        } catch (error) {
            console.log(error);
        }
    };

    const updateCart = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId, quantity }),
            });
            cartRefetch();
        } catch (error) {
            console.log(error);
        }
    };

    const cartItems = cartList?.items ?? [];
    const cartTotal = cartItems.reduce(
        (s: number, item: any) => s + item.productId.price * item.quantity, 0
    );

    return (
        <>
            {/* HEADER */}
            <header className="header">
                <div className="logo">Lumer<span>a</span></div>
                <nav className="header-nav">
                    {/* Show Login / Signup only if user is NOT logged in */}
                    {!userId && (
                        <div className="flex items-center gap-3">
                            <button
                                className="nav-btn"
                                onClick={() => navigation.push("/login")}
                            >
                                Login
                            </button>

                            <button
                                className="nav-btn outline"
                                onClick={() => navigation.push("/signup")}
                            >
                                Sign Up
                            </button>

                            <div className="divider" />
                        </div>
                    )}

                    {/* Wishlist */}
                    <button
                        className="icon-btn"
                        title="Wishlist"
                        onClick={() => navigation.push("/wishlist")}
                    >
                        ♡
                        {wishlistList?.length > 0 && (
                            <span className="badge">{wishlistList.length}</span>
                        )}
                    </button>

                    {/* Cart */}
                    <button
                        className="icon-btn"
                        title="Cart"
                        onClick={() => setCartOpen(true)}
                    >
                        🛒
                        {cartItems?.length > 0 && (
                            <span className="badge">{cartItems.length}</span>
                        )}
                    </button>

                    {/* Profile Section (only when logged in) */}
                    {userId && (
                        <div className="flex items-center gap-3 ">
                            <button
                                className="nav-btn flex items-center gap-2 "
                                onClick={() => navigation.push("/profile")}
                            >
                                <Avatar
                                    className="rounded-full justify-center p-5"
                                    name={user?.name}
                                />
                            </button>
                        </div>
                    )}
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
                    <p className="section-tag">BestSellers</p>
                    <h2 className="section-title">Best Selling Candles</h2>
                </div>
                <div className="product-grid">
                    {products?.map((p: any) => {
                        // ✅ Compute per-product state cleanly
                        const isWishlisted = wishlistList.some(
                            (item: any) => item.productId?._id === p._id
                        );
                        const cartItem = cartItems.find(
                            (item: any) => item.productId?._id === p._id
                        );

                        return (
                            <div key={p._id} className="product-card">
                                <div className="product-visual">
                                    <img src={p.image} alt={p.name} className="product-image" />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{p.name}</h3>
                                    <p className="product-desc">{p.description}</p>
                                    <div className="product-meta">
                                        <span className="meta-chip">{p.weight}</span>
                                        <span className="meta-chip">{p.burnTime}</span>
                                    </div>
                                    <div className="product-actions">
                                        <div className="product-price">
                                            <span>₹</span>{p.price}
                                        </div>
                                        <div className="action-row">
                                            {/* ✅ Safe wishlist toggle */}
                                            <button
                                                onClick={() => isWishlisted ? removeWishlist(p._id) : toggleWishlist(p._id)}
                                                title="Wishlist"
                                            >
                                                {isWishlisted ? "♥" : "♡"}
                                            </button>
                                            {/* ✅ Show quantity controls if already in cart */}

                                            <button className="add-btn" onClick={() => addToCart(p._id)}>
                                                Add to Cart
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CART DRAWER */}
            <div className={`cart-overlay${cartOpen ? " open" : ""}`} onClick={() => setCartOpen(false)} />
            <div className={`cart-drawer${cartOpen ? " open" : ""}`}>
                <div className="cart-head">
                    <span className="cart-title">Your Cart</span>
                    <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
                </div>

                {/* ✅ Safe empty check */}
                {cartItems.length === 0 ? (
                    <p className="cart-empty">Your cart is empty.</p>
                ) : (
                    cartItems.map((item: any, i: number) => {
                        const p = item.productId;
                        return (
                            <div key={i} className="cart-item">
                                <div className="cart-item-dot" style={{ background: p?.color }} />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{p?.name}</div>
                                    <div className="cart-item-price">₹{p?.price}</div>
                                </div>
                                <div className="cart-item-actions">
                                    <button className="remove-btn cursor-pointer" onClick={() => removeFromCart(p._id)}>
                                        Remove
                                    </button>
                                    <div className="cart-item-quantity">
                                        <button className="quantity-btn cursor-pointer" onClick={() => updateCart(p._id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className="quantity-btn cursor-pointer" onClick={() => updateCart(p._id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {cartItems.length > 0 && (
                    <button className="checkout-btn">
                        Checkout · ₹{cartTotal}
                    </button>
                )}
            </div>
        </>
    );
}