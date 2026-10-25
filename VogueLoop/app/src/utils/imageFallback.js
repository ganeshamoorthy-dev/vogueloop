export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80';

export const handleImageError = (e, fallbackUrl = FALLBACK_IMAGE) => {
    e.target.onerror = null;
    e.target.src = fallbackUrl;
};
