// Packages
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');

// Declarations
var app = express();
var PORT = 5000 || process.env.PORT;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
require('dotenv').config();

// Multer storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ' - ' + file.originalname)
    }
});
var upload = multer({ storage: storage }).single('file');

// MongoDB Atlas & Mongoose
var Image = require('./models/image.model');
var uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// GET: all previous queries (todo)
app.get('/', (req, res) => {
    return res.send('Hello');
});

// POST: upload image to Multer storage
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        var image = fs.readFileSync(req.file.path);
        var encode_image = image.toString('base64');
        var newImage = new Image({
            originalName: req.file.originalname,
            modifiedName: req.file.filename,
            type: req.file.mimetype,
            size: req.file.size,
            data: new Buffer.from(encode_image, 'base64')
        });

        newImage.save()
            .then(() => {
                console.log('Image added to the MongoDB database!');
                res.send('Image added to the MongoDB database!');
            })

        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
        })
    })
})

app.listen(PORT, function () {
    console.log(`App running on port ${PORT}`)
});