import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { CustomerList } from "./components/Customer/CustomerList";
import { ProductList } from "./components/Product/ProductList";
import { SaleList } from "./components/Sale/SaleList";
import { StoreList } from "./components/Store/StoreList";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
    },
  {
        path: '/Customer/CustomerList',
        element: <CustomerList />
    },
    {
        path: '/Product/ProductList',
        element: <ProductList />
    },
    {
        path: '/Sale/SaleList',
        element: <SaleList />
    },
    {
        path: '/Store/StoreList',
        element: <StoreList />
    }
];

export default AppRoutes;
