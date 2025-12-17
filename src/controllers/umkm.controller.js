import { db } from "../config/db.js";
import { umkmProfiles } from "../config/schema.js";
import { eq } from "drizzle-orm";

export const createUmkmProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { storeName, slug, description, address, openTime, closeTime } =
      req.body;

    // Cek apakah sudah punya toko
    const existing = await db
      .select()
      .from(umkmProfiles)
      .where(eq(umkmProfiles.userId, userId));

    if (existing.length > 0) {
      return res.status(400).json({ message: "UMKM profile sudah ada" });
    }

    const [profile] = await db
      .insert(umkmProfiles)
      .values({
        userId,
        storeName,
        slug,
        description,
        address,
        openTime,
        closeTime,
        status: "PENDING",
      })
      .returning();

    res.status(201).json({
      message: "Profil UMKM berhasil dibuat, menunggu verifikasi admin",
      profile,
    });
  } catch (err) {
    next(err);
  }
};
