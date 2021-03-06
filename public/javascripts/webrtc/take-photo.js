const canvas = document.querySelector("#canvas")
canvas.width = 640
canvas.height = 480
const takePhoto = document.querySelector("#takePhoto")
const download = document.querySelector("#download-photo")
const filter = document.querySelector("#filter")
const muted = document.querySelector("#muted")

takePhoto.addEventListener("click", () => {
  selected = filter.value
  const ctx = canvas.getContext("2d")
  if (selected === "sepia") {
    ctx.filter = "sepia(1)"
  } else if (selected === "grayscale") {
    ctx.filter = "grayscale(1)"
  } else if (selected === "blur") {
    ctx.filter = "blur(3px)"
  } else if (selected === "invert") {
    ctx.filter = "invert(1)"
  } else if (selected === "rotate") {
    ctx.filter = "hue-rotate(30deg)"
  } else if (selected === "opacity") {
    ctx.filter = "opacity(75%)"
  } else {
    ctx.filter = "none"
  }
  ctx.drawImage(videoplay, 0, 0, 640, 480)
})

download.addEventListener("click", () => {
  const a = document.createElement("a")
  a.href = canvas.toDataURL("image/jpeg")
  a.download = "自拍"
  document.body.appendChild(a)
  a.click()
  a.remove()
})

muted.addEventListener("click", () => {
  videoplay.muted = !videoplay.muted
  console.log(videoplay.muted, videoplay.volume)
  muted.innerHTML = videoplay.muted ? "打开音量" : "静音"
})
