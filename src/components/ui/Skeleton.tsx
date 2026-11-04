import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", ...props }) => (
  <div className={`animate-pulse rounded-xl bg-gray-200/80 ${className}`} {...props} />
);
