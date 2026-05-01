import Image from "next/image";
import { signInWithGoogle } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <Image
          src="/brand/v4-eagle-seal.png"
          alt="URPE Command Center · Numero 18 Operations Division"
          width={256}
          height={256}
          className="h-56 w-56 sm:h-64 sm:w-64"
          priority
        />

        <h1 className="h-display mt-6 text-3xl uppercase tracking-[0.04em] text-foreground sm:text-4xl">
          URPE Command Center
        </h1>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--brand-gold)]">
          VIGILAMUS · OPERAMUR · VINCIMUS
        </p>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Numero 18 Operations Division
        </p>

        <form action={signInWithGoogle} className="mt-10 w-full">
          <Button
            type="submit"
            size="lg"
            className="w-full bg-[var(--brand-gold)] text-[var(--brand-navy)] hover:bg-[var(--brand-bright-gold)]"
          >
            Continuar con Google
          </Button>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Acceso restringido a workspace URPE.
          </p>
        </form>

        {error && (
          <p className="mt-4 text-sm text-destructive">
            {decodeURIComponent(error)}
          </p>
        )}
      </div>

      <footer className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 px-6">
        <div className="americana-stripe w-32 max-w-full" />
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Edition 1.0 · Established MMXXVI
        </p>
      </footer>
    </main>
  );
}
