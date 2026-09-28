import Link from "next/link";
import BaseCheckbox from "../base/input/BaseCheckbox/BaseCheckbox";

function LoginOptionals() {
  return ( 
    <div className="mt-4 flex items-center justify-between text-muted-foreground text-sm">
      <div className="flex items-center gap-2">
        <BaseCheckbox id="remember" name="remember"  />
        <label htmlFor="remember" className="leading-4">Lembrar de mim</label>
      </div>

      <Link href='/login/reset-password' className="hover:text-primary hover:underline underline-offset-4">Esqueceu sua senha?</Link>
    </div>
   );
}

export default LoginOptionals;