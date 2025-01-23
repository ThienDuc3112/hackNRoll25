import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { FC, ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export const AnimatedSection: FC<Props> = ({
  children,
  className = "",
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      id={id ?? undefined}
    >
      {children}
    </div>
  );
};
