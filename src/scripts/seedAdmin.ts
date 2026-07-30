import { email } from "better-auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {

        const adminData = {
            name: "Admin1 tayu",
            email: "admin1@admin.com",
            role: UserRole.ADMIN,
            password: "admin1234",
            emailVerified: true
        }
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
        console.log(signUpAdmin);
    } catch (err) {
        console.log(err);
    }
}

seedAdmin();