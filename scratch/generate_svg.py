import base64
from PIL import Image

mark_img = Image.open('public/logo-mark.png')
mw, mh = mark_img.size
print(f"Mark Dimensions: {mw}x{mh}")

with open('public/logo-mark.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_str = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {mw} {mh}" width="100%" height="100%">
  <image href="data:image/png;base64,{b64}" width="{mw}" height="{mh}" />
</svg>'''

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_str)

with open('public/logo-mark.svg', 'w', encoding='utf-8') as f:
    f.write(svg_str)

print("public/favicon.svg and public/logo-mark.svg created successfully!")
