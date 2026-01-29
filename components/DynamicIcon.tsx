import React from "react";
import * as Icons from "react-icons/fa";

interface IconProps {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
}

const DynamicIcon: React.FC<IconProps> = ({
  name = "FaReact",
  size = 24,
  color,
  className,
}) => {
  const IconComponent = Icons[name as keyof typeof Icons];

  if (!IconComponent) {
    return <span>Icon not found</span>;
  }

  return <IconComponent size={size} color={color} className={className} />;
};

export default DynamicIcon;
