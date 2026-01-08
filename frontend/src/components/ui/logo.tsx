export function Logo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 24" className={className}>
      <title>BeautyBook</title>
      <text 
        x="0" 
        y="18" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        fontSize="20" 
        fontWeight="600" 
        fill="currentColor"
        letterSpacing="-0.5"
      >
        BeautyBook
      </text>
    </svg>
  );
}
