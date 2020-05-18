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
var fsExtra = require('fs-extra');

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
var Teams = require('./models/teams.model');
var uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// GET: all previous team queries
app.get('/teams', (req, res) => {
    Teams.find()
        .then(teams => res.json(teams))
        .catch(err => res.status(400).json('Error: ' + err));
});

// GET: specific team query
app.get('/teams/:id', (req, res) => {
    Teams.findById(req.params.id)
        .then(team => res.json(team))
        .catch(err => res.status(400).json('Error: ' + err));
});

// GET: all previous uploaded images
app.get('/images', (req, res) => {
    Image.find()
        .then(images => res.json(images))
        .catch(err => res.status(400).json('Error: ' + err));
});
// GET: specific uploaded image
app.get('/images/:id', (req, res) => {
    Image.findById(req.params.id)
        .then(image => res.json(image))
        .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Tesseract.js image results
app.post('/upload', (req, res) => {
    // Upload to Multer storage
    upload(req, res, (err) => {
        // Set up Tesseract.js data
        var raw = [];

        // Set up and store Mongoose image schema
        var dimensions = sizeOf(`./uploads/${req.file.filename}`);

        // Process Image: Edit, crop, compose, and Tesseract.js the image
        async function processImage() {
            // Setting up crop parameters (See: Prototype Reference)
            var crop_w = dimensions.width * 0.125521;
            var crop_h = [];
            for (let i = 0; i < 10; i++) { crop_h.push(dimensions.height * 0.023148, dimensions.height * 0.020370) };
            var crop_x = [dimensions.width * 0.138021, dimensions.width * 0.138021];
            for (let i = 0; i < 4; i++) { crop_x.push(crop_x[crop_x.length - 1] + (dimensions.width * 0.150000), crop_x[crop_x.length - 1] + (dimensions.width * 0.150000)); }
            for (let i = 0; i < 5; i++) { crop_x.push(crop_x[i * 2], crop_x[i * 2]); }
            var crop_y = [dimensions.height * 0.375926, dimensions.height * (0.375926 + 0.073148)];
            for (let i = 0; i < 4; i++) { crop_y.push(crop_y[0], crop_y[1]); }
            for (let i = 0; i < 5; i++) { crop_y.push(crop_y[0] + (dimensions.height * 0.499074), crop_y[1] + (dimensions.height * 0.499074)); }

            // Pre-process image
            await editImage(`./uploads/${req.file.filename}`);

            // Crop images to extract Tesseract.js inputs
            for (let i = 0; i < crop_x.length; i++) {
                await cropImage('./uploads/composite.png', i + 1, crop_x[i], crop_y[i], crop_w, crop_h[i]);
            };

            // Composite all images together
            var height = 0;
            for (let i = 0; i < crop_x.length; i++) {
                await composeImage('./uploads/composite.png', `./uploads/crop ${i + 1}.png`, 0, height);
                height += crop_h[i];
            };

            await cropImage('./uploads/composite.png', 'final', 0, 0, crop_w, (crop_h[0] * 10) + (crop_h[1] * 10))

            await recognizeImage('./uploads/crop final.png', raw);
        }

        processImage()
            // Save teams to database
            .then(() => {
                var data = raw[0].split('\n');
                var user = [];
                var opp = [];

                for (let i = 0; i < Math.floor(data.length / 4); i++) {
                    opp.push([data[i * 2], data[(i * 2) + 1]])
                    user.push([data[(i * 2) + 10], data[(i * 2) + 11]])
                }

                var newTeams = new Teams({
                    imgName: req.file.filename,
                    userTeam: user,
                    oppTeam: opp
                });

                newTeams.save()
                    .then(() => { console.log('Teams added to the database successfully'); })
                    .catch(err => {
                        console.error(err);
                    })
            })
            // Save image to database
            .then(() => {
                var image = fs.readFileSync('./uploads/crop final.png').toString('base64');
                var newImage = new Image({
                    originalName: req.file.originalname,
                    modifiedName: req.file.filename,
                    type: req.file.mimetype,
                    size: req.file.size,
                    width: dimensions.width,
                    height: dimensions.height,
                    data: new Buffer.from(image, 'base64')
                });

                newImage.save()
                    .then(() => { console.log('Image added to the database successfully'); })
                    .catch(err => {
                        console.error(err);
                    })
            })
            .finally(() => {
                // Reset Multer storage
                fsExtra.emptyDirSync('./uploads');
            })
            .catch(err => res.status(400).json('Error: ' + err));
    })

    // Image editing via Jimp
    async function editImage(img) {
        const image = await jimp.read(img);
        image.greyscale().contrast(+0.15).normalize().invert();

        const processed = image.writeAsync('./uploads/processed.png');
        const composite = image.writeAsync('./uploads/composite.png');
        await processed;
        await composite;
    }

    // Image cropping via Jimp
    async function cropImage(img, i, x, y, w, h) {
        const image = await jimp.read(img);
        image.crop(x, y, w, h);

        await image.writeAsync(`./uploads/crop ${i}.png`);
    }

    // Image composition via Jimp
    async function composeImage(img1, img2, x, y) {
        const image1 = await jimp.read(img1);
        const image2 = await jimp.read(img2);
        image1.composite(image2, x, y);

        await image1.writeAsync(img1);
    }

    // Tesseract.js image processing
    async function recognizeImage(img, raw) {
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const { data: { text } } = await worker.recognize(img);
        raw.push(text);

        await worker.terminate();
        console.log('Tesseract.js image processing completed');
    }
})

// Server start
app.listen(PORT, function () {
    console.log(`League Oracle running on port ${PORT}`)
});