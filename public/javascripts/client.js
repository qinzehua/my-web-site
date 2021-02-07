var videoplay = document.querySelector("video#player");
const canvas = document.querySelector("#canvas");
const takePhoto = document.querySelector("#takePhoto");
const download = document.querySelector("#download");
const filter = document.querySelector("#filter");

function gotMediaStream(stream) {
  var videoTrack = stream.getVideoTracks()[0];

  window.stream = stream;
  videoplay.srcObject = stream;
}

function handleError(err) {
  console.log("getUserMedia error:", err);
}

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is not supported!");
    return;
  } else {
    var constraints = {
      video: {
        width: 680,
        height: 480,
        frameRate: 15,
        facingMode: "environment",
      },
      audio: false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotMediaStream)
      .catch(handleError);
  }
}

start();

takePhoto.addEventListener("click", () => {
  selected = filter.value;
  const ctx = canvas.getContext("2d");
  if (selected === "sepia") {
    ctx.filter = "sepia(1)";
  } else if (selected === "grayscale") {
    ctx.filter = "grayscale(1)";
  } else if (selected === "blur") {
    ctx.filter = "blur(3px)";
  } else if (selected === "invert") {
    ctx.filter = "invert(1)";
  } else if (selected === "rotate") {
    ctx.filter = "hue-rotate(30deg)";
  } else if (selected === "opacity") {
    ctx.filter = "opacity(75%)";
  } else {
    ctx.filter = "none";
  }
  ctx.drawImage(videoplay, 0, 0, canvas.width, canvas.height);
});

download.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg");
  a.download = "自拍";
  document.body.appendChild(a);
  a.click();
  a.remove();
});
