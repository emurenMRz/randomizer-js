/**
 * 64bit unsigned integer class
 */

export default class UI64 {
	constructor(high = 0, low) {
		if (low === undefined) {
			this.high = high / 0x100000000 | 0;
			this.low = high >>> 0;
		} else {
			this.high = high >>> 0;
			this.low = low >>> 0;
		}
	}

	toString() {
		if (this.high > 0) {
			let s = this.high.toString(16);
			s += ('00000000' + this.low.toString(16)).substr(-8);
			return s;
		}
		return this.low.toString(16).substr(-8);
	}

	get clone() { return new UI64(this.high, this.low); }

	/**
	 * Leave the upper 53 bits and keep them within Number.MAX_SAFE_INTEGER.
	 */
	get number() {
		const shift = 11;
		const borrow = this.high << (32 - shift) >>> 0;
		return (this.high >>> shift) * (0xffffffff + 1) + (this.low >>> shift) + borrow;
	}

	add(value) {
		const low = this.low + value.low;
		const high = (this.high + value.high + (low / 0x100000000 | 0));
		return new UI64(high, low);
	}

	mul(value) {
		const ui32mul = (left, right) => {
			const lHigh = left >>> 16;
			const lLow = left & 0xffff;
			const rHigh = right >>> 16;
			const rLow = right & 0xffff;
			const low = lLow * rLow;
			const carray = low >>> 16;
			const high = lLow * rHigh + lHigh * rLow + carray;
			return new UI64(lHigh * rHigh + (high / 65536 | 0), (high << 16) | (low & 0xffff));
		};

		const low = ui32mul(this.low, value.low);
		const carray = new UI64(0, low.high);
		const lh = ui32mul(this.low, value.high);
		const hl = ui32mul(this.high, value.low);
		const hh = new UI64(ui32mul(this.high, value.high).low, 0);
		const high = lh.add(hl).add(carray).add(hh);
		return new UI64(high.low, low.low);
	}

	xor(value) { return new UI64(this.high ^ value.high, this.low ^ value.low); }

	shl(shift) {
		shift &= 0x3f;
		if (!shift) return this.clone;
		let high = 0;
		let low = 0;
		if (shift < 32) {
			const carray = this.low >>> (32 - shift);
			low = this.low << shift >>> 0;
			high = (this.high << shift >>> 0) + carray;
		} else {
			shift -= 32;
			high = this.low << shift >>> 0;
		}
		return new UI64(high, low);
	}

	shr(shift) {
		shift &= 0x3f;
		if (!shift) return this.clone;
		let high = 0;
		let low = 0;
		if (shift < 32) {
			const borrow = this.high << (32 - shift) >>> 0;
			high = this.high >>> shift;
			low = (this.low >>> shift) + borrow;
		} else {
			shift -= 32;
			low = this.high >>> shift;
		}
		return new UI64(high, low);
	}

	rotl(shift) {
		shift &= 0x3f;
		if (!shift) return this.clone;
		let high = 0;
		let low = 0;
		if (shift < 32) {
			const csh = 32 - shift;
			const carray1 = this.low >>> csh;
			const carray2 = this.high >>> csh;
			low = (this.low << shift >>> 0) + carray2;
			high = (this.high << shift >>> 0) + carray1;
		} else {
			shift -= 32;
			const csh = 32 - shift;
			const carray1 = this.low >>> csh;
			const carray2 = this.high >>> csh;
			low = (this.high << shift >>> 0) + carray1;
			high = (this.low << shift >>> 0) + carray2;
		}
		return new UI64(high, low);
	}
}
