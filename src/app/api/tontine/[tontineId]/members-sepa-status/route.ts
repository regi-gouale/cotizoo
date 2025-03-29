import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TontineRole } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: {
    tontineId: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 },
      );
    }

    const tontineId = request.url.split("/")[5];

    if (!tontineId) {
      return NextResponse.json(
        { error: "Tontine ID manquant" },
        { status: 400 },
      );
    }

    // Vérifier si l'utilisateur est admin de la tontine
    const userMembership = await prisma.userTontine.findFirst({
      where: {
        userId: session.user.id,
        tontineId: tontineId,
        role: TontineRole.ADMIN,
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: "Vous n'êtes pas administrateur de cette tontine" },
        { status: 403 },
      );
    }

    // Récupérer tous les membres de la tontine avec leur statut SEPA
    const members = await prisma.userTontine.findMany({
      where: {
        tontineId: tontineId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            stripePaymentMethodId: true,
          },
        },
      },
    });

    // Formater les données pour l'affichage
    const membersWithSepaStatus = members.map((member) => ({
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
      role: member.role,
      joinedAt: member.joinedAt,
      hasSepaMandate: !!member.user.stripePaymentMethodId,
    }));

    return NextResponse.json(membersWithSepaStatus);
  } catch (error) {
    console.error("Erreur lors de la récupération des statuts SEPA:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 },
    );
  }
}
