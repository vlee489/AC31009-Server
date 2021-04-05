const AsyncRouter = require("express-async-router").AsyncRouter;
const routes = AsyncRouter();
const bodyParser = require('body-parser');
// Import Routes for API
import login from './login'
import createAccount from './createAccount'
import validateToken from './validate'

// Tell routes to use bodyparses
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

routes.post('/login', login);
routes.post('/createAccount', createAccount)
routes.post('/validateToken', validateToken)

export default routes