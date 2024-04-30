const jwt = require("jsonwebtoken");

const getJwt = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRECT, {
        // expiresIn: Date.now() + 24 * 60 * 60 * 1000,
        expiresIn: "1h",
    });
    return token;
};

module.exports = getJwt;
