// src/lib/emailTemplates/welcome.ts
export function welcomeEmail(name: string) {
    return `
    <div style="font-family: Arial, sans-serif">

    <h2>Welcome to ProTrader Edge</h2>

    <p>Hello ${name},</p>

    <p>Your account has been successfully created. We're excited to have you on board!</p>

    <p>You can now make payment and access your dashboard to begin your journey to be a successful trader.</p>

    <a href="${process.env.APP_URL}/login"
    style=
    "display: inline-block;
    padding: 12px 20px;
    background-color: #c6a437;
    color: black;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
    ">
     Go to Dashboard
    </a>

    <p style="margin-top: 20px">If you did not create this account, please ignore this email.</p>

    <hr/>

    <p style="font-size: 12px; color: #777;">ProTrader Edge Limited</p>

    </div>
    `;
}