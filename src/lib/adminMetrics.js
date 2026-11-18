export function monthlyAmounts(rows, { amount = "amountKobo", predicate = () => true } = {}) {
  const values = Array(12).fill(0);
  for (const row of rows || []) {
    if (!predicate(row)) continue;
    const date = new Date(row.createdAt || "");
    const kobo = Number(row[amount]);
    if (Number.isNaN(date.getTime()) || !Number.isFinite(kobo)) continue;
    values[date.getMonth()] += kobo / 100 / 1_000_000;
  }
  return values;
}
