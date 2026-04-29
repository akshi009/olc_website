"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Header from "../../header/page";
import Footer from "../../footer/page";
import "../style/index.css";
import { BASE_URL, imageSrc, Product } from "@/lib/storefront";
import { ArrowLeft, Flame, Heart, ShoppingBag } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthContext();
  const userId = user?._id || user?.id || "";

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product-detail", params.id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/products/${params.id}`);
      return response.json();
    },
    enabled: !!params.id,
  });

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["related-products", product?._id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/products`);
      const all = (await response.json()) as Product[];
      return all.filter((item) => item._id !== product?._id).slice(0, 4);
    },
    enabled: !!product?._id,
  });

  const addToCart = async () => {
    if (!userId || !product?._id) {
      router.push("/login");
      return;
    }

    await fetch(`${BASE_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: product._id, quantity: 1 }),
    });

    router.push("/cart");
  };

  const addToWishlist = async () => {
    if (!userId || !product?._id) {
      router.push("/login");
      return;
    }

    await fetch(`${BASE_URL}/wishlist/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: product._id }),
    });
  };

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-shell">
        <button className="secondary-btn" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', padding: 0 }} onClick={() => router.push("/products")}>
          <ArrowLeft size={16} /> Back to shop
        </button>

        {isLoading || !product ? (
          <div className="empty-state">Loading product...</div>
        ) : (
          <>
            <div className="detail-layout">
              <section className="detail-gallery">
                <div className="detail-image-wrap">
                  {product.image ? (
                    <img src={imageSrc(product.image)} alt={product.name} className="detail-image" />
                  ) : (
                    <div className="card-thumb-fallback" style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                      <Flame size={66} color="#6d4937" />
                    </div>
                  )}
                </div>
              </section>

              <aside className="detail-summary">
                <div className="detail-header">
                  <span className="pill" style={{ background: 'var(--accent-lime)', border: 'none' }}>Hand-poured Atelier</span>
                  <h1 className="detail-title">{product.name}</h1>
                </div>

                <div className="detail-price-row">
                  ₹{product.price ?? 0}
                </div>

                <div className="detail-copy">
                  <p style={{ fontSize: '1.1rem', color: '#766558', lineHeight: '1.6' }}>{product.description}</p>
                </div>

                <div className="detail-meta-group">
                  {product.weight && (
                    <div className="meta-chip-v2">
                      <span style={{ opacity: 0.6 }}>Weight:</span> {product.weight}
                    </div>
                  )}
                  {product.burnTime && (
                    <div className="meta-chip-v2">
                      <span style={{ opacity: 0.6 }}>Burn Time:</span> {product.burnTime}
                    </div>
                  )}
                  {product.category?.map((value) => (
                    <div key={value} className="meta-chip-v2">{value}</div>
                  ))}
                </div>

                {!!product.color?.length && (
                  <div className="color-section" style={{ marginTop: '20px' }}>
                    <p style={{ fontWeight: 700, marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vessel Tone</p>
                    <div className="color-row">
                      {product.color.map((value) => (
                        <span key={value} className="color-dot" style={{ background: value }} title={value} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-actions">
                  <button className="add-to-cart-btn" onClick={addToCart}>
                    <ShoppingBag size={20} /> Add to Cart
                  </button>
                  <button className="wishlist-btn-v2" onClick={addToWishlist} title="Add to Wishlist">
                    <Heart size={24} />
                  </button>
                </div>

                {/* Extra product features */}
                <div className="product-features" style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3ead6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Flame size={18} color="#6d4937" />
                      </div>
                      <div>
                         <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Clean Burn</p>
                         <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>100% natural soy wax</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3ead6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <ShoppingBag size={18} color="#6d4937" />
                      </div>
                      <div>
                         <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Gift Ready</p>
                         <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Premium packaging</p>
                      </div>
                   </div>
                </div>
              </aside>
            </div>

            <section className="related-section">
              <div className="section-header align-left">
                <p className="section-tag" style={{ color: 'var(--accent)' }}>Collection</p>
                <h2 className="section-title" style={{ fontSize: '3rem' }}>You May Also Like</h2>
              </div>
              <div className="related-grid">
                {relatedProducts.map((item) => (
                  <div key={item._id} className="product-card-v2" onClick={() => router.push(`/products/${item._id}`)}>
                    {item.image ? (
                        <img src={imageSrc(item.image)} alt={item.name} className="product-card-v2-image" />
                    ) : (
                        <div className="product-card-v2-image" style={{ display: 'grid', placeItems: 'center' }}>
                            <Flame size={48} color="#ccc" />
                        </div>
                    )}
                    <div className="product-card-v2-info">
                        <div className="product-card-v2-name">{item.name}</div>
                        <div className="product-card-v2-price">₹{item.price}</div>
                        <button 
                            className="add-btn" 
                            style={{ marginTop: '10px', padding: '8px 15px', fontSize: '0.8rem' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                // addToCart for related product would need refetching logic or just navigate
                                router.push(`/products/${item._id}`);
                            }}
                        >
                            View Detail
                        </button>
                    </div>
                </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
