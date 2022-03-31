import React from 'react';
import classNames from 'classnames';
import Modal from '../wrappers/Modal';

export default class TimelineModal extends React.Component {
    constructor(props) {
        super(props);

        this.originalData = jQuery.extend(true, {}, props.data);

        this.state = {
            data: props.data
        };

        console.log(props.data)
    }

    handleChange(key, event) {
        let {data} = this.state;
        data[key] = event.target.value;
        this.setState({ data });
    }

    onCancel() {
        if(this.props.onCancel)
            this.props.onCancel();
    }
    onSave() {
        if(this.props.onSave)
            this.props.onSave(this.state.data);
    }

    render() {
        return (
            <div className="TimelineModal">
                <Modal onClose={this.onCancel.bind(this)}>
                    <h1>Editing {this.originalData.name}</h1>
                    <div className="left-column">
                        <label>Item Name</label>
                        <input type="text" value={this.state.data.name} onChange={this.handleChange.bind(this, 'name')} />

                        <label>Start Date</label>
                        <input type="text" value={this.state.data.start_date} onChange={this.handleChange.bind(this, 'start_date')} />

                        <label>End Date</label>
                        <input type="text" value={this.state.data.end_date} onChange={this.handleChange.bind(this, 'end_date')} />

                        <label>Status</label>
                        <div className="status-field" style={{ textTransform: 'capitalize' }}>
                            <i className="material-icons">{this.state.data.status.icon}</i>
                            {(this.state.data.status.label)}
                        </div>
                    </div>
                    <div className="right-column">
                        <label>Description</label>
                        <textarea value={this.state.data.description} onChange={this.handleChange.bind(this, 'description')} />
                    </div>
                    <div className="button-container">
                        <button className="button cancel-btn" onClick={this.onCancel.bind(this)}>Cancel</button>
                        <button className="button primary save-btn" onClick={this.onSave.bind(this)}>Save</button>
                    </div>
                </Modal>
            </div>
        );
    }
}
