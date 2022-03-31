import React from 'react';
import classNames from 'classnames';
import ColumnView from './ColumnView';
import ListView from './ListView';
import BoardFilters from './BoardFilters';

/*
{type:"programmer",name:"Programmer",color:"rgba(0, 65, 247, .5)"},
{type:"designer",name:"Designer",color:"rgba(247, 140, 0, .5)"},
{type:"writer",name:"Writer",color:"rgba(0, 140, 49, .5)"},
{type:"manager",name:"Manager",color:"rgba(236, 45, 255, .5)"},
*/


export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          view: parseInt(window.readCookie('board_view') || 0),
          filters: {},
          filtersVisible: false, //only applies in column view
        }
    }
    onViewClick(){
        this.setState({
            view: this.state.view === 1 ? 0 : 1,
            filtersVisible: false
        },()=>{
            window.setCookie('board_view', this.state.view, 365);
        });
    }
    onWrapperClick(e) {
        const el = jQuery(e.target);

        //click outside of filters will close it
        if(this.state.filtersVisible && !(el.is('.BoardFilters') || el.parents('.BoardFilters').length)) {
            this.setState({ filtersVisible: false });
        }
    }
    setFilters(filters) {
        this.setState({ filters });
    }
    toggleFilters() {
        this.setState({
            filtersVisible: !this.state.filtersVisible
        });
    }
    isCardVisible(card) {
        let isVisible = true;
        Object.keys(this.state.filters).forEach((filterKey)=>{
            let value = this.state.filters[filterKey];

            switch(filterKey) {
                case 'user':
                    if (value === '_all' || value === "") break;
                    if (value === '_empty') {
                        if(card.assignedTo && card.assignedTo.length)
                            isVisible = false;
                        break;
                    }

                    let exists = false;
                    (card.assignedTo || []).forEach((user)=>{
                        if(user.id == value)
                            exists = true;
                    });
                    if(!exists)
                        isVisible = false;
                    break;
                case 'group':
                    if (value === '_all' || value === "") break;
                    if (value === '_empty') {
                        if (card.group && card.group.id)
                            isVisible = false;
                        break;
                    }

                    if((card.group || {}).id != value)
                        isVisible = false;
                    break;
                case 'clientVisible':
                    if (value === '_all' || value === "") break;

                    if(card.clientVisible && value === 'no' || !card.clientVisible && value === 'yes')
                        isVisible = false;
                    break;
                case 'dueDate':
                    if(value) {
                        let cardDate = card.due;
                        if (!cardDate || Date.parse(cardDate) !== Date.parse(value + "T00:00:00"))
                            isVisible = false;
                    }
                    break;
            }
        });
        return isVisible;
    }
    render() {
        let backgroundImage = this.props.data.backgroundImage ? `url('${this.props.data.backgroundImage}')` : null;

        return (
            <div className="Board" style={{ backgroundImage }} onClick={this.onWrapperClick.bind(this)}>
                <div className="right-buttons">
                    {this.state.view === 0 &&
                        <button
                            className={classNames('button','filters-btn',{'selected': this.state.filtersVisible})}
                            onClick={this.toggleFilters.bind(this)}
                        >
                            <i className="material-icons">sort</i> Filters
                        </button>
                    }
                    <button
                        className={classNames('button')}
                        onClick={this.onViewClick.bind(this)}
                    >
                        <i className="material-icons">{this.state.view === 1 ? 'dashboard' : 'list'}</i>
                    </button>
                </div>

                {this.state.view === 0
                  ? <ColumnView
                        isCardVisible={this.isCardVisible.bind(this)}
                        data={this.props.data}
                        filters={this.state.filters}
                        setFilters={this.setFilters.bind(this)}
                    />
                  : <ListView
                        isCardVisible={this.isCardVisible.bind(this)}
                        data={this.props.data}
                        filters={this.state.filters}
                        setFilters={this.setFilters.bind(this)}
                    />
                }

                {this.state.view === 0 && this.state.filtersVisible &&
                    <BoardFilters
                        data={this.props.data}
                        filters={this.state.filters}
                        setFilters={this.setFilters.bind(this)}
                        type='board-view'
                    />
                }
            </div>
        );
    }

}
