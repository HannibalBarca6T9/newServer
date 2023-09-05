const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true
     },
    telephone: {
         type: String, 
         required: true
         },
    DateNaissance: {
         type: Date, 
         required: true 
        },
    prenom: {
         type: String,
          required: true
         },
    email: { 
        type: String,
         
         },
    password: { 
        type: String, 
        
    },
   
    
});


module.exports = mongoose.model('users', userSchema);

