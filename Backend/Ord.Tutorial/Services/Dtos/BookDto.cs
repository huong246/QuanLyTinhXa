using AutoMapper;
using Ord.Tutorial.Entities;
using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Volo.Abp.Application.Dtos;

namespace Ord.Tutorial.Services.Dtos
{
    [AutoMap(typeof(BookEntity), ReverseMap = true)]
    public class BookDto : EntityDto<int>
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public BookType Type { get; set; }
        public DateTime PublishDate { get; set; }
        public float Price { get; set; }
    }

    [AutoMap(typeof(BookEntity), ReverseMap = true)]
    public class CreateUpdateBookDto
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public BookType Type { get; set; } = BookType.Undefined;
        public DateTime PublishDate { get; set; } = DateTime.Now;
        public float Price { get; set; }
    }
    
    

    public class BookPagedRequestDto: BasePagedResultRequestDto
    {
        public BookType? Type { get; set; }
    }
}