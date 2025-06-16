exports.addQueueEmailTemplate = ({ fullName, bookTitle, position }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Queue Notification</title>
  <style>
    body {
      background-color: #0f172a;
      color: #e2e8f0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #1e293b;
      border-radius: 12px;
      padding: 30px 25px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .heading {
      font-size: 22px;
      font-weight: 600;
      color: #facc15;
    }

    .body {
      font-size: 16px;
      line-height: 1.6;
      color: #e2e8f0;
      margin-top: 10px;
    }

    .highlight {
      color: #facc15;
      font-weight: 600;
    }

    .footer {
      margin-top: 30px;
      font-size: 14px;
      text-align: center;
      color: #94a3b8;
      border-top: 1px solid #334155;
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
      <div class="heading">📚 Queue Notification</div>
    </div>

    <div class="body">
      <p>Hi <strong>${fullName}</strong>,</p>
      <p>You have been added to the queue for the book <span class="highlight">"${bookTitle}"</span>.</p>
      <p>Your current queue position is: <span class="highlight">#${position}</span></p>
      <p>We will notify you once the book becomes available for you to borrow.</p>
      <p>Thank you for your patience!</p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} BooksNest Library. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
