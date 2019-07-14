const busylight = require('busylight');
const express = require('express');
//const fs = require('fs');
//const https = require('https');

const app = express();
const buildlight = busylight.get();

//https.createServer({
	//key: fs.readFileSync('/home/pi/server.key'),
	//cert: fs.readFileSync('/home/pi/server.cert')
//}, app).listen(443, function () {
  //console.log('Example app listening on port 3000! Go to https://localhost:443/')
//});

app.use(express.json());
app.use(express.urlencoded());

app.listen(80, () => console.log('Buildlight listening on port 80'));

app.post('/light', function(req, res){
	var color = req.body.color;
	var timeout = req.body.timeout;
	if (timeout == null){
		timeout = 300000;
	}
	
	res.send("turning on light\n");
	
	clearTimeout(timeoutHandleLight);
	buildlight.light(color);
	var timeoutHandleLight = setTimeout(function() {  
		return buildlight.light(false);
	}, timeout);
});

app.post('/pulse', function(req, res){
	var colors = req.body.colors;
	
	var rate = req.body.rate;
	if (rate == null){
		rate = 300;
	}
	
	var timeout = req.body.timeout;
	if (timeout == null){
		timeout = 300000;
	}
	
	res.send("starting light pulse\n");
	
	clearTimeout(timeoutHandlePulse);
	buildlight.pulse(colors, rate);
	var timeoutHandlePulse = setTimeout(function() {  
		return buildlight.pulse(false);
	}, timeout);
	
});

app.post('/blink', function(req, res){
	var colors = req.body.colors;
	
	var rate = req.body.rate;
	if (rate == null){
		rate = 300;
	}
	
	var timeout = req.body.timeout;
	if (timeout == null){
		timeout = 300000;
	}
	
	res.send("starting light blink\n");
	
	clearTimeout(timeoutHandleBlink);
	buildlight.blink(colors, rate);
	var timeoutHandleBlink = setTimeout(function() {  
		return buildlight.blink(false);
	}, timeout);
	
});

app.post('/ring', function(req, res) {
	var ringtone = req.body.ringtone;
	var timeout = req.body.timeout;
	if (timeout == null || timeout > 5000){
		timeout = 5000;
	}
	
	res.send("turning on ringtone\n");
	
	clearTimeout(timeoutHandleRing);
	buildlight.ring(ringtone);
	var timeoutHandleRing = setTimeout(function() {  
		return buildlight.ring(false);
	}, timeout);
});

app.get('/off', function(req, res) {
	res.send("turning light off\n");
	buildlight.off();
	clearTimeout(timeoutHandleLight);
	clearTimeout(timeoutHandlePulse);
	clearTimeout(timeoutHandleBlink);
	clearTimeout(timeoutHandleRing);
});

app.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call\n');
});

app.post('*', function(req, res) {
  res.status(404).send('Unrecognised API call\n');
});

app.put('*', function(req, res) {
  res.status(404).send('Unrecognised API call\n');
});

app.delete('*', function(req, res) {
  res.status(404).send('Unrecognised API call\n');
});


process.on('SIGINT', function() {
	buildlight.off();
	buildlight.close();
	process.exit();
});
