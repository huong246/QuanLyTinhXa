using Microsoft.Extensions.Localization;
using Ord.Tutorial.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Ord.Tutorial;

[Dependency(ReplaceServices = true)]
public class TutorialBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<TutorialResource> _localizer;

    public TutorialBrandingProvider(IStringLocalizer<TutorialResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
