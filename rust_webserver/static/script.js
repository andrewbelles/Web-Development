// Circles and rod 
const circle_a = document.getElementById("a");
const circle_b = document.getElementById("b");
const line    = document.querySelector(".line");
const circles = [circle_a, circle_b];

function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width/2, y: r.top + r.height/2 };
}

const C1 = centerOf(circle_a);
const C2 = centerOf(circle_b);
let L  = 200;
const u0 = { x: (C2.x - C1.x)/L, y: (C2.y - C1.y)/L };

let active_circle  = null;
let passive_circle = null;
let grab = { x:0, y:0 };
let dragging = false;

circles.forEach(c => {
  c.addEventListener("mousedown", e => {
    dragging = true;
    active_circle  = c;
    passive_circle = (c === circle_a ? circle_b : circle_a);
    const R = c.getBoundingClientRect();
    grab.x = e.clientX - R.left;
    grab.y = e.clientY - R.top;
    c.style.userSelect = "none";
  });
});

document.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;
  active_circle.style.userSelect = "";
  active_circle = passive_circle = null;
});

document.addEventListener("mousemove", e => {
  if (!dragging) return;
  e.preventDefault();

  const new_left = e.clientX - grab.x;
  const new_top  = e.clientY - grab.y;
  active_circle.style.left = new_left + "px";
  active_circle.style.top  = new_top  + "px";

  const new_c = {
    x: new_left + active_circle.clientWidth/2,
    y: new_top  + active_circle.clientHeight/2
  };

  const old_passive = centerOf(passive_circle);

  const v = {
    x: old_passive.x - new_c.x,
    y: old_passive.y - new_c.y 
  };

  const mag = Math.hypot(v.x, v.y);
  if (mag === 0) return; // avoid div by 0 
  const u   = { x: v.x/mag, y: v.y/mag };

  const pass_center = {
    x: new_c.x + u.x * L,
    y: new_c.y + u.y * L
  };
  
  passive_circle.style.left = (pass_center.x - passive_circle.clientWidth/2) + "px";
  passive_circle.style.top  = (pass_center.y - passive_circle.clientHeight/2) + "px";
});

function redraw_rod(A, B) {
  const dx = B.x - A.x, dy = B.y - A.y;
  const distance  = Math.hypot(dx, dy);
  let angle = (Math.atan2(dy, dx) * 180/Math.PI + 360) % 360;

  line.style.left      = `${A.x}px`;
  line.style.top       = `${A.y}px`;
  line.style.width     = `${distance}px`;
  line.style.transform = `rotate(${angle}deg)`;
}

const slider = document.getElementById("length_slider");
const length_value = document.getElementById("length_value");

slider.addEventListener("input", e => {
  L = +e.target.value;
  length_value.textContent = L;

  const A = centerOf(circle_a);
  const B = centerOf(circle_b);
  const dx = B.x - A.x, dy = B.y - A.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return;             // avoid /0

  const ux = dx/dist, uy = dy/dist;

  const new_B = { x: A.x + ux * L, y: A.y + uy * L };

  circle_b.style.left = (new_B.x - circle_b.clientWidth/2) + "px";
  circle_b.style.top  = (new_B.y - circle_b.clientHeight/2) + "px";

  redraw_rod(A, new_B);
});

slider.dispatchEvent(new Event("input"));

let prev_A = { x: 0, y: 0}, prev_B = { x: 0, y: 0};
requestAnimationFrame(update_rod);

function update_rod()
{
  const A = centerOf(circle_a);
  const B = centerOf(circle_b);
  if (A.x !== prev_A.x || A.y !== prev_A.y || B.x !== prev_B.x || B.y !== prev_B.y)
  {
    redraw_rod(A, B);
    prev_A = A;
    prev_B = B;
  }
  requestAnimationFrame(update_rod);
}
