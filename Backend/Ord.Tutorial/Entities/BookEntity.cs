using LiteDB;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Tutorial.Entities
{
    [Table("sys_books")]
    public class BookEntity : FullAuditedEntity<int>
    {
        [MaxLength(50)] public string? Code { get; set; }
        [MaxLength(200)] public string Name { get; set; }
        public BookType Type { get; set; }
        public DateTime PublishDate { get; set; }

        public float Price { get; set; }
    }

    public enum BookType
    {
        Undefined,
        Adventure,
        Biography,
        Dystopia,
        Fantastic,
        Horror,
        Science,
        ScienceFiction,
        Poetry
    }
}