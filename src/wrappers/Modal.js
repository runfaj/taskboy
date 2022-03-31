import React from 'react';
import classNames from 'classnames';

/** shows up immediately. Pass onClose to for close handler **/

export default class Modal extends React.Component {
    onOverlayClick() {
        if(this.props.onClose && this.props.overlayClose)
            this.props.onClose();
    }

    render() {
        return (
            <div className={classNames('Modal', this.props.className)}>
                <div
                    className="modal-overlay"
                    onClick={this.onOverlayClick.bind(this)}
                    style={{ cursor: this.props.overlayClose ? 'pointer' : null }}
                />
                <div className="modal-inner">
                    {this.props.children}
                </div>
                <div className="modal-close" onClick={this.props.onClose ? this.props.onClose.bind(this) : null}>
                    <i className="material-icons">close</i>
                </div>
            </div>
        );
    }
}
