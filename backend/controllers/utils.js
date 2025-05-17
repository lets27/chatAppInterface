import "dotenv/config";
const secretKey = process.env.JWTSECRET;
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const verifyToken = (req, res, next) => {
  try {
    const bearHeader = req.headers.authorization;
    //split bearer header

    if (!bearHeader) {
      console.log("no token");
      return res.status(401).json({ message: "Missing token" });
    }
    if (bearHeader) {
      const token = bearHeader.split(" ")[1];

      verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "invalid token aunuthorized access" });
        }

        req.user = decoded;

        next();
      });
    }
  } catch (error) {
    console.log(error);
  }
};
