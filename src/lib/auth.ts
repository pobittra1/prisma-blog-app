import { error } from 'node:console';
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
const nodemailer = require("nodemailer");
// If your Prisma file is located elsewhere, you can change the path


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc

    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,

    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: 'Prisma Blog <prismablog@gmail.com>',
                    to: user.email,
                    subject: "Please verify your email!",
                    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 5px 20px rgba(0,0,0,.08);">

          <tr>
            <td align="center">
              <h1 style="margin:0;color:#111827;">
                Prisma Blog
              </h1>

              <p style="margin-top:10px;font-size:16px;color:#6b7280;">
                Verify your email address to activate your account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 0;text-align:center;">
              <a
                href="${verificationUrl}"
                style="
                  display:inline-block;
                  background:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 32px;
                  border-radius:8px;
                  font-size:16px;
                  font-weight:bold;
                "
              >
                Verify Email
              </a>
            </td>
          </tr>

          <tr>
            <td>
              <p style="color:#4b5563;font-size:15px;line-height:1.7;">
                If the button above doesn't work, copy and paste this link into
                your browser:
              </p>

              <p style="word-break:break-all;">
                <a href="${verificationUrl}" style="color:#2563eb;">
                  ${url}
                </a>
              </p>

              <p style="margin-top:30px;color:#6b7280;font-size:14px;">
                This verification link will expire soon. If you didn't create an
                account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding-top:30px;
                border-top:1px solid #e5e7eb;
                text-align:center;
                color:#9ca3af;
                font-size:13px;
              "
            >
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`,
                });

                console.log(info.messageId);
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});