'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackedDiv = exports.TrackDocument = exports.Track = exports.defaultRect = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createInjector = createInjector;
exports.createTrackedComponent = createTrackedComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultRect = exports.defaultRect = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
var identity = function identity(x) {
  return x;
};

function createInjector(component) {
  var _class, _temp;

  return _temp = _class = function (_React$Component) {
    _inherits(Track, _React$Component);

    function Track(props) {
      var _class2, _temp2;

      _classCallCheck(this, Track);

      var _this = _possibleConstructorReturn(this, (Track.__proto__ || Object.getPrototypeOf(Track)).call(this, props));

      var self = _this;

      _this.DecoratedComponent = (_temp2 = _class2 = function (_React$Component2) {
        _inherits(_class2, _React$Component2);

        function _class2() {
          _classCallCheck(this, _class2);

          return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
        }

        _createClass(_class2, [{
          key: 'render',
          value: function render() {
            var _self$props$props = _extends({}, self.props, this.props),
                _self$props$props$tra = _self$props$props.trackedRef,
                trackedRef = _self$props$props$tra === undefined ? self.props.trackedRef || identity : _self$props$props$tra,
                formulas = _self$props$props.formulas,
                component = _self$props$props.component,
                rest = _objectWithoutProperties(_self$props$props, ['trackedRef', 'formulas', 'component']);

            return _react2.default.createElement(props.component, _extends({}, rest, {
              ref: function ref(r) {
                return trackedRef(self.nodeRef = r);
              } }));
          }
        }]);

        return _class2;
      }(_react2.default.Component), _class2.propTypes = { trackedRef: _propTypes2.default.func }, _temp2);
      _this.state = {};
      return _this;
    }

    _createClass(Track, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps() {
        var node = (0, _reactDom.findDOMNode)(this.nodeRef);
        var rect = node.getBoundingClientRect();
        this.setState({ rect: rect, node: node });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props;

        var _state = this.state,
            _state$rect = _state.rect,
            rect = _state$rect === undefined ? defaultRect : _state$rect,
            _state$node = _state.node,
            node = _state$node === undefined ? {} : _state$node;

        return (_props = this.props).children.apply(_props, [this.DecoratedComponent].concat(_toConsumableArray(this.props.formulas.map(function (formula) {
          return formula(rect, node);
        }))));
      }
    }]);

    return Track;
  }(_react2.default.Component), _class.propTypes = { trackedRef: _propTypes2.default.func,
    children: _propTypes2.default.func.isRequired,
    formulas: _propTypes2.default.array }, _class.defaultProps = { formulas: [identity], component: component }, _temp;
}

var Track = exports.Track = createInjector('div');

var TrackDocument = exports.TrackDocument = function (_React$Component3) {
  _inherits(TrackDocument, _React$Component3);

  function TrackDocument(props) {
    _classCallCheck(this, TrackDocument);

    var _this3 = _possibleConstructorReturn(this, (TrackDocument.__proto__ || Object.getPrototypeOf(TrackDocument)).call(this, props));

    _this3.state = { rect: null };
    return _this3;
  }

  _createClass(TrackDocument, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      var cancel = _raf2.default.cancel;

      var rafId = void 0;

      var update = function update() {
        var rootElement = _this4.props.rootElement || document.documentElement;
        _this4.setState({ rect: rootElement.getBoundingClientRect() });
      };

      var handleScroll = function handleScroll(event) {
        cancel(rafId);
        rafId = (0, _raf2.default)(update);
      };

      var scrollSource = this.props.rootElement || window;

      scrollSource.addEventListener('scroll', handleScroll);

      this.removeScrollHandler = function () {
        cancel(rafId);
        scrollSource.removeEventListener('scroll', handleScroll);
      };

      if (this.props.updateOnDidMount) {
        update();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removeScrollHandler();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2;

      var rect = this.state.rect;

      var element = typeof document !== 'undefined' && (this.props.rootElement || document.documentElement);
      if (!rect) {
        if (element) {
          rect = element.getBoundingClientRect();
        } else {
          rect = defaultRect;
          element = {}; // bah
        }
      }
      return (_props2 = this.props).children.apply(_props2, _toConsumableArray(this.props.formulas.map(function (formula) {
        return formula(rect, element);
      })));
    }
  }]);

  return TrackDocument;
}(_react2.default.Component);

TrackDocument.propTypes = { children: _propTypes2.default.func.isRequired,
  formulas: _propTypes2.default.array,
  updateOnDidMount: _propTypes2.default.bool,
  rootElement: _propTypes2.default.instanceOf(HTMLElement) };
TrackDocument.defaultProps = { formulas: [identity], updateOnDidMount: false };
function createTrackedComponent(component) {
  var _class3, _temp3;

  return _temp3 = _class3 = function (_React$Component4) {
    _inherits(Tracked, _React$Component4);

    function Tracked(props) {
      _classCallCheck(this, Tracked);

      var _this5 = _possibleConstructorReturn(this, (Tracked.__proto__ || Object.getPrototypeOf(Tracked)).call(this, props));

      _this5.state = {};
      return _this5;
    }

    _createClass(Tracked, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps() {
        var node = (0, _reactDom.findDOMNode)(this.nodeRef);
        var rect = node.getBoundingClientRect();
        this.setState({ rect: rect, node: node });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this6 = this;

        var _state2 = this.state,
            _state2$rect = _state2.rect,
            rect = _state2$rect === undefined ? defaultRect : _state2$rect,
            _state2$node = _state2.node,
            node = _state2$node === undefined ? {} : _state2$node;
        var props = this.props;

        var formulas = props.formulas,
            component = props.component,
            rest = _objectWithoutProperties(props, ['formulas', 'component']);

        return _react2.default.createElement(
          props.component,
          _extends({ ref: function ref(r) {
              return _this6.nodeRef = r;
            } }, rest),
          props.children.apply(props, _toConsumableArray(props.formulas.map(function (formula) {
            return formula(rect, node);
          })))
        );
      }
    }]);

    return Tracked;
  }(_react2.default.Component), _class3.propTypes = { children: _propTypes2.default.func.isRequired,
    formulas: _propTypes2.default.array,
    component: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.string]) }, _class3.defaultProps = { formulas: [identity], component: component }, _temp3;
}

var TrackedDiv = exports.TrackedDiv = createTrackedComponent('div');