"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./badge";

type CardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  href: string;
  className?: string;
  variant?: "default" | "featured";
  badges?: string[];
};

export function CardWithHover(props: CardProps) {
  const {
    title,
    description,
    imageUrl,
    href,
    className,
    variant = "default",
    badges = [],
  } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all duration-300",
        variant === "featured" ? "md:col-span-2 lg:col-span-3" : "",
        isHovered && "shadow-lg translate-y-[-4px]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered && "scale-110",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex flex-wrap gap-2 mb-2">
          {badges.map((badge) => (
            <Badge
              key={badge}
              className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            >
              {badge}
            </Badge>
          ))}
        </div>
        <h3
          className={cn(
            "text-lg font-semibold tracking-tight transition-colors duration-300",
            isHovered ? "text-primary" : "text-foreground",
          )}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center text-sm font-medium text-primary">
          <span className="transition-all duration-300 transform group-hover:translate-x-1">
            En savoir plus
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 transition-all duration-300 transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
