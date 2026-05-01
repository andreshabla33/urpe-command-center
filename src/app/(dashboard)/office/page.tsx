const BRIDGE_URL = "https://bridge-agentesia-production.up.railway.app/office/";

export default function OfficePage() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <h1 className="h-display text-2xl sm:text-3xl text-foreground">Office</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Bridge agentes IA · vista en vivo del pixel office (Railway).
        </p>
      </header>
      <div className="relative flex-1 bg-muted/20">
        <iframe
          src={BRIDGE_URL}
          title="URPE AI Lab Pixel Office"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </main>
  );
}
