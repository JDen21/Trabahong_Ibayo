import fs from 'fs'
import { parse } from 'node-html-parser';

for (let idx = 1; idx <=32; idx++ ) {
    fetch(`https://dmwjobs.ph/jobs-list/page/${idx}`)
        .then(response => {
            return response.text()
        })
        .then(res => {
            const htmlRoot = parse(res);
            const jobs = htmlRoot.querySelectorAll('.row')[2]
            const jobsStr = jobs.toString();
            if (jobsStr.includes('Spain') || jobsStr.includes('spain') || jobsStr.includes('spn')) {
                fs.writeFile(`./raw${idx}.html`, jobsStr, () => {
                    idx+=1;
                });
            }
    })    
}

