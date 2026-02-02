import fs from 'fs'
import { parse } from 'node-html-parser';

const promises = [];
const dmwJobPages = 32;
// const dmwJobPages = 3;
for (let idx = 1; idx <=dmwJobPages; idx++ ) {
    promises.push(fetch(`https://dmwjobs.ph/jobs-list/page/${idx}`));  
}

Promise.allSettled(promises)
    .then(responses => {
        const pages = [];
        for (const response of responses) {
            pages.push(response.value);
        }
        return Promise.all(pages.map(page => page.text()));
    })
    .then(pages => {
        const rawJobs = [];
        for (let i = 0; i <pages.length; i++) {
            const root = parse(pages[i]);
            let jobsPage = root.querySelectorAll('.row')[2];
            jobsPage = jobsPage.querySelector('.col>.row');
            jobsPage = jobsPage.querySelectorAll('.col-md-6, .col-xl-4, .col-xxl-3, .pxp-jobs-card-1-container');
            jobsPage && rawJobs.push(...jobsPage);
        }

        return rawJobs;
    })
    .then(rawJobs => {
        const jobs = [];
        
        for (let i = 0; i < rawJobs.length; i++) {
            const job = {};

            job.category = rawJobs[i].querySelector('.pxp-jobs-card-1-category-label')?.text?.trim() ?? 'No Category Found.';
            job.title = rawJobs[i].querySelector('.pxp-jobs-card-1-title').text.trim();
            job.location = rawJobs[i].querySelector('.pxp-jobs-card-1-location')?.text?.trim();
            job.datePosted = rawJobs[i].querySelector('.pxp-jobs-card-1-date, .pxp-text-light').text.replace('by', '').trim();
            job.poster = rawJobs[i].querySelector('.pxp-jobs-card-1-company, .mt-1').text.trim();
            jobs.push(job);
        }
        fs.writeFile('./raw/jobs.json', JSON.stringify(jobs), ()=> {console.log('done.')});
    });