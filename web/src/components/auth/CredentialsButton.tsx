import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { Mail } from "lucide-react";

interface CredentialsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

function CredentialsButton({ children, className, ...props }: CredentialsButtonProps) {
  return ( 
    <button 
      type="submit" 
      className={cn("login-button border-primary bg-primary text-primary-foreground hover:bg-primary/90", className)}
      {...props}
    >
      <Mail className="size-5" />
      {children}
    </button>
   );
}

export default CredentialsButton;