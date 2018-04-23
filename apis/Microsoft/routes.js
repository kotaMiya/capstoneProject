import { Router } from 'express';

import * as path from 'path';

const router = new Router();

router.get('/face', function(req, res) {
    console.log('microsoft');
    res.sendFile(path.join(__dirname + '/index.html'));
})

export default router;