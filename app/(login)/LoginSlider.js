"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function LoginSlider() {
    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const sliderRef = useRef(null);
    const handleRef = useRef(null);

    let startMouseX = 0;
    let startHandleX = 0;
    let slidePercent = 0;

    const onMouseDown = (e) => {
        setIsDragging(true);
        // Get the starting mouse X position and the handle's left offset
        startMouseX = e.clientX;
        startHandleX = handleRef.current.offsetLeft;

        // Disable text selection while dragging
        document.body.style.userSelect = "none";
        // Disable handle transition
        handleRef.current.style.transition = "none";
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;

        // Get startMouseX delta
        let newMouseX = e.clientX;
        let mouseXDelta = newMouseX - startMouseX;

        // Move handle according to delta
        let newHandleX =
            startHandleX +
            mouseXDelta -
            sliderRef.current.clientWidth -
            handleRef.current.clientWidth;

        // Limit handleX to parent width (include padding)
        const minLeft = 8; //8px padding
        const maxLeft =
            sliderRef.current.clientWidth - handleRef.current.clientWidth - 8;
        // Ensure the handle stays within the slider bounds
        if (newHandleX <= minLeft) {
            newHandleX = minLeft;
        } else if (newHandleX >= maxLeft) {
            newHandleX = maxLeft;
        }

        // Apply the new left position
        handleRef.current.style.left = `${newHandleX}px`;
        // Calculate slide percent - (currentX + handleWidth + parentPadding)
        slidePercent =
            (newHandleX + handleRef.current.clientWidth + 8) /
            sliderRef.current.clientWidth;
    };

    const onMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = ""; // Re-enable text selection

        // Get handle percentage
        if (slidePercent >= 0.98) {
            handleLogin();
        } else {
            document.getElementById("loginText").innerText =
                "Swipe to login...";
            // Return slider to start
            // Enable handle transition
            handleRef.current.style.transition =
                "left 0.5s cubic-bezier(0.5,0.25,0,1)";
            // Reset position
            handleRef.current.style.left = `8px`;
        }
    };

    const handleLogin = () => {
        document.getElementById("loginText").innerText = "Logging in...";
        sliderRef.current.style.width = "4rem";
        handleRef.current.style.left = `8px`;
        setIsLoggingIn(true);

        setTimeout(() => {
            setFadeOut(true); // Trigger fade-out animation

            // Wait for the fade-out animation to complete (0.5s, matching the CSS)
            setTimeout(() => {
                router.push("/portfolio"); // Navigate to the new page
            }, 500);
        }, 1250);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        } else {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }

        // Cleanup event listeners on component unmount or when dragging stops
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            className={`${
                fadeOut
                    ? "opacity-0 transition-opacity duration-500"
                    : "opacity-100"
            } flex flex-col items-center`}
        >
            <h1 className="text-5xl mb-24 mt-48 text-white/70 font-thin">
                LifeOS
            </h1>
            <p id="loginText" className="font-medium text-xl mb-3 text-white">
                Swipe to login...
            </p>
            <div
                id="slider"
                ref={sliderRef}
                className="flex items-center h-16 rounded-full bg-gradient-to-r from-slate-950/60 to-slate-900/60 ring-2 ring-white/5 px-2 relative"
                style={{ width: "20rem" }}
            >
                {!isLoggingIn ? (
                    <div
                        id="slider-handle"
                        ref={handleRef}
                        className="absolute z-20 rounded-full h-12 w-12 bg-white/70 hover:bg-white/90 transition-colors duration-200 cursor-pointer"
                        onMouseDown={onMouseDown}
                    ></div>
                ) : (
                    <div className="absolute left-0 z-20 h-12 w-12 animate-spin rounded-full border-r-4 border-b-4 border-l-4 border-t-4 border-t-transparent border-white/90"></div>
                )}
            </div>
        </div>
    );
}
