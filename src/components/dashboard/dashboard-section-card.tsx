import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTrendingUp } from "@tabler/icons-react";

export function DashboardSectionCard(props: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  value?: string | number;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{props.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {props.value ? `${props.value}` : "$0.00"}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {props.icon ? props.icon : <IconTrendingUp />}
            {props.action ? props.action : "+0%"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {props.children ? props.children : "Trending up this month"}
        </div>
        <div className="text-muted-foreground">{props.description}</div>
      </CardFooter>
    </Card>
  );
}
