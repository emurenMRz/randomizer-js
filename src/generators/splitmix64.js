/**
 * splitmix64 generator
 */

import UI64 from '../ui64.js';

export default class Splitmix64 {
	constructor(seed) {
		this.seed = new UI64(seed);
	}

	get next() {
		this.seed = this.seed.add(new UI64(0x9E3779B9, 0x7f4A7C15));
		let result = this.seed.clone;
		result = result.shr(30).xor(result).mul(new UI64(0xBF58476D, 0x1CE4E5B9));
		result = result.shr(27).xor(result).mul(new UI64(0x94D049BB, 0x133111EB));
		return result.shr(31).xor(result);
	}
}

