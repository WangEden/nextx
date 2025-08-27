// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        {/* 进度条 */}
        <div className="relative h-1 w-64 overflow-hidden rounded bg-[var(--muted)]">
          <div className="loading-bar absolute inset-0 -translate-x-full" />
        </div>
        <p className="text-sm text-muted-foreground">加载中…</p>
      </div>
    </div>
  );
}
