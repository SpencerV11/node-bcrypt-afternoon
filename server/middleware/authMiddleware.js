module.exports = {
    usersOnly: (req, res, next) => {
        if(!req.session.user) {
            res.status(401).send("Please log in first.")
        }
        next()
    }
}