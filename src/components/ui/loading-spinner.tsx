// 可复用加载指示器
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent",
        className
      )}
    />
  );
}
