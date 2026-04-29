"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Header from "../../header/page";
import Footer from "../../footer/page";
import "../../products/style/index.css";
import { BASE_URL, EventSummary, imageSrc, Product } from "@/lib/storefront";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";

type EventResponse = {
  event: EventSummary;
  products: Product[];
};

export default function EventCollectionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery<EventResponse>({
    queryKey: ["event-collection", params.id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/events/${params.id}`);
      return response.json();
    },
    enabled: !!params.id,
  });

  return (
    <div className="event-page">
      <Header />
      <div className="event-shell">
        <button className="secondary-btn detail-back" onClick={() => router.push("/")}>
          <ArrowLeft size={16} /> Back to home
        </button>

        {isLoading || !data ? (
          <div className="empty-state">Loading event collection...</div>
        ) : (
          <>
            <section className="event-hero event-banner">
              <div className="event-intro" style={{ padding: 28 }}>
                <p className="pill">Event Collection</p>
                <h1>{data.event.eventname}</h1>
                <p>
                  Candles merchandised around a specific celebration, so customers can shop by
                  occasion instead of scrolling through the entire catalog.
                </p>
              </div>
              <div className="event-banner-media">
                {data.event.image ? (
                  <img src={imageSrc(data.event.image)} alt={data.event.eventname} className="event-banner-image" />
                ) : (
                  <div className="card-thumb-fallback">
                    <Flame size={60} />
                  </div>
                )}
              </div>
            </section>

            {data.products.length === 0 ? (
              <div className="empty-state">No candles are linked to this event yet.</div>
            ) : (
              <div className="event-product-grid">
                {data.products.map((product) => (
                  <button key={product._id} className="event-card" onClick={() => router.push(`/products/${product._id}`)}>
                    <div className="event-card-media">
                      {product.image ? (
                        <img src={imageSrc(product.image)} alt={product.name} />
                      ) : (
                        <div className="card-thumb-fallback">
                          <Flame size={50} />
                        </div>
                      )}
                    </div>
                    <div className="event-card-copy">
                      <p className="pill">Occasion pick</p>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <span className="event-link">
                        View product <ArrowRight size={16} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
