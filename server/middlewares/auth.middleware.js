import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "unauthenticated user, please logged in",
      });
    }
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    if (!decodeToken) {
      return res.status(400).json({
        success: false,
        message: "unauthenticated user, invalid user",
      });
    }
    req.user = decodeToken;

    next();
  } catch (error) {
    console.log("unauthenticated middleware error : ", error);
    return res.status(400).json({
      success: false,
      message: "unauthenticated user, please logged in",
    });
  }
};

export default authMiddleware;
