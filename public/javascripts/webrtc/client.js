var videoplay = document.querySelector("video#player")
var desktopPlay = document.querySelector("video#pc-player")

function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is not supported!")
    return
  } else {
    var constraints = {
      video: {
        width: 680,
        height: 480,
        frameRate: 15,
        facingMode: "environment",
      },
      audio: false,
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotMediaStream)
      .catch(handleError)
  }

  function gotMediaStream(stream) {
    window.stream = stream
    videoplay.srcObject = stream
  }

  function handleError(err) {
    console.log("getUserMedia error:", err)
  }
}
startCamera()

function startDesktopRecord() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    console.log("getDisplayMedia is not supported!")
    return
  } else {
    var constraints = {
      video: {
        width: 640,
        height: 480,
        frameRate: 15,
      },
      audio: false,
    }

    navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then(gotMediaStream)
      .catch(handleError)
  }

  function gotMediaStream(stream) {
    window.desktopStream = stream
    console.log(desktopPlay, stream)
    desktopPlay.srcObject = stream
  }

  function handleError(err) {
    console.log("getDisplayMedia error:", err)
  }
}

startDesktopRecord()
