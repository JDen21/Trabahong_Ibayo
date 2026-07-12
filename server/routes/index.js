import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './trabahong-ibayo-firebase-adminsdk-fbsvc-ae611a9bcb.json' with { type: 'json' };


const app = initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore(app);


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // READ
  // const snapshot = await db.collection('users').get();
  // snapshot.forEach((doc) => {
  //   console.log(doc.id, '=>', doc.data());
  // });
});

module.exports = router;
