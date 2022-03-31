import React from 'react';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

export default class Card extends React.Component {
    onNotificationClick(e) {
        e.preventDefault();
        e.stopPropagation();

        alert('clicked notifications');
    }

    render(){
        const titleLen = 52;
        const title = this.props.title.length > titleLen
                        ?   this.props.title.substr(0,titleLen) + "&hellip;"
                        :   this.props.title;

        return(
            <div className={classNames(
                'Card',
                'clearfix',
                {'list-type': this.props.type === 'list',
                 'selected': this.props.selected}
            )}>
                <div className="title">
                    {this.props._col && this.props._col.id &&
                        <i className="status-icon material-icons" title={this.props._col.title}>{this.props._col.icon}</i>
                    }

                    {this.props.assignedTo && this.props.assignedTo.length > 0 &&
                        <div className="person-bubble" style={{
                            backgroundImage: this.props.assignedTo[0].thumb ? `url('${this.props.assignedTo[0].thumb}')` : null
                        }}>
                            {!this.props.assignedTo[0].thumb && (this.props.assignedTo[0].name || " ")[0].toUpperCase()}
                        </div>
                    }

                    {this.props.type === 'list' && this.renderGroup()}

                    <span dangerouslySetInnerHTML={{ __html: title }} />
                </div>

                {this.props.type !== 'list' &&
                    <div className="date-row">
                        {this.renderGroup()}
                        <span className="due-date">{(this.props.due || "").split('T')[0]}</span>
                    </div>
                }

                {this.renderNotifications()}
            </div>
        );
    }

    renderGroup() {
        if(!this.props.group || !this.props.group.id) return null;

        return (
            <div className={classNames(
                'assigned-group',
                this.props.group.type
            )} style={{
                backgroundColor: this.props.group && this.props.group.color ? this.props.group.color : null
            }}>
                {this.props.group.name}
            </div>
        );
    }

    renderNotifications() {
        return (
            <div className="preferences">
                {typeof this.props.notifications !== 'undefined' && this.props.notifications > 0 &&
                    <span className="notifications" onClick={this.onNotificationClick.bind(this)}>
                        <i className="material-icons notification">notifications</i>
                        <span className="remaining">{this.props.notifications}</span>
                    </span>
                }

                {this.props.type === 'list' && <span className="due-date">{(this.props.due || "").split('T')[0]}</span>}

                {this.props.needsInfo &&
                    <i className="material-icons info">info_outline</i>
                }
                {this.props.clientVisible &&
                    <i className="material-icons visible">visibility</i>
                }
            </div>
        );
    }
}
