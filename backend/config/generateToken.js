const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
module.exports = generateToken;

// let token = JSON.parse(localStorage.getItem("token"));

// if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;