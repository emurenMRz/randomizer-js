/**
 * Xorshift128 generator(Basic algorithm)
 *  algorithm author/licensee: George Marsaglia (July 2003). “Xorshift RNGs”
 *  license: CC-BY 3.0
 *  https://www.jstatsoft.org/article/view/v008i14
 */

import Splitmix64 from "./splitmix64.js";

export default class Xorshift128 {
	#seed = null;

	constructor(seed) { this.seed = seed; }

	toString() {
		const s = this.#seed;
		return !s ? '<no seed>' : `${s[0]}:${s[1]}:${s[2]}:${s[3]}`;
	}

	get seed() { return this.#seed; }

	set seed(value) {
		if (!value)
			this.#seed = [123456789, 362436069, 521288629, 88675123];
		else if (typeof (value) === 'array' && value.length == 4)
			this.#seed = value;
		else {
			const gen = new Splitmix64(value);
			const result = [];

			let tmp = gen.next;
			result.push(tmp.low);
			result.push(tmp.high);
			tmp = gen.next;
			result.push(tmp.low);
			result.push(tmp.high);
			this.#seed = result;
		}
	}

	/**
	 * 32bit integer random value.
	 * @returns {Number} The random value between 0 and 0xffffffff.
	 */
	get next() {
		const m = this.#seed[0] << 11 >>> 0; // >>> 0: To unsigned integer value.
		const t = (this.#seed[0] ^ m) >>> 0;
		this.#seed[0] = this.#seed[1], this.#seed[1] = this.#seed[2], this.#seed[2] = this.#seed[3];
		this.#seed[3] = ((this.#seed[3] >>> 19) ^ this.#seed[3] >>> 0) ^ ((t >>> 8) ^ t >>> 0) >>> 0;
		return this.#seed[3];
	}

	/**
	 * Math.random() compatibility.
	 * @returns {Number} The random value between 0 (inclusive) and 1 (exclusive).
	 */
	random() { return this.next / (0xffffffff + 1); }
}
