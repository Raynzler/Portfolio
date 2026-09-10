/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // The CV was previously served at the hyphenated path. That URL is already
  // out in LinkedIn profiles and sent emails, so it has to keep resolving.
  // Redirects are evaluated before public/ files, so this survives even if a
  // file is ever restored at the old name.
  async redirects() {
    return [
      {
        source: '/Hamza-Shaikh-CV.pdf',
        destination: '/Hamza_Shaikh_CV.pdf',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
