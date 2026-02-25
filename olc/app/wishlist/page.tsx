"use client"
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";

export default function Wishlist() {
    const { user } = useAuthContext();
    const userId = user?._id || user?.id || "";

    const { data: wishlist, isLoading } = useQuery({
        queryKey: ["wishlist", userId],
        queryFn: async () => {
            if (!userId) return null;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`);
                const data = await res.json();
                return data?.wishlist;
            } catch (error) {
                throw error;
            }
        },
        // enabled: !!userId,
    })

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