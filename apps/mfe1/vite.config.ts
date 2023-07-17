import { configureViteApplication } from 'config';

export default configureViteApplication({
	port: 3001,
	federation: {
		exposes: {
			'./App': './src/App.tsx'
		}
	}
});
