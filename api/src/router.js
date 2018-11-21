const { Router } = require('express');
const { authenticateHandler } = require('./middlewares');

const router = Router();

const defaultRoutes = require('./components/default/DefaultRoutes');
const authenticationRoutes = require('./components/authentication/AuthenticationRoutes');

router.use('/', defaultRoutes);
router.use('/auth', authenticationRoutes);

const apiRouter = Router();

const foosRoutes = require('./components/foos/FoosRoutes');

apiRouter.use('/foos', foosRoutes);

router.use('/api', authenticateHandler, apiRouter);

module.exports = router;
