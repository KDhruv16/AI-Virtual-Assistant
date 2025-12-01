import jwt from "jsonwebtoken"
const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.userId;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "is Auth error" })
    }
}

export default isAuth;