const AsyncRouter = require("express-async-router").AsyncRouter;
const routes = AsyncRouter();
const bodyParser = require('body-parser');
// Import Routes for API
import login from './login'
import createAccount from './createAccount'
import validateToken from './validate'
import getInfo from './getInfo'
import profile from './profile'
import gameData from './gameData'
import openLobbyPost from './openLobby'

// Tell routes to use bodyparses
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

routes.post('/login', login);
routes.post('/createAccount', createAccount)
routes.post('/validateToken', validateToken)
routes.post('/openLobby', openLobbyPost)
routes.get('/getInfo', getInfo)
routes.get('/profile', profile)
routes.get('/gameData', gameData)

export default routes