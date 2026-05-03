"use client";

import { useQuery } from "@tanstack/react-query";
import { Marquee } from "@/components/ui/marquee";
import "./style/index.css";

type ReviewUser = {
    _id?: string;
    name?: string;
    email?: string;
    image?: string;
};

type ApiReview = {
    _id: string;
    user: ReviewUser | string;
    content: string;
    rating: number;
    hide?: boolean;
};

type ReviewCardData = {
    id: string;
    img: string;
    name: string;
    username: string;
    body: string;
};

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const FALLBACK_AVATAR = "https://avatar.vercel.sh/candle-lover";

const toReviewCard = (review: ApiReview): ReviewCardData => {
    const user = typeof review.user === "object" ? review.user : null;
    const name = user?.name?.trim() || user?.email?.split("@")[0] || "Candle Lover";
    const usernameBase = user?.email?.split("@")[0] || name.toLowerCase().replace(/\s+/g, "");

    return {
        id: review._id,
        img: user?.image || `https://avatar.vercel.sh/${encodeURIComponent(usernameBase || "candle-lover")}`,
        name,
        username: `@${usernameBase || "candle-lover"}`,
        body: review.content,
    };
};

const buildRows = (reviews: ReviewCardData[]) => {
    if (reviews.length === 0) {
        return { firstRow: [] as ReviewCardData[], secondRow: [] as ReviewCardData[] };
    }

    const paddedReviews =
        reviews.length === 1 ? [...reviews, { ...reviews[0], id: `${reviews[0].id}-clone` }] : reviews;

    const midpoint = Math.ceil(paddedReviews.length / 2);
    return {
        firstRow: paddedReviews.slice(0, midpoint),
        secondRow: paddedReviews.slice(midpoint),
    };
};

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure className="review-card">
            <span className="quote-mark">&quot;</span>
            <blockquote className="review-body">{body}</blockquote>

            <div className="reviewer-info">
                <img
                    src={img || FALLBACK_AVATAR}
                    alt={name}
                    className="reviewer-img"
                />
                <div>
                    <figcaption className="reviewer-name">{name}</figcaption>
                    {/* <p className="reviewer-username">{username}</p> */}
                </div>
            </div>
        </figure>
    );
};

export function MarqueeDemo() {
    const { data: reviews = [] } = useQuery<ReviewCardData[]>({
        queryKey: ["public-reviews"],
        queryFn: async () => {
            const res = await fetch(`${BASE}/reviews/all`);
            const data = await res.json();
            const reviewList = Array.isArray(data.review) ? data.review : [];

            return reviewList
                .filter((review: ApiReview) => !review.hide && review.content)
                .map((review: ApiReview) => toReviewCard(review));
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { firstRow, secondRow } = buildRows(reviews);

    if (reviews.length === 0) {
        return null;
    }

    return (
        <div style={{ backgroundColor: "#f8f1e7" }}>
            <section className="scroller-section">
                <div className="scroller-header">
                    <p className="scroller-tag">What our customers say</p>
                    <h2 className="scroller-title">Loved by candle lovers</h2>
                </div>

                <div className="marquee-container">
                    <Marquee pauseOnHover className="[--duration:25s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.id} {...review} />
                        ))}
                    </Marquee>
                    {secondRow.length > 0 && (
                        <Marquee reverse pauseOnHover className="[--duration:25s]">
                            {secondRow.map((review) => (
                                <ReviewCard key={review.id} {...review} />
                            ))}
                        </Marquee>
                    )}

                    <div className="marquee-fade-left" />
                    <div className="marquee-fade-right" />
                </div>
            </section>
        </div>
    );
}
