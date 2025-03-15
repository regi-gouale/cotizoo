export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex flex-col items-center justify-center gap-6 p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-title">
          Hello World
        </h1>
        <p className="max-w-md text-lg text-muted-foreground font-sans">
          Welcome to my Next.js application
        </p>
        <p>A </p>
        <p className="max-w-md text-lg text-muted-foreground font-mono">
          This is a sample text using the Fira Code font.
        </p>
      </main>
    </div>
  );
}
