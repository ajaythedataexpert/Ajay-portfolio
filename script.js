const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 192;
const currentFrame = index => (
    `frames/mnt/data/video_frames_24fps/frame_${index.toString().padStart(4, '0')}.jpg`
);

const images = [];
const imageObj = { frame: 0 };

// Preload all images
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Draw the first image when it loads or if already loaded
if (images[0].complete) {
    render();
} else {
    images[0].onload = render;
}

function render() {
    if (!images[imageObj.frame]) return;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const img = images[imageObj.frame];
    
    // Check if the image has been loaded before trying to draw
    if (!img.complete || img.naturalWidth === 0) {
        return; // wait until the image is fully loaded
    }
    
    // Draw image maintaining aspect ratio and covering the canvas
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const maxScrollTop = scrollHeight - window.innerHeight;
    
    // Prevent divide by zero if maxScrollTop is somehow 0
    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    requestAnimationFrame(() => {
        imageObj.frame = frameIndex;
        render();
    });
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});
