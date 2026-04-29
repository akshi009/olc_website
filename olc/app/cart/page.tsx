"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Footer from "../footer/page";
import "../products/style/index.css";
import { BASE_URL, CartItem, CartResponse, imageSrc } from "@/lib/storefront";
import { useAuthContext } from "../context/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const userId = user?._id || user?.id || "";

  const { data: cart, refetch, isLoading } = useQuery<CartResponse>({
    queryKey: ["cart-page", userId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/cart/${userId}`);
      const data = await response.json();
      return data?.cart ?? { items: [] };
    },
    enabled: !!userId,
  });

  const updateQty = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    await fetch(`${BASE_URL}/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    refetch();
  };

  const removeItem = async (productId: string) => {
    await fetch(`${BASE_URL}/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });
    refetch();
  };

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + (item.productId?.price ?? 0) * item.quantity, 0);
  const shipping = items.length ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-shell">
        <section className="catalog-hero">
          <p className="pill">Your Cart</p>
          <h1 className="cart-title-large">A cleaner checkout flow starts here.</h1>
          <p className="cart-subtitle">Review quantities, remove items, and move to payment with a dedicated cart page.</p>
        </section>

        {!userId ? (
          <div className="empty-state">Please log in to view your cart.</div>
        ) : isLoading ? (
          <div className="empty-state">Loading cart...</div>
        ) : !items.length ? (
          <div className="empty-state">Your cart is empty. Add a few candles from the shop first.</div>
        ) : (
          <div className="cart-layout">
            <section className="cart-list">
              {items.map((item: CartItem) => (
                <article key={item.productId?._id} className="cart-entry">
                  <div className="cart-thumb">
                    {item.productId?.image ? (
                      <img src={imageSrc(item.productId.image)} alt={item.productId.name} className="cart-item-image" />
                    ) : null}
                  </div>
                  <div>
                    <h3>{item.productId?.name}</h3>
                    <p>{item.productId?.description}</p>
                    <div className="qty-row">
                      <button onClick={() => item.productId?._id && updateQty(item.productId._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => item.productId?._id && updateQty(item.productId._id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div>
                    <div className="price-display">₹{(item.productId?.price ?? 0) * item.quantity}</div>
                    <button className="secondary-btn" onClick={() => item.productId?._id && removeItem(item.productId._id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="cart-summary-row">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="summary-line summary-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button className="primary-btn" onClick={() => router.push("/")}>Proceed to Payment</button>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
