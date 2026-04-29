"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Footer from "../footer/page";
import "../products/style/index.css";
import { BASE_URL, imageSrc, WishlistItem } from "@/lib/storefront";
import { Flame } from "lucide-react";

export default function Wishlist() {
    const { user } = useAuthContext();
    const router = useRouter();
    const userId = user?._id || user?.id || "";

    const { data: wishlist = [], isLoading, refetch } = useQuery<WishlistItem[]>({
        queryKey: ["wishlist", userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await fetch(
                `${BASE_URL}/wishlist/${userId}`
            );
            const data = await res.json();
            return data?.wishlist[0]?.items || [];
        },
        enabled: !!userId,
    });

    const removeItem = async (productId: string) => {
        await fetch(`${BASE_URL}/wishlist/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId }),
        });
        refetch();
    };

    const addToCart = async (productId: string) => {
        await fetch(`${BASE_URL}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, quantity: 1 }),
        });
        router.push("/cart");
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="catalog-page">
                    <div className="catalog-shell">
                        <div className="empty-state">Loading your wishlist...</div>
                    </div>
                </div>
            </>
        );
    }


    return (
        <div className="catalog-page">
            <Header />
            <div className="catalog-shell">
                <section className="catalog-hero">
                    <p className="pill">Wishlist</p>
                    <h1>Saved candles, ready when the shopper is.</h1>
                    <p>Your wishlist now behaves like a real shopping step, with direct move-to-cart action.</p>
                </section>

                {wishlist.length === 0 ? (
                    <div className="empty-state">No candles saved yet. Explore the catalog and add a few favorites.</div>
                ) : (
                    <div className="catalog-grid">
                        {wishlist.map((item) => (
                            <article key={item._id ?? item.productId?._id} className="catalog-card">
                                <button className="catalog-visual" onClick={() => item.productId?._id && router.push(`/products/${item.productId._id}`)}>
                                    {item.productId?.image ? (
                                        <img src={imageSrc(item.productId.image)} alt={item.productId?.name} />
                                    ) : (
                                        <div className="card-thumb-fallback">
                                            <Flame size={54} />
                                        </div>
                                    )}
                                </button>
                                <div className="catalog-body">
                                    <h3>{item.productId?.name}</h3>
                                    <p>{item.productId?.description}</p>
                                    <div className="catalog-meta">
                                        {item.productId?.weight && <span className="pill">{item.productId.weight}</span>}
                                        {item.productId?.burnTime && <span className="pill">{item.productId.burnTime}</span>}
                                    </div>
                                    <div className="catalog-price-row">
                                        <span className="price-display">₹{item.productId?.price ?? 0}</span>
                                        <div style={{ display: "flex", gap: 10 }}>
                                            <button className="secondary-btn" onClick={() => item.productId?._id && removeItem(item.productId._id)}>
                                                Remove
                                            </button>
                                            <button className="primary-btn" onClick={() => item.productId?._id && addToCart(item.productId._id)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
