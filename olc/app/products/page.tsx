"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Footer from "../footer/page";
import "./style/index.css";
import { BASE_URL, EventSummary, imageSrc, Product } from "@/lib/storefront";
import { ArrowRight, Flame } from "lucide-react";

const STATIC_CATEGORIES = ["All", "Diwali", "Holi", "Birthday", "Baby Shower", "Wedding"];

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [eventId, setEventId] = useState("All");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/products`);
      return response.json();
    },
  });

  const { data: events = [] } = useQuery<EventSummary[]>({
    queryKey: ["catalog-events"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/events`);
      return response.json();
    },
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category?.includes(category);
      const matchesEvent = eventId === "All" || product.event?.some((event) => event._id === eventId);

      return matchesSearch && matchesCategory && matchesEvent;
    });
  }, [category, eventId, products, search]);

  return (
    <div className="catalog-page">
      <Header />
      <div className="catalog-shell">
        <section className="catalog-hero" style={{ background: '#f3ead6', border: 'none', padding: '60px 40px' }}>
          <span className="pill" style={{ background: 'var(--accent-lime)', border: 'none' }}>The Collection</span>
          <h1 style={{ marginTop: '20px', fontSize: '3.5rem' }}>Sculpted Glow for<br />Every Moment</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
            Discover our small-batch candle atelier. Each piece is hand-poured with intention, 
            using premium soy wax and curated fragrances to transform your space.
          </p>
        </section>

        <div className="catalog-toolbar" style={{ marginTop: '40px', background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
            <input
              className="catalog-search"
              style={{ flex: 1, border: 'none', background: '#f9f9f9' }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by scent or name..."
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select className="catalog-select" style={{ border: 'none', background: '#f9f9f9' }} value={category} onChange={(event) => setCategory(event.target.value)}>
              {STATIC_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select className="catalog-select" style={{ border: 'none', background: '#f9f9f9' }} value={eventId} onChange={(event) => setEventId(event.target.value)}>
              <option value="All">All Events</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.eventname}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="empty-state">Loading our collection...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">No candles found matching your criteria.</div>
        ) : (
          <div className="related-grid" style={{ marginTop: '40px' }}>
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card-v2" onClick={() => router.push(`/products/${product._id}`)}>
                {product.image ? (
                    <img src={imageSrc(product.image)} alt={product.name} className="product-card-v2-image" />
                ) : (
                    <div className="product-card-v2-image" style={{ display: 'grid', placeItems: 'center' }}>
                        <Flame size={48} color="#ccc" />
                    </div>
                )}
                <div className="product-card-v2-info">
                    <div className="product-card-v2-name">{product.name}</div>
                    <div className="product-card-v2-price">₹{product.price}</div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '5px 0' }}>{product.description?.substring(0, 60)}...</p>
                    <button 
                        className="add-btn" 
                        style={{ marginTop: '10px', padding: '10px 15px', fontSize: '0.85rem' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/products/${product._id}`);
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
