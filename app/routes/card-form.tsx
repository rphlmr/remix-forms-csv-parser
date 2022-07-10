import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getCardRanges } from "~/services/card/get-card-range";

type LoaderData = {
  cardRanges: Awaited<ReturnType<typeof getCardRanges>>;
};

export const loader: LoaderFunction = async () => {
  return json({ cardRanges: await getCardRanges() });
};

export default function FormCard() {
  const [cardQuantity, setCardQuantity] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const contactFileUploader = useFetcher();
  const loaderData = useLoaderData() as LoaderData;

  const totalCardQuantity =
    (cardQuantity || contactFileUploader.data?.length) ?? 0;

  const submitUpload = (formData: FormData) => {
    contactFileUploader.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
      action: "api/parse-contact-file",
    });
  };

  return (
    <div>
      <Form style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="amount">
          Montant de la carte :{" "}
          <input
            id="amount"
            name="amount"
            type="number"
            min={1}
            required
            onChange={(e) => setCardAmount(Number.parseInt(e.target.value, 10))}
          />
        </label>

        <label htmlFor="range">
          Gamme de la carte :{" "}
          <select id="range" name="range" required>
            <option value="">Choisir une gamme</option>
            {loaderData?.cardRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="type">
          Type de la carte :{" "}
          <select id="type" name="type" required>
            <option value="">Choisir un type</option>
            <option value="type-1">translate-key:type-1</option>
            <option value="type-2">translate-key:type-2</option>
            <option value="type-3">translate-key:type-3</option>
          </select>
        </label>

        <label htmlFor="quantity">
          Quantité de carte :{" "}
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            required
            onChange={(e) =>
              setCardQuantity(Number.parseInt(e.target.value, 10))
            }
          />
        </label>

        <contactFileUploader.Form
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.nativeEvent.preventDefault();

            const file = e.dataTransfer.files?.[0];

            if (!file) return;

            const formData = new FormData();
            formData.set("contact-file", file);

            submitUpload(formData);
          }}
          onChange={(e) => {
            const formData = new FormData(e.currentTarget);

            submitUpload(formData);
          }}
        >
          <div>
            <label htmlFor="contact-file">
              <span>Upload a file</span>
              <input id="contact-file" name="contact-file" type="file" />
            </label>
            <p>or drag and drop</p>
          </div>
          <p>XLSX, CSV up to 5MB</p>
        </contactFileUploader.Form>

        <p>Liste des gens : </p>
        <pre>{JSON.stringify(contactFileUploader.data)}</pre>

        <div
          style={{
            border: "1px solid black",
            width: "fit-content",
            padding: 12,
            marginTop: 50,
          }}
        >
          <p>Quantité de cartes : {totalCardQuantity}</p>
          <p>Prix final de l'opération' : {totalCardQuantity * cardAmount}€</p>
        </div>
      </Form>
    </div>
  );
}
