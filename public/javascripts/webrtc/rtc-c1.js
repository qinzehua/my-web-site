var socket = io()

const mediaStreamConstraints = {
  video: true,
}
const offerOptions = {
  offerToReceiveVideo: 1,
}

const localVideo = document.getElementById("localVideo")

let localStream
let localPeerConnection

function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream
  localStream = mediaStream
  callButton.disabled = false
}

function handleConnection(event) {
  const peerConnection = event.target
  const iceCandidate = event.candidate
  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate)
    socket.emit("iceChange", newIceCandidate)
    socket.on("iceChange", function (ice) {
      peerConnection.addIceCandidate(ice)
    })
  }
}

function createdOffer(description) {
  localPeerConnection.setLocalDescription(description).then(() => {
    socket.emit("sdpChange", description)
  })
  socket.on("sdpChange", function (description) {
    localPeerConnection.setRemoteDescription(description).then(() => {})
  })
}

const startButton = document.getElementById("startButton")
const callButton = document.getElementById("callButton")
const hangupButton = document.getElementById("hangupButton")

callButton.disabled = true
hangupButton.disabled = true

function startAction() {
  startButton.disabled = true
  navigator.mediaDevices
    .getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream)
}

function callAction() {
  callButton.disabled = true
  hangupButton.disabled = false
  const servers = null

  localPeerConnection = new RTCPeerConnection(servers)
  localPeerConnection.addEventListener("icecandidate", handleConnection)
  localPeerConnection.addStream(localStream)
  localPeerConnection.createOffer(offerOptions).then(createdOffer)
}

function hangupAction() {
  localPeerConnection.close()
  localPeerConnection = null
  hangupButton.disabled = true
  callButton.disabled = false
}

startButton.addEventListener("click", startAction)
callButton.addEventListener("click", callAction)
hangupButton.addEventListener("click", hangupAction)

function getOtherPeer(peerConnection) {
  return peerConnection === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection
}
