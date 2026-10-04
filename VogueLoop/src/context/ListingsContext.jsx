import { createContext, useContext, useState, useEffect } from 'react';
import { FALLBACK_IMAGE } from '../utils/imageFallback';

const ListingsContext = createContext();

export const useListings = () => {
    const context = useContext(ListingsContext);
    if (!context) {
        throw new Error('useListings must be used within ListingsProvider');
    }
    return context;
};

// Rich sample luxury listings with verified high-res fashion imagery
const initialListings = [
    {
        id: 1,
        title: 'Royal Blue Zari Embroidered Lehenga',
        description: 'Stunning royal blue silk lehenga with heavy golden zari embroidery and a sheer net dupatta. Hand-cleaned and inspected before delivery.',
        category: 'Lehenga',
        occasion: 'Wedding',
        pricePerDay: 1499,
        securityDeposit: 1500,
        retailValue: 24000,
        condition: 'Pristine Condition',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['S', 'M', 'L'],
        owner: 'Priya Sharma',
        rating: 4.9,
        reviews: 28,
    },
    {
        id: 2,
        title: 'Classic Midnight Black Sherwani',
        description: 'Handcrafted black raw silk sherwani with subtle golden accent buttons and structured shoulders. Ideal for grooms and grand formal receptions.',
        category: 'Sherwani',
        occasion: 'Reception',
        pricePerDay: 1799,
        securityDeposit: 2000,
        retailValue: 32000,
        condition: 'Like New',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['M', 'L', 'XL'],
        owner: 'Rajesh Kumar',
        rating: 4.8,
        reviews: 19,
    },
    {
        id: 3,
        title: 'Crimson Red Handloom Bridal Saree',
        description: 'Timeless crimson red Banarasi silk saree with authentic gold brocade weave and contrasting heavy blouse piece.',
        category: 'Saree',
        occasion: 'Wedding',
        pricePerDay: 1999,
        securityDeposit: 2000,
        retailValue: 35000,
        condition: 'Pristine Condition',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1583391733956-6c78276477e5?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['Free Size'],
        owner: 'Anita Desai',
        rating: 5.0,
        reviews: 34,
    },
    {
        id: 4,
        title: 'Blush Pink Sequined Anarkali Gown',
        description: 'Ethereal powder pink floor-length anarkali suit with delicate crystal and sequin embellishments. Perfect for sangeet and cocktail nights.',
        category: 'Anarkali',
        occasion: 'Cocktail',
        pricePerDay: 1299,
        securityDeposit: 1200,
        retailValue: 18000,
        condition: 'Excellent',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        owner: 'Meera Patel',
        rating: 4.7,
        reviews: 16,
    },
    {
        id: 5,
        title: 'Ivory & Gold Indo-Western Tuxedo Set',
        description: 'Modern cream asymmetric jacket with tailored slim-fit trousers. Perfect statement look for engagement parties and birthday galas.',
        category: 'Indo-Western',
        occasion: 'Party',
        pricePerDay: 1399,
        securityDeposit: 1500,
        retailValue: 22000,
        condition: 'Like New',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['M', 'L', 'XL'],
        owner: 'Vikram Singh',
        rating: 4.6,
        reviews: 14,
    },
    {
        id: 6,
        title: 'Emerald Green Raw Silk Kurta Set',
        description: 'Rich emerald green silk kurta with intricate lucknowi chikan threadwork on collar and cuffs, styled with silk churidar.',
        category: 'Kurta',
        occasion: 'Formal',
        pricePerDay: 1099,
        securityDeposit: 1000,
        retailValue: 15000,
        condition: 'Pristine Condition',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['S', 'M', 'L'],
        owner: 'Kavita Reddy',
        rating: 4.5,
        reviews: 21,
    },
    {
        id: 7,
        title: 'Maroon Velvet Heavy Dupatta Lehenga',
        description: 'Deep velvet burgundy maroon lehenga with dense metallic embroidery and matching zardosi blouse.',
        category: 'Lehenga',
        occasion: 'Reception',
        pricePerDay: 1899,
        securityDeposit: 2000,
        retailValue: 38000,
        condition: 'Pristine Condition',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['S', 'M', 'L'],
        owner: 'Priya Sharma',
        rating: 4.9,
        reviews: 31,
    },
    {
        id: 8,
        title: 'Champagne Gold Sequin Evening Gown',
        description: 'Glamorous floor-length sequined cocktail dress with a subtle side slit and elegant v-neckline.',
        category: 'Indo-Western',
        occasion: 'Cocktail',
        pricePerDay: 1599,
        securityDeposit: 1600,
        retailValue: 28000,
        condition: 'Like New',
        isVerifiedOwner: true,
        isCleaned: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['XS', 'S', 'M'],
        owner: 'Ananya Roy',
        rating: 4.8,
        reviews: 22,
    },
];

export const ListingsProvider = ({ children }) => {
    const [listings, setListings] = useState(() => {
        try {
            const saved = localStorage.getItem('vogueloop_listings_v2');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (err) {
            console.error('Failed to load saved listings', err);
        }
        return initialListings;
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('vogueloop_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            return [];
        }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedOccasion, setSelectedOccasion] = useState('All');

    useEffect(() => {
        try {
            localStorage.setItem('vogueloop_listings_v2', JSON.stringify(listings));
        } catch (err) {
            console.error('Failed to save listings', err);
        }
    }, [listings]);

    useEffect(() => {
        try {
            localStorage.setItem('vogueloop_wishlist', JSON.stringify(wishlist));
        } catch (err) {
            console.error('Failed to save wishlist', err);
        }
    }, [wishlist]);

    const toggleWishlist = (id) => {
        const targetId = String(id);
        setWishlist(prev =>
            prev.map(String).includes(targetId)
                ? prev.filter(itemId => String(itemId) !== targetId)
                : [...prev, id]
        );
    };

    const isInWishlist = (id) => wishlist.map(String).includes(String(id));

    const addListing = (listing) => {
        const newListing = {
            ...listing,
            id: Date.now(),
            rating: 5.0,
            reviews: 1,
            condition: listing.condition || 'Pristine Condition',
            isVerifiedOwner: true,
            isCleaned: true,
            available: true,
            images: (listing.images && listing.images.length > 0) ? listing.images : [FALLBACK_IMAGE],
            securityDeposit: listing.securityDeposit || Math.round(listing.pricePerDay * 0.8),
            createdAt: new Date().toISOString(),
        };
        setListings([newListing, ...listings]);
    };

    const updateListing = (id, updates) => {
        setListings(listings.map(listing =>
            String(listing.id) === String(id) ? { ...listing, ...updates } : listing
        ));
    };

    const deleteListing = (id) => {
        setListings(listings.filter(listing => String(listing.id) !== String(id)));
    };

    const getFilteredListings = () => {
        return listings.filter(listing => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = !query ||
                (listing.title && listing.title.toLowerCase().includes(query)) ||
                (listing.description && listing.description.toLowerCase().includes(query)) ||
                (listing.occasion && listing.occasion.toLowerCase().includes(query)) ||
                (listing.category && listing.category.toLowerCase().includes(query));
            const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
            const matchesOccasion = selectedOccasion === 'All' || listing.occasion === selectedOccasion;
            return matchesSearch && matchesCategory && matchesOccasion;
        });
    };

    const getListingById = (id) => {
        if (id === undefined || id === null) return undefined;
        return listings.find(listing => String(listing.id) === String(id));
    };

    const categories = ['All', ...new Set(listings.map(l => l.category).filter(Boolean))];
    const occasions = ['All', 'Wedding', 'Reception', 'Party', 'Cocktail', 'Birthday', 'Formal', 'Date Night', 'Festive'];

    const value = {
        listings,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addListing,
        updateListing,
        deleteListing,
        getFilteredListings,
        getListingById,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedOccasion,
        setSelectedOccasion,
        categories,
        occasions,
    };

    return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
};
