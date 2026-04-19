
export const getLongestRowIndex = (data: ChartData[][]): number => {
  return data.reduce(
    (maxIdx, row, idx, arr) => (row.length > arr[maxIdx].length ? idx : maxIdx),
    0,
  );
};

export const getLongestNameIndex = (data: NameData[]): number => {
  return data.reduce(
    (maxIdx, row, idx, arr) => (row.length > arr[maxIdx].length ? idx : maxIdx),
    0,
  );
};