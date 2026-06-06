export const buildPagination = ({ page = 1, limit = 20 }) => {
  const take = Number(limit) > 0 ? Number(limit) : 20;
  const skip = (Number(page) > 0 ? Number(page) - 1 : 0) * take;
  return { skip, take };
};
