import { db } from "../config/db.js";
import { umkmProfiles, wallets } from "../config/schema.js";
import { eq } from "drizzle-orm";

/* =========================
   LIST UMKM PENDING
========================= */
export const getPendingUmkm = async (req, res, next) => {
  try {
    const result = await db
      .select()
      .from(umkmProfiles)
      .where(eq(umkmProfiles.status, "PENDING"));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* =========================
   APPROVE UMKM
========================= */
export const approveUmkm = async (req, res, next) => {
  try {
    const umkmId = Number(req.params.id);

    // update status UMKM
    const [updated] = await db
      .update(umkmProfiles)
      .set({ status: "ACTIVE" })
      .where(eq(umkmProfiles.id, umkmId))
      .returning();

    if (!updated) {
      return res.status(404).json({ message: "UMKM tidak ditemukan" });
    }

    // cek apakah wallet sudah ada
    const [existingWallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.umkmId, umkmId));

    // buat wallet jika belum ada
    if (!existingWallet) {
      await db.insert(wallets).values({
        umkmId,
        balancePending: "0",
        balanceAvailable: "0",
      });
    }

    res.json({
      message: "UMKM berhasil di-approve & wallet dibuat",
      umkm: updated,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   REJECT UMKM
========================= */
export const rejectUmkm = async (req, res, next) => {
  try {
    const umkmId = Number(req.params.id);
    const { reason } = req.body;

    const [updated] = await db
      .update(umkmProfiles)
      .set({ status: "REJECTED" })
      .where(eq(umkmProfiles.id, umkmId))
      .returning();

    if (!updated) {
      return res.status(404).json({ message: "UMKM tidak ditemukan" });
    }

    res.json({
      message: "UMKM ditolak",
      reason,
    });
  } catch (err) {
    next(err);
  }
};
