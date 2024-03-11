const express = require('express');
const EntryCheque = require('../models/entryCheque');
const Entry = require('../models/entry');
const router = express.Router();

router.get('/byentryid/:id', async (req, res) => {
    const entrycheque = await EntryCheque.findAll({
        where: {entryId: req.params.id}, order:['id'],
        include:[
            {model:Entry,attributes:['status']}
        ],
    })

    res.send(entrycheque);
})

router.get('/', async (req, res) => {
    const entrycheque = await EntryCheque.findAll({
        order:[['chequeClearenceDate', 'DESC']],
        include:[
            {model:Entry,attributes:['purchaseInvoiceNo']}
          ], 
    })

    res.send(entrycheque);
})

module.exports = router;