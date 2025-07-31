# Hero Images Directory

Place your 5 hero images in this directory with the following names:
- hero-1.png
- hero-2.png
- hero-3.png
- hero-4.png
- hero-5.png

## Image Requirements:
- High resolution images (recommended: at least 1920x1080)
- PNG format (or change the extensions in App.js)
- Images should be optimized for web (compressed)
- All images should have the same aspect ratio for smooth transitions

## How it works:
The ImageCycler component will automatically cycle through these images every 1.3 seconds with a smooth fade transition.

## To change the images:
1. Add your images to this directory with the correct names
2. If you want to use different names or add more/fewer images, update the `images` array in App.js (around line 54-60)
3. To change the timing, modify the `interval` prop (currently set to 1300ms)