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



const router = new Router();

const storage =  multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

const uploader = multer({ storage })



router.get('/msFace/detection', function(req, res) {
    res.render('microsoft.ejs', 
    {
        title : 'Microsoft Face',
        content: '',
        imageList: '',
    });
})

router.get('/msFace/recognition', function(req, res) {
    res.render('microsoftRecognition.ejs', 
    {
        title : 'Microsoft Face',
        content: '',
        sourceImageList: '',
        targetImageList: ''
    });
})



router.post('/msFace/detection', uploader.array('images', 10), function(req, res) {
    
    const files = req.files;

    res.render('microsoftDetection.ejs', 
    {
        title : 'Microsoft Face',
        content: resultTag,
        imageList: imageTagList,
    });

    
})


router.post('/kairos/recognition', uploader.array('images', 10), function(req, res) {

    const files = req.files;

    res.render('microsoftRecognition.ejs', 
    {
        title : 'Microsoft Face',
        content: resultTag,
        sourceImageList: sourceImageTagList,
        targetImageList: targetImageTagList
    });

})


export default router;