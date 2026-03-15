import os
from PIL import Image

src_path = r"C:\Users\dasto\.gemini\antigravity\brain\20a28c02-3d8f-4648-9c9f-c0086116eddb\logo_icon_src_1773610778321.png"
dest_path = r"c:\Users\dasto\Desktop\Phoenix Code\Real Estate Site\images\logo_icon.png"

if not os.path.exists(src_path):
    print("Source logo not found")
    exit(1)

img = Image.open(src_path).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    # item = (R, G, B, A)
    # Threshold white: extremely bright pixels
    if item[0] > 245 and item[1] > 245 and item[2] > 245:
        newData.append((255, 255, 255, 0)) # Transparent
    else:
        newData.append(item)

img.putdata(newData)

# Trim/Auto-crop white space
# Find bounding box of non-transparent elements
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Option: Resize to a standard height for headers, e.g., 200px or keep large
# To make it clean, we don't resize too much yet, just save it.
img.save(dest_path, "PNG")
print(f"Logo processed and saved to {dest_path}")
print(f"Dimensions after trim: {img.size}")
