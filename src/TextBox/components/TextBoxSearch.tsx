import React, {Component} from "react";

export interface CountProps {
    count: number
}

export class Count extends Component<CountProps> {
        
    render() {
        return <p>{this.props.count}</p>
    }
}
