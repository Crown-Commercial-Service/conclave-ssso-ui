using CcsSso.Core.Domain.Contracts.External;
using CcsSso.Core.Domain.Dtos.External;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CcsSso.Core.ExternalApi.Controllers
{
  [Route("configurations")]
  [ApiController]
  public class ConfigurationController : ControllerBase
  {
    private IConfigurationDetailService _configurationDetailService;
    public ConfigurationController(IConfigurationDetailService configurationDetailService)
    {
      _configurationDetailService = configurationDetailService;
    }

    /// <summary>
    /// Allows a user to get identity provider details
    /// </summary>
    /// <response  code="200">Ok</response>
    /// <response  code="401">Unauthorised</response>
    /// <remarks>
    /// Sample request:
    ///
    ///     GET configurations/identity-providers
    ///     
    ///     
    ///
    /// </remarks>
    [HttpGet("identity-providers")]
    [SwaggerOperation(Tags = new[] { "Configuration" })]
    [ProducesResponseType(typeof(List<IdentityProviderDetail>), 200)]
    public async Task<List<IdentityProviderDetail>> GetIdentityProviders()
    {
      return await _configurationDetailService.GetIdentityProvidersAsync();
    }

    [HttpGet("roles")]
    [SwaggerOperation(Tags = new[] { "Configuration" })]
    [ProducesResponseType(typeof(List<OrganisationRole>), 200)]
    public async Task<List<OrganisationRole>> GetRoles()
    {
      return await _configurationDetailService.GetRolesAsync();
    }

    [HttpGet("GetCcsServices")]
    public async Task<List<CcsServiceInfo>> GetCcsServices()
    {
      return await _configurationDetailService.GetCcsServicesAsync();
    }
  }
}
