const timeZone = "America/Sao_Paulo";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone,
});

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone,
});

export function formatDate(date: Date) {
  return `${dateFormat.format(date)} às ${timeFormat.format(date)}`;
}
