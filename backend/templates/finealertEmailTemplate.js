exports.fineAlertEmail = (username, bookTitle, fineAmount) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Fine Alert</title>
  <style>
    body {
      background-color: #09090B; /* Dark Base */
      color: #e2e8f0; /* zinc-200 */
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #18181B; /* zinc-900 */
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      padding: 32px 28px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h2 {
      color: #38bdf8; /* sky-400 */
      font-size: 24px;
      font-weight: 700;
    }

    .body {
      font-size: 16px;
      line-height: 1.6;
      color: #e2e8f0;
    }

    .highlight {
      color: #facc15; /* yellow-400 */
      font-weight: 600;
    }

    .footer {
      font-size: 14px;
      color: #94a3b8; /* zinc-400 */
      text-align: center;
      margin-top: 30px;
      border-top: 1px solid #334155; /* zinc-700 */
      padding-top: 20px;
    }

    a {
      color: #60a5fa; /* blue-400 */
      text-decoration: none;
    }

    @media screen and (max-width: 480px) {
      .container {
        padding: 20px 16px;
      }

      .header h2 {
        font-size: 20px;
      }

      .body {
        font-size: 15px;
      }

      .footer {
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📢 Fine Alert</h2>
    </div>

    <div class="body">
      <p>Hi <strong>${username}</strong>,</p>
      <p>This is to inform you that a fine of <span class="highlight">₹${fineAmount}</span> has been applied to your account for the book titled <span class="highlight">"${bookTitle}"</span>.</p>
      <p>Please make sure to clear the fine at your earliest convenience to avoid any restrictions on future borrowings.</p>
      <p>If you've already cleared it, kindly ignore this message.</p>
    </div>

    <div class="footer">
      Need help? Reach out at <a href="mailto:support@booksnest.com">support@booksnest.com</a><br/>
      &copy; ${new Date().getFullYear()} BooksNest Library. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
