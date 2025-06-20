exports.addQueueEmailTemplate = (fullName, bookTitle, position) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Queue Notification</title>
  <style>
    body {
      background-color: #09090B; /* true dark background */
      color: #e2e8f0; /* zinc-200 like text */
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #18181B; /* zinc-900 like card */
      border-radius: 12px;
      padding: 32px 28px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .header {
      text-align: center;
      margin-bottom: 24px;
    }

    .heading {
      font-size: 24px;
      font-weight: 700;
      color: #facc15; /* yellow-400 for highlight */
    }

    .body {
      font-size: 16px;
      line-height: 1.65;
      color: #e2e8f0;
      margin-top: 12px;
    }

    .highlight {
      color: #facc15;
      font-weight: 600;
    }

    .footer {
      margin-top: 30px;
      font-size: 14px;
      text-align: center;
      color: #a1a1aa; /* zinc-400 muted text */
      border-top: 1px solid #3f3f46; /* zinc-700 border */
      padding-top: 18px;
    }

    @media screen and (max-width: 480px) {
      .container {
        padding: 24px 16px;
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
      <p>You’ve been added to the queue for the book <span class="highlight">"${bookTitle}"</span>.</p>
      <p>Your current queue position is: <span class="highlight">#${position}</span>.</p>
      <p>We’ll notify you once it becomes available for borrowing.</p>
      <p>Thanks for staying with BooksNest!</p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} BooksNest Library. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
