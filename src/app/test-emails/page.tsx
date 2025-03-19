"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { sendTestEmail } from "./test-email.action";

type EmailType =
  | "registration"
  | "tontineInvitation"
  | "passwordReset"
  | "paymentNotification"
  | "missedPayment";

export default function TestEmailsPage() {
  const [emailType, setEmailType] = useState<EmailType>("registration");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Registration email
    name: "John Doe",
    confirmUrl: "https://cotizoo.com/confirm?token=123456",

    // Tontine invitation
    inviterName: "Marie Dupont",
    tontineName: "Tontine Familiale",
    invitationUrl: "https://cotizoo.com/invitation?token=123456",

    // Password reset
    resetUrl: "https://cotizoo.com/reset-password?token=123456",

    // Payment notification
    amount: "500€",
    date: "15/06/2023",
    recipient: "Luc Martin",

    // Missed payment
    dueDate: "20/06/2023",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail) {
      toast.error("Veuillez saisir une adresse email de destination");
      return;
    }

    setLoading(true);
    try {
      const result = await sendTestEmail({
        type: emailType,
        to: recipientEmail,
        variables: formData,
      });

      if (result.success) {
        toast.success(
          `Email de type ${emailType} envoyé avec succès à ${recipientEmail}`,
        );
      } else {
        toast.error(`Erreur lors de l'envoi de l'email: ${result.error}`);
      }
    } catch (error) {
      toast.error(
        `Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (emailType) {
      case "registration":
        return (
          <>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="name">Nom de l'utilisateur</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="confirmUrl">URL de confirmation</Label>
              <Input
                id="confirmUrl"
                name="confirmUrl"
                value={formData.confirmUrl}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      case "tontineInvitation":
        return (
          <>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="inviterName">Nom de l'invitant</Label>
              <Input
                id="inviterName"
                name="inviterName"
                value={formData.inviterName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="tontineName">Nom de la tontine</Label>
              <Input
                id="tontineName"
                name="tontineName"
                value={formData.tontineName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="invitationUrl">URL d'invitation</Label>
              <Input
                id="invitationUrl"
                name="invitationUrl"
                value={formData.invitationUrl}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      case "passwordReset":
        return (
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="resetUrl">URL de réinitialisation</Label>
            <Input
              id="resetUrl"
              name="resetUrl"
              value={formData.resetUrl}
              onChange={handleInputChange}
            />
          </div>
        );

      case "paymentNotification":
        return (
          <>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="tontineName">Nom de la tontine</Label>
              <Input
                id="tontineName"
                name="tontineName"
                value={formData.tontineName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="recipient">Bénéficiaire (optionnel)</Label>
              <Input
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      case "missedPayment":
        return (
          <>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="tontineName">Nom de la tontine</Label>
              <Input
                id="tontineName"
                name="tontineName"
                value={formData.tontineName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Test des Templates d'Email</h1>

      <Card>
        <CardHeader>
          <CardTitle>Envoyer un email de test</CardTitle>
          <CardDescription>
            Sélectionnez le type d'email et remplissez les informations
            nécessaires pour envoyer un email de test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="recipientEmail">Email du destinataire</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="exemple@email.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid w-full items-center gap-4">
              <Label htmlFor="emailType">Type d'email</Label>
              <Select
                value={emailType}
                onValueChange={(value: string) =>
                  setEmailType(value as EmailType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type d'email" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registration">Inscription</SelectItem>
                  <SelectItem value="tontineInvitation">
                    Invitation à une tontine
                  </SelectItem>
                  <SelectItem value="passwordReset">
                    Réinitialisation de mot de passe
                  </SelectItem>
                  <SelectItem value="paymentNotification">
                    Notification de paiement
                  </SelectItem>
                  <SelectItem value="missedPayment">Paiement manqué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-medium">Variables du template</h3>
              {renderFormFields()}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer l'email de test"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
