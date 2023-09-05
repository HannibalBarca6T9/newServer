const Mongoose = require("mongoose");
const users = require("../model/user.js");
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        await Mongoose.connect('mongodb://127.0.0.1:27017/appiheb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB!");

        const admin = await users.findOne({
            email: "ihebbenjemia@gmail.com"
        });

        if (!admin) {
            const password = 'iheb@123';
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const new_user = new users({
                nom:"Ben jemia",
                prenom: 'iheb',
                email: 'ihebbenjemia@gmail.com',
                DateNaissance:'12-03-1997',
                telephone:28345456,
                password: hashed,
                
            });

            await new_user.save();
            console.log(` webmaster Account has been added: ${new_user.email}`);
        } else {
            console.log(` webmaster Account already exists. Email: ${admin.email}`);
        }
    } catch (error) {
        console.error(error);
        console.log("Database is not connected");
    }
};

module.exports = connectDB;

