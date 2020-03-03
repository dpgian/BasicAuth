
const mongoose = require('mongoose')

const MONGOURI = 'mongodb+srv://dbUser:dbUserPass@basic-auth-cluster-eotia.mongodb.net/test?retryWrites=true&w=majority'

const startMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true  
        })
        console.log('Mongoose connection enstablished.')
    } catch (e) {
        console.log(`Mongoose connection error: ${e}`)
        throw e
    }
}

module.exports = startMongoServer