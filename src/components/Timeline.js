import React from 'react';
import classNames from 'classnames';
import InfiniteTree from 'react-infinite-tree';
import TimelineModal from './TimelineModal';

import CardModal from './CardModal';

export default class Timeline extends React.Component {
    /**
        Requires height prop as a number and expanded as a boolean
    **/
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
        };
    }
    componentDidMount() {
        this.tree.loadData(this.props.data);
    }
    componentDidUpdate() {
        this.tree.loadData(this.props.data);
    }
    cancelModal() {
        this.setState({
            modalOpen: false
        });
    }
    selectBoard(boardId) {
        this.props.selectBoard(boardId);
    }
    updateNode(newNode) {
        if(newNode.id === -1) {
            let pId = newNode.parent.id;
            let siblings = newNode.parent.children.length;
            newNode.id = [pId, siblings + 1].join('.');
            this.tree.appendChildNode(newNode, newNode.parent);
            this.tree.openNode(newNode.parent);
        } else {
            this.tree.updateNode(this.state.modalOpen, newNode);
        }
        this.setState({ modalOpen: false });
    }

    addItem(node) {
        this.setState({
            modalOpen: {
                id: -1,
                name: 'New Node',
                parent: node
            }
        });
    }
    cloneItem(node) {
        let parent = node.parent;
        let parentId = parent.id || "";
        let newNode = jQuery.extend(true, {}, node);

        let depth = node.state.depth;
        let id = newNode.id.split('.');
        let currId = parseInt(id[depth]);
        let newId = id.slice(0,depth);

        newId.push(++currId);
        newId = newId.join('.');
        newNode.id = newId;

        const recurseChildren = (n)=>{
            let newItem = jQuery.extend(true, {}, n);
            newItem.id = newId + newItem.id.substr(newId.length);
            newItem.children = newItem.children.map(recurseChildren.bind(this));
            return newItem;
        };

        newNode = recurseChildren(newNode);
        this.tree.appendChildNode(newNode, parent);
    }
    deleteItem(node) {
        this.tree.removeNode(node);
    }
    editItem(node) {
        this.setState({
             modalOpen: node
        });
    }

    render () {
        return (
            <div className={classNames(
                'Timeline',
                {
                    'expanded': this.props.editing || this.props.expanded,
                    'editing': this.props.editing,
                }
            )}>
                <div className="top-bar">
                    <div
                        className={classNames('icon-button','edit',{'toggled': this.props.editing})}
                        onClick={this.props.toggleEditing.bind(this)}
                        title="Edit Nodes"
                    >
                        <i className="material-icons">edit</i>
                    </div>
                    <span>Timeline Item</span>
                    <div className="date end">End Date</div>
                    <div className="date start">Start Date</div>
                    <div className="days">Days</div>
                </div>
                <InfiniteTree
                    ref={(el) => this.tree = el ? el.tree : null}
                    autoOpen={true}
                    loadNodes={null}
                    selectable={false}
                    width="100%"
                    height={this.props.height - 32 /**for top nav**/}
                    rowHeight={32}
                    className="infinite-tree"
                    rowRenderer={({node, tree}) => {
                        const hasChildren = node.hasChildren();
                        let toggleState = '';
                        if ((!hasChildren && node.loadOnDemand) || (hasChildren && !node.state.open)) {
                            toggleState = 'closed';
                        }
                        if (hasChildren && node.state.open) {
                            toggleState = 'opened';
                        }
                        return this.renderRow(tree, node, toggleState);
                    }}
                />

                {this.state.modalOpen &&
                    <TimelineModal
                        data={this.state.modalOpen}
                        onCancel={this.cancelModal.bind(this)}
                        onSave={this.updateNode.bind(this)}
                    />
                }
            </div>
        );
    }
    renderRow(tree, node, toggleState) {
        let {
            id,
            name,
            board=-1,
            status={},
            loadOnDemand = false,
            children,
            state,
            props={},
            start_date="",
            end_date=""
        } = node;
        let {depth, open, path, prefixMask, total} = node.state;
        const more = node.hasChildren();

        const expanded = more && open;

        let days = "";
        if(start_date && end_date) {
            const start = new Date(start_date);
            const end = new Date(end_date);
            const timeDiff = Math.abs(end.getTime() - start.getTime());
            days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        }

        return (
            <div
                className={classNames(
                    'tree-item',
                    {/* 'selected': selected */}
                )}
                data-id={id}
            >
                <div className={classNames(
                    'icon-button',
                    'status'
                )}>
                    <i className="material-icons">
                        {status.icon}
                    </i>
                </div>

                <div
                    className={classNames("tree-node",{
                        "board-selected": board > 0 && board === this.props.selectedBoard
                    })}
                    style={{
                        marginLeft: depth * 8 + 30
                    }}
                >
                    {(more || !more && loadOnDemand) &&
                        <div
                        onClick={() => {
                                if (toggleState === 'closed') {
                                    tree.openNode(node);
                                } else if (toggleState === 'opened') {
                                    tree.closeNode(node);
                                }
                            }}
                            className={classNames(
                                'icon-button',
                                'toggle',
                                { 'expanded': expanded }
                            )}
                        >
                            <i className="material-icons">keyboard_arrow_right</i>
                        </div>
                    }
                    {!more && !loadOnDemand && board == -1 &&
                        <div className={classNames(
                            'icon-button',
                            'invisible'
                        )}></div>
                    }
                    {board > 0 &&
                        <div
                            className={classNames(
                                'icon-button',
                                'board'
                            )}
                            onClick={this.selectBoard.bind(this, board)}
                        >
                            <i className="material-icons">dashboard</i>
                        </div>
                    }

                    <span className="item-title">{name}</span>

                    {end_date &&
                        <div className="date end">{end_date}</div>
                    }
                    {start_date &&
                        <div className="date start">{start_date}</div>
                    }
                    {days &&
                        <div className="days">{days}</div>
                    }

                    <div className="edit-buttons">
                        <div
                            className={classNames('icon-button','edit')}
                            onClick={this.editItem.bind(this, node)}
                            title="Edit"
                        >
                            <i className="material-icons">edit</i>
                        </div>
                        <div
                            className={classNames('icon-button','add')}
                            onClick={this.addItem.bind(this, node)}
                            title="Add Child"
                        >
                            <i className="material-icons">add</i>
                        </div>
                        <div
                            className={classNames('icon-button','clone')}
                            onClick={this.cloneItem.bind(this, node)}
                            title="Clone"
                        >
                            <i className="material-icons">content_copy</i>
                        </div>
                        <div
                            className={classNames('icon-button','delete')}
                            onClick={this.deleteItem.bind(this, node)}
                            title="Delete"
                        >
                            <i className="material-icons">close</i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
