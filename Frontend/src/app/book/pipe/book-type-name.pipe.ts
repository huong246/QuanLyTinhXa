import { Pipe, PipeTransform } from '@angular/core';
import { BookType } from '@proxy/entities';
import { BookTypeOptions } from '../shared/book.const';

@Pipe({
  name: 'bookTypeName',
  standalone: true
})
export class BookTypeNamePipe implements PipeTransform {

  transform(bookType: BookType) {
    const colorMap = {};
    BookTypeOptions.forEach((item) => {
      colorMap[item.value] = item.label;
    });
    return colorMap[bookType] || 'Chưa rõ';
  }

}
