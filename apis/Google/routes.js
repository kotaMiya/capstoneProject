import { Router } from 'express';
import axios from 'axios';
import qs from 'qs';
import multer from 'multer';


import { 
    getImagePath,
    uploadImageForDetection, 
    uploadImageForRecognition,
    start,
    end,
    timeElapsed,
} from '../utils/controller';
import { Number } from 'core-js';

import { GOOGLE_APP_KEY } from '../utils/apiKey';
import { GoogleAuth } from 'google-auth-library';


const storage =  multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const uploader = multer({ storage })


const router = new Router();

router.get('/vision/detection', function(req, res) {
    res.render('googleVision.ejs', 
    {
        title : 'Google Vision',
        content: '',
        imageList: '',
    });
})


router.post('/vision/detection', uploader.array('images', 10), function(req, res) {
    const files = req.files;

    var imageTagList = '';
    var imageName = [];

    const RapidAPI = require('rapidapi-connect');
    const rapid = new RapidAPI("default-application_59b2bf13e4b07e6c5c5a69dc", "e796b8fe-7d87-4a8d-abc6-860bd36c682a");


    for (var i = 0; i < files.length; i++) {
        imageName.push(files[i].originalname);
    }

    let promise = new Promise(async (resolve, reject) => {
        var imagePath = getImagePath(files);

        var imageUrl = [];

        console.log('#1', imagePath);
      
            
        let data = await uploadImageForDetection(imagePath);

        console.log('#2', data);

        imageUrl = data[0];    // this is an array
        imageTagList = data[1]

        resolve(imageUrl);  //  resolve them as one of array.
    })
    .then(async (imageUrl) => {

        console.log(imageUrl);

        let num = 0;

        let result = '';
        
    
        rapid.call('GoogleCloudVision', 'detectFaces', { 
            'image': imageUrl[num],
            'maxResults': '4',
            'apiKey': GOOGLE_APP_KEY
    
        }).on('success', (payload)=>{
            
            console.log('#3', payload[0].responses[0].faceAnnotations);
            result += imageName[0] + '<br>';
            result += 'detectionConfidence: ';
            result += payload[0].responses[0].faceAnnotations[0].detectionConfidence + '<br>';
            result += 'joyLikelihood: ';
            result += payload[0].responses[0].faceAnnotations[0].joyLikelihood + '<br>';
            result += 'sorrowLikelihood: ';
            result += payload[0].responses[0].faceAnnotations[0].sorrowLikelihood + '<br>';
            result += 'angerLikelihood: ';
            result += payload[0].responses[0].faceAnnotations[0].angerLikelihood + '<br>';
            result += 'surpriseLikelihood: ';
            result += payload[0].responses[0].faceAnnotations[0].surpriseLikelihood + '<br>';
        
            if (num == imageName.length - 1) {
                res.render('googleVision.ejs', 
                    {
                        title : 'Google Vision',
                        content: result,
                        imageList: imageTagList,
                    });
            }

            num += 1;
        
        }).on('error', (payload)=>{
    
        });

    }) 

})


export default router;