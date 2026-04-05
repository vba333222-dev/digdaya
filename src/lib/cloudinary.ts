import { Cloudinary } from '@cloudinary/url-gen';

// Inisialisasi Cloudinary instance menggunakan Cloud Name dari environment variable
export const cloudinary = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dprsmfj1i'
    }
});
