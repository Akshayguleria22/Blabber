const variants = {
  default: "bg-[rgb(var(--accent))] text-white hover:bg-[rgb(var(--accent-2))]",
  outline: "border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]",
  ghost: "text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]",
  link: "text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-2))]",
};

function Button(props) {
  const { as, variant = "default", className, ...rest } = props;
  const Component = as || "button";

  return (
    <Component
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
        variants[variant] || variants.default,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}

export default Button;
