import { defineConfig, UserConfigExport, Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react-swc';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation, { Exposes, Remotes } from '@originjs/vite-plugin-federation';

type PackageJson = Readonly<{
	name: string;
	dependencies: Record<string, string>;
}>;
type NodeEnv = 'development' | 'test' | 'production';
export type ViteAppConfig = Readonly<{
	port: number;
	federation?: Readonly<{
		exposes?: Exposes;
		remotes?: Remotes;
	}>;
}>;
type SharedConfig = Readonly<{
	version: string;
	requiredVersion: string;
}>;

const srcDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');
const packageJsonFile = path.join(process.cwd(), 'package.json');

const configureFederation = (
	config?: ViteAppConfig['federation']
): Plugin | undefined => {
	if (!config) {
		return undefined;
	}

	const packageJson: PackageJson = JSON.parse(
		fs.readFileSync(packageJsonFile, 'utf8')
	);

	const shared = Object.entries(packageJson.dependencies)
		.map(([name, version]): [string, SharedConfig] => [
			name,
			{
				version,
				requiredVersion: version
			}
		])
		.reduce<Record<string, SharedConfig>>((acc, [name, config]) => {
			acc[name] = config;
			return acc;
		}, {});

	return federation({
		name: packageJson.name,
		filename: 'remoteEntry.js',
		exposes: config.exposes,
		remotes: config.remotes,
		shared: ['react', 'react-dom', '@mui/material', '@emotion/styled']
	});
};

export const configureVite = (config: ViteAppConfig): UserConfigExport => {
	const nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;
	return defineConfig({
		root: srcDir,
		server: {
			port: config.port
		},
		plugins: [
			react(),
			topLevelAwait(),
			configureFederation(config.federation)
		],
		build: {
			outDir: buildDir,
			emptyOutDir: true,
			minify: nodeEnv === 'production' ? 'terser' : false,
			cssMinify: nodeEnv === 'production' ? undefined : false,
			cssCodeSplit: nodeEnv === 'production',
			rollupOptions: {
				treeshake: nodeEnv === 'production' ? 'recommended' : false
			}
		}
	});
};
