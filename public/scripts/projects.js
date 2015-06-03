var ProjectsBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      filterText: '',
      filterCategory: 'All'
    };
  },
  loadProjectsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      crossDomain: true,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleUserInput: function(filterText) {
    this.setState({filterText: filterText});
  },
  handleUserClick: function(filterCategory) {
    console.log('filter ' + filterCategory);
    this.setState({filterCategory: filterCategory})
  },
  componentDidMount: function () {
    this.loadProjectsFromServer();
  },
  render: function () {
    var projectsNodesRaw = [];

    this.state.data.forEach(function(data) {
      data.filteredByText = data.name.toLowerCase().indexOf(this.state.filterText.toLowerCase()) === -1;

      if (data.projectCategory == undefined) {
        data.projectCategory = {
          name: 'No category',
          order: -10
        }
      }

      data.filteredByCategory = (this.state.filterCategory == 'All')
        ? false
        : data.projectCategory.name !== this.state.filterCategory;

      projectsNodesRaw.push(data);
    }.bind(this));

    return (
      <div className="b-projects-box">
        <ProjectsCategories data={projectsNodesRaw} filterCategory={this.state.filterCategory}
                            onUserInput={this.handleUserClick}/>
        <ProjectsList data={projectsNodesRaw} filterText={this.state.filterText} onUserInput={this.handleUserInput}/>
      </div>
    );
  }
});

var ProjectsList = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },

  render: function () {
    var projectsNodes = this.props.data.map(function(data) {
      return (
        <Project
          key={data.key}
          name={data.name}
          projectKey={data.key}
          projectCategory={data.projectCategory}
          filteredByText={data.filteredByText}
          filteredByCategory={data.filteredByCategory}
          />
      )
    });

    return (
      <div className="b-projects-list">
        <input className="b-projects-list__search"
               placeholder="Quick Search"
               value={this.props.filterText}
               ref="filterTextInput"
               onChange={this.handleChange}/>
        {projectsNodes}
      </div>
    );
  }
});

var ProjectsCategories = React.createClass({
  getInitialState: function () {
    return {
      selectedCategory: 'All'
    };
  },

  handleClick: function(categoryName) {
    this.state.selectedCategory = categoryName;
    this.props.onUserInput(categoryName);
  },

  render: function () {
    var projectsCategoriesRaw = {};
    var totalProjectsCount = 0;

    this.props.data.forEach(function (data) {
      categoryName = data.projectCategory.name;

      if (projectsCategoriesRaw[categoryName] == undefined) {
        projectsCategoriesRaw[categoryName] = {
          name: categoryName,
          count: 0,
          selected: categoryName == this.state.selectedCategory,
          order: (data.projectCategory.order !== undefined)
            ? data.projectCategory.order
            : 0
        };
      }

      if (data.filteredByText == false) {
        projectsCategoriesRaw[categoryName].count++;
        totalProjectsCount++;
      }
    }.bind(this));

    projectsCategoriesRaw['All'] = {
      name: 'All',
      count: totalProjectsCount,
      selected: 'All' == this.state.selectedCategory,
      order: -100
    };

    var projectsCategoriesArray = $.map(projectsCategoriesRaw, function(data) {return data;});
    projectsCategoriesArray.sort(function(a, b) {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }

      return 0;
    });

    var projectsCategories = projectsCategoriesArray.map(function(data) {
      return (
        <ProjectCategory key={data.name}
                         onUserInput={this.handleClick}
                         data={data}
          />
      );
    }.bind(this));

    return (
      <div className="b-projects-categories-list">{projectsCategories}</div>
    );
  }
});

var Project = React.createClass({
  render: function () {
    var filtered = this.props.filteredByText || this.props.filteredByCategory;
    return (
      <div className={"b-project" + (filtered ? " b-project_hidden" : "")}>
        {(this.props.projectCategory.order != -10) && <div className="b-project__category">{this.props.projectCategory.name}</div>}
        <a className="b-project__link" href="#">{this.props.name}</a>
      </div>
    );
  }
});

var ProjectCategory = React.createClass({
  handleClick: function() {
    this.props.onUserInput(this.props.data.name);
  },
  render: function () {
    return (
      <div className={'b-project-category' + (this.props.data.selected ? ' b-project-category_selected' : '')}>
        <span className="b-project-category__wrapper" onClick={this.handleClick}>
          <span className="b-project-category__link" href="#">{this.props.data.name}</span>
          {(this.props.data.count > 0) ? <span className="b-project-category__counter">{this.props.data.count}</span> : ''}
        </span>
      </div>
    );
  }
});

React.render(
  <ProjectsBox url="/projects.json" pollInterval={2000}/>,
  document.getElementById('content')
);
