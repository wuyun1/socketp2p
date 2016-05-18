require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';



	var Socketiop2p = require('socket.io-p2p')
	var io = require('socket.io-client')

	function AppInit () {
	  var socket = io()
	  var opts = {peerOpts: {trickle: false}, autoUpgrade: false}
	  var p2psocket = new Socketiop2p(socket, opts, function () {
	    privateButton.disabled = false
	    p2psocket.emit('peer-obj', 'Hello there. I am ' + p2psocket.peerId)
	  })

	  // Elements
	  var privateButton = document.getElementById('private')
	  var form = document.getElementById('msg-form')
	  var box = document.getElementById('msg-box')
	  var boxFile = document.getElementById('msg-file')
	  var msgList = document.getElementById('msg-list')
	  var upgradeMsg = document.getElementById('upgrade-msg')

	  p2psocket.on('peer-msg', function (data) {
	    var li = document.createElement('li')
	    li.appendChild(document.createTextNode(data.textVal))
	    msgList.appendChild(li)
	  })

	  p2psocket.on('peer-file', function (data) {
	    var li = document.createElement('li')
	    var fileBytes = new Uint8Array(data.file)
	    var blob = new window.Blob([fileBytes], {type: 'image/jpeg'})
	    var urlCreator = window.URL || window.webkitURL
	    var fileUrl = urlCreator.createObjectURL(blob)
	    var a = document.createElement('a')
	    var linkText = document.createTextNode('New file')
	    a.href = fileUrl
	    a.appendChild(linkText)
	    li.appendChild(a)
	    msgList.appendChild(li)
	  })

	  form.addEventListener('submit', function (e, d) {
	    e.preventDefault()
	    var li = document.createElement('li')
	    li.appendChild(document.createTextNode(box.value))
	    msgList.appendChild(li)
	    if (boxFile.value !== '') {
	      var reader = new window.FileReader()
	      reader.onload = function (evnt) {
	        p2psocket.emit('peer-file', {file: evnt.target.result})
	      }
	      reader.onerror = function (err) {
	        console.error('Error while reading file', err)
	      }
	      reader.readAsArrayBuffer(boxFile.files[0])
	    } else {
	      p2psocket.emit('peer-msg', {textVal: box.value})
	    }
	    box.value = ''
	    boxFile.value = ''
	  })

	  privateButton.addEventListener('click', function (e) {
	    goPrivate()
	    p2psocket.emit('go-private', true)
	  })

	  p2psocket.on('go-private', function () {
	    goPrivate()
	  })

	  function goPrivate () {
	    p2psocket.useSockets = false
	    upgradeMsg.innerHTML = 'WebRTC connection established!'
	    privateButton.disabled = true
	  }
	}


class AppComponent extends React.Component {

  componentDidMount() {

  	console.log(this);
  	AppInit();

  }


  render() {
    return (
      <div className="index">
        <h1>Socket.io-p2p Example</h1>
		  <p><i>Send messages over socket.io and hit `Go Private` to set all WebRTC enabled clients to enter a private conversation.</i></p>

		  <ul id="messages"></ul>
		  <form action="#" id="msg-form">
		    <label>Enter message</label>
		    <input type="text" name="lname" id="msg-box" size="40" />
		    <label>Select file to send</label>
		    <input type="file" name="filename" id="msg-file" size="40" />
		    <input type="submit" value="Submit" />
		  </form>
		  <br />
		  <button id="private" disabled="true">Go private</button>
		  <span style={{color: 'red'}} id="upgrade-msg"></span>
		  <h2>Messages</h2>
		  <ul id="msg-list"></ul>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
