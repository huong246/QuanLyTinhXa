using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Ord.Tutorial.Entities;
using Volo.Abp.Application.Dtos;

namespace Ord.Tutorial.Services.Dtos
{
    [AutoMap(typeof(ProvinceEntity), ReverseMap = true)]
        public class ProvinceDto : EntityDto<int>
        {
            public string Code { get; set; } = string.Empty;
            public string Name { get; set; }  = string.Empty;
            public ICollection<WardDto> Wards { get; set; } =  new List<WardDto>();
        }
    [AutoMap(typeof(ProvinceEntity), ReverseMap = true)]
    public class CreateUpdateProvinceDto
    {
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string Name { get; set; }  = string.Empty;
    }

    public class ProvincePagedRequestDto : BasePagedResultRequestDto
    {
        
    }

}
 
    
    
 