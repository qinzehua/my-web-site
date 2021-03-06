// record video
var recvideo = document.querySelector("video#recplayer")
var btnRecord = document.querySelector("button#record")
var btnPlay = document.querySelector("button#recplay")
var btnDownload = document.querySelector("button#download-video")

var buffer
var mediaRecorder

function handleDataAvailable(e) {
  if (e && e.data && e.data.size > 0) {
    buffer.push(e.data)
  }
}

function startRecord() {
  buffer = []

  var options = {
    mimeType: "video/webm;codecs=vp8",
  }

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported!`)
    return
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options)
  } catch (e) {
    console.error("Failed to create MediaRecorder:", e)
    return
  }

  mediaRecorder.ondataavailable = handleDataAvailable
  mediaRecorder.start(10)
}

function stopRecord() {
  mediaRecorder.stop()
}

btnRecord.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    stopRecord()
    btnRecord.textContent = "开始录制"
    btnPlay.disabled = false
    btnDownload.disabled = false
  } else {
    startRecord()
    btnRecord.textContent = "停止录制"
    btnPlay.disabled = true
    btnDownload.disabled = true
  }
})

btnPlay.addEventListener("click", () => {
  var blob = new Blob(buffer, { type: "video/webm" })
  recvideo.src = window.URL.createObjectURL(blob)
  recvideo.srcObject = null
  recvideo.controls = true
  recvideo.play()
})

btnDownload.addEventListener("click", () => {
  var blob = new Blob(buffer, { type: "video/mp4" })
  var url = window.URL.createObjectURL(blob)
  var a = document.createElement("a")

  a.href = url
  a.style.display = "none"
  a.download = "录制.mp4"
  a.click()
  a.remove()
})
