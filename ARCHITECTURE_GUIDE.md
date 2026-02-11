# Architecture & Integration Guide

## Component Hierarchy

```
pages/products/index.js (Products Page)
    ↓
features/products/index.js (ProductGrid Component)
    ├─ GridView (Original - Grid of Cards)
    │   └─ GridItem (Individual product card)
    └─ TableView (New - Editable Table)
        └─ ProductEditableTable
            ├─ Table with editable cells
            ├─ Delete confirmation dialog
            └─ Action handlers (edit, save, delete)
```

## Data Flow Architecture

### Grid View (Existing)
```
ProductGrid receives:
├─ productsList (from useFetchProductsList hook)
├─ productTypes (from useFetchProductTypeList hook)
├─ selectedBranch (selected brand)
└─ filters (category, subcategory, search)

↓

Filters applied to create SortedProductList

↓

GridItem components rendered for each product
```

### Table View (New)
```
ProductGrid receives:
├─ productsList (from useFetchProductsList hook)
├─ productTypes (from useFetchProductTypeList hook)
├─ SortedProductList (filtered products)
├─ selectedBranch (selected brand)
└─ setReload callback

↓

ProductEditableTable receives:
├─ products (all products)
├─ filteredProducts (SortedProductList - respects filters)
├─ productTypes
├─ selectedBrand
└─ onReload

↓

Table renders with filters applied

↓

User edits row → saves to API → onReload refreshes data
```

## State Management

### ProductGrid Component State
```javascript
// View mode
const [viewMode, setViewMode] = useState('grid');  // 'grid' | 'table'

// Filters (apply to both views)
const [category, setCategory] = useState();
const [subCategory, setSubCategory] = useState();
const [SortedProductList, setSortedProductList] = useState([]);

// Other existing states...
```

### ProductEditableTable Component State
```javascript
// Editing
const [editingId, setEditingId] = useState(null);        // Currently editing product ID
const [editData, setEditData] = useState({});            // Current edit form data
const [loading, setLoading] = useState(false);           // Loading during save/delete

// Deletion
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [productToDelete, setProductToDelete] = useState(null);
```

## Data Transformation Pipeline

### 1. Fetch Raw Data
```javascript
const { productsList } = useFetchProductsList(reload, selectedBranch);
const { productTypes } = useFetchProductTypeList(true, selectedBranch);
```

### 2. Apply Filters
```javascript
const searchProducts = (search) => {
  let result = productsList.filter(
    (item) => item.name.toLowerCase().includes(searchNameLower)
  );
  
  if (category && subCategory) {
    result = result.filter(
      (item) => item.productTypeId === category?.id && 
                item.productSubTypeId === subCategory
    );
  }
  
  setSortedProductList(result);
};
```

### 3. Render Based on View Mode
```javascript
{viewMode === 'grid' ? (
  <GridView products={SortedProductList} />
) : (
  <TableView products={SortedProductList} />
)}
```

## API Integration Points

### Update Product
```javascript
// File: src/features/products/ProductEditableTable.js
// Function: handleSave()

const payload = {
  id: product.id,
  productTypeId: editData.productTypeId,
  productSubTypeId: editData.productSubTypeId,
  name: editData.name,
  // ... other fields
  brandId: selectedBrand.id
};

await storeServices.updateProduct(payload);

// Success → Snackbar notification → onReload() → ProductGrid refetches
```

### Delete Product
```javascript
// File: src/features/products/ProductEditableTable.js
// Function: handleConfirmDelete()

await storeServices.deleteProduct(productToDelete.id);

// Success → Snackbar notification → onReload() → ProductGrid refetches
```

## Component Communication

### Parent to Child (Props)
```
ProductGrid
    ↓ passes props
ProductEditableTable
    props: {
      products,
      filteredProducts,
      productTypes,
      selectedBrand,
      onReload
    }
```

### Child to Parent (Callbacks)
```
ProductEditableTable
    ↓ calls onReload()
ProductGrid
    ↓ calls setReload((prev) => !prev)
Hook: useFetchProductsList
    ↓ re-fetches data
ProductGrid state updates
    ↓ re-renders with fresh data
```

## Hook Dependencies

### ProductGrid Dependencies
```javascript
useFetchProductsList(reload, selectedBranch)
  → Re-fetches when reload changes or selectedBranch changes

useFetchProductTypeList(true, selectedBranch)
  → Always enabled, fetches when selectedBranch changes
```

### ProductEditableTable Dependencies
```javascript
useMemo(() => {
  return filteredProducts || products;
}, [filteredProducts, products])
  → Recalculates display when filtered products change
```

## Validation Flow

### Edit Validation
```
User clicks Save
    ↓
handleSave() validates payload
    ↓
API call with full payload
    ↓
API validates on server
    ↓
Success/Error response
    ↓
Snackbar notification
    ↓
onReload() callback
    ↓
ProductGrid refetches data
```

## Error Handling Strategy

```
API Call in handleSave/handleDelete
    ↓
try/catch block
    ↓
Error caught
    ├─ console.error() for debugging
    └─ enqueueSnackbar() for user feedback
    ↓
finally block
    └─ setLoading(false) → re-enable buttons
```

## Performance Considerations

### Memoization
```javascript
// Filter options (prevents recalculation)
const subTypes = useMemo(() => {
  const temp = productTypes.find((e) => e.id === category?.id);
  return temp ? [...temp.subTypes].sort(...) : [];
}, [category, productTypes]);

// Display products (prevents unnecessary calculations)
const displayProducts = useMemo(() => {
  return filteredProducts || products;
}, [filteredProducts, products]);
```

### Efficient State Updates
```javascript
// Single state update for form
setEditData((prev) => ({
  ...prev,
  [field]: value
}));
```

## Responsive Design

### Breakpoints Used
```javascript
sx={{ width: { xs: '100%', sm: 260 } }}  // Mobile first
```

### Table Responsiveness
```javascript
TableContainer component={Paper}  // Horizontal scroll on mobile
stickyHeader                       // Header stays visible while scrolling
```

## Accessibility Features

- Tooltips on action buttons
- Semantic table structure (TableHead, TableBody)
- Form labels and ARIA attributes via Material-UI
- Keyboard navigation support (Tab, Enter, Space)
- IconButton with proper tooltips
- Dialog with proper focus management

## Testing Strategy

### Unit Tests
- handleEdit() → state updates correctly
- handleSave() → validates and calls API
- handleDelete() → confirmation dialog appears
- handleInputChange() → state updates correctly

### Integration Tests
- Switching views (grid ↔ table)
- Editing product → saving → data updates
- Deleting product → confirmation → list refreshes
- Filters apply to table view
- Category change updates subcategory options

### E2E Tests
- Full product edit workflow
- Full product delete workflow
- Filter and then edit
- Switch views and filter

## Future Enhancement Possibilities

1. **Inline Image Upload**: Add image preview and upload in table
2. **Bulk Operations**: Select multiple rows and edit/delete together
3. **Column Customization**: Show/hide columns based on user preference
4. **Advanced Sorting**: Click column headers to sort
5. **Export to CSV**: Download table data as CSV
6. **Row Grouping**: Group by category or type
7. **Search Highlighting**: Highlight search terms in table
8. **Undo/Redo**: Revert recent changes
9. **Column Filters**: Filter by individual column values
10. **Pagination**: Handle large product lists efficiently

## Migration Path from Grid to Table

No breaking changes needed. Both views can coexist:
```javascript
// User preference can be saved to localStorage
const [viewMode, setViewMode] = useState(
  localStorage.getItem('productViewMode') || 'grid'
);

useEffect(() => {
  localStorage.setItem('productViewMode', viewMode);
}, [viewMode]);
```

## Debugging Tips

### In Browser DevTools Console
```javascript
// Check current edit data
console.log('editData:', editData);

// Check display products
console.log('displayProducts:', displayProducts);

// Monitor API calls
// Network tab → look for updateProduct/deleteProduct requests
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Save button disabled | Validation failing | Check required fields |
| Changes not appearing | onReload not called | Check callback chain |
| Table empty after filter | Wrong filtered products passed | Check filter logic in ProductGrid |
| Delete not working | API error | Check browser console for error |
| Type/Category not loading | productTypes empty | Check useFetchProductTypeList hook |
