import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = "", 
  size = "md",
  variant = "ghost"
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`${sizeClasses[size]} ${className} transition-all duration-300 hover:scale-105`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className={`${iconSizes[size]} text-yellow-400 transition-all duration-300`} />
      ) : (
        <Moon className={`${iconSizes[size]} text-slate-700 transition-all duration-300`} />
      )}
    </Button>
  );
}; 