// When logging in and issuing JWT
res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,            // required on HTTPS (Render)
  sameSite: 'None',        // required for cross-site (Vercel → Render)
  path: '/',
  // domain: 'biz2x-backend-project-backend.onrender.com', // optional; default is backend host
});