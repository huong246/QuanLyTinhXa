using Ord.Tutorial.Utils;
using Volo.Abp.Application.Dtos;

namespace Ord.Tutorial.Services.Dtos;

public class BasePagedResultRequestDto:PagedResultRequestDto
{
    public string? Filter { get; set; }
    public string? FilterFts => Filter.ConvertFts();
}