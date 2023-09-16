namespace OnboardingMVP.Dto
{
    public class SaleDto
    {
        public int Id { get; set; }

        public decimal? SalesAmount { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public int CustomerId { get; set; }

        public int StoreId { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string StoreName { get; set; } = string.Empty;

        public int ProductId { get; set; } 

        public DateTime? DateSold { get; set; }
    }
}
