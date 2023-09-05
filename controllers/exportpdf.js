const PDFDocument = require('pdfkit');
const fs = require('fs');

app.get('/', (req, res) => {
    
    const doc = new PDFDocument();

  

    doc.image('./test.jpg', {
        fit: [150, 100],
        align: 'left',
        valign: 'top',
        marginTop: 0,
    });
    const logoWidth = 150;
    const logoHeight = 100;
    const startX = 50;
    const startY = 50;

    doc.image('./logo.jpg', {
        fit: [100, 100],
        align: 'right',
        valign: 'top',
        margin: { top: startY, right: startX },
    });

    doc.moveDown();
    doc.moveDown();

    doc.fontSize(30).fillColor('blue').text('Rapport de réserves', { align: 'center' });

    doc.image('./rapport.jpg', {
        fit: [500, 500],
        align: 'center',
        valign: 'top',
        marginTop: -6,
    });
    doc.fontSize(30).fillColor('#ADD8E6').text('Résidence étudiante saint mandé', { align: 'center' });
   


    
    doc.fontSize(15).fillColor('#000000').text('Phase(s) concernée(s): Global', { align: 'center' });
  

    doc.fontSize(15).fillColor('#000000').text('Nombre total de réserves: 17', { align: 'center' });
   

    doc.fontSize(15).fillColor('#000000').text('Filtres actifs:', { align: 'center' });
    doc.fontSize(15).fillColor('#000000').text('Entreprise CB MENUISERIE ', { align: 'center' });
    doc.fontSize(15).fillColor('#000000').text('Statut Réserve non levée, Réserve levée par Entreprise(Réserves non - refusées, Réserves refusées...)', { align: 'center' });
    doc.addPage()
    doc.image('./test.jpg', {
        fit: [150, 100],
        align: 'left',
        valign: 'top',
        marginTop: 0,
    });






    doc.image('./logo.jpg', {
        fit: [20, 20],
        align: 'right',
        valign: 'top',
        wrap: false,
    });

    doc.fontSize(30).fillColor('#ADD8E6').text('606', { align: 'center' });
    doc.fontSize(30).text('Bat - R+06 appartement-PV', { align: 'center' });
    doc.image('./plan1.jpg', {
        fit: [500, 500],
        align: 'left',
        valign: 'top',
        marginTop: 0,
    });
    doc.addPage()
    doc.image('./test.jpg', {
        fit: [150, 100],
        align: 'left',
        valign: 'top',
        marginTop: 0,
    });
 



    

    doc.image('./logo.jpg', {
        fit: [20, 20],
        align: 'right',
        valign: 'top',
        wrap: false,
    });


    doc.fontSize(30).fillColor('#ADD8E6').text('Généralités', { align: 'center' });
    


    const table = {
        headers: ['N°', 'N° Unique', 'Phase', 'Libellé', 'Date de constatation', 'A faire Avant', 'Priorité', 'Statut'],
        rows: [
            ['9', '1454', '6- Livraisons', 'Réglage porte fenetre', '13/07/2023', '05/08/2023', 'haute', 'Réserve non levée'],
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

    const stream = doc.pipe(fs.createWriteStream('tableau.pdf'));

  
    stream.on('finish', () => {
        // Envoie le fichier PDF en tant que réponse HTTP
        res.sendFile('tableau.pdf', { root: __dirname });
    });

   
    doc.end();
});

// Fonction pour dessiner le tableau avec bordure
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

        // Dessine le rectangle de fond bleu avec bordure
        doc.rect(positionX, positionY, columnWidths[columnIndex], rowHeight).fillAndStroke('#007FFF', 'black');

        doc.fillColor('white');
        doc.font('Helvetica-Bold');
        doc.fontSize(12);
        doc.text(header, positionX, positionY, {
            width: columnWidths[columnIndex],
            height: rowHeight,
            align: 'center', // Centrer le texte
            valign: 'center',
        });

        doc.fillColor('black');
    });

    // Dessine les lignes de données avec bordure
    doc.font('Helvetica');
    doc.fontSize(10);

    table.rows.forEach((row, rowIndex) => {
        const rowY = startY + (rowIndex + 1) * (rowHeight + rowMarginTop);

        row.forEach((cell, columnIndex) => {
            const positionX = startX + columnWidths.slice(0, columnIndex).reduce((a, b) => a + b, 0);
            const positionY = rowY;

            // Dessine le rectangle de cellule avec bordure
            doc.rect(positionX, positionY, columnWidths[columnIndex], rowHeight).stroke();

            if (rowIndex === table.rows.length - 1 && columnIndex === table.headers.length - 1) {
                doc.fillColor('pink'); // Changer la couleur en rose pour la dernière cellule
            } else {
                doc.fillColor('black');
            }

            doc.text(cell, positionX, positionY, {
                width: columnWidths[columnIndex],
                height: rowHeight,
                align: 'center',
                valign: 'center',
            });

            doc.fillColor('black'); // Rétablir la couleur du texte en noir
        });
    });

    // Dessine la bordure du tableau
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    const tableHeight = (table.rows.length + 1) * (rowHeight + rowMarginTop);
    doc.rect(startX, startY, tableWidth, tableHeight).stroke();
}
