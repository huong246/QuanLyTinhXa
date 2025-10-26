using FluentValidation;
using Microsoft.Extensions.Localization;
using Ord.Tutorial.Entities;
using Ord.Tutorial.Localization;
using Ord.Tutorial.Services.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Ord.Tutorial.Services.Validator;

public class CreateUpdateBookDtoValidator : AbstractValidator<CreateUpdateBookDto>
{
    public CreateUpdateBookDtoValidator(IRepository<BookEntity, int> bookRepository,
        IStringLocalizer<TutorialResource> L)
    {
        CascadeMode = CascadeMode.Stop; // Dừng validator khi gặp lỗi đầu tiên
        
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(L["BookNameRequired"])
            .Length(3, 100).WithMessage(L["BookNameLength", 3, 100]);

        RuleFor(x => x.Price)
            .ExclusiveBetween(0.0f, 2_000_000.0f)
            .WithMessage(L["BookPriceRange", 0, 2_000_000]);

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage(L["BookCodeRequired"])
            .Length(3, 10).WithMessage(L["BookCodeLength", 3, 10]);
        // .MustAsync(async (code, cancellation) =>
        //{
        //  return !await bookRepository.AnyAsync(u => u.Code == code, cancellation);
        //})
        //.WithMessage(L["BookCodeExists"]);
    }
}