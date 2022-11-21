function toLFixed(num:number, fixed:number) {
  var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)![0];
}

export const getScore = (n: number) => {
  const length = n.toString().length;
  if (length < 4) return `${n}`;
  if (length < 6) {
    let reduced = toLFixed(n / 1000, 1);
    console.log(reduced);
    if (reduced.split('.')[1] === '0') reduced = reduced.split('.')[0]
    return `${reduced}k`
  }
  if (length < 7) {
    return `${Math.round(n/1000)}k`
  }
  return `${Math.round(n/1000000)}m`
}