interface OrderConfirmationEmailProps {
    customerName: string;
    customerAddress: string;
    totalPrice: number;
    trackingUrl: string;
}

const orderConfirmationEmail = ({
    customerName,
    customerAddress,
    totalPrice,
    trackingUrl,
}: OrderConfirmationEmailProps): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#eeeceb;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#eeeceb;padding:40px 20px">
    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;overflow:hidden;">

                <tr>
                    <td style="background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);padding:32px 40px 24px;text-align:center;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align:center">
                                    <div style="display:inline-block;padding-bottom:8px;border-bottom:1px solid #d4af37;margin-bottom:16px">
                                        <h1 style="margin:0;font-family:'Playfair Display',serif;font-size:28px;font-weight:600;color:#ffffff;letter-spacing:-0.1px">
                                            GREATNESS
                                        </h1>
                                    </div>
                                    <p style="margin:0;font-size:12px;color:#dfdbd9;letter-spacing:-0.1px">
                                        Wear Greatness, Be Great
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:50px 40px 0px;text-align:center;">
                        <h1 style="margin:0;font-family:'Playfair Display',serif;font-size:30px;color:#1a1a1a;">
                            Order Confirmed
                        </h1>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 40px 30px">
                        <div style="text-align:center;padding:28px;position:relative;overflow:hidden">                            
                            <p style="margin:0;font-size:40px;font-weight:900;color:#d4af37;font-family:'Playfair Display',serif;letter-spacing:-0.1px;">PKR ${totalPrice.toFixed(2)}</p>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 40px 40px;color:#444444">
                        <p style="margin:0 0 10px;font-size:14px;">
                            Dear <span style="color:#1a1a1a;font-size:20px;font-family:'Playfair Display',serif;letter-spacing:-0.1px; font-weight: 900; margin-left: 2px;">${customerName},</span>
                        </p>
                        <p style="font-size:12px;color:#666666;letter-spacing:-0.1px;">
                            Your order has been received and is now being processed with the precision and care that defines Greatness. Each timepiece is inspected, calibrated, and prepared to our exacting standards before shipment.
                        </p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding:0 40px 50px">
                        <div style="background:#ffffff;border:1px solid #eae2d6;padding:24px;position:relative">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="vertical-align:top">
                                        <p style="margin:0 0 10px;font-size:12px;font-weight:500;color:#888888;">
                                            Delivery Destination
                                        </p>
                                        <p style="margin:0;color:#1a1a1a;font-size:16px;font-family:'Playfair Display',serif;letter-spacing:-0.1px;line-height:1.6;">
                                            ${customerAddress}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 40px 50px">
                        <a 
                            href="${trackingUrl}"
                            style="
                                display:block;
                                width:100%;
                                text-align:center;
                                background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                                color:#ffffff;
                                padding:18px 0;
                                text-decoration:none;
                                position:relative;
                                overflow:hidden;
                                border:none;
                                font-size:14px;
                                letter-spacing:-0.1px;
                                font-family:'Playfair Display',serif;
                            "
                        >
                            <span style="position:relative;z-index:2">
                                TRACK YOUR TIMEPIECE
                            </span>
                        </a>
                    </td>
                </tr>

                <tr>
                    <td style="padding:0 40px 50px">
                        <div style="background:#f9f7f3;padding:20px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-left:16px">
                                        <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#1a1a1a;letter-spacing:-0.1px; font-family:'Playfair Display',serif;">
                                            Authentication & Security
                                        </p>
                                        <p style="margin:0;font-size:11px;color:#666666;letter-spacing:-0.1px;">
                                            This tracking link is encrypted and unique to your order. For security, it will expire after 30 days. All Greatness timepieces include a certificate of authenticity and serialized identification.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);padding:32px 40px 40px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align:center">
                                    <p style="margin:0 0 16px;font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.1px">
                                        GREATNESS
                                    </p>
                                    <p style="margin:16px 0 0;font-size:10px;color:#979797;text-align:center;letter-spacing:-0.1px">
                                        © ${new Date().getFullYear()}. All rights reserved. 
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>
`;
};

export default orderConfirmationEmail;