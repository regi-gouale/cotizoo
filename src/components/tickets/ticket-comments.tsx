import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

export function TicketComments({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        Aucun commentaire pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const name = comment.user.name || comment.user.email || "Utilisateur";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">
                il y a{" "}
                {formatDistanceToNow(new Date(comment.createdAt), {
                  locale: fr,
                })}
              </div>
            </div>

            <div className="mt-1 whitespace-pre-wrap text-sm">
              {comment.content}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
