import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@heroui/avatar";
import "./style/index.css";
import axios from "axios";

export default function Header({ cartOpen, setCartOpen, wishlistLength }: { cartOpen?: boolean, setCartOpen?: (open: boolean) => void, wishlistLength?: number }) {
    const { user } = useAuthContext();
    const navigation = useRouter();
    const pathname = usePathname()
    const userId = user?._id || user?.id || "";
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

    const { data: cartList, refetch: cartRefetch } = useQuery({
        queryKey: ["cart", userId],
        queryFn: getCart,
        enabled: !!user,
    });

    const cartItems = cartList?.items ?? [];
    const cartTotal = cartItems.reduce(
        (s: number, item: any) => s + item.productId.price * item.quantity, 0
    );

    return (
        <header className="header">
            {!pathname.startsWith('/admin_dashboard') && <div className="logo">OhLittle<span>Candle</span></div>}

            <nav className="header-nav flex items-center justify-between w-full">

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

                {userId && user?.role === "admin" &&
                    <div className="flex  gap-3 justify-end w-full">
                        <button
                            className={`nav-btn ${pathname === "/admin_dashboard" ? "outline" : ""}`}
                            onClick={() => navigation.push("/admin_dashboard")}
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

                {!pathname.startsWith('/admin_dashboard') && (
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
                    </>
                )}

            </nav>
        </header>
    )
}