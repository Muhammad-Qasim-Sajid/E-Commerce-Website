import jwt from "jsonwebtoken";

const generateTrackingToken = (orderId: string, email: string) => {
    return jwt.sign(
        {
            orderId,
            email,
            type: "order_tracking",
        },
        process.env.TRACKING_SECRET!,
        { expiresIn: "30d" }
    );
};

export default generateTrackingToken;