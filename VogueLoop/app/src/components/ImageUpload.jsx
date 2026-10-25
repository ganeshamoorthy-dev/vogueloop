import { useRef } from 'react';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';
import './ImageUpload.css';

const ImageUpload = ({ images, onImagesChange, maxImages = 5, minImages = 3 }) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        files.forEach(file => {
            if (file.type.startsWith('image/') && images.length + newImages.length < maxImages) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newImages.push(e.target.result);
                    if (newImages.length === files.length || images.length + newImages.length === maxImages) {
                        onImagesChange([...images, ...newImages]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const event = { target: { files } };
        handleFileSelect(event);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const isMinimumMet = images.length >= minImages;

    return (
        <div className="image-upload-wrapper">
            <div className="image-upload-header-row">
                <div className="upload-title-meta">
                    <ImageIcon size={18} className="navy-icon" />
                    <span className="font-semibold">High-Resolution Garment Photography</span>
                </div>
                <span className={`image-count-pill ${!isMinimumMet ? 'warning' : 'success'}`}>
                    {images.length}/{maxImages} Uploaded {!isMinimumMet && `(Minimum ${minImages} required)`}
                </span>
            </div>

            {!isMinimumMet && images.length > 0 && (
                <div className="image-warning-banner">
                    <AlertCircle size={15} />
                    <span>Please add at least {minImages} photos showing front, back, and detail view.</span>
                </div>
            )}

            <div className="images-grid-container mt-md">
                {images.map((image, index) => (
                    <div key={index} className="image-preview-card">
                        <img src={image} alt={`Garment preview ${index + 1}`} onError={handleImageError} />
                        <span className="image-index-tag">{index === 0 ? 'Cover Photo' : `Photo ${index + 1}`}</span>
                        <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                            title="Remove photo"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        className="upload-dropzone-box"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <Upload size={28} className="upload-icon-style" />
                        <p className="upload-main-text">Click or drag images here</p>
                        <span className="upload-sub-text">High-res PNG, JPG up to 10MB</span>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ImageUpload;
