"use client"

import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@heroui/avatar";
import "./style/index.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Header({ cartOpen, setCartOpen, wishlistLength, productList }: { cartOpen?: boolean, setCartOpen?: (open: boolean) => void, wishlistLength?: number, productList?: any[] }) {
    const { user } = useAuthContext();
    const navigation = useRouter();
    const pathname = usePathname()
    const [searchText, setSearchText] = useState("")
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const userId = user?._id || user?.id || "";
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`);
            return res.data?.wishlist?.[0]?.items ?? [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: wishlistList = [], refetch } = useQuery({
        queryKey: ["wishlist", userId],
        queryFn: fetchWishlist,
        enabled: !!user,
    });


    // ✅ Cart
    const getCart = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${userId}`);
            return res.data?.cart ?? { items: [] };
        } catch (error) {
            console.log(error);
            return { items: [] };
        }
    };


    const { data: products, isFetching: isProductsFetching } = useQuery({
        queryKey: ["products", debouncedSearch],
        queryFn: () => axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products?search=${debouncedSearch}`),
        enabled: !!debouncedSearch,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { data: cartList, refetch: cartRefetch } = useQuery({
        queryKey: ["cart", userId],
        queryFn: getCart,
        enabled: !!user,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const cartItems = cartList?.items ?? [];
    const cartTotal = cartItems.reduce(
        (s: number, item: any) => s + item.productId.price * item.quantity, 0
    );

    const handleSearch = (value: string) => {
        setSearchText(value);

        if (!value) {
            setShowDropdown(false);
            return;
        }
        setShowDropdown(true);
    };

    const handleSelect = (item: any) => {
        setSearchText(item.name);
        setShowDropdown(false);
    };

    return (
        <header className="header">
            {!pathname.startsWith('/admin') && <div className="logo">OhLittle<span>Candle</span></div>}

            <nav className="header-nav flex items-center justify-end w-full">
                <input type="text" placeholder="Search" className="nav-btn outline" value={searchText} onChange={(e) => handleSearch(e.target.value)} />
                {showDropdown && results.length > 0 && (
                    <div className="dropdown">
                        {results.map((item: any) => (
                            <div
                                key={item._id}
                                className="dropdown-item"
                                onClick={() => handleSelect(item)}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}

                {!userId && (
                    <div className="flex items-center gap-3">
                        <button
                            className="nav-btn outline"
                            onClick={() => navigation.push("/login")}
                        >
                            Login
                        </button>

                        {/* <button
                            className="nav-btn outline"
                            onClick={() => navigation.push("/signup")}
                        >
                            Sign Up
                        </button> */}

                        <div className="divider" />
                    </div>
                )}



                {userId && user?.role === "admin" &&
                    <div className="flex  gap-3 justify-end w-full">
                        <button
                            className={`nav-btn ${pathname === "/admin" ? "outline" : ""}`}
                            onClick={() => navigation.push("/admin")}
                        >
                            Admin Dashboard
                        </button>

                        <button
                            className={`nav-btn ${pathname === "/" ? "outline" : ""}`}
                            onClick={() => navigation.push("/")}
                        >
                            Client Dashboard
                        </button>


                    </div>
                }

                {!pathname.startsWith('/admin') && (
                    <>
                        <button
                            className="icon-btn"
                            title="Wishlist"
                            onClick={() => navigation.push("/wishlist")}
                        >
                            ♡
                            {wishlistLength && wishlistLength > 0 && (
                                <span className="badge">{wishlistLength}</span>
                            )}
                        </button>



                        {/* Cart */}
                        <button
                            className="icon-btn"
                            title="Cart"
                            onClick={() => setCartOpen?.(true)}
                        >
                            🛒
                            {cartItems?.length > 0 && (
                                <span className="badge">{cartItems.length}</span>
                            )}
                        </button>

                        {/* Profile Section (only when logged in) */}
                        {userId && (
                            <div className="flex items-center">
                                <button
                                    className="nav-btn flex items-center justify-center"
                                    onClick={() => navigation.push("/profile")}
                                >
                                    <Avatar
                                        className="h-10 rounded-full p-3 text-[#B8965A] font-semibold"
                                        name={user?.name}
                                    />
                                </button>
                            </div>
                        )}

                    </>
                )}

            </nav>
        </header>
    )
}