import nodemailer from 'nodemailer';

const {
  SMTP_HOST = 'localhost',
  SMTP_PORT = '1025',
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM = 'no-reply@example.com',
} = process.env;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth:
    SMTP_USER && SMTP_PASS
      ? {
          user: SMTP_USER,
          pass: SMTP_PASS,
        }
      : undefined,
});

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  const subject = 'Сброс пароля в Chat App';
  const text = `Вы запросили сброс пароля в Chat App.

Если вы не делали этот запрос, просто проигнорируйте это письмо.

Для сброса пароля перейдите по ссылке:
${resetUrl}

Ссылка действительна ограниченное время.`;

  const html = `<p>Вы запросили сброс пароля в <strong>Chat App</strong>.</p>
<p>Если вы не делали этот запрос, просто проигнорируйте это письмо.</p>
<p>Для сброса пароля перейдите по ссылке:</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>Ссылка действительна ограниченное время.</p>`;

  await transport.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

