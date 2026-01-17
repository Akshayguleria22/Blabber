function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full glass-panel-strong rounded-2xl overflow-hidden">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
