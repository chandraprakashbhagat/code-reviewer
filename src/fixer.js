const prettier = require("prettier");

function formatCode(code) {
  return prettier.format(code, { parser: "babel" });
}

module.exports = { formatCode };
