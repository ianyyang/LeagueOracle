// Packages
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var sizeOf = require('image-size');
var jimp = require('jimp');
var tesseract = require('tesseract.js');

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

// GET: specific query (todo)
app.get('/:id', (req, res) => {
    return res.send('Hello');
});

// POST: Process image then store image, image data, and Tesseract.js results in database
app.post('/upload', (req, res) => {
    // Upload to Multer storage
    upload(req, res, (err) => {
        // Setting up Tesseract.js data
        var raw = [];

        // Setting up crop parameters
        var dimensions = sizeOf(`./uploads/${req.file.filename}`);
        var crop_x = [dimensions.width * 0.133333];
        var crop_y = [dimensions.height * 0.364815, dimensions.height * 0.864815];
        var crop_w = dimensions.width * 0.133333;
        var crop_h = dimensions.height * 0.112963;
        for (let i = 0; i < 4; i++) {
            crop_x.push(crop_x[crop_x.length - 1] + (dimensions.width * 0.150000));

        }

        // Image pre-processing via Jimp
        jimp.read(`./uploads/${req.file.filename}`)
            .then((upload) => {
                upload
                    .greyscale()
                    .contrast(+1)
                    .normalize()
                    .invert()
                    .write(`./uploads/processing/processed ${req.file.filename}`);
            })
            .then(() => {
                for (let i = 0; i < crop_y.length; i++) {
                    for (let j = 0; j < crop_x.length; j++) {
                        jimp.read(`./uploads/processing/processed ${req.file.filename}`)
                            .then((upload) => {
                                upload
                                    .crop(crop_x[j], crop_y[i], crop_w, crop_h)
                                    .write(`./uploads/processing/crop ${5 * i + j} ${req.file.filename}`)
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                }
            })
            .then(() => {
                // Tesseract.js image processing
                tesseract.recognize(`./uploads/processing/crop 0 ${req.file.filename}`)
                    .then(({ data: { text } }) => {
                        raw.push(text)
                        console.log(raw)
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            })
            .catch((err) => {
                console.log(err);
            })

        // // Set up Mongoose image schema
        // var image = fs.readFileSync(req.file.path);
        // var encode_image = image.toString('base64');
        // var newImage = new Image({
        //     originalName: req.file.originalname,
        //     modifiedName: req.file.filename,
        //     type: req.file.mimetype,
        //     size: req.file.size,
        //     width: dimensions.width,
        //     height: dimensions.height,
        //     data: new Buffer.from(encode_image, 'base64')
        // });

        // // Save Mongoose image schema to database
        // newImage.save()
        //     .then(() => {
        //         res.send('Image added to the database');
        //     })
        //     .catch(err => {
        //         console.error(err);
        //     })
    })
})

// Server start
app.listen(PORT, function () {
    console.log(`League Oracle running on port ${PORT}`)
});