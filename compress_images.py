"""
Image compression script for PageSpeed optimization.
Compresses oversized images while maintaining visual quality.
Creates backups before overwriting.
"""
import os
import shutil
from PIL import Image

ASSETS_DIR = r"assets/images"
BACKUP_DIR = r"assets/images/_originals_backup"

# Compression targets: (filename, max_width, max_height, quality, format)
TARGETS = [
    # Hero image - 2.98MB -> target ~300KB
    ("finraul.webp", 1920, 1080, 75, "WEBP"),
    # Footer icons - 1.99MB each at 72x72px display! 
    ("email logo.png", 144, 144, 85, "PNG"),
    ("linkedin logo.png", 144, 144, 85, "PNG"),
    # Engagement hero - 13.71MB!!
    ("rvr engagements.jpg", 1920, 1080, 70, "JPEG"),
    # Press background - 2.07MB
    ("press bg.jpg", 1920, 1080, 70, "JPEG"),
    # Portrait - 1.99MB
    ("raul22.png", 800, 1000, 80, "PNG"),
    # Favicons - 0.89MB each
    ("favicon1.png", 256, 256, 85, "PNG"),
    ("faviconnobg.png", 256, 256, 85, "PNG"),
]

def compress_image(filepath, max_w, max_h, quality, fmt):
    """Compress an image by resizing and re-encoding."""
    try:
        img = Image.open(filepath)
        original_size = os.path.getsize(filepath)
        
        # Convert RGBA to RGB for JPEG
        if fmt == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Resize if larger than target
        if img.width > max_w or img.height > max_h:
            img.thumbnail((max_w, max_h), Image.LANCZOS)
        
        # Save with compression
        save_kwargs = {"optimize": True}
        if fmt in ("JPEG", "WEBP"):
            save_kwargs["quality"] = quality
        
        img.save(filepath, fmt, **save_kwargs)
        new_size = os.path.getsize(filepath)
        
        reduction = ((original_size - new_size) / original_size) * 100
        print(f"  [SUCCESS] {os.path.basename(filepath)}: {original_size/1024:.0f}KB -> {new_size/1024:.0f}KB ({reduction:.1f}% reduction)")
        return True
    except Exception as e:
        print(f"  [ERROR] {os.path.basename(filepath)}: {e}")
        return False

def main():
    # Create backup directory
    os.makedirs(BACKUP_DIR, exist_ok=True)
    print(f"Backing up originals to {BACKUP_DIR}/\n")
    
    for filename, max_w, max_h, quality, fmt in TARGETS:
        filepath = os.path.join(ASSETS_DIR, filename)
        if not os.path.exists(filepath):
            print(f"  [WARN] {filename} not found, skipping")
            continue
        
        # Backup original
        backup_path = os.path.join(BACKUP_DIR, filename)
        if not os.path.exists(backup_path):
            shutil.copy2(filepath, backup_path)
        
        compress_image(filepath, max_w, max_h, quality, fmt)
    
    print("\nDone! Originals backed up to assets/images/_originals_backup/")

if __name__ == "__main__":
    main()
