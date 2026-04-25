"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import Header from "../header/page";
import Footer from "../footer/page";
import { Heart } from "lucide-react";
import "./style.css";

export default function FeaturedProducts() {
    const router = useRouter();
    const { user } = useAuthContext();
    const userId = user?._id || user?.id || "";

    // Fetch products
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);
            return res.json();
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    // Fetch wishlist
    const { data: wishlistList = [], refetch } = useQuery({
        queryKey: ["wishlist", userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`);
            const data = await res.json();
            return data?.wishlist[0]?.items ?? [];
        },
        enabled: !!userId,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const toggleWishlist = async (productId: string) => {
        if (!userId) {
            router.push("/login");
            return;
        }
        const isWishlisted = wishlistList.some((item: any) => item.productId?._id === productId);
        try {
            if (isWishlisted) {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/remove`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, productId }),
                });
            } else {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, productId }),
                });
            }
            refetch();
        } catch (error) {
            console.log("[v0] Wishlist error:", error);
        }
    };

    return (
        <>
            <Header />
            <div className="featured-container">
                <div className="featured-header">
                    <h1 className="featured-title">Featured Collection</h1>
                    <p className="featured-subtitle">
                        Discover our curated selection of premium luxury candles
                    </p>
                </div>

                {isLoading ? (
                    <div className="featured-loading">Loading...</div>
                ) : (
                    <div className="featured-grid">
                        {products.slice(0, 12).map((product: any) => {
                            const isWishlisted = wishlistList.some(
                                (item: any) => item.productId?._id === product._id
                            );

                            return (
                                <div
                                    key={product._id}
                                    className="featured-card"
                                    onClick={() => router.push(`/product/${product._id}`)}
                                >
                                    <div className="featured-image-container">
                                        {product.image ? (
                                            <img
                                                src={
                                                    product.image?.startsWith("data:") ||
                                                    product.image?.startsWith("http")
                                                        ? product.image
                                                        : `data:image/png;base64,${product.image}`
                                                }
                                                alt={product.name}
                                                className="featured-image"
                                            />
                                        ) : (
                                            <div className="featured-placeholder">🕯</div>
                                        )}
                                        <button
                                            className={`featured-wishlist-btn ${
                                                isWishlisted ? "active" : ""
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWishlist(product._id);
                                            }}
                                        >
                                            <Heart
                                                size={20}
                                                fill={isWishlisted ? "currentColor" : "none"}
                                            />
                                        </button>
                                    </div>
                                    <div className="featured-info">
                                        <h3 className="featured-name">{product.name}</h3>
                                        <p className="featured-desc">{product.description}</p>
                                        <div className="featured-footer">
                                            <span className="featured-price">₹{product.price}</span>
                                            <span className="featured-badge">{product.weight}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
