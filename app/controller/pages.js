class PagesController {
    welcome(req, res, next) {
        if(!req.user) {
            return res.render('welcome')
            next()
        }
    }
}

module.exports = new PagesController()
