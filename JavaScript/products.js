// products.js - Enhanced products page functionality

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSort = 'featured';
let currentPage = 1;
const productsPerPage = 12;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Products.js loaded');
    
    // Initialize products page
    initProductsPage();
    
    // Setup event listeners
    setupProductsEventListeners();
    
    // Initialize price range slider
    initPriceRangeSlider();
    
    // Check login status for user menu
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
});

// Initialize products page
async function initProductsPage() {
    try {
        // Show loading state
        showLoadingState();
        
        // Load products
        await loadProducts();
        
        // Apply initial filters
        applyFilters();
        
        // Render products
        renderProducts();
        
        // Setup pagination
        setupPagination();
        
    } catch (error) {
        console.error('Error initializing products page:', error);
        showErrorState();
    }
}

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('json/products.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        allProducts = await response.json();
        console.log('Products loaded:', allProducts.length);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to demo products
        allProducts = getDemoProducts();
    }
}

// Get demo products (fallback)
function getDemoProducts() {
    return [
        {
            id: 1,
            name: "Elegant Blue Evening Dress",
            price: "$129.99",
            originalPrice: "$189.99",
            images: ["https://i.pinimg.com/736x/94/5b/79/945b7931fbb9f8922102ac0566e02060.jpg"],
            category: "Woman",
            subcategory: "Evening Wear",
            description: "Stunning blue evening dress perfect for formal occasions. Features elegant design and comfortable fit. Made from high-quality fabric with delicate detailing.",
            rating: 4.5,
            reviews: 23,
            isTrending: true,
            isNew: false,
            sizes: ["XS", "S", "M", "L", "XL"],
            colors: ["Blue"],
            inStock: true,
            featured: true,
            brand: "Elegance Couture",
            material: "Polyester Blend",
            care: "Dry Clean Only"
        },
        {
            id: 2,
            name: "Classic Beige Trench Coat",
            price: "$89.99",
            images: ["https://i.pinimg.com/736x/3c/5a/bb/3c5abb5bd7acd1d4b6d7a62996c8dcf8.jpg"],
            category: "Woman",
            subcategory: "Outerwear",
            description: "Timeless beige trench coat that adds sophistication to any outfit. Water-resistant and stylish with belted waist and classic details.",
            rating: 4.2,
            reviews: 15,
            isTrending: true,
            isNew: false,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Beige"],
            inStock: true,
            featured: true,
            brand: "London Fog",
            material: "Cotton Blend",
            care: "Dry Clean Only"
        },
        {
            id: 3,
            name: "Luxury Designer Handbag",
            price: "$249.99",
            images: ["https://i.pinimg.com/1200x/f1/ab/1a/f1ab1a7aac776d74986bfb925a562594.jpg"],
            category: "Bags",
            subcategory: "Handbags",
            description: "Premium leather handbag with gold-tone hardware. Spacious interior with multiple compartments for organization. Includes dust bag for storage.",
            rating: 4.8,
            reviews: 42,
            isTrending: true,
            isNew: true,
            sizes: ["One Size"],
            colors: ["Brown", "Black"],
            inStock: true,
            featured: true,
            brand: "Luxe Accessories",
            material: "Genuine Leather",
            care: "Wipe with damp cloth"
        },
        {
            id: 4,
            name: "Summer Floral Maxi Dress",
            price: "$69.99",
            images: ["https://i.pinimg.com/1200x/b0/54/32/b05432d015a975491fd1f1e6a9417849.jpg"],
            category: "Woman",
            subcategory: "Casual Wear",
            description: "Beautiful floral maxi dress perfect for summer days. Lightweight and breathable fabric with flowy silhouette and adjustable straps.",
            rating: 4.3,
            reviews: 18,
            isTrending: true,
            isNew: true,
            sizes: ["XS", "S", "M", "L"],
            colors: ["Multi"],
            inStock: true,
            featured: false,
            brand: "Summer Breeze",
            material: "Rayon",
            care: "Machine Wash Cold"
        },
        {
            id: 5,
            name: "Minimalist Gold Jewelry Set",
            price: "$54.99",
            originalPrice: "$79.99",
            images: ["https://i.pinimg.com/1200x/72/2a/62/722a6289b84f6ba941c59e5af5a88994.jpg"],
            category: "Jewelry",
            subcategory: "Sets",
            description: "Elegant gold-plated jewelry set including necklace, earrings, and bracelet. Perfect for any occasion. Hypoallergenic and tarnish-resistant.",
            rating: 4.6,
            reviews: 31,
            isTrending: true,
            isNew: false,
            sizes: ["One Size"],
            colors: ["Gold"],
            inStock: true,
            featured: true,
            brand: "Glamour Gems",
            material: "Gold Plated",
            care: "Avoid water and perfumes"
        },
        {
            id: 6,
            name: "Casual Denim Jacket",
            price: "$59.99",
            originalPrice: "$79.99",
            images: ["https://i.pinimg.com/1200x/e3/70/a3/e370a395ae8b109aa5f2664efaa386ab.jpg"],
            category: "Woman",
            subcategory: "Outerwear",
            description: "Classic denim jacket that never goes out of style. Versatile piece for casual outfits with button-front closure and chest pockets.",
            rating: 4.1,
            reviews: 12,
            isTrending: false,
            isNew: false,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Blue"],
            inStock: true,
            featured: false,
            brand: "Denim Co.",
            material: "100% Cotton",
            care: "Machine Wash Cold"
        },
        {
            id: 7,
            name: "Elegant Black Evening Gown",
            price: "$149.99",
            originalPrice: "$229.99",
            images: ["https://i.pinimg.com/736x/5d/b5/01/5db501461c00d9f18dd638c428ab46d6.jpg"],
            category: "Woman",
            subcategory: "Formal Wear",
            description: "Stunning black gown for formal events. Features elegant silhouette, premium fabric, and subtle embellishments for a glamorous look.",
            rating: 4.9,
            reviews: 27,
            isTrending: true,
            isNew: true,
            sizes: ["S", "M", "L"],
            colors: ["Black"],
            inStock: true,
            featured: true,
            brand: "Red Carpet",
            material: "Silk Blend",
            care: "Dry Clean Only"
        },
        {
            id: 8,
            name: "Bohemian Style Dress",
            price: "$79.99",
            images: ["https://i.pinimg.com/736x/c0/d8/1a/c0d81af974d6447d79e15bce7bf6274d.jpg"],
            category: "Woman",
            subcategory: "Casual Wear",
            description: "Free-spirited bohemian dress with unique pattern. Comfortable and stylish for daily wear with flowy sleeves and tiered design.",
            rating: 4.0,
            reviews: 14,
            isTrending: false,
            isNew: false,
            sizes: ["XS", "S", "M", "L"],
            colors: ["Multi"],
            inStock: true,
            featured: false,
            brand: "Boho Chic",
            material: "Viscose",
            care: "Hand Wash"
        },
        {
            id: 9,
            name: "Classic Men's Blazer",
            price: "$119.99",
            images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"],
            category: "Man",
            subcategory: "Formal Wear",
            description: "Sharp navy blazer for the modern gentleman. Perfect for business meetings and formal events with tailored fit and satin lining.",
            rating: 4.5,
            reviews: 19,
            isTrending: true,
            isNew: true,
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Navy", "Black", "Gray"],
            inStock: true,
            featured: true,
            brand: "Executive Style",
            material: "Wool Blend",
            care: "Dry Clean Only"
        },
        {
            id: 10,
            name: "Leather Messenger Bag",
            price: "$89.99",
            originalPrice: "$129.99",
            images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"],
            category: "Bags",
            subcategory: "Messenger Bags",
            description: "Genuine leather messenger bag with adjustable strap. Perfect for work or travel with padded laptop compartment and multiple pockets.",
            rating: 4.3,
            reviews: 22,
            isTrending: false,
            isNew: false,
            sizes: ["One Size"],
            colors: ["Brown", "Black"],
            inStock: true,
            featured: false,
            brand: "Urban Leather",
            material: "Genuine Leather",
            care: "Leather Conditioner"
        },
        {
            id: 11,
            name: "Silver Pendant Necklace",
            price: "$39.99",
            images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80"],
            category: "Jewelry",
            subcategory: "Necklaces",
            description: "Elegant silver pendant necklace with delicate chain. Perfect for everyday wear or special occasions. Sterling silver with cubic zirconia.",
            rating: 4.2,
            reviews: 16,
            isTrending: false,
            isNew: true,
            sizes: ["One Size"],
            colors: ["Silver"],
            inStock: true,
            featured: false,
            brand: "Silver Sparkle",
            material: "Sterling Silver",
            care: "Polish with silver cloth"
        },
        {
            id: 12,
            name: "Casual Men's Shirt",
            price: "$45.99",
            images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"],
            category: "Man",
            subcategory: "Casual Wear",
            description: "Comfortable casual shirt in premium cotton. Perfect for weekend outings and casual Fridays with button-down collar and chest pocket.",
            rating: 3.9,
            reviews: 9,
            isTrending: false,
            isNew: false,
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Blue", "White", "Gray"],
            inStock: true,
            featured: false,
            brand: "Comfort Wear",
            material: "100% Cotton",
            care: "Machine Wash"
        },
        {
            id: 13,
            name: "Designer Bedding Set",
            price: "$129.99",
            originalPrice: "$189.99",
            images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"],
            category: "Bedroom",
            subcategory: "Bedding",
            description: "Luxury 1000-thread count cotton bedding set. Includes duvet cover, fitted sheet, and pillowcases. Breathable and soft for ultimate comfort.",
            rating: 4.7,
            reviews: 34,
            isTrending: true,
            isNew: true,
            sizes: ["Twin", "Full", "Queen", "King"],
            colors: ["White", "Gray", "Beige"],
            inStock: true,
            featured: true,
            brand: "Sleep Haven",
            material: "Egyptian Cotton",
            care: "Machine Wash Gentle"
        },
        {
            id: 14,
            name: "Men's Leather Jacket",
            price: "$199.99",
            originalPrice: "$299.99",
            images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80"],
            category: "Man",
            subcategory: "Outerwear",
            description: "Classic biker leather jacket made from premium genuine leather. Timeless style that gets better with age. Quilted shoulders and zippered pockets.",
            rating: 4.8,
            reviews: 28,
            isTrending: true,
            isNew: false,
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Black", "Brown"],
            inStock: true,
            featured: true,
            brand: "Rebel Rider",
            material: "Genuine Leather",
            care: "Professional Leather Clean"
        },
        {
            id: 15,
            name: "Pearl Earrings Set",
            price: "$49.99",
            images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"],
            category: "Jewelry",
            subcategory: "Earrings",
            description: "Elegant freshwater pearl earrings. Perfect for bridal wear or special occasions. Sterling silver posts for sensitive ears.",
            rating: 4.5,
            reviews: 21,
            isTrending: false,
            isNew: true,
            sizes: ["One Size"],
            colors: ["White"],
            inStock: true,
            featured: false,
            brand: "Ocean Pearls",
            material: "Freshwater Pearl",
            care: "Wipe with soft cloth"
        },
        {
            id: 16,
            name: "Women's Ankle Boots",
            price: "$79.99",
            originalPrice: "$99.99",
            images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"],
            category: "Accessories",
            subcategory: "Footwear",
            description: "Stylish suede ankle boots with block heel. Comfortable for all-day wear with cushioned insole and side zipper for easy on/off.",
            rating: 4.3,
            reviews: 17,
            isTrending: true,
            isNew: false,
            sizes: ["6", "7", "8", "9", "10"],
            colors: ["Black", "Brown", "Tan"],
            inStock: true,
            featured: false,
            brand: "Step Style",
            material: "Suede",
            care: "Suede Protector Spray"
        },
        {
            id: 17,
            name: "Silk Scarf",
            price: "$34.99",
            images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"],
            category: "Accessories",
            subcategory: "Scarves",
            description: "Luxurious 100% silk scarf with hand-rolled edges. Adds elegance to any outfit. Versatile styling options - wear as neck scarf, headband, or bag accessory.",
            rating: 4.4,
            reviews: 13,
            isTrending: false,
            isNew: true,
            sizes: ["One Size"],
            colors: ["Multi", "Red", "Blue"],
            inStock: true,
            featured: false,
            brand: "Silk Road",
            material: "100% Silk",
            care: "Dry Clean Only"
        },
        {
            id: 18,
            name: "Men's Formal Shoes",
            price: "$99.99",
            images: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"],
            category: "Man",
            subcategory: "Footwear",
            description: "Classic leather oxford shoes for formal occasions. Comfortable and stylish with cushioned insole and durable rubber sole for all-day wear.",
            rating: 4.6,
            reviews: 25,
            isTrending: true,
            isNew: false,
            sizes: ["8", "9", "10", "11", "12"],
            colors: ["Black", "Brown"],
            inStock: true,
            featured: true,
            brand: "Gentleman's Choice",
            material: "Leather",
            care: "Polish regularly"
        },
        {
            id: 19,
            name: "Decorative Throw Pillows",
            price: "$29.99",
            images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"],
            category: "Bedroom",
            subcategory: "Decor",
            description: "Set of 2 decorative throw pillows with removable covers. Adds style to your bedroom or living room. Soft and plush for comfort.",
            rating: 4.2,
            reviews: 11,
            isTrending: false,
            isNew: true,
            sizes: ["18x18"],
            colors: ["Multi", "Gray", "Blue"],
            inStock: true,
            featured: false,
            brand: "Home Comfort",
            material: "Polyester",
            care: "Machine Washable"
        },
        {
            id: 20,
            name: "Women's Handbag Collection",
            price: "$159.99",
            originalPrice: "$229.99",
            images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80"],
            category: "Bags",
            subcategory: "Handbags",
            description: "Designer-inspired structured handbag with gold-tone hardware. Perfect for work and special occasions with multiple compartments and adjustable strap.",
            rating: 4.7,
            reviews: 36,
            isTrending: true,
            isNew: true,
            sizes: ["One Size"],
            colors: ["Black", "Beige", "Navy"],
            inStock: true,
            featured: true,
            brand: "Chic & Co.",
            material: "Faux Leather",
            care: "Wipe clean"
        }
    ];
}

// Show loading state
function showLoadingState() {
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading products...</p>
            </div>
        `;
    }
}

// Show error state
function showErrorState() {
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="no-products">
                <ion-icon name="alert-circle-outline"></ion-icon>
                <h3>Oops! Something went wrong</h3>
                <p>Failed to load products. Please try again.</p>
                <button class="btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

// Initialize price range slider
function initPriceRangeSlider() {
    const minSlider = document.getElementById('minPriceSlider');
    const maxSlider = document.getElementById('maxPriceSlider');
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');
    const minValue = document.getElementById('minPriceValue');
    const maxValue = document.getElementById('maxPriceValue');
    const progressBar = document.querySelector('.price-progress');
    
    if (!minSlider || !maxSlider || !minInput || !maxInput) return;
    
    const minGap = 10;
    
    function updatePriceRange() {
        let minVal = parseInt(minSlider.value);
        let maxVal = parseInt(maxSlider.value);
        
        if (maxVal - minVal < minGap) {
            if (minVal === parseInt(minSlider.min)) {
                maxSlider.value = minVal + minGap;
            } else {
                minSlider.value = maxVal - minGap;
            }
            minVal = parseInt(minSlider.value);
            maxVal = parseInt(maxSlider.value);
        }
        
        // Update inputs
        minInput.value = minVal;
        maxInput.value = maxVal;
        
        // Update displayed values
        if (minValue) minValue.textContent = '$' + minVal;
        if (maxValue) maxValue.textContent = '$' + maxVal;
        
        // Update progress bar
        const percentMin = ((minVal - parseInt(minSlider.min)) / (parseInt(minSlider.max) - parseInt(minSlider.min))) * 100;
        const percentMax = ((maxVal - parseInt(minSlider.min)) / (parseInt(maxSlider.max) - parseInt(minSlider.min))) * 100;
        
        if (progressBar) {
            progressBar.style.left = percentMin + '%';
            progressBar.style.right = (100 - percentMax) + '%';
        }
    }
    
    minSlider.addEventListener('input', updatePriceRange);
    maxSlider.addEventListener('input', updatePriceRange);
    
    minInput.addEventListener('change', function() {
        let val = parseInt(this.value);
        let maxVal = parseInt(maxSlider.value);
        
        if (isNaN(val)) val = parseInt(minSlider.min);
        if (val < parseInt(minSlider.min)) val = parseInt(minSlider.min);
        if (val > maxVal - minGap) val = maxVal - minGap;
        
        minSlider.value = val;
        updatePriceRange();
    });
    
    maxInput.addEventListener('change', function() {
        let val = parseInt(this.value);
        let minVal = parseInt(minSlider.value);
        
        if (isNaN(val)) val = parseInt(maxSlider.max);
        if (val > parseInt(maxSlider.max)) val = parseInt(maxSlider.max);
        if (val < minVal + minGap) val = minVal + minGap;
        
        maxSlider.value = val;
        updatePriceRange();
    });
    
    // Initial update
    updatePriceRange();
}

// Apply filters
function applyFilters() {
    // Start with all products
    filteredProducts = [...allProducts];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === currentCategory
        );
    }
    
    // Apply price filter with slider
    const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || 500;
    
    filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price.replace('$', '')) || 0;
        return price >= minPrice && price <= maxPrice;
    });
    
    // Apply rating filter
    const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
    if (selectedRating) {
        filteredProducts = filteredProducts.filter(product => 
            product.rating >= parseFloat(selectedRating)
        );
    }
    
    // Apply sorting
    applySorting();
    
    // Update product count
    updateProductCount();
    
    // Reset to first page
    currentPage = 1;
}

// Apply sorting
function applySorting() {
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        currentSort = sortSelect.value;
    }
    
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.price.replace('$', '')) || 0;
                const priceB = parseFloat(b.price.replace('$', '')) || 0;
                return priceA - priceB;
            });
            break;
            
        case 'price-high':
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.price.replace('$', '')) || 0;
                const priceB = parseFloat(b.price.replace('$', '')) || 0;
                return priceB - priceA;
            });
            break;
            
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
            
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
            
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
            
        case 'newest':
            filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
            
        case 'featured':
        default:
            // Show trending first
            filteredProducts.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
            break;
    }
}

// Render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <ion-icon name="bag-outline"></ion-icon>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or browse our other categories.</p>
                <button class="btn-primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    let productsHTML = '';
    
    paginatedProducts.forEach(product => {
        // Generate stars for rating
        const rating = product.rating || 4;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<ion-icon name="star"></ion-icon>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<ion-icon name="star-half"></ion-icon>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<ion-icon name="star-outline"></ion-icon>';
        }
        
        // Calculate discount if original price exists
        let discountHTML = '';
        if (product.originalPrice) {
            const originalPrice = parseFloat(product.originalPrice.replace('$', ''));
            const currentPrice = parseFloat(product.price.replace('$', ''));
            const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
            discountHTML = `<span class="product-discount">-${discountPercent}%</span>`;
        }
        
        // New badge
        const newBadge = product.isNew ? '<span class="product-badge new">New</span>' : '';
        const trendingBadge = product.isTrending ? '<span class="product-badge trending">Trending</span>' : '';
        
        productsHTML += `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.images?.[0] || 'images/placeholder.jpg'}" 
                         alt="${product.name}" 
                         loading="lazy"
                         onclick="viewProductDetails(${product.id})">
                    <div class="product-badges">
                        ${newBadge}
                        ${trendingBadge}
                        ${discountHTML}
                    </div>
                    <div class="product-overlay">
                        <button class="quick-view-btn" onclick="quickView(${product.id})">
                            <ion-icon name="eye-outline"></ion-icon>
                            <span>Quick View</span>
                        </button>
                        <button class="add-to-cart-btn" onclick="addToCartFromProducts(${product.id})">
                            <ion-icon name="cart-outline"></ion-icon>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name" onclick="viewProductDetails(${product.id})">${product.name}</h3>
                    <span class="product-category">${product.category} / ${product.subcategory || 'Fashion'}</span>
                    <div class="product-rating">
                        <div class="stars">${starsHTML}</div>
                        <span class="rating-count">(${product.reviews || 0})</span>
                    </div>
                    <div class="product-price-container">
                        <div class="product-price">${product.price}</div>
                        ${product.originalPrice ? `<div class="product-original-price">${product.originalPrice}</div>` : ''}
                    </div>
                    <div class="product-actions-mobile">
                        <button class="btn-primary" onclick="addToCartFromProducts(${product.id})">
                            <ion-icon name="cart-outline"></ion-icon>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = productsHTML;
    
    // Setup pagination
    setupPagination();
}

// Enhanced Quick View Modal
function quickView(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;
    
    // Generate stars for rating
    const rating = product.rating || 4;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<ion-icon name="star"></ion-icon>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<ion-icon name="star-half"></ion-icon>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<ion-icon name="star-outline"></ion-icon>';
    }
    
    // Calculate discount if original price exists
    let discountHTML = '';
    let savingsHTML = '';
    if (product.originalPrice) {
        const originalPrice = parseFloat(product.originalPrice.replace('$', ''));
        const currentPrice = parseFloat(product.price.replace('$', ''));
        const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
        const savings = (originalPrice - currentPrice).toFixed(2);
        discountHTML = `<span class="discount-badge">-${discountPercent}%</span>`;
        savingsHTML = `<div class="savings">You save: $${savings}</div>`;
    }
    
    // Create size options
    let sizeOptionsHTML = '';
    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
            sizeOptionsHTML += `<button class="size-option" data-size="${size}">${size}</button>`;
        });
    } else {
        sizeOptionsHTML = '<button class="size-option" data-size="One Size">One Size</button>';
    }
    
    // Create color options
    let colorOptionsHTML = '';
    if (product.colors && product.colors.length > 0) {
        product.colors.forEach(color => {
            const colorLower = color.toLowerCase();
            colorOptionsHTML += `
                <button class="color-option" data-color="${color}" style="background-color: ${getColorCode(colorLower)};" title="${color}">
                    <span class="color-tooltip">${color}</span>
                </button>
            `;
        });
    }
    
    // Product images gallery
    let galleryHTML = '';
    if (product.images && product.images.length > 0) {
        galleryHTML = `
            <div class="quickview-gallery">
                <div class="gallery-main">
                    <img src="${product.images[0]}" alt="${product.name}" id="quickview-main-image">
                </div>
                <div class="gallery-thumbnails">
        `;
        
        product.images.forEach((image, index) => {
            galleryHTML += `
                <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeQuickViewImage(this, '${image}')">
                    <img src="${image}" alt="${product.name} - view ${index + 1}">
                </div>
            `;
        });
        
        galleryHTML += `
                </div>
            </div>
        `;
    } else {
        galleryHTML = `
            <div class="quickview-gallery">
                <div class="gallery-main">
                    <img src="images/placeholder.jpg" alt="${product.name}">
                </div>
            </div>
        `;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Quick View</h3>
                <button class="close-modal">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-image-section">
                    ${galleryHTML}
                </div>
                <div class="modal-details">
                    <div class="product-header">
                        <h2 class="product-title">${product.name}</h2>
                        <div class="product-badges">
                            ${product.isNew ? '<span class="badge new">New Arrival</span>' : ''}
                            ${product.isTrending ? '<span class="badge trending">Trending</span>' : ''}
                            ${discountHTML}
                        </div>
                    </div>
                    
                    <div class="product-rating-section">
                        <div class="stars-container">
                            <div class="stars">${starsHTML}</div>
                            <span class="rating-value">${product.rating}</span>
                        </div>
                        <a href="#" class="reviews-link">${product.reviews || 0} reviews</a>
                    </div>
                    
                    <div class="product-price-section">
                        <div class="current-price">${product.price}</div>
                        ${product.originalPrice ? `<div class="original-price">${product.originalPrice}</div>` : ''}
                        ${savingsHTML}
                    </div>
                    
                    <div class="product-description">
                        <h4>Description</h4>
                        <p>${product.description || 'Experience luxury and comfort with this premium fashion piece. Perfect for any occasion.'}</p>
                    </div>
                    
                    <div class="product-details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Brand:</span>
                            <span class="detail-value">${product.brand || 'HR FashionStyle'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value">${product.category} / ${product.subcategory || 'Fashion'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Material:</span>
                            <span class="detail-value">${product.material || 'Premium Fabric'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Care:</span>
                            <span class="detail-value">${product.care || 'See product details'}</span>
                        </div>
                    </div>
                    
                    <div class="product-variants">
                        <div class="variant-section">
                            <h4>Select Size <span class="required">*</span></h4>
                            <div class="size-options" id="sizeOptions">
                                ${sizeOptionsHTML}
                            </div>
                        </div>
                        
                        <div class="variant-section">
                            <h4>Select Color <span class="required">*</span></h4>
                            <div class="color-options" id="colorOptions">
                                ${colorOptionsHTML}
                            </div>
                        </div>
                        
                        <div class="variant-section">
                            <h4>Quantity</h4>
                            <div class="quantity-selector">
                                <button class="quantity-btn minus" onclick="updateQuantity(-1)">-</button>
                                <input type="number" class="quantity-input" id="quickview-quantity" value="1" min="1" max="10">
                                <button class="quantity-btn plus" onclick="updateQuantity(1)">+</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-availability">
                        <ion-icon name="${product.inStock ? 'checkmark-circle' : 'close-circle'}" class="${product.inStock ? 'in-stock' : 'out-of-stock'}"></ion-icon>
                        <span>${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-primary add-to-cart-modal" onclick="addToCartFromQuickView(${product.id})">
                            <ion-icon name="cart-outline"></ion-icon>
                            <span>Add to Cart</span>
                        </button>
                        <button class="btn-outline buy-now" onclick="buyNow(${product.id})">
                            <ion-icon name="flash-outline"></ion-icon>
                            <span>Buy Now</span>
                        </button>
                    </div>
                    
                    <div class="product-extra-info">
                        <div class="extra-item">
                            <ion-icon name="shield-checkmark-outline"></ion-icon>
                            <span>Secure Payment</span>
                        </div>
                        <div class="extra-item">
                            <ion-icon name="return-down-forward-outline"></ion-icon>
                            <span>30-Day Returns</span>
                        </div>
                        <div class="extra-item">
                            <ion-icon name="rocket-outline"></ion-icon>
                            <span>Free Shipping</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
    
    // Size selection functionality
    const sizeOptions = modal.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Color selection functionality
    const colorOptions = modal.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Quantity functionality
    window.updateQuantity = function(change) {
        const input = document.getElementById('quickview-quantity');
        let value = parseInt(input.value) + change;
        if (value < 1) value = 1;
        if (value > 10) value = 10;
        input.value = value;
    };
    
    // Add to cart from quick view
    window.addToCartFromQuickView = function(id) {
        const selectedSize = modal.querySelector('.size-option.selected');
        const selectedColor = modal.querySelector('.color-option.selected');
        const quantity = document.getElementById('quickview-quantity').value;
        
        if (!selectedSize) {
            showNotification('Please select a size', 'error');
            return;
        }
        
        if (!selectedColor && product.colors && product.colors.length > 0) {
            showNotification('Please select a color', 'error');
            return;
        }
        
        if (typeof addToCart === 'function') {
            addToCart(id, parseInt(quantity));
            showNotification('Product added to cart!', 'success');
            
            // Close modal after adding to cart
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 1000);
        }
    };
    
    // Buy now
    window.buyNow = function(id) {
        const selectedSize = modal.querySelector('.size-option.selected');
        const selectedColor = modal.querySelector('.color-option.selected');
        const quantity = document.getElementById('quickview-quantity').value;
        
        if (!selectedSize) {
            showNotification('Please select a size', 'error');
            return;
        }
        
        if (!selectedColor && product.colors && product.colors.length > 0) {
            showNotification('Please select a color', 'error');
            return;
        }
        
        if (typeof addToCart === 'function') {
            addToCart(id, parseInt(quantity));
            window.location.href = 'checkout.html';
        }
    };
    
    // Change gallery image
    window.changeQuickViewImage = function(thumbnail, imageSrc) {
        const mainImage = document.getElementById('quickview-main-image');
        if (mainImage) {
            mainImage.src = imageSrc;
            
            // Update active thumbnail
            const thumbnails = thumbnail.parentElement.querySelectorAll('.gallery-thumbnail');
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        }
    };
}

// Helper function to get color code
function getColorCode(color) {
    const colorMap = {
        'black': '#000000',
        'white': '#FFFFFF',
        'gray': '#808080',
        'grey': '#808080',
        'navy': '#000080',
        'blue': '#0000FF',
        'light blue': '#ADD8E6',
        'dark blue': '#00008B',
        'brown': '#A52A2A',
        'beige': '#F5F5DC',
        'tan': '#D2B48C',
        'red': '#FF0000',
        'pink': '#FFC0CB',
        'green': '#008000',
        'purple': '#800080',
        'yellow': '#FFFF00',
        'orange': '#FFA500',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'multi': 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)'
    };
    
    return colorMap[color] || '#CCCCCC';
}

// Update product count
function updateProductCount() {
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = `${filteredProducts.length} Products`;
    }
}

// Setup pagination
function setupPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        <div class="pagination-numbers">
    `;
    
    // Show limited page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    paginationHTML += `
        </div>
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Clear all filters
function clearAllFilters() {
    // Reset category
    currentCategory = 'all';
    document.querySelectorAll('.category-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector('[data-category="all"]').classList.add('active');
    
    // Reset price inputs and sliders
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 500;
    document.getElementById('minPriceSlider').value = 0;
    document.getElementById('maxPriceSlider').value = 500;
    
    // Trigger slider update
    if (typeof initPriceRangeSlider === 'function') {
        initPriceRangeSlider();
    }
    
    // Reset rating
    document.querySelector('input[name="rating"][value="4"]').checked = true;
    
    // Reset sort
    document.getElementById('sort').value = 'featured';
    
    // Apply filters
    applyFilters();
    renderProducts();
}

// Setup event listeners
function setupProductsEventListeners() {
    // Filter toggle for mobile
    const filterToggle = document.getElementById('filterToggle');
    const sidebar = document.querySelector('.products-sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (filterToggle && sidebar) {
        filterToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Category links
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active class
            document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update current category
            currentCategory = link.dataset.category;
            
            // Apply filters
            applyFilters();
            renderProducts();
            
            // Close sidebar on mobile
            if (window.innerWidth <= 991) {
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Sort change
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applySorting();
            renderProducts();
        });
    }
    
    // Apply price filter
    const applyPriceBtn = document.getElementById('applyPriceFilter');
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            applyFilters();
            renderProducts();
        });
    }
    
    // Rating filter
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', () => {
            applyFilters();
            renderProducts();
        });
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm) {
            filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                (product.category && product.category.toLowerCase().includes(searchTerm)) ||
                (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm))
            );
            currentPage = 1;
            renderProducts();
        } else {
            applyFilters();
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Add to cart from products page
function addToCartFromProducts(productId) {
    if (typeof addToCart === 'function') {
        addToCart(productId);
        
        // Show animation feedback
        const button = event.currentTarget;
        button.classList.add('added');
        setTimeout(() => button.classList.remove('added'), 1000);
        
        showNotification('Product added to cart!', 'success');
    } else {
        console.error('addToCart function not found');
        showNotification('Cart functionality not available', 'error');
    }
}

// View product details
function viewProductDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}

// Show notification (fallback if not available)
function showNotification(message, type = 'success') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Make functions global
window.viewProductDetails = viewProductDetails;
window.quickView = quickView;
window.addToCartFromProducts = addToCartFromProducts;
window.addToCartFromQuickView = addToCartFromQuickView;
window.buyNow = buyNow;
window.changePage = changePage;
window.clearAllFilters = clearAllFilters;
window.changeQuickViewImage = changeQuickViewImage;
window.updateQuantity = updateQuantity;