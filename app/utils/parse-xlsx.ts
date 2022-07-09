import xlsx from "node-xlsx";
import fs from "fs";

export async function parseXLSXFromFile(filePath: string) {
  return new Promise((resolve) => {
    const sheets = xlsx.parse(filePath, {
      header: ["name", "age"],
      sheets: [0],
      range: 2,
    });

    fs.rm(filePath, () => {
      return resolve(sheets[0].data as { name: string; age: number }[]);
    });
  });
}
