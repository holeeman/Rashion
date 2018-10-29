var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = Express();
var mysql = require('mysql');
const crypto = require('crypto');

app.use(bodyParser.json());

// you need to put your database info!
var con = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "sns"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql");
});

var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./Images");
     },
     filename: function(req, file, callback) {
         console.log(crypto.createHmac('sha256', file.fieldname + "_" + req.d + "_" + file.originalname)
                   .update('ATLHACK')
                   .digest('hex')
                  );
         callback(null,
                  crypto.createHmac('sha256', file.fieldname + "_" + req.d + "_" + file.originalname)
                   .update('ATLHACK')
                   .digest('hex')
                  );
     }
 });

var upload = multer({storage: Storage}).single('upimg');

// main index
 app.get("/", function(req, res) {
     res.sendFile(__dirname + "/index.html");
 });

// rank display page
app.get("/rankdisp", function(req, res) {
     res.sendFile(__dirname + "/rank.html");
 });

// vote page
app.get("/vote", function(req, res) {
     res.sendFile(__dirname + "/vote.html");
 });

// img file request
app.get("/img", function(req, res) {
     var _i = req.query.img;
     res.sendFile(__dirname + "/Images/" + _i);
});

// rank api
app.get("/rank", function(req, res) {
    var response = { };
    con.query("SELECT * FROM photos ORDER BY rating DESC", function (err, result) {
    if (err) throw err;
    var ranking = 1;
    result.forEach(function(element) {
    response[ranking] = {
        id: element.id, photo: "http://178.128.0.183:8080/img?img="+element.path, rating: element.rating, voted: element.voted
    };
    ranking += 1;
});
    res.json(response);
  });
});

// getting pair of random fashion image from DB.
app.get("/api/GetPair", function(req, res) {
    con.query("SELECT * FROM photos ORDER BY RAND() LIMIT 2", function (err, result) {
    if (err) throw err;
    var response = { 
        first: {id: result[0].id, photo: "http://178.128.0.183:8080/img?img="+result[0].path},
        second:{id: result[1].id, photo: "http://178.128.0.183:8080/img?img="+result[1].path}
    };
    res.json(response);
  });
});

// vote api
app.get("/api/Vote", function(req, res) {
    var response = { }
    con.query("SELECT * FROM photos WHERE id = "+req.query.id, function (err, result) {
    if (err) throw err;
    response = { 
        id:     result[0].id,
        rating: result[0].rating,
        voted:  result[0].voted
    };
        console.log(result[0].id);
            console.log(response.id);
        console.log("test");
        console.log(response.id);
        if(!req.query.score)
            req.query.score = 0;
        var sql = "UPDATE photos SET rating = "
                +(response.rating + parseInt(req.query.score))
                +", voted = "
                +(response.voted + 1)
                +" WHERE id = "+req.query.id;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
      });
        return res.end("updated!!");
  });
});

// http://serverip/styles/main.css
app.get("/styles/main.css", function(req, res) {
    res.sendFile(__dirname + "/styles/main.css");
});

 app.post("/api/Upload", function(req, res) {
     console.log("somebody is trying..");
     var d = Date.now();
     req.d = d;
     upload(req, res, function(err) {
         if (err) {
		console.log(err);
             return res.end("Something went wrong!");
         }
         var path = crypto.createHmac('sha256', req.file.fieldname + "_" + d + "_" + req.file.originalname)
                   .update('ATLHACK')
                   .digest('hex');
         
         const spawn = require("child_process").spawn;
         const pythonProcess = spawn('python', ["face_dectection.py", path]);
        pythonProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });
         
         var sql = "INSERT INTO photos (path, rating, voted) VALUES ('" + path + "cvtd.png', 0, 0)";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
         
         //return res.end("File uploaded sucessfully!.");
         res.redirect('/');
     });
 });

// listen for clients.
 app.listen(8080, function(a) {
     console.log("Listening to port 8080");
 });
