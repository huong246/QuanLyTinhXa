 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ord.Tutorial.Data;
using Ord.Tutorial.Entities;
using Ord.Tutorial.Services.Dtos;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;
using Volo.Abp.Users;
using Volo.Abp.Data;
namespace Ord.Tutorial.Services;

public class ProvinceAppService(
    IRepository<ProvinceEntity, int> provinceRepository,
    IRepository<WardEntity, int> wardRepository,
    TutorialDbContext dbContext,
    IClock clock,
    ICurrentUser currentUser)
    : CrudAppService<ProvinceEntity, ProvinceDto, int, ProvincePagedRequestDto, CreateUpdateProvinceDto>(provinceRepository)
{
    private readonly IRepository<ProvinceEntity, int> _provinceRepository = provinceRepository;
    
    [HttpGet("search-province")]
    protected override async Task<IQueryable<ProvinceEntity>> CreateFilteredQueryAsync(ProvincePagedRequestDto input)
    {
        var query = await _provinceRepository.GetQueryableAsync();
        
        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            query = query.Where(x=>
                x.Code.Contains(input.Filter) ||
                x.Name.Contains(input.Filter));
        }
        return query;
    }

    //su dung post de tranh gioi han do dai URL
    [HttpPost("get-list-province")]
    public override async Task<PagedResultDto<ProvinceDto>> GetListAsync(ProvincePagedRequestDto input)
    {
        return await base.GetListAsync(input);
    }

    [HttpGet("get-province-by-id")]

    public override async Task<ProvinceDto> GetAsync(int id)
    {
        var provinceEntity = await _provinceRepository.GetAsync(predicate:
            x=> x.Id == id, includeDetails: true);
        return ObjectMapper.Map<ProvinceEntity, ProvinceDto>(provinceEntity);
    }

    [HttpPost("create-province")]
    public override async Task<ProvinceDto> CreateAsync(CreateUpdateProvinceDto input)
    {
        if (await _provinceRepository.AnyAsync(x => x.Code == input.Code))
            throw new UserFriendlyException($"Province code '{input.Code}' already exists");

        if (await _provinceRepository.AnyAsync(x => x.Name == input.Name))
            throw new UserFriendlyException($"Province name '{input.Name}' already exists");
        try
        {
            return await base.CreateAsync(input);
        }
        catch (DbUpdateException ex)
        {
            Logger.LogError(ex, "Database error while creating province");
            throw new UserFriendlyException(
                "Cannot save data. It may be caused by duplicate data or foreign key constraint.");
        }
    
    }

    [HttpGet("check-ward-exist")]
    public async Task<bool> CheckWardExistenceAsync(int provinceId)
    {
        var province = await _provinceRepository.FirstOrDefaultAsync(x=>x.Id == provinceId);
        if (province == null)
        {
            return true;
        }
        return await wardRepository.AnyAsync(x=>x.ProvinceCode == province.Code);
    }
//chi duoc thay doi ma code khi tinh chua duoc gan cho xa/phuong/thi tran nao
    [HttpPost("update-province")]
    public override async Task<ProvinceDto> UpdateAsync(int id, CreateUpdateProvinceDto input)
    {
        var queryable = await _provinceRepository.GetQueryableAsync();
        //truy van du lieu moi nhat
        var province = await queryable
                           .AsNoTracking() 
                           .FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new UserFriendlyException($"Province with id {id} not found");

        bool codeIsChanging = province.Code != input.Code;
        if (codeIsChanging)
        {
          
            if (await _provinceRepository.AnyAsync(x => x.Code == input.Code && x.Id != id))
                throw new UserFriendlyException($"Province code '{input.Code}' already exists.");

            var isUsedByWard = await wardRepository.AnyAsync(x => x.ProvinceCode == province.Code);
            if (isUsedByWard)
            {
                throw new UserFriendlyException($"Cannot change Code '{province.Code}'. It is linked to one or more Wards!");
            }
        }
        if (province.Name != input.Name &&
            await _provinceRepository.AnyAsync(x => x.Name == input.Name && x.Id != id))
            throw new UserFriendlyException($"Province name '{input.Name}' already exists");
        await using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        { 
            if (codeIsChanging)
            {
                var lastModificationTime = clock.Now;
                var lastModifierId = currentUser.Id;
                var concurrencyStamp = Guid.NewGuid().ToString("N");  

                var rowsAffected = await dbContext.Database.ExecuteSqlInterpolatedAsync(
                     $"""
                     UPDATE Provinces 
                     SET 
                         Code = {input.Code}, 
                         Name = {input.Name},
                         LastModificationTime = {lastModificationTime},
                         LastModifierId = {lastModifierId},
                         ConcurrencyStamp = {concurrencyStamp}
                     WHERE 
                         Id = {id} AND ConcurrencyStamp = {province.ConcurrencyStamp}
                     """
                );
                if (rowsAffected == 0)
                {
                    throw new AbpDbConcurrencyException(
                        "The data has been modified by another user. Please reload and try again.");
                }
            }
            else
            {
                var trackedProvince = await _provinceRepository.GetAsync(id);
                trackedProvince.Name = input.Name;
                trackedProvince.ConcurrencyStamp = Guid.NewGuid().ToString("N");
                await _provinceRepository.UpdateAsync(trackedProvince);
            }
            var updatedEntity = await _provinceRepository.GetAsync(id);
            await transaction.CommitAsync();
            return ObjectMapper.Map<ProvinceEntity, ProvinceDto>(updatedEntity);
        }
        catch (DbUpdateException ex)
        {
            Logger.LogError(ex, "Database error while updating province");
            await transaction.RollbackAsync();
            throw new UserFriendlyException(
                "Cannot save data. It may be caused by duplicate data or foreign key constraint.");
        }
    }

    [HttpDelete("delete-province")]
    public override async Task DeleteAsync(int id)
    {
        var province = await _provinceRepository.FirstOrDefaultAsync(x=> x.Id==id);
        if (province == null)
        {
            throw new UserFriendlyException($"Province not found");
        }
        var ward = await wardRepository.AnyAsync(x=>x.ProvinceCode == province.Code);
        if (ward)
        {
            throw new UserFriendlyException($"Cannot delete. This province is assigned to with wards!");
        }
        await base.DeleteAsync(id);
    }
}
   