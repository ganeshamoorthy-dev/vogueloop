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

// Realistic student-owned occasion listings for university & nearby campus communities
const initialListings = [
    {
        id: 1,
        title: 'Royal Blue Zari Silk Lehenga',
        description: 'Silk lehenga with golden zari border and embroidered net dupatta. Worn once for a family function, in excellent condition. Ideal for college ethnic days and weddings.',
        category: 'Lehenga',
        occasion: 'Festive & Ethnic Day',
        rental3DayPrice: 799,
        pricePerDay: 299,
        securityDeposit: 800,
        originalPurchasePrice: 6500,
        purchaseYear: 2024,
        condition: 'Like New',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['M'],
        primarySize: 'M',
        measurements: {
            bust: '36"',
            waist: '30-32"',
            length: '42"',
            blouseLength: '15"',
            alterationAllowance: '1.5"',
        },
        locality: 'University Hub',
        distanceKm: 0.8,
        handoverSpot: 'Main Campus Gate 1 / Student Center',
        owner: 'Aishwarya R.',
        ownerType: 'Verified Student',
        rating: 5.0,
        reviewsCount: 3,
    },
    {
        id: 2,
        title: 'Classic Midnight Black Bandhgala Sherwani',
        description: 'Raw silk tailored black bandhgala sherwani with antique gold brass buttons. Worn once for a cousin’s reception. Dry-cleaned and ready for campus formals or celebrations.',
        category: 'Sherwani',
        occasion: 'Formals & Placements',
        rental3DayPrice: 899,
        pricePerDay: 350,
        securityDeposit: 1000,
        originalPurchasePrice: 7800,
        purchaseYear: 2024,
        condition: 'Like New',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['L'],
        primarySize: 'L',
        measurements: {
            chest: '40"',
            shoulder: '18"',
            length: '38"',
            sleeve: '25"',
        },
        locality: 'University Hub',
        distanceKm: 0.6,
        handoverSpot: 'University Road (Near Campus Plaza)',
        owner: 'Rajesh K.',
        ownerType: 'Verified Student',
        rating: 4.9,
        reviewsCount: 2,
    },
    {
        id: 3,
        title: 'Crimson Banarasi Art Silk Saree',
        description: 'Traditional crimson red saree with woven gold zari work and stitched contrast brocade blouse. Extremely photogenic for farewells and traditional department days.',
        category: 'Saree',
        occasion: 'Farewell & Graduation',
        rental3DayPrice: 649,
        pricePerDay: 250,
        securityDeposit: 600,
        originalPurchasePrice: 5200,
        purchaseYear: 2023,
        condition: 'Excellent',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1583391733956-6c78276477e5?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['Free Size'],
        primarySize: 'Free Size',
        measurements: {
            blouseBust: '34-36"',
            blouseWaist: '28-30"',
            sareeLength: '5.5 meters',
        },
        locality: 'Tavarekere',
        distanceKm: 1.4,
        handoverSpot: 'Near Forum Mall Junction / Tavarekere Bus Stop',
        owner: 'Pooja M.',
        ownerType: 'Verified Student',
        rating: 5.0,
        reviewsCount: 4,
    },
    {
        id: 4,
        title: 'Blush Pink Flared Anarkali Suit',
        description: 'Pastel pink georgette anarkali with subtle sequins and threadwork on neckline. Lightweight and easy to wear for college fests and dance performances.',
        category: 'Anarkali',
        occasion: 'College Fest',
        rental3DayPrice: 699,
        pricePerDay: 260,
        securityDeposit: 700,
        originalPurchasePrice: 4800,
        purchaseYear: 2024,
        condition: 'Like New',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['S', 'M'],
        primarySize: 'S',
        measurements: {
            bust: '34"',
            waist: '28"',
            length: '52"',
            shoulder: '14.5"',
        },
        locality: 'University Hub',
        distanceKm: 0.9,
        handoverSpot: 'Campus Gate 2 / Near University Library',
        owner: 'Meera P.',
        ownerType: 'Verified Student',
        rating: 4.8,
        reviewsCount: 3,
    },
    {
        id: 5,
        title: 'Ivory & Navy Indo-Western Asymmetric Kurta',
        description: 'Layered Indo-western bandhgala style jacket with slim-fit cream trousers. Sharp silhouette suitable for placement interviews, guest lectures, and student union formals.',
        category: 'Indo-Western',
        occasion: 'Formals & Placements',
        rental3DayPrice: 749,
        pricePerDay: 280,
        securityDeposit: 750,
        originalPurchasePrice: 5600,
        purchaseYear: 2024,
        condition: 'Like New',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['M', 'L'],
        primarySize: 'M',
        measurements: {
            chest: '38"',
            waist: '32"',
            length: '36"',
            trouserLength: '40"',
        },
        locality: 'Near Campus',
        distanceKm: 0.4,
        handoverSpot: 'Main Campus Backgate / Student Mart',
        owner: 'Vikram S.',
        ownerType: 'Verified Student',
        rating: 5.0,
        reviewsCount: 2,
    },
    {
        id: 6,
        title: 'Emerald Green Chanderi Kurta Set',
        description: 'Chanderi silk kurta with delicate mirrorwork on the yoke and tapered pants. Worn for department day celebrations. Sanitized and steam pressed.',
        category: 'Kurta',
        occasion: 'University Events',
        rental3DayPrice: 599,
        pricePerDay: 220,
        securityDeposit: 600,
        originalPurchasePrice: 4200,
        purchaseYear: 2023,
        condition: 'Excellent',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['M'],
        primarySize: 'M',
        measurements: {
            bust: '37"',
            waist: '32"',
            length: '44"',
            pantLength: '38"',
        },
        locality: 'Koramangala 1st Block',
        distanceKm: 1.8,
        handoverSpot: 'Near Wipro Park / Koramangala Police Station Road',
        owner: 'Kavita R.',
        ownerType: 'Verified Student',
        rating: 4.8,
        reviewsCount: 1,
    },
    {
        id: 7,
        title: 'Burgundy Velvet Embroidered Crop-Top Lehenga',
        description: 'Modern burgundy velvet crop-top with flared georgette skirt and sequined dupatta. Perfect for evening farewell galas and dance performances.',
        category: 'Lehenga',
        occasion: 'Farewell & Graduation',
        rental3DayPrice: 849,
        pricePerDay: 320,
        securityDeposit: 900,
        originalPurchasePrice: 7200,
        purchaseYear: 2024,
        condition: 'Like New',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['S', 'M'],
        primarySize: 'S',
        measurements: {
            bust: '34"',
            waist: '28"',
            skirtLength: '41"',
        },
        locality: 'University Hub',
        distanceKm: 0.7,
        handoverSpot: 'Central Campus Quad / Student Café',
        owner: 'Priya S.',
        ownerType: 'Verified Student',
        rating: 4.9,
        reviewsCount: 5,
    },
    {
        id: 8,
        title: 'Champagne Shimmer Cocktail Slip Gown',
        description: 'Elegant champagne floor-length slip dress with subtle shimmer and cowl neck. Simple, chic, and photogenic for campus socials, birthday parties, or photo shoots.',
        category: 'Indo-Western',
        occasion: 'Parties & Birthdays',
        rental3DayPrice: 699,
        pricePerDay: 260,
        securityDeposit: 700,
        originalPurchasePrice: 4500,
        purchaseYear: 2024,
        condition: 'Like New',
        isVerifiedOwner: true,
        available: true,
        images: [
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: ['XS', 'S'],
        primarySize: 'S',
        measurements: {
            bust: '33"',
            waist: '26-28"',
            length: '54"',
        },
        locality: 'Near Campus',
        distanceKm: 0.5,
        handoverSpot: 'Near Gate 1 Kiosk',
        owner: 'Ananya R.',
        ownerType: 'Verified Student',
        rating: 5.0,
        reviewsCount: 2,
    },
];

export const STUDENT_OCCASIONS = [
    'All',
    'College Fest',
    'Farewell & Graduation',
    'Festive & Ethnic Day',
    'Formals & Placements',
    'Weddings',
    'Parties & Birthdays',
    'University Events',
    'Photoshoots & Performances',
];

export const CAMPUS_LOCALITIES = [
    'All Localities',
    'Within 1 km',
    'Within 2 km',
    'University Hub',
    'Near Campus',
    'Tavarekere',
    'Koramangala',
];

export const ListingsProvider = ({ children }) => {
    const [listings] = useState(initialListings);
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('vogueloop_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            return [];
        }
    });

    const toggleWishlist = (id) => {
        const targetId = String(id);
        setWishlist(prev => {
            const updated = prev.map(String).includes(targetId)
                ? prev.filter(itemId => String(itemId) !== targetId)
                : [...prev, id];
            try {
                localStorage.setItem('vogueloop_wishlist', JSON.stringify(updated));
            } catch (e) {
                // Ignore storage errors
            }
            return updated;
        });
    };

    const isInWishlist = (id) => wishlist.map(String).includes(String(id));

    const getListingById = (id) => {
        if (id === undefined || id === null) return undefined;
        return listings.find(listing => String(listing.id) === String(id));
    };

    const categories = ['All', ...new Set(listings.map(l => l.category).filter(Boolean))];
    const occasions = STUDENT_OCCASIONS;
    const localities = CAMPUS_LOCALITIES;

    const value = {
        listings,
        wishlist,
        toggleWishlist,
        isInWishlist,
        getListingById,
        categories,
        occasions,
        localities,
    };

    return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
};
