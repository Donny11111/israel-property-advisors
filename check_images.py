import os
from PIL import Image

dir_path = r"C:\Users\dasto\.gemini\antigravity\brain\20a28c02-3d8f-4648-9c9f-c0086116eddb"
files = [
    "hero_bg_wide_1773600781068.png",
    "yael_portrait_tall_1773600796731.png",
    "israel_cityscape_landscape_1773600814237.png",
    "cta_bg_panoramic_1773600829062.png"
]

for f in files:
    path = os.path.join(dir_path, f)
    if os.path.exists(path):
        img = Image.open(path)
        print(f"{f}: {img.size[0]}x{img.size[1]} (AR: {img.size[0]/img.size[1]:.2f})")
    else:
        print(f"File not found: {f}")
