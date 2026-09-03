# 📂 Certificates Folder

Place all your certificate image files inside this folder.

---

## How to Add a New Certificate

### Step 1 — Paste your certificate file here
Drop your certificate image into this folder:
```
public/certificates/
```

### Step 2 — Name your file clearly
Use a descriptive, lowercase, hyphen-separated name:
```
aws-cloud-practitioner.jpg
python-for-everybody.png
google-ux-design.webp
```

### Step 3 — Open the data file
Open this file in your editor:
```
src/data/certificates.js
```

### Step 4 — Copy-paste this template and fill in your details
```js
{
  id: 99,              // Use a unique number (increment from the last one)
  title: "Certificate Name",
  issuer: "Issuing Organization",
  date: "2026",
  image: "/certificates/your-file-name.jpg",
  file: "/certificates/your-file-name.jpg"
}
```
Add a comma after the previous entry, then paste your new object.

---

## Supported File Formats
| Format | Extension | Notes |
|--------|-----------|-------|
| JPEG   | `.jpg` / `.jpeg` | Recommended — best for photos |
| PNG    | `.png` | Good for text-heavy certificates |
| WebP   | `.webp` | Best compression + quality |

> **Tip:** JPG/PNG/WebP images work best for the slider preview.
> The download button will deliver the original file as-is.

---

## Quick Reference
| What to change | Where |
|---|---|
| Certificate file | `public/certificates/` |
| Certificate info | `src/data/certificates.js` |
| Navigation | Automatic — just add the object |
