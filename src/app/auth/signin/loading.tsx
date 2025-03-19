import { Loading } from "@/components/ui/loading";

export default function SignInLoading() {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <Loading text="Préparation de la page de connexion..." />
    </div>
  );
}
