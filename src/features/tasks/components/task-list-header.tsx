export function TaskListHeader() {
  return (
    <div className="grid grid-cols-[60px_1fr_120px_180px_60px_60px_70px] items-center gap-3 border-b bg-muted/30 px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
      <span>ID</span>
      <span>Título</span>
      <span>Owner</span>
      <span>Status</span>
      <span>Edad</span>
      <span>Prio</span>
      <span>AI</span>
    </div>
  );
}
