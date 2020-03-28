let express = require('express');

// cors is used to handle cross origin resource sharing
let cors = require('cors');

// only use body parser if you are dealing with post requests
let bodyParser = require('body-parser');
let compression = require('compression');

// app is express app and middleware attached to app are called
// application level middleware
let app = express();

// router level middlware is similar to appliation level middleware but instead they are bound to express.Router()

// use cors middleware for all the request that come on the server
app.use(cors());

// third party middleware
 app.use(compression());

// middleware without any mount point
// this type of middlware is exexuted for all the routes
app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// this middleware is executed whenever any request comes on
// https:localhost::8080/static route only
app.use('/static', express.static('public'));

// this is again unmounted middleware and hence this middleware 
// is called for every route
// but this middlware calls another middlware that we pass to it
// as the second argument we can chain the middlewars this way
// the mount point does not matter if it is present or not we
// can still chain the middlewares this way
app.use((req, res, next) => {
  console.log("Request URL: ", req.originalUrl);
  next();
}, (req, res, next) => {
  console.log("Request Type: ", req.method);
  next();
});

// we can have multiple handlers for the same route but inorder
// to do so make sure that last handler send the actual response
// and the intermediate handlers takes one extra argument next
// which will allow us to jump to next handler
app.get("/", (req, res, next) => {
  console.log("first handler");
  next();
});

app.get("/", (req, res) => {
  res.send("second handler");
});

// error handling middleware all error handler have 4 parameters
// and first parameter is the error that occured 
app.use((err, req, res, next) => {
  console.log(err);
  next();
});

// bodyParser.urlencoded() middleware is used to parse the url-encoded data
// in the request and the parsed data is available to us in req.body
app.use(bodyParser.urlencoded({extended: false}));

// bodyParse.json() middleware is used to parse the response data that is in json form
app.use(bodyParser.json());

app.post("/", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

app.listen(8080);
