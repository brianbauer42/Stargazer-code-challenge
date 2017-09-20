const fs = require('fs');
const fetch = require('node-fetch');
const app_id = 'c5728c99';
const app_key = '99a4cc6ccdd4bfc53b1db15d48a9ae00';  

module.exports = {
    imagePresentAndValid: function(req, res, next) {
        if (req.files && req.files.image) {
            next();
        } else {
            res.json({
                errorMessage: "Error! No image received!"
            });
            return ;
        }
    },

    imageToBase64: function(req, res, next) {
        fs.readFile(req.files.image.path, 'base64', function(err, result) {
            if (err) {
                console.log(err);
                res.json({
                    errorMessage: "Internal server error! Please try again."
                });
                return ;
            } else {
                req.b64 = result;
                next();
            }
            fs.unlink(req.files.image.path, function(err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file.");
                }
            });
        });
    },

    queryKairos: function(req, res, next) {
        const foundFaces = function(result) {
            if (result && result && result.images && result.images[0].faces && result.images[0].faces[0].attributes) {
                return true;
            }
            return false;
        };

        var kairosQueryConfig = {
            hostname: 'api.kairos.com',
            path: '/detect',
            protocol: 'https:',
            auth: null,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                app_id: 'c5728c99',
                app_key: '99a4cc6ccdd4bfc53b1db15d48a9ae00',
                'accept-encoding': 'gzip,deflate',
                connection: 'close',
                accept: '*/*',
                host: 'api.kairos.com'
            },
            body: JSON.stringify({
                image: req.b64
            })
        };

        fetch('https://api.kairos.com/detect', kairosQueryConfig)
            .then(result => {
                return result.json()
            }).then((result) => {
                if (foundFaces(result)) {
                    req.kairosResult = result.images[0].faces[0].attributes;
                    req.kairosResult.uploaded_image_url = result.uploaded_image_url;
                    next();
                } else {
                    res.json({
                        errorMessage: "No faces found!"
                    });
                    return ;
                }
            }).catch(function(err){
                console.log(err)
            });
        },
    
    //   The first half of the "craftResponse" function separates the relevant data returned
    //   by kairos and formats it in a way that makes it easy to work with.
    //
    //   example of response.detectedEthnicities:
    //
    //   [ { ethnicity: 'asian', amount: 0.011 },
    //     { ethnicity: 'black', amount: 0.00121 },
    //     { ethnicity: 'white', amount: 0.9593 },
    //     { ethnicity: 'hispanic', amount: 0.01939 },
    //     { ethnicity: 'other', amount: 0.0091 } ]
    
    craftResponse: function(req, res, next) {
        const possibleEthnicities = ['asian', 'black', 'white', 'hispanic', 'other'];
        var response = {};
        response.detectedEthnicities = [];
        response.predominant = 'none';
        response.minor = [];

        var copyAttribute = function(attribute) {
            response.detectedEthnicities.push({
                ethnicity: attribute,
                // Why does req.kairosResult become undefined when simultaneous requests are made?
                amount: req.kairosResult[attribute]
            });
        };

        possibleEthnicities.map((ethnicity) => {
            copyAttribute(ethnicity)            
        });

        response.detectedEthnicities.map((type) => {
            if (type.amount > .5) {
                response.predominant = type.ethnicity; 
            } else if (type.amount > .15) {
                response.minor.push(type.ethnicity);
            }
        });

        response.imageURL = req.kairosResult.uploaded_image_url;
        res.send(response);
    }
}