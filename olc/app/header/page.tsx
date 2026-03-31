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
        refetchOnMount: false,
        refetchOnWindowFocus: false,
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

    const { data: products = [], isFetching: isProductsFetching } = useQuery({
        queryKey: ["products", debouncedSearch],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/products?search=${debouncedSearch}`
            );
            return res.data;
        },
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

    const handleSearch = (value: string) => {
        setSearchText(value);
        setShowDropdown(!!value);
    };

    const handleSelect = (item: any) => {
        setSearchText(item.name);
        navigation.push(`/product/${item._id}`)
        setShowDropdown(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                {!pathname.startsWith('/admin') && (
                    <div className="logo">
                        OhLittle<span>Candle</span>
                    </div>
                )}

                <nav className="header-nav">

                    {/* 🔍 Search */}
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search candles..."
                            className="search-input"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                            onFocus={() => searchText && setShowDropdown(true)}
                        />

                        {showDropdown && (
                            <div className="dropdown">
                                {isProductsFetching && (
                                    <div className="dropdown-item">Searching...</div>
                                )}

                                {!isProductsFetching && products.length === 0 && (
                                    <div className="dropdown-item">No results</div>
                                )}

                                {!isProductsFetching &&
                                    products.length > 0 &&
                                    products.map((item: any) => (
                                        <div
                                            key={item._id}
                                            className="dropdown-item"
                                            onMouseDown={() => handleSelect(item)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* 🔘 Right section */}
                    <div className="header-actions">

                        {!userId && (
                            <>
                                <button
                                    className="nav-btn outline"
                                    onClick={() => navigation.push("/login")}
                                >
                                    Login
                                </button>
                                <div className="divider" />
                            </>
                        )}

                        {userId && user?.role === "admin" && (
                            <>
                                <button
                                    className={`nav-btn ${pathname === "/admin" ? "outline" : ""}`}
                                    onClick={() => navigation.push("/admin")}
                                >
                                    Admin
                                </button>

                                <button
                                    className={`nav-btn ${pathname === "/" ? "outline" : ""}`}
                                    onClick={() => navigation.push("/")}
                                >
                                    Client
                                </button>
                            </>
                        )}

                        {!pathname.startsWith('/admin') && (
                            <>
                                <button
                                    className="icon-btn"
                                    onClick={() => navigation.push("/wishlist")}
                                >
                                    ♡
                                    {wishlistList?.length > 0 && (
                                        <span className="badge">{wishlistList.length}</span>
                                    )}
                                </button>

                                <button
                                    className="icon-btn"
                                    onClick={() => setCartOpen?.(true)}
                                >
                                    🛒
                                    {cartItems.length > 0 && (
                                        <span className="badge">{cartItems.length}</span>
                                    )}
                                </button>

                                {userId && (
                                    <button
                                        className="profile-btn"
                                        onClick={() => navigation.push("/profile")}
                                    >
                                        <Avatar
                                            className="avatar"
                                            name={user?.name}
                                        />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}