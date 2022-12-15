// libs
const express = require('express');
const cors = require('cors');
const forms = require('formidable');
const winston = require('winston');
const df = require('dateformat');
const { Client } = require('pg')
 
console.log("dir "+__dirname);

//const res = await client.query('SELECT $1::text as message', ['Hello world!'])
//console.log(res.rows[0].message) // He`llo world!
//await client.end()

// config
const config = require('../app/config');

// init 
const app = express();

app.set('view engine', 'ejs');
app.set('view options', { layout:true });
app.set('views', __dirname + "/templates")

const log = winston.createLogger({
    format: winston.format.combine(winston.format.json()),
    transports: [new winston.transports.File({ filename: __dirname + "/logs/" +df(new Date(), "yyyy-mm-dd") + ".log" })]
});

// params
const port = config.port;

app.get('/', (req, res) => {
    
    log.info(config.welcome_msg);
    res.render('index', { "output":'Rest Call [<b>"/"</b>] Message [<b>'+config.welcome_msg+'</b>]'});
});

app.post('/test', (req, res) => {
    
    log.info("post test");
    
    var output = [];
    
    var form = new forms.IncomingForm();
    form.parse(req, function (err, fields, files) {});
    form.on('field', function(field, value)
    {
        output.push({ "name":field, "value":value });        
    });
    form.on('end', function()
    {
        var out = JSON.stringify(output);
        res.render('index', { "output":out });
    }); 
});
   
app.get('/database', (req, res) => {
    db();
    
    log.info(config.db_msg);
    res.send(config.db_msg);
});

async function db()
{
    console.log("db1");    

    const client = new Client({
        username: 'impress',
        password: 'impress',
        database: 'users.users',
        host: 'localhost',
        port: '5432',
        dialect: 'postgres',
        pool:{
            maxConnections:10,
            minConnections:1,
            maxIdleTime:12000
        },
    })

    console.log("db1"); 

    await client.connect();

    console.log("db2"); 

    const res = await client.query('select * from impress.users');
    
    console.log("db3"); 
    
    console.log(res.rows[0].first_name) // Hello world!
    
    console.log("db4"); 
    
    await client.end()

    console.log("db5");    
}

// start
app.listen(config.port, () => 
{
    // db();
    
    log.info(config.port_msg + port);
    console.log(config.port_msg + port);
    // this.logger_info.log("info", "Server running on PORT > "+port);
});

