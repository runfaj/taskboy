import React from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import classNames from 'classnames';
import Card from './Card';
import CardModal from './CardModal';
import BoardFilters from './BoardFilters';

export default class ListView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: {},
            cardOpen: false
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    componentDidMount() {
        this.rebuildGroups();
    }
    componentDidUpdate(prevProps) {
        if(JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
            this.rebuildGroups();
        }
    }

    /****************** utils *******************/
    reorder(data) {
        return (data.reduce(function(obj, item) {
            obj[item.colId] = obj[item.colId] || [];
            obj[item.colId].push(item);
            obj[item.colId].sort(function(obj1, obj2) {
                return obj1.orderIndex - obj2.orderIndex;
            });
            return obj;
        }, {}));
    }
    reorderList(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.map((e, i) => {
            e.orderIndex = i;
        });
        return result;
    }
    rebuildGroups() {
        const groups = this.reorder(this.props.data.cards);
        this.setState({ groups });
    }
    getColById(id) {
        let cols = this.props.cols;
        let found = null;
        cols.forEach((col)=>{
            if(col.id == id)
                found = col;
        });
        return found;
    }

    /***************** card actions ******************/
    onAddCard(index) {
        let groups = this.state.groups;
        const date = '2017-10-09';
        const end = (groups[index] || []).length || 0;
        const cardId = this.props.data.cards.length;
        const user = {
            id: 1234567,
            name: 'Bob Jones',
            email: 'bob@jones.com',
            thumb: 'http://woodlibrary.org/wp-content/uploads/2011/04/lego-head.jpg'
        }
        const card = {
            orderIndex: end,
            cardId: cardId,
            colId: this.props.data.cols[index].id,
            group: {},
            attachments: [],
            checklists: [],
            description: "",
            title: "Empty Card",
            due: "",
            deviceInfo: "",
            activityInfo: "",
            status: {
                created: {
                    stamp: date,
                    user: user
                },
                fixed: null,
                verified: null,
                completed: null
            },
            comments: [],
            clientVisible: false,
            age: 0,
            assignedTo: null,
            notifications: 0,
            notificationsRead: true,
            needsInfo: false
        }
        this.props.data.cards.push(card);
        this.rebuildGroups();
    }
    onOpenCard(card) {
        if(this.state.cardOpen && card.cardId === this.state.cardOpen.cardId) {
            this.onCloseCard();
            return;
        }

        if(this.state.cardOpen)
            this.setState({cardOpen: false},()=>{
                this.setState({cardOpen: card});
            });
        else
            this.setState({cardOpen: card});
    }
    onCloseCard() {
        this.setState({cardOpen: false});
    }
    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const start = Number(result.source.droppableId.replace(/^\D+/g, ''));
        const end = Number(result.destination.droppableId.replace(/^\D+/g, ''));
        let groups = this.state.groups;
        let cards = this.props.data.cards;
        if (end > 0 && cards[result.draggableId].assignedTo === null) {
            alert("open modal to assign someone!");

        }

        if (start !== end) {
            cards[result.draggableId].colId = end;
            cards[result.draggableId].orderIndex = result.destination.index;

            groups = this.reorder(cards);
        } else {
            groups[end] = this.reorderList(groups[end], result.source.index, result.destination.index);
        }

        this.setState({groups});
    }

    /***************** filters ******************/
    listSort(a,b) {
        let sorting = this.props.filters['sortBy'];
        let asc = this.props.filters['sortDir'] === 'asc';

        if(sorting === 'Group') {
            if (!a.group || !a.group.id) return asc ? -1 : 1;
            if (!b.group || !b.group.id) return asc ? 1 : -1;
            if (a.group.name < b.group.name) return asc ? -1 : 1;
            if (a.group.name > b.group.name) return asc ? 1 : -1;
            return 0;
        }
        if(sorting === 'Due Date') {
            if(!a.due) return asc ? -1 : 1;
            if(!b.due) return asc ? 1 : -1;
            if(a.due < b.due) return asc ? -1 : 1;
            if(a.due > b.due) return asc ? 1 : -1;
            return 0;
        }
        if(sorting === 'Client Visible') {
            if(typeof a.clientVisible === 'undefined') return asc ? -1 : 1;
            if(typeof b.clientVisible === 'undefined') return asc ? 1 : -1;
            if(a.clientVisible < b.clientVisible) return asc ? -1 : 1;
            if(a.clientVisible > b.clientVisible) return asc ? 1 : -1;
            return 0;
        }
        if(sorting === 'Assigned') {
            if(!a.assignedTo || a.assignedTo.length === 0) return asc ? -1 : 1;
            if(!b.assignedTo || b.assignedTo.length === 0) return asc ? 1 : -1;

            let i = 0;
            while (a.assignedTo[i] && b.assignedTo[i]) {
                if(!a.assignedTo || a.assignedTo.length === i) return asc ? -1 : 1;
                if(!b.assignedTo || b.assignedTo.length === i) return asc ? 1 : -1;
                if(a.assignedTo[i].name < b.assignedTo[i].name) return asc ? -1 : 1;
                if(a.assignedTo[i].name > b.assignedTo[i].name) return asc ? 1 : -1;
                i++;
            }

            return 0;
        }

        //default case, doesn't work on objects
        if(a < b) return asc ? -1 : 1;
        if(b < a) return asc ? 1 : -1;
        return 0;
    }

    /***************** renders ******************/
    render() {
        return (<div className="ListView">
            <div className="list-area">
                {this.renderFilters()}
                <div className="list-container">
                    {(!this.props.filters['sortBy'] || this.props.filters['sortBy'] === 'Status') &&
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            {this.props.data.cols.map(this.renderStatusList.bind(this))}
                        </DragDropContext>
                    }
                    {this.props.filters['sortBy'] && this.props.filters['sortBy'] !== 'Status' &&
                        this.renderList()
                    }
                </div>
            </div>
            <div className="preview-area">
                {this.state.cardOpen &&
                    <CardModal data={this.state.cardOpen} onClose={this.onCloseCard.bind(this)} onSave={null/* called upon any save action, passes the new data */}/>
                }
            </div>
        </div>);
    }
    renderFilters() {
        return (
            <BoardFilters
                data={this.props.data}
                filters={this.props.filters}
                setFilters={this.props.setFilters.bind(this)}
                type='list-view'
            />
        );
    }
    renderStatusList(col, index) {
        if(this.props.filters['status'] && this.props.filters['status'] !== '_all' && this.props.filters['status'] != col.id)
            return null;

        const group = this.state.groups[col.id];

        return (<ul className="list" key={index}>
            <h2>
                <i className="material-icons">{col.icon}</i>
                <button className="button add-btn" onClick={this.onAddCard.bind(this, index)}><i className="material-icons">add</i></button>
                {col.title}
            </h2>
            <Droppable droppableId={`droppable-${col.id}`} key={index}>
                {
                    (provided, snapshot) => (<div className={classNames('drop-zone', {'dragging': snapshot.isDraggingOver})} ref={provided.innerRef}>

                        {group && group.map(this.renderListItem.bind(this))}
                        {provided.placeholder}

                    </div>)
                }
            </Droppable>
        </ul>);
    }
    renderList() {
        //since the list is no longer grouped by cols, we need to pass that info on
        //each card, so they can choose it
        let list = this.props.data.cards.map(card=>{
            let c = jQuery.extend({}, card);
            let col = this.getColById(c.colId);
            if(col) {
                c._col = col;
            }
            c._cols = this.props.data.cols;
            return c;
        });

        list.sort(this.listSort.bind(this));

        return (
            <ul className="list">
                {list.map((item, index)=>(
                    <li
                        className={classNames('list-drag')}
                        onClick={this.onOpenCard.bind(this, item)}
                        key={index}
                    >
                        <Card {...item} index={index} type="list" selected={this.state.cardOpen && item.cardId === this.state.cardOpen.cardId}/>
                    </li>
                ))}
            </ul>
        );
    }
    renderListItem(item, index) {
        if(!this.props.isCardVisible(item)) return null;

        return (<Draggable key={item.cardId} draggableId={item.cardId}>
            {
                (provided, snapshot) => (<div className={classNames('list-item', {'dragging': snapshot.isDragging})} style={{
                        height: provided.draggableStyle && provided.draggableStyle.height
                    }}>
                    <div
                        className={classNames('list-drag', {'dragging': snapshot.isDragging})}
                        ref={provided.innerRef}
                        style={provided.draggableStyle}
                        {...provided.dragHandleProps}
                        onClick={this.onOpenCard.bind(this, item)}
                    >
                        <Card {...item} index={index} type="list" selected={this.state.cardOpen && item.cardId === this.state.cardOpen.cardId}/>
                    </div>
                    {provided.placeholder}
                </div>)
            }
        </Draggable>);

    }
}
