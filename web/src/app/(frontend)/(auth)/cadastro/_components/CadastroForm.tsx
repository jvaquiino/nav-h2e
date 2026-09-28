'use client'
import Link from "next/link";
import { useState, useEffect } from "react";

import PasswordRequirement from "./PasswordRequirement";
import RequiredTag from "@/components/base/input/RequiredTag";
import { hasLowercase, hasMinLength, hasNumber, hasUppercase, validatePassword, validateConfirmPassword } from "@/utils/validations";

import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import dynamic from 'next/dynamic';

const GoogleAuthButton = dynamic(() => import('@/components/auth/GoogleLoginButton'));
const CredentialsButton = dynamic(() => import('@/components/auth/CredentialsButton'));
const ValidatedInput = dynamic(() => import('@/components/base/input/ValidatedInput'));

function CadastroForm() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      if (!validatePassword(password)) {
        toast.error("A senha não atende aos requisitos mínimos");
        return;
      }

      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        if (result.error.message?.includes('already exists') || result.error.message?.includes('duplicate')) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(result.error.message || "Erro inesperado");
        }
      } else {
        toast.success(`Bem-vindo(a), ${name}!`);
        
        setTimeout(() => {
          redirect('/');
        }, 1000);
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
       
      toast.error((error as any).message ?? "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return ( 
    <div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
        <p className="mt-2 mb-8 text-muted-foreground">Com uma conta você pode conversar com o assistente sobre hidrogênio.</p>
        
        <GoogleAuthButton disabled={loading} text="Continuar com Google" />

        <div className="flex items-center gap-4 py-5">
          <div className="h-px flex-grow bg-border" />
          <p className="text-sm text-muted-foreground">ou</p>
          <div className="h-px flex-grow bg-border" />
        </div>

        <form className="" onSubmit={handleCredentialsSubmit}>
          <div className="flex flex-col gap-4">
            <ValidatedInput
              title="Nome"
              placeholder="Seu nome"
              name="name"
              type="text"
              value={name}
              setValue={setName}
              labelClassName='auth-label'
              inputClassName='auth-input'
              iconContainerClassName="auth-icon"
              required
            ><RequiredTag/></ValidatedInput>
            <ValidatedInput
              title="E-mail"
              placeholder="voce@email.com"
              name="email"
              type="email"
              value={email}
              setValue={setEmail}
              labelClassName='auth-label'
              inputClassName='auth-input'
              iconContainerClassName="auth-icon"
              required
            ><RequiredTag/></ValidatedInput>
            <ValidatedInput
              title="Senha"
              placeholder="Insira sua senha"
              name="password"
              type="password"
              value={password}
              setValue={setPassword}
              overrideValidate={validatePassword}
              labelClassName="auth-label"
              inputClassName="auth-input"
              iconContainerClassName="auth-icon"
              required
            ><RequiredTag/></ValidatedInput>
            <ValidatedInput
              title="Confirmar senha"
              placeholder="Confirme sua senha"
              name="confirmPassword"
              type="password"
              dependencies={[password]}
              value={confirmPassword}
              setValue={setConfirmPassword}
              overrideValidate={(val) => validateConfirmPassword(val, password)}
              labelClassName="auth-label"
              inputClassName="auth-input"
              iconContainerClassName="auth-icon"
              required
            ><RequiredTag/></ValidatedInput>
            <div className="text-sm text-muted-foreground">
              A senha precisa ter pelo menos:
              
              <PasswordRequirement 
                text="1 letra maiúscula"
                validateFunction={() => hasUppercase(password)}
              />
              <PasswordRequirement 
                text="1 letra minúscula"
                validateFunction={() => hasLowercase(password)}
              />
              <PasswordRequirement 
                text="1 número"
                validateFunction={() => hasNumber(password)}
              />
              <PasswordRequirement 
                text="8 caracteres"
                validateFunction={() => hasMinLength(password)}
              />
            </div>
          </div>
          <CredentialsButton disabled={loading} className="mt-6">Criar conta</CredentialsButton>
        </form>
        
        <Link href='/login' className="block w-fit mt-8 text-sm text-muted-foreground group">Já tem uma conta? <span className="font-semibold text-primary group-hover:underline underline-offset-4">Entrar</span></Link>
      </div>
    </div>
   );
}

export default CadastroForm;