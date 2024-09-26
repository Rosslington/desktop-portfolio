"use client";

import { useEffect, useState } from "react";

export default function PortfolioComp() {
    let [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div
            className={`${
                isMounted
                    ? "opacity-100 transition-opacity duration-500"
                    : "opacity-0"
            }`}
        >
            <h1 className="text-3xl text-white font-bold">Hello World!</h1>
        </div>
    );
}
