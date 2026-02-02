import { useState } from 'react'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Calendar } from './components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import jobs from './assets/jobs.json' with { type: 'json' };
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

import './App.css'

function App() {
  const [open, setOpen] = useState(false)
  const [jobDate, setJobDate] = useState<Date | undefined>(undefined)
  const [jobTitle, setJobTitle] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobAgency, setJobAgency] = useState('');

  return (
    <>
      <h3 className="mx-7 pb-6 text-3xl font-semibold tracking-tight first:mt-5">
        Trabahong Ibayo
      </h3>
      <h3 className="text-center pb-6 text-2xl font-semibold tracking-tight first:mt-5">
        Updated: Feb. 02, 2026
      </h3>
      <h4 className="text-center pb-3 text-2xl font-semibold tracking-tight first:mt-5">
        This jobs are crawled from the following sites:
      </h4>
      <p className="text-center pb-12 text-1xl tracking-tight first:mt-5">
        <a href='https://dmwjobs.ph/' target='_blank'>dmwjobs.ph</a>
      </p>
      <div className='flex flex-col items-center gap-3'>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input placeholder='Job' value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
          <Input placeholder='location' value={jobLoc} onChange={e => setJobLoc(e.target.value)} />
        </div>

        {/* calendar date picker */}
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {jobDate ? jobDate.toLocaleDateString() : "Since Date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={jobDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setJobDate(date)
                    setOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Input placeholder='Agency' value={jobAgency} onChange={e => setJobAgency(e.target.value)} />
        </div>
      </div>
      <div className='mx-7 mt-15 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-2'>
        <JobsList jobTitle={jobTitle} jobLoc={jobLoc} jobAgency={jobAgency} jobDate={jobDate} />
      </div>
    </>
  )
}

export default App


function JobsList(props: { jobTitle: string, jobDate: Date | undefined, jobAgency: string, jobLoc: string }) {
  const { jobTitle, jobDate, jobAgency, jobLoc } = props;
  
  if (jobs.length <= 0) {
    return (
      <h1 className='text-center text-3xl font-semibold tracking-tight'>
        No Jobs Found.
      </h1>
    );
  }

  return jobs
  .filter(job => {
    if (!job.title.toLowerCase().includes(jobTitle.toLowerCase().trim())) {
      return false;
    }

    if (!job.poster.toLowerCase().includes(jobAgency.toLowerCase().trim())) {
      return false;
    }

    if (!job.location.toLowerCase().includes(jobLoc.toLowerCase().trim())) {
      return false;
    }

    if (jobDate === undefined) {
      return true;
    }

    if (new Date(job.datePosted) > jobDate) {
      return false;
    }
    return true;
  })
  .map(job => {
    return (
      <Card key={`${job.poster}_${job.title}`} className='w-full'>
        <CardHeader>
          <CardTitle>
            {job.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{job.category}</p>
          <p>{job.location}</p>
          <p>{job.poster}</p>
          <p>{job.datePosted}</p>
        </CardContent>
      </Card>
    );
  });
}