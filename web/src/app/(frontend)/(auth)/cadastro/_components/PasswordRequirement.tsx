import clsx from "clsx";
import { Check, X } from "lucide-react";

interface PasswordRequirementProps {
  text: string,
  validateFunction: () => boolean;
}
function PasswordRequirement({ text, validateFunction }: PasswordRequirementProps) {
  const isValid = validateFunction();

  return ( 
    <span className={clsx("flex gap-1 items-center", isValid ? "text-primary" : "text-destructive")}>
      {isValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} 
      {text}
    </span>
   );
}

export default PasswordRequirement;