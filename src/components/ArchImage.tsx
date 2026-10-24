import Image from "next/image";
import { art } from "@/lib/images";

export { artFor } from "@/lib/images";

export function ArchImage({
  src,
  alt,
  variant = 0,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  position = "center",
}: {
  src?: string | null;
  alt: string;
  variant?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  position?: string;
}) {
  const pos = className.split(" ").includes("absolute") ? "" : "relative";
  return (
    <div className={`${pos} overflow-hidden bg-forest-900 ${className}`}>
      <Image
        src={src ?? art[variant % art.length]}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
