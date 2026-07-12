/**
 * Crawl DMW Jobs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './trabahong-ibayo-firebase-adminsdk-fbsvc-ae611a9bcb.json' with { type: 'json' };

import { parse } from 'node-html-parser';

const app = initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore(app);

// const docRef = db.collection('dmwJobs').doc('dmwJobs1');

async function insertToDb(dataList) {
    const batch = db.batch();

    dataList.forEach((data) => {
        const docRef = db.collection('dmwJobs').doc(); // Automatically generate unique ID
        batch.set(docRef, data);
    });

    return await batch.commit();
}


const promises = [];
// const dmwJobPages = 32;
const initialDmwJobPages = 301;
const dmwJobPages = 423;
for (let idx = initialDmwJobPages; idx <= dmwJobPages; idx++) {
    promises.push(fetch(`https://dmwjobs.ph/jobs-list/page/${idx}`));
}


Promise.allSettled(promises)
    .then(responses => {
        const pages = [];
        for (const response of responses) {
            if (response.status === 'fulfilled') {
                pages.push(response.value);
            }
        }
        return Promise.all(pages.map(page => page.text()));
    })
    .then(pages => {
        const rawJobs = [];
        for (let i = 0; i < pages.length; i++) {
            const root = parse(pages[i]);
            let jobsPage = root.querySelectorAll('body > section.mt-100 > div > div.row > div > div:nth-child(2) > div');
            jobsPage && rawJobs.push(...jobsPage);
        }
        return rawJobs;
    })
    .then(rawJobs => {
        const jobs = [];

        for (let i = 0; i < rawJobs.length; i++) {
            const job = {};

            job.category = rawJobs[i].querySelector('.pxp-jobs-card-1-category-label')?.text?.trim() ?? 'No Category Found.';
            job.title = rawJobs[i].querySelector('.pxp-jobs-card-1-title')?.text?.trim() ?? 'No Title Found.';
            job.location = rawJobs[i].querySelector('.pxp-jobs-card-1-location')?.text?.trim() ?? 'No Location Found.';
            job.datePosted = rawJobs[i].querySelector('.pxp-jobs-card-1-date, .pxp-text-light')?.text?.replace('by', '')?.trim() ?? 'No Date Found.';
            job.poster = rawJobs[i].querySelector('.pxp-jobs-card-1-company, .mt-1')?.text?.trim() ?? 'No Poster Found.';
            jobs.push(job);
        }

        insertToDb(jobs);
    });


