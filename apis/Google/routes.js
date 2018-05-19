import { Router } from 'express';

import * as path from 'path';
var multer = require('multer');

var vision = require('@google-cloud/vision');

const storage =  multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const uploader = multer({ storage })


const router = new Router();

router.get('/vision/detection', function(req, res) {
    res.render('google.ejs', 
    {
        title : 'Google Vision',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})


router.post('/vision/detection', uploader.array('images', 10), function(req, res) {
    const files = req.files;
    var facesList = "";

    console.time('someFunction');

     for (var i = 0; i < files.length; i++) {
        const request = "./public/images/" + req.files[i].originalname;
        var name = req.files[i].originalname;
        console.log(name)
        client
        .faceDetection(request)
        .then(results => {
            const faces = results[0].faceAnnotations;
            var numFaces = faces.length;
            console.log('Found ' + numFaces + (numFaces === 1 ? ' face' : ' faces'));
            facesList += '<div style="margin-bottom:20px">Image Name: '+name+ 
                            '<p>confidence number: '+faces[0].detectionConfidence+ 
                            '</p><p>joyLikelihood: '+faces[0].joyLikelihood +
                            '</p><p>sorrowLikelihood: '+faces[0].sorrowLikelihood +
                            ' </p><p>angerLikelihood: '+faces[0].angerLikelihood +
                            ' </p><p>surpriseLikelihood: '+faces[0].surpriseLikelihood+ 
                            ' </p><p>underExposedLikelihood: '+faces[0].underExposedLikelihood + 
                            ' </p><p>blurredLikelihood: '+faces[0].blurredLikelihood+ 
                            ' </p><p>headwearLikelihood: '+faces[0].headwearLikelihood+ '</p><hr></div>'
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    }
    console.timeEnd('someFunction');

        
    setTimeout(() => {
        console.log(facesList)
        res.render('google.ejs', 
        {
            title : 'Google Vision',
            content: facesList,
            sourceImageList: "",
            targetImageList: ""
        });
    }, 5000);

})


var client = new vision.ImageAnnotatorClient();
function detectFaces(FileName,facesList) {
    // Make a call to the Vision API to detect the faces
    const request = "./public/images/" + FileName;
    client
      .faceDetection(request)
      .then(results => {
        const faces = results[0].faceAnnotations;
        var numFaces = faces.length;
        console.log('Found ' + numFaces + (numFaces === 1 ? ' face' : ' faces'));
        facesList.push(faces[0].detectionConfidence)
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }



export default router;