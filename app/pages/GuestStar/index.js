(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");

    //~thisPageSpecs//~
var thisPageSpecs = {
	"pageName": "GuestStar",
	"pageTitle": "Guest Star",
	"navOptions": {
		"topLink": true,
		"sideLink": true
	}
}
//~thisPageSpecs~//~

    var pageBaseURL = 'app/pages/' + thisPageSpecs.pageName + '/';

    //~layoutOptions//~
thisPageSpecs.layoutOptions = {
        baseURL: pageBaseURL,
        north: { html: "header" },
        east: false,
        west: false,
        center: { html: "center" },
        south: false
    }
//~layoutOptions~//~

    //~layoutConfig//~
thisPageSpecs.layoutConfig = {
        west__size: "500"
        , east__size: "250"
    }
//~layoutConfig~//~
    //~required//~
thisPageSpecs.required = {

    }
//~required~//~

    var ThisPage = new SiteMod.SitePage(thisPageSpecs);

    var actions = ThisPage.pageActions;

    ThisPage._onPreInit = function (theApp) {
        //~_onPreInit//~

//~_onPreInit~//~
    }

    ThisPage._onInit = function () {
        //~_onInit//~

//~_onInit~//~
    }


    ThisPage._onFirstActivate = function (theApp) {
        //~_onFirstActivate//~

//~_onFirstActivate~//~
        ThisPage.initOnFirstLoad().then(
            function () {
                //~_onFirstLoad//~
window.ThisPageNow = ThisPage;

ThisPage.processor = processor;
ThisPage.mediaInfo = {};

ThisPage.liveIndicator = ThisPage.getByAttr$({appuse:"live-indicator"});
ThisPage.deviceSelection = ThisPage.getByAttr$({appuse:'device-selection'});

ThisPage.localCanvas = ThisPage.getByAttr$({appuse:'local-canvas'});

ThisPage.localVideo = ThisPage.getAppUse('local-video');
ThisPage.localVideo.addEventListener("canplay", (event) => {
  ThisPage.localVideoPlaying = true;
  ThisPage.closeAudio();
  
})

ThisPage.closeAudio = function(){
  if( ThisPage.localAudio.srcObject ){
    var tmpTracks = ThisPage.localAudio.srcObject.getTracks();
    tmpTracks.forEach(track => track.stop());
  }
  ThisPage.localAudioPlaying = false;
  refreshUI();
}

ThisPage.closeVideo = function(){
  if( ThisPage.localVideo.srcObject ){
    var tmpTracks = ThisPage.localVideo.srcObject.getTracks();
    tmpTracks.forEach(track => track.stop());
  }
  ThisPage.localVideoPlaying = false;
  refreshUI()
}

ThisPage.localAudio = ThisPage.getAppUse('local-audio');
console.log('ThisPage.localAudio',ThisPage.localAudio);
ThisPage.localAudio.addEventListener("canplay", (event) => {
  ThisPage.localAudioPlaying = true;
  ThisPage.closeVideo();
})


//ThisPage.parts.welcome.subscribe('sendChat', onSendChat)

//ThisPage.chatInput = ThisPage.getByAttr$({pageuse:"chatinput"})

ThisPage.stage = {
  name: "MeetingCenter",
  userid: sessionStorage.getItem('userid') || '',
  profile: {
    name: sessionStorage.getItem('displayname') || ''
  }
}
ThisApp.stage = ThisPage.stage;


var tmpURL = ActionAppCore.util.getWebsocketURL('actions', 'ws-main');
ThisPage.wsclient = new WebSocket(tmpURL);
ThisPage.wsclient.onmessage = function (event) {
  var tmpData = '';
  if (typeof (event.data == 'string')) {
    tmpData = event.data.trim();
    if (tmpData.startsWith('{')) {
      tmpData = JSON.parse(tmpData);
      processMessage(tmpData);
    }
  }
  
}

// ThisPage.iceUsername = localStorage.getItem('meteredusername');
// ThisPage.iceCred = localStorage.getItem('meteredpassword');

// if( !(ThisPage.iceUsername && ThisPage.iceCred) ){

//   ThisApp.input('Enter Username:Password', 'Metered Log In').then(function(theVal){
//     if( theVal ){
//       var tmpParts = theVal.split(':');
//       if( tmpParts.length == 2 ){
//         var tmpUN = tmpParts[0];
//         var tmpPW = tmpParts[1];
//         localStorage.setItem('meteredusername', tmpUN);
//         localStorage.setItem('meteredpassword', tmpPW);
//         window.location = window.location;
//         return;
//       }
//     }
//     alert('Invalid or no value set, reload the page and try again');
//     return;
//   })
// }

// ,
//       {
//         urls: "turn:a.relay.metered.ca:80",
//         username: ThisPage.iceUsername,
//         credential: ThisPage.iceCred,
//       },
//       {
//         urls: "turn:a.relay.metered.ca:80?transport=tcp",
//         username: ThisPage.iceUsername,
//         credential: ThisPage.iceCred,
//       },
//       {
//         urls: "turn:a.relay.metered.ca:443",
//         username: ThisPage.iceUsername,
//         credential: ThisPage.iceCred,
//       },
//       {
//         urls: "turn:a.relay.metered.ca:443?transport=tcp",
//         username: ThisPage.iceUsername,
//         credential: ThisPage.iceCred,
//       },

ThisPage.activePeer = new RTCPeerConnection({
  iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      }
  ],
});

ThisPage.activePeer.addEventListener('datachannel', event => {
  ThisPage.activeDataChannel = event.channel;
  setMeetingStatus('open');
  ThisPage.activeDataChannel.onopen = handleSendChannelStatusChange;
  ThisPage.activeDataChannel.onclose = handleSendChannelStatusChange;
  ThisPage.activeDataChannel.onmessage = onChannelMessage

})

ThisPage.activeDataChannel = ThisPage.activePeer.createDataChannel("sendChannel");
ThisPage.activeDataChannel.onopen = handleSendChannelStatusChange;
ThisPage.activeDataChannel.onclose = handleSendChannelStatusChange;
ThisPage.activeDataChannel.onmessage = onChannelMessage

// ThisPage.remoteCanvas = ThisPage.getAppUse('remote-canvas');
// ThisPage.ctxRemote = ThisPage.remoteCanvas.getContext("2d",{willReadFrequently: true});

ThisPage.activePeer.ontrack = function({ streams: [stream] }) {
  const remoteVideo = ThisPage.getByAttr$({appuse: 'remote-video'}).get(0);
  ThisPage.remoteVideo = remoteVideo;
  if (remoteVideo) {
    console.log('remoteVideo set', stream.getTracks());
    ThisPage.lastRemoteStream = stream;
    remoteVideo.srcObject = stream;
  }
};

ThisPage.subscribe('NewMediaSources', refreshMediaSourceLists)

//ThisPage.parts.welcome.refreshMediaSources();
        
refreshUI();
//~_onFirstLoad~//~
                ThisPage._onActivate();
            }
        );
    }


    ThisPage._onActivate = function () {
        //~_onActivate//~

//~_onActivate~//~
    }

    ThisPage._onResizeLayout = function (thePane, theElement, theState, theOptions, theName) {
        //~_onResizeLayout//~

//~_onResizeLayout~//~
    }

    //------- --------  --------  --------  --------  --------  --------  -------- 
    //~YourPageCode//~
ThisApp.navigator = navigator.mediaDevices;

var sendChannel;

ThisPage.getAppUse = function(theUse) {
  return ThisPage.getByAttr$({
    appuse: theUse
  }).get(0);
}

function promptForCamera() {
  ThisApp.navigator.getUserMedia({
    video: true, audio: true
  }).then(function(stream) {
    refreshUI();
  },connectError);
}

function promptForMic() {
  ThisApp.navigator.getUserMedia({
    video: false, audio: true
  }).then(function(stream) {
    refreshUI();
  },connectError);
}

actions.selectAudioSource = selectAudioSource;
function selectAudioSource(theParams, theTarget) {
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['deviceId', 'label']);
  ThisApp.currentAudioDeviceID = tmpParams.deviceId;

  var tmpConstraints = {
    video: false,
    audio: true,
    deviceId: {
      exact: [ThisApp.currentAudioDeviceID]
    }};



  ThisApp.navigator.getUserMedia(tmpConstraints).then(
    function(stream) {
      const localSource = ThisPage.getAppUse('local-audio');
      if (localSource) {
        localSource.srcObject = stream;
      }
      stream.getTracks().forEach(track => ThisPage.activePeer.addTrack(track, stream));
    },connectError);
}

function connectError(theError) {
  if (theError && theError.message) {
    alert(theError.message, "Can not connect", "e")
  } else {
    console.error("Can't connect", arguments);
    alert('Device is most likely in use', "Can not connect", "e")
  }


}
actions.selectVideoSource = selectVideoSource;
function selectVideoSource(theParams, theTarget) {
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['deviceId', 'label']);


  ThisApp.currentVideoDeviceID = tmpParams.deviceId;

  var tmpConstraints = {
    video: {
      deviceId: {
        exact: [ThisApp.currentVideoDeviceID]
      }
    },
    audio: true
  };



  ThisApp.navigator.getUserMedia(tmpConstraints).then(function(stream) {

    const localVideo = ThisPage.getAppUse('local-video');
    console.log('got video stream', typeof(stream))

    if (localVideo) {
      localVideo.srcObject = stream;
    }
    var tmpFPS = 30;
    processor.doLoad(localVideo, {
      frameDelayMS: 1000 / tmpFPS
    });

    //---> DO BELOW to send stream, but no audio
    //ToDo: Send canvas but audio from selected device???

    // var tmpCanvasSteam = processor.c2.captureStream();
    // tmpCanvasSteam.getTracks().forEach(
    //   track => {
    //     ThisPage.activePeer.addTrack(
    //       track,
    //       tmpCanvasSteam
    //     );
    //   }
    // );



    console.log("Adding tracks to remote peer", stream.getTracks())
    stream.getTracks().forEach(track => ThisPage.activePeer.addTrack(track, stream));

  },connectError);

  //ThisPage.parts.am.setActiveDeviceId(tmpParams.deviceId);
}

// actions.refreshMediaSources = refreshMediaSources;
// function refreshMediaSources() {
//   console.log('refreshMediaSources req')
//   promptForCamera();
//   refreshMediaSourcesFromSystem()
//   //ThisPage.parts.welcome.refreshMediaSources();
// }

actions.refreshVideoSources = refreshVideoSources;
function refreshVideoSources() {
  ThisPage.sourceSelection = 'video';
  promptForCamera();
  refreshMediaSourcesFromSystem()
}

actions.refreshAudioSources = refreshAudioSources;
function refreshAudioSources() {
  ThisPage.sourceSelection = 'audio';
  promptForMic();
  refreshMediaSourcesFromSystem()
}

function refreshMediaSourceLists() {
  if (ThisPage.sourceSelection == 'audio') {
    refreshAudioMediaSources();
    ThisPage.loadSpot('video-sources', '');
  } else {
    refreshVideoMediaSources();
    ThisPage.loadSpot('audio-sources', '');
  }

}

function refreshAudioMediaSources() {

  var tmpDevices = ThisPage.mediaInfo.devices;

  var tmpHTML = ['<div class="ui vertical menu fluid">'];

  var tmpFoundOne = false;

  const tmpAudioDevices = tmpDevices.filter(device => device.kind == 'audioinput');

  tmpAudioDevices.map(theDevice => {
    var tmpLabel = theDevice.label || "(unknown)";
    if (!tmpFoundOne && theDevice.label) {
      tmpFoundOne = true;
    }

    //--- Add list item with pageaction to tell audio motion to use the selected the deviceId
    var tmpDeviceId = theDevice.deviceId;
    tmpHTML.push(`<div class="item active" pageaction="selectAudioSource" deviceId="${theDevice.deviceId}" label="${tmpLabel}">
      <div class="content">
      <div class="header" style="line-height: 25px;">
      <i class="icon microphone blue"></i> ${tmpLabel}
      </div>
      </div>
      </div>`);
  });
  tmpHTML.push('</div>');


  if (tmpFoundOne) {
    ThisPage.loadSpot('audio-sources', tmpHTML.join('\n'));
  } else {
    ThisPage.loadSpot('audio-sources', '<div class="mar5"></div><div class="ui message orange mar5">Once you have given permission, press the <b>Show Microphones</b> button again.</div>');
    ThisPage.promptForMic();
  }

}



function refreshVideoMediaSources() {


  var tmpDevices = ThisPage.mediaInfo.devices;
  console.log('ThisPage.mediaInfo.devices', ThisPage.mediaInfo.devices);

  var tmpHTML = ['<div class="ui vertical menu fluid">'];

  var tmpFoundOne = false;

  const tmpAudioDevices = tmpDevices.filter(device => device.kind == 'videoinput');


  tmpAudioDevices.map(theDevice => {
    var tmpLabel = theDevice.label || "(unknown)";
    if (!tmpFoundOne && theDevice.label) {
      tmpFoundOne = true;
    }

    //--- Add list item with pageaction to tell audio motion to use the selected the deviceId
    var tmpDeviceId = theDevice.deviceId;
    tmpHTML.push(`<div class="item active" pageaction="selectVideoSource" deviceId="${theDevice.deviceId}" label="${tmpLabel}">
      <div class="content">
      <div class="header" style="line-height: 25px;">
      <i class="icon video blue"></i> ${tmpLabel}
      </div>
      </div>
      </div>`);
  });
  tmpHTML.push('</div>');

  if (tmpFoundOne) {
    ThisPage.loadSpot('video-sources', tmpHTML.join('\n'));
  } else {
    ThisPage.loadSpot('video-sources', '<div class="mar5"></div><div class="ui message orange mar5">Once you have given permission, press the <b>Show Cameras</b> button again.</div>');
    promptForCamera();
  }

}


function refreshUI() {
  console.log('ThisPage.localVideoPlaying', ThisPage.localVideoPlaying);
  console.log('ThisPage.localAudioPlaying', ThisPage.localAudioPlaying);


  if (ThisPage.localVideoPlaying || ThisPage.localAudioPlaying) {
    ThisPage.loadSpot('video-sources', '');
    ThisPage.loadSpot('audio-sources', '');

    var tmpBtnText = 'Stop Using '
    var tmpBtnAction = ''
    var tmpMsgText = 'The ';
    var tmpIcon = '';
    ThisPage.closeAudio
    if (ThisPage.localVideoPlaying) {
      tmpBtnText += "Camera"
      tmpBtnAction = 'closeVideo'
      tmpMsgText += 'Camera';
      tmpIcon = 'video';
      ThisPage.localCanvas.removeClass('hidden');
    } else {
      tmpBtnText += "Microphone"
      tmpBtnAction = 'closeAudio'
      tmpMsgText += 'Microphone';
      tmpIcon = 'microphone';
      ThisPage.localCanvas.addClass('hidden');
    }

    ThisPage.deviceSelection.addClass('hidden');


    var tmpBtn = '<div class="ui button basic blue small compact" pageaction="' + tmpBtnAction + '">' + tmpBtnText + '</div>';
    var tmpHdr = '<div class="ui label left pointing green large">' + tmpMsgText + ' is active</div>';
    var tmpInUse = `<div class="pad8"><h2 class="ui header">
    <i class="icon green huge ${tmpIcon}"></i>
    <div class="content">
    ${tmpHdr + tmpBtn}
    </div>
    </h2></div>`
    ThisPage.loadSpot('device-in-use', tmpInUse);

  } else {
    ThisPage.deviceSelection.removeClass('hidden');
    ThisPage.loadSpot('device-in-use', '<div class="ui message blue small">Select an Audio/Video Device</div>')
    ThisPage.localCanvas.addClass('hidden');
  }






  ThisPage.loadSpot('your-disp-name', ThisPage.stage.profile.name);
  var tmpName = ThisPage.stage.profile.name;
  var tmpProfileStatus = 'new';
  if (tmpName) {
    tmpProfileStatus = 'outside';
  }
  if (ThisPage.stage.people && ThisPage.stage.people[ThisPage.stage.userid]) {
    tmpProfileStatus = 'backstage';
  }

  ThisPage.showSubPage({
    item: tmpProfileStatus, group: 'profilestatus'
  });

}



function setMeetingStatus(theStatus) {
  var tmpIsOpen = (theStatus == 'open');
  if (tmpIsOpen) {
    ThisPage.liveIndicator.removeClass('hidden')
  } else {
    ThisPage.liveIndicator.addClass('hidden')
  }

}

function onChannelMessage(event) {
  if (!event && event.data) return;

  // this.outMax = this.outMax || 0;
  // this.outMax++;

  // if( this.outMax < 100){
  //   console.log('event.data',typeof(event.data))
  // }


  //TODO --- START HERE TO STREAM CANVAS
  //---- NOT DATA IF POSSIBLE???
  //  const stream = canvas.captureStream();


  // if( typeof(event.data) == '[object ImageData]'){
  //   //--- frame data
  //   if( this.ctxRemote ){
  //     this.ctxRemote.putImageData(event.data, 0, 0);
  //   }

  // }

}
function handleSendChannelStatusChange(event) {
  if (event && event.type) {
    setMeetingStatus(event.type);
  } else {
    console.log('unknown status change event from data channel', event)
  }

  // if (sendChannel) {
  //   var state = sendChannel.readyState;
  //   console.log('handleSendChannelStatusChange state',state);
  // }
}

actions.requestDataConnect = requestDataConnect;
function requestDataConnect(theParams, theTarget) {
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['userid']);
  if (!(tmpParams.userid)) {
    alert('No person selected', 'Select a person', 'e');
    return;
  }
}

actions.requestMeeting = requestMeeting;
function requestMeeting(theParams, theTarget) {
  //ThisPage.isAlreadyCalling = true;
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['userid']);
  if (!(tmpParams.userid)) {
    alert('No person selected', 'Select a person', 'e');
    return;
  }


  //--- Quick test for one peer to peer
  var self = this;

  ThisPage.activePeer.createOffer().then(theOffer => {
    self.activeOffer = theOffer;
    ThisPage.activePeer.setLocalDescription(new RTCSessionDescription(self.activeOffer)).then();

    ThisPage.wsclient.send(JSON.stringify({
      offer: self.activeOffer,
      action: 'meeting', to: tmpParams.userid
    }))


  });




}



let processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
      self.timerCallback();
    }, self.frameDelayMS);
  },

  snapshot: function(theType) {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    this.initialSnapshot = this.ctx1.getImageData(0, 0, this.width, this.height);
  },
  doLoad: function(theVideoEl, theOptions) {
    this.options = theOptions || {};
    this.video = theVideoEl;
    this.frameDelayMS = this.options.frameDelayMS || 20;

    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d", {
      willReadFrequently: true
    });
    this.c2 = document.getElementById("c2");
    this.ctx2 = this.c2.getContext("2d", {
      willReadFrequently: true
    });
    this.c3 = document.getElementById("c3");
    this.ctx3 = this.c3.getContext("2d", {
      willReadFrequently: true
    });

    this.showDiff = false;
    this.showCutout = false;

    var self = this;

    const image = new Image();
    image.src = "./res/cutout.png";

    // this.cutoutEl = ThisPage.getByAttr$({appuse: 'cutout'}).get(0);
    // this.cutoutCtx = this.cutoutEl.getContext("2d");


    self.width = self.video.videoWidth || 640;
    self.height = self.video.videoHeight || 480;





    self.r = 0;
    self.g = 100;
    self.b = 150;

    self.br = 30;
    self.bg = 30;
    self.bb = 30;
    self.snapshot();


    self.snapwhen = 7;
    self.snapat = 0;

    self.ctx3Data = false;
    image.addEventListener("load", () => {
      self.ctx3.drawImage(image, 0, 0, self.width, self.height);
      self.ctx3Data = self.ctx3.getImageData(0, 0, self.width, self.height);


    });
    self.video.addEventListener("play", function() {
      // self.width = self.video.videoWidth ;
      // self.height = self.video.videoHeight;
      self.timerCallback();
    }, false);



  },

  computeFrame: function() {


    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    let frame = this.ctx1.getImageData(0, 0, this.width, this.height);

    let l = frame.data.length / 4;

    this.snapat++;
    if (this.snapat >= this.snapwhen) {
      this.snapat = 0;
      this.snapshot();
    }

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
      let rc = this.initialSnapshot.data[i * 4 + 0];
      let gc = this.initialSnapshot.data[i * 4 + 1];
      let bc = this.initialSnapshot.data[i * 4 + 2];



      let rir = (r < rc+this.br) && (r > rc-this.br);
      let gir = (g < gc+this.bg) && (g > gc-this.bg);
      let bir = (b < bc+this.bb) && (b > bc-this.bb);
      let inRange = (rir && gir && bir);

      var inCutout = false;
      if (this.ctx3Data) {
        let rbc = this.ctx3Data.data[i * 4 + 0];
        //--- unlessneeded--> let gbc = this.ctx3Data.data[i * 4 + 1];
        //--- unlessneeded--> let bbc = this.ctx3Data.data[i * 4 + 2];
        if (!(rbc > 100)) {
          inCutout = true;
        }
      }

      //this.showdiff = true;
      //--- show diff .. add this => || inRange
      //inCutout ||
      //if ( ( inRange && this.showdiff === true) ){

      if (this.showDiff != true) {
        inRange = false;
      }
      if (this.showCutout != true) {
        inCutout = false;
      }
      if (inCutout || inRange) {
        frame.data[i * 4 + 3] = 0;
      }

    }
    this.ctx2.putImageData(frame, 0, 0);
    //  ToDo: USE STREAM OF CANVAS?
    // if( ThisPage.activeDataChannel ){
    //   ThisPage.activeDataChannel.send(frame)
    // }

    return;
  }
};



actions.sendProfile = sendProfile;
function sendProfile() {
  ThisPage.wsclient.send(JSON.stringify({
    action: 'profile', profile: ThisPage.stage.profile, userid: ThisPage.stage.userid, id: ThisPage.stage.stageid
  }))
}

actions.refreshPeople = refreshPeople;
function refreshPeople(thePeople) {
  ThisPage.stage.people = thePeople;
  //refreshPeople(thePeople);
  refreshPeopleUI(thePeople);
  //console.log('refresh ppl todo',thePeople);
  refreshUI();
}


function refreshMediaSourcesFromSystem() {
  var self = this;
  navigator.mediaDevices.enumerateDevices().then(function(theDevices) {
    ThisPage.mediaInfo.devices = theDevices;
    ThisPage.publish('NewMediaSources')
  });
}

function refreshPeopleUI(thePeople) {

  var tmpHTML = [];
  var tmpActive = false;

  for (var aID in thePeople) {
    var tmpPerson = thePeople[aID];
    tmpHTML.push('<div class="ui message">')
    tmpHTML.push('<div class="ui header small toleft">')
    tmpHTML.push(tmpPerson.name);
    tmpHTML.push('</div>')

    if (ThisPage.stage.userid != tmpPerson.userid) {
      tmpHTML.push('<div  userid="' + aID + '" pageaction="requestMeeting" class="ui button blue compact small toright">Request Meeting</div>');
    }

    tmpHTML.push('<div class="clearboth"></div>')
    tmpHTML.push('</div>')
  }

  ThisPage.loadSpot('people-list', tmpHTML.join('\n'));

}



function onPeopleList(theMsg) {
  if (theMsg && theMsg.people) {
    refreshPeople(theMsg.people);
  }

}
function onMeetingRequst(theMsg) {

  var tmpTitle = 'Meeting Request from ' + theMsg.fromname
  var tmpMsg = 'Do you want to join a meeting with ' + theMsg.fromname + '?'
  var self = this;

  var tmpConfirm = true;

  if (!ThisPage.inMeetingRequest) {
    ThisPage.inMeetingRequest = true;
    tmpConfirm = ThisApp.confirm(tmpMsg, tmpTitle);
  }
  $.when(tmpConfirm).then(theReply => {
    var tmpReplyMsg = {
      from: theMsg.fromid,
      reply: theReply
    }
    if (theReply) {
      ThisPage.activePeer.setRemoteDescription(new RTCSessionDescription(theMsg.offer)).then(
        function () {

          ThisPage.activePeer.createAnswer().then(theAnswer => {
            self.activeAnswer = theAnswer;

            ThisPage.activePeer.setLocalDescription(new RTCSessionDescription(theAnswer)).then(
              function () {

                ThisPage.wsclient.send(JSON.stringify({
                  action: 'meetingresponse', answer: self.activeAnswer, message: tmpReplyMsg
                }))



              }
            )



          });

        }
      );



    } else {
      ThisPage.wsclient.send(JSON.stringify({
        action: 'meetingresponse', message: tmpReplyMsg
      }))
    }


  })

}


function onMeetingResponse(theMsg) {
  var self = this;


  if (theMsg && theMsg.message && theMsg.message.reply === true) {


    var tmpAnswer = theMsg.answer;
    ThisPage.activePeer.setRemoteDescription(
      new RTCSessionDescription(tmpAnswer)
    ).then(function() {
        //ToDo: Set this?

        if (!ThisPage.isAlreadyCalling) {
          //--- Socket ID?

          actions.requestMeeting({
            userid: theMsg.fromid
          })
          ThisPage.isAlreadyCalling = true;
          console.log('Calling back', typeof(ThisPage.activePeer));

        } else {
          console.log('we have connection', typeof(ThisPage.activePeer));
          ThisPage.inMeetingRequest = false;





        }
      });



  } else {
    alert('' + theMsg.fromname + ' did not accept the requst', 'Request Not Accepted', 'e')
  }
  // var tmpTitle = 'Meeting Request from ' + theMsg.fromname
  // var tmpMsg = 'Do you want to join a meeting with ' + theMsg.fromname + '?'
  // ThisApp.confirm(tmpMsg, tmpTitle).then(theReply => {
  //   var tmpReplyMsg = {
  //     from: theMsg.fromid,
  //     reply: theReply
  //   }
  //   ThisPage.wsclient.send(JSON.stringify({
  //     action: 'meetingresponse', message: tmpReplyMsg
  //   }))

  // })

}

function processMessage(theMsg) {
  if (typeof(theMsg) == 'string' && theMsg.startsWith('{')) {
    theMsg = JSON.parse(theMsg);
  }
  if (typeof(theMsg) != 'object') {
    return;
  }

  var tmpAction = theMsg.action || theMsg.people;
  if (!(tmpAction)) {
    console.warn('no action to take', theMsg);
    return;
  }

  if (tmpAction == 'welcome' && theMsg.id) {
    ThisPage.stage.stageid = theMsg.id;
    if (!(ThisPage.stage.userid)) {
      ThisPage.stage.userid = theMsg.userid;
      sessionStorage.setItem('userid', ThisPage.stage.userid)
    } else {
      //--- We already have a profile, send userid we have
      if (ThisPage.stage.profile.name && ThisPage.stage.userid) {
        sendProfile();
      }
      //ThisPage.wsclient.send({action:'profile',})
    }

  } else if (tmpAction == 'chat') {
    //ThisPage.parts.welcome.gotChat(theMsg);
    console.log('gotChat', theMsg)
  } else if (tmpAction == 'meetingrequest') {
    onMeetingRequst(theMsg);
  } else if (tmpAction == 'people') {
    onPeopleList(theMsg);
  } else if (tmpAction == 'meetingresponse') {
    onMeetingResponse(theMsg);
  } else {
    console.log('unknown message', theMsg);
  }
  if (theMsg.people) {
    refreshPeople(theMsg.people);
  }

}
function setProfileName(theName) {
  if (!(theName)) return;
  ThisPage.stage.profile = ThisPage.stage.profile || {};
  ThisPage.stage.profile.name = theName;
  sessionStorage.setItem('displayname', theName)
  sendProfile();
  refreshUI();
}

function onSendChat(theEvent, theEl, theMsg) {
  if (!(theMsg && theMsg.text)) {
    alert('Nothing to send', "Enter some text", "e").then(function () {
      return;
    })
  }
  ThisPage.wsclient.send(JSON.stringify({
    action: 'chat', message: theMsg
  }))
}


actions.clearChat = function() {
  ThisPage.loadSpot('chatoutput', '');
}

actions.setYourName = function() {
  ThisApp.input('Enter your name', 'Any Display Name', 'Save Display Name', ThisPage.stage.profile.name).then(setProfileName);
}
//~YourPageCode~//~

})(ActionAppCore, $);
