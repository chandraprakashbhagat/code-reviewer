const crypto = require("crypto");

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

module.exports = { hashCode };
