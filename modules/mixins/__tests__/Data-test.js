var assert = require('assert');
var expect = require('expect');
var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var Routes = require('../../components/Routes');
var Route = require('../../components/Route');
var DataProvider = require('../DataProvider');
var Data = require('../Data');

describe('Data', function () {
  var Home = React.createClass({
    mixins: [ DataProvider ],
    statics: {
      getDataKeys: function (params, query) {
        return {
          username: params.username
        };
      }
    },
    render: function () {
      return ProfileWidget();
    }
  });

  var ProfileWidget = React.createClass({
    mixins: [ Data ],
    dataTypes: {
      username: React.PropTypes.string
    },
    render: function () {
      return React.DOM.div(null, 'Hello ' + (this.data.username || 'unknown') + '!');
    }
  });

  describe('', function () {
    var dataSource, component;
    beforeEach(function (done) {
      // A very simple data source that immediately returns
      // the upper-cased version of the key as data.
      dataSource = function (keys, callback) {
        callback(
          null, keys.map(function (key) {
            return key.toUpperCase();
          })
        );
      };

      component = ReactTestUtils.renderIntoDocument(
        Routes({ dataSource: dataSource },
          Route({ path: '/home/:username', handler: Home })
        )
      );

      component.dispatch('/home/mjackson', function (error, abortReason, nextState) {
        expect(error).toBe(null);
        expect(abortReason).toBe(null);
        component.setState(nextState, done);
      });
    });

    it('has the correct data', function () {

    })
  });
});
