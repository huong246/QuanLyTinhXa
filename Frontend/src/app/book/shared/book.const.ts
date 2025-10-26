import { BookType } from '@proxy/entities';

export const BookTypeOptions = [
  { label: 'Phiêu lưu', value: BookType.Adventure },
  { label: 'Tiểu sử', value: BookType.Biography },
  { label: 'Dystopia', value: BookType.Dystopia },
  { label: 'Kinh dị', value: BookType.Horror },
  { label: 'Khoa học', value: BookType.Science },
  { label: 'Viễn tưởng', value: BookType.ScienceFiction },
  { label: 'Thơ ca', value: BookType.Poetry }
];
