import { Other } from './jsAndTs/Other';
import { Pretty } from './mui/Pretty';
import { App as Mfe1App } from 'mfe1/App';
import { useState } from 'react';
import { Button } from '@mui/material';

import('mfe1/App').then((res) => {
	console.log('RES', res.default.App);
});

export const App = () => {
	const [showMfe1, setShowMfe1] = useState<boolean>(false);
	const toggleShowMfe1 = () => setShowMfe1((prevState) => !prevState);
	return (
		<div>
			<h1>Welcome to the Main App</h1>
			<Other />
			<Pretty />
			<Button variant="contained" onClick={toggleShowMfe1}>
				Toggle MFE1
			</Button>
			{
				showMfe1 &&
				<Mfe1App />
			}

		</div>
	);
};
