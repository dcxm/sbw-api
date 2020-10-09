if (process.env.NODE_ENV != 'production') require('dotenv').config()
const {connect} = require('mongoose')

function dbConnect() {
        connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@main.bcm3w.mongodb.net/main?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        ).then(err => console.log('Mongo connected'))
}

module.exports = dbConnect