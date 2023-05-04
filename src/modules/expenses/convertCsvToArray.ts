import { Expenses } from './useColumns';

export function convertCSVToArray(csv: string) {
  const lines = csv.split("\n");

  if (lines.length === 0 || !lines) return [];

  // What the hell is this typescript error??
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const headers = lines[0].split(",");

  const reducedResult = lines.reduce(
    (acc: Expenses[], line: string, idx: number) => {
      // Skip the headers
      if (idx === 0) return acc;

      const values = line.split(",");

      const obj = headers.reduce((acc, header, index) => {
        return { ...acc, [header]: values[index] };
      }, {}) as Expenses;

      return [...acc, obj];
    },
    [] as Expenses[]
  );

  return reducedResult;
}
