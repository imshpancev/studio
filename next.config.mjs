
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
     webpack: (config, { isServer, dev }) => {
        config.experiments = { ...config.experiments, asyncWebAssembly: true };
        config.output.webassemblyModuleFilename =
          (isServer ? '../' : '') + 'static/wasm/[modulehash].wasm';
        return config;
    },
};

export default nextConfig;
