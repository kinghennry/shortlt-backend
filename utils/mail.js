const nodemailer = require("nodemailer");

exports.mailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

exports.generatePasswordResetTemplate = (url) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style>
      @media only screen and (max-width: 620px) {
        h1 {
          font-size: 20px;
          padding: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div>
      <div
        style="
          max-width: 620px;
          margin: 40px auto;
          font-family: sans-serif;
          color: #272727;
        "
      >
        <h1
          style="
            background: #f6f6f6;
            padding: 10px;
            text-align: center;
            color: #272727;
          "
        >
          Response to Your Reset Password Request.
        </h1>
        <p style="color: #272727">
          Please Click on The Link Below To Reset Your Password.
        </p>
        <div style="text-align: center">
          <a
            href="${url}"
            style="
              font-family: sans-serif;
              margin: 40px auto;
              padding: 20px;
              text-align: center;
              background: #e63946;
              text-decoration: none;
              display: inline-block;
              cursor: pointer;
              border-radius: 5px;
              font-size: 20px 10px;
              color: #fff;
            "
          >
            Reset Password
          </a>
        </div>
      </div>
    </div>
  </body>
</html>
    `;
};
