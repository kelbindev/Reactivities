using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace API.Extension
{
    public static class HttpExtensions
    {
        public static void addPaginationHeader(this HttpResponse httpResponse,
         int currentPage, int itemsPerPage, int totalItems, int totalPages)
         {
             var addPaginationHeader = new {
                 currentPage,
                 itemsPerPage,
                 totalItems,
                 totalPages
             };
             httpResponse.Headers.Add("Pagination",JsonSerializer.Serialize(addPaginationHeader));
             httpResponse.Headers.Add("Access-Control-Expose-Headers","Pagination");
         }
    }
}