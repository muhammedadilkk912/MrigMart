import jwt from "jsonwebtoken";

const protectRoute = (req, res, next) => {
  console.log("🛡️ Protect Route Hit");
  console.log("Cookies received:", req.cookies);

  const token = req.cookies.token; // ⬅️ Check actual cookie key
  console.log("token=",token)

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({ message: "Unauthorized user - no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode=",decoded)
    req.user = decoded;
    console.log("✅ Token verified. User:", req.user);

    // if (decoded.role !== "user") {
    //   console.log("❌ Role is not user");
    //   return res.status(401).json({ message: "Unauthorized user - wrong role" });
    // }

    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protectRoute;
