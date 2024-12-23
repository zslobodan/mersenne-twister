const N = 624;
const M = 397;
const W = 32;
const R = 31;
const UMASK = 0xffffffff << R;
const LMASK = 0xffffffff >>> (W - R);
const A = 0x9908b0df;
const U = 11;
const S = 7;
const T = 15;
const L = 18;
const B = 0x9d2c5680;
const C = 0xefc60000;
const F = 1812433253;

type MTState = {
  stateArray: Uint32Array;
  stateIndex: number;
};

function initializeState(state: MTState, seed: number): void {
  const stateArray = state.stateArray;

  // uint32_t* state_array = &(state -> state_array[0]);
  stateArray[0] = seed >>> 0; // converting to unsigned 32-bit

  for (let i = 1; i < N; i++) {
    seed = F * (seed ^ (seed >>> (W - 2))) + i; ///
    stateArray[i] = seed >>> 0;
  }

  state.stateIndex = 0;
}

function randomUint32(state: MTState): number {
  const stateArray = state.stateArray;
  let k = state.stateIndex;

  // int k = k - n; // point to state n iterations
  // if (k < 0) k += n; // modulo n circular indexing the previous 2 lines actually do nothing

  let j = k - (N - 1); // point to state n-1 iterations
  if (j < 0) j += N; // modulo n circular indexin

  let x = (stateArray[k] & UMASK) | (stateArray[j] & LMASK);

  let xA = x >>> 1;
  if (x & 0x00000001) xA ^= A;

  j = k - (N - M); // point to state n-m iterations before
  if (j < 0) j += N; // n cirucular indexing

  x = stateArray[j] ^ xA; // compute the next value in the state
  stateArray[k++] = x; // update the new state val

  if (k >= N) k = 0; // n circular indexing
  state.stateIndex = k;

  let y = x ^ (x >>> U);
  y = y ^ ((y << S) & B);
  y = y ^ ((y << T) & C);
  let z = y ^ (y >>> L);

  return z;
}

function createMTState(): MTState {
  return {
    stateArray: new Uint32Array(N),
    stateIndex: 0,
  };
}

export { initializeState, randomUint32, createMTState };
