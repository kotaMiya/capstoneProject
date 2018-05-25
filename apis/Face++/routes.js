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

import { FACEPP_API_KEY, FACEPP_SECRET_KEY } from '../utils/apiKey';


const router = new Router();


const storage =  multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const uploader = multer({ storage })



router.get('/facePlusPlus/detection', function(req, res) {
    res.render('facePlusDetection.ejs', 
    {
        title : 'Face++',
        content: '',
        imageList: '',
    });
})

router.get('/facePlusPlus/recognition', function(req, res) {
    res.render('facePlusRecognition.ejs', 
    {
        title : 'Face++',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})



router.post('/facePlusPlus/detection', uploader.array('images', 10), function(req, res) {
    
    const files = req.files;
    
    var imageTagList = '';
    var imageName = [];


    for (var i = 0; i < files.length; i++) {
        imageName.push(files[i].originalname);
    }


    // start time meseauring
    var startTime = start();


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

        let result = await requestApi(imageUrl);

        console.log('#3', result);

        return result;
    }) 
    .then((result) => {
        console.log('#4', result);
        var resultTag = '';

        // stop timer
        var endTime = end();
        var runtime = timeElapsed(startTime, endTime);


        console.log(result[0].faces[0].attributes);

        for (var i = 0; i < result.length; i++) {
            resultTag += '<p>';
            resultTag += imageName[i];
            resultTag += ', ' + result[i].faces[0].attributes.gender.value;
            resultTag += ', SADNESS: ' + result[i].faces[0].attributes.emotion['sadness'];
            resultTag += ', ANGER: ' + result[i].faces[0].attributes.emotion['anger'];
            resultTag += ', HAPPINESS: ' + result[i].faces[0].attributes.emotion['happiness'];
            resultTag += '</p>';
        }

        resultTag += '<br><p>' + runtime + ' seconds</p>';
        

        res.render('facePlusDetection.ejs', 
        {
            title : 'Face++',
            content: resultTag,
            imageList: imageTagList,
        });
    })


    const ENDPOINT = 'https://api-us.faceplusplus.com/facepp/v3/detect';

    async function requestApi(imageUrl) {
        try {
            var result = [];

            

            for (var i = 0; i < imageUrl.length; i++) {
                let startTime = start();

                var { data } = await axios.post(ENDPOINT, qs.stringify({
                    api_key: FACEPP_API_KEY,
                    api_secret: FACEPP_SECRET_KEY,
                    image_url: imageUrl[i],
                    return_attributes: 'gender,emotion',
                }), {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });    

                let endTime = end();
                let runtime = timeElapsed(startTime, endTime);
                result.push(data)
            }
                
            return result;
            
        } catch(e) {
            console.log(e);
        }
    } 
    
})


router.post('/facePlusPlus/recognition', uploader.array('images', 10), function(req, res) {

    const files = req.files;

    var sourceImageTagList = '';
    var targetImageTagList = '';

    // start time meseauring
    var startTime = start();


    let promise = new Promise(async (resolve, reject) => {
        var imagePath = getImagePath(files);

        var sourceImagePath = imagePath[0];
        var targetImagePath = imagePath[1];

        var sourceImageUrl = '';
        var targetImageUrl = [];

        console.log('#1 source', sourceImagePath);
        console.log('#1 target', targetImagePath);        
            
        let data = await uploadImageForRecognition(imagePath);

        sourceImageUrl = data[0];
        targetImageUrl = data[1];    // this is an array
        sourceImageTagList = data[2];
        targetImageTagList = data[3];

        resolve([sourceImageUrl, targetImageUrl]);  //  resolve them as one of array.
    })

    promise.then(async (imagePath) => {

        var sourceImageUrl = imagePath[0];
        var targetImageUrl = imagePath[1];

        console.log('#2 source', sourceImageUrl);
        console.log('#2 target', targetImageUrl);

        let result = await requestApi(sourceImageUrl, targetImageUrl);

        console.log('#3', result);

        return result;
    })
    .then(async (result) => {

        // stop timer
        var endTime = end();
        var runtime = timeElapsed(startTime, endTime);

        var resultTag = '';
        for (var i = 0; i < result.length; i++) {
            resultTag += '<p>' + result[i].confidence + '%</p>';
            console.log('#4', result[i].confidence);
        }

        console.log('#5', sourceImageTagList);
        console.log('#5', targetImageTagList);

        resultTag += '<br><p>' + runtime + ' seconds</p>';

        res.render('FacePlusRecognition.ejs', 
        {
            title : 'Face++',
            content: resultTag,
            sourceImageList: sourceImageTagList,
            targetImageList: targetImageTagList
        });
    })


    const ENDPOINT = 'https://api-us.faceplusplus.com/facepp/v3/compare';

    // post request to face++ api, and return the result 
    // takes 2 arguments, single source url, and array target url. 
    async function requestApi(sourceUrl, targetUrl) {
        try {
            var result = [];

            for (var i = 0; i < targetUrl.length; i++) {
                var { data } = await axios.post(ENDPOINT, qs.stringify({
                    api_key: FACEPP_API_KEY,
                    api_secret: FACEPP_SECRET_KEY,
                    image_url1: sourceUrl,
                    image_url2: targetUrl[i],
                }), {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });    
                result.push(data)
            }
                
            return result;
            
        } catch(e) {
            console.log(e);
        }
    }   
})


export default router;