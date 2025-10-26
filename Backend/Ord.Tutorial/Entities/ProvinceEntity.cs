using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Tutorial.Entities;
[Table("Provinces")]
public class ProvinceEntity : FullAuditedAggregateRoot<int>
{ 
    [StringLength(50)]
    public string Code { get; set; } = string.Empty;
    [StringLength(255)]
    public string Name { get; set; }  = string.Empty;
    public ICollection<WardEntity> Wards { get; set; } =  new List<WardEntity>();
}