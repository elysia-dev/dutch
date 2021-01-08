const commaFormatter = (input: number | string) => {
  if (typeof input === 'number') {
    const n = String(input);
    const p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
      p < 0 || i < p ? `${m},` : m,
    );
  } else if (typeof input === 'string') {
    const p = input.indexOf('.');
    return input.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
      p < 0 || i < p ? `${m},` : m,
    );
  }
  return '';
};

export default commaFormatter;
