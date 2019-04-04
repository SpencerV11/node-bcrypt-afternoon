module.exports = {
    dragonTreasure: async (req, res) => {
        let db = req.app.get('db')
        let response = await db.get_dragon_treasure(1)
        return res.status(200).send(response)
    },

    getUserTreasure: async (req, res) => {
        let { id } = req.session.user
        let db = req.app.get('db')
        let response = await db.get_user_treasure(id)
        return res.status(200).send(response)
    },

    addMyTreasure: async (req, res) => {
        let { treasureURL } = req.body
        let { id } = req.session.user
        let db = req.app.get('db')
        let userTreasure = await db.add_user_treasure([treasureURL, id])
        let user = userTreasure[0]
        res.status(200).send(user)

    }
}