var React = require('react');
var merge = require('react/lib/merge');
var invariant = require('react/lib/invariant');

/**
 * A mixin for components that manage data resolution. Components
 * that use this mixin get a dataSource prop, which is a function
 * that is used to resolve a set of keys to data.
 *
 * Example:
 *

 */
var DataContext = {

  propTypes: {
    initialData: React.PropTypes.object.isRequired,
    dataSource: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      initialData: {}
    };
  },

  getInitialState: function () {
    return {
      data: this.props.initialData
    };
  },

  _updateData: function (handlers, params, query, callback) {
    var currentKeys = [];
    var callbackScope = this;

    // Collect the data keys we need for the given handlers.
    handlers.forEach(function (handler) {
      var componentName = handler.displayName;

      invariant(
        handler.dataTypes || handler.getDataKeys == null,
        '%s is missing a static dataTypes declaration',
        componentName
      );

      invariant(
        handler.dataTypes == null || handler.getDataKeys,
        '%s is missing a static getDataKeys method',
        componentName
      );

      if (handler.dataTypes && handler.getDataKeys) {
        var dataTypes = handler.dataTypes;
        var dataKeys = handler.getDataKeys(params, query);

        var key;
        for (var name in dataTypes) {
          invariant(
            key = dataKeys[name],
            '%s.getDataKeys() is missing a key for %s',
            componentName, name
          );

          if (currentKeys.indexOf(key) === -1)
            currentKeys.push(key);
        }
      }
    });

    if (!currentKeys.length)
      return callback.call(callbackScope); // All done.

    invariant(
      this.props.dataSource,
      'Your <Routes> need a dataSource'
    );

    this.props.dataSource(currentKeys, function (error, resultsArray) {
      if (error || resultsArray == null)
        return callback.call(callbackScope, error);

      invariant(
        Array.isArray(resultsArray),
        'Results from <Routes dataSource> must be an array'
      );

      this.setState({
        data: resultsArray.reduce(function (memo, item, index) {
          memo[currentKeys[index]] = item;
          return memo;
        }, {})
      }, function () {
        // There is a bug in React that doesn't call this callback before
        // the component is mounted, but it's not a huge deal in this case
        // since we're only using it to trigger onError in the caller and
        // at this point we already know there wasn't an error.
        callback.call(callbackScope);
      });
    }.bind(this));
  },

  childContextTypes: {
    data: React.PropTypes.object.isRequired
  },

  getChildContext: function () {
    return {
      data: this.state.data
    };
  }

};

module.exports = DataContext;
