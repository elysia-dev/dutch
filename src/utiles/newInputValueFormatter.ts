function newInputValueFormatter(oldValue: string, newValue: string) {
  return newValue === '.' && !oldValue
    ? '0.'
    : newValue !== '0' && oldValue === '0'
    ? newValue
    : oldValue + newValue;
}

export default newInputValueFormatter;
