// record desktop
var recvideoPC = document.querySelector("video#pc-player")
var btnRecordPC = document.querySelector("button#pc-record")
var btnPlaypc = document.querySelector("button#pc-recplay")
var btnDownloadPC = document.querySelector("button#pc-download-video")

var desktopBuffer
var desktopMediaRecorder

function desktopHandleDataAvailable(e) {
  if (e && e.data && e.data.size > 0) {
    desktopBuffer.push(e.data)
  }
}

function desktopStartRecord() {
  desktopBuffer = []

  var options = {
    mimeType: "video/webm;codecs=vp8",
  }

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported!`)
    return
  }

  try {
    desktopMediaRecorder = new MediaRecorder(window.desktopStream, options)
  } catch (e) {
    console.error("Failed to create MediaRecorder:", e)
    return
  }

  desktopMediaRecorder.ondataavailable = desktopHandleDataAvailable
  desktopMediaRecorder.start(10)
}

function desktopStopRecord() {
  desktopMediaRecorder.stop()
}

btnRecordPC.addEventListener("click", () => {
  if (desktopMediaRecorder && desktopMediaRecorder.state === "recording") {
    desktopStopRecord()
    btnRecordPC.textContent = "开始录制"
    btnPlaypc.disabled = false
    btnDownloadPC.disabled = false
  } else {
    desktopStartRecord()
    btnRecordPC.textContent = "停止录制"
    btnPlaypc.disabled = true
    btnDownloadPC.disabled = true
  }
})

btnPlaypc.addEventListener("click", () => {
  var blob = new Blob(desktopBuffer, { type: "video/webm" })
  console.log(recvideoPC)
  recvideoPC.src = window.URL.createObjectURL(blob)
  recvideoPC.srcObject = null
  recvideoPC.controls = true
  recvideoPC.play()
})

btnDownloadPC.addEventListener("click", () => {
  var blob = new Blob(desktopBuffer, { type: "video/mp4" })
  var url = window.URL.createObjectURL(blob)
  var a = document.createElement("a")

  a.href = url
  a.style.display = "none"
  a.download = "录制.mp4"
  a.click()
  a.remove()
})
