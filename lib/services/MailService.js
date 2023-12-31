var nodemailer = require("nodemailer");

/**
 * Gửi mail thay đổi mật khẩu
 * @param {*} mail
 */
const sendMailChangePassword = (to, password) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.M_USERNAME,
      pass: process.env.M_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.M_USERNAME,
    to: to,
    subject: "[MUSIC] Thay đổi mật khẩu",
    html: `<p>Bạn đã reset mật khẩu thành công.</p>
           <p>Mật khẩu mới của bạn là <b style="color: blue">${password}</b></p>
           <p>Vui lòng không tiết lộ cho người lạ.</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Email sent:" + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendMailChangePassword = sendMailChangePassword;