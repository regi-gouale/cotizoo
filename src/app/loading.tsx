import { Loading } from "@/components/ui/loading";

export default function LoadingPage() {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <Loading text="Chargement en cours..." />
    </div>
  );
}
