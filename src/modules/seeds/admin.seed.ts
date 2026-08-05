// import bcrypt from "bcryptjs";
import { User } from "../user/user.model";
import { UserRole } from "@/shared/constants/roles";

export async function adminSeed() {
    const admin = await User.findOne({ email: "admin@gmail.com", role: "ADMIN" })
    if (admin) {
        console.log("✅ Admin already exists");
        return;
    }

    await User.updateOne(
        { email: "admin@gmail.com" },
        {
            $set: {
                role: UserRole.ADMIN,
            },
        }
    );

    console.log("✅ Admin created");
}