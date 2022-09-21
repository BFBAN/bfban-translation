import express from "express";
import bodyParser from "body-parser";
import config from "./config.js";
import router_index from "./routes/index.js";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// cors options
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('Origin')); // better than wildcard *
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, x-access-token' + (config.__DEBUG__ ? ', x-whosdaddy, x-whosdaddy-p' : ''));  // DEBUG
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/api', router_index);


app.listen(config.port, config.address, () => {
  console.log(`App start at ${config.address}:${config.port}`);
});