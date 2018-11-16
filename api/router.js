const { Router } = require('express');
const { authenticate } = require('./middlewares/authHandlers');
const { defaultRoutes, apiRoutes } = require('./routes');
const authenticationRoutes = require('./components/authentication/AuthenticationRoutes');

const router = Router();

router.use('/', defaultRoutes);
router.use('/auth', authenticationRoutes);
router.use('/api', authenticate, apiRoutes);

module.exports = router;
