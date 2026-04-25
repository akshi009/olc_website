"use client";
import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../context/AuthContext";
import Header from "../header/page";
import Footer from "../footer/page";
import "./style.css";

export default function GamesPage() {
    const { user } = useAuthContext();
    const [activeGame, setActiveGame] = useState<"wheel" | "scratch">("wheel");
    const [coupons, setCoupons] = useState<any[]>([]);
    const [wheelSpun, setWheelSpun] = useState(false);
    const [wheelResult, setWheelResult] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const userId = user?._id || user?.id || "";

    // Wheel configuration
    const wheelSegments = [
        { label: "20% OFF", color: "#ffb84d", discount: 20 },
        { label: "FREE SHIP", color: "#ff9d5c", discount: 0, freeShip: true },
        { label: "10% OFF", color: "#d4a574", discount: 10 },
        { label: "TRY AGAIN", color: "#c9a89f", discount: 0 },
        { label: "50% OFF", color: "#ffe6cc", discount: 50 },
        { label: "FREE GIFT", color: "#ffb84d", discount: 0, freeGift: true },
    ];

    // Draw spinning wheel
    useEffect(() => {
        if (activeGame !== "wheel" || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 200;

        const drawWheel = (rotation: number = 0) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            wheelSegments.forEach((segment, i) => {
                const startAngle = (i / wheelSegments.length) * Math.PI * 2;
                const endAngle = ((i + 1) / wheelSegments.length) * Math.PI * 2;

                ctx.fillStyle = segment.color;
                ctx.beginPath();
                ctx.arc(0, 0, radius, startAngle, endAngle);
                ctx.lineTo(0, 0);
                ctx.fill();

                ctx.strokeStyle = "#0a0605";
                ctx.lineWidth = 3;
                ctx.stroke();

                // Label
                ctx.save();
                ctx.rotate(startAngle + (endAngle - startAngle) / 2);
                ctx.textAlign = "right";
                ctx.fillStyle = "#0a0605";
                ctx.font = "bold 16px 'Geist', sans-serif";
                ctx.fillText(segment.label, radius - 40, 5);
                ctx.restore();
            });

            ctx.restore();

            // Center circle
            ctx.fillStyle = "#fff4e6";
            ctx.beginPath();
            ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
            ctx.fill();

            // Pointer
            ctx.fillStyle = "#ffb84d";
            ctx.beginPath();
            ctx.moveTo(centerX, 10);
            ctx.lineTo(centerX - 15, 50);
            ctx.lineTo(centerX + 15, 50);
            ctx.closePath();
            ctx.fill();
        };

        drawWheel(0);
    }, [activeGame]);

    const spinWheel = async () => {
        if (wheelSpun || !user) {
            alert(wheelSpun ? "You already spun today! Come back tomorrow." : "Please log in first.");
            return;
        }

        setWheelSpun(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 200;

        let rotation = 0;
        const spinDuration = 4000;
        const startTime = Date.now();
        const randomOffset = Math.random() * Math.PI * 2;
        const finalRotation = Math.random() * 50 + 20;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);

            rotation = progress * finalRotation + randomOffset;

            // Clear and redraw
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(rotation);

                wheelSegments.forEach((segment, i) => {
                    const startAngle = (i / wheelSegments.length) * Math.PI * 2;
                    const endAngle = ((i + 1) / wheelSegments.length) * Math.PI * 2;

                    ctx.fillStyle = segment.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, radius, startAngle, endAngle);
                    ctx.lineTo(0, 0);
                    ctx.fill();

                    ctx.strokeStyle = "#0a0605";
                    ctx.lineWidth = 3;
                    ctx.stroke();

                    ctx.save();
                    ctx.rotate(startAngle + (endAngle - startAngle) / 2);
                    ctx.textAlign = "right";
                    ctx.fillStyle = "#0a0605";
                    ctx.font = "bold 16px 'Geist', sans-serif";
                    ctx.fillText(segment.label, radius - 40, 5);
                    ctx.restore();
                });

                ctx.restore();

                ctx.fillStyle = "#fff4e6";
                ctx.beginPath();
                ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#ffb84d";
                ctx.beginPath();
                ctx.moveTo(centerX, 10);
                ctx.lineTo(centerX - 15, 50);
                ctx.lineTo(centerX + 15, 50);
                ctx.closePath();
                ctx.fill();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Determine winner
                const normalizedRotation = rotation % (Math.PI * 2);
                const segmentAngle = (Math.PI * 2) / wheelSegments.length;
                const winnerIndex = Math.floor((normalizedRotation / segmentAngle + 1) % wheelSegments.length);
                const winner = wheelSegments[winnerIndex];

                setWheelResult(winner.label);

                // Generate coupon
                const couponCode = `LUCKY${Date.now().toString().slice(-6)}`;
                const newCoupon = {
                    code: couponCode,
                    discount: winner.discount,
                    freeShip: winner.freeShip || false,
                    freeGift: winner.freeGift || false,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                };

                setCoupons([...coupons, newCoupon]);
            }
        };

        animate();
    };

    return (
        <>
            <Header />
            <div className="games-container">
                {/* Hero Section */}
                <div className="games-hero">
                    <h1 className="games-title">Unlock Amazing Offers</h1>
                    <p className="games-subtitle">Play our games daily and win exclusive discounts!</p>
                </div>

                {/* Game Tabs */}
                <div className="games-tabs">
                    <button
                        className={`game-tab ${activeGame === "wheel" ? "active" : ""}`}
                        onClick={() => setActiveGame("wheel")}
                    >
                        Spin the Wheel
                    </button>
                    <button
                        className={`game-tab ${activeGame === "scratch" ? "active" : ""}`}
                        onClick={() => setActiveGame("scratch")}
                    >
                        Scratch Card
                    </button>
                </div>

                <div className="games-content">
                    {/* Spin Wheel Game */}
                    {activeGame === "wheel" && (
                        <div className="game-section">
                            <div className="wheel-container">
                                <canvas
                                    ref={canvasRef}
                                    width={500}
                                    height={500}
                                    className="wheel-canvas"
                                />
                            </div>

                            <div className="wheel-info">
                                <h2>Spin the Wheel of Fortune</h2>
                                <p>Try your luck and win amazing discounts, free shipping, and exclusive gifts!</p>

                                <button
                                    className={`spin-btn ${wheelSpun ? "disabled" : ""}`}
                                    onClick={spinWheel}
                                    disabled={wheelSpun}
                                >
                                    {wheelSpun ? "You've spun today!" : "Spin Now"}
                                </button>

                                {wheelResult && (
                                    <div className="wheel-result">
                                        <p className="result-label">You Won!</p>
                                        <p className="result-prize">{wheelResult}</p>
                                        {coupons.length > 0 && (
                                            <p className="result-code">Code: {coupons[coupons.length - 1].code}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Scratch Card Game */}
                    {activeGame === "scratch" && (
                        <div className="game-section">
                            <ScratchCard onWin={(prize) => setCoupons([...coupons, prize])} />
                        </div>
                    )}
                </div>

                {/* Coupons Section */}
                {coupons.length > 0 && (
                    <div className="coupons-section">
                        <h2 className="coupons-title">Your Winnings</h2>
                        <div className="coupons-grid">
                            {coupons.map((coupon, idx) => (
                                <div key={idx} className="coupon-card">
                                    <div className="coupon-header">
                                        {coupon.discount > 0 && (
                                            <div className="coupon-badge">{coupon.discount}% OFF</div>
                                        )}
                                        {coupon.freeShip && <div className="coupon-badge">FREE SHIP</div>}
                                        {coupon.freeGift && <div className="coupon-badge">FREE GIFT</div>}
                                    </div>
                                    <div className="coupon-code">{coupon.code}</div>
                                    <p className="coupon-expires">
                                        Expires: {new Date(coupon.expires).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

function ScratchCard({ onWin }: { onWin: (prize: any) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scratched, setScratched] = useState(false);
    const [prize, setPrize] = useState<any>(null);

    const prizes = [
        { label: "15% OFF", discount: 15 },
        { label: "25% OFF", discount: 25 },
        { label: "FREE SHIPPING", freeShip: true },
        { label: "30% OFF", discount: 30 },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw scratch card
        ctx.fillStyle = "#d4a574";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffb84d";
        ctx.font = "28px 'Playfair Display', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Scratch Me!", canvas.width / 2, canvas.height / 2);

        // Select random prize
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        setPrize(randomPrize);

        // Add scratch listener
        const handleMouseMove = (e: MouseEvent) => {
            if (!scratched) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ctx.clearRect(x - 15, y - 15, 30, 30);
            }
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("click", () => {
            if (!scratched) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setScratched(true);
                onWin({
                    code: `SCRATCH${Date.now().toString().slice(-6)}`,
                    ...prize,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                });
            }
        });

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, [scratched]);

    return (
        <div className="scratch-game">
            <h2>Scratch the Card</h2>
            <p>Hover over the card and click to reveal your prize!</p>
            <div className="scratch-container">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={200}
                    className="scratch-canvas"
                />
                {scratched && prize && (
                    <div className="scratch-result">
                        <p className="scratch-prize">{prize.label}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
