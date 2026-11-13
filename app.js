import { cards, classify } from './guide.mjs';
const form = document.querySelector('#report');
const description = document.querySelector('#description');
const result = document.querySelector('#result');
const district = document.querySelector('#district');
const viewport = document.querySelector('#viewport');
const stops = [
  [60, 92, 'Park litter'],
  [128, 157, 'Full bin'],
  [240, 185, 'Bulky waste'],
  [278, 71, 'Hazard']
];

function place(kind, x, y, width, depth) {
  const piece = document.createElement(kind === 'pin' ? 'button' : 'div');
  piece.className = kind;
  Object.assign(piece.style, { left: x + 'px', top: y + 'px', width: width + 'px', height: depth + 'px' });
  district.append(piece);
  return piece;
}

function cube(x, y, width, depth, height, paint, roof, tree = false) {
  const piece = place(tree ? 'cube tree' : 'cube', x, y, width, depth);
  piece.style.setProperty('--height', height + 'px');
  piece.style.setProperty('--paint', paint);
  piece.style.setProperty('--roof', roof);
  for (const face of ['wall-x', 'wall-s', 'wall-y', 'wall-e', 'roof']) {
    const side = document.createElement('div');
    side.className = 'face ' + face;
    piece.append(side);
  }
}

place('road vertical', 150, 0, 29, 270);
place('road', 0, 122, 330, 28);
for (const [x, y] of [[10, 9], [188, 9], [10, 159], [188, 159]]) place('lot', x, y, 132, 101);
place('pond', 33, 24, 67, 42);
place('walk', 24, 82, 106, 10);
for (const [x, y] of [[19, 23], [109, 22], [108, 55], [26, 65], [23, 180], [114, 218], [200, 26], [300, 220]]) {
  cube(x, y, 13, 13, 22, '#517749', '#83a965', true);
}
cube(209, 26, 52, 61, 50, '#bc7251', '#e7a77a');
cube(275, 19, 32, 34, 34, '#d2ae65', '#f2cf87');
cube(40, 179, 46, 62, 45, '#6f9f9c', '#a5c9b8');
cube(92, 177, 35, 30, 32, '#bc8861', '#e7b78f');
cube(198, 181, 33, 59, 42, '#9b9e70', '#c6c992');
cube(261, 174, 43, 44, 56, '#cf9d60', '#edd197');
cube(121, 154, 12, 10, 13, '#365d51', '#558274');

let yaw = -28;
let pitch = 53;
let drag;

function renderCamera() {
  district.style.setProperty('--yaw', yaw + 'deg');
  district.style.setProperty('--pitch', pitch + 'deg');
  district.style.setProperty('--zoom', Math.min(.95, viewport.clientWidth / 365));
}

new ResizeObserver(renderCamera).observe(viewport);
document.querySelector('#left').onclick = () => { yaw -= 30; renderCamera(); };
document.querySelector('#right').onclick = () => { yaw += 30; renderCamera(); };
document.querySelector('#reset').onclick = () => { yaw = -28; pitch = 53; renderCamera(); };
viewport.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.target.closest('button')) return;
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add('dragging');
});
viewport.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return;
  yaw += (event.clientX - drag.x) * .45;
  pitch = Math.min(67, Math.max(24, pitch - (event.clientY - drag.y) * .3));
  Object.assign(drag, { x: event.clientX, y: event.clientY });
  renderCamera();
});
viewport.addEventListener('lostpointercapture', () => {
  drag = undefined;
  viewport.classList.remove('dragging');
});

const examples = [...form.querySelectorAll('[data-example]')];
for (const [index, [x, y, label]] of stops.entries()) {
  const pin = place('pin', x, y, 33, 33);
  pin.type = 'button';
  pin.dataset.stop = index;
  pin.textContent = String(index + 1).padStart(2, '0');
  pin.setAttribute('aria-label', label);
}
const hotspotButtons = [...document.querySelectorAll('[data-stop]')];
for (const button of hotspotButtons) {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    for (const hotspot of hotspotButtons) {
      hotspot.setAttribute('aria-pressed', String(hotspot.dataset.stop === button.dataset.stop));
    }
    description.value = examples[Number(button.dataset.stop)].dataset.example;
    description.focus();
  });
}
description.addEventListener('input', () => {
  for (const hotspot of hotspotButtons) hotspot.setAttribute('aria-pressed', 'false');
});

for (const button of form.querySelectorAll('[data-example]')) {
  button.addEventListener('click', () => {
    description.value = button.dataset.example;
    for (const hotspot of hotspotButtons) hotspot.setAttribute('aria-pressed', 'false');
    description.focus();
  });
}

function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!description.value.trim()) {
    result.replaceChildren(element('p', 'Enter a short description to continue.'));
    return;
  }
  const card = cards[classify(description.value)];
  const steps = element('ol', '');
  for (const step of card.steps) steps.append(element('li', step));
  result.replaceChildren(element('h2', card.title), element('p', card.route), steps, element('small', 'Local rules'));
});
