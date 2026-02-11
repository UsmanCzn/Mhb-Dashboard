# Product Table Component - Quick Reference

## Component Location
```
src/features/products/ProductEditableTable.js
```

## Import Usage
```javascript
import ProductEditableTable from 'features/products/ProductEditableTable';
```

## Usage Example
```javascript
<ProductEditableTable
  products={productsList}
  filteredProducts={SortedProductList}
  productTypes={productTypes}
  selectedBrand={selectedBranch}
  onReload={() => setReload((prev) => !prev)}
/>
```

## Features at a Glance

### Edit Mode
| Field Type | Components Used |
|-----------|-----------------|
| Text Input | TextField (name, nativeName, descriptions) |
| Number Input | TextField type="number" (price, points, stamps, prep time) |
| Dropdown | Select with MenuItem options |
| Toggle | Switch component for boolean fields |

### Editable Fields
```
✏️ BASIC INFO
├─ Product Name (TextField)
├─ Native Name (TextField)
├─ Product Type (Select)
├─ Product Category (Select)
├─ Price (Number)
├─ Points of Cost (Number)
├─ Stamps For Purchase (Number)
├─ Prep Time in Minutes (Number)
└─ Punch Type (Select with 11 options)

✏️ SETTINGS (Switches)
├─ Featured Product
├─ Top Selling
└─ Delivery Product
```

### Available Punch Types
- Regular
- FreeFood
- SpecialItem
- SpecialProduct
- Speical1
- Speical2
- Speical3
- Speical4
- Acai_Bowl
- Matcha
- Drinks

## User Workflows

### Editing a Product
```
1. Click Edit Icon (pencil) on row
   ↓
2. Row highlights in light blue
   ↓
3. Edit desired fields
   ↓
4. Click Save Icon (checkmark)
   ↓
5. Loading indicator shows
   ↓
6. Success notification displays
```

### Deleting a Product
```
1. Click Delete Icon (trash) on row
   ↓
2. Confirmation dialog appears
   ↓
3. Click Delete to confirm
   ↓
4. Loading indicator shows
   ↓
5. Product list refreshes
```

### Canceling Edit
```
1. Click Cancel Icon (X) while editing
   ↓
2. Changes discarded
   ↓
3. Row returns to normal state
```

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `products` | Array | No | All products data |
| `productTypes` | Array | Yes | Available product types with subtypes |
| `selectedBrand` | Object | Yes | Currently selected brand |
| `onReload` | Function | Yes | Callback to refresh product list |
| `filteredProducts` | Array | No | Filtered products (if not provided, uses `products`) |

## State Management

### Internal States
```javascript
editingId          // ID of product being edited
editData           // Current edit data
loading            // Loading state during save/delete
deleteDialogOpen   // Delete confirmation dialog visibility
productToDelete    // Product pending deletion
```

## API Calls

### Update Product
```javascript
storeServices.updateProduct(payload)
// Returns: Promise
// Success: Product updated, snackbar notification shown
// Error: Error notification displayed
```

### Delete Product
```javascript
storeServices.deleteProduct(productId)
// Returns: Promise
// Success: Product deleted, list refreshed
// Error: Error notification displayed
```

## UI Feedback

### Visual Indicators
- **Editing Row**: Light blue background (#f0f7ff)
- **Hover State**: Light gray background (#fafafa)
- **Action Buttons**: 
  - Edit: Primary blue color
  - Delete: Red color
  - Save: Green color
  - Cancel: Red color

### Notifications
- **Success**: Green snackbar with "Product updated/deleted successfully"
- **Error**: Red snackbar with "Failed to update/delete product"

### Loading States
- Icons replaced with CircularProgress during operations
- Buttons disabled during loading

## Keyboard Support
- Standard Material-UI components support:
  - Tab navigation
  - Enter to submit (in text fields)
  - Space to toggle switches
  - Arrow keys for selects

## Responsive Behavior
- Sticky table header
- Horizontal scrolling on smaller screens
- Actions column always visible
- Columns have minimum widths

## Styling

### Table Styling
```javascript
sx={{
  backgroundColor: isEditing ? '#f0f7ff' : 'white',
  '&:hover': { backgroundColor: isEditing ? '#f0f7ff' : '#fafafa' }
}}
```

### Component Heights
- Sticky header for scroll
- Action buttons: small size
- Input fields: small variant

## Error Handling

### Validation
- Required fields marked with asterisks in form
- Empty fields prevented from submission
- Type validation on number fields

### API Errors
- Caught and logged to console
- User-friendly error messages
- No blocking errors - list can still be interacted with

## Integration Points

### With ProductGrid Component
```javascript
// In src/features/products/index.js
<ProductEditableTable
  products={productsList}
  filteredProducts={SortedProductList}
  productTypes={productTypes}
  selectedBrand={selectedBranch}
  onReload={() => setReload((prev) => !prev)}
/>
```

### View Toggle
```javascript
<ToggleButtonGroup value={viewMode} exclusive>
  <ToggleButton value="grid"><GridViewIcon /></ToggleButton>
  <ToggleButton value="table"><TableChartIcon /></ToggleButton>
</ToggleButtonGroup>
```

## Performance Notes
- Memoization of product type lookups via `useMemo`
- Efficient edit state tracking
- Single row editing at a time
- Debouncing on filter changes applies to both views

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Material-UI v5+ required

## Testing Considerations
- Test edit functionality for each field type
- Test save with valid and invalid data
- Test delete confirmation dialog
- Test filter application to table
- Test brand switching while editing
- Test error handling (network failures, etc.)
