import { signInWithGoogle } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          URPE
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Command Center
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acceso restringido al workspace URPE.
        </p>

        <form action={signInWithGoogle} className="mt-8">
          <Button type="submit" className="w-full" size="lg">
            Continuar con Google
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-destructive">
            {decodeURIComponent(error)}
          </p>
        )}
      </div>
    </main>
  );
}
