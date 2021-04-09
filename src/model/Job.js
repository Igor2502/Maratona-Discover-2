const config = require('../db/config');

module.exports = {
  async get() {
    const db = await config();

    const jobs = await db.all(`SELECT * FROM jobs`);

    await db.close();

    return jobs.map(job => ({
      id: job.id,
      name: job.name,
      "daily-hours": job.daily_hours,
      "total-hours": job.total_hours,
      "created-at": job.created_at
    }));
  },

  async update(updatedJob, id) {
    const db = await config();

    await db.run(`
      UPDATE jobs
      SET name = "${updatedJob.name}",
      daily_hours = ${updatedJob["daily-hours"]},
      total_hours = ${updatedJob["total-hours"]}
      WHERE id = ${id}
    `);

    await db.close();
  },

  async delete(id) {
    const db = await config();

    await db.run(`DELETE FROM jobs WHERE id = ${id}`);

    await db.close();
  },

  async create(updatedJob) {
    const db = await config();

    await db.run(`
      INSERT INTO jobs (name, daily_hours, total_hours, created_at) 
      VALUES ("${updatedJob.name}", ${updatedJob["daily-hours"]}, ${updatedJob["total-hours"]}, ${updatedJob["created-at"]})`
    );

    await db.close();
  }
}