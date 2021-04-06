const job = require('../model/Job');
const jobUtils = require('../utils/JobUtils');
const profile = require('../model/Profile');

module.exports = {
  save(req, res) {
    const jobs = job.get();
    const lastId = jobs[jobs.length - 1]?.id || 0;

    jobs.push({
      id: lastId + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      "create-at": Date.now()
    });
    return res.redirect('/');
  },
  create(req, res) {
    return res.render("job");
  },
  show(req, res) {
    const jobId = req.params.id;

    const jobSelected = job.get().find(job => Number(job.id) === Number(jobId));

    if (!jobSelected) {
      return res.send('Job not found!');
    }

    jobSelected.budget = jobUtils.calculateBudget(jobSelected, profile.get()["value-hour"]);

    return res.render("job-edit", { job: jobSelected });
  },
  update(req, res) {
    const jobId = req.params.id;

    const jobs = job.get();
    const jobSelected = jobs.find(job => Number(job.id) === Number(jobId));

    if (!jobSelected) {
      return res.send('Job not found!');
    }

    const updatedJob = {
      ...jobSelected,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    }

    const newJobs = jobs.map(job => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }

      return job;
    })

    job.update(newJobs);

    res.redirect('/job/' + jobId);
  },
  delete (req, res) {
    const jobId = req.params.id;

    job.delete(jobId);

    return res.redirect('/');
  }
}