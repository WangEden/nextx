// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="opacity-0 animate-[fadeIn_.28s_ease-out_forwards]">
      {children}
    </div>
  );
}
