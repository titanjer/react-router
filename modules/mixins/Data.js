var React = require('react');
var warning = require('react/lib/warning');

/**
 * A mixin for components that need to load data from the
 * current route.
 *
 * Example:
 *
 *   var PostPage = React.createClass({
 *
 *     mixins: [ Router.Data ],
 *
 *     dataTypes: {
 *       post: React.PropTypes.instanceOf(BlogPost),
 *       comments: React.PropTypes.array
 *     },
 *
 *     render: function () {
 *       var post = this.data.post;
 *       var comments = this.data.comments;
 *   
 *       // ...
 *     }
 *
 *   });
 */
var Data = {

  contextTypes: {
    activeParams: React.PropTypes.object.isRequired,
    activeQuery: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    getDataKeys: React.PropTypes.func.isRequired
  },

  _checkDataTypes: function (dataTypes, data) {
    var componentName = this.constructor.displayName;

    var error;
    for (var name in dataTypes) {
      if (dataTypes.hasOwnProperty(name)) {
        error = dataTypes[name](data, name, componentName);

        if (error instanceof Error)
          warning(false, error.message);
      }
    }
  },

  _processData: function (data, keys) {
    var maskedData = null;
    var dataTypes = this.dataTypes;

    if (dataTypes) {
      maskedData = {};

      for (var name in dataTypes)
        maskedData[name] = data[keys[name]];

      this._checkDataTypes(dataTypes, maskedData);
    }

    return maskedData;
  },

  componentWillMount: function () {
    this.data = this._processData(
      this.context.data,
      this.context.getDataKeys(this.context.activeParams, this.context.activeQuery)
    );
  }

};

module.exports = Data;
