exports.fineAlertEmail = (username, bookTitle, fineAmount) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Fine Alert</title>
    <style>
      body {
        background-color: #0f172a;
        color: #f1f5f9;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #1e293b;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        padding: 30px 40px;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h2 {
        color: #38bdf8;
        font-size: 24px;
      }
      .body {
        font-size: 16px;
        line-height: 1.6;
      }
      .highlight {
        color: #facc15;
        font-weight: 600;
      }
      .footer {
        font-size: 14px;
        color: #94a3b8;
        text-align: center;
        margin-top: 30px;
        border-top: 1px solid #334155;
        padding-top: 20px;
      }
      a {
        color: #60a5fa;
        text-decoration: none;
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
        &copy; ${new Date().getFullYear()} BooksNest. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
};
