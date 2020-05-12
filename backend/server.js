var express = require('express');
var app = express();
var multer = require('multer');
var cors = require('cors');

app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const date = new Date();
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage }).array('file')

app.get('/', function (req, res) {
    return res.send('Hello Server')
})

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer error
            return res.status(500).json(err)
        } else if (err) {
            // Unknown error
            return res.status(500).json(err)
        }
        // No error
        return res.status(200).send(req.file)
    })
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, function () {
    console.log(`App running on port ${PORT}`)
});