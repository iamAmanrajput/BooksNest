exports.returnConfirmationEmail = (username, bookTitle, fineAmount) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BooksNest</title>
  <style>
    body {
      background-color: #09090B; /* Tailwind dark base */
      color: #e2e8f0; /* zinc-200 */
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #18181B; /* zinc-900 */
      padding: 30px 28px;
      border-radius: 12px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h2 {
      font-size: 24px;
      color: #34d399; /* emerald-400 */
    }

    .body {
      font-size: 16px;
      line-height: 1.6;
      color: #e2e8f0;
    }

    .info-box {
      background-color: #334155; /* zinc-700 */
      border-radius: 8px;
      padding: 15px 20px;
      margin: 20px 0;
      color: #f1f5f9; /* zinc-100 */
    }

    .info-box p {
      margin: 8px 0;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #94a3b8; /* zinc-400 */
      border-top: 1px solid #334155;
      padding-top: 20px;
      margin-top: 30px;
    }

    a {
      color: #facc15; /* yellow-400 */
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
      <h2>✅ Book Returned Successfully</h2>
    </div>
    <div class="body">
      <p>Hello <strong>${username}</strong>,</p>
      <p>We’ve successfully received the returned book. Thank you for returning it 😄.</p>

      <div class="info-box">
        <p><strong>Book:</strong> ${bookTitle}</p>
        <p><strong>Fine Amount:</strong> ₹${fineAmount}</p>
      </div>

      <p>If you have any pending fine, please make sure to clear it from your account at your earliest convenience. Otherwise, you can ignore this message.</p>
    </div>

    <div class="footer">
      Have questions? Reach us at
      <a href="mailto:booksnest.app@gmail.com">booksnest.app@gmail.com</a><br/>
      &copy; ${new Date().getFullYear()} BooksNest Library. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
