const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HondaSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        minlength : [2 , "invalid name"]
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        minlength : [2 , "invalid name"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
            {
                throw new Error("invalid email")
            }
        }
    },
    number: {
        type: Number,
        required: true,
        unique: true,
        min : [10 , "invalid number"]
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required : true
    },
    tokens: [{
        token: {
            type: String,
            required : true
        }
    }],
    date :{
        type: Date,
        default : Date.now
    }
});

HondaSchema.methods.generatToken = async function () {
    try
    {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
        
    } catch (error) {
        console.log(error)
    }
}

HondaSchema.pre("save", async function (next) {
    if (this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})

const HondaUser = new mongoose.model("HondaUser", HondaSchema);

module.exports = HondaUser;