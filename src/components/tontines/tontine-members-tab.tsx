"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateMemberRole } from "@/lib/actions/update-member-role.action";
import { formatDate } from "@/lib/utils";
import { TontineRole } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InviteMemberForm } from "./invite-member-form";
import { TontineDetailsProps } from "./tontine-details-types";
import { getInitials } from "./tontine-details-utils";

type MembersTabProps = {
  tontine: TontineDetailsProps["tontine"];
  statistics: TontineDetailsProps["statistics"];
  userRole: TontineDetailsProps["userRole"];
  isInviteDialogOpen: boolean;
  setInviteDialogOpen: (open: boolean) => void;
  onInviteMemberSuccess: () => void;
};

export function MembersTab({
  tontine,
  statistics,
  userRole,
  isInviteDialogOpen,
  setInviteDialogOpen,
  onInviteMemberSuccess,
}: MembersTabProps) {
  const router = useRouter();

  const handleRoleChange = async (memberId: string, newRole: TontineRole) => {
    const result = await updateMemberRole({
      tontineId: tontine.id,
      memberId,
      newRole,
    });
    if (result) {
      toast.success("Rôle du membre mis à jour !");
      router.refresh();
    } else {
      toast.error("Erreur lors de la mise à jour du rôle du membre");
    }
  };

  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Membres de la tontine</CardTitle>
          <CardDescription>
            {statistics.totalMembers} membre
            {statistics.totalMembers > 1 ? "s" : ""} sur un maximum de{" "}
            {tontine.maxMembers}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tontine.members.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user.image} />
                    <AvatarFallback>
                      {getInitials(member.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Membre depuis {formatDate(member.joinedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={member.role === "ADMIN" ? "default" : "outline"}
                  >
                    {member.role === "ADMIN" ? "Admin" : "Membre"}
                  </Badge>
                  {userRole === "ADMIN" && member.role !== "ADMIN" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(member.id, "ADMIN")}
                    >
                      Définir comme Admin
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        {userRole === "ADMIN" && statistics.remainingSlots > 0 && (
          <CardFooter>
            <Dialog
              open={isInviteDialogOpen}
              onOpenChange={setInviteDialogOpen}
            >
              <div className="w-full flex items-center justify-center">
                <DialogTrigger asChild className="">
                  <Button
                    variant="outline"
                    className="text-primary-foreground dark:text-primary"
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Inviter un membre
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="sr-only">
                      Inviter un membre
                    </DialogTitle>
                  </DialogHeader>
                  <InviteMemberForm
                    onSuccess={onInviteMemberSuccess}
                    tontineId={tontine.id}
                  />
                </DialogContent>
              </div>
            </Dialog>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
