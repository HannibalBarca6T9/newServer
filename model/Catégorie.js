const mongoose = require('mongoose');

const categorieschema = new mongoose.Schema({
    nom: {
        type: String,
   
    },
   photo:{
    type:String
   },
   project:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:"projet"
   }]

});


module.exports = mongoose.model('categorie', categorieschema);

