function createUserMail(email, verificationToken) {
  return (msg = {
    to: `${email}`, // Change to your recipient
    from: "sasvsha@gmai.com", // Change to your verified sender
    subject: "Verify your email",
    text: "please verify your email, before we start",
    html: `<a href="http://localhost:${process.env.DB_PORT}/auth/verify/:${verificationToken}"> and easy to do anywhere, even with Node.js</a>`,
  });
}

module.exports = createUserMail;
