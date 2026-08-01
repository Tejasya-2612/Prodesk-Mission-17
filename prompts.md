# Prompt 1 – Production Deployment

Upgrade the existing MERN application for production deployment. Configure the frontend for Vercel and the backend for Render. Ensure all environment variables are securely managed using deployment dashboards instead of local files. Remove hardcoded localhost URLs and replace them with environment variables.

---

# Prompt 2 – Backend Deployment

Deploy the Express backend to Render.

Requirements:

- Configure package.json with a production start script.
- Connect to MongoDB Atlas.
- Configure environment variables.
- Enable secure CORS.
- Handle production errors gracefully.
- Verify successful deployment.

---

# Prompt 3 – Frontend Deployment

Deploy the React Vite frontend to Vercel.

Requirements:

- Build successfully using npm run build.
- Configure VITE_API_URL.
- Remove localhost references.
- Connect to deployed backend.
- Configure SPA routing using vercel.json.
- Verify deployment.

---

# Prompt 4 – Environment Variables

Create .env.example files without exposing any secrets.

Backend variables:

- PORT
- MONGODB_URI
- JWT_SECRET
- CLIENT_URL
- CLOUDINARY_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- STRIPE_SECRET_KEY
- STRIPE_PRICE_ID
- GEMINI_API_KEY

Frontend variables:

- VITE_API_URL

---

# Prompt 5 – Production Security

Improve production security.

Tasks:

- Secure CORS configuration.
- Remove exposed secrets.
- Validate environment variables.
- Improve API error handling.
- Protect JWT authentication.
- Verify MongoDB connection.

---

# Prompt 6 – Lighthouse Optimization

Optimize the application for production.

Tasks:

- Improve loading performance.
- Reduce unnecessary JavaScript.
- Compress assets.
- Improve Accessibility.
- Fix Lighthouse warnings.
- Improve SEO metadata.

Target:

- Performance ≥ 90
- Accessibility ≥ 90

---

# Prompt 7 – Accessibility Improvements

Improve accessibility by:

- Adding labels to every form element.
- Adding labels to select controls.
- Improving color contrast.
- Adding aria-label attributes where necessary.
- Marking decorative SVG icons using aria-hidden.
- Preserving the existing UI.

---
