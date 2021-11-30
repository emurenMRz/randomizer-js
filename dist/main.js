import Randomizer from './randomizer.js';

let counter = 0;

function step() {
	const graph = document.getElementById('graph');
	if (!graph || !graph.getContext)
		return;
	const ctx = graph.getContext('2d');
	const w = graph.clientWidth;
	const h = graph.clientHeight;
	const offset = Randomizer.random() * w * h | 0;
	ctx.beginPath();
	ctx.arc(offset % w, offset / w | 0, 1, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.closePath();
	++counter;
	document.getElementById('counter').textContent = counter;
	requestAnimationFrame(step);
}

addEventListener('load', () => {
	step();
});
