import React, { Component, ReactNode, createElement} from "react";
import classNames from "classnames";

// import { Alert } from "./Shared/components/Alert";
import { DataSourceHelper } from "./Shared/DataSourceHelper/DataSourceHelper";
import { SharedUtils, WrapperProps } from "./Shared/SharedUtils";

import { Count } from "./TextBox/components/TextBoxSearch";
import { Validate } from "./Validate";
import { SharedContainerUtils } from "./Shared/SharedContainerUtils";

export interface ContainerProps extends WrapperProps {
    entity: string;
}


export interface ContainerState {
    listViewAvailable: boolean;
    count: number;
    alertMessage?: ReactNode;
}


export default class SearchContainer extends Component<ContainerProps, ContainerState> {
    private dataSourceHelper?: DataSourceHelper;
    private widgetDom: Element | null = null;
    private retriesFind = 0;

    constructor(props: ContainerProps) {
        super(props);
        this.state = {
            count: 0,
            listViewAvailable: false
        };

    }

    render() {
        return createElement("div", {
                className: classNames("widget-text-box-search", this.props.class),
                ref: widgetDom => this.widgetDom = widgetDom,
                style: SharedUtils.parseStyle(this.props.style)
            },
            this.renderCount()
        );
    }

    componentDidMount() {
        SharedUtils.delay(this.connectToListView.bind(this), this.checkListViewAvailable.bind(this), 20);
        this.listViewObjectCount.bind(this)
        setInterval (()=>this.listViewObjectCount (this.dataSourceHelper!), 1000)
    }

    // componentDidUpdate(_prevProps: ContainerProps, prevState: ContainerState) {
    //     console.log (this.state.count)
    //     console.log (prevState.count)
    //     // if (this.state.count !== prevState.count || this.state.count == -1) {
            
    //     // }
    // }

    private listViewObjectCount (dataSourceHelper:DataSourceHelper): void {
            const listView = dataSourceHelper.getListView()!
            const objs = listView._datasource as any
            const items = objs["_pageObjs"]
            const l = items.length 
            this.setState ({count:l})
    }

    private checkListViewAvailable(): boolean {
        if (!this.widgetDom) {
            return false;
        }
        this.retriesFind++;
        if (this.retriesFind > 25) {
            return true; // Give-up searching
        }

        return !!SharedContainerUtils.findTargetListView(this.widgetDom.parentElement, this.props.entity);
    }

    private renderCount(): ReactNode {
            return <Count count={this.state.count}/>
        }


    private connectToListView() {
        let alertMessage = "";

        try {
            this.dataSourceHelper = DataSourceHelper.getInstance(this.widgetDom, this.props.entity);
        } catch (error) {
            alertMessage = error.message;
        }

        this.setState({
            alertMessage: alertMessage || Validate.validateProps(),
            listViewAvailable: !alertMessage
        });
    }


}
