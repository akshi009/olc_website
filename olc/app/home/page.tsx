"use client";
import { useState } from "react";
import "./style/index.css"
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import Header from "../header/page";
import Script from "next/script";
import Footer from "../footer/page";
import { MarqueeDemo } from "../scroller";
import { CarouselPlugin } from "../carousel";
import { ArrowRight, Flame, Heart, Loader2, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_URL, CartItem, CartResponse, EventSummary, imageSrc, Product, WishlistItem } from "@/lib/storefront";

type RazorpayResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
};

type RazorpayInstance = {
    open: () => void;
};

type RazorpayConstructor = new (options: unknown) => RazorpayInstance;

declare global {
    interface Window {
        Razorpay?: RazorpayConstructor;
    }
}

export default function Home() {
    const [cartOpen, setCartOpen] = useState(false);
    const { user } = useAuthContext();
    const router = useRouter();
    const userId = user?._id || user?.id || "";

    // ✅ Products
    const { data: products, isFetching: isProductsFetching } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/products`);
            return res.json();
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { data: events = [] } = useQuery<EventSummary[]>({
        queryKey: ["events"],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/events`);
            return res.json();
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    // ✅ Wishlist
    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${BASE_URL}/wishlist/${userId}`);
            const data = await res.json();
            return data?.wishlist[0]?.items ?? [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: wishlistList = [], refetch } = useQuery<WishlistItem[]>({
        queryKey: ["wishlist", userId],
        queryFn: fetchWishlist,
        enabled: !!userId,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const toggleWishlist = async (id: string) => {
        await fetch(`${BASE_URL}/wishlist/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId: id }),
        });
        refetch();
    };

    const removeWishlist = async (id: string) => {
        await fetch(`${BASE_URL}/wishlist/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId: id }),
        });
        refetch();
    };

    // ✅ Cart
    const getCart = async () => {
        try {
            const res = await fetch(`${BASE_URL}/cart/${userId}`);
            const data = await res.json();
            return data?.cart ?? { items: [] };
        } catch (error) {
            console.log(error);
            return { items: [] };
        }
    };

    const { data: cartList, refetch: cartRefetch } = useQuery<CartResponse>({
        queryKey: ["cart"],
        queryFn: getCart,
        enabled: !!user,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const addToCart = async (productId: string) => {
        try {
            await fetch(`${BASE_URL}/cart/add`, {
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
            await fetch(`${BASE_URL}/cart/remove`, {
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
            await fetch(`${BASE_URL}/cart/update`, {
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
    const cartTotal = cartItems.reduce((s: number, item: CartItem) => {
        const price = item?.productId?.price ?? 0;
        const quantity = item?.quantity ?? 0;
        return s + price * quantity;
    }, 0);

    const clearCart = async () => {
        try {
            await fetch(`${BASE_URL}/cart/clear`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            cartRefetch();
        } catch (error) {
            console.log(error);
        }
    };

    const payNow = async () => {
        const Razorpay = window.Razorpay as RazorpayConstructor | undefined;

        if (!Razorpay) {
            alert("Razorpay SDK not loaded yet. Refresh page.");
            return;
        }

        const res = await fetch(`${BASE_URL}/orders/create-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                totalAmount: cartTotal,
                userId,
                items: cartItems,
                status: "pending"
            }),
        });

        const order = await res.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: order.totalAmount,
            currency: "INR",
            order_id: order.id,
            name: "OhLittleCandle",
            description: "Candle Purchase",

            handler: async function (response: RazorpayResponse) {
                const verify = await fetch(
                    `${BASE_URL}/orders/verify-payment`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(response),
                    }
                );

                const data = await verify.json();

                if (data.success) {
                    await fetch(`${BASE_URL}/orders/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            totalAmount: cartTotal,
                            userId,
                            items: cartItems,
                            status: "pending",
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                        }),
                    });

                    await clearCart();
                    window.location.href = "/success";

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                }
            },

            theme: {
                color: "#000",
            },
        };

        const rzp = new Razorpay(options);
        rzp.open();
    };

    const featuredProducts = products?.slice(0, 3) ?? [];
    const showcaseProduct = products?.[0];
    const topRatedProduct = products?.[1];
    const latestProduct = products?.[2];
    const featuredEvents = events.slice(0, 4);

    return (
    <>
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
            />
            <Header cartOpen={cartOpen} setCartOpen={setCartOpen} wishlistLength={wishlistList.length} productList={products} />
            <main className="storefront-page">
                <section className="banner-section">
                    <div className="banner-container">
                        <h1 className="banner-title">
                            <span>Glow that</span>
                            <span>Tells a Story</span>
                        </h1>
                        <div className="banner-subtitle">
                            Small-batch candle atelier. Sculpted glow for slow, beautiful evenings.
                        </div>
                        <button className="hero-cta" style={{ marginTop: '30px' }} onClick={() => router.push("/products")}>
                            Shop the Collection
                            <span className="hero-cta-icon">
                                <ArrowRight size={18} />
                            </span>
                        </button>

                        {showcaseProduct?.image && (
                            <img
                                src={imageSrc(showcaseProduct.image)}
                                alt="Hero Candle"
                                className="banner-image-main"
                            />
                        )}

                        {/* Floating elements like in the FreshBox design */}
                        <div className="floating-elem" style={{ top: '15%', left: '10%' }}>
                            <Sparkles size={48} color="var(--accent)" />
                        </div>
                        <div className="floating-elem" style={{ bottom: '20%', right: '15%', animationDelay: '1s' }}>
                            <Flame size={56} color="var(--warm-brown)" />
                        </div>
                    </div>
                </section>

                <section className="events-section">
                    <h2 className="section-title" style={{ marginBottom: '40px' }}>Curated for Every Moment</h2>
                    <div className="events-scroll-container">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="event-item"
                                onClick={() => router.push(`/events/${event._id}`)}
                            >
                                <div className="event-icon-box">
                                    {event.image ? (
                                        <img src={imageSrc(event.image)} alt={event.eventname} />
                                    ) : (
                                        <Sparkles size={32} />
                                    )}
                                </div>
                                <div className="event-name">{event.eventname}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <CarouselPlugin />

                <section className="promo-section">
                    <div className="promo-grid">
                        <div className="promo-card dark">
                            <span className="promo-tag">Special Offer</span>
                            <h3 className="promo-title">More Glow,<br />More Savings!</h3>
                            <p style={{ marginBottom: '20px' }}>Get 20% off on your first order of curated collection.</p>
                            <button className="hero-cta" style={{ width: 'fit-content' }}>Claim Offer</button>
                        </div>
                        <div className="promo-card">
                            <span className="promo-tag" style={{ color: 'var(--warm-brown)' }}>Hand-poured</span>
                            <h3 className="promo-title" style={{ color: 'var(--warm-brown)' }}>Nature in<br />Every Jar</h3>
                            <p style={{ color: 'var(--muted-ink)' }}>100% soy wax candles for a cleaner burn.</p>
                        </div>
                    </div>
                </section>

                <section className="bestsellers-section">
                    <div className="section-header">
                        <p className="section-tag">Bestsellers</p>
                        <h2 className="section-title">Our Bestsellers</h2>
                    </div>

                    {isProductsFetching ? (
                        <div className="loading-state">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="bestsellers-grid">
                            {/* Featured Bestseller */}
                            {products?.[0] && (
                                <div className="featured-product-card" onClick={() => router.push(`/products/${products[0]._id}`)}>
                                    <div className="featured-product-info">
                                        <span className="product-label" style={{ color: '#fffdf8' }}>Signature Scent</span>
                                        <h3 className="section-title" style={{ color: 'white', fontSize: '2.5rem' }}>{products[0].name}</h3>
                                        <p style={{ opacity: 0.9, marginBottom: '20px' }}>{products[0].description}</p>
                                        <div className="product-price" style={{ color: 'white' }}>₹{products[0].price}</div>
                                        <button className="hero-cta" style={{ background: 'var(--accent-lime)', border: 'none', marginTop: '20px' }}>
                                            Add to Cart
                                        </button>
                                    </div>
                                    {products[0].image && (
                                        <img
                                            src={imageSrc(products[0].image)}
                                            alt={products[0].name}
                                            className="featured-product-image"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Other Bestsellers */}
                            {products?.slice(1, 7).map((p: Product) => (
                                <div key={p._id} className="product-card-v2" onClick={() => router.push(`/products/${p._id}`)}>
                                    {p.image ? (
                                        <img src={imageSrc(p.image)} alt={p.name} className="product-card-v2-image" />
                                    ) : (
                                        <div className="product-card-v2-image" style={{ display: 'grid', placeItems: 'center' }}>
                                            <Flame size={48} color="#ccc" />
                                        </div>
                                    )}
                                    <div className="product-card-v2-info">
                                        <div className="product-card-v2-name">{p.name}</div>
                                        <div className="product-card-v2-price">₹{p.price}</div>
                                        <button
                                            className="add-btn"
                                            style={{ marginTop: '10px', padding: '8px 15px', fontSize: '0.8rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(p._id);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="cta-section">
                    <div className="cta-content">
                        <h2 className="cta-title">Unlock Special Offers</h2>
                        <p className="cta-desc">Play our daily games and win exclusive discounts</p>
                        <button
                            className="cta-btn"
                            onClick={() => router.push('/games')}
                        >
                            Play Games Now
                        </button>
                    </div>
                </section>

                <section className="pre-footer-cta">
                    <h2 className="pre-footer-title">Ready to<br />Light Up?</h2>
                    <button className="hero-cta" style={{ background: 'white', color: 'var(--warm-brown)', padding: '20px 40px' }} onClick={() => router.push("/products")}>
                        Shop All Candles
                    </button>
                </section>
            </main>

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
                    cartItems.map((item: CartItem, i: number) => {
                        const p = item.productId;
                        if (!p) return null;
                        return (
                            <div key={i} className="cart-item">
                                <div className="cart-item-dot" style={{ background: p?.color?.[0] ?? "#f3d8c1" }} />
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
                    <button className="checkout-btn" onClick={payNow}>
                        Checkout · ₹{cartTotal}
                    </button>
                )}
            </div>

            <MarqueeDemo />
        </>

        <Footer />

    </>
);
}
