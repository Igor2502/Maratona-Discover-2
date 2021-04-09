const job = require('../model/Job');
const jobUtils = require('../utils/JobUtils');
const profile = require('../model/Profile');

module.exports = {
  async index(req, res) {
    const prof = await profile.get();
    const jobs = await job.get();
    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = jobUtils.remainingDays(job);
      const status = remaining <= 0 ? 'done' : 'progress';

      statusCount[status]++;

      jobTotalHours = status === 'progress' ? Number(job['daily-hours']) : jobTotalHours

      return {
        ...job,
        remaining,
        status,
        budget: jobUtils.calculateBudget(job, prof["value-hour"])
      };
    });

    const freeHours = prof['hours-per-day'] - jobTotalHours;

    return res.render("index", { jobs: updatedJobs, profile: prof, statusCount, freeHours });
  }
};