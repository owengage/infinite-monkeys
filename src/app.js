import React, { Component } from 'react';
import { render } from 'react-dom';

class Hello extends Component {
    render() {
        return <p>Hello, world</p>
    }
}

render(<Hello />, document.getElementById('app'));
