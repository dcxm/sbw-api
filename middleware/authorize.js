module.exports = function authorize(req, res, next) {
    if (req.user) {
        next()
    }   else {
        return res.status(403).json({error: 'Not authorized'})
    }
}