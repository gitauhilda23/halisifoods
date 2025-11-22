// server/middleware/auth.ts
import { type Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  // Try to load service account from environment variables
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  // If keys are missing, fall back to default credentials (works on Vercel/Netlify later)
  admin.initializeApp({
    credential: serviceAccount.projectId
      ? admin.credential.cert(serviceAccount as admin.ServiceAccount)
      : admin.credential.applicationDefault(),
  });
}

declare global {
  namespace Express {
    interface Request {
      user: {
        uid: string;
        email?: string;
        name?: string;
      } | null;
    }
  }
}

export async function firebaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || undefined,
      name: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
    };
  } catch (error) {
    console.warn("Invalid Firebase token:", error);
    req.user = null;
  }

  next();
}