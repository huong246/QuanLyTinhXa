using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Ord.Tutorial.Entities;
using Volo.Abp.Application.Dtos;
 


namespace Ord.Tutorial.Services.Dtos
{
    [AutoMap(typeof(WardEntity), ReverseMap = true)]
    public class WardDto : EntityDto<int>
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; }  = string.Empty;
        public string ProvinceCode  { get; set; } = string.Empty; 
    }
    [AutoMap(typeof(WardEntity), ReverseMap = true)]
    public class CreateUpdateWardDto
    {
 
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string Name { get; set; }  = string.Empty;
        [Required]
        [StringLength(255)]
        public string ProvinceCode { get; set; }  = string.Empty;
    }

    public class WardPagedRequestDto : BasePagedResultRequestDto
    {
        public string? ProvinceCode { get; set; } = string.Empty;
    }

}