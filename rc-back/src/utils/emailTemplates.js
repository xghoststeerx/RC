module.exports = {
  welcomeEmail: (nombre, password, email) => ({
    subject: "¡Bienvenido a nuestra plataforma!",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">¡Hola ${nombre}!</h1>
            <p style="font-size: 16px; line-height: 1.5;">Te damos la bienvenida a nuestra plataforma. Estamos encantados de tenerte a bordo.</p>
            <p style="font-size: 16px; line-height: 1.5;">Tus credenciales de inicio de sesión son las siguientes:</p>
            <ul style="list-style-type: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>Correo electrónico:</strong> ${email}</li>
              <li><strong>Contraseña:</strong> ${password}</li>
            </ul>
            <p style="font-size: 16px; line-height: 1.5;">Por favor, mantén esta información segura y no la compartas con nadie.</p>
            <p style="font-size: 16px; line-height: 1.5;">Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
            <p style="font-size: 16px; line-height: 1.5;">Saludos cordiales,<br>Fundacion escuela tecnologica</p>
          </div>
        `,
  }),
  updatePasswordEmail: (email, updateCode) => ({
    subject: "Actualización de contraseña",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Actualización de contraseña</h1>
            <p style="font-size: 16px; line-height: 1.5;">Has solicitado actualizar tu contraseña. Para proceder, utiliza el siguiente código de verificación:</p>
            <p style="font-size: 24px; font-weight: bold; text-align: center;">${updateCode}</p>
            <p style="font-size: 16px; line-height: 1.5;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <p style="font-size: 16px; line-height: 1.5;">Saludos cordiales,<br>Fundación Escuela Tecnológica</p>
          </div>
        `,
  }),

  loginNotification: (username) => ({
    subject: "Login Alert",
    text: `Hi ${username},\n\nWe noticed a login to your account. If this was you, you can ignore this message. If you didn't login, please secure your account.\n\nBest regards,\nYour Company`,
  }),

  passwordUpdatedEmail: (email) => ({
    subject: 'Contraseña actualizada',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Contraseña actualizada</h1>
        <p style="font-size: 16px; line-height: 1.5;">Tu contraseña ha sido actualizada exitosamente.</p>
        <p style="font-size: 16px; line-height: 1.5;">Si no realizaste este cambio, por favor contáctanos de inmediato.</p>
        <p style="font-size: 16px; line-height: 1.5;">Saludos cordiales,<br>Fundación Escuela Tecnológica</p>
      </div>
    `,
  }),
  verificationEmail: (verificationLink) => ({
    subject: 'Verificación de correo electrónico',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Verificación de correo electrónico</h1>
        <p style="font-size: 16px; line-height: 1.5;">Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
        <a href="${verificationLink}" style="font-size: 16px; line-height: 1.5; color: #007bff; text-decoration: none;">${verificationLink}</a>
        <p style="font-size: 16px; line-height: 1.5;">Si no solicitaste esta verificación, puedes ignorar este correo.</p>
        <p style="font-size: 16px; line-height: 1.5;">Saludos cordiales,<br>Fundación Escuela Tecnológica</p>
      </div>
    `,
  }),
};
