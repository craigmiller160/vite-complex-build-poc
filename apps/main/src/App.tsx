import React, { Suspense } from 'react';
import { Other } from './jsAndTs/Other';
import { Pretty } from './mui/Pretty';
import { Button, CircularProgress } from '@mui/material';
import { LazyWrapper } from 'react-lazy';
import { useState } from 'react';

const MfeApp = React.lazy(() => import('mfe1/App').then((res) => {
	console.log('RES', res);
	return res.default.App;
}));

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
			{showMfe1 && (
				<LazyWrapper
					path="mfe1/App"
					name="App"
					loading={<CircularProgress />}
				/>
			)}
			<Suspense fallback="Loading...">
				<MfeApp />
			</Suspense>
		</div>
	);
};
