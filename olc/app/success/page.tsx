"use client";
import { useEffect } from "react";

export default function SuccessPage() {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/";
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "100px" }}>
            <h1>✅ Payment Successful</h1>
            <p>Redirecting to home...</p>
        </div>
    );
}