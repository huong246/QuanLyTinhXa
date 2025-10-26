using Microsoft.EntityFrameworkCore;
using Volo.Abp.DependencyInjection;

namespace Ord.Tutorial.Data;

public class TutorialEFCoreDbSchemaMigrator : ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public TutorialEFCoreDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the TutorialDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<TutorialDbContext>()
            .Database
            .MigrateAsync();
    }
}
