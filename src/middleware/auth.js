const jwt = require("jsonwebtoken");
const HondaUser = require("../models/conn");

const auth = async (req, res, next) => {
    try
    {
        const token = req.cookies.jwt;
        const authData = jwt.verify(token, process.env.SECRET_KEY);
        const UserMatch = await HondaUser.findOne({ _id: authData._id });
        req.token = token;
        req.UserMatch = UserMatch;
        next();
    } catch (error) {
        res.status(201).render("error5", { para: "Please Login" });
        // console.log(error)
    }
}

// auth export 

module.exports = auth;