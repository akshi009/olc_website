"use client"
import { useQuery } from "@tanstack/react-query";

export default function Wishlist() {
    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/699a1dd23ddf8461eb0f0b65`);
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    const { data: wishlist, isLoading } = useQuery({ queryKey: ["wishlist"], queryFn: fetchWishlist })
    console.log(wishlist);
    return (
        <div>
            <h1>Wishlist</h1>
        </div>
    );
}