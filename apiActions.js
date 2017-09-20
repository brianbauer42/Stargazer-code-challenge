const fs = require('fs');
const Kairos = require('kairos-api');
var client = new Kairos('c5728c99', '99a4cc6ccdd4bfc53b1db15d48a9ae00');

module.exports = {
    imagePresentAndValid: function(req, res, next) {
        if (req.files && req.files.image) {
            next();
        }
    },

    imageToBase64: function(req, res, next) {
        fs.readFile(req.files.image.path, 'base64', function(err, result) {
            if (err) {
                console.log(err);
            } else {
                req.b64 = result;            
            }
            fs.unlink(req.files.image.path);
            next();
        });
    },

    queryKairos: function(req, res, next) {
        const foundFaces = function(result) {
            if (result && result.body && result.body.images && result.body.images[0].faces && result.body.images[0].faces[0].attributes) {
                return true;
            }
            return false;
        };

        client.detect({
            image: req.b64
        }).then(function(result) {
            if (foundFaces(result)) {
                req.kairosResult = result;
                next();
            } else {
                res.json({
                    errorMessage: "No faces found!"
                });
            }
        }).catch(function(err) {
            console.log("ERROR", err);
        })
        // POST /detect HTTP/1.1
        // Content-Type: application/json

        // {
        //     "image":" http://media.kairos.com/kairos-elizabeth.jpg ",
        //     "selector":"ROLL"
        // }
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
                amount: req.kairosResult.body.images[0].faces[0].attributes[attribute] });
        };

        possibleEthnicities.map(function(ethnicity) {
            copyAttribute(ethnicity)            
        });

        response.detectedEthnicities.map(function(type) {
            if (type.amount > .5) {
                response.predominant = type.ethnicity; 
            } else if (type.amount > .15) {
                response.minor.push(type.ethnicity);
            }
        });

        response.imageURL = req.kairosResult.body.uploaded_image_url;
        res.send(response);
    }
}