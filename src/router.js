const express = require('express');
const router = new express.Router();
const HondaUser = require("./models/conn");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

// middleware 
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

// router get 

router.get("/", (req, res) => {
    res.status(201).render("index");
})

router.get("/extra", auth, (req, res) => {
    res.status(201).render("extra");
})

router.get("/logout", auth , async (req, res) => {  
    try
    {
        req.UserMatch.tokens = req.UserMatch.tokens.filter((val) => {
            return val.token !== req.token;
        })
        // req.UserMatch.tokens = [];
        res.clearCookie("jwt");
        await req.UserMatch.save();
        res.status(201).render("logout");
        
    } catch (error) {
        res.status(201).render("error4" , {para :error});
    }
})

router.get("/login", (req, res) => {
    res.status(201).render("login");
})

router.get("/registration", (req, res) => {
    res.status(201).render("registration");
})

router.get("/404", (req, res) => {
    res.status(201).render("error4" );
})

router.get("/501", (req, res) => {
    res.status(201).render("error5");
})

router.get("/register-api", async (req, res) => {
    try
    {
        const getapi = await HondaUser.find({});
        res.status(201).send(getapi);
        
    } catch (error) {
        res.status(201).render("error5", {para : error});
    }
})

// router post 

router.post("/registration", async (req, res) => {
    try
    {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        
        if (password === confirmpassword)
        {
            const Userdata = new HondaUser({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                number: req.body.number,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            });

            const token = await Userdata.generatToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true
            });

            await Userdata.save();
            res.status(201).render("index");
            
        } else
        {
            res.status(201).render("error5", { para: "invalid password" });
        }
        
    } catch (error)
    {
        res.status(201).render("error5", { para: error });
    }
});

router.post("/login", async (req, res) => {
    try
    {
        const email = req.body.email;
        const password = req.body.password;
        const isEmail = await HondaUser.findOne({ email });
        const isMatch = await bcrypt.compare(password, isEmail.password);

        const token = await isEmail.generatToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true
                // secure : true  eita arek kaejr jonno
            });

        isMatch ? res.status(201).render("index") : res.status(201).render("error5", { para: "invalid password" });
        
    } catch (error)
    {
        
        res.status(201).render("error5", { para: error });
    }
});

// router export 
module.exports = router;