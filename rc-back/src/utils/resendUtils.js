const resend = require("../config/resendConfig");
const templates = require("./emailTemplates");

const sendEmail = async (emailType, to, params) => {
  const { subject, html } = templates[emailType](...params);
  return resend.emails.send({
    from: "equipo@3dprintsage.xyz",
    to,
    subject,
    html,
  });
};

const sendWelcomeEmail = async (welcomeEmailParams) => {
  const { email, nombre, password } = welcomeEmailParams;
  try {
    const response = await sendEmail("welcomeEmail", email, [
      nombre,
      password,
      email,
    ]);
    if (response.error === null) {
      console.log("Welcome email sent successfully");
    } else {
      console.error("Failed to send welcome email", response);
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
const sendUpdatePasswordEmail = async (updatePassowordParams) => {
  const { userData, updateCode } = updatePassowordParams;
  try {
    const response = await sendEmail("updatePasswordEmail", userData.email, [
      userData,
      updateCode,
    ]);
    if (response.error === null) {
      console.log("Welcome email sent successfully");
    } else {
      console.error("Failed to send welcome email", response);
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

const sendLoginNotificationEmail = async (req, res) => {
  const { email, username } = req.body;

  try {
    const response = await sendEmail("loginNotification", email, [username]);

    if (response.status === "sent") {
      return res
        .status(200)
        .json({ message: "Login notification email sent successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to send login notification email", response });
    }
  } catch (error) {
    console.error("Error sending login notification email:", error);
    return res.status(500).json({
      message: "An error occurred while sending the login notification email",
      error,
    });
  }
};

const sendPasswordUpdatedEmail = async (updatePassowordParams) => {
  const { email } = updatePassowordParams;
  try {
    const response = await sendEmail("passwordUpdatedEmail", email, []);
    if (response.error === null) {
      console.log("Password updated email sent successfully");
    } else {
      console.error("Failed to send password updated email", response);
    }
} catch (error) {
    console.error("Error sending password updated email:", error);
  }
};
const sendVerificationEmail = async (emailParams) => {
  const { email, verificationLink } = emailParams;
  try {
    const response = await sendEmail("verificationEmail", email, [verificationLink]);
    if (response.error === null) {
      console.log("Verification email sent successfully");
    } else {
      console.error("Failed to send verification email", response);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordUpdatedEmail,
  sendUpdatePasswordEmail,
  sendVerificationEmail
};
