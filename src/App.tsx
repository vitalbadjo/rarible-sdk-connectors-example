import './App.css';
import {SdkConnectionProvider} from "./connector/sdk-connection-provider";
import { MainPage } from "./pages/main"

function App() {
	return (
		<SdkConnectionProvider>
			<MainPage/>
		</SdkConnectionProvider>
	);
}

export default App;
