const jwt = require("jsonwebtoken");

const projectAccessMiddleware = (
    req,
    res,
    next
) => {
    try {
        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith(
                "Bearer "
            )
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Project access token required",
            });
        }

        const token =
            authHeader.split(" ")[1];

        const secret =
            process.env.PROJECT_ACCESS_SECRET ||
            process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                success: false,
                message:
                    "Project access secret is not configured",
            });
        }

        const decoded =
            jwt.verify(
                token,
                secret
            );

        if (
            decoded.type !==
            "hackathon-project"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Invalid project access token",
            });
        }

        if (
            decoded.registrationId !==
            req.params.registrationId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Project access denied",
            });
        }

        req.projectAccess =
            decoded;

        next();
    } catch (error) {
        console.error(
            "Project Access Error:",
            error
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired project access token",
        });
    }
};

module.exports =
    projectAccessMiddleware;