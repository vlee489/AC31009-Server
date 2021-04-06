const AsyncRouter = require("express-async-router").AsyncRouter;
const routes = AsyncRouter();
const bodyParser = require('body-parser');
// Import Routes for API
import login from './login'
import createAccount from './createAccount'
import validateToken from './validate'
import getInfo from './getInfo'
import profile from './profile'

// Tell routes to use bodyparses
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

routes.post('/login', login);
routes.post('/createAccount', createAccount)
routes.post('/validateToken', validateToken)
routes.get('/getInfo', getInfo)
routes.get('/profile', profile)

export default routes