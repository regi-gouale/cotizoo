export const metadata = {
  title: {
    default: "Connexion - cotizoo",
    template: "%s | cotizoo",
  },
  description: "Connectez-vous à votre compte cotizoo.",
  keywords: ["cotizoo", "authentification", "connexion"],
  authors: [{ name: "Équipe Cotizoo" }],
  creator: "Cotizoo",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full mx-auto min-h-[calc(100vh-4rem)]  justify-center items-center">
      <main className="flex-1 py-6 size-full">{children}</main>
    </div>
  );
}
