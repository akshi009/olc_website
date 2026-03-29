"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselPlugin() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    return (
        <section
            style={{
                background: "#f6f4f1",
                padding: "4rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2.5rem",
            }}
        >
            {/* Section header */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <p
                    style={{
                        fontSize: "0.68rem",
                        fontFamily: "'Geist', sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#a8956a",
                    }}
                >
                    Our Collection
                </p>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                        fontWeight: 400,
                        color: "#1a1612",
                        letterSpacing: "-0.01em",
                    }}
                >
                    Crafted for every mood
                </h2>
            </div>

            {/* Carousel */}
            <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-6xl"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="ml-3">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem key={index} className="pl-3 basis-1/2 sm:basis-1/3 lg:basis-1/5">
                            <div
                                style={{
                                    border: "1px solid #d6cfc2",
                                    borderRadius: "1rem",
                                    overflow: "hidden",
                                    transition: "border-color 0.25s, background 0.25s",
                                    cursor: "pointer",
                                    margin: "1rem",
                                }}
                            >
                                {/* Product image area */}
                                <div
                                    style={{
                                        aspectRatio: "3/4",
                                        background: "#e6dfd3",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "2.5rem",
                                        borderBottom: "1px solid #d6cfc2",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Candle flame glow */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "30%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: "60%",
                                            height: "50%",
                                            background: "radial-gradient(ellipse at center, rgba(168,149,106,0.22) 0%, transparent 70%)",
                                            pointerEvents: "none",
                                        }}
                                    />
                                    🕯
                                </div>

                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Custom nav buttons */}
                <CarouselPrevious
                    style={{
                        background: "#ede8de",
                        border: "1px solid #d6cfc2",
                        color: "#2c2820",
                        borderRadius: "50%",
                        width: "2.2rem",
                        height: "2.2rem",
                        transition: "background 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#e6dfd3"
                            ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#c8bfb0"
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#ede8de"
                            ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d6cfc2"
                    }}
                />
                <CarouselNext
                    style={{
                        background: "#ede8de",
                        border: "1px solid #d6cfc2",
                        color: "#2c2820",
                        borderRadius: "50%",
                        width: "2.2rem",
                        height: "2.2rem",
                        transition: "background 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#e6dfd3"
                            ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#c8bfb0"
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#ede8de"
                            ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d6cfc2"
                    }}
                />
            </Carousel>
        </section>
    )
}