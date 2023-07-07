"use strict"

const color_mode_btn = document.querySelector('.color-mode');
const erase_btn = document.querySelector('.erase-mode');
const clear_btn = document.querySelector('.clear');
const grid_checkbox = document.querySelector('.show-grid');
const rainbow_mode_btn = document.querySelector('.rainbow-mode');
const shadow_mode_btn = document.querySelector('.shadow-mode');

color_mode_btn.onclick = () => color_mode('color');
erase_btn.onclick = () => color_mode('erase');
clear_btn.onclick = () => clear();
rainbow_mode_btn.onclick = () => color_mode('rainbow');
shadow_mode_btn.onclick = () => color_mode('shadow');
grid_checkbox.onchange = () => toggle_grid();

const size_ui = document.getElementById('myRange');
size_ui.addEventListener("input", function() {
    update_slide_label();
    create_whiteboard();
    color_mode('color');
    set_active(color_mode_btn);
    grid_checkbox.checked = true;
});

const color_pick = document.querySelector('.pick-color');
color_pick.addEventListener("input", function() {
    color_mode('color');
    set_active(color_mode_btn);
})

function update_slide_label() {
    document.querySelector(".slide-label").textContent = `${size_ui.value} x ${size_ui.value}`;
}

function create_whiteboard() {
    let size = size_ui.value;
    let divs = size * size;
    const whiteboard = document.querySelector('.whiteboard');
    let side = whiteboard.clientWidth / size;
    whiteboard.replaceChildren();
    for (let i=0; i < divs; i++) {
        let div = document.createElement('div');
        div.classList.add('whiteboard-div');
        div.classList.add('grid');
        div.setAttribute("style",`width: ${side}px; height :${side}px`);
        whiteboard.appendChild(div);
    }
}

function color_mode(mode) {
    const whiteboard_divs = document.querySelectorAll('.whiteboard-div');
    whiteboard_divs.forEach(div => {
        div.removeEventListener('mouseover', rainbow_mode);
        div.removeEventListener('mouseover', shadow_mode);
        div.removeEventListener('mouseover', color_func);
        div.removeEventListener('mouseover', erase_mode);
      });
    if (mode == 'rainbow') {
        whiteboard_divs.forEach(div => div.addEventListener('mouseover', rainbow_mode));
    }
    else if (mode == 'shadow') {
        whiteboard_divs.forEach(div => div.addEventListener('mouseover', shadow_mode));
    }
    else if (mode == 'erase') {
        whiteboard_divs.forEach(div => div.addEventListener('mouseover', erase_mode));
    }
    else if (mode == 'color') {
        whiteboard_divs.forEach(div => div.addEventListener('mouseover', color_func));
    }
}

function rainbow_mode() {
    this.style.backgroundColor = getRandomColor();
}

function color_func() {
    this.style.backgroundColor = document.querySelector('.pick-color').value;;
}

function shadow_mode() {
    this.style.backgroundColor = darken(window.getComputedStyle(this).backgroundColor);
}

function erase_mode() {
    this.style.backgroundColor = 'white';
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function darken(color) {
    let hex = rgba2hex(color).slice(1);
    let darker = LightenDarkenColor(hex, -20);
    darker = '#' + darker;
    return darker
}

const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`;

function LightenDarkenColor(col, amt) {
    col = parseInt(col, 16);
    return (((col & 0x0000FF) + amt) | ((((col >> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
}

const control_btns = document.querySelectorAll('.activable');
control_btns.forEach(button => button.addEventListener('click', function() {
    set_active(button);
}));

function set_active(button_to_active) {
    const control_btns = document.querySelectorAll('.activable');
    control_btns.forEach(btn => btn.classList.remove('my-active'));
    button_to_active.classList.add('my-active');
}

function clear() {
    const whiteboard_divs = document.querySelectorAll('.whiteboard-div');
    whiteboard_divs.forEach(div => div.style.backgroundColor = "white");
}

function toggle_grid() {
    const whiteboard_divs = document.querySelectorAll('.whiteboard-div');
    whiteboard_divs.forEach(div => div.classList.toggle('grid'));
}


// initial whiteboard creating while refreshing the page
create_whiteboard();

