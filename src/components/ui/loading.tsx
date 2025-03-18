"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Loading(props: {
  className?: string;
  size?: number;
  text?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2
        className={cn("animate-spin text-muted-foreground", props.className)}
        size={props.size || 24}
      />
      {props.text && (
        <p className="text-sm text-muted-foreground">{props.text}</p>
      )}
    </div>
  );
}

export function ButtonLoading(props: { className?: string; size?: number }) {
  return (
    <Loader2
      className={cn("animate-spin", props.className)}
      size={props.size || 16}
    />
  );
}
