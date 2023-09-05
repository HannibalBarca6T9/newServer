
const projet =require("../model/projet")


exports.gettotalchart = async (req, res) => {
    try {
        let reservetratier = 0;
        let reservenontraiter = 0;

        let resultat = await projet.findById(req.params.id).populate({
            path: "entreprise",
            populate: {
                path: 'reserve'
            }
        });

        resultat.forEach(elem => {
            if (elem.entreprise.reserve.statu === false) {
                reservenontraiter += 1;
            } else if (elem.entreprise.reserve.statu === true) {
                reservetratier += 1;
            }
        });

       
        res.json({
            reservetratier,
            reservenontraiter
        });
    } catch (error) {
  
        res.status(500).json({ error: "An error occurred" });
    }
};


exports.getonechart = async (req, res) => {
    try {
        let onechart = [];

        let resultat = await projet.findById(req.params.id).populate({
            path: "entreprise",
            populate: {
                path: 'reserve'
            }
        });

        let chartData = {};

        resultat.forEach(elem => {
            const entrepriseNom = elem.entreprise.nom;

            if (elem.entreprise.reserve.statu === false) {
                if (!chartData[entrepriseNom]) {
                    chartData[entrepriseNom] = { traiter: 0, nontraiter: 0 };
                }
                chartData[entrepriseNom].nontraiter += 1;
            } else if (elem.entreprise.reserve.statu === true) {
                if (!chartData[entrepriseNom]) {
                    chartData[entrepriseNom] = { traiter: 0, nontraiter: 0 };
                }
                chartData[entrepriseNom].traiter += 1;
            }
        });

        for (const entrepriseNom in chartData) {
            onechart.push({ [entrepriseNom]: chartData[entrepriseNom] });
        }

        res.json(onechart);
    } catch (error) {
        
        res.status(500).json({ error: "An error occurred" });
    }
};


