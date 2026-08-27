import nodemailer from "nodemailer";

const sendMail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service : process.env.SMTP_SERVICE,
            auth : {
                user : process.env.SMTP_MAIL,
                pass : process.env.SMTP_PASSWORD
            }
        })

        const emailOptions = {
            from : process.env.SMTP_MAIL,
            to : email,
            subject : subject,
            text : text
        }

        await transporter.sendMail(emailOptions)
    } catch (error) {
        console.log(error)
    }
}

export default sendMail