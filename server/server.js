const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer')
const serviceAccount = require('./google_service.json');
const app = express();
const port = 9001;
const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images/');
//       },
//       filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//       },
// })
const upload = multer();

// app.use(upload.array());
app.use(express.json());
app.use(express.static('images'))

// initialize firebase admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// setup sqlite3 database if not exists
console.log("Setting up database")
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite3');
// create table if not exists
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, type TEXT, image TEXT, mileleage TEXT, lat REAL , lng REAL , datetime TEXT)');
});

// Define your routes here
app.get('/', (req, res) => {

    res.send('Hello, World!');
});


app.get('/history', (req, res) => {
    // validate request , token from request header
    let token = req.headers['authorization'];
    if(!token){
        console.log("No token found")
        res.status(401).send('Unauthorized');
        return;
    }else{
        // verify token
        admin.auth().verifyIdToken(token.split(" ")[1]).then((decodedToken) => {
            let uid = decodedToken.uid;
            // get top 20 history
            db.all('SELECT type , datetime FROM history WHERE user_id = ? ORDER BY datetime DESC LIMIT 20', [uid], (err, rows) => {
                if(err){
                    console.log(`Error: ${err}`)
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log("Successfully fetched history")
                res.send(rows.map(row => ({"type": row.type , "timestamp": row.datetime})));
            });
        }).catch((error) => {
            console.log("Token invalid")
            res.status(401).send('Unauthorized');
        });
    }
});

app.post('/meterin'  , upload.single("file") ,  (req , res) => {
    // validate request 
    let token = req.headers['authorization'];
    if(!token){
        console.log("No token found")
        res.status(401).send('Unauthorized');
        return;
    }else{
        // verify token using firebase admin
        token = token.split(" ")?.[1]
        admin.auth().verifyIdToken(token).then((decodedToken) => {
            let uid = decodedToken.uid;
            let {  mileleage , lat , lng , type , datetime } = req.body;

            if(!req.file || !mileleage || !lat || !lng || !type || !datetime){
                console.log(`invalid request: ${mileleage} | ${lat} | ${lng} | ${type} | ${datetime} | ${req?.file?.originalname}`)
                res.status(400).send('Bad Request');
                return;
            }

            // prepare file 
            let file = req.file;
            let filename = `${uid}_${new Date().getTime()}.${file.originalname.split('.').pop()}`;
            let buffer = file.buffer;
            
            // insert new history
            db.run('INSERT INTO history (user_id , type , image , mileleage , lat , lng , datetime) VALUES (? , ? , ? , ? , ? , ? , ?)', [uid , type , filename , mileleage , lat , lng , datetime], (err) => {
                if(err){
                    console.log(`Error: ${err}`)
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log("Successfully inserted history. Saving images to disk")
                // save image to disk from buffer
                require('fs').writeFileSync(`images/${filename}`, buffer);
                res.send('OK');
            });
        }).catch((error) => {
            console.log(`Token invalid: ${error}`)
            res.status(401).send('Unauthorized');
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});