using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ord.Tutorial.Entities;
using Ord.Tutorial.Services.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Ord.Tutorial.Services
{
    // [Authorize]
    public class BookAppService :
        CrudAppService<
            BookEntity, //The Book entity
            BookDto, //Used to show books
            int, //Primary key of the book entity
            BookPagedRequestDto, //Used for paging/sorting
            CreateUpdateBookDto>
    {
        public BookAppService(IRepository<BookEntity, int> repository) : base(repository)
        {
            // CreatePolicyName = "Book.Create";
            // UpdatePolicyName = "Book.Update";
        }

        [HttpPost]
        public override Task<PagedResultDto<BookDto>> GetListAsync(BookPagedRequestDto input)
        {
            return base.GetListAsync(input);
        }

        protected override async Task<IQueryable<BookEntity>> CreateFilteredQueryAsync(BookPagedRequestDto input)
        {
            var query = await base.CreateFilteredQueryAsync(input);
            query = query.WhereIf(!string.IsNullOrEmpty(input.Filter), x => x.Name.Contains(input.FilterFts))
                .WhereIf(input.Type.HasValue, x => x.Type == input.Type);
            return query;
        }
        


        // hàm map value dto -> entity cho create
        protected override BookEntity MapToEntity(CreateUpdateBookDto createInput)
        {
            return base.MapToEntity(createInput);
        }

        // hàm map value dto -> entity cho update
        protected override void MapToEntity(CreateUpdateBookDto updateInput, BookEntity entity)
        {
            base.MapToEntity(updateInput, entity);
        }
    }
}