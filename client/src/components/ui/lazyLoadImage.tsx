import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type Props = {
  alt: string;
  src: string;
  width: string;
  height: string;
  className?: string;
};

export default function LazyLoadImageRC({ alt, src, width, height, className }: Props) {
  return (
    <LazyLoadImage
      alt={alt}
      effect="blur"
      wrapperProps={{
        style: { transitionDelay: "1s" },
      }}
      src={src}
      width={width}
      height={height}
      className={className}
    />
  );
}
