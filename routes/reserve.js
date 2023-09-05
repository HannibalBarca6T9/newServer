const express = require("express")
const router = express.Router()
const reservecontrollers = require("../controllers/Reserve")
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,

})
router.post("/ajoutreserve/:id", upload.any('image'), reservecontrollers.createreserve)
router.get("/getallreserve",reservecontrollers.getReserve)
router.get("/updatereserve/:id", reservecontrollers.updatestatus)

module.exports=router