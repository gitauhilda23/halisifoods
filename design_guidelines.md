# Design Guidelines: My Foods & Recipes - Kenyan eBook Marketplace

## Design Approach
**Reference-Based E-Commerce Design** drawing from Shopify, Etsy, and the provided theme references (eMart, Libreria, AnySell), adapted for a culturally-rich Kenyan cuisine marketplace with warm, earthy aesthetics that evoke African culinary heritage.

## Core Design Elements

### Typography System
**Headings**: Montserrat (700, 600, 500 weights)
- Hero titles: 3xl to 5xl (48-60px desktop, 32-40px mobile)
- Section headers: 2xl to 3xl (32-40px desktop, 24-28px mobile)
- Card titles: xl to 2xl (20-28px)

**Body Text**: Lato (400 regular, 700 bold)
- Primary body: base to lg (16-18px)
- Captions/metadata: sm (14px)
- Buttons/CTAs: base with 600 weight

### Layout System
**Spacing Primitives**: Tailwind units of 3, 4, 6, 8, 12, 16, 20, 24
- Section padding: py-16 or py-20 (desktop), py-12 (mobile)
- Card spacing: p-6 to p-8
- Grid gaps: gap-6 to gap-8
- Element margins: mb-4, mb-6, mb-8 for vertical rhythm

**Container Strategy**:
- Full-width sections with max-w-7xl inner containers
- Content-heavy sections: max-w-6xl
- Product grids: 3-4 columns desktop, 2 tablet, 1 mobile

## Component Library

### Home Page Structure
1. **Hero Section** (80vh min-height)
   - Large background image showing vibrant Kenyan cuisine/ingredients
   - Overlay with centered headline and subheadline
   - Primary CTA button (blurred background for contrast)
   - Trust indicators below ("200+ Authentic Recipes" badge/text)

2. **Featured eBooks Grid** (4-column desktop, 2 tablet, 1 mobile)
   - Product cards with hover lift effect (subtle transform)
   - eBook cover image with aspect ratio 3:4
   - Title, brief description, price, "Quick View" button

3. **Category Showcase** (3-column grid)
   - Large category cards with representative food photography
   - Category name overlaid on image
   - eBook count per category

4. **Newsletter Section** (centered, max-w-2xl)
   - Compelling headline about receiving new recipes
   - Email input with inline submit button
   - Privacy reassurance text

5. **Testimonials** (2-3 column grid)
   - Customer quote cards with profile image
   - Star ratings, name, location

6. **Recipe Tips Preview** (Blog section teaser)
   - 3-column grid of blog post cards
   - Featured image, title, excerpt, "Read More" link

### Catalog Page
- **Filter Sidebar** (left, sticky, 1/4 width desktop)
  - Collapsible filter groups: Price range, Diet type, Cuisine type, Ingredients
  - Checkbox filters with counts
  - "Apply Filters" button at bottom

- **Product Grid** (3/4 width, 3-column)
  - Sort dropdown (top-right): Price, Popularity, Newest
  - Pagination at bottom
  - Same product card design as home featured section

### Product Detail Page
- **Two-column layout** (desktop)
  - Left: Large eBook cover image (sticky on scroll)
  - Right: Product information stack
    - Title (2xl), price (3xl, bold)
    - Rating stars with review count
    - Description paragraphs
    - Ingredients list (bulleted)
    - Sample preview link/button
    - Quantity selector + "Add to Cart" primary button
    - Secondary "Add to Wishlist" button

- **Tabs Section** (below)
  - Details, Sample Pages (2-3 preview images), Reviews
  - Related eBooks carousel (4-5 items visible)

### Shopping Cart & Checkout
- **Cart Page**: Table layout (desktop), stacked cards (mobile)
  - Product thumbnail, title, price, quantity adjuster, remove
  - Subtotal, estimated tax, total
  - "Continue Shopping" and "Proceed to Checkout" buttons

- **Checkout Page**: Two-column (desktop)
  - Left: Form sections (Contact, Billing, Payment method)
  - Right: Order summary (sticky)
  - Payment method icons (Stripe, PayPal, M-Pesa logos)

### Blog/Recipe Tips Page
- **Magazine-style layout**
  - Featured post: Large hero card (full-width, 2-column text overlay)
  - Grid of post cards (2-3 columns)
  - Search bar and category tags (top)
  - Sidebar with popular posts, categories

### Hidden Admin Dashboard (/admin-dashboard-secret)
- **Minimal, utility-focused design** (no elaborate styling)
  - Simple sidebar navigation: Dashboard, eBooks, Orders, Users, Analytics
  - Data tables with sort/filter functionality
  - Form layouts for adding/editing eBooks
  - Basic charts for analytics (line charts for sales, pie for categories)
  - Clean, functional aesthetic - focus on usability over visual appeal

## Navigation
**Header**: Sticky on scroll
- Logo (left), centered navigation links (Home, Recipes, Blog, About)
- Search icon, Cart icon with badge count, User account icon (right)
- Mobile: Hamburger menu, logo center, cart icon right

**Footer**: 4-column layout (desktop)
- About section with logo
- Quick links (Shop, Blog, FAQs, Contact)
- Newsletter signup (compact form)
- Social media icons, payment method logos, copyright

## Images
**Large Hero Image**: Yes - Full-width hero on homepage showing colorful Kenyan dishes, fresh ingredients, or cultural cooking scene. Should evoke warmth, authenticity, and appetite appeal.

**Product Images**: eBook cover designs showing appetizing food photography representing the recipes inside.

**Category Images**: Representative dish photography for each cuisine category (Breakfast, Main Dishes, Desserts, Snacks).

**Blog Images**: Featured images for each recipe tip article, styled food photography.

**Background Treatments**: Subtle food-pattern or ingredient illustrations as decorative elements in section backgrounds (low opacity).

## Interaction Patterns
- **Product Cards**: Hover reveals "Quick View" overlay, subtle shadow increase
- **Buttons**: Solid fill with slight scale on hover (no blur backgrounds except on images)
- **Image Galleries**: Lightbox modal for product preview samples
- **Add to Cart**: Success toast notification, cart icon badge animates
- **Infinite Scroll**: Catalog page loads more products as user scrolls (with pagination fallback)

## Responsive Breakpoints
- Mobile: <640px (single column layouts)
- Tablet: 640-1024px (2-column grids)
- Desktop: >1024px (3-4 column grids, sidebar layouts)

## Accessibility
- High contrast between text and backgrounds
- All interactive elements keyboard-navigable
- Alt text for all food photography and product images
- Form labels clearly associated with inputs
- Focus indicators visible on all interactive elements