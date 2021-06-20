const express = require('express');
const router = express.Router();

const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake.vfs;

router.post('/pdf', (req, res, next) =>{
    //res.send('PDF');

    const dataAtend = req.body.dataAtend;
    const anamnese = req.body.anamnese;
    const recordatorio = req.body.recordatorio;
    const planoalimentar = req.body.planoalimentar;

    var documentDefinition = {
        content: [
            `Data de atendimento: ${dataAtend}`,
            `Anamnese: ${anamnese}`,
            `Recordatório: ${recordatorio}`,
            `Plano Alimentar: ${planoalimentar}`
        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data)=>{
        res.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename="filename.pdf"'
            });
            
            const download = Buffer.from(data.toString('utf-8'), 'base64');
            res.end(download);
    });
});



module.exports = router;