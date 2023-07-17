import { configureViteApplication } from 'config';

export default configureViteApplication({
	port: 3000,
	federation: {
		remotes: {
			mfe1: 'http://localhost:3001/assets/remoteEntry.js'
		},
		excludeFromSharing: ['@emotion/styled']
	}
});
