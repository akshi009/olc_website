"use client";
import "./style/index.css";

export default function Footer() {
    return (
        <div className="bg-black pt-16 px-4 mx-10">
            <div
                style={{
                    background: "#0a0a0a",
                    borderTop: "1px solid #1a1a1a",
                    fontFamily: "'Georgia', serif",
                    color: "#e8e2d9",
                    position: "relative",
                    overflow: "hidden",
                    paddingTop: 40,
                    padding: 40
                }}
            >
                {/* Ambient glow — matches hero-glow on site */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60%",
                        height: "260px",

                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Top section */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "3rem",
                            alignItems: "start",
                        }}
                    >
                        {/* Brand column */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", gridColumn: "span 1", minWidth: "220px" }}>
                            {/* Logo / wordmark */}
                            <a href="/" style={{ textDecoration: "none" }}>
                                <span
                                    style={{
                                        fontFamily: "'Georgia', serif",
                                        fontStyle: "italic",
                                        fontSize: "1.5rem",
                                        fontWeight: 400,
                                        color: "#ffffff",
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    OhLittleCandle
                                </span>
                            </a>

                            <p
                                style={{
                                    fontFamily: "'Helvetica Neue', sans-serif",
                                    fontSize: "0.82rem",
                                    lineHeight: "1.8",
                                    color: "#7a7065",
                                    maxWidth: "22rem",
                                    fontWeight: 300,
                                    letterSpacing: "0.01em",
                                }}
                            >
                                Artisan hand-poured candles crafted in small batches with
                                ethically-sourced waxes and rare botanicals — made to transform
                                any space into sanctuary.
                            </p>

                            {/* Social icons */}
                            <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
                                {[
                                    {
                                        label: "X / Twitter",
                                        path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
                                        filled: true,
                                    },
                                ].map(({ label, path, filled }) => (
                                    <a
                                        key={label}
                                        href="#"
                                        title={label}
                                        style={{
                                            color: "#4a4540",
                                            transition: "color 0.2s",
                                            display: "flex",
                                        }}
                                        className="icon-link"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d={path} />
                                        </svg>
                                    </a>
                                ))}

                                {/* GitHub */}
                                <a href="#" title="GitHub" className="icon-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                                    </svg>
                                </a>

                                {/* LinkedIn */}
                                <a href="#" title="LinkedIn" className="icon-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                                    </svg>
                                </a>

                                {/* YouTube */}
                                <a href="#" title="YouTube" className="icon-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
                                    </svg>
                                </a>

                                {/* Instagram */}
                                <a href="#" title="Instagram" className="icon-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Nav columns */}
                        {[
                            {
                                heading: "Shop",
                                links: ["All Candles", "Best Sellers", "New Arrivals", "Gift Sets"],
                            },
                            {
                                heading: "Explore",
                                links: ["Our Story", "The Craft", "Ingredients", "Blog"],
                            },
                            {
                                heading: "Support",
                                links: ["Track Order", "Returns", "FAQ", "Contact Us", "Privacy Policy"],
                                badge: null,
                            },
                        ].map(({ heading, links }) => (
                            <div key={heading}>
                                <h3
                                    style={{
                                        fontFamily: "'Helvetica Neue', sans-serif",
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        color: "#a8956a",
                                        marginBottom: "1.2rem",
                                    }}
                                >
                                    {heading}
                                </h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {links.map(link => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                style={{
                                                    fontFamily: "'Helvetica Neue', sans-serif",
                                                    fontSize: "0.83rem",
                                                    color: "#5c5650",
                                                    textDecoration: "none",
                                                    fontWeight: 300,
                                                    letterSpacing: "0.01em",
                                                    transition: "color 0.2s",
                                                }}
                                                className="icon-link"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            borderTop: "1px solid #1c1a17",
                            marginTop: "4rem",
                            paddingTop: "1.5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "0.75rem",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "'Helvetica Neue', sans-serif",
                                fontSize: "0.75rem",
                                color: "#3a3630",
                                fontWeight: 300,
                                letterSpacing: "0.02em",
                            }}
                        >
                            © 2025 OhLittleCandle. All rights reserved.
                        </p>
                        <p
                            style={{
                                fontFamily: "'Helvetica Neue', sans-serif",
                                fontSize: "0.75rem",
                                color: "#3a3630",
                                fontWeight: 300,
                                letterSpacing: "0.02em",
                            }}
                        >
                            Crafted with care · Small batch · Ethically sourced
                        </p>
                    </div>
                </div>

                {/* Large italic wordmark at the bottom — matching the original ghost text effect */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            margin: "auto",
                            width: "70%",
                            height: "100%",
                            pointerEvents: "none",
                        }}
                    />
                    <h1
                        style={{
                            textAlign: "center",
                            fontFamily: "'Georgia', serif",
                            fontStyle: "italic",
                            fontWeight: 500,
                            fontSize: "clamp(3rem, 13vw, 13rem)",
                            lineHeight: 0.75,
                            color: "transparent",
                            WebkitTextStroke: "1px #3c3627ff",
                            marginTop: "1.5rem",
                            userSelect: "none",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        OhLittleCandle
                    </h1>
                </div>
            </div>
        </div >
    );
}