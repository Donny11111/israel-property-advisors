import os
from PIL import Image

# Paths
source_dir = r"C:\Users\dasto\.gemini\antigravity\brain\20a28c02-3d8f-4648-9c9f-c0086116eddb"
dest_dir = r"c:\Users\dasto\Desktop\Phoenix Code\Real Estate Site\images"

# Target specs: (filename, target_width, target_height)
specs = [
    ("yael_portrait_user_loose_1773608924552.png", 600, 800)
]

# Map to clean output names
name_map = {
    "yael_portrait_user_loose_1773608924552.png": "yael_portrait.jpg"
}

def process_image(filename, target_w, target_h):
    src_path = os.path.join(source_dir, filename)
    if not os.path.exists(src_path):
        print(f"Source file not found: {filename}")
        return

    img = Image.open(src_path)
    current_w, current_h = img.size

    # Calculate crop
    target_ratio = target_w / target_h
    current_ratio = current_w / current_h

    if current_ratio > target_ratio:
        # Image is wider than target
        new_w = int(target_ratio * current_h)
        offset = (current_w - new_w) // 2
        img_cropped = img.crop((offset, 0, offset + new_w, current_h))
    else:
        # Image is taller than target
        new_h = int(current_w / target_ratio)
        offset = (current_h - new_h) // 2
        img_cropped = img.crop((0, offset, current_w, offset + new_h))

    # Resize
    img_resized = img_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Save as JPEG
    out_name = name_map[filename]
    out_path = os.path.join(dest_dir, out_name)
    img_resized.convert("RGB").save(out_path, "JPEG", quality=90)
    print(f"Processed {filename} -> {out_name} ({target_w}x{target_h})")

for filename, w, h in specs:
    process_image(filename, w, h)
