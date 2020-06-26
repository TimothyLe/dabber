const express = require('express');
const cors = require('cors');
const monk = require('monk');
const mongodb = require('mongodb');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();
const monkdb = monk(process.env.MONGO_URI || 'localhost/dabber'); // collections noSQL
const filter = new Filter();

const dabs = monkdb.get('dabs'); // collection

// middleware: incoming requests will have CORS header
// if accessing another server, do something else
app.use(cors());
// middleware to parse json
app.use(express.json());

// app makes a GET request to '/'
app.get('/', (req,res) => {
    res.json({
        message: '🐥 Dab on em! 🐤'
    });
});

// when app gets requests, query the database
app.get('/dabs', (req,res)=>{
    dabs
        .find()
        .then(dabs => {
            res.json(dabs);
        });
    // // access MongoDB server
    // const MongoClient = mongodb.MongoClient;
    // const url = 'mongodb://localhost:27017/local';
    // MongoClient.connect(url, function(err, db) {
    //     if(err){
    //         console.log('Unable to connect to server',err);
    //     } else {
    //         console.log("Connection established");
    //         var collection = db.collection('dabs');
    //         collection.find({}).toArray(function(err, result){
    //             if(err){
    //                 res.send(err);
    //             } else if (result.length){
    //                 res.render('dabs', {
    //                     "dabs" : result
    //                 });
    //             } else {
    //                 res.send('No documents found');
    //             }

    //             db.close()
    //         });
    //     }
    // });
});

// function to validate data
function isValidDab(dab){
    return dab.name && dab.name.toString().trim() !== '' &&
    dab.content && dab.content.toString().trim() !== '';
}

// middleware to limit repeated requests
app.use(rateLimit({
    windowMs : 30 * 1000, // 30 sec
    max: 1 // limit each IP to 1 requests/windowMs
}));

const createDab = (req,res,next) => {
    // validate submissions
    if (isValidDab(req.body)) {
        // express-validator does this too
        const dab = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        
        // insert to db then respond with dab
        dabs
            .insert(dab)
            .then(createdDab => {
                res.json(createdDab);
            }).catch(next);
    } 
    else {
        res.status(422);
        res.json({
            message: 'You Must Enter A Name and Content!'
        });
    }
};

app.post('/dabs', createDab);

// launch on local port
app.listen(5000, () => {
    // configure package.json for npm start
    console.log('Listening on http://localhost:5000');
});

//mongo "mongodb+srv://dapp-14wf2.mongodb.net/test"  --username whipcrm