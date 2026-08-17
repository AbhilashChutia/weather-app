"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function setHomeLocation(
    cityName: string,
    lat: number,
    lon: number,
) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                homeCity: cityName,
                homeLat: lat,
                homeLon: lon,
            },
        });

        revalidatePath("/");
        revalidatePath("/weather");
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to update home location",
        };
    }
}

export async function removeHomeLocation() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                homeCity: null,
                homeLat: null,
                homeLon: null,
            },
        });

        revalidatePath("/");
        revalidatePath("/weather");
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to remove home location",
        };
    }
}
