using Ord.Tutorial.Entities;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Ord.Tutorial.Data;

public class ProvinceWardDataSeedContributor(IRepository<ProvinceEntity, int> provinceRepository)
    : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<ProvinceEntity, int> _provinceRepository = provinceRepository;

    public async Task SeedAsync(DataSeedContext context)
    { 
        if (!await _provinceRepository.AnyAsync(p => p.Code == "122"))
        {
            var HaNoi = new ProvinceEntity
            {
                Code = "122",
                Name = "HaNoi",
                Wards = new List<WardEntity>
                { 
                    new WardEntity { Code = "HK", Name = "Quận Hoàn Kiếm", ProvinceCode = "122" },
                    new WardEntity { Code = "BD", Name = "Quận Ba Đình", ProvinceCode = "122" },
                    new WardEntity { Code = "DD", Name = "Quận Đống Đa", ProvinceCode = "122" }
                }
            };
            await _provinceRepository.InsertAsync(HaNoi, autoSave: true);
        }
 
        if (!await _provinceRepository.AnyAsync(p => p.Code == "HCM"))
        {
            var hcm = new ProvinceEntity
            {
                Code = "HCM",
                Name = "Hồ Chí Minh",
                Wards = new List<WardEntity>
                {
                    new WardEntity { Code = "Q1", Name = "Quận 1", ProvinceCode = "HCM" },
                    new WardEntity { Code = "Q3", Name = "Quận 3", ProvinceCode = "HCM" },
                    new WardEntity { Code = "QTB", Name = "Quận Tân Bình", ProvinceCode = "HCM" }
                }
            };
            await _provinceRepository.InsertAsync(hcm, autoSave: true);
        }
 
        if (!await _provinceRepository.AnyAsync(p => p.Code == "HCM1"))
        {
            var hcm1 = new ProvinceEntity
            {
                Code = "HCM1",
                Name = "Hồ Chí Minh1",
                Wards = new List<WardEntity>
                { 
                    new WardEntity { Code = "Q1_HCM1", Name = "Quận 1", ProvinceCode = "HCM1" },
                    new WardEntity { Code = "Q3_HCM1", Name = "Quận 3", ProvinceCode = "HCM1" },
                    new WardEntity { Code = "QTB_HCM1", Name = "Quận Tân Bình", ProvinceCode = "HCM1" }
                }
            };
            await _provinceRepository.InsertAsync(hcm1, autoSave: true);
        }
 
        if (!await _provinceRepository.AnyAsync(p => p.Code == "HCM2"))
        {
            var hcm2 = new ProvinceEntity
            {
                Code = "HCM2",
                Name = "Hồ Chí Minh2",
                Wards = new List<WardEntity>
                {
                    new WardEntity { Code = "Q1_HCM2", Name = "Quận 1", ProvinceCode = "HCM2" },
                    new WardEntity { Code = "Q3_HCM2", Name = "Quận 3", ProvinceCode = "HCM2" },
                    new WardEntity { Code = "QTB_HCM2", Name = "Quận Tân Bình", ProvinceCode = "HCM2" }
                }
            };
            await _provinceRepository.InsertAsync(hcm2, autoSave: true);
        }
 
        if (!await _provinceRepository.AnyAsync(p => p.Code == "HCM3"))
        {
            var hcm3 = new ProvinceEntity
            {
                Code = "HCM3",
                Name = "Hồ Chí Minh3",
                Wards = new List<WardEntity>
                {
                    new WardEntity { Code = "Q1_HCM3", Name = "Quận 1", ProvinceCode = "HCM3" },
                    new WardEntity { Code = "Q3_HCM3", Name = "Quận 3", ProvinceCode = "HCM3" },
                    new WardEntity { Code = "QTB_HCM3", Name = "Quận Tân Bình", ProvinceCode = "HCM3" }
                }
            };
            await _provinceRepository.InsertAsync(hcm3, autoSave: true);
        }
       
    }
}