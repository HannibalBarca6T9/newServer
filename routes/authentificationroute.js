const express=require("express")
const router=express.Router()
const authcontrollers=require("../controllers/authentification")
const multer = require("multer");
//dfefinir un storage pour ajouter une image
const storage = multer.diskStorage({
    //destination de l'image
    destination: function (req, file, callback) {
        callback(null, './images/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,

})

router.post("/login", authcontrollers.login)

module.exports=router