import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { parseCSVFromFile } from "~/utils/parse-csv";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const csv = formData.get("csv") as File;

  return json(await parseCSVFromFile(csv));
};
