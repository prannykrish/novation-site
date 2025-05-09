'use client';
import Image from 'next/image';

interface ProductFrameProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
}

export const ProductFrame = ({ lightSrc, darkSrc, alt }: ProductFrameProps) => {
  return (
    // Each frame will take the full width of its flex child container.
    // Padding can be added here or spacing via gap in the parent flex container.
    <div className="w-full h-full p-2"> {/* p-2 for spacing between frames */}
      <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative flex h-full flex-col rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
        <div className="relative aspect-15/8 w-full overflow-hidden rounded-xl">
          {/* Light mode image */}
          <Image
            src={lightSrc}
            alt={alt + " - light mode"}
            layout="fill"
            objectFit="cover"
            className="dark:hidden"
            priority // Good to add for LCP images if they are above the fold
          />
          {/* Dark mode image */}
          <Image
            src={darkSrc}
            alt={alt + " - dark mode"}
            layout="fill"
            objectFit="cover"
            className="hidden dark:block"
            priority // Good to add for LCP images if they are above the fold
          />
        </div>
      </div>
    </div>
  );
}; 