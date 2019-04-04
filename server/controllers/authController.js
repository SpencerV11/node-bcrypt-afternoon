let bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')
        const response = await db.get_user([username])
        const existingUser = response[0]

        if(existingUser) {
            return res.status(409).send('Username is already taken.')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const result = await db.register_user([isAdmin, username, hash])
        const user = result[0]

        req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username}
        res.status(201).send(req.session.user)
    },
    
    login: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body
        const response = await db.get_user([username])
        const user = response[0]

        if(!user) {
            res.status(401).send("User not found, try again.")
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated) {
            return res.status(403).send('Incorrect password, try again.')
        }

        req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username}
        res.status(200).send(req.session.user)
    },

    logout: (req, res) => {
        req.session.destroy()
        return res.status(200).send("Destroyed")
    }
}