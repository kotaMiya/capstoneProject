import { Router } from 'express';
import axios from 'axios';
import qs from 'qs';
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = new Router();



const storage =  multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const uploader = multer({ storage })


cloudinary.config({
    cloud_name: 'dyp8nhjhh',
    api_key: 'ACCESS_KEY_ID',
    api_secret: 'SECRET_ACCESS_KEY'
  });


router.get('/facePlusPlus/detection', function(req, res) {
    res.render('facePlusDetection.ejs', 
    {
        title : 'Face++',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})

router.get('/faceplusplus/recognition', function(req, res) {
    res.render('facePlusRecognition.ejs', 
    {
        title : 'Face++',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})



const API_KEY = 'ACCESS_KEY_ID';
const API_SECRET = 'SECRET_ACCESS_KEY';




router.post('/faceplusplus/detection', uploader.array('images', 10), function(req, res) {
    const files = req.files[0];
    console.log(files);

    let imageName = [];
    var sourceImageTagList = '';
    var result = '';


    for (var i = 0; i < req.files.length; i++) {
        imageName[i] = req.files[i].originalname;
        console.log(imageName[i]);
    }
    
    console.log('check', imageName);

    var path = files.path;


    cloudinary.uploader.upload(path, function(result) {
        var imagePath = result.url;

        console.log('image', imagePath);

        for (var i = 0; i < req.files.length; i++) {
            sourceImageTagList += '<img class="box" src="' + imagePath + '" height=230 width=200>';
        }


        const path_url = 'https://api-us.faceplusplus.com/facepp/v3/detect';
    
        axios.post(path_url, qs.stringify({
            api_key: API_KEY,
            api_secret: API_SECRET,
            image_url: imagePath,
            return_attributes: 'gender,emotion',
        }), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(data => {
       
            console.log(imageName);
            console.log(data.data.faces[0]);
            result = imageName;
            result += ', ' + data.data.faces[0].attributes.gender.value;
            result += ', SADNESS: ' + data.data.faces[0].attributes.emotion['sadness'];
            result += ', ANGER: ' + data.data.faces[0].attributes.emotion['anger'];
            result += ', HAPPINESS: ' + data.data.faces[0].attributes.emotion['happiness'];

            setTimeout(() => {
                res.render('facePlusDetection.ejs', 
                {
                    title : 'Face++',
                    content: result,
                    sourceImageList: sourceImageTagList,
                });
            }, 5000);
            
        })
        .catch(err => console.log(err))
    })  
})


router.post('/faceplusplus/recognition', uploader.array('images', 10), function(req, res) {

    const files = req.files;

    var sourceImageTagList = '';
    var targetImageTagList = '';

    const ENDPOINT = 'https://api-us.faceplusplus.com/facepp/v3/compare';


    let promise = new Promise(async (resolve, reject) => {
        var imagePath = getImagePath(files);

        var sourceImagePath = imagePath[0];
        var targetImagePath = imagePath[1];

        var sourceImageUrl = '';
        var targetImageUrl = [];

        console.log('#1 source', sourceImagePath);
        console.log('#1 target', targetImagePath);        
            
        let data = await uploadImage(imagePath);

        sourceImageUrl = data[0];
        targetImageUrl = data[1];    // this is an array

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

        var resultTag = '';
        for (var i = 0; i < result.length; i++) {
            resultTag += '<p>' + result[i].confidence + '%</p>';
            console.log('#4', result[i].confidence);
        }

        console.log('#5', sourceImageTagList);
        console.log('#5', targetImageTagList);

        res.render('FacePlusRecognition.ejs', 
        {
            title : 'Face++',
            content: resultTag,
            sourceImageList: sourceImageTagList,
            targetImageList: targetImageTagList
        });
    })

    
    // take out the path from POST request and return only image path.
    function getImagePath(imageFiles) {
        var path = [];

        for (var i = 0; i < imageFiles.length; i++) {
            path.push(imageFiles[i].path);
        }

        return path;
    }

    // upload image with cloudinary
    // takes an argument of array
    // return source image url and target image url, which is an array. 
    async function uploadImage(path) {
        var sourceImageUrl = '';
        var targetImageUrl = [];

        var counter = 0;

        for (var i = 0; i < path.length; i++) {
            await cloudinary.uploader.upload(path[i], function(result) {
                var imageUrl = result.url;
                
                if (i === 0) {
                    sourceImageUrl = imageUrl;
                    sourceImageTagList += '<img class="box" src="' + sourceImageUrl + '" height=230 width=200>';
                } else {
                    targetImageUrl.push(imageUrl);
                    targetImageTagList += '<img class="box" src="' + targetImageUrl[counter] + '" height=230 width=200>';
                    counter++;
                }

            })    
        }

        return [sourceImageUrl, targetImageUrl];
    }

    // post request to face++ api, and return the result 
    // takes 2 arguments, single source url, and array target url. 
    async function requestApi(sourceUrl, targetUrl) {
        try {
            var result = [];

            for (var i = 0; i < targetUrl.length; i++) {
                var { data } = await axios.post(ENDPOINT, qs.stringify({
                    api_key: API_KEY,
                    api_secret: API_SECRET,
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