import { useState } from 'react';

// Mock product data
const products = [
  { id: 1, name: 'Product 1', price: 10.99, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', price: 20.99, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Product 3', price: 30.99, image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Product 4', price: 40.99, image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Product 5', price: 50.99, image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Product 6', price: 60.99, image: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Product 7', price: 70.99, image: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Product 8', price: 80.99, image: 'https://via.placeholder.com/150' },
  { id: 9, name: 'Product 9', price: 90.99, image: 'https://via.placeholder.com/150' },
  { id: 10, name: 'Product 10', price: 100.99, image: 'https://via.placeholder.com/150' },
];

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <h1>产品列表</h1>
      <input
        type="text"
        placeholder="搜索商品..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="product-list">
        {currentProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}