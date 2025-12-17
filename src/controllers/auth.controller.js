import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { users, roles, userRoles } from "../config/schema.js";
import { eq } from "drizzle-orm";

/* =========================
   REGISTER
========================= */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "USER" } = req.body;

    // cek user sudah ada
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    // ambil role
    const [roleRow] = await db.select().from(roles).where(eq(roles.name, role));

    // assign role
    await db.insert(userRoles).values({
      userId: newUser.id,
      roleId: roleRow.id,
    });

    res.status(201).json({
      message: "Register berhasil",
      userId: newUser.id,
      role,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        role: roles.name,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.email, email));

    if (result.length === 0) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    // buat token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
