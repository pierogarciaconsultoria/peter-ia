
// Mock service for non-conforming products - replace with actual implementation when non_conforming_products table exists
export interface NonConformingProduct {
  id: string;
  product_name: string;
  description: string;
  requirement_id?: string;
  detected_date: string;
  status: 'identified' | 'in_progress' | 'resolved' | 'approved' | 'rejected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  approval_status: 'pending' | 'approved' | 'rejected';
  responsible: string;
  created_at: string;
  updated_at: string;
}

// Mock data for demonstration
const mockProducts: NonConformingProduct[] = [
  {
    id: '1',
    product_name: 'Produto A - Lote 001',
    description: 'Dimensões fora do especificado',
    requirement_id: '8.7',
    detected_date: '2024-01-15',
    status: 'in_progress',
    severity: 'medium',
    approval_status: 'approved',
    responsible: 'João Silva',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    product_name: 'Produto B - Lote 002',
    description: 'Material com defeito visual',
    requirement_id: '8.7',
    detected_date: '2024-01-20',
    status: 'resolved',
    severity: 'low',
    approval_status: 'approved',
    responsible: 'Maria Santos',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-22T15:00:00Z'
  }
];

export async function getNonConformingProducts(): Promise<NonConformingProduct[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
}

export async function getNonConformingProductById(id: string): Promise<NonConformingProduct> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = mockProducts.find(p => p.id === id);
  if (!product) {
    throw new Error('Non-conforming product not found');
  }
  
  return product;
}

export async function createNonConformingProduct(product: Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>): Promise<NonConformingProduct> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newProduct: NonConformingProduct = {
    ...product,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockProducts.push(newProduct);
  return newProduct;
}

export async function updateNonConformingProduct(id: string, product: Partial<Omit<NonConformingProduct, 'id' | 'created_at' | 'updated_at'>>): Promise<NonConformingProduct> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Non-conforming product not found');
  }
  
  mockProducts[index] = {
    ...mockProducts[index],
    ...product,
    updated_at: new Date().toISOString()
  };
  
  return mockProducts[index];
}

export async function deleteNonConformingProduct(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Non-conforming product not found');
  }
  
  mockProducts.splice(index, 1);
}
