"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminTicketsButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin/tickets");
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="flex items-center gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10"
    >
      <ShieldCheck className="h-4 w-4" />
      Administration des tickets
    </Button>
  );
}
