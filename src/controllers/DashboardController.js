const job = require('../model/Job');
const jobUtils = require('../utils/JobUtils');
const profile = require('../model/Profile');

module.exports = {
  index(req, res) {
    let statusCount = {
      progress: 0,
      done: 0,
      total: job.get().length
    };

    let jobTotalHours = 0;

    const updatedJobs = job.get().map((job) => {
      const remaining = jobUtils.remainingDays(job);
      const status = remaining <= 0 ? 'done' : 'progress';

      statusCount[status]++;

      jobTotalHours = status === 'progress' ? Number(job['daily-hours']) : jobTotalHours

      return {
        ...job,
        remaining,
        status,
        budget: jobUtils.calculateBudget(job, profile.get()["value-hour"])
      };
    });

    const freeHours = profile.get()['hours-per-day'] - jobTotalHours;

    return res.render("index", { jobs: updatedJobs, profile: profile.get(), statusCount, freeHours });
  }
};