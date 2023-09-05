const categorie = require("../model/Catégorie");
const reservepdf = require("../model/reservepdf");
const Projet = require("../model/projet");

exports.createcategorie = async (req, res) => {
  try {
    let existecategorie = await categorie.findOne({ nom: req.body.nom });
    if (existecategorie) {
      return res.status(401).json({ message: "Cette catégorie existe" });
    } else {
      const newCategorie = new categorie({
        nom: req.body.nom,
      });
      if (req.files.length > 0) {
        req.files.map((file) => {
          newCategorie.photo = file.path;
        });
      } else {
        return res.status(401).json({ message: "Cette catégorie existe 0 " });
      }

      const resultat = await newCategorie.save();
      res.status(200).json({
        result: resultat,
        message: "new categorie ajouter avec succes",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};
exports.createProject = async (req, res) => {
  try {
    const existProject = await Projet.findOne({ nom: req.body.nom });

    if (existProject) {
      return res.status(401).json({ message: "Ce projet existe déjà" });
    } else {
      const newProject = new Projet({
        nom: req.body.nom,
        Adresse: req.body.Adresse,
        Nombrelogement: req.body.Nombrelogement,
      });

      //   for (let entr of req.body.Entreprise) {
      //     newProject.Entreprise.push(entr);
      //   }

      if (req.files && req.files.length > 0) {
        const pdfIds = [];

        for (const file of req.files) {
          const newPdf = new reservepdf({});
          newPdf.pdffile = file.path;
          const pdfResult = await newPdf.save();
          pdfIds.push(pdfResult._id);
        }

        newProject.pdf = pdfIds;

        const result = await newProject.save();

        await categorie.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { project: result._id } }
        );
        res.status(200).json({
          result: result,
          message: "Nouveau projet ajouté avec succès",
        });
      } else {
        return res
          .status(401)
          .json({ message: "Veuillez télécharger au moins un fichier PDF" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la création du projet",
    });
  }
};
exports.getcategorie = async (req, res) => {
  try {
    let resultat = await categorie.find().populate({
      path: "project",
      populate: {
        path: "pdf",
      },
    });
    res.status(200).json({ resut: resultat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};
exports.getProject = async (req, res) => {
  try {
    let resultat = await Projet.find();
    res.status(200).json({ resut: resultat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};
