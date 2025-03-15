import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, LucideIcon } from "lucide-react";

type FeatureItemProps = {
  title: string;
  description: string;
  className?: string;
  icon?: LucideIcon;
};

export function FeatureItem(props: FeatureItemProps) {
  const Icon = props.icon || CheckCircle;

  return (
    <Card
      className={cn(
        `hover:scale-110 duration-500`,
        props.className ? props.className : "",
        "cursor-pointer max-w-md",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-x-2 w-full justify-evenly">
          <Icon className="size-10 text-primary flex-shrink-0" />
          <h3 className="font-semibold font-title text-center">
            {props.title}
          </h3>
          <span></span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </CardContent>
    </Card>
  );
}
