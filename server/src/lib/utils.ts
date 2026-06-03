export const generateSlug = (name: string) => {
  const slug =
    name.toLowerCase().replace(/\s+/g, "-") +
    "-" +
    Math.round(Date.now() / 1000);
  return slug;
};

export const generatePlateNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let result = "";
  result += letters.charAt(Math.floor(Math.random() * letters.length));
  result += letters.charAt(Math.floor(Math.random() * letters.length));
  result += letters.charAt(Math.floor(Math.random() * letters.length));
  result += "-";
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return result;
};
