(function (ActionAppCore, $) {

  var ControlSpecs = {
    options: {
      padding: false,
      required: {
        controls: {
          map: {
            "ChatControl": {
              name: 'ChatControl',
              source: '__app',
            }
          }
        },
        templates: {
          map:
          {
            "MeetingHome": {
              source: "__app", name: "MeetingHome"
            }
          }
        }
      }
    },
    content: [{
      "ctl": "layout",
      "name": "lo",
      "north": [{
        ctl: "control",
        name: "header",
        catalog: "_designer",
        controlname: "MainHeader"
      }],
      "center": [{
        ctl: "control",
        name: "tabs",
        catalog: "_designer",
        controlname: "TabsContainer"
      }]

    }]
  }

  var ControlCode = {};

  ControlCode.refreshMediaSources = refreshMediaSources;
  function refreshMediaSources() {
    var self = this;
    navigator.mediaDevices.enumerateDevices().then(function(theDevices) {
      self.mediaInfo = self.mediaInfo || {};
      self.mediaInfo.devices = theDevices;
      self.publish('NewMediaSources')
    });
  }

  ControlCode.setup = setup;
  function setup() {}
  ControlCode.onSendChat = onSendChat;
  function onSendChat(theEvent, theEl, theValue) {
    this.publish('sendChat', [this, theValue])
  }


  ControlCode.gotChat = function(theMsg) {
    this.chatControl.gotChat(theMsg)
  }

  ControlCode.clearChat = function() {
    this.chatControl.clearChat();
  }

  ControlCode.refreshPeople = function(thePeople) {
    //console.log( 'thePeople', thePeople);

    var tmpHTML = [];
    var tmpActive = false;

    for (var aID in thePeople) {
      var tmpPerson = thePeople[aID];
      tmpHTML.push('<div class="ui message">')
      tmpHTML.push('<div class="ui header small toleft">')
      tmpHTML.push(tmpPerson.name);
      tmpHTML.push('</div>')

      if (this.page.stage.userid != tmpPerson.userid) {
        tmpHTML.push('<div  userid="' + aID + '" pageaction="requestMeeting" class="ui button blue compact small toright">Request Meeting</div>');
      }

      tmpHTML.push('<div class="clearboth"></div>')
      tmpHTML.push('</div>')
    }

    this.loadSpot('people-list', tmpHTML.join('\n'));
    this.chatControl.refreshPeople(thePeople);
  }


  ControlCode.openTabChat = function() {
    var dfd = $.Deferred();
    var tmpTabKey = 'tab-chat';
    var tmpTabTitle = 'Chat';
    var tmpIcon = 'user';
    var tmpParams = {};
    var self = this;
    //--- Open a new tab that contains a control
    //    Add a refrence to the control in a tab for easy access
    this.tabs.openTab({
      tabname: tmpTabKey,
      tabtitle: '<i class="icon ' + tmpIcon + ' blue"></i> ' + tmpTabTitle,
      controlname: 'ChatControl',
      catalog: '__app',
      closable: false,
      setup: tmpParams
    }).then(function(theControl) {
      if (typeof(theControl) == 'object') {
        self.chatControl = theControl;
        //temp disable --> below
        self.tabs.gotoTab('main');
        self.chatControl.subscribe('sendChat', onSendChat.bind(self));
        dfd.resolve(true);
      }
    });

    return dfd.promise();
  }



  ControlCode._onInit = _onInit;
  function _onInit() {
    this.mediaInfo = this.mediaInfo || {};
    this.parts.header.setHeader('Meeting Attendees');
    this.page = this.getParentPage();
    this.tabs = this.parts.tabs;
    this.tabs.addTab({
      item: 'main',
      text: "Meeting Room",
      icon: 'users',
      content: '<div class="mar1 pad5" myspot="dashhome"></div>'
    });

    this.loadSpot('dashhome',
      {},
      "MeetingHome");
      
          this.tabs.addTab({
      item: 'remoteAttendee',
      text: "Remote Attendee",
      icon: 'user',
      content: '<div class="mar1 pad5" myspot="dashhome"></div>'
    });


    var self = this;
    //--- Note: We preloaded the control used in the required area
    //this.openTabChat();
  }

  var ThisControl = {
    specs: ControlSpecs, options: {
      proto: ControlCode, parent: ThisApp
    }};
  return ThisControl;
})(ActionAppCore, $);