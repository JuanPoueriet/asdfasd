export interface SearchResult {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface SearchResultGroup {
  type: 'Invoices' | 'Products' | 'Customers';
  results: SearchResult[];
}
