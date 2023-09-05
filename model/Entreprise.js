const mongoose = require('mongoose');

const entreprise = new mongoose.Schema({
    nom: {
        type: String,
      
    },
    
    reserve: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserve'
    }]

});


module.exports = mongoose.model('entreprise', entreprise);

