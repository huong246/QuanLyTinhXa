using FluentValidation;
using Microsoft.Extensions.Localization;
using Ord.Tutorial.Entities;
using Ord.Tutorial.Localization;
using Ord.Tutorial.Services.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Ord.Tutorial.Services.Validator;

public class CreateUpdateProvinceDtoValidator :  AbstractValidator<CreateUpdateProvinceDto>
{
   
    public CreateUpdateProvinceDtoValidator(IRepository<ProvinceEntity, int> repository,
        IStringLocalizer<TutorialResource> L)
    {
        CascadeMode = CascadeMode.Stop;
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage(L["CodeRequired"])
            .Length(2, 50).WithMessage(L["CodeLength", 2, 50]);
        
        RuleFor(x => x.Name).NotEmpty().WithMessage(L["NameRequired"])
            .Length(2,255).WithMessage(L["NameLength", 2, 255]);

    }
}