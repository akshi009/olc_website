import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@heroui/avatar";

export default function Header() {
    const { user } = useAuthContext();
    const [cartOpen, setCartOpen] = useState(false);
    const navigation = useRouter();
    const userId = user?._id || user?.id || "";
    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`);
            const data = await res.json();
            return data?.wishlist?.[0]?.items ?? [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: wishlistList = [], refetch } = useQuery({
        queryKey: ["wishlist"],
        queryFn: fetchWishlist,
        enabled: !!user,
    });


    // ✅ Cart
    const getCart = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${userId}`);
            const data = await res.json();
            return data?.cart ?? { items: [] };
        } catch (error) {
            console.log(error);
            return { items: [] };
        }
    };

    const { data: cartList, refetch: cartRefetch } = useQuery({
        queryKey: ["cart"],
        queryFn: getCart,
        enabled: !!user,
    });

    const cartItems = cartList?.items ?? [];
    const cartTotal = cartItems.reduce(
        (s: number, item: any) => s + item.productId.price * item.quantity, 0
    );

    return (
        <header className="header">
            <div className="logo">Lumer<span>a</span></div>
            <nav className="header-nav">
                {/* Show Login / Signup only if user is NOT logged in */}
                {!userId && (
                    <div className="flex items-center gap-3">
                        <button
                            className="nav-btn"
                            onClick={() => navigation.push("/login")}
                        >
                            Login
                        </button>

                        <button
                            className="nav-btn outline"
                            onClick={() => navigation.push("/signup")}
                        >
                            Sign Up
                        </button>

                        <div className="divider" />
                    </div>
                )}

                {/* Wishlist */}
                <button
                    className="icon-btn"
                    title="Wishlist"
                    onClick={() => navigation.push("/wishlist")}
                >
                    ♡
                    {wishlistList?.length > 0 && (
                        <span className="badge">{wishlistList.length}</span>
                    )}
                </button>

                {/* Cart */}
                <button
                    className="icon-btn"
                    title="Cart"
                    onClick={() => setCartOpen(true)}
                >
                    🛒
                    {cartItems?.length > 0 && (
                        <span className="badge">{cartItems.length}</span>
                    )}
                </button>

                {/* Profile Section (only when logged in) */}
                {userId && (
                    <div className="flex items-center gap-3 ">
                        <button
                            className="nav-btn flex items-center gap-2 "
                            onClick={() => navigation.push("/profile")}
                        >
                            <Avatar
                                className="rounded-full justify-center p-5"
                                name={user?.name}
                            />
                        </button>
                    </div>
                )}
            </nav>
        </header>
    )
}