import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import "./style/index.css"

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
        <figure className="review-card">
            <span className="quote-mark">"</span>
            <blockquote className="review-body">
                {body}
            </blockquote>

            <div className="reviewer-info">
                <img
                    src={img}
                    alt={name}
                    className="reviewer-img"
                />
                <div>
                    <figcaption className="reviewer-name">
                        {name}
                    </figcaption>
                    <p className="reviewer-username">
                        {username}
                    </p>
                </div>
            </div>
        </figure>
    )
}

export function MarqueeDemo() {
    return (
        <div style={{ backgroundColor: '#f8f1e7' }}>
            <section className="scroller-section">
                <div className="scroller-header">
                    <p className="scroller-tag">
                        What our customers say
                    </p>
                    <h2 className="scroller-title">
                        Loved by candle lovers
                    </h2>
                </div>

                <div className="marquee-container">
                    <Marquee pauseOnHover className="[--duration:25s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:25s]">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>

                    <div className="marquee-fade-left" />
                    <div className="marquee-fade-right" />
                </div>
            </section>
        </div>
    )
}