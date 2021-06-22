const express = require('express');
const router = express.Router();

const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake.vfs;

router.post('/pdf', (req, res, next) => {
    //res.send('PDF');

    const nomePaciente = req.body.nomePaciente;
    const dataAtend = req.body.dataAtend;
   //const anamnese = req.body.anamnese;
    const recordatorio = req.body.recordatorio;
    const atividades = req.body.atividades;

    var documentDefinition = {
        content: [
            { text: `Anamnese Nutricional`, fontSize: 20, bold: true, alignment: 'center' },
            { text: `${nomePaciente}`, fontSize: 16, bold: true, alignment: 'center', lineHeight: 3 },
            { text: `Data: ${dataAtend}`, alignment: 'right', lineHeight: 2 },
            { text: `-Histórico clínico:`, lineHeight: 1, bold: true, fontSize: 13 },
            { text: `Possui alguma alergia?                   (    ) SIM - (    ) NÃO / Qual: __________________`, lineHeight: 1},
            { text: `Já fez alguma cirurgia?                   (    ) SIM - (    ) NÃO / Qual: __________________`, lineHeight: 1},
            { text: `Usa medicamentos controlados? (    ) SIM - (    ) NÃO / Qual: __________________`, lineHeight: 1},
            { text: `Tabagismo?                                      (    ) SIM - (    ) NÃO`, lineHeight: 1},
            { text: `Alcoolismo?                                      (    ) SIM - (    ) NÃO`, lineHeight: 3},
            { text: `-Histórico alimentar nutricional:`, bold: true, fontSize: 13, lineHeight: 1},
            { text: `Peso atual: _______ / Perda de peso recente? (    ) SIM - (    ) NÃO`, lineHeight: 1},
            { text: `Intolerância a algum alimento? ___________________________`, lineHeight: 1},
            { text: `Segue alguma dieta? ___________________________`, lineHeight: 1},
            { text: `Consumo de água? ___________________________`, lineHeight: 1},
            { text: `Refeições ao dia? ___________________________`, lineHeight: 3},
            { text: `Recordatório:`, fontSize: 13, bold: true, lineHeight: 1 },
            { text: `${recordatorio}`},
            { text: `-----------------------------------------------------------------------------------------------------------------------------------------------------------`},
            { text: `Atividades Físicas:`, fontSize: 13, bold: true, lineHeight: 1 },
            { text: `${atividades}`},
            { text: `-----------------------------------------------------------------------------------------------------------------------------------------------------------`, lineHeight: 8},
            { text: `Assinatura do(a) Nutricionista`, bold: true, fontSize: 13, lineHeight: 3, alignment: 'center'},
            { text: `____________________`, alignment: 'center'}

        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename="Prontuário de ${nomePaciente}.pdf"`
            });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });
});



module.exports = router;