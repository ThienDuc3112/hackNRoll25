import { LucideProps } from "lucide-react";
import { FC, useState } from "react";

type Prop = {
  delay: number;
  title: string;
  description: string;
  icon: FC<LucideProps>;
};

export const Feature: FC<Prop> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300"
      style={{
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        animation: `fadeUp 0.6s ease-out ${delay}ms backwards`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
        style={{ transform: isHovered ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3
        className="text-xl font-semibold mb-2 transition-colors duration-300"
        style={{ color: isHovered ? "#3B82F6" : "#1F2937" }}
      >
        {title}
      </h3>
      <p
        className="text-gray-600 transition-all duration-300"
        style={{ transform: isHovered ? "translateX(10px)" : "translateX(0)" }}
      >
        {description}
      </p>
    </div>
  );
};
