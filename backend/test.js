import crypto from "crypto";

const token = crypto.randomBytes(20).toString("hex")
const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
console.log(hashedToken)