import { parse } from "csv-parse";

export async function parseCSVFromFile(
  file: File
): Promise<{ name: string; age: number }[]> {
  return new Promise(async (resolve) => {
    const parser = parse({
      delimiter: ",",
      from: 2, // skip csv header
    });

    const records: { name: string; age: number }[] = [];

    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push({ name: record[0], age: record[1] });
      }
    });

    parser.on("end", () => {
      return resolve(records);
    });

    parser.write(await file.text());

    parser.end();
  });
}
