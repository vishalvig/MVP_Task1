
using System;
using OnboardingMVP.Models;
using OnboardingMVP.Dto;

namespace OnboardingMVP.Code
{
    public static class Mapper
    {
        public static Dto.SaleDto MapSale(Models.Sale Sale)
        {
            var sale = new Dto.SaleDto

            {
                SalesAmount = Sale?.Product.Price,
                CustomerName = Sale?.Customer?.Name,
                ProductName = Sale?.Product?.Name,
                StoreName = Sale?.Store?.Name,
                DateSold = Sale.DateSold,
                Id = Sale.Id,
                ProductId = Sale.Product.Id,
                CustomerId = Sale.Customer.Id,
                StoreId = Sale.Store.Id,

            };
            return sale;
        }
        
        public static Dto.CustomerDto MapCustomerDto(Models.Customer Customer)
        {
            var customer = new CustomerDto();
            if (Customer != null)
            {
                customer = new Dto.CustomerDto
                {
                    Id = Customer.Id,
                    Name = Customer?.Name,
                    Address = Customer?.Address,
                };
            }
            return customer;
        }
        public static Models.Customer MapCustomer(CustomerDto Customer)
        {
            var customer = new Models.Customer();
            if (Customer != null)
            {
                customer.Id = Customer.Id;
                customer.Address = Customer.Address;
                customer.Name = Customer.Name;
               
            }
            return customer;
        }

    }
}
