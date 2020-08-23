export const latinize = (str: string): string => {
  const newString = str.toString();
  const from = [
    'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф',
    'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
  const to = [
    'a', 'b', 'v', 'g', 'd', 'e', 'yo', 'zh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f',
    'h', 'ts', 'tsch', 'sh', 'shch', 'y', 'y', '\'', 'e', 'yu', 'ya'];
  for (const key in from) {
    str = newString.replace(new RegExp(from[key], 'g'), to[key]);
  }
  return str.toLowerCase();
};

export const slugify = (str: string): string => {
  const latinString = latinize(str);
  return latinString
    .normalize('NFD')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};
