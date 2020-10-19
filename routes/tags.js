const router = require('express').Router()

const authorize = require('../middleware/authorize')

const Tag = require('../models/Tag')
const Item = require('../models/Item')
const Collection = require('../models/Collection')

const addRef = (model, id, ref) => model.updateOne({ _id: id }, { $push: { [ref.field]: ref.value } }).exec()

router.get('/', authorize, async (req, res) => {
    try {
        const tags = await Tag.find({ users: { $in: req.user._id } }).exec()
        res.status(200).json(tags)
    } catch (err) {
        if (err) return res.json({ error: { err } })
    }
})

router.post('/', authorize, async (req, res) => {
    console.log(req.body)
    try {
        new Tag({
            ...req.body,
            users: [req.user._id, ...req.body.users],
            items: [req.body.item && req.body.item],
            collections: [req.body.collection && req.body.collection]
        }).save(async (err, createdTag) => {
            if (err) return res.json(err)
            try {
                if (req.body.item) {
                    const addedRef = await addRef(Item, req.body.item, {
                        field: 'tags',
                        value: createdTag._id
                    })
                }
                if (req.body.collection) {
                    const addedRef = await addRef(Collection, req.body.collection, {
                        field: 'collections',
                        value: createdTag._id
                    })
                }
            } catch (err) {
                console.log(err)
                if (err) return res.json(err)
            }
            return res.status(200).json(createdTag)

        })
    } catch (err) {
        if (err) console.log(err)
    }
})

module.exports = router