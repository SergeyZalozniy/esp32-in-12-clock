# Utility Classes Documentation

## Flexbox

### Display
- `.flex` - display: flex
- `.flex-col` - display: flex + flex-direction: column
- `.flex-row` - display: flex + flex-direction: row
- `.inline-flex` - display: inline-flex

### Align Items
- `.items-start` - align-items: flex-start
- `.items-center` - align-items: center
- `.items-end` - align-items: flex-end
- `.items-stretch` - align-items: stretch

### Justify Content
- `.justify-start` - justify-content: flex-start
- `.justify-center` - justify-content: center
- `.justify-end` - justify-content: flex-end
- `.justify-between` - justify-content: space-between
- `.justify-around` - justify-content: space-around

### Gap
- `.gap-4` - gap: 4px
- `.gap-8` - gap: 8px
- `.gap-12` - gap: 12px
- `.gap-16` - gap: 16px
- `.gap-20` - gap: 20px
- `.gap-24` - gap: 24px

### Flex Grow/Shrink
- `.flex-1` - flex: 1
- `.flex-shrink-0` - flex-shrink: 0

## Sizing

### Width
- `.w-full` - width: 100%
- `.min-w-0` - min-width: 0

### Height
- `.h-full` - height: 100%

## Usage Examples

### Before (Custom CSS):
```scss
.my-component {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
```

### After (Utility Classes):
```html
<div class="my-component flex items-center justify-between gap-16">
  <!-- content -->
</div>
```

### Complex Example:
```html
<!-- Flex column with gap -->
<div class="flex-col gap-12">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Centered content -->
<div class="flex items-center justify-center">
  <span>Centered</span>
</div>

<!-- Flex with flex-1 child -->
<div class="flex gap-16">
  <div class="flex-1">Grows to fill space</div>
  <button>Fixed width</button>
</div>
```
