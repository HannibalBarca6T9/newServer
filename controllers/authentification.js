const users=require("../model/user")
const secretOrkey="sldkfdljg455656lfkjgflkgjkfgfg"
const bcrypt=require("bcryptjs")
const jwt = require("jsonwebtoken");
exports.login = async (req, res) => {
    try {
        const exist = await users.findOne({ email: req.body.email });
        console.log(exist);

        if (!exist) {
          return  res.status(401).json({ message: "Email or password incorrect" });
        } else {
            const validPass = await bcrypt.compare(req.body.password, exist.password);
            console.log(validPass);

            if (!validPass) {
               return res.status(401).json({ message: "Email or password incorrect" });
            } else {
                const payload = {
                    _id: exist._id,
                };

                const token = jwt.sign(payload, secretOrkey);

                delete exist.password;
                exist.token = token;

             return   res.status(200).json({ resultat: exist, message: "Login successful" });
            }
        }
    } catch (error) {
        console.log("Login error:", error);
       return res.status(400).json({ message: "An unexpected error occurred during login." });
    }
};
