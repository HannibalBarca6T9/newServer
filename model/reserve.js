const mongoose = require('mongoose');

const reserveschema = new mongoose.Schema({
    numero:{
type:Number
    },
Entreprise:{
type:String
},
libele:{
type:String
},
Support:{
type:String
},
Nature:{
type:String
},
type:{
type:String
},
Zone:{
type:String
},
Perioriter:{
    type:Date

},
Datedepot:{
    type:Date
},
datelivraison:{
    type:String

},
Commentaire:{
    type:String
},
statu:{
type:Boolean,
default:false
},

photo:{
    type:[String]
}
})


module.exports = mongoose.model('Reserve', reserveschema);