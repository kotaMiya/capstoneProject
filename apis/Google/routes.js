import { Router } from 'express';

import * as path from 'path';

const router = new Router();

router.get('/vision', function(req, res) {
    console.log('google');
    res.sendFile(path.join(__dirname + '/index.html'));
})

export default router;