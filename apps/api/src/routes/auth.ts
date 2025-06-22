import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/AuthRequest";
import { validate } from "../middleware/validate";
import { loginSchema, signupSchema } from "../schemas/auth";
import prisma from "../prismaclient";

const router = Router();

router.post("/signup",validate(signupSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  const token = generateToken(user.id);

  res.json({ token });
});

router.post("/login",validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken(user.id);
  res.json({ token });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true },
  });

  res.json(user);
});

export default router;
