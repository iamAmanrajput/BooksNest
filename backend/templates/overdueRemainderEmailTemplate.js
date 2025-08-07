exports.overdueEmailTemplate = (fullName, bookTitle, dueDate) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Overdue Book Alert</title>
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
      color: #fca5a5;
    }
    .highlight {
      font-weight: bold;
      color: #f87171;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #cbd5e1;
    }
    .cta-button {
      display: inline-block;
      margin-top: 20px;
      background-color: #f87171;
      color: #ffffff;
      padding: 10px 16px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
    }
    .logo {
      width: 120px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">

    <p class="message">
      Hi <strong>${fullName}</strong>,
    </p>
    <p class="message">
      Your book <strong class="highlight">"${bookTitle}"</strong> was due on <strong class="highlight">${dueDate}</strong> and is now <strong class="highlight">overdue</strong>.
    </p>
    <p class="message">
      Please return it as soon as possible to avoid additional fines.
    </p>

    <!-- Optional CTA -->
    <!-- <a href="https://yourdomain.com/dashboard" class="cta-button">Return Now</a> -->

    <p class="footer">
      Thank you,<br />NexLib Team
    </p>
  </div>
</body>
</html>`;
};
