const express = require('express');
const app = express();
const {MongoClient, ObjectId} = require('mongodb')
const {connect, getDB} = require('./connect')

let db;
let Records, Tags;
connect( (e)=>{
    if(!e){
        app.listen(3000,()=>console.log('Listening to 3000..'))
        db = getDB()
        Records = db.collection('Records')
        Tags = db.collection('Tags')
    } else console.log(e)
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('index',{title:"Home"})
})


app.get('/tags',(req,res)=>{
    Tags.findOne({_id:ObjectId('62510232cccd6d509317183e')})
    .then(tags=>{
        res.render('tags',{title:'tags', mytags:tags})
    }).catch(e=>console.log(e))
})

app.post('/tags',(req,res)=>{
    if (!req.body.list) req.body.list = ['test']
    Tags.updateOne({_id:ObjectId('62510232cccd6d509317183e')}, {$set : {list:req.body.list} })
    res.redirect('/tags')
})

app.get('/records',(req,res)=>{
    
    let records = [];
    Records.find().forEach(r => records.push(r))
    .then(()=>{
        res.render('records',{title:"Records", records:records, mytags:{list:[]}})
    }).catch(e=>console.log(e))

})

app.get('/records/add',(req,res)=>{
    let records=[];
    Promise.all([
        Records.find().forEach(r => records.push(r)),
        Tags.findOne({_id:ObjectId('62510232cccd6d509317183e')})
    ]).then( ([r,tags])=>{
        res.render('add',{title:"Records", records:records, mytags:tags})
    })
})

app.post('/records/add',(req,res)=>{
    if (!req.body.hasOwnProperty('tags')) {
        req.body.tags = [] 
    }
    Records.insertOne(req.body).then(r=>{
        console.log(req.body)
        res.redirect('/records')
    }).catch(e=>console.log(e))
    
})

app.patch('/records/:id', (req,res)=>{
    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({"error": "not valid id"})
    }
    const id = req.params.id;
    
    console.log(req.body)
    Records.updateOne({_id: ObjectId(id)}, { $set: req.body})
    .then(()=>{
        res.status(200).json({})
    }).catch(e=>res.status(500).json({error:'error'}))
        
})

app.delete('/records/:id',(req,res)=>{

    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({"error": "not valid id"})
    }

    const id = req.params.id;
    Records.deleteOne({_id: ObjectId(id)})
    .then(()=>{
        res.status(200).json({redirect:'/records'})
    }).catch(e=>res.status(500).json({error:'error'}))
    
})

app.get('/records/:id',(req,res)=>{
    const id = req.params.id
    Promise.all([
        Records.findOne({_id:ObjectId(id)}),
        Tags.findOne({_id:ObjectId('62510232cccd6d509317183e')})
    ]).then ( ([record, tags]) =>{
        res.render('details',{title:'record',mytags:tags,record:record})
    } ).catch(e=>{
        console.log(e);
        res.send('404')
    })

})

