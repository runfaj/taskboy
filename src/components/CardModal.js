import React from 'react';
import classNames from 'classnames';
import Modal from '../wrappers/Modal';

export default class CardModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = jQuery.extend(props.data, {
            _expandImage: null
        });

    }

    onClose() {
        if(this.props.onClose)
            this.props.onClose();
    }
    onSave() {
        if(this.props.onSave)
            this.props.onSave(this.state);
    }
    expandImage(file) {
        this.setState({ _expandImage: file });
    }
    onImageClose() {
        this.setState({ _expandImage: null });
    }

    render() {

        const me = {
            id: 1234567,
            name: 'Bob Jones',
            email: 'bob@jones.com',
            thumb: 'http://woodlibrary.org/wp-content/uploads/2011/04/lego-head.jpg'
        };

        return (
            <div className="CardModal">
                <Modal className="card-modal" overlayClose={true} onClose={this.onClose.bind(this)}>

                    <div className="title-bar">
                        {this.state.assignedTo && this.state.assignedTo.length > 0 &&
                            this.state.assignedTo.map((person,i)=>(
                                <div className="person-bubble" style={{
                                    backgroundImage: person.thumb ? `url('${person.thumb}')` : null
                                }}>
                                    {!person.thumb && (person.name || " ")[0].toUpperCase()}
                                </div>
                            ))
                        }
                        <div className={classNames(
                            'person-bubble',
                            'add',
                            {'none-assigned': (!this.state.assignedTo || !this.state.assignedTo.length)}
                        )}>
                            <i className="material-icons">add</i>
                            {(!this.state.assignedTo || !this.state.assignedTo.length) &&
                                " Person"
                            }
                        </div>

                        <h1>{this.state.title}</h1>

                        <div className={classNames(
                            'assigned-group',
                            this.state.group && this.state.group.type ? this.state.group.type : 'add'
                        )} style={{
                            backgroundColor: this.state.group && this.state.group.color ? this.state.group.color : null
                        }}>
                            {this.state.group && this.state.group.name
                                ? this.state.group.name
                                : <span><i className="material-icons">add</i> Group</span>
                            }
                        </div>

                        <div className="due-date">
                            Due Date:
                            <span className={!this.state.due ? 'add' : ''}>{this.state.due
                                ? this.state.due
                                : "Choose..."
                            }</span>
                        </div>
                    </div>

                    <div className="left-column">
                        <div className="description">
                            <label>Description</label>
                            <span dangerouslySetInnerHTML={{ __html: this.state.description}}/>
                        </div>

                        <div className="info-boxes">
                            {this.state.deviceInfo &&
                                <div className="info-box">
                                    <label>Device Info</label>
                                    <span dangerouslySetInnerHTML={{ __html: this.state.deviceInfo}}/>
                                </div>
                            }

                            {this.state.activityInfo &&
                                <div className="info-box">
                                    <label>Activity Info</label>
                                    <span dangerouslySetInnerHTML={{ __html: this.state.activityInfo}}/>
                                </div>
                            }
                        </div>

                        <div className="attachments">
                            {this.state.attachments &&
                                this.state.attachments.map((item,i)=>(
                                    <div className="attachment">
                                        {item.type === 'image' &&
                                            <img src={item.thumb} onClick={this.expandImage.bind(this, item.file)} />
                                        }
                                        <div>{item.name}</div>
                                    </div>
                                ))
                            }
                        </div>

                        {this.state.checklists &&
                            this.state.checklists.map((list)=>(
                                <div className="checklist">
                                    <h2>{list.title}</h2>
                                    {list.items.map((item)=>(
                                        <div className={classNames(
                                            "checklist-item",
                                            {"complete": item.completed}
                                        )}>
                                            <input type="checkbox" checked={item.completed || null} />
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            ))
                        }

                        <div className="comment-section">
                            <h2>Comments</h2>
                            <div className="comment">
                                <div className="left-side">
                                    <div className="person-bubble" style={{
                                        backgroundImage: me.thumb ? `url('${me.thumb}')` : null
                                    }}>
                                        {!me.thumb && (me.name || " ")[0].toUpperCase()}
                                    </div>
                                </div>
                                <div className="right-side">
                                    <label>{me.name || me.email}</label>
                                    <textarea placeholder="Type Comment..."></textarea>
                                    <button className="button primary add-btn">Add Comment</button>
                                </div>
                            </div>
                            {this.state.comments &&
                                this.state.comments.map((comment)=>(
                                    <div className="comment">
                                        <div className="left-side">
                                            <div className="person-bubble" style={{
                                                backgroundImage: comment.user.thumb ? `url('${comment.user.thumb}')` : null
                                            }}>
                                                {!comment.user.thumb && (comment.user.name || " ")[0].toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="right-side">
                                            <div className="comment-stamp">{comment.stamp}</div>
                                            <label>{comment.user.name || comment.user.email}</label>
                                            <div className="comment-description" dangerouslySetInnerHTML={{ __html: comment.comment }} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="right-column">
                        <div className="side-group card-status">
                            --Status Dropdown TODO--
                        </div>
                        <div className="side-group client-visible">
                            <div>
                                <input type="checkbox" checked={this.state.clientVisible || null} />
                                <span>Client Visible</span>
                            </div>
                            <div>
                                <input type="checkbox" checked={this.state.needsInfo || null} />
                                <span>Client Need Info</span>
                            </div>
                        </div>
                        {this.state.status &&
                            <div className="side-group person-status">
                                <div>
                                    <span className="label">Created: </span>
                                    <span>{this.state.status.created ? this.state.status.created.user.name || this.state.status.created.user.email : ''}</span>
                                    <span className="date">{this.state.status.created ? " (" + this.state.status.created.stamp + ")" : ''}</span>
                                </div>
                                <div>
                                    <span className="label">Fixed: </span>
                                    <span>{this.state.status.fixed ? this.state.status.fixed.user.name || this.state.status.fixed.user.email : ''}</span>
                                    <span className="date">{this.state.status.fixed ? " (" + this.state.status.fixed.stamp + ")" : ''}</span>
                                </div>
                                <div>
                                    <span className="label">Verified: </span>
                                    <span>{this.state.status.verified ? this.state.status.verified.user.name || this.state.status.verified.user.email : ''}</span>
                                    <span className="date">{this.state.status.verified ? " (" + this.state.status.verified.stamp + ")" : ''}</span>
                                </div>
                                <div>
                                    <span className="label">Completed: </span>
                                    <span>{this.state.status.completed ? this.state.status.completed.user.name || this.state.status.completed.user.email : ''}</span>
                                    <span className="date">{this.state.status.completed ? " (" + this.state.status.completed.stamp + ")" : ''}</span>
                                </div>
                            </div>
                        }
                        <div className="side-group side-buttons">
                            <button className="button attachment-btn">
                                <i className="material-icons">attach_file</i>
                                Add Attachment
                            </button>
                            <button className="button checklist-btn">
                                <i className="material-icons">playlist_add_check</i>
                                Add Checklist
                            </button>
                            <button className="button archive-btn">
                                <i className="material-icons">archive</i>
                                Archive
                            </button>
                        </div>
                    </div>
                </Modal>

                {this.state._expandImage &&
                    <Modal overlayClose={true} onClose={this.onImageClose.bind(this)}>
                        <img className="full-image" src={this.state._expandImage} />
                    </Modal>
                }
            </div>
        );
    }
}
