const drag_item = document.getElementById("draggable")

let active = false;
let Xc, Yc, Xi, Yi;
let xOffset = 0;
let yOffset = 0;

drag_item.addEventListener("mousedown", drag_start)
document.addEventListener("mouseup", drag_end)
document.addEventListener("mousemove", drag);

function drag_start(e) 
{
  if (e.target === drag_item)
  {
    active = true;
    Xi = e.clientX - xOffset;
    Yi = e.clientY - yOffset;

    drag_item.style.userSelect = "none";
  }
}

function drag(e)
{
  if (active)
  {
    e.preventDefault();

    Xc = e.clientX - Xi;
    Yc = e.clientY - Yi;

    xOffset = Xc;
    yOffset = Yc;

    set_translate(Xc, Yc, drag_item);
  }
}

function drag_end(e)
{
  active = false;

  drag_item.style.userSelect = "text";
}

function set_translate(X, Y, el)
{
  el.style.transform = `translate(${X}px, ${Y}px)`;
}
