using Microsoft.EntityFrameworkCore;
using Ord.Tutorial.Entities;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace Ord.Tutorial.Data;

public class TutorialDbContext(DbContextOptions<TutorialDbContext> options) : AbpDbContext<TutorialDbContext>(options)
{
    public virtual DbSet<BookEntity>  Books { get; set; }
    public virtual DbSet<ProvinceEntity> Provinces { get; set; }
    public virtual DbSet<WardEntity> Wards { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();

        /* Configure your own entities here */

        builder.Entity<BookEntity>(b =>
        {
            b.ConfigureByConvention();
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
        });
        builder.Entity<ProvinceEntity>(p =>
        {
            p.ConfigureByConvention(); 

            p.ToTable("Provinces"); 
            p.HasIndex(x => x.Code).IsUnique();
            p.Property(x => x.Code).IsRequired().HasMaxLength(50);
            p.Property(x => x.Name).IsRequired().HasMaxLength(255);
        });

        builder.Entity<WardEntity>(w =>
        {
            w.ConfigureByConvention(); 
            w.HasIndex(x => x.Code).IsUnique();
            w.Property(x => x.Code).IsRequired().HasMaxLength(50);
            w.Property(x => x.Name).IsRequired().HasMaxLength(255);
            w.Property(x => x.ProvinceCode).IsRequired().HasMaxLength(50);
            
            w.HasOne<ProvinceEntity>() 
                .WithMany()  
                .HasForeignKey(w => w.ProvinceCode)  
                .HasPrincipalKey(p => p.Code)       
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
