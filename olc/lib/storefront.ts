export type EventSummary = {
  _id: string;
  eventname: string;
  image?: string;
};

export type Product = {
  _id: string;
  name: string;
  description?: string;
  weight?: string;
  burnTime?: string;
  price?: number;
  image?: string;
  color?: string[];
  category?: string[];
  event?: EventSummary[];
};

export type WishlistItem = {
  _id?: string;
  productId?: Product;
};

export type CartItem = {
  quantity: number;
  productId?: Product;
};

export type CartResponse = {
  items: CartItem[];
};

export type OrderItem = {
  name?: string;
  title?: string;
  price?: number;
  quantity?: number;
  image?: string;
  variant?: string;
  productId?: Product;
};

export type Order = {
  _id: string;
  id?: string;
  status?: string;
  totalAmount?: number;
  total?: number;
  createdAt?: string;
  address?: string;
  items?: OrderItem[];
};

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export const imageSrc = (image?: string) => {
  if (!image) return "";
  return image.startsWith("data:") || image.startsWith("http")
    ? image
    : `data:image/png;base64,${image}`;
};

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
