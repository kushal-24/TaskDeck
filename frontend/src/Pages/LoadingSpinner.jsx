export default function LoadingSpinner({ message, size = "md" }) {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
    };
  
    const dotSizeClasses = {
      sm: "w-1.5 h-1.5",
      md: "w-2 h-2",
      lg: "w-3 h-3",
    };
  
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`${sizeClasses[size]} relative`}>
          <div
            className={`${sizeClasses[size]} rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin`}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-r-cyan-400/30 animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          />
        </div>
  
        {message && (
          <p className="text-cyan-300 text-sm font-medium">{message}</p>
        )}
      </div>
    );
  }
  