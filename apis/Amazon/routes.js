import { Router } from 'express';
import AWS from 'aws-sdk';
var multer = require('multer');
var s3 = require('s3');

AWS.config.update({region:'us-east-1'});
var rekognition = new AWS.Rekognition();

import * as path from 'path';
import { Number } from 'core-js';

const router = new Router();



const storage =  multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const uploader = multer({ storage })


var client = s3.createClient({
    maxAsyncS3: 20,      
    s3RetryCount: 3,      
    s3RetryDelay: 1000, 
    multipartUploadThreshold: 20971520,  
    multipartUploadSize: 15728640, 
    s3Options: {
      accessKeyId: "AWS_ACCESS_KEY_ID", 
      secretAccessKey: "AWS_SECRET_ACCESS_KEY",  
    },
});


router.get('/rekognition/detection', function(req, res) {
    res.render('amazonDetection.ejs', 
    {
        title : 'Amazon Rekognition',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})

router.get('/rekognition/recognition', function(req, res) {
    res.render('amazonRecognition.ejs', 
    {
        title : 'Amazon Rekognition',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})




router.post('/rekognition', uploader.array('images', 10),  function(req, res, next) {
    const RapidAPI = require('rapidapi-connect');
    const rapid = new RapidAPI("default-application_59b2bf13e4b07e6c5c5a69dc", "e796b8fe-7d87-4a8d-abc6-860bd36c682a");

    // console.log(req.files);
    const files = req.files;
    const meta = req.body;

    var imageName = [];


   
    for (var i = 0; i < files.length; i++) {
        imageName[i] = req.files[i].originalname;
        console.log(imageName[i]);

        var params = {
            localFile: "./public/images/" + imageName[i], 
            s3Params: {
              Bucket: "hello-garden",  
              Key: imageName[i], 
            },
        };

        var uploader = client.uploadFile(params);
      
        uploader.on('error', function(err) {
            console.error("unable to upload:", err.stack);
        });
        uploader.on('progress', function() {
            console.log("uploading...");
        });
        uploader.on('end', function() {
            console.log("done uploading");  
        });
    }
    

    console.log('middle', imageName);

    var sourceImageTagList = '';
    var targetImageTagList = '';
    var result = '';

    

    for (var i = 0; i < files.length; i++) {
        sourceImageTagList += '<img class="box" src="https://s3.amazonaws.com/hello-garden/' + imageName[i] + '" height=230 width=200>';
    }

    setTimeout(() => {
        console.log('#2');
        console.log(imageName[0]);

        for (var i = 0; i < imageName.length; i++) {
            var num = 0;

            var num = 0;
    
            var params = {
                Image: {
                    S3Object: {
                        Bucket: "hello-garden", 
                        Name: imageName[i]
                    }
                },
                Attributes: [
                    "ALL",
                ]
            };
            var detecting = new Promise(function(resolve, reject) {
                rekognition.detectFaces(params, function(err, data) {
                    if (err) {
                        console.log(err, err.stack); 
                    } else {
                        console.log('ok passed', imageName[num]);
                        console.log(data.FaceDetails[0].Emotions);
                        result += '<p>' + imageName[num] + ', ' +
                                data.FaceDetails[0].Gender.Value + ', ' +
                                data.FaceDetails[0].Emotions[0].Type + ': ' +
                                data.FaceDetails[0].Emotions[0].Confidence.toFixed(2) + ', ' +
                                data.FaceDetails[0].Emotions[1].Type + ': ' + 
                                data.FaceDetails[0].Emotions[1].Confidence.toFixed(2) + ', ' + ', ' + 
                                data.FaceDetails[0].Emotions[2].Type + ': ' +  
                                data.FaceDetails[0].Emotions[0].Confidence.toFixed(2)  + '</p>';
                        num += 1;
                    }
                })
            })
        }  
    }, 1000);


    // 

    setTimeout(() => {
        res.render('amazonDetection.ejs', 
        {
            title : 'Amazon Rekognition',
            content: result,
            sourceImageList: sourceImageTagList,
            targetImageList: targetImageTagList
        });
    }, 5000);
    

  
    // res.end(JSON.stringify(req.body));
    
})


export default router;