/**
 * Reusable loading spinner.
 * @param {object} props
 * @param {"sm"|"md"|"lg"} props.size
 * @param {string} props.className
 */
export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizes[size]}`}
      />
    </div>
  );
}
