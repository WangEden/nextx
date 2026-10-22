// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-template">
      {children}
    </div>
  );
}
