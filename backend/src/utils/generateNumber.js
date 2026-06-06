export const generateIdCode = (prefix) => {
  const stamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  return `${prefix}-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
};
