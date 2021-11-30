/******************************************************************************
  xorshift128 / xoroshiro128+ implemented for ES2015.
******************************************************************************/

import Splitmix64 from "./generators/splitmix64.js";
import Xorshift128 from "./generators/xorshift128.js";
import Xoroshiro128plus from "./generators/xoroshiro128p.js";

export { Splitmix64, Xoroshiro128plus };

export default new Xoroshiro128plus(Date.now());