const entreprise=require("../model/Entreprise")
const projet=require("../model/projet")



exports.addentreprise = async (req, res) =>{
    try {
        const existe=await entreprise.findOne({nom:req.body.nom})
        if(existe){ 
            res.status(400).json({message:"error d'ajout"})
        }else{
            let newentreprise= new entreprise({
                nom:req.body.nom
            })
            const result =await newentreprise.save()
            res.status(200).json({resultat:result,message:"ajouter avec succes "})
            await projet.findByIdAndUpdate({ _id: req.params.id }, { $push: { entreprise: result._id } });
        }
    } catch (error) {
        
    }

}