exports.dueEmailTemplate = (fullName, bookTitle, dueDate) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Book Due Reminder</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #1e293b;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #e2e8f0;
    }
    .highlight {
      font-weight: bold;
      color: #f8fafc;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="message">
      Hi <strong>${fullName}</strong>,
    </p>
    <p class="message">
      Your book <strong class="highlight">"${bookTitle}"</strong> is due on <strong class="highlight">${dueDate}</strong>.
    </p>
    <p class="message">
      Please return or renew it in time to avoid a fine.
    </p>
    <p class="footer">
      Thank you,<br />BooksNest Team
    </p>
  </div>
</body>
</html>`;
};
