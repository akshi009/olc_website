"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import "./style/index.css"

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
        <section className="carousel-section">
            <div className="carousel-header">
                <p className="carousel-tag">
                    Our Collection
                </p>
                <h2 className="carousel-title">
                    Crafted for every mood
                </h2>
            </div>

            <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-6xl relative"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                {/* Fade Overlays */}
                <div className="carousel-fade-left" />
                <div className="carousel-fade-right" />

                <CarouselContent className="-ml-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                            <div className="carousel-item-card">
                                <div className="carousel-image-area">
                                    <div className="flame-glow" />
                                    🕯
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="carousel-nav-btn -left-12 lg:-left-20" />
                <CarouselNext className="carousel-nav-btn -right-12 lg:-right-20" />
            </Carousel>
        </section>
    )
}