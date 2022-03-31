import React from 'react';
import classNames from 'classnames';

//// styles entry - all others controlled via less imports
import '../styles/App.less';

import '../utils/GlobalMethods';

import Timeline from '../components/Timeline';
import Board from '../components/Board';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            expanded: false,
            sidebarCollapsed: false,
            overlayOpacity: 1,
            timelineData: {},
            currentBoard: null,
            isEditingTimeline: false,
        };
    }
    componentDidMount () {
        this.getTimelineData(1); ////////////// id should not be hardcoded

        this.handleWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.handleWindowResize);
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                this.handleWindowResize();
            });
        });
    }
    componentWillUnmount () {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    getTimelineData(timelineId, cb) {
        /////////////////////// this would normally come from ajax or redux sync

        if(!cb) cb = ()=>{};

        jQuery.getJSON(`/dummy_data/timeline-${timelineId}.json`,(data)=>{
            this.setState({
                timelineData: data
            }, cb);
        }).fail((jqXHR, textStatus, errorThrown)=>{
            console.log('error', errorThrown)
        });
    }

    getBoardData(boardId, cb) {
        /////////////////////// this would normally come from ajax or redux sync

        if(!cb) cb = ()=>{};

        jQuery.getJSON(`/dummy_data/board-${boardId}.json`,(data)=>{
            console.log(data)
            this.setState({
                currentBoard: data
            }, cb);
        }).fail((jqXHR, textStatus, errorThrown)=>{
            console.log('error', errorThrown)
        });
    }

    onWindowResize() {
        let height = (this.refs.app)
            ? this.refs.app.getBoundingClientRect().height
            : 0;
        this.setState({ height });
    }
    toggleSidebar() {
        this.setState({
            sidebarCollapsed: !this.state.sidebarCollapsed
        },()=>{
            setTimeout(()=>{
                this.setState({
                    overlayOpacity: this.state.sidebarCollapsed ? 0 : 1
                });
            });
        });
    }
    toggleExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }
    setBoard(boardId) {
        this.toggleSidebar();
        this.getBoardData(boardId);
    }
    toggleEditing() {
        this.setState({ isEditingTimeline: !this.state.isEditingTimeline });
    }

    render () {
        return (
            <div className="App theme-1" ref="app">
                <div className={classNames(
                    'app-sidebar',
                    {'collapsed': this.state.sidebarCollapsed}
                )}>
                    {!this.state.isEditingTimeline &&
                        <div className="sidebar-toggle" onClick={this.toggleSidebar.bind(this)}>
                            <i className="material-icons">keyboard_arrow_left</i>
                        </div>
                    }
                    {!this.state.isEditingTimeline &&
                        <div className="expand-button" onClick={this.toggleExpand.bind(this)}>
                            <i className="material-icons">{this.state.expanded ? 'fullscreen_exit' : 'fullscreen'}</i>
                        </div>
                    }
                    <div className="sidebar-content">
                        <Timeline
                            id={this.state.timelineData.id}
                            data={this.state.timelineData.nodes}
                            height={this.state.height}
                            expanded={this.state.expanded}
                            selectBoard={this.setBoard.bind(this)}
                            selectedBoard={this.state.currentBoard}
                            editing={this.state.isEditingTimeline}
                            toggleEditing={this.toggleEditing.bind(this)}
                        />
                    </div>
                </div>
                <div className="app-wrapper">
                    {this.renderBoard()}
                </div>
                {!this.state.sidebarCollapsed &&
                    <div className="app-overlay" style={{ opacity: this.state.overlayOpacity }} />
                }
            </div>
        );
    }
    renderBoard() {
        if(!this.state.currentBoard) return null;

        return (
            <div className="board-wrapper">
                <Board data={this.state.currentBoard} />
            </div>
        );
    }
}
