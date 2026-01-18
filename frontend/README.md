# Fidera Frontend - Developer Guide

## 1. Setup & Run

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 2. Key Components to Build

### A. The "Transparency Gate" (Priority #1)
This is the core differentiator. Use the `TransparencyGate` component in `src/components/TransparencyGate.tsx`.

**Logic:**
1. User selects file using `<input type="file" />`.
2. Call `POST /api/v1/files/stage` (formData).
3. Response gives:
   - `metadata_raw` (The ugly truth: GPS, Device, etc.)
   - `metadata_clean_preview` (The safe version)
4. **Display Side-by-Side**:
   - Left Column: "What You're Sharing (Current)" - use Warning Colors (Red/Yellow).
   - Right Column: "What Receivers See (Clean)" - use Success Colors (Green/Blue).
5. User clicks **"Sanitize & Share"**.
6. Call `POST /api/v1/files/confirm`.

### B. Viewer Experience
Route: `/view/[token]`

1. **Clean Interface**: No distracting menus.
2. **PDF Viewer**: Use `react-pdf` or generic object embed.
3. **Chat Panel**: Floating or split-screen right panel.
4. **Watermark**: Overlay user session ID lightly over the document.

## 3. API Integration

Base URL: `http://localhost:8000/api/v1`

**Endpoints:**
- `POST /files/stage` -> Returns `{file_id, metadata...}`
- `POST /files/{file_id}/confirm` -> Returns `{status, share_url}`

## 4. UI Library Recommendations
- **Icons**: Lucide React (`npm install lucide-react`)
- **Components**: Shadcn/UI (Highly recommended for premium feel)
- **Animations**: Framer Motion (`npm install framer-motion`)

## 5. Design Tokens (Tailwind)
- **Primary**: Deep Blue/Purple (Trust & Intelligence)
- **Danger**: Privacy Red (For leaked metadata)
- **Success**: Secure Green (For sanitized state)
