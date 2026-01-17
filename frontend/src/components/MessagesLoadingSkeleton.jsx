function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}
        >
          <div className="w-36 h-10 rounded-2xl bg-[rgb(var(--surface-2))]" />
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
