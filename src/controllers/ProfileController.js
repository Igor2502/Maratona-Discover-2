const profile = require('../model/Profile');

module.exports = {
  index(req, res) {
    return res.render("profile", { profile: profile.get() })
  },
  update(req, res) {
    const data = req.body;

    const weeksPerYear = 52;
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;

    const valueHour = data["monthly-budget"] / monthlyTotalHours;
    
    profile.update({
      ...profile.get(),
      ...req.body,
      "value-hour": valueHour
    });

    return res.redirect('/profile');
  }
}