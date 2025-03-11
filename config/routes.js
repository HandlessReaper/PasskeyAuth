const express = require('express');
const router = express.Router();

const pages = require('../app/controller/pages')

router.get('/', pages.welcome)

module.exports = router;
