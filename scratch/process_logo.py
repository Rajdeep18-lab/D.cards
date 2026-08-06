import os
import sys
from PIL import Image

os.makedirs("src/assets", exist_ok=True)
os.makedirs("public", exist_ok=True)

input_path = r"C:\Users\lenovo\.gemini\antigravity-ide\brain\db4cb253-d341-47b2-969c-8d8e28c1cffa\media__1786047843030.jpg"
img = Image.open(input_path).convert("RGBA")

bg_r, bg_g, bg_b = 225, 241, 254

# Remove background smoothly
pixels = img.load()
width, height = img.size

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        diff = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
        if diff < 28:
            pixels[x, y] = (255, 255, 255, 0)
        elif diff < 52:
            alpha = int(((diff - 28) / (52 - 28)) * 255)
            pixels[x, y] = (r, g, b, alpha)

# Find bounding box of non-transparent content
bbox = img.getbbox()
print("Full Logo Bounding Box:", bbox)

# Full Logo cropped
full_logo = img.crop(bbox)
full_logo.save("public/logo.png", "PNG")
full_logo.save("public/logo.webp", "WEBP")
full_logo.save("src/assets/logo.png", "PNG")
full_logo.save("src/assets/logo.webp", "WEBP")

# Bounding box for top "D" icon mark only
w, h = full_logo.size
print("Cropped Full Logo Size:", w, h)

# Top mark is top 61% of full logo height
mark_bbox = (0, 0, w, int(h * 0.61))
mark = full_logo.crop(mark_bbox)
mark_real_bbox = mark.getbbox()
mark_trimmed = mark.crop(mark_real_bbox)

mark_trimmed.save("public/logo-mark.png", "PNG")
mark_trimmed.save("public/logo-mark.webp", "WEBP")
mark_trimmed.save("src/assets/logo-mark.png", "PNG")
mark_trimmed.save("src/assets/logo-mark.webp", "WEBP")

# Create favicon.ico in multi-sizes (16, 32, 48, 64)
icon_sizes = [(16,16), (32,32), (48,48), (64,64)]
mark_trimmed.save("public/favicon.ico", format="ICO", sizes=icon_sizes)

print("Logo assets processed successfully!")
