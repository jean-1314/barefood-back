export const latinize = (str: string): string => {
  str = str.toLowerCase().replace(/<.+>/, ' ').replace(/\s+/, ' ');
  const c = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
    'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-', ';': '', ':': '', ',': '', '—': '-', '–': '-', '.': '', '«': '', '»': '', '"': '', '\'': '', '@': '',
  };
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    newStr += ch in c ? c[ch] : ch;
  }
  return newStr;
  // const newString = str.toString();
  // const from = [
  //   'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф',
  //   'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
  // const to = [
  //   'a', 'b', 'v', 'g', 'd', 'e', 'yo', 'zh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f',
  //   'h', 'ts', 'tsch', 'sh', 'shch', 'y', 'y', '\'', 'e', 'yu', 'ya'];
  // for (const key in from) {
  //   str = newString.replace(new RegExp(from[key], 'g'), to[key]);
  // }
  // return str.toLowerCase();
};

export const slugify = (str: string): string => {
  const latinString = latinize(str);
  console.log(latinString);
  return latinString
    .normalize('NFD')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};
