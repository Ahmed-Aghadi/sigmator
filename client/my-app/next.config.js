/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
}

module.exports = {
    ...nextConfig,
    images: {
        loader: "akamai",
        path: "",
    },
    trailingSlash: true,
}
