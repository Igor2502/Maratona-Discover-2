const express = require("express");
const routes = express.Router();
const profileController = require('./controllers/ProfileController');
const jobController = require('./controllers/JobController');
const dashboardController = require('./controllers/DashboardController');

routes.get('/', dashboardController.index);
routes.get('/job', jobController.create);
routes.post('/job', jobController.save);
routes.get('/job/:id', jobController.show);
routes.post('/job/:id', jobController.update);
routes.post('/job/delete/:id', jobController.delete);
routes.get('/profile', profileController.index);
routes.post('/profile', profileController.update);

module.exports = routes;