import React from 'react';
import classNames from 'classnames';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Card from './Card';
import CardModal from './CardModal';

export default class ColumnView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: {},
            cardOpen: false,
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    componentDidMount() {
        this.rebuildGroups();
    }
    componentDidUpdate(prevProps) {
        if(JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data))
            this.rebuildGroups();
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

    /***************** card actions ******************/
    onAddCard(index) {
        let groups = this.state.groups;
        const date = '2017-10-09';
        const end = groups[index].length || 0;
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
        groups = this.reorder(this.props.data.cards);
        this.setState({groups});
    }
    onOpenCard(card) {
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

    /***************** renders ******************/
    render() {
        return (<div className="ColumnView">
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.props.data.cols.map(this.renderCol.bind(this))}
            </DragDropContext>

            {this.state.cardOpen && <CardModal data={this.state.cardOpen} onClose={this.onCloseCard.bind(this)} onSave={null/* called upon any save action, passes the new data */}/>}
        </div>);
    }
    renderCol(col, index) {
        const group = this.state.groups[col.id];

        return (<div className="col" key={index}>
            <h2>
                <i className="material-icons">{col.icon}</i>
                {col.title}
            </h2>
            <Droppable droppableId={`droppable-${col.id}`} key={index}>
                {
                    (provided, snapshot) => (<div className={classNames('drop-zone', {'dragging': snapshot.isDraggingOver})} ref={provided.innerRef}>

                        {group && group.map(this.renderCard.bind(this))}
                        {provided.placeholder}

                    </div>)
                }
            </Droppable>
            <div className="add-container">
                <button className="button add-btn" onClick={this.onAddCard.bind(this, index)}>Add Card</button>
            </div>
        </div>);
    }
    renderCard(card, cardIndex) {
        if(!this.props.isCardVisible(card)) return null;

        return (<Draggable key={card.cardId} draggableId={card.cardId}>
            {
                (provided, snapshot) => (<div className={classNames('place-card', {'dragging': snapshot.isDragging})} style={{
                        height: provided.draggableStyle && provided.draggableStyle.height
                    }}>
                    <div
                        className={classNames('card', {'dragging': snapshot.isDragging})}
                        ref={provided.innerRef}
                        style={provided.draggableStyle}
                        {...provided.dragHandleProps}
                        onClick={this.onOpenCard.bind(this, card)}
                    >
                        <Card {...card} index={cardIndex}/>
                    </div>
                    {provided.placeholder}
                </div>)
            }
        </Draggable>);
    }
}
