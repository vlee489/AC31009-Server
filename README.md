# AC31009-Server
Server for AC31009 Games Module

## Requiements

- [NodeJS LTS](https://nodejs.org/en/) (*14.16.1 at the of creation*)
- [Yarn](https://yarnpkg.com/)
- MongoDB database (*For this assigment I use a [MongoDB Atlas](https://www.mongodb.com/) M10 DB hosted on Azure*)
- For Secure deployment, a SSL cert

## `.env` enviorment variable

This program uses enviorment variable to store secrets, this is the layout of them.

```
NODE_ENV = development or production
PORT = port_to_run_on
MONGO_URI = mongo_db_connecion_URI
SESSIONSECRECT = Your_session_secret
ROOMKEYSECRET = secret_for_room_keys
CERTKEY = path_to_privkey.pem
CERT = path_to_cert.pem
CA = path_to_chain.pem
```

## Install and Operation

### Initial Install

1. First install NodeJS and Yarn
2. `cd` into the main directory of the project and install your requirements using `yarn install`
3. Setup your enviorment variables, (*for dev you can create a .env file in the root of the dir to be loaded in*)

### Dev operation

To run the program while in development you can do `yarn dev` this is will launch a nodemon instance with ts-node to start the program. When any changes are made to the projects typescript or JSON files, nodemon will auto reload the program.

*When you run via `yarn dev` each time you launch mongoose-tsgen will generate the type files for the models*

### Deployment

In deployment you need to complile the Typescript into Javascript, you can do this with `yarn build`. This will otuput files in the `/dist` directory. After you compile the Typescript you can then run the `yarn start` command to start the compiled server.

## Packages

I've used a lot of packages from the NPM repo for this server, they can all be round in the `package.json` file.
