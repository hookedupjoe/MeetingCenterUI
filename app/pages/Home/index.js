(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");

    //~thisPageSpecs//~
var thisPageSpecs = {
        "pageName": "Home",
        "pageTitle": "Home",
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
    north: false,
    west: { name: "welcome", control: "WelcomeCenter", "source": "__app" },
    east: {html: "east"},
    center: { html: "center" },
    south: false
}
//~layoutOptions~//~

    //~layoutConfig//~
thisPageSpecs.layoutConfig = {
        west__size: "400"
        , east__size: "400"
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

ThisPage.liveIndicator = ThisPage.getByAttr$({appuse:"live-indicator"});

ThisPage.parts.welcome.subscribe('sendChat', onSendChat)

ThisPage.chatInput = ThisPage.getByAttr$({pageuse:"chatinput"})

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

ThisPage.iceUsername = localStorage.getItem('meteredusername');
ThisPage.iceCred = localStorage.getItem('meteredpassword');

if( !(ThisPage.iceUsername && ThisPage.iceCred) ){

  ThisApp.input('Enter Username:Password', 'Metered Log In').then(function(theVal){
    if( theVal ){
      var tmpParts = theVal.split(':');
      if( tmpParts.length == 2 ){
        var tmpUN = tmpParts[0];
        var tmpPW = tmpParts[1];
        localStorage.setItem('meteredusername', tmpUN);
        localStorage.setItem('meteredpassword', tmpPW);
        window.location = window.location;
        return;
      }
    }
    alert('Invalid or no value set, reload the page and try again');
    return;
  })
}

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

ThisPage.remoteCanvas = ThisPage.getAppUse('remote-canvas');
ThisPage.ctxRemote = ThisPage.remoteCanvas.getContext("2d",{willReadFrequently: true});

ThisPage.activePeer.ontrack = function({ streams: [stream] }) {
  const remoteVideo = ThisPage.getByAttr$({appuse: 'remote-video'}).get(0);
  if (remoteVideo) {
    console.log('remoteVideo set');
    remoteVideo.srcObject = stream;
  }
};

ThisPage.parts.welcome.subscribe('NewMediaSources', refreshMediaSourceLists)
ThisPage.parts.welcome.refreshMediaSources();
        
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
var sendChannel;

ThisPage.getAppUse = function(theUse){
  return ThisPage.getByAttr$({appuse: theUse}).get(0);
}

function promptForCamera(){
  
  navigator.getUserMedia(
  { video: true, audio: true },
  stream => {
      //--- Do nothing, just validating / prompting for cameral use
  },
  error => {
    console.warn(error.message);
  }
);

}

actions.selectAudioSource = selectAudioSource;
function selectAudioSource(theParams, theTarget) {
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['deviceId', 'label']);
  ThisApp.currentAudioDeviceID = tmpParams.deviceId;

  var tmpConstraints = { video: false, audio: true, deviceId: {
      exact: [ThisApp.currentAudioDeviceID]
    }};
  
        
  navigator.getUserMedia(
    tmpConstraints,
    stream => {
      const localSource = ThisPage.getAppUse('local-audio');
      if (localSource) {
        localSource.srcObject = stream;
      }
      stream.getTracks().forEach(track => ThisPage.activePeer.addTrack(track, stream));
    },
    error => {
      console.warn(error.message);
    }
  );

  //ThisPage.parts.am.setActiveDeviceId(tmpParams.deviceId);
}

actions.selectVideoSource = selectVideoSource;
function selectVideoSource(theParams, theTarget) {
  var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['deviceId', 'label']);
  
  
  ThisApp.currentVideoDeviceID = tmpParams.deviceId;
  
  var tmpConstraints = { video: {deviceId: {
      exact: [ThisApp.currentVideoDeviceID]
    }}, audio: true};


  
  navigator.getUserMedia(
    tmpConstraints,
    stream => {
      const localVideo = ThisPage.getAppUse('local-video');
      if (localVideo) {
        localVideo.srcObject = stream;
      }
      console.log('doload');
      processor.doLoad(localVideo);
    stream.getTracks().forEach(track => ThisPage.activePeer.addTrack(track, stream));
    },
    error => {
      console.warn(error.message);
    }
  );
  
  //ThisPage.parts.am.setActiveDeviceId(tmpParams.deviceId);
}

actions.refreshMediaSources = refreshMediaSources;
function refreshMediaSources() {
  promptForCamera();
  ThisPage.parts.welcome.refreshMediaSources();
}

function refreshMediaSourceLists(){
  
  refreshAudioMediaSources();
  refreshVideoMediaSources();
}

function refreshAudioMediaSources() {

  var tmpDevices = ThisPage.parts.welcome.mediaInfo.devices;

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
    ThisPage.loadSpot('audio-sources', '<div class="mar5"></div><div class="ui message orange mar5">Once you have given permission, press the <b>Refresh Source List</b> to see audio sources.</div>');

    //--- Trigger media access to prompt for permission
    navigator.getUserMedia({
      audio: true, video: false
    }, function () {}, function () {})
  }

}




function refreshVideoMediaSources() {

  var tmpDevices = ThisPage.parts.welcome.mediaInfo.devices;

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
    ThisPage.loadSpot('video-sources', '<div class="mar5"></div><div class="ui message orange mar5">Once you have given permission, press the <b>Refresh Source List</b> to see audio sources.</div>');

    //--- Trigger media access to prompt for permission
    navigator.getUserMedia({
      audio: true, video: false
    }, function () {}, function () {})
  }

}


function refreshUI() {
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



function setMeetingStatus(theStatus){
  var tmpIsOpen = ( theStatus == 'open');
  if( tmpIsOpen ){
    ThisPage.liveIndicator.removeClass('hidden')
  } else {
    ThisPage.liveIndicator.addClass('hidden')
  }
  
}

function onChannelMessage(event) {
  if(!event && event.data) return;
  
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
  if( event && event.type ){
    setMeetingStatus(event.type);
  } else {
    console.log('unknown status change event from data channel',event)
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
      }, 0);
  },

  snapshot: function(theType){
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    this.initialSnapshot = this.ctx1.getImageData(0, 0, this.width, this.height);
  },
  doLoad: function(theVideoEl) {
    this.video = theVideoEl;
    
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d",{willReadFrequently: true});
    this.c2 = document.getElementById("c2");
    this.ctx2 = this.c2.getContext("2d",{willReadFrequently: true});
    this.c3 = document.getElementById("c3");
    this.ctx3 = this.c3.getContext("2d");
    
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

      self.video.addEventListener("play", function() {
        // self.width = self.video.videoWidth ;
        // self.height = self.video.videoHeight;
        self.timerCallback();
      }, false);

    });


    
  },

  computeFrame: function() {


    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        let l = frame.data.length / 4;

        this.snapat++;
        if( this.snapat >= this.snapwhen){
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
      
      
      
      let rir = (r<rc+this.br) && (r>rc-this.br);
      let gir = (g<gc+this.bg) && (g>gc-this.bg);
      let bir = (b<bc+this.bb) && (b>bc-this.bb);
      let inRange = ( rir && gir && bir );

      var inCutout = false;
      if( this.ctx3Data ){
        let rbc = this.ctx3Data.data[i * 4 + 0];
        //let gbc = this.ctx3Data.data[i * 4 + 1];
        //let bbc = this.ctx3Data.data[i * 4 + 2];
        if( !(rbc > 100 ) ){
          inCutout = true;
        }
      }

      //show diff .. add this => || inRange
      if ( inCutout || ( inRange && this.showdiff === true) ){
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
  //ThisPage.parts.welcome.refreshPeople(thePeople);
  ThisPage.parts.welcome.refreshPeople(thePeople);
  refreshUI();
}


function onPeopleList(theMsg) {
  if( theMsg && theMsg.people){
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
    ThisPage.parts.welcome.gotChat(theMsg);
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
