const express = require('express');
const router = express.Router();
const media = require('../controllers/WEB/media.controller');

module.exports = () => {
    router.get('/test', media.getTest);
    router.post('/getMultimediaByGr', media.getMultimediaByGr);
    return router;
}