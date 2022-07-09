import { parse } from "csv-parse";
import fs from "fs";

export async function parseCSVFromFile(filePath: string) {
  return new Promise(async (resolve) => {
    console.log(filePath);
    const records: { name: string; age: number }[] = [];
    const parser = fs.createReadStream(filePath).pipe(
      parse({
        delimiter: ",",
        from: 2, // skip csv header,
        cast: true,
      })
    );

    for await (const record of parser) {
      // Work with each record
      records.push({ name: record[0], age: record[1] });
    }

    console.log(records);

    fs.rm(filePath, () => {
      return resolve(records);
    });
  });
}
