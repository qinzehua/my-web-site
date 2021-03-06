function getDay() {
  return new Date().getDay();
}

function getTime() {
  let min = new Date().getMinutes();
  min = min < 10 ? `0${min}` : min;
  return `${new Date().getHours()}.${min}`;
}

function checkTimeTable() {
  const day = getDay();
  const cols = Array.prototype.slice.call(document.querySelectorAll("col"));
  cols.forEach(function (col) {
    if (col.getAttribute("day") == day) {
      col.classList.add("today");
    }
  });

  const rows = Array.prototype.slice.call(document.querySelectorAll("tr"));
  rows.forEach(function (row) {
    if (row.getAttribute("range")) {
      const range = row.getAttribute("range").replace(/:/g, ".").split("~");
      if (+getTime() >= +range[0] && +getTime() <= +range[1]) {
        row.classList.add("now");
      }
    }
  });
}

window.onload = function () {
  setInterval(checkTimeTable, 2000, true);
};
