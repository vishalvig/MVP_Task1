using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingMVP.Models;
using OnboardingMVP.Code;
using OnboardingMVP.Dto;

namespace OnboardingMVP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly OnboardingTaskContext _context;

        public SalesController(OnboardingTaskContext context)
        {
            _context = context;
        }

        // GET: api/Sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
        {
          if (_context.Sales == null)
          {
              return NotFound();
          }
           var sale = await _context.Sales
                .Include(p => p.Product)
                .Include(s => s.Store)
                .Include(c => c.Customer).ToListAsync();

            return sale.Select(s => Mapper.MapSale(s)).ToList();    
        }

        // GET: api/Sales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sale>> GetSale(int id)
        {
          if (_context.Sales == null)
          {
              return NotFound();
          }
            var sale = await _context.Sales.FindAsync(id);

            if (sale == null)
            {
                return NotFound();
            }

            return sale;
        }

        // PUT: api/Sales/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, SaleDto sale)
        {
            if (id != sale.Id)
            {
                return BadRequest();
            }
            var existingSale = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (existingSale == null)
            {
                return NotFound();
            }


            // Update the relationship between the existing sale and the customer
            existingSale.Customer = await _context.Customers.FirstOrDefaultAsync(c => c.Name == sale.CustomerName);

            // Update the relationship between the existing sale and the product
            existingSale.Product = await _context.Products.FirstOrDefaultAsync(p => p.Name == sale.ProductName);

            // Update the relationship between the existing sale and the store
            existingSale.Store = await _context.Stores.FirstOrDefaultAsync(s => s.Name == sale.StoreName);

            existingSale.DateSold = sale.DateSold;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(sale);
        }

        //_context.Entry(sale).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!SaleExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Sales
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SaleInputDto>> PostSale([FromBody] SaleInputDto saleInputDto)
        {
          if (_context.Sales == null)
          {
              return Problem("Entity set 'OnboardingTaskContext.Sales'  is null.");
          }
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Name == saleInputDto.CustomerName);
            if (customer == null)
            {
                return NotFound($"Customer with name '{saleInputDto.CustomerName}' not found.");
            }

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == saleInputDto.ProductName);
            if (product == null)
            {
                return NotFound($"Product with name '{saleInputDto.ProductName}' not found.");
            }

            var store = await _context.Stores.FirstOrDefaultAsync(s => s.Name == saleInputDto.StoreName);
            if (store == null)
            {
                return NotFound($"Store with name '{saleInputDto.StoreName}' not found.");
            }

            var sale = new Sale
            {
                CustomerId = customer.Id,
                ProductId = product.Id,
                StoreId = store.Id,
                DateSold = saleInputDto.DateSold
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSale", new { id = sale.Id }, sale);
        }

        // DELETE: api/Sales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            if (_context.Sales == null)
            {
                return NotFound();
            }
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SaleExists(int id)
        {
            return (_context.Sales?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
