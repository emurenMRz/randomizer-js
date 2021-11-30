/**
 * Xoroshiro128plus generator
 *  algorithm author: Sebastiano Vigna
 *  license: public domain
 *  https://vigna.di.unimi.it/
 */

import UI64 from '../ui64.js';
import Splitmix64 from "./splitmix64.js";

export default class Xoroshiro128plus {
	#seed = null;

	constructor(seed) { this.seed = seed; }

	toString() {
		const s = this.#seed;
		return !s ? '<no seed>' : `${s[0]}:${s[1]}:${s[2]}:${s[3]}`;
	}

	get seed() { return this.#seed; }

	set seed(value) {
		if (!value)
			this.#seed = [new UI64(1), new UI64(2)];
		else if (typeof (value) === 'array' && value.length == 2)
			this.#seed = value;
		else {
			const gen = new Splitmix64(value);
			const result = [];
			result.push(gen.next);
			result.push(gen.next);
			this.#seed = result;
		}
	}

	/**
	 * 64bit integer random value.
	 * @returns {Number} The random value between 0 and 2^64-1.
	 */
	get next() {
		const s0 = this.#seed[0];
		let s1 = this.#seed[1];
		const result = s0.add(s1);
		s1 = s1.xor(s0);
		this.#seed[0] = s0.rotl(24).xor(s1).xor(s1.shl(16));
		this.#seed[1] = s1.rotl(37);
		return result;
	}

	/**
	 * Math.random() compatibility.
	 * @returns {Number} The random value between 0 (inclusive) and 1 (exclusive).
	 */
	random() { return (this.next.number - 1) / Number.MAX_SAFE_INTEGER; }
}