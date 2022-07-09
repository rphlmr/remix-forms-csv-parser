import type { ActionFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { json } from "@remix-run/node";
import { parseCSVFromFile } from "~/utils/parse-csv";
import { parseXLSXFromFile } from "~/utils/parse-xlsx";
import {
  allowedMimeTypes,
  isUploadedFile,
  uploadHandler,
} from "~/utils/upload-handler";

export const action: ActionFunction = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("contact-file");

  if (!isUploadedFile(file)) return null;

  console.log(formData.get("contact-file"));

  if (file.type === allowedMimeTypes.xlsx) {
    return json(await parseXLSXFromFile(file.filepath));
  } else {
    return json(await parseCSVFromFile(file.filepath));
  }
};
