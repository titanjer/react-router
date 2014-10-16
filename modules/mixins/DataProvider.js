var React = require('react');
var invariant = require('react/lib/invariant');

/**
 * A mixin for route handler components that provide data to
 * their descendants.
 *
 * Example:
 *
 *   var PostRoute = React.createClass({
 *
 *     mixins: [ Router.DataProvider ],
 *     
 *     statics: {
 *       getDataKeys: function (params, query) {
 *         return {
 *           post: 'posts/' + params.postID,
 *           comments: 'comments/' + params.postID + '/comments'
 *         };
 *       }
 *     },
 *   
 *     render: function () {
 *       return <PostPage/>;
 *     }
 *   
 *   });
 */
var DataProvider = {

  childContextTypes: {
    getDataKeys: React.PropTypes.func.isRequired
  },

  getChildContext: function () {
    invariant(
      this.constructor.getDataKeys,
      '%s is missing a static getDataKeys method',
      this.constructor.displayName
    );

    return {
      getDataKeys: this.constructor.getDataKeys
    };
  }

};

module.exports = DataProvider;
