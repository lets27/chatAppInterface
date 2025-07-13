import "dotenv/config";
const secretKey = process.env.JWTSECRET;
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const verifyToken = (req, res, next) => {
  try {
    const bearHeader = req.headers.authorization;

    if (!bearHeader) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = bearHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Malformed authorization header" });
    }

    verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      if (!decoded?.id) {
        return res.status(403).json({ message: "Malformed token payload" });
      }
      console.log("Decoded right after signing:", decoded);
      req.user = decoded;
      console.log("req.user:", req.user);
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Authentication error" });
  }
};
