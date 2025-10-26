import { Pipe, PipeTransform } from '@angular/core';
import { BookType } from '@proxy/entities';

@Pipe({
  name: 'bookTypeColor',
  standalone: true
})
export class BookTypeColorPipe implements PipeTransform {

  transform(bookType: BookType) {
    const colorMap = {
      [BookType.Adventure]: 'orange',
      [BookType.Biography]: 'blue',
      [BookType.Dystopia]: 'red',
      [BookType.Horror]: 'volcano',
      [BookType.Science]: 'cyan',
      [BookType.ScienceFiction]: 'geekblue',
      [BookType.Poetry]: 'magenta'
    };
    return colorMap[bookType] || 'default';
  }

}
