const mongoose = require('mongoose');

const pdfschema = new mongoose.Schema({
    pdffile:{
        type:String
    },
reserve:{
   type: mongoose.Schema.Types.ObjectId,
    ref:'Reserve'
}



});


module.exports = mongoose.model('pdffile', pdfschema);

