using System.Globalization;
using System.Text;

namespace Ord.Tutorial.Utils;

public static class StringUtil
{
    public static string ConvertFts(this string str)
    {
        if (string.IsNullOrEmpty(str))
        {
            return str;
        }

        // Chuyển sang chữ thường
        str = str.ToLower();

        // Xử lý ký tự Đ đặc biệt
        str = str.Replace("đ", "d");

        // Chuẩn hóa Unicode về dạng FormD (tách dấu ra khỏi ký tự)
        var normalizedString = str.Normalize(NormalizationForm.FormD);
        var result = new StringBuilder();

        // Loại bỏ các ký tự dấu (NonSpacingMark)
        foreach (char c in normalizedString)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != UnicodeCategory.NonSpacingMark)
            {
                result.Append(c);
            }
        }

        // Chuẩn hóa lại về FormC
        return result.ToString().Normalize(NormalizationForm.FormC);
    }
}