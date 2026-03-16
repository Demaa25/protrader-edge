// src/lib//emailTemplates/token.ts
export function resetTokenEmail(resetLink: string) {
  return `
  <div style="font-family:Arial,sans-serif;line-height:1.6">

    <h2>Password Reset Request</h2>

    <p>You requested a password reset for your ProTrader Edge account.</p>

    <p>Click the button below to reset your password:</p>

    <a href="${resetLink}"
       style="
        display:inline-block;
        padding:12px 20px;
        background:#2a6bff;
        color:white;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
       ">
       Reset Password
    </a>

    <p style="margin-top:20px">
      This link will expire in <b>1 hour</b>.
    </p>

    <p>If you did not request this reset, please ignore this email.</p>

    <hr/>

    <p style="font-size:12px;color:#777">
      ProTrader Edge Limited
    </p>

  </div>
  `;
}