export type CsvRow = Record<string, string>;

/** پارسر ساده CSV با پشتیبانی از فیلدهای داخل کوتیشن و کاما فارسی */
export function parseCsv(text: string): { headers: string[]; rows: CsvRow[] } {
  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (!clean) return { headers: [], rows: [] };

  const delimiter = (clean.split("\n")[0].match(/;/g)?.length ?? 0) > (clean.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";

  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    if (inQuotes) {
      if (char === '"' && clean[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      current.push(field.trim());
      field = "";
    } else if (char === "\n") {
      current.push(field.trim());
      rows.push(current);
      current = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length || current.length) {
    current.push(field.trim());
    rows.push(current);
  }

  const [headerLine, ...body] = rows;
  const headers = (headerLine ?? []).map((h) => h.trim());
  const records = body
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));

  return { headers, rows: records };
}

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const escape = (value: string | number) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))].join("\n");
}

export const storeImportTemplate =
  "name,categoryId,city,district,address,phone,hours,ownerName,status\n" +
  "تعمیرگاه نمونه,mechanic,تهران,سعادت‌آباد,خیابان نمونه پلاک ۱۲,02122334455,شنبه تا پنجشنبه ۹ تا ۱۸,علی محمدی,pending";
