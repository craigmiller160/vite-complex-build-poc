import { defineConfig, UserConfigExport, Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react-swc';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation, {
	Exposes,
	Shared,
	Remotes
} from '@originjs/vite-plugin-federation';

type PackageJson = Readonly<{
	name: string;
}>;
type NodeEnv = 'development' | 'test' | 'production';
export type ViteAppConfig = Readonly<{
	port: number;
	federation?: Readonly<{
		exposes?: Exposes;
		shared?: Shared;
		remotes?: Remotes;
	}>;
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

	return federation({
		name: packageJson.name,
		filename: 'remoteEntry.js',
		exposes: config.exposes,
		remotes: config.remotes,
		shared: config.shared
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
