const job = require('../model/Job');
const jobUtils = require('../utils/JobUtils');
const profile = require('../model/Profile');

module.exports = {
  async save(req, res) {
    await job.create({
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      "created-at": Date.now()
    });

    return res.redirect('/');
  },
  create(req, res) {
    return res.render("job");
  },
  async show(req, res) {
    const jobId = req.params.id;
    const prof = await profile.get();
    const jobs = await job.get();

    const jobSelected = jobs.find(job => Number(job.id) === Number(jobId));

    if (!jobSelected) {
      return res.send('Job not found!');
    }

    jobSelected.budget = jobUtils.calculateBudget(jobSelected, prof["value-hour"]);

    return res.render("job-edit", { job: jobSelected });
  },
  async update(req, res) {
    const jobId = req.params.id;

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    }

    await job.update(updatedJob, jobId);

    res.redirect('/job/' + jobId);
  },
  async delete (req, res) {
    const jobId = req.params.id;

    await job.delete(jobId);

    return res.redirect('/');
  }
}