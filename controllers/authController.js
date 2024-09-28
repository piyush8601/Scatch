const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../utils/generateTokens');


module.exports.registerUser = async function(req, res) {
    try {
        let {email, fullname, password} = req.body;

        let user = await userModel.findOne({ email: email});
        if(user) return res.status(401).send("User Already Exists, Please Login!");

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if(err) res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });

                    let token = generateTokens(user);
                    res.cookie("token", token);
                    res.send("user created successfully");
                }
            })
        })
        
    } catch (error) {
        res.send(error.message); 
    }
}

module.exports.loginUser = async function(req, res) {
    let {email, password} = req.body;

    let user = await userModel.findOne({ email: email});
    if(!user) return res.send("Email or Password is incorrect");

    bcrypt.compare(password, user.password, function(err,result) {
        if(result){
            let token = generateTokens(user);
            res.cookie("token", token);
            res.redirect("/shop");
        }
        else {
            res.send("Email or Password is incorrect");
        }
    });
}

module.exports.logout = function(req, res) {
    res.cookie("token","");
    res.redirect("/");
}