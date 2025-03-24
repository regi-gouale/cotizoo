import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

type InvitedMember = {
  id: string;
  email: string;
  status: string;
  createdAt: string;
};

export function InvitedMembers({ tontineId }: { tontineId: string }) {
  const [members, setMembers] = useState<InvitedMember[]>([]);

  useEffect(() => {
    async function fetchMembers() {
      const response = await fetch(`/api/tontine/${tontineId}/invited-members`);
      const data = await response.json();
      setMembers(data);
    }

    fetchMembers();
  }, [tontineId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membres Invités</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              {member.email} - {member.status} -{" "}
              {new Date(member.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
