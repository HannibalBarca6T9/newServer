const express = require('express');
const app = express();
const morgan = require('morgan');

const project=require("./model/projet")
const entreprise =require("./model/Entreprise")

const Database=require("./config/database")
const authrouter=require("./routes/authentificationroute")
const pdf = require("./routes/authentificationroute")
const projectroute = require("./routes/project")
const reserveroute = require("./routes/reserve")
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

Database()

app.use(bodyParser());
app.use(express.json());
app.use('/uploads', express.static('upladspdf'))
app.use('/uploads', express.static('uploads'))
app.use('/exportpdf', express.static('exportpdf'))
app.use("/auth", authrouter)
app.use("/pdf", pdf)
app.use("/project", projectroute)
app.use("/reserve", reserveroute)



const PDFDocument = require('pdfkit');
const fs = require('fs');


app.get('/:id', async (req, res) => {
    try {
        const projet = await project.findById(req.params.id).populate("pdf");

        if (!projet) {
            return res.status(404).send("Projet non trouvé");
        }

        const doc = new PDFDocument();

        const logoWidth = 150;
        const logoHeight = 100;
        const startX = 50;
        const startY = 50;

        doc.image('./tab.jpg', {
            x: 50,
            y: 50,
            fit: [150, 100],
        });

        doc.image('./test.jpg', {
            x: 400,
            y: 50,
            fit: [150, 100],
        });
        doc.moveDown();
        doc.moveDown();

        doc.fontSize(30).fillColor('blue').text('Rapport de réserves', { align: 'center' });

        doc.image('./image.jpg', {
            fit: [500, 500],
            align: 'center',
            valign: 'top',
            marginTop: -6,
        });
        doc.fontSize(30).fillColor('#ADD8E6').text(projet.nom, { align: 'center' });

        for (const elem of req.body.liste) {
            let etr = await entreprise.findById(elem).populate("reserve");
            console.log(etr.reserve.length);

            doc.addPage();
            doc.image('./tab.jpg', {
                x: 50,
                y: 50,
                fit: [150, 100],
            });

            doc.image('./test.jpg', {
                x: 400,
                y: 50,
                fit: [150, 100],
            });
            doc.moveDown();
            doc.fontSize(15).fillColor('#000000').text('Phase(s) concernée(s): Global', { align: 'center' });

            doc.fontSize(15).fillColor('#000000').text(`nombre de reserve:${etr.reserve.length}`, { align: 'center' });

            doc.fontSize(15).fillColor('#000000').text('Filtres actifs:', { align: 'center' });
            doc.fontSize(15).fillColor('#000000').text(etr.nom, { align: 'center' });
            doc.fontSize(15).fillColor('#000000').text('Statut Réserve non levée, Réserve levée par Entreprise(Réserves non - refusées, Réserves refusées...)', { align: 'center' });

            doc.addPage();

            doc.image('./tab.jpg', {
                x: 50,
                y: 50,
                fit: [150, 100],
            });

            doc.image('./test.jpg', {
                x: 400,
                y: 50,
                fit: [150, 100],
            });
            doc.moveDown();
            doc.fontSize(30).fillColor('#ADD8E6').text('606', { align: 'center' });
            doc.fontSize(30).text('Bat - R+06 appartement-PV', { align: 'center' });

            doc.fontSize(30).fillColor('#ADD8E6').text('Généralités', { align: 'center' });

            const table = {
                headers: ['N°', 'N° Unique', 'Phase', 'Libellé', 'Date de constatation', 'A faire Avant', 'Priorité', 'Statut'],
                rows: [
                    [etr.reserve.numero, etr.reserve.numero, etr.reserve.Commentaire, etr.reserve.libele, etr.reserve.Datedepot, etr.reserve.datelivraison, etr.reserve.Perioriter, etr.reserve.statu],
                ],
            };

            const tableOptions = {
                x: startX,
                y: doc.y + 20,
                width: 500,
                columnCount: table.headers.length,
                columnWidths: [40, 60, 60, 150, 60, 60, 60, 60],
                rowHeight: 30,
                rowMarginTop: 10,
                borderWidth: 1,
            };

            drawTable(doc, table, tableOptions);
        }

       
        const pdfFileName = `projet_${projet._id}.pdf`;
        const stream = doc.pipe(fs.createWriteStream(pdfFileName));

        stream.on('finish', () => {
           
            res.sendFile(pdfFileName, { root: __dirname }, (err) => {
                if (err) {
                    console.error("Erreur lors de l'envoi du fichier PDF :", err);
                    res.status(500).send("Erreur lors de l'envoi du fichier PDF");
                } 
            });
        });

        doc.end();
      
     await project.findByIdAndUpdate({
            _id: req.params.id
        }, updateproject, { new: true });

    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur s'est produite lors de la génération du PDF");
    }
});

function drawTable(doc, table, options) {
    const startX = options.x;
    const startY = options.y;
    const columnCount = options.columnCount;
    const columnWidths = options.columnWidths;
    const rowHeight = options.rowHeight;
    const rowMarginTop = options.rowMarginTop;
    const borderWidth = options.borderWidth;

    table.headers.forEach((header, columnIndex) => {
        const positionX = startX + columnWidths.slice(0, columnIndex).reduce((a, b) => a + b, 0);
        const positionY = startY;

        doc.rect(positionX, positionY, columnWidths[columnIndex], rowHeight).fillAndStroke('#007FFF', 'black');

        doc.fillColor('white');
        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.text(header, positionX, positionY, {
            width: columnWidths[columnIndex],
            height: rowHeight,
            align: 'center',
            valign: 'center',
        });

        doc.fillColor('black');
    });

    doc.font('Helvetica');
    doc.fontSize(10);

    table.rows.forEach((row, rowIndex) => {
        const rowY = startY + (rowIndex + 1) * (rowHeight + rowMarginTop);

        row.forEach((cell, columnIndex) => {
            const positionX = startX + columnWidths.slice(0, columnIndex).reduce((a, b) => a + b, 0);
            const positionY = rowY;

            doc.rect(positionX, positionY, columnWidths[columnIndex], rowHeight).stroke();

            if (rowIndex === table.rows.length - 1 && columnIndex === table.headers.length - 1) {
                doc.fillColor('pink');
            } else {
                doc.fillColor('black');
            }

            doc.text(cell, positionX, positionY, {
                width: columnWidths[columnIndex],
                height: rowHeight,
                align: 'center',
                valign: 'center',
            });

            doc.fillColor('black');
        });
    });

    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    const tableHeight = (table.rows.length + 1) * (rowHeight + rowMarginTop);
    doc.rect(startX, startY, tableWidth, tableHeight).stroke();
}

const port = 3000;
app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
});