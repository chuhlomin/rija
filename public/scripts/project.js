var ProjectHeader = React.createClass({
  render: function () {
    return (
      <div className="b-project__header">
        <span className="b-project__header__key">{this.props.data.key}</span>
        <span className="b-project__header__name">{this.props.data.name}</span>
        <div className="b-project__description">
          {this.props.data.description}
        </div>
      </div>
    );
  }
});

var ProjectComponent = React.createClass({
  render: function () {
    console.log(this.props.data);
    return (
      <div className="b-project__component">
        {this.props.data.name}
      </div>
    );
  }
});

var ProjectComponents = React.createClass({
  render: function () {
    var projectComponents = this.props.data.map(function(data) {
      return (
        <ProjectComponent data={data} />
      );
    });

    return (
      <div className="b-project__components">{projectComponents}</div>
    );
  }
});

var Project = React.createClass({
  getInitialState: function () {
    return {
      data: {
        components: []
      }
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
  componentDidMount: function () {
    this.loadProjectsFromServer();
  },
  render: function () {
    return (
      <div className="b-project-box">
        <ProjectHeader data={this.state.data} />
        <ProjectComponents data={this.state.data.components} />
      </div>
    );
  }
});

React.render(
  <Project url="/project.json" pollInterval={2000}/>,
  document.getElementById('content')
);
