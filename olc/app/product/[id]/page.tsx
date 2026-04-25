"use client";
import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../context/AuthContext";
import Header from "../../header/page";
import Footer from "../../footer/page";
import { ProductViewer } from "../../components/3d/ProductViewer";
import { Heart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import "./style.css";
import "../../components/3d/styles3d.css";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [mainImage, setMainImage] = useState("");
    const [view3D, setView3D] = useState(false);
    const { user } = useAuthContext();
    const userId = user?._id || user?.id || "";

    useEffect(() => {
        params.then((p) => setId(p.id));
    }, [params]);

    // Fetch product details
    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`);
            return res.json();
        },
        enabled: !!id,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    // Fetch wishlist
    const { data: wishlistList = [] } = useQuery({
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

    // Fetch Unsplash images for product
    const { data: unsplashImages = [] } = useQuery({
        queryKey: ["unsplash", product?.name],
        queryFn: async () => {
            if (!product?.name) return [];
            try {
                const res = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                        "luxury candle " + product.name
                    )}&per_page=5&client_id=hV1MXlRBU3r6dCW8GH8_KcXKV_eQB8kJJ-Ej_NsTyqM`
                );
                const data = await res.json();
                return data.results.map((img: any) => img.urls.regular);
            } catch (error) {
                console.log("[v0] Unsplash fetch error:", error);
                return [];
            }
        },
        enabled: !!product?.name,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (unsplashImages.length > 0) {
            setMainImage(unsplashImages[0]);
        } else if (product?.images?.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [unsplashImages, product]);

    useEffect(() => {
        const wishlistIds = wishlistList.map((item: any) => item._id);
        setIsWishlisted(wishlistIds.includes(id));
    }, [wishlistList, id]);

    const toggleWishlist = async () => {
        if (!userId) return;
        try {
            if (isWishlisted) {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/remove`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, productId: id }),
                });
            } else {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, productId: id }),
                });
            }
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.log("[v0] Wishlist error:", error);
        }
    };

    const addToCart = async () => {
        if (!userId) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId: id, quantity }),
            });
        } catch (error) {
            console.log("[v0] Cart error:", error);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="product-detail-loading">
                    <div className="loading-spinner"></div>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="product-detail-container">
                    <p className="not-found">Product not found</p>
                </div>
                <Footer />
            </>
        );
    }

    const images = unsplashImages.length > 0 ? unsplashImages : (product?.images || []);

    return (
        <>
            <Header />
            <div className="product-detail-container">
                <div className="product-detail-grid">
                    {/* Gallery */}
                    <div className="product-gallery">
                        {/* 3D/2D Toggle */}
                        <div className="gallery-toggle">
                            <button
                                className={`toggle-btn ${!view3D ? 'active' : ''}`}
                                onClick={() => setView3D(false)}
                            >
                                2D View
                            </button>
                            <button
                                className={`toggle-btn ${view3D ? 'active' : ''}`}
                                onClick={() => setView3D(true)}
                            >
                                3D View
                            </button>
                        </div>

                        {view3D ? (
                            <Suspense fallback={<div className="viewer-fallback">Loading 3D Model...</div>}>
                                <ProductViewer
                                    productId={id}
                                    productColor={product.color || '#d4a574'}
                                    productHeight={8}
                                    productName={product.name}
                                />
                            </Suspense>
                        ) : (
                            <div className="main-image">
                                {mainImage && (
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className="gallery-image"
                                    />
                                )}
                            </div>
                        )}
                        {images.length > 0 && (
                            <div className="gallery-thumbnails">
                                {images.slice(0, 4).map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`thumbnail ${selectedImage === idx ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedImage(idx);
                                            setMainImage(img);
                                        }}
                                    >
                                        <img src={img} alt={`view ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="product-info">
                        <div className="product-header">
                            <div>
                                <p className="product-category">Premium Candle</p>
                                <h1 className="product-title">{product.name}</h1>
                            </div>
                            <button
                                className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
                                onClick={toggleWishlist}
                            >
                                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Rating */}
                        <div className="rating-section">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={i <= 4 ? "star-filled" : ""}
                                    />
                                ))}
                            </div>
                            <span className="rating-text">4.8 (342 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="price-section">
                            <span className="current-price">${product.price?.toFixed(2) || "49.99"}</span>
                            <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
                            <span className="discount-badge">Save 20%</span>
                        </div>

                        {/* Description */}
                        <p className="product-description">
                            {product.description || "Exquisitely crafted luxury candle made from premium soy wax with enchanting fragrance notes. Perfect for creating ambiance and elevating your space."}
                        </p>

                        {/* Variants */}
                        <div className="variants-section">
                            <label>Scent:</label>
                            <div className="scent-options">
                                {["Vanilla", "Lavender", "Rose"].map((scent) => (
                                    <button key={scent} className="scent-btn">
                                        {scent}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="quantity-section">
                            <label>Quantity:</label>
                            <div className="quantity-control">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <input type="number" value={quantity} readOnly />
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button className="add-to-cart-btn" onClick={addToCart}>
                            Add to Cart
                        </button>

                        {/* Benefits */}
                        <div className="benefits-section">
                            <div className="benefit">
                                <Truck size={20} />
                                <div>
                                    <p className="benefit-title">Free Shipping</p>
                                    <p className="benefit-text">On orders over $50</p>
                                </div>
                            </div>
                            <div className="benefit">
                                <Shield size={20} />
                                <div>
                                    <p className="benefit-title">100% Safe</p>
                                    <p className="benefit-text">Certified authentic products</p>
                                </div>
                            </div>
                            <div className="benefit">
                                <RotateCcw size={20} />
                                <div>
                                    <p className="benefit-title">Easy Returns</p>
                                    <p className="benefit-text">30-day return policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="related-products">
                    <h2 className="related-title">You Might Also Like</h2>
                    <div className="related-grid">
                        {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="related-card">
                                <div className="related-image">
                                    {unsplashImages[idx % unsplashImages.length] && (
                                        <img
                                            src={unsplashImages[idx % unsplashImages.length]}
                                            alt={`Related ${idx}`}
                                        />
                                    )}
                                </div>
                                <p className="related-name">Premium Scent #{idx}</p>
                                <p className="related-price">$49.99</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
