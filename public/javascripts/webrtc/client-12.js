const mediaStreamConstraints = {
  video: true,
}

const offerOptions = {
  offerToReceiveVideo: 1,
}

const localVideo = document.getElementById("localVideo")
const remoteVideo = document.getElementById("remoteVideo")

let localStream
let remoteStream

let localPeerConnection
let remotePeerConnection

function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream
  localStream = mediaStream
  callButton.disabled = false
}

function gotRemoteMediaStream(event) {
  const mediaStream = event.stream
  remoteVideo.srcObject = mediaStream
  remoteStream = mediaStream
}

function handleConnection(event) {
  const peerConnection = event.target
  const iceCandidate = event.candidate
  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate)
    const otherPeer = getOtherPeer(peerConnection)
    otherPeer
      .addIceCandidate(newIceCandidate)
      .then(() => {})
      .catch((error) => {})
  }
}

function createdOffer(description) {
  localPeerConnection.setLocalDescription(description).then(() => {})
  remotePeerConnection.setRemoteDescription(description).then(() => {})
  remotePeerConnection.createAnswer().then(createdAnswer)
}

function createdAnswer(description) {
  remotePeerConnection.setLocalDescription(description).then(() => {})
  localPeerConnection.setRemoteDescription(description).then(() => {})
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

  remotePeerConnection = new RTCPeerConnection(servers)
  remotePeerConnection.addEventListener("icecandidate", handleConnection)
  remotePeerConnection.addEventListener("addstream", gotRemoteMediaStream)

  localPeerConnection.addStream(localStream)
  localPeerConnection.createOffer(offerOptions).then(createdOffer)
}

function hangupAction() {
  localPeerConnection.close()
  remotePeerConnection.close()
  localPeerConnection = null
  remotePeerConnection = null
  hangupButton.disabled = true
  callButton.disabled = false
  trace("Ending call.")
}

startButton.addEventListener("click", startAction)
callButton.addEventListener("click", callAction)
hangupButton.addEventListener("click", hangupAction)

function getOtherPeer(peerConnection) {
  return peerConnection === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection
}

function getPeerName(peerConnection) {
  return peerConnection === localPeerConnection
    ? "localPeerConnection"
    : "remotePeerConnection"
}
