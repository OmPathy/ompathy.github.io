import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: "primary" | "blue" | "purple" | "green" | "red" | "indigo";
}

const gradientClasses = {
  primary: "bg-gradient-to-br from-blue-400 to-purple-600",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  green: "bg-gradient-to-br from-green-400 to-blue-500",
  red: "bg-gradient-to-br from-red-400 to-pink-500",
  indigo: "bg-gradient-to-br from-indigo-400 to-purple-500",
};

export default function GradientCard({ 
  children, 
  className, 
  gradient = "primary" 
}: GradientCardProps) {
  return (
    <Card className={cn("card-hover", className)}>
      <div className={cn("w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4", gradientClasses[gradient])}>
        {children}
      </div>
    </Card>
  );
}
