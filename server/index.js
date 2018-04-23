import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import { amazonRoutes } from '../apis/Amazon';
import { googleRoutes } from '../apis/Google';
import { microsoftRoutes } from '../apis/Microsoft';
import * as path from 'path';


const app = express();

const PORT = process.env.PORT || 3000;


var ejs = require('ejs');

app.engine('ejs',ejs.renderFile);
app.use(bodyParser.urlencoded({ 
    extended: false,
    limit: '1024mb' 
}));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', [amazonRoutes, googleRoutes, microsoftRoutes]);


// draw home screen 
app.get('/', function(req, res){
    res.render('home.ejs', 
    {title : 'Home'});
});


app.listen(PORT, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`App listening to port: ${PORT}`);
    }
})