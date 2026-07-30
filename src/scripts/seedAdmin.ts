import { email } from "better-auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        console.log("********Admin seeding started.......");
        const adminData = {
            name: "Admin2 tayu",
            email: "admin2@admin.com",
            role: UserRole.ADMIN,
            password: "admin1234",
            emailVerified: true
        }
        console.log("*******cheking admin exist or not");
        // check user exist on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        if (existingUser) {
            throw new Error("User already exist!")
        }

        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:4000",
            },
            body: JSON.stringify(adminData)
        })


        if (signUpAdmin.ok) {
            console.log("***admin created");
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })

            console.log("*******email verification status updated");
        }

        console.log("success");
    } catch (err) {
        console.log(err);
    }
}

seedAdmin();