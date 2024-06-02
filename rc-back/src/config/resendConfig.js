const { Resend } = require('resend');


if (!process.env.RESEN_CODE) {
  throw new Error('RESEN_CODE No esta definicido en las variables de entorno');
}

const resend = new Resend(process.env.RESEN_CODE);

module.exports = resend;
