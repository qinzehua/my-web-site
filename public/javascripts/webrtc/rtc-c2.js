var socket = io()

const remoteVideo = document.getElementById("remoteVideo")
let remoteStream
let remotePeerConnection

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
    socket.emit("iceChange", newIceCandidate)
    socket.on("iceChange", function (ice) {
      peerConnection.addIceCandidate(ice)
    })
  }
}

function createdAnswer(description) {
  remotePeerConnection.setLocalDescription(description).then(() => {
    socket.emit("sdpChange", description)
  })
}

remotePeerConnection = new RTCPeerConnection(null)
remotePeerConnection.addEventListener("icecandidate", handleConnection)
remotePeerConnection.addEventListener("addstream", gotRemoteMediaStream)

socket.on("sdpChange", function (description) {
  remotePeerConnection.setRemoteDescription(description).then(() => {
    remotePeerConnection.createAnswer().then(createdAnswer)
  })
})
