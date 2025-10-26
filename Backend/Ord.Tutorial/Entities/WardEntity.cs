using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Tutorial.Entities;
[Table("Wards")]
public class WardEntity : FullAuditedEntity<int>
{
    [StringLength(50)]
    public string Code { get; set; } = string.Empty;
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;
    [StringLength(50)]
    public string ProvinceCode {get; set;} = string.Empty; 
}