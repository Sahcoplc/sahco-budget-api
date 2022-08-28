import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import MailFormat from "../../utils/mailFormat.js";
import dotenv from "dotenv";
dotenv.config();

const mailTransport = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

mailTransport.verify((error, success) => {
  if (error) {
    console.log("Mail transport error - " + error);
  } else {
    console.log("Mail transport success");
  }
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./app/views/partials/"),
    layoutsDir: path.resolve("./app/views/layout/"),
    defaultLayout: "main",
    extname: ".hbs",
  },
  extName: ".hbs",
  viewPath: path.resolve("./app/views/"),
};

mailTransport.use("compile", hbs(handlebarOptions));

class Mail {
  constructor(email) {
    this.email = email;
  }

  sendMail(type, data = {}) {
    const htmlData = MailFormat.format(type, data.data);
    const mailOptions = {
      from: '"Skyway Aviation Handling Company Plc." <gbemi.kotoye@outlook.com>',
      to: this.email,
      subject: data.subject || `Skyway Aviation Handling Company Plc.`,
      template: "emailTemplate",
      context: {
        ...htmlData,
      },
    };

    // eslint-disable-next-line no-console
    mailTransport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Mail - ", error);
      }
      console.log("Message sent: ");
      mailTransport.close();
    });
  }
}

export default Mail;
