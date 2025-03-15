import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg shadow-primary/10 backdrop-blur-sm bg-card/90">
        <CardHeader className="pb-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-title text-primary text-center">
            Hello World
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground font-sans text-center">
            Welcome to my Next.js application
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent my-2" />
          <p className="text-lg font-mono text-primary-foreground text-center">
            This is a sample text using the Fira Code font.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <div className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
            Next.js + Tailwind + Shadcn UI
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
