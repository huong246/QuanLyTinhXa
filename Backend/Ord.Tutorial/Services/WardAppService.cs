using Microsoft.AspNetCore.Mvc;
using Ord.Tutorial.Entities;
using Ord.Tutorial.Services.Dtos;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Ord.Tutorial.Services;

public class WardAppService(IRepository<ProvinceEntity,int> provinceRepository, 
    IRepository<WardEntity, int> wardRepository): CrudAppService<WardEntity, WardDto, int, WardPagedRequestDto, CreateUpdateWardDto>(wardRepository)
{
    private readonly IRepository<WardEntity, int> _wardRepository = wardRepository;


    [HttpGet("search-ward")]
    protected override async Task<IQueryable<WardEntity>> CreateFilteredQueryAsync( WardPagedRequestDto input)
    {
        var query = await _wardRepository.GetQueryableAsync();
        query = query.WhereIf(!string.IsNullOrWhiteSpace(input.ProvinceCode), 
            x => x.ProvinceCode == input.ProvinceCode);
        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            var filterText = input.Filter.Trim();
            query = query.Where(x =>
                    x.Code.Contains(filterText) ||       
                    x.Name.Contains(filterText) ||       
                    x.ProvinceCode.Contains(filterText) 
            );
        }

        return query;
    }
    
    [HttpPost("get-list-ward")]
    public override Task<PagedResultDto<WardDto>> GetListAsync( WardPagedRequestDto input)
    {
        return base.GetListAsync(input);
    }

    [HttpPost("get-list-ward-in-a-province")]
    public async Task<List<WardDto>> GetListAsyncByProvinceCode(string provinceCode)
    {
        if (string.IsNullOrWhiteSpace(provinceCode))
        {
            throw new UserFriendlyException("ProvinceCode must be provided");
        }

        var provinceExists = await provinceRepository.AnyAsync(x => x.Code == provinceCode);
        if (!provinceExists)
        {
            throw new UserFriendlyException($"Province with code {provinceCode} not found");
        }
        var wardEntities = await _wardRepository.GetListAsync(
            predicate: x=>x.ProvinceCode == provinceCode,
            includeDetails: false,
            cancellationToken: CancellationToken.None);
        return ObjectMapper.Map<List<WardEntity>, List<WardDto>>(wardEntities);
    }

    //các xã/phường/thị trấn của các tỉnh khác nhau có thể có cùng tên, cùng tỉnh thì không 
    [HttpPost("create-ward")]
    public override async Task<WardDto> CreateAsync(CreateUpdateWardDto input)
    {
        var province = await provinceRepository.FirstOrDefaultAsync(x => x.Code == input.ProvinceCode);
        if (province == null)
        {
            throw new UserFriendlyException($"Province with code {input.ProvinceCode} not found");
        }
        var wardExists = await _wardRepository.AnyAsync(x => x.Code == input.Code);
        if (wardExists)
        {
            throw new UserFriendlyException($"Ward with code {input.Code} is already exist");
        }
        var sameNameSameProvince = await _wardRepository.AnyAsync(
            x => x.ProvinceCode == input.ProvinceCode && x.Name == input.Name);

        if (sameNameSameProvince)
            throw new UserFriendlyException($"Ward name '{input.Name}' already exists in this province.");

        try
        {
            return await base.CreateAsync(input);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            when (ex.InnerException?.Message.Contains("Duplicate entry") ?? false)
        {
            throw new UserFriendlyException($"Ward with code {input.Code} is already exist.");
        }
    }
    
    [HttpPut("update-ward")]

    public override async Task<WardDto> UpdateAsync(int id, CreateUpdateWardDto input)
    { 
        var ward = await _wardRepository.FirstOrDefaultAsync(x => x.Id == id);
        if (ward == null)
            throw new UserFriendlyException($"Ward with id {id} not found");
        if (ward.Code != input.Code)  
        {
            var codeTaken = await _wardRepository.AnyAsync(x => x.Code == input.Code);
            if (codeTaken)
                throw new UserFriendlyException($"Ward with code {input.Code} already exists");
        }
        var sameNameSameProvince = await _wardRepository.AnyAsync(
            x => x.ProvinceCode == input.ProvinceCode 
                 && x.Name == input.Name
                 && x.Id != id);
        if (sameNameSameProvince)
            throw new UserFriendlyException($"Ward name '{input.Name}' already exists in this province.");
        try
        {
            return await base.UpdateAsync(id, input);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            when (ex.InnerException?.Message.Contains("Duplicate entry") ?? false)
        {
            throw new UserFriendlyException($"Ward with code {input.Code} is already exist.");
        }
    }

    [HttpDelete("delete-ward")]
    public override async Task DeleteAsync(int id)
    {
        var ward = await _wardRepository.FirstOrDefaultAsync(w => w.Id == id);
        if (ward == null)
        {
            throw new UserFriendlyException($"Ward with id {id} not found");
        }

        await base.DeleteAsync(id);
    }
}