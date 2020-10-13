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
