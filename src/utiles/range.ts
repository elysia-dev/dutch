// reference: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/from
function range(start: number, stop: number, step: number): number[] {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step,
  );
}

export default range;
