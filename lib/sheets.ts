// Server-side sheet names, and the old browser storage keys they replace.
export const SHEET_KEYS = [
  'customers',
  'sales_ledger',
  'preorder_by_item',
  'preorder_by_customer',
  'items_preorder',
  'items_available',
  'pricing_preorder',
  'pricing_available',
  'customer_matrix',
] as const;

export type SheetKey = (typeof SHEET_KEYS)[number];

export const LEGACY_LOCAL_KEYS: Record<SheetKey, string> = {
  customers: 'erp_customers_v2',
  sales_ledger: 'erp_sales_ledger_v2',
  preorder_by_item: 'erp_preorder_by_item_v2',
  preorder_by_customer: 'erp_preorder_by_customer_v2',
  items_preorder: 'erp_items_preorder_v2',
  items_available: 'erp_items_available_v2',
  pricing_preorder: 'erp_pricing_preorder_v2',
  pricing_available: 'erp_pricing_available_v2',
  customer_matrix: 'erp_customer_matrix_v2',
};
