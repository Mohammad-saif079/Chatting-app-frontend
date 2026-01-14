import { useEffect, useState } from "react";
import Profile from "./Profile";

const BgWithSkeleton = ({ imageUrl, size }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!imageUrl) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const checkImage = async () => {
      try {
        const res = await fetch(imageUrl, { method: "HEAD" });

        if (!res.ok) {
          if (!cancelled) setStatus("error");
          return;
        }

        const img = new Image();

        img.onload = () => !cancelled && setStatus("loaded");
        img.onerror = () => !cancelled && setStatus("error");

        img.src = imageUrl;
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    checkImage();

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-[#2f3136]" />
      )}

      {/* Image Loaded */}
      {status === "loaded" && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      )}

      {/* Image Failed */}
      {status === "error" && <Profile size={size} />}
    </div>
  );
};

export default BgWithSkeleton;
