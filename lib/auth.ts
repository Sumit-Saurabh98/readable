

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins"
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";
import {admin} from "better-auth/plugins"




export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({email, otp}) {
                await resend.emails.send({
                    from: 'Readable <readable@sumitsaurabh.dev>',
                    to: [email],
                    subject: 'Readable - Vrying OTP',
                    html: `<p>One Time Password: <strong>${otp}</strong></p>`
                  });
            }
        }),
        admin()
    ]
})