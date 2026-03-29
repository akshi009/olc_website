import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"

const reviews = [
    {
        name: "Jack",
        username: "@jack",
        body: "I've never seen anything like this before. It's amazing. I love it.",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "I don't know what to say. I'm speechless. This is amazing.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "John",
        username: "@john",
        body: "I'm at a loss for words. This is amazing. I love it.",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "I'm at a loss for words. This is amazing. I love it.",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "Jenny",
        username: "@jenny",
        body: "I'm at a loss for words. This is amazing. I love it.",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "James",
        username: "@james",
        body: "I'm at a loss for words. This is amazing. I love it.",
        img: "https://avatar.vercel.sh/james",
    },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string
    name: string
    username: string
    body: string
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-72 cursor-pointer overflow-hidden rounded-2xl p-5",
                "transition-colors duration-300 "
            )}
            style={{
                background: "#f0ebe1ff",
                border: "1px solid #d6cfc2",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "#e6dfd3"
                    ; (e.currentTarget as HTMLElement).style.borderColor = "#c8bfb0"
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "#ede8de"
                    ; (e.currentTarget as HTMLElement).style.borderColor = "#d6cfc2"
            }}
        >
            {/* Decorative quote mark */}
            <span
                style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "1.25rem",
                    fontSize: "3.5rem",
                    lineHeight: 1,
                    color: "#d6cfc2",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    userSelect: "none",
                    pointerEvents: "none",

                }}
            >
                "
            </span>

            <blockquote
                style={{
                    fontSize: "0.82rem",
                    lineHeight: "1.75",
                    color: "#685e51ff",
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: 300,
                    marginBottom: "1.25rem",
                    letterSpacing: "0.01em",
                    padding: "1rem",
                }}
            >
                {body}
            </blockquote>

            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "1rem" }}>
                <img
                    src={img}
                    alt={name}
                    width="32"
                    height="32"
                    style={{
                        borderRadius: "50%",
                        border: "1px solid #d0c8b8",

                    }}
                />
                <div>
                    <figcaption
                        style={{
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "#2c2820",
                            fontFamily: "'Geist', sans-serif",
                            letterSpacing: "0.01em",
                        }}
                    >
                        {name}
                    </figcaption>
                    <p
                        style={{
                            fontSize: "0.72rem",
                            color: "#b8a99a",
                            fontFamily: "'Geist', sans-serif",
                            fontWeight: 300,
                        }}
                    >
                        {username}
                    </p>
                </div>
            </div>
        </figure>
    )
}

export function MarqueeDemo() {
    return (
        <section style={{ background: "#f6f4f1ff", paddingTop: "4rem", paddingBottom: "4rem" }}>
            {/* Section header */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "3rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                }}
            >
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
                    What our customers say
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
                    Loved by candle lovers
                </h2>
            </div>

            {/* Marquee rows */}
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-3">
                <Marquee pauseOnHover className="[--duration:25s]" style={{ padding: "0.25rem 0" }}>
                    {firstRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:25s]" style={{ padding: "0.25rem 0" }}>
                    {secondRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>

                {/* Edge fades — match parchment bg */}
                <div
                    style={{
                        position: "absolute",
                        inset: "0 auto 0 0",
                        width: "12rem",
                        background: "linear-gradient(to right, #f5f0e8 0%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: "0 0 0 auto",
                        width: "12rem",
                        background: "linear-gradient(to left, #f5f0e8 0%, transparent 100%)",
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                />
            </div>
        </section>
    )
}