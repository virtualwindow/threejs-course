/*
Sound Class

@author
Diego Pintos aka @dondiegote
www.thelirios.com

Based in this demo:
http://www.htmlfivewow.com/demos/audio-visualizer/index.html
from Eric Bidelman (ericbidelman@chromium.org) (Copyright 2011 Google Inc.)
/**/


const MIX_TO_MONO = false;
const NUM_SAMPLES = 2048;

var audiocontext;
var source = null;
var processor = null;
var analyser = null;
var freqByteData;
var self;
var timeout;

function Sound() {
	self = this;
	this.setup();
}

Sound.prototype.setup = function() {
	
	if (! window.AudioContext) {
		if (! window.webkitAudioContext) {
			displayText("<span style='font-size:14px; color:#fff'>bad browser (could not use webkitAudioContext)<br />Try with the latest version of <a href='https://www.google.com/chrome'>Google Chrome</a></span>");
			return;
		}
		window.AudioContext = window.webkitAudioContext;
	}
	audiocontext = new AudioContext();
	freqByteData = null;
}

Sound.prototype.initAudio = function(arrayBuffer) {
	clearTimeout(timeout);
	source = audiocontext.createBufferSource();

	// Use async decoder if it is available.
	if (audiocontext.decodeAudioData) {
		audiocontext.decodeAudioData(arrayBuffer, function(buffer) {
			source.buffer = buffer;
			createAudio();
		}, function(e) {
			console.log(e);
			displayText("wrong file (cannot decode audio data)<br />try another -mp3, wav, ogg- file");
		});
	} else {
		source.buffer = audiocontext.createBuffer(arrayBuffer, MIX_TO_MONO /*mixToMono*/);
		createAudio();
	}
};
function finish() {
	displayText("no track to be played");
}
function createAudio() {
	processor = audiocontext.createJavaScriptNode(NUM_SAMPLES /*bufferSize*/, 1 /*num inputs*/, 1 /*numoutputs*/);
    processor.onaudioprocess = processAudio;
    analyser = audiocontext.createAnalyser();

    source.connect(audiocontext.destination);
    source.connect(analyser);

    analyser.connect(processor);
    processor.connect(audiocontext.destination);

    source.noteOn(0);
	timeout = window.setTimeout(finish, source.buffer.duration * 1000);

    displayText("");	//done
}

Sound.prototype.disconnect = function() {
   	if(source) {
	   	source.noteOff(0);
	    source.disconnect(0);
	}
	if(processor) processor.disconnect(0);
	if(analyser) analyser.disconnect(0);
	freqByteData = null;
}

function processAudio(e) {

	var inputArrayL = e.inputBuffer.getChannelData(0);

	freqByteData = new Uint8Array(analyser.frequencyBinCount);		
	analyser.getByteFrequencyData(freqByteData);
	
	freqByteData = freqByteData.subarray(1);

	
};

Sound.prototype.load = function(url) {
	songname = "";
	displayText("processing audio...");
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function(e) {
		self.initAudio(request.response);
	};
	request.send();
};

Sound.prototype.byteData = function() { return freqByteData };
