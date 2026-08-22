import os
from PIL import Image, ImageDraw, ImageFont

# Textures definition
career_items = {
    'careerHetic': {
        'title': 'THE BEGINNING',
        'subtitle': 'FIRST STEPS IN TECH'
    },
    'careerFreelancer': {
        'title': 'IT MINDSET',
        'subtitle': 'LEARN, ADAPT, INNOVATE'
    },
    'careerUzik': {
        'title': 'EXPLORATION',
        'subtitle': 'EXPLORING TECH WORLD'
    },
    'careerIRLTeacher': {
        'title': 'THE IT JOURNEY',
        'subtitle': 'BUILDING FOUNDATION'
    },
    'careerImmersiveGarden': {
        'title': 'GROWTH',
        'subtitle': 'SKILLS IN PRACTICE'
    },
    'careerOnlineTeacher': {
        'title': 'PROFESSIONAL JOURNEY',
        'subtitle': 'IT PRO PATH'
    }
}

font_path = 'scripts/PressStart2P-Regular.ttf'
if not os.path.exists(font_path):
    print("Font not found!")
    exit(1)

out_dir = 'static/career'
os.makedirs(out_dir, exist_ok=True)

# Colors
RED = (255, 0, 0, 255)      # Title -> glows with line color in shader
GREEN = (0, 255, 0, 255)    # Subtitle -> mask/dark stone color in shader
BLACK = (0, 0, 0, 0)        # Transparent background

WIDTH = 240
HEIGHT = 60

for name, item in career_items.items():
    title_text = item['title']
    subtitle_text = item['subtitle']
    
    # Title font sizing
    title_font_size = 13 if len(title_text) <= 14 else 10
    sub_font_size = 8 if len(subtitle_text) <= 22 else 7
    
    title_font = ImageFont.truetype(font_path, title_font_size)
    sub_font = ImageFont.truetype(font_path, sub_font_size)
    
    # Calculate bounding box
    dummy_img = Image.new('RGBA', (10, 10), BLACK)
    dummy_draw = ImageDraw.Draw(dummy_img)
    
    tb = dummy_draw.textbbox((0, 0), title_text, font=title_font)
    title_w = tb[2] - tb[0]
    title_h = tb[3] - tb[1]
    
    sb = dummy_draw.textbbox((0, 0), subtitle_text, font=sub_font)
    sub_w = sb[2] - sb[0]
    sub_h = sb[3] - sb[1]
    
    img = Image.new('RGBA', (WIDTH, HEIGHT), BLACK)
    draw = ImageDraw.Draw(img)
    
    # Center title horizontally, place in upper half
    title_x = (WIDTH - title_w) // 2
    title_y = 12
    draw.text((title_x, title_y), title_text, fill=RED, font=title_font)
    
    # Center subtitle horizontally, place in lower half
    sub_x = (WIDTH - sub_w) // 2
    sub_y = 36
    draw.text((sub_x, sub_y), subtitle_text, fill=GREEN, font=sub_font)
    
    png_path = os.path.join(out_dir, f'{name}.png')
    img.save(png_path)
    print(f"Generated {png_path} ({WIDTH}x{HEIGHT})")

print("All career textures (fixed 240x60) generated successfully!")
