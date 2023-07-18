import { defineConfig, Plugin, UserConfigExport } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation, { Exposes, Remotes } from '@originjs/vite-plugin-federation';
import { getPackageJson } from './PackageJson';

type NodeEnv = 'development' | 'test' | 'production';
export type ViteAppConfig = Readonly<{
	port: number;
	federation?: Readonly<{
		exposes?: Exposes;
		remotes?: Remotes;
		excludeFromSharing?: ReadonlyArray<string>;
	}>;
}>;
type SharedConfig = Readonly<{
	version: string;
	requiredVersion: string;
	singleton: boolean;
}>;

const srcDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');

const configureFederation = (
	config?: ViteAppConfig['federation']
): Plugin | undefined => {
	if (!config) {
		return undefined;
	}

	const excludeFromSharing = config.excludeFromSharing ?? [];

	const packageJson = getPackageJson();

	const shared = Object.entries(packageJson.dependencies ?? {})
		.map(([name, version]): [string, SharedConfig] => [
			name,
			{
				version,
				requiredVersion: version,
				singleton: true // TODO don't know if this is doing anything
			}
		])
		.filter(([name]) => !excludeFromSharing.includes(name))
		.reduce<Record<string, SharedConfig>>((acc, [name, config]) => {
			acc[name] = config;
			return acc;
		}, {});

	return federation({
		name: packageJson.name,
		filename: 'remoteEntry.js',
		exposes: config.exposes,
		remotes: config.remotes,
		shared: {
			...shared
			// 'react/jsx-runtime': {}
		}
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
