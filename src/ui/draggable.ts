export function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;
  element.ontouchstart = event => dragMouseDown(event.touches[0], false);

  function dragMouseDown(event, preventDefault = true) {
    event = event || window.event;
    if (preventDefault) {
      event.preventDefault();
    }
    // get the mouse cursor position at startup:
    pos3 = event.clientX;
    pos4 = event.clientY;
    document.onmouseup = closeDragElement;
    document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.ontouchmove = e => {
      e.preventDefault()
      elementDrag(e.touches[0], false)
    };
  }

  function elementDrag(event, preventDefault = true) {
    event = event || window.event;
    if (preventDefault) {
      event.preventDefault();
    }
    // calculate the new cursor position:
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}
