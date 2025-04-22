function dragStartHandler(ev) {
  console.log('start drag')
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragOverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}


export { dragStartHandler, dragOverHandler, dropHandler }