/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
}

module.exports = {
    ...nextConfig,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://sigmator-3345fc.spheron.app/:path*",
            },
        ]
    },
    images: {
        loader: "akamai",
        path: "",
    },
    trailingSlash: true,
}
