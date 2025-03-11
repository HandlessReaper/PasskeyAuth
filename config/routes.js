const express = require('express');
const router = express.Router();

const pages = require('../app/controller/pages')
const auth = new (require('../app/controller/auth'))
const admin = new (require('../app/controller/admin'))

router.get('/', pages.welcome, admin.dashboard)

router.get('/register', auth.register)
router.get('/login', auth.login)

module.exports = router;
