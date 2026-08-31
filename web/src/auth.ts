import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./app/(backend)/services/db";

import { customSession } from "better-auth/plugins";
import { getUserRole } from "@/backend/services/auth";
import { expo } from "@better-auth/expo";
import { sendEmail } from "./lib/email";
import { ResetPasswordEmail } from "./lib/email/templates/ResetPasswordEmail";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url /*, token*/ }) => {
        // url already includes the reset token; just email it.
        // reused both for "esqueci minha senha" and para o admin convidado definir sua senha
        await sendEmail({
          to: user.email,
          subject: "Defina sua senha",
          react: ResetPasswordEmail({ name: user.name, resetUrl: url }),
        });
      },
    },
    user: {
        deleteUser: { 
            enabled: true
        },
        changeEmail: {
            enabled: true,
            // sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
            //     await sendEmail({
            //         to: user.email, // verification email must be sent to the current user email to approve the change
            //         subject: 'Approve email change',
            //         text: `Click the link to approve the change: ${url}`
            //     })
            // }
        }
    },
    // Descomente abaixo para ativar o provedor social google e login com google funcionar
    // socialProviders: { 
    //     google: { 
    //        clientId: process.env.GOOGLE_ID as string, 
    //        clientSecret: process.env.GOOGLE_SECRET as string, 
    //     }, 
    // }, 
    plugins: [
        expo(),
        customSession(async ({ user, session }) => {
            const role = await getUserRole(session.userId);
            return {
                role,
                user,
                session
            };
        }),
        nextCookies(),
    ],
    trustedOrigins: [
        "noctiluz://",
        "noctiluz://*",
    ]
});