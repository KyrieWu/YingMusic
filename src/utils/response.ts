export function setFontSize() {
  var cWidth = document.documentElement.clientWidth;
  if (cWidth <= 414) {
    document.documentElement.style.fontSize = cWidth / 37.5 + "px";
  } else {
    const fontSize = document.documentElement.style.fontSize;

    if (fontSize !== "62.5%") {
      document.documentElement.style.fontSize = "62.8%";
    }
  }
}
