"use client"

import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@heroui/avatar";
import "./style/index.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Heart, Search, ShoppingBag, User2 } from "lucide-react";
import { BASE_URL, CartResponse, Product, WishlistItem } from "@/lib/storefront";

export default function Header({ setCartOpen, wishlistLength }: { cartOpen?: boolean, setCartOpen?: (open: boolean) => void, wishlistLength?: number, productList?: Product[] }) {
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
            const res = await axios.get(`${BASE_URL}/wishlist/${userId}`);
            return res.data?.wishlist?.[0]?.items ?? [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: wishlistList = [] } = useQuery<WishlistItem[]>({
        queryKey: ["wishlist", userId],
        queryFn: fetchWishlist,
        enabled: !!user,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });


    // ✅ Cart
    const getCart = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/cart/${userId}`);
            return res.data?.cart ?? { items: [] };
        } catch (error) {
            console.log(error);
            return { items: [] };
        }
    };

    const { data: products = [], isFetching: isProductsFetching } = useQuery<Product[]>({
        queryKey: ["products", debouncedSearch],
        queryFn: async () => {
            const res = await axios.get(
                `${BASE_URL}/products?search=${debouncedSearch}`
            );
            return res.data;
        },
        enabled: !!debouncedSearch,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { data: cartList } = useQuery<CartResponse>({
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

    const handleSelect = (item: Product) => {
        setSearchText(item.name);
        navigation.push(`/products/${item._id}`)
        setShowDropdown(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                {!pathname.startsWith('/admin') && (
                    <button className="logo" onClick={() => navigation.push("/")}>
                        <span className="logo-mark">OL</span>
                        <span className="logo-copy">
                            OhLittle<span>Candle</span>
                        </span>
                    </button>
                )}
                <nav className="header-nav">
                    {!pathname.startsWith('/admin') && (
                        <div className="header-links">
                            <button className={`text-link${pathname === "/" ? " active" : ""}`} onClick={() => navigation.push("/")}>Home</button>
                            <button className={`text-link${pathname.startsWith("/products") ? " active" : ""}`} onClick={() => navigation.push("/products")}>Shop</button>
                            <button className={`text-link${pathname.startsWith("/cart") ? " active" : ""}`} onClick={() => navigation.push("/cart")}>Cart</button>
                        </div>
                    )}

                    {/* 🔍 Search */}
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
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
                                    products.map((item: Product) => (
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
                                    className="nav-btn"
                                    onClick={() => navigation.push("/games")}
                                >
                                    🎮 Games
                                </button>

                                <button
                                    className="icon-btn"
                                    onClick={() => navigation.push("/wishlist")}
                                    aria-label="Wishlist"
                                >
                                    <Heart size={18} />
                                    {(wishlistLength ?? wishlistList.length) > 0 && (
                                        <span className="badge">{wishlistLength ?? wishlistList.length}</span>
                                    )}
                                </button>

                                <button
                                    className="icon-btn"
                                    onClick={() => setCartOpen ? setCartOpen(true) : navigation.push("/cart")}
                                    aria-label="Cart"
                                >
                                    <ShoppingBag size={18} />
                                    {cartItems.length > 0 && (
                                        <span className="badge">{cartItems.length}</span>
                                    )}
                                </button>

                                {userId && (
                                    <button
                                        className="profile-btn"
                                        onClick={() => navigation.push("/profile")}
                                    >
                                        {user?.name ? (
                                            <Avatar
                                                className="avatar"
                                                name={user?.name}
                                            />
                                        ) : (
                                            <span className="avatar-fallback">
                                                <User2 size={16} />
                                            </span>
                                        )}
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
