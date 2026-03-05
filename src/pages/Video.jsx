import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

// "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
export default function VideoPlayer({ source = "https://pub-121058a7cc6940f3995ff9ad3d46489e.r2.dev/hls/master.m3u8" }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const rippleLeftRef = useRef(null);
    const rippleRightRef = useRef(null);
    const controlsRef = useRef(null);
    const wrapperref = useRef(null);
    const thumbref = useRef(null);
    const progressbar = useRef(null);
    const hideControlsTimer = useRef(null);


    const lastTap = useRef(0);
    const tapTimeout = useRef(null);
    const longPressActive = useRef(false);
    const doubleTapWindow = useRef(false);
    const wasPlayingBeforeDrag = useRef(false);
    const wasPlayingBeforeAction = useRef(false);
    const [buffered, setbuffered] = useState(0);

    const touchInfo = useRef({
        x: 0,
        y: 0,
        isMoving: false,
    });

    const pressTimer = useRef(null);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [rate, setRate] = useState(1);
    const [totalduration, settotalduration] = useState("--");
    const [currentduration, setcurrentduration] = useState("--");
    const [isFullscreen, setIsFullscreen] = useState(false);


    const progressRef = useRef(0);

    function formatTime(seconds) {
        seconds = Math.floor(seconds);

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");

        return `${h}:${m}:${s}`;
    }


    //AUTO MOUNT 
    useEffect(() => {
        if (containerRef.current) containerRef.current.focus();
    }, []);


    // LOAD VIDEO
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        setLoading(true);

        if (v.canPlayType("application/vnd.apple.mpegurl")) {
            v.src = source;
        } else {
            const hls = new Hls();

            hls.loadSource(source);
            hls.attachMedia(v);

        }
    }, [source]);






    // LOADING + METADATA
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const show = () => setLoading(true);
        const hide = () => setLoading(false);

        v.addEventListener("waiting", show);
        v.addEventListener("playing", hide);
        v.addEventListener("canplay", hide);
        v.addEventListener("error", hide);



        v.addEventListener("loadedmetadata", () => {
            settotalduration(formatTime(v.duration));
            setcurrentduration(formatTime(0));
        });

        return () => {
            v.removeEventListener("waiting", show);
            v.removeEventListener("playing", hide);
            v.removeEventListener("canplay", hide);
            v.removeEventListener("error", hide);
        };
    }, []);

    function updateBuffered() {
        const v = videoRef.current
        if (!v || !v.duration) return

        if (v.buffered.length > 0) {
            const bufferedEnd = v.buffered.end(v.buffered.length - 1)

            const percent = Math.min((bufferedEnd / v.duration) * 100, 100)

            setbuffered(percent)
        }
    }

    useEffect(() => {
        const v = videoRef.current
        if (!v) return

        v.addEventListener("progress", updateBuffered)
        v.addEventListener("timeupdate", updateBuffered)
        v.addEventListener("seeking", updateBuffered)
        v.addEventListener("loadedmetadata", updateBuffered)

        return () => {
            v.removeEventListener("progress", updateBuffered)
            v.removeEventListener("timeupdate", updateBuffered)
            v.removeEventListener("seeking", updateBuffered)
            v.removeEventListener("loadedmetadata", updateBuffered)
        }
    }, [])

    // DRAGGING SEEKBAR
    useEffect(() => {
        if (!wrapperref.current || !thumbref.current || !progressbar.current) return;

        const calcMax = () =>
            wrapperref.current.offsetWidth - thumbref.current.offsetWidth;

        const draggable = Draggable.create(progressbar.current, {
            type: "x",
            bounds: { minX: 0, maxX: calcMax() },

            onDragStart: function () {
                const v = videoRef.current;
                wasPlayingBeforeDrag.current = !v.paused;
                v.pause();
            },

            onDrag: function () {
                const v = videoRef.current;
                const max = calcMax();
                const x = this.x;

                const p = (x / max) * 100;
                progressRef.current = p;
                setProgress(p);

                v.currentTime = (p * v.duration) / 100;
                setcurrentduration(formatTime(v.currentTime));
            },

            onDragEnd: function () {
                const v = videoRef.current;
                if (wasPlayingBeforeDrag.current) v.play().catch(() => { });
            },
        })[0];


        const handleResize = () => {
            const max = calcMax();

            draggable.applyBounds({ minX: 0, maxX: max });

            // reposition thumb according to saved progress
            const newX = (progressRef.current / 100) * max;
            gsap.set(progressbar.current, { x: newX });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            draggable.kill();
            window.removeEventListener("resize", handleResize);
        };


    }, []);

    // UPDATE BAR ON TIMEUPDATE
    const timeUpdate = () => {
        const v = videoRef.current;
        const max = wrapperref.current.offsetWidth - thumbref.current.offsetWidth;

        const p = (v.currentTime / v.duration) * 100;
        progressRef.current = p;

        setcurrentduration(formatTime(v.currentTime));
        setProgress(p);

        gsap.set(progressbar.current, { x: (p / 100) * max });

    };

    // PLAY/PAUSE
    const togglePlay = () => {
        const v = videoRef.current;
        v.paused ? v.play().catch(() => { }) : v.pause();
        setPlaying(!v.paused);
    };

    // SKIP HANDLER
    const skip = (sec, side) => {
        const v = videoRef.current;
        wasPlayingBeforeAction.current = !v.paused;

        setLoading(true);
        v.pause();

        v.currentTime += sec;

        const max = wrapperref.current.offsetWidth - thumbref.current.offsetWidth;
        const p = (v.currentTime / v.duration) * 100;

        gsap.set(progressbar.current, { x: (p / 100) * max });
        setcurrentduration(formatTime(v.currentTime));

        // ripple
        const ripple = side === "left" ? rippleLeftRef.current : rippleRightRef.current;

        if (side === "right") {

            const tl = gsap.timeline()

            tl.fromTo(".rightrip", { y: 60 }, {
                y: 0,
                stagger: 0.2
            });
            tl.to(".rightrip", {
                y: 60,
                stagger: 0.2
            })
        }
        else {
            const tl = gsap.timeline()

            tl.fromTo(".leftrip", { y: 60 }, {
                y: 0,
                stagger: 0.2
            });
            tl.to(".leftrip", {
                y: 60,
                stagger: 0.2
            })


        }



        // restore play
        if (wasPlayingBeforeAction.current)
            v.addEventListener("canplay", () => v.play().catch(() => { }), { once: true });
    };

    // DOUBLE TAP
    // const handleTap = (side) => {
    //     if (touchInfo.current.isMoving || longPressActive.current) return;

    //     const now = performance.now();
    //     const diff = now - lastTap.current;

    //     if (diff > 60 && diff < 300) {
    //         doubleTapWindow.current = true;
    //         skip(side === "left" ? -5 : 5, side);
    //         setTimeout(() => (doubleTapWindow.current = false), 300);
    //     }

    //     lastTap.current = now;
    // };

    const handleTap = (side) => {
        clearTimeout(pressTimer.current);

        // If finger moved → ignore
        if (touchInfo.current.isMoving) return;

        // If long press active → stop speed only
        if (longPressActive.current) {
            videoRef.current.playbackRate = 1;
            setRate(1);
            longPressActive.current = false;
            return;
        }

        const now = performance.now();
        const diff = now - lastTap.current;

        // DOUBLE TAP
        if (diff > 60 && diff < 300) {
            clearTimeout(tapTimeout.current);
            skip(side === "left" ? -5 : 5, side);
        }
        // else {
        //     // SINGLE TAP (delay to check if double)
        //     tapTimeout.current = setTimeout(() => {
        //         togglePlay();
        //     }, 250);
        // }

        lastTap.current = now;
    };

    // MOVEMENT CHECK
    const handleMove = (e) => {
        const dx = Math.abs(e.clientX - touchInfo.current.x);
        const dy = Math.abs(e.clientY - touchInfo.current.y);
        if (dx > 8 || dy > 8) touchInfo.current.isMoving = true;
    };

    // LONG PRESS START
    const longPressStart = (e) => {
        if (doubleTapWindow.current) return;

        touchInfo.current.isMoving = false;
        touchInfo.current.x = e.clientX;
        touchInfo.current.y = e.clientY;

        clearTimeout(pressTimer.current);
        longPressActive.current = false;

        pressTimer.current = setTimeout(() => {
            if (!touchInfo.current.isMoving) {
                longPressActive.current = true;
                videoRef.current.playbackRate = 2;
                setRate(2);
            }
        }, 450);
    };

    // LONG PRESS END
    const longPressEnd = () => {
        clearTimeout(pressTimer.current);

        if (longPressActive.current) {
            videoRef.current.playbackRate = 1;
            setRate(1);
            longPressActive.current = false;
        }
    };

    //ARROW KEY FUNCTION

    const handleKey = (e) => {
        if (!videoRef.current) return;

        if (e.key === "ArrowLeft") skip(-5, "left");
        if (e.key === "ArrowRight") skip(5, "right");
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;

        if (!document.fullscreenElement) {
            try {
                await container.requestFullscreen();
                setIsFullscreen(true);

                // Try locking orientation (mobile only)
                if (screen.orientation?.lock) {
                    try {
                        await screen.orientation.lock("landscape");
                    } catch (err) {

                    }
                }

            } catch (err) {

            }
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);

            if (screen.orientation?.unlock) {
                screen.orientation.unlock();
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const active = !!document.fullscreenElement;
            setIsFullscreen(active);

            if (!active && screen.orientation?.unlock) {
                screen.orientation.unlock();
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    function showControls() {
        const controls = controlsRef.current;
        if (!controls) return;

        gsap.to(controls, { opacity: 1, duration: 0.2 });
        gsap.to(".playbuttons", { opacity: 1, duration: 0.2 });

        clearTimeout(hideControlsTimer.current);

        if (playing) {
            hideControlsTimer.current = setTimeout(() => {
                hideControls();
            }, 2500);
        }
    }

    function hideControls() {
        const controls = controlsRef.current;
        if (!controls) return;

        gsap.to(controls, { opacity: 0, duration: 0.3 });
        gsap.to(".playbuttons", { opacity: 0, duration: 0.3 });
    }

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const activity = () => showControls();

        container.addEventListener("mousemove", activity);
        container.addEventListener("touchstart", activity);
        container.addEventListener("pointerdown", activity);

        return () => {
            container.removeEventListener("mousemove", activity);
            container.removeEventListener("touchstart", activity);
            container.removeEventListener("pointerdown", activity);
        };
    }, [playing]);

    useEffect(() => {
        if (playing) {
            showControls();
        } else {
            clearTimeout(hideControlsTimer.current);
            showControls(); // keep visible when paused
        }
    }, [playing]);

    return (
        <div

            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKey}
            className=" outline-none relative w-full h-full bg-[#000000] flex items-center justify-center overflow-hidden "

        >
            <div className="relative w-full aspect-video ">
                <video
                    ref={videoRef}
                    onTimeUpdate={timeUpdate}
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>

            <div className="absolute  inset-0 flex items-center justify-center ">
                {loading && (
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                )}

            </div>




            {/* Double-tap zones */}
            <div
                className="absolute z-10 left-0 top-0 w-1/2 h-full flex justify-center items-center  "
                style={{ touchAction: "none" }}


                onPointerDown={(e) => { longPressStart(e) }}
                onPointerUp={() => {
                    if (longPressActive.current) {
                        longPressEnd();
                        return; // ❗ STOP here, do NOT call handleTap
                    }
                    longPressEnd();
                    handleTap("left")
                }}
                onPointerMove={handleMove}

                onPointerLeave={longPressEnd}
            >


                <div

                    className=" text-white text-4xl w-[80px] font-semibold overflow-hidden flex items-center justify-center "
                >

                    <div className=" leftrip translate-y-[200%] rotate-90 " >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"

                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M5 19V5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className=" leftrip translate-y-full" >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"

                            height="60"
                            viewBox="0 0 47 47"
                            fill="none"
                        >
                            <path
                                d="M28.1504 13.708C23.2546 14.932 17.1348 13.708 17.1348 13.708V20.6914H23.9361C26.9401 20.6914 29.3743 22.7751 29.3743 25.3464V28.0861C29.3743 34.9833 17.1348 35.0695 17.1348 28.0861"
                                stroke="white"
                                strokeWidth="2.9375"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>


                </div>




            </div>


            <div
                className="absolute z-10 right-0 top-0 w-1/2 h-full flex justify-center items-center "
                style={{ touchAction: "none" }}

                onPointerDown={(e) => { longPressStart(e) }}

                onPointerUp={() => {
                    if (longPressActive.current) {
                        longPressEnd();
                        return; // ❗ STOP here, do NOT call handleTap
                    }
                    longPressEnd();
                    handleTap("right")
                }}
                onPointerMove={handleMove}
                onPointerLeave={longPressEnd}
            >
                <div

                    className=" text-white text-4xl w-[80px] font-semibold overflow-hidden flex items-center justify-center "
                >

                    <div className=" rightrip translate-y-[200%]" >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"

                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M5 12H19M12 19V5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                    </div>
                    <div className=" rightrip translate-y-full" >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"

                            height="60"
                            viewBox="0 0 47 47"
                            fill="none"
                        >
                            <path
                                d="M28.1504 13.708C23.2546 14.932 17.1348 13.708 17.1348 13.708V20.6914H23.9361C26.9401 20.6914 29.3743 22.7751 29.3743 25.3464V28.0861C29.3743 34.9833 17.1348 35.0695 17.1348 28.0861"
                                stroke="white"
                                strokeWidth="2.9375"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>


                </div>


            </div>

            {/* Long press speed */}


            {/* Controls */}
            <div
                ref={controlsRef}
                className="absolute bottom-0 w-full opacity-100 pb-2 px-4  "
            >


                <div className="fixed h-[100svh] top-0 inset-0 z-40 flex items-center justify-center pointer-events-none">

                    <div
                        onClick={togglePlay}
                        className="playbuttons pointer-events-auto flex items-center justify-center"
                    >
                        {!loading && (
                            playing ? (
                                <svg
                                    width={60}
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path
                                        d="M0.75 16.75C0.75 18.636 0.75 19.578 1.336 20.164C1.922 20.75 2.864 20.75 4.75 20.75C6.636 20.75 7.578 20.75 8.164 20.164C8.75 19.578 8.75 18.636 8.75 16.75V4.75C8.75 2.864 8.75 1.922 8.164 1.336C7.578 0.75 6.636 0.75 4.75 0.75C2.864 0.75 1.922 0.75 1.336 1.336C0.75 1.922 0.75 2.864 0.75 4.75V12.75M20.75 4.75C20.75 2.864 20.75 1.922 20.164 1.336C19.578 0.75 18.636 0.75 16.75 0.75C14.864 0.75 13.922 0.75 13.336 1.336C12.75 1.922 12.75 2.864 12.75 4.75V16.75C12.75 18.636 12.75 19.578 13.336 20.164C13.922 20.75 14.864 20.75 16.75 20.75C18.636 20.75 19.578 20.75 20.164 20.164C20.75 19.578 20.75 18.636 20.75 16.75V8.75"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width={65}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path
                                        d="M20.409 9.35294C20.8893 9.60835 21.291 9.98963 21.5712 10.4559C21.8514 10.9222 21.9994 11.456 21.9994 11.9999C21.9994 12.5439 21.8514 13.0777 21.5712 13.544C21.291 14.0102 20.8893 14.3915 20.409 14.6469L7.597 21.6139C5.534 22.7369 3 21.2769 3 18.9679V5.03294C3 2.72294 5.534 1.26394 7.597 2.38494L20.409 9.35294Z"
                                        stroke="white"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            )
                        )}




                    </div>

                </div>





                {/* Progress bar */}
                <div className=" bg-transparent progress_bar flex items-center relative w-full h-4  overflow-hidden rounded-full">
                    <div ref={progressbar} className=" z-20 thumb flex items-center w-full rounded-full" >

                        <div ref={wrapperref} className=" absolute left-[-100%] w-full h-1 rounded-full bg-[#ffd700] translate-x-1 "></div>

                        <div className=" absolute left-0 w-full h-1  z-20 bg-transparent rounded-full translate-x-1 ">
                        </div>
                        {/* bg-[#2f3136] */}


                        <div ref={thumbref} className=" absolute  left-0 ball w-4 h-4 rounded-full bg-[#ffd700]  "></div>

                    </div>

                    <div
                        style={{ width: `${buffered}%` }}
                        className="h-1 absolute left-3.5 z-10 bg-[#dbdbdb]  rounded-full"
                    ></div>

                    <div
                        className="h-1 absolute left-0  bg-[#2f3136] w-[100%] "
                    ></div>

                </div>




                {/* Buttons */}
                <div className=" mt-2 flex justify-between items-center " >

                    <div className="flex items-center gap-4  text-white " >

                        <div onClick={togglePlay} className="text-3xl z-30 flex items-center justify-center ">
                            {playing ? (<svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 50 50"
                                fill="none"
                            >
                                <path
                                    d="M42.1875 9.375V40.625C42.1875 41.4538 41.8583 42.2487 41.2722 42.8347C40.6862 43.4208 39.8913 43.75 39.0625 43.75H31.25C30.4212 43.75 29.6263 43.4208 29.0403 42.8347C28.4542 42.2487 28.125 41.4538 28.125 40.625V9.375C28.125 8.5462 28.4542 7.75134 29.0403 7.16529C29.6263 6.57924 30.4212 6.25 31.25 6.25H39.0625C39.8913 6.25 40.6862 6.57924 41.2722 7.16529C41.8583 7.75134 42.1875 8.5462 42.1875 9.375ZM18.75 6.25H10.9375C10.1087 6.25 9.31384 6.57924 8.72779 7.16529C8.14174 7.75134 7.8125 8.5462 7.8125 9.375V40.625C7.8125 41.4538 8.14174 42.2487 8.72779 42.8347C9.31384 43.4208 10.1087 43.75 10.9375 43.75H18.75C19.5788 43.75 20.3737 43.4208 20.9597 42.8347C21.5458 42.2487 21.875 41.4538 21.875 40.625V9.375C21.875 8.5462 21.5458 7.75134 20.9597 7.16529C20.3737 6.57924 19.5788 6.25 18.75 6.25Z"
                                    fill="white"
                                />
                            </svg>) : (<svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 50 50"
                                fill="none"
                            >
                                <path
                                    d="M44.6027 19.4854C45.6034 20.0175 46.4403 20.8118 47.024 21.7833C47.6077 22.7547 47.916 23.8667 47.916 25C47.916 26.1333 47.6077 27.2452 47.024 28.2167C46.4403 29.1881 45.6034 29.9825 44.6027 30.5146L17.9111 45.0292C13.6132 47.3687 8.33398 44.3271 8.33398 39.5167V10.4854C8.33398 5.67291 13.6132 2.63332 17.9111 4.96874L44.6027 19.4854Z"
                                    fill="white"
                                />
                            </svg>)}
                        </div>


                        <span className="opacity-80">{rate}x</span>


                        <div className="text-30 font-semibold " >
                            {`${currentduration} / ${totalduration}`}
                        </div>

                    </div>

                    <div className="flex justify-center items-center" >
                        <div onClick={toggleFullscreen} className="text-2xl justify-center z-30 items-center flex ">
                            {isFullscreen ? (
                                <svg
                                    width={30}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path
                                        d="M10 4H8V8H4V10H10V4ZM10 20V14H4V16H8V20H10ZM16 16H20V14H14V20H16V16ZM20 8H16V4H14V10H20V8Z"
                                        fill="white"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width={32}

                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path
                                        d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z"
                                        fill="white"
                                    />
                                </svg>
                            )}
                        </div>




                    </div>


                </div>
            </div>



        </div>
    );
}

