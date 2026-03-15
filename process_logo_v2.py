import os
from PIL import Image, ImageDraw

src_path = r"C:\Users\dasto\.gemini\antigravity\brain\20a28c02-3d8f-4648-9c9f-c0086116eddb\logo_icon_src_1773610778321.png"
dest_path = r"c:\Users\dasto\Desktop\Phoenix Code\Real Estate Site\images\logo_icon.png"

if not os.path.exists(src_path):
    print("Source logo not found")
    exit(1)

img = Image.open(src_path).convert("RGBA")
width, height = img.size

# Floodfill from all 4 corners to remove background with higher tolerance (thresh)
# Using a slightly higher tolerance removes the edge "fringe" safely
try:
    ImageDraw.floodfill(img, (0, 0), (255, 255, 255, 0), thresh=50)
    ImageDraw.floodfill(img, (width - 1, 0), (255, 255, 255, 0), thresh=50)
    ImageDraw.floodfill(img, (0, height - 1), (255, 255, 255, 0), thresh=50)
    ImageDraw.floodfill(img, (width - 1, height - 1), (255, 255, 255, 0), thresh=50)
except TypeError:
    # If thresh is not supported in this version, fallback to a more aggressive loop
    print("Fallback to pixel loop for background removal")
    datas = img.getdata()
    newData = []
    for item in datas:
        # Aggressive thresholding for white
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)

# Trim white space
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save(dest_path, "PNG")
print(f"Logo background removed aggressively and saved to {dest_path}")
print(f"Dimensions: {img.size}")
