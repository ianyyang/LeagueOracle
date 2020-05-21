// Modules & Libraries
import React, {Component} from 'react';

// CSS
import './styles/css/App.css';

// Components
import Uploads from './components/uploads';
import Archives from './components/archives';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Uploads />
                <Archives />
            </div>
        );
    }
}

export default App;
