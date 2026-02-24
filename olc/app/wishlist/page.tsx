"use client"
import { useQuery } from "@tanstack/react-query";

export default function Wishlist() {
    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/699a1dd23ddf8461eb0f0b65`);
            const data = await res.json();
            console.log(data?.wishlist);
            return data?.wishlist;
        } catch (error) {
            console.log(error);
        }
    }
    const { data: wishlist, isLoading } = useQuery({ queryKey: ["wishlist"], queryFn: fetchWishlist })

    return (
        <div>
            <h1>Wishlist</h1>
            {wishlist?.map((item: any) => (
                <div key={item._id}>
                    <p>Name - {item.userId.name}</p>
                    <p>id - {item.userId._id}</p>
                </div>
            ))}
        </div>
    );
}