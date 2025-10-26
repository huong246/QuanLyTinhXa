using Ord.Tutorial.Localization;
using Volo.Abp.Application.Services;

namespace Ord.Tutorial.Services;

/* Inherit your application services from this class. */
public abstract class TutorialAppService : ApplicationService
{
    protected TutorialAppService()
    {
        LocalizationResource = typeof(TutorialResource);
    }
}