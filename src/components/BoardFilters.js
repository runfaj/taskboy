import React from 'react';
import classNames from 'classnames';

export default class ColumnView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    onFilterChange(filterName, e) {
        let filters = this.props.filters;
        let filterValue = e.target.value || null;

        filters[filterName] = filterValue;
        this.props.setFilters(filters);
    }
    getAvailableUsers() {
        let users = [];
        this.props.data.cards.forEach((cardData)=>{
            if(cardData.assignedTo) {
                cardData.assignedTo.forEach((user)=>{
                    let exists = false;
                    users.forEach((existing)=>{
                        if(user.id === existing.id)
                            exists = true;
                    });
                    if(!exists)
                        users.push(user);
                });
            }
        });
        return users;
    }
    getAvailableGroups() {
        //this would probably change to read from pre-loaded database data
        return [
            {id: 12345678, type:'programmer',name:'Programmer',color:'rgba(0, 65, 247, .5)'},
            {id: 12346, type:'designer',name:'Designer',color:'rgba(247, 140, 0, .5)'},
            {id: 12347, type:'writer',name:'Writer',color:'rgba(0, 140, 49, .5)'},
            {id: 12348, type:'manager',name:'Manager',color:'rgba(236, 45, 255, .5)'},
        ];
    }
    getAvailableStatuses() {
        return this.props.data.cols || [];
    }
    getAvailableSorting() {
        return [
            "Status",
            "Assigned",
            "Group",
            "Due Date",
            "Client Visible"
        ];
    }

    render() {
        return (
            <div className={classNames("BoardFilters", this.props.type)}>
                <div className="filter-item">
                    <label>Assigned:</label>
                    <select value={this.props.filters['user']} onChange={this.onFilterChange.bind(this, 'user')}>
                        <option value="_all" key="_all">All</option>
                        <option value="_empty" key="_empty">Unassigned</option>
                        {this.getAvailableUsers().map((userInfo=>(
                            <option value={userInfo.id} key={userInfo.id}>{userInfo.name}</option>
                        )))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Group:</label>
                    <select value={this.props.filters['group']} onChange={this.onFilterChange.bind(this, 'group')}>
                        <option value="_all" key="_all">All</option>
                        <option value="_empty" key="_empty">Unassigned</option>
                        {this.getAvailableGroups().map((groupInfo=>(
                            <option value={groupInfo.id} key={groupInfo.id}>{groupInfo.name}</option>
                        )))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Status:</label>
                    <select value={this.props.filters['status']} onChange={this.onFilterChange.bind(this, 'status')}>
                        <option value="_all" key="_all">All</option>
                        {this.getAvailableStatuses().map((statusInfo=>(
                            <option value={statusInfo.id} key={statusInfo.id}>{statusInfo.title}</option>
                        )))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Client Visible:</label>
                    <select value={this.props.filters['clientVisible']} onChange={this.onFilterChange.bind(this, 'clientVisible')}>
                        <option value="_all" key="_all">All</option>
                        <option value="yes" key="yes">Yes</option>
                        <option value="no" key="no">No</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Due Date:</label>
                    <input
                        type="text"
                        value={this.props.filters['dueDate']}
                        onChange={this.onFilterChange.bind(this, 'dueDate')}
                    />
                </div>

                {this.props.type === 'list-view' &&
                    <div className="filter-item short">
                        <label>Sort List By:</label>
                        <select value={this.props.filters['sortBy']} onChange={this.onFilterChange.bind(this, 'sortBy')}>
                            {this.getAvailableSorting().map((sortingInfo=>(
                                <option value={sortingInfo} key={sortingInfo}>{sortingInfo}</option>
                            )))}
                        </select>
                    </div>
                }

                {this.props.type === 'list-view' && this.props.filters['sortBy'] && this.props.filters['sortBy'] !== 'Status' &&
                    <div className="filter-item short">
                        <label>Sort Direction:</label>
                        <select value={this.props.filters['sortDir']} onChange={this.onFilterChange.bind(this, 'sortDir')}>
                            <option value="desc" key="desc">Descending</option>
                            <option value="asc" key="asc">Ascending</option>
                        </select>
                    </div>
                }
            </div>
        );
    }
}
