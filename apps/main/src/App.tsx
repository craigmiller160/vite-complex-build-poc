import { Other } from './jsAndTs/Other';
import { Pretty } from './mui/Pretty';
import { CircularProgress } from '@mui/material';
import { LazyWrapper } from 'react-lazy';

export const App = () => (
	<div>
		<h1>Welcome to the Main App</h1>
		<Other />
		<Pretty />
		<LazyWrapper path="mfe1/App" loading={<CircularProgress />} />
	</div>
);
