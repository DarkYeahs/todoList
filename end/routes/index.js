const express = require('express');
const router = express.Router();
const service = require('../service')

/* GET home page. */
router.get('/', function(req, res, next) {
    es.render('index', { title: 'Express' });
});

router.get('/query', async function(req, res, next) {
    const data = await service.query()
    
    res.json({
        code: 0,
        data: data,
        time: +new Date()
    });
});

router.post('/insert', async (req, res, next) => {
    const body = req.body
    let content = body.content
    let deadline = +new Date(body.deadline)
    let update_time = +new Date()

    const data = await service.insert(content, deadline, update_time)

    
    res.json({
        code: 0,
        data: data
    });
})

router.post('/modify', async (req, res, next) => {
    const body = req.body
    const content = body.content
    const deadline = body.deadline && +new Date(body.deadline)
    const status = body.status
    const update_time = +new Date()
    const list_id = body.list_id
    const condition = {
        list_id
    }
    let params = {
        update_time
    }

    if (deadline) params.deadline = deadline
    if (status) params.status = status
    if (content) params.content = content

    const data = await service.modify(params, condition)
    
    res.json({
        code: 0,
        data: data
    });
})

module.exports = router;
