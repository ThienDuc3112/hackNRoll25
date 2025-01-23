import Image from "next/image";
import { FC, useState } from "react";

type Prop = {
  image: string;
  title: string;
  description: string;
};

export const TemplateCard: FC<Prop> = ({ image, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <div className="relative overflow-hidden">
        <Image
          unoptimized
          height={500}
          width={300}
          src={image}
          alt={title}
          className="w-full transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
