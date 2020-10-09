const router = require('express').Router()

const authorize = require('../middleware/authorize')

const sortQuery = require('../lib/queryCheck')

const Item = require('../models/Item')
const User = require('../models/User')

router.get('/', authorize, async (req, res) => {
    console.log(req.query)
    const sortableFields = ['title', 'completed', 'createdAt', 'updatedAt']
    const defaultField = 'createdAt'
    try {
        const items = await Item.find({ users: { $in: [req.user._id] } })
            .sort(sortQuery(req, sortableFields, defaultField, 'desc'))
            .exec()
        res.status(200).json(items)
    } catch (err) {
        if (err) res.json({ error: { err } })
    }
})

router.get('/:id', authorize, async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, users: { $in: req.user._id } }).exec()
        if (!item) return res.status(404).json({ error: 'Item not found' })
        res.status(200).json(item)
    } catch (err) {
        if (err) return res.json({ error: 'Item not found', errorDetails: err })
    }
})

router.post('/', authorize, (req, res) => {
    console.log('reqUser', req.user)
    new Item({
        title: req.body.title,
        summary: req.body.summary,
        content: `<h1>${req.title}</h1>`,
        users: [req.user._id, ...req.body.users]
    }).save((err, createdItem) => {
        if (err) return res.json(err)
        User.findOneAndUpdate({ _id: req.user._id }, {
            $push: { items: createdItem._id }
        }, { new: true }, (err, updatedUser) => console.log(updatedUser))
        res.json(createdItem)
    })
})

router.patch('/:id', authorize, async (req, res) => {
    try {
        const updatedItem = await Item.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true}).exec()
        if (!updatedItem) return res.status(404).json({error: 'Cannot find item to update'})
        return res.status(200).json(updatedItem)
    } catch (err) {
        if (err) return res.json({error: 'Cannot update item, please try again', errorDetails: err})
    }
})

router.delete('/:id', authorize, async (req, res) => {
    try {
        const deletedItem = await Item.findOne({ _id: req.params.id, users: { $in: req.user._id } }).exec()
        const { deletedCount } = await Item.deleteOne({ _id: req.params.id, users: { $in: req.user._id } }).exec()

        if (!deletedItem) return res.status(404).json({ error: 'Can\'t find the item' })
        if (deletedCount === 0) return res.status(500).json({ error: 'Not deleted' })
        await User.updateOne({ _id: req.user._id }, { $pull: { items: deletedItem._id } }).exec()
        return res.json(deletedItem)
    } catch (err) {
        if (err) return res.json({ error: 'Cannot delete item', errorDetails: err })
    }
})

module.exports = router