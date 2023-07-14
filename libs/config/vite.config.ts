import {defineConfig, UserConfigExport, Plugin} from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react-swc';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation, { Exposes, Shared, Remotes } from '@originjs/vite-plugin-federation';

type PackageJson = Readonly<{
    name: string;
}>;
type NodeEnv = 'development' | 'test' | 'production';
export type ViteConfig = Readonly<{
    port: number;
    federation?: Readonly<{
        exposes?: Exposes;
        shared?: Shared;
        remotes?: Remotes;
    }>;
}>;

const configureFederation = (config?: ViteConfig['federation']): Plugin | undefined => {
    if (!config) {
        return undefined;
    }

    const packageJson: PackageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

    return federation({
        name: packageJson.name,
        filename: 'remoteEntry.js',
        exposes: config.exposes,
        remotes: config.remotes,
        shared: config.shared
    });
}

export const configureVite = (config: ViteConfig): UserConfigExport => {
    const nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;
    return defineConfig({
        root: path.join(process.cwd(), 'src'),
        server: {
            port: config.port
        },
        plugins: [
            react(),
            topLevelAwait(),
            configureFederation(config.federation)
        ],
        build: {
            outDir: path.join(process.cwd(), 'build'),
            emptyOutDir: true,
            minify: nodeEnv === 'production' ? 'terser' : false,
            cssMinify: nodeEnv === 'production' ? undefined : false,
            cssCodeSplit: nodeEnv === 'production',
            rollupOptions: {
                treeshake: nodeEnv === 'production' ? 'recommended' : false
            }
        }
    })
};