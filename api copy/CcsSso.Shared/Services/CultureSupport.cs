using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CcsSso.Shared.Services
{
  public static class CultureSupport
  {

    public static bool IsValidCountryCode(string countyCode)
    {
      return GetCountryNameByCode(countyCode) != null;
    }

    public static string GetCountryNameByCode(string countyCode)
    {
      try
      {
        RegionInfo regionInfo = new RegionInfo(countyCode);
        return regionInfo.EnglishName;
      }
      catch (ArgumentException)
      {
      }
      return null;
    }
  }
}
