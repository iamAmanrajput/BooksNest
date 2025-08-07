exports.commonEmailTemplate = (message) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NexLib</title>
  <style>
    body {
      background-color: #09090B; /* true dark */
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
      padding: 32px 28px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .heading {
      font-size: 24px;
      font-weight: 700;
      color: #facc15; /* yellow-400 */
    }

    .body {
      font-size: 16px;
      line-height: 1.6;
      color: #a1a1aa;
      text-align: center;
      margin-top: 10px;
    }

    .text-bold {
      font-weight: 600;
      color: #a1a1aa;
    }

    .footer {
      margin-top: 30px;
      font-size: 14px;
      text-align: center;
      color: #a1a1aa; /* zinc-400 */
      border-top: 1px solid #3f3f46; /* zinc-700 */
      padding-top: 20px;
    }

    @media screen and (max-width: 480px) {
      .container {
        padding: 20px 15px;
      }

      .heading {
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
      <div class="heading">📢 Notification</div>
    </div>

    <div class="body">
      <p class="text-bold">${message}</p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} NexLib Library. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
