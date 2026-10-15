import { User } from "../models/associations.js";
import { handleError } from "../utils/handle-error.js";

export async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Required: create with build() and save().
    const user = User.build({ name, email, password, role });
    await user.save();

    const safeUser = user.toJSON();
    delete safeUser.password;
    return res.status(201).json({ message: "User created successfully.", user: safeUser });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function upsertUserById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "id must be a positive integer." });
    }

    const allowed = ["name", "email", "password", "role"];
    const values = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );
    if (Object.keys(values).length === 0) {
      return res.status(400).json({ message: "Provide at least one user field." });
    }

    const user = await User.findByPk(id);
    if (user) {
      await user.update(values, { validate: false });
      const safeUser = user.toJSON();
      delete safeUser.password;
      return res.status(200).json({ message: "User updated (validation skipped).", user: safeUser });
    }

    // Create by supplied primary key, intentionally skipping validation as requested.
    const created = await User.create({ id, ...values }, { validate: false });
    const safeUser = created.toJSON();
    delete safeUser.password;
    return res.status(201).json({ message: "User created (validation skipped).", user: safeUser });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getUserByEmail(req, res) {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Query parameter email is required." });

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] }
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json(user);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getUserByIdWithoutRole(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["role", "password"] }
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json(user);
  } catch (error) {
    return handleError(res, error);
  }
}
