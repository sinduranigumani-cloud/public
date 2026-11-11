import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function makeToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    return res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Could not create account.", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    return res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Could not log in.", error: error.message });
  }
}

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: "Google Sign-In has not been configured yet." });
    }
    if (!credential) return res.status(400).json({ message: "Google credential is missing." });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: "Google account email could not be verified." });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }
    return res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    return res.status(401).json({ message: "Google Sign-In could not be verified.", error: error.message });
  }
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}
