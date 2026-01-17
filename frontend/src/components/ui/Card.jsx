function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ className = "", children }) {
  return <div className={`p-4 border-b border-[rgb(var(--border))] ${className}`}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export { Card, CardHeader, CardContent };
