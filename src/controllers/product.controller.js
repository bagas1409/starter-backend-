import { db } from "../config/db.js";
import { products, umkmProfiles } from "../config/schema.js";
import { eq, and } from "drizzle-orm";

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, price, stock, categoryId, imageUrl } = req.body;

    // cek UMKM milik user & status ACTIVE
    const [umkm] = await db
      .select()
      .from(umkmProfiles)
      .where(
        and(eq(umkmProfiles.userId, userId), eq(umkmProfiles.status, "ACTIVE"))
      );

    if (!umkm) {
      return res.status(403).json({
        message: "UMKM belum aktif / belum di-approve admin",
      });
    }

    const [product] = await db
      .insert(products)
      .values({
        umkmId: umkm.id,
        categoryId,
        name,
        description,
        price,
        stock,
        imageUrl,
      })
      .returning();

    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      product,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET MY PRODUCTS
========================= */
export const getMyProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [umkm] = await db
      .select()
      .from(umkmProfiles)
      .where(eq(umkmProfiles.userId, userId));

    if (!umkm) {
      return res.status(404).json({ message: "UMKM tidak ditemukan" });
    }

    const result = await db
      .select()
      .from(products)
      .where(eq(products.umkmId, umkm.id));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.id);
    const { name, description, price, stock } = req.body;

    const [umkm] = await db
      .select()
      .from(umkmProfiles)
      .where(eq(umkmProfiles.userId, userId));

    if (!umkm) {
      return res.status(404).json({ message: "UMKM tidak ditemukan" });
    }

    const [updated] = await db
      .update(products)
      .set({ name, description, price, stock })
      .where(and(eq(products.id, productId), eq(products.umkmId, umkm.id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({
      message: "Produk berhasil diupdate",
      product: updated,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.id);

    const [umkm] = await db
      .select()
      .from(umkmProfiles)
      .where(eq(umkmProfiles.userId, userId));

    if (!umkm) {
      return res.status(404).json({ message: "UMKM tidak ditemukan" });
    }

    const [deleted] = await db
      .delete(products)
      .where(and(eq(products.id, productId), eq(products.umkmId, umkm.id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};
