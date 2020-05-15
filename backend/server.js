// Packages
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var sizeOf = require('image-size');
var jimp = require('jimp');
var { createWorker } = require('tesseract.js');

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
// var Image = require('./models/image.model');
// var uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
// var connection = mongoose.connection;
// connection.once('open', () => {
//     console.log("MongoDB database connection established successfully");
// })

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

        // Setting up crop parameters (See: Prototype Reference)
        var dimensions = sizeOf(`./uploads/${req.file.filename}`);
        // Width: champion/player name
        var crop_w = dimensions.width * 0.125521;
        // Height: champion and player name
        var crop_h = [];
        for (let i = 0; i < 10; i++) {
            crop_h.push(dimensions.height * 0.023148, dimensions.height * 0.020370);
        };
        // X: two rows of five champion and player name pairs
        var crop_x = [dimensions.width * 0.138021, dimensions.width * 0.138021];
        for (let i = 0; i < 4; i++) {
            crop_x.push(crop_x[crop_x.length - 1] + (dimensions.width * 0.150000),
                crop_x[crop_x.length - 1] + (dimensions.width * 0.150000));
        }
        for (let i = 0; i < 5; i++) {
            crop_x.push(crop_x[i * 2], crop_x[i * 2]);
        }
        // Y: one column of one champion and player name pairs
        var crop_y = [dimensions.height * 0.375926, dimensions.height * (0.375926 + 0.073148)];
        for (let i = 0; i < 4; i++) {
            crop_y.push(crop_y[0], crop_y[1]);
        }
        for (let i = 0; i < 5; i++) {
            crop_y.push(crop_y[0] + (dimensions.height * 0.499074), crop_y[1] + (dimensions.height * 0.499074));
        }

        // Process Image: Edit, crop, compose, and Tesseract.js the image
        async function processImage() {
            await editImage(`./uploads/${req.file.filename}`);

            for (let i = 0; i < crop_x.length; i++) {
                await cropImage('./uploads/processing/composite.png', i + 1, crop_x[i], crop_y[i], crop_w, crop_h[i]);
            };

            var height = 0;
            for (let i = 0; i < crop_x.length; i++) {
                await composeImage('./uploads/processing/composite.png', `./uploads/processing/crop ${i + 1}.png`, 0, height);
                height += crop_h[i];
            };

            await cropImage('./uploads/processing/composite.png', '', 0, 0, crop_w, (crop_h[0] * 10) + (crop_h[1] * 10));

            await recognizeImage('./uploads/processing/crop .png', raw);
        }

        processImage();

        res.send(raw);

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

// Image editing via Jimp
async function editImage(img) {
    const image = await jimp.read(img);
    image.greyscale().contrast(+0.15).normalize().invert();

    const processed = image.writeAsync('./uploads/processing/processed.png');
    const composite = image.writeAsync('./uploads/processing/composite.png');
    await processed;
    await composite;
    console.log('Image editing completed');
}

// Image cropping via Jimp
async function cropImage(img, i, x, y, w, h) {
    const image = await jimp.read(img);
    image.crop(x, y, w, h);

    await image.writeAsync(`./uploads/processing/crop ${i}.png`);
    console.log('Image cropping completed');
}

// Image composition via Jimp
async function composeImage(img1, img2, x, y) {
    const image1 = await jimp.read(img1);
    const image2 = await jimp.read(img2);
    image1.composite(image2, x, y);

    await image1.writeAsync(img1);
    console.log('Image composition completed');
}

// Tesseract.js image processing
async function recognizeImage(img, data) {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(img);
    data.push(text);
    console.log(text);

    await worker.terminate();
}

// Server start
app.listen(PORT, function () {
    console.log(`League Oracle running on port ${PORT}`)
});