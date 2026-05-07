export const getDiferenciaDias = (creacionPresupuesto) => {
  if (!creacionPresupuesto) return [0, false];
  const creationalDate = new Date(creacionPresupuesto);
  if (isNaN(creationalDate)) return [0, false];
  const actualDate = new Date();
  const esMismoDia = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
  const creadoHoy = esMismoDia(actualDate, creationalDate);
  const diffTiempo = creadoHoy
    ? 0
    : Math.ceil(Math.abs(actualDate - creationalDate) / (1000 * 3600 * 24));
  return [diffTiempo, creadoHoy];
};
