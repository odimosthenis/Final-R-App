const {MongoClient, ObjectId} = require('mongodb')


let db;

module.exports = {
    connect: (cb)=>{
        MongoClient.connect('mongodb://localhost:27017/Research')
        .then(client=>{
            db = client.db();
            console.log('connected to db');
            return cb()
        }).catch(e=>{
            console.log(e)
            return cb(e)
        })
    },
    getDB: ()=>db
}