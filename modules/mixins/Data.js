var React = require('react');
var invariant = require('react/lib/invariant');
var warning = require('react/lib/warning');

/**
 * A mixin for route handler components that need to load data.
 */
var Data = {

  contextTypes: {
    activeParams: React.PropTypes.object.isRequired,
    activeQuery: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired
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
    var dataTypes = this.constructor.dataTypes;

    if (dataTypes) {
      maskedData = {};

      for (var name in dataTypes)
        maskedData[name] = data[keys[name]];

      this._checkDataTypes(dataTypes, maskedData);
    }

    return maskedData;
  },

  componentWillMount: function () {
    invariant(
      this.constructor.getDataKeys,
      '%s is missing a static getDataKeys method',
      this.constructor.displayName
    );

    this.data = this._processData(
      this.context.data,
      this.constructor.getDataKeys(this.context.activeParams, this.context.activeQuery)
    );
  }

};

module.exports = Data;
