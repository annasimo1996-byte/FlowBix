const getResetPasswordTemplate = (resetUrl) => {
  return `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
      <h2>Hai richiesto il reset della password</h2>
      <p>Clicca sul pulsante sottostante per scegliere una nuova password. Il link è valido per 1 ora.</p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" target="_blank" style="background:#7c6cff; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">Reimposta Password</a>
      </div>
      <p style="color: #666; font-size: 12px;">Se il pulsante non funziona, copia e incolla questo URL nel browser:<br>${resetUrl}</p>
      <hr style="border:none; border-top:1px solid #eee; margin-top:30px;">
      <p style="color: #999; font-size: 12px;">Se non hai richiesto tu questo cambio, puoi ignorare questa email in totale sicurezza.</p>
    </div>
  `;
};

module.exports = { getResetPasswordTemplate };