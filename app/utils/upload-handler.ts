import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
} from "@remix-run/node";

export const allowedMimeTypes = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
};

type UploadedFile = {
  filepath: string;
  type: string;
};

export function isUploadedFile(file: unknown): file is UploadedFile {
  return (file as UploadedFile) != null;
}

export const uploadHandler = unstable_composeUploadHandlers(
  unstable_createFileUploadHandler({
    maxPartSize: 5_000_000,
    file: ({ filename }) => `contact-uploads/${filename}`,
    filter: ({ contentType }) =>
      Object.values(allowedMimeTypes).includes(contentType),
  })
);
