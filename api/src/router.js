const { Router } = require('express');
const { authenticateHandler } = require('./middlewares');

const router = Router();
const apiRouter = Router();

// routes
const defaultRoutes = require('./components/default/DefaultRoutes');
const authenticationRoutes = require('./components/authentication/AuthenticationRoutes');
const foosRoutes = require('./components/foos/FoosRoutes');

apiRouter.use('/foos', foosRoutes);

router.use('/', defaultRoutes);
router.use('/auth', authenticationRoutes);
router.use('/api', authenticateHandler, apiRouter);

module.exports = router;
