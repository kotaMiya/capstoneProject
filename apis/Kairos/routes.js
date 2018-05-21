import { Router } from 'express';
import axios from 'axios';
import multer from 'multer';

import { 
    getImagePath,
    uploadImageForDetection, 
    uploadImageForRecognition,
    start,
    end,
    timeElapsed,
} from '../utils/controller';

import { KAIROS_APP_KEY, KAIROS_SECRET_KEY } from '../utils/apiKey';


const router = new Router();

const storage =  multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const uploader = multer({ storage })


axios.defaults.headers.common['app_id'] = KAIROS_APP_KEY;
axios.defaults.headers.common['app_key'] = KAIROS_SECRET_KEY;



router.get('/kairos/detection', function(req, res) {
    res.render('kairosDetection.ejs', 
    {
        title : 'Kairos',
        content: '',
        imageList: '',
    });
})

router.get('/kairos/recognition', function(req, res) {
    res.render('kairosRecognition.ejs', 
    {
        title : 'Kairos',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})



router.post('/kairos/detection', uploader.array('images', 10), function(req, res) {
    
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

        console.log('#1', imagePath);     
            
        let data = await uploadImageForDetection(imagePath);

        console.log(data);

        imageTagList = data[1];

        resolve(data[0]);  //  resolve them as one of array.
    })

    promise.then(async (data) => {
        console.log('#2', data);

        const result = await requestApiForImageId(data);

        console.log('#3', result);

        return result;
    })
    .then(async (result) => {
        
        const emotionResult = await requestApiForEmotion(result);
        console.log('#4', emotionResult);

        // stop timer
        var endTime = end();
        var runtime = timeElapsed(startTime, endTime);


        var resultTag = '';

    
        for (var i = 0; i < emotionResult.length; i++) {
            if (emotionResult[i][0] === undefined) {
                resultTag += '<p>Cannot detect the face</p>';
            } else {
                resultTag += '<p>';
                resultTag += imageName[i];
                resultTag += ', ' + emotionResult[i][0].demographics.gender;
                resultTag += ', ANGER: ' + emotionResult[i][0].average_emotion['anger'];
                resultTag += ', SADNESS: ' + emotionResult[i][0].average_emotion['sadness'];
                resultTag += ', FEAR: ' + emotionResult[i][0].average_emotion['fear'];
                resultTag += ', DISGUST: ' + emotionResult[i][0].average_emotion['disgust'];
                resultTag += ', JOY: ' + emotionResult[i][0].average_emotion['joy'];
                resultTag += ', SURPRISE: ' + emotionResult[i][0].average_emotion['surprise'];
                resultTag += '</p>';
                }
        }
        
    

        console.log('#5', imageTagList);
        
        resultTag += '<br><p>' + runtime + ' seconds</p>';

        res.render('kairosDetection.ejs', 
        {
            title : 'Kairos',
            content: resultTag,
            imageList: imageTagList,
        });
    })



    async function requestApiForImageId(imageUrl) {

        try {

            var imageIds = [];

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            for (var i = 0; i < imageUrl.length; i++) {
                let ENDPOINT = "http://api.kairos.com/v2/media?source=" + imageUrl[i];

                const result = await axios.post(ENDPOINT, axiosConfig);
                console.log('check', result.data.id);
                imageIds.push(result.data.id);
            }

            return imageIds;
            
        } catch(e) {
            console.log(e);
        }
    }   

    async function requestApiForEmotion(imageId) {

        try {
            var emotions = [];

            for (var i = 0; i < imageId.length; i++) {
                let ENDPOINT = 'https://api.kairos.com/v2/analytics/' + imageId[i];
    
                const emotionResult = await axios.get(ENDPOINT, {
                    headers: { 'Content-Type': 'application/json' }
                })
    
                console.log('emotion result', emotionResult.data.impressions);

                emotions.push(emotionResult.data.impressions);
            }
    
            return emotions;
        } catch(e) {
            console.log(e);
        }
    }
    
})


router.post('/kairos/recognition', uploader.array('images', 10), function(req, res) {

    const files = req.files;

    var sourceImageTagList = '';
    var targetImageTagList = '';

    // start timer;
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

        let resultEnroll = await requestApiForEnroll(sourceImageUrl);
        let resultRecognition = await requestApiForRecognition(targetImageUrl);

        console.log('#3', resultEnroll.images[0].transaction);
        console.log('#4', resultRecognition);

        return resultRecognition;

    })
    .then(async (result) => {

        // stop timer
        var endTime = end();
        var runtime = timeElapsed(startTime, endTime);


        var resultTag = '';

        for (var i = 0; i < result.length; i++) {
            resultTag += '<p>' + result[i] + '</p>';
        }

        console.log('#5', sourceImageTagList);
        console.log('#5', targetImageTagList);

        resultTag += '<br><p>' + runtime + ' seconds</p>';

        res.render('kairosRecognition.ejs', 
        {
            title : 'Kairos',
            content: resultTag,
            sourceImageList: sourceImageTagList,
            targetImageList: targetImageTagList
        });
    })


    
    const enroll_ENDPOINT = 'https://api.kairos.com/enroll';

    async function requestApiForEnroll(imageUrl) {
        try {

            const result = await axios.post(enroll_ENDPOINT, {
                image: imageUrl,
                subject_id: "Elizabeth",
                gallery_name: "MyGallery"
            })

            return result.data;

        } catch(e) {
            console.log(e);
        }
    }


    const recognition_ENDPOINT = 'https://api.kairos.com/recognize';
    
    async function requestApiForRecognition(imageUrl) {

        try {

            let result = [];

            for (var i = 0; i < imageUrl.length; i++) {
                const returnValue = await axios.post(recognition_ENDPOINT, {
                    image: imageUrl[i],
                    gallery_name: "MyGallery"
                })

                let valueArr = Object.keys(returnValue.data.images[0].transaction);
                

                if (valueArr.indexOf('confidence') >= 0) {
                    result.push(returnValue.data.images[0].transaction.confidence);
                } else {
                    result.push(returnValue.data.images[0].transaction.message);
                }
                
            }
        
        console.log(result);
         
        return result;
            
        } catch(e) {
            console.log(e);
        }
    }     
})


export default router;