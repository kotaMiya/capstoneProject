import cloudinary, { image } from 'cloudinary';
import { CLOUDINARY_APP_KEY, CLOUDINARY_SECRET_KEY } from './apiKey';

cloudinary.config({
    cloud_name: 'dyp8nhjhh',
    api_key: CLOUDINARY_APP_KEY,
    api_secret: CLOUDINARY_SECRET_KEY
});

// take out the path from POST request and return only image path.
export function getImagePath(imageFiles) {
    var path = [];

    for (var i = 0; i < imageFiles.length; i++) {
        path.push(imageFiles[i].path);
    }

    return path;
}


export async function uploadImageForDetection(path) {
    var imageUrl = [];
    var imageTagList = '';

    var counter = 0;

    for (var i = 0; i < path.length; i++) {
        await cloudinary.uploader.upload(path[i], function(result) {
            imageUrl.push(result.url);
            imageTagList += '<img class="box" src="' + imageUrl[counter] + '" height=230 width=200>';            
            counter++;
        })    
    }

    return [imageUrl, imageTagList];
}


// upload image with cloudinary
// takes an argument of array
// return source image url and target image url, which is an array. 
export async function uploadImageForRecognition(path) {
    var sourceImageUrl = '';
    var targetImageUrl = [];

    var sourceImageTagList = '';
    var targetImageTagList = '';

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

    return [sourceImageUrl, targetImageUrl, sourceImageTagList, targetImageTagList];
}


// runtime 

export function start() {
    var startTime = new Date();
    return startTime;
};

export function end() {
    var endTime = new Date();
    return endTime;
}

export function timeElapsed(startTime, endTime) {
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    
    console.log(timeDiff + " seconds");
  
    return timeDiff;
}
