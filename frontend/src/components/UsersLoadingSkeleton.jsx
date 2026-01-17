function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-[rgb(var(--surface-1))] border border-[rgb(var(--border))] p-4 rounded-2xl animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[rgb(var(--surface-2))] rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-[rgb(var(--surface-2))] rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-[rgb(var(--surface-3))] rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;
