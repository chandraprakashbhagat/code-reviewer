const parser = require("@babel/parser");

function isValidJavaScript(code) {
  try {
    parser.parse(code, { sourceType: "module" });
    return true;
  } catch {
    return false;
  }
}

module.exports = { isValidJavaScript };
