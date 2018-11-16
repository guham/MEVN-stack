const { Router } = require('express');
const { authenticate } = require('./middlewares/authHandlers');

const router = Router();
const apiRouter = Router();

// routes
const defaultRoutes = require('./components/default/DefaultRoutes');
const authenticationRoutes = require('./components/authentication/AuthenticationRoutes');
const foosRoutes = require('./components/foos/FoosRoutes');

apiRouter.use('/foos', foosRoutes);

router.use('/', defaultRoutes);
router.use('/auth', authenticationRoutes);
router.use('/api', authenticate, apiRouter);

module.exports = router;
