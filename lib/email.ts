import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://vihara.vercel.app';

const html = (body: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#080C0C;font-family:'Helvetica Neue',Arial,sans-serif;color:#F2EDE4;}
  .wrap{max-width:560px;margin:0 auto;padding:40px 20px;}
  .logo{font-size:28px;font-weight:900;letter-spacing:4px;color:#C9965A;text-transform:uppercase;margin-bottom:32px;}
  .card{background:#0f1512;border:1px solid rgba(201,150,90,0.2);border-radius:16px;padding:36px 32px;}
  .title{font-size:22px;font-weight:800;color:#F2EDE4;margin-bottom:12px;line-height:1.3;}
  .sub{font-size:15px;color:rgba(255,255,255,0.55);line-height:1.75;margin-bottom:24px;}
  .otp{font-size:44px;font-weight:900;letter-spacing:12px;color:#C9965A;text-align:center;padding:24px;background:rgba(201,150,90,0.08);border:1px solid rgba(201,150,90,0.25);border-radius:12px;margin:24px 0;}
  .btn{display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#C9965A,#e8b87a);color:#1a0f00;font-weight:700;font-size:14px;text-decoration:none;border-radius:50px;}
  .footer{margin-top:32px;font-size:11px;color:rgba(255,255,255,0.25);text-align:center;line-height:1.6;}
  .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.5px;}
  .badge-gold{background:rgba(201,150,90,0.15);color:#C9965A;border:1px solid rgba(201,150,90,0.3);}
  .badge-green{background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3);}
  .badge-red{background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);}
</style></head>
<body><div class="wrap">${body}<div class="footer">© 2025 VIHARA — Discover India's Hidden Gems<br>${BASE}</div></div></body>
</html>`;

export async function sendOTP(to: string, name: string, otp: string) {
  await transporter.sendMail({
    from: `"VIHARA" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${otp} — Your VIHARA Verification Code`,
    html: html(`
      <div class="logo">VIHARA</div>
      <div class="card">
        <div class="title">Verify your email 🔐</div>
        <p class="sub">Hi ${name}, use the code below to verify your email before submitting your hidden gem. This code expires in <strong>10 minutes</strong>.</p>
        <div class="otp">${otp}</div>
        <p class="sub" style="font-size:13px;margin-bottom:0;">If you didn't request this, you can safely ignore this email.</p>
      </div>`),
  });
}

export async function sendSubmissionReceived(to: string, name: string, placeName: string) {
  await transporter.sendMail({
    from: `"VIHARA" <${process.env.GMAIL_USER}>`,
    to,
    subject: `We received your gem — ${placeName} ✨`,
    html: html(`
      <div class="logo">VIHARA</div>
      <div class="card">
        <div style="font-size:48px;margin-bottom:16px;">🌟</div>
        <span class="badge badge-gold">Under Review</span>
        <div class="title" style="margin-top:16px;">Thank you, ${name}!</div>
        <p class="sub">Your submission of <strong style="color:#C9965A;">${placeName}</strong> has been received and is now under review by our team. We'll notify you once a decision is made — usually within 24–48 hours.</p>
        <a href="${BASE}/en/submit" class="btn">View Pending Submissions →</a>
      </div>`),
  });
}

export async function sendSubmissionResult(to: string, name: string, placeName: string, approved: boolean) {
  await transporter.sendMail({
    from: `"VIHARA" <${process.env.GMAIL_USER}>`,
    to,
    subject: approved ? `🎉 ${placeName} is now on VIHARA!` : `Update on your submission — ${placeName}`,
    html: html(`
      <div class="logo">VIHARA</div>
      <div class="card">
        <div style="font-size:48px;margin-bottom:16px;">${approved ? '🎉' : '🙏'}</div>
        <span class="badge ${approved ? 'badge-green' : 'badge-red'}">${approved ? 'Approved' : 'Not Approved'}</span>
        <div class="title" style="margin-top:16px;">${approved ? `${placeName} is live!` : `About your submission`}</div>
        <p class="sub">${approved
          ? `Congratulations ${name}! Your hidden gem <strong style="color:#C9965A;">${placeName}</strong> has been approved and is now discoverable by travelers on VIHARA. Thank you for contributing to India's travel community!`
          : `Hi ${name}, after careful review, <strong style="color:#C9965A;">${placeName}</strong> wasn't approved at this time. This could be due to incomplete details or similarity with existing listings. You're welcome to submit again with more information.`
        }</p>
        ${approved ? `<a href="${BASE}/en/explore" class="btn">Explore on the Map →</a>` : `<a href="${BASE}/en/submit" class="btn">Submit Another Gem →</a>`}
      </div>`),
  });
}
