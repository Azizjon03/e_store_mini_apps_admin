import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LazyPage } from '@/components/ui/LazyPage';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Orders = lazy(() => import('@/pages/Orders'));
const OrderDetail = lazy(() => import('@/pages/OrderDetail'));
const StockBalances = lazy(() => import('@/pages/StockBalances'));
const StockAdjust = lazy(() => import('@/pages/StockAdjust'));
const Settings = lazy(() => import('@/pages/Settings'));
const Products = lazy(() => import('@/pages/Products'));
const ProductForm = lazy(() => import('@/pages/ProductForm'));
const Categories = lazy(() => import('@/pages/Categories'));
const CategoryForm = lazy(() => import('@/pages/CategoryForm'));
const Brands = lazy(() => import('@/pages/Brands'));
const BrandForm = lazy(() => import('@/pages/BrandForm'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LazyPage><Dashboard /></LazyPage> },
      { path: 'orders', element: <LazyPage><Orders /></LazyPage> },
      { path: 'orders/:id', element: <LazyPage><OrderDetail /></LazyPage> },
      { path: 'stock', element: <LazyPage><StockBalances /></LazyPage> },
      { path: 'stock/:id/adjust', element: <LazyPage><StockAdjust /></LazyPage> },
      { path: 'settings', element: <LazyPage><Settings /></LazyPage> },
      { path: 'products', element: <LazyPage><Products /></LazyPage> },
      { path: 'products/new', element: <LazyPage><ProductForm /></LazyPage> },
      { path: 'products/:id/edit', element: <LazyPage><ProductForm /></LazyPage> },
      { path: 'categories', element: <LazyPage><Categories /></LazyPage> },
      { path: 'categories/new', element: <LazyPage><CategoryForm /></LazyPage> },
      { path: 'categories/:id/edit', element: <LazyPage><CategoryForm /></LazyPage> },
      { path: 'brands', element: <LazyPage><Brands /></LazyPage> },
      { path: 'brands/new', element: <LazyPage><BrandForm /></LazyPage> },
      { path: 'brands/:id/edit', element: <LazyPage><BrandForm /></LazyPage> },
    ],
  },
]);
