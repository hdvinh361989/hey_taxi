"format global";
(function(){ var curSystem = typeof System != 'undefined' ? System : undefined;
/* */ 
"format global";
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $keys = $Object.keys;
  var $apply = Function.prototype.call.bind(Function.prototype.apply);
  var $random = Math.random;
  var $getOwnPropertySymbols = $Object.getOwnPropertySymbols;
  var $Symbol = global.Symbol;
  var $WeakMap = global.WeakMap;
  var hasNativeSymbol = $getOwnPropertySymbols && typeof $Symbol === 'function';
  var hasNativeWeakMap = typeof $WeakMap === 'function';
  function $bind(operand, thisArg, args) {
    var argArray = [thisArg];
    for (var i = 0; i < args.length; i++) {
      argArray[i + 1] = args[i];
    }
    var func = $apply(Function.prototype.bind, operand, argArray);
    return func;
  }
  function $construct(func, argArray) {
    var object = new ($bind(func, null, argArray));
    return object;
  }
  var counter = Date.now() % 1e9;
  function newUniqueString() {
    return '__$' + ($random() * 1e9 >>> 1) + '$' + ++counter + '$__';
  }
  var createPrivateSymbol,
      deletePrivate,
      getPrivate,
      hasPrivate,
      isPrivateSymbol,
      setPrivate;
  if (hasNativeWeakMap) {
    isPrivateSymbol = function(s) {
      return false;
    };
    createPrivateSymbol = function() {
      return new $WeakMap();
    };
    hasPrivate = function(obj, sym) {
      return sym.has(obj);
    };
    deletePrivate = function(obj, sym) {
      return sym.delete(obj);
    };
    setPrivate = function(obj, sym, val) {
      sym.set(obj, val);
    };
    getPrivate = function(obj, sym) {
      return sym.get(obj);
    };
  } else {
    var privateNames = $create(null);
    isPrivateSymbol = function(s) {
      return privateNames[s];
    };
    createPrivateSymbol = function() {
      var s = hasNativeSymbol ? $Symbol() : newUniqueString();
      privateNames[s] = true;
      return s;
    };
    hasPrivate = function(obj, sym) {
      return hasOwnProperty.call(obj, sym);
    };
    deletePrivate = function(obj, sym) {
      if (!hasPrivate(obj, sym)) {
        return false;
      }
      delete obj[sym];
      return true;
    };
    setPrivate = function(obj, sym, val) {
      obj[sym] = val;
    };
    getPrivate = function(obj, sym) {
      var val = obj[sym];
      if (val === undefined)
        return undefined;
      return hasOwnProperty.call(obj, sym) ? val : undefined;
    };
  }
  (function() {
    function nonEnum(value) {
      return {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
      };
    }
    var method = nonEnum;
    var symbolInternalProperty = newUniqueString();
    var symbolDescriptionProperty = newUniqueString();
    var symbolDataProperty = newUniqueString();
    var symbolValues = $create(null);
    var SymbolImpl = function Symbol(description) {
      var value = new SymbolValue(description);
      if (!(this instanceof SymbolImpl))
        return value;
      throw new TypeError('Symbol cannot be new\'ed');
    };
    $defineProperty(SymbolImpl.prototype, 'constructor', nonEnum(SymbolImpl));
    $defineProperty(SymbolImpl.prototype, 'toString', method(function() {
      var symbolValue = this[symbolDataProperty];
      return symbolValue[symbolInternalProperty];
    }));
    $defineProperty(SymbolImpl.prototype, 'valueOf', method(function() {
      var symbolValue = this[symbolDataProperty];
      if (!symbolValue)
        throw TypeError('Conversion from symbol to string');
      return symbolValue[symbolInternalProperty];
    }));
    function SymbolValue(description) {
      var key = newUniqueString();
      $defineProperty(this, symbolDataProperty, {value: this});
      $defineProperty(this, symbolInternalProperty, {value: key});
      $defineProperty(this, symbolDescriptionProperty, {value: description});
      $freeze(this);
      symbolValues[key] = this;
    }
    $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(SymbolImpl));
    $defineProperty(SymbolValue.prototype, 'toString', {
      value: SymbolImpl.prototype.toString,
      enumerable: false
    });
    $defineProperty(SymbolValue.prototype, 'valueOf', {
      value: SymbolImpl.prototype.valueOf,
      enumerable: false
    });
    $freeze(SymbolValue.prototype);
    function isSymbolString(s) {
      return symbolValues[s] || isPrivateSymbol(s);
    }
    function removeSymbolKeys(array) {
      var rv = [];
      for (var i = 0; i < array.length; i++) {
        if (!isSymbolString(array[i])) {
          rv.push(array[i]);
        }
      }
      return rv;
    }
    function getOwnPropertyNames(object) {
      return removeSymbolKeys($getOwnPropertyNames(object));
    }
    function keys(object) {
      return removeSymbolKeys($keys(object));
    }
    var getOwnPropertySymbolsEmulate = function getOwnPropertySymbols(object) {
      var rv = [];
      var names = $getOwnPropertyNames(object);
      for (var i = 0; i < names.length; i++) {
        var symbol = symbolValues[names[i]];
        if (symbol) {
          rv.push(symbol);
        }
      }
      return rv;
    };
    var getOwnPropertySymbolsPrivate = function getOwnPropertySymbols(object) {
      var rv = [];
      var symbols = $getOwnPropertySymbols(object);
      for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        if (!isPrivateSymbol(symbol)) {
          rv.push(symbol);
        }
      }
      return rv;
    };
    function exportStar(object) {
      for (var i = 1; i < arguments.length; i++) {
        var names = $getOwnPropertyNames(arguments[i]);
        for (var j = 0; j < names.length; j++) {
          var name = names[j];
          if (name === '__esModule' || name === 'default' || isSymbolString(name))
            continue;
          (function(mod, name) {
            $defineProperty(object, name, {
              get: function() {
                return mod[name];
              },
              enumerable: true
            });
          })(arguments[i], names[j]);
        }
      }
      return object;
    }
    function isObject(x) {
      return x != null && (typeof x === 'object' || typeof x === 'function');
    }
    function toObject(x) {
      if (x == null)
        throw $TypeError();
      return $Object(x);
    }
    function checkObjectCoercible(argument) {
      if (argument == null) {
        throw new TypeError('Value cannot be converted to an Object');
      }
      return argument;
    }
    function polyfillSymbol(global) {
      if (!hasNativeSymbol) {
        global.Symbol = SymbolImpl;
        var Object = global.Object;
        Object.getOwnPropertyNames = getOwnPropertyNames;
        Object.keys = keys;
        $defineProperty(Object, 'getOwnPropertySymbols', nonEnum(getOwnPropertySymbolsEmulate));
      } else if (!hasNativeWeakMap) {
        $defineProperty(Object, 'getOwnPropertySymbols', nonEnum(getOwnPropertySymbolsPrivate));
      }
      if (!global.Symbol.iterator) {
        global.Symbol.iterator = Symbol('Symbol.iterator');
      }
      if (!global.Symbol.observer) {
        global.Symbol.observer = Symbol('Symbol.observer');
      }
    }
    function hasNativeSymbolFunc() {
      return hasNativeSymbol;
    }
    function setupGlobals(global) {
      polyfillSymbol(global);
      global.Reflect = global.Reflect || {};
      global.Reflect.global = global.Reflect.global || global;
    }
    setupGlobals(global);
    var typeOf = hasNativeSymbol ? function(x) {
      return typeof x;
    } : function(x) {
      return x instanceof SymbolValue ? 'symbol' : typeof x;
    };
    global.$traceurRuntime = {
      checkObjectCoercible: checkObjectCoercible,
      createPrivateSymbol: createPrivateSymbol,
      deletePrivate: deletePrivate,
      exportStar: exportStar,
      getPrivate: getPrivate,
      hasNativeSymbol: hasNativeSymbolFunc,
      hasPrivate: hasPrivate,
      isObject: isObject,
      options: {},
      setPrivate: setPrivate,
      setupGlobals: setupGlobals,
      toObject: toObject,
      typeof: typeOf
    };
  })();
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__3 = $traceurRuntime,
      canonicalizeUrl = $__3.canonicalizeUrl,
      resolveUrl = $__3.resolveUrl,
      isAbsolute = $__3.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  }
  function ModuleEvaluationError(erroneousModuleName, cause) {
    this.message = this.constructor.name + ': ' + this.stripCause(cause) + ' in ' + erroneousModuleName;
    if (!(cause instanceof ModuleEvaluationError) && cause.stack)
      this.stack = this.stripStack(cause.stack);
    else
      this.stack = '';
  }
  ModuleEvaluationError.prototype = Object.create(Error.prototype);
  ModuleEvaluationError.prototype.constructor = ModuleEvaluationError;
  ModuleEvaluationError.prototype.stripError = function(message) {
    return message.replace(/.*Error:/, this.constructor.name + ':');
  };
  ModuleEvaluationError.prototype.stripCause = function(cause) {
    if (!cause)
      return '';
    if (!cause.message)
      return cause + '';
    return this.stripError(cause.message);
  };
  ModuleEvaluationError.prototype.loadedBy = function(moduleName) {
    this.stack += '\n loaded by ' + moduleName;
  };
  ModuleEvaluationError.prototype.stripStack = function(causeStack) {
    var stack = [];
    causeStack.split('\n').some(function(frame) {
      if (/UncoatedModuleInstantiator/.test(frame))
        return true;
      stack.push(frame);
    });
    stack[0] = this.stripError(stack[0]);
    return stack.join('\n');
  };
  function beforeLines(lines, number) {
    var result = [];
    var first = number - 3;
    if (first < 0)
      first = 0;
    for (var i = first; i < number; i++) {
      result.push(lines[i]);
    }
    return result;
  }
  function afterLines(lines, number) {
    var last = number + 1;
    if (last > lines.length - 1)
      last = lines.length - 1;
    var result = [];
    for (var i = number; i <= last; i++) {
      result.push(lines[i]);
    }
    return result;
  }
  function columnSpacing(columns) {
    var result = '';
    for (var i = 0; i < columns - 1; i++) {
      result += '-';
    }
    return result;
  }
  function UncoatedModuleInstantiator(url, func) {
    UncoatedModuleEntry.call(this, url, null);
    this.func = func;
  }
  UncoatedModuleInstantiator.prototype = Object.create(UncoatedModuleEntry.prototype);
  UncoatedModuleInstantiator.prototype.getUncoatedModule = function() {
    var $__2 = this;
    if (this.value_)
      return this.value_;
    try {
      var relativeRequire;
      if (typeof $traceurRuntime !== undefined && $traceurRuntime.require) {
        relativeRequire = $traceurRuntime.require.bind(null, this.url);
      }
      return this.value_ = this.func.call(global, relativeRequire);
    } catch (ex) {
      if (ex instanceof ModuleEvaluationError) {
        ex.loadedBy(this.url);
        throw ex;
      }
      if (ex.stack) {
        var lines = this.func.toString().split('\n');
        var evaled = [];
        ex.stack.split('\n').some(function(frame, index) {
          if (frame.indexOf('UncoatedModuleInstantiator.getUncoatedModule') > 0)
            return true;
          var m = /(at\s[^\s]*\s).*>:(\d*):(\d*)\)/.exec(frame);
          if (m) {
            var line = parseInt(m[2], 10);
            evaled = evaled.concat(beforeLines(lines, line));
            if (index === 1) {
              evaled.push(columnSpacing(m[3]) + '^ ' + $__2.url);
            } else {
              evaled.push(columnSpacing(m[3]) + '^');
            }
            evaled = evaled.concat(afterLines(lines, line));
            evaled.push('= = = = = = = = =');
          } else {
            evaled.push(frame);
          }
        });
        ex.stack = evaled.join('\n');
      }
      throw new ModuleEvaluationError(this.url, ex);
    }
  };
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach(function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    });
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== 'string')
        throw new TypeError('module name must be a string, not ' + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, function() {
        return module;
      });
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, deps, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length && !func.length) {
        this.registerModule(name, deps, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: function() {
            var $__2 = arguments;
            var depMap = {};
            deps.forEach(function(dep, index) {
              return depMap[dep] = $__2[index];
            });
            var registryEntry = func.call(this, depMap);
            registryEntry.execute.call(this);
            return registryEntry.exports;
          }
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    setCompilerVersion: function(version) {
      ModuleStore.compilerVersion = version;
    },
    getCompilerVersion: function() {
      return ModuleStore.compilerVersion;
    }
  };
  var moduleStoreModule = new Module({ModuleStore: ModuleStore});
  ModuleStore.set('@traceur/src/runtime/ModuleStore.js', moduleStoreModule);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    registerModule: ModuleStore.registerModule.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize,
    setCompilerVersion: ModuleStore.setCompilerVersion,
    getCompilerVersion: ModuleStore.getCompilerVersion
  };
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
System.registerModule("traceur-runtime@0.0.93/src/runtime/async.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/async.js";
  if (typeof $traceurRuntime !== 'object') {
    throw new Error('traceur runtime not found.');
  }
  var $__11 = $traceurRuntime,
      createPrivateSymbol = $__11.createPrivateSymbol,
      getPrivate = $__11.getPrivate,
      setPrivate = $__11.setPrivate;
  var $__12 = Object,
      create = $__12.create,
      defineProperty = $__12.defineProperty;
  var observeName = createPrivateSymbol();
  function AsyncGeneratorFunction() {}
  function AsyncGeneratorFunctionPrototype() {}
  AsyncGeneratorFunction.prototype = AsyncGeneratorFunctionPrototype;
  AsyncGeneratorFunctionPrototype.constructor = AsyncGeneratorFunction;
  defineProperty(AsyncGeneratorFunctionPrototype, 'constructor', {enumerable: false});
  var AsyncGeneratorContext = function() {
    function AsyncGeneratorContext(observer) {
      var $__2 = this;
      this.decoratedObserver = $traceurRuntime.createDecoratedGenerator(observer, function() {
        $__2.done = true;
      });
      this.done = false;
      this.inReturn = false;
    }
    return ($traceurRuntime.createClass)(AsyncGeneratorContext, {
      throw: function(error) {
        if (!this.inReturn) {
          throw error;
        }
      },
      yield: function(value) {
        if (this.done) {
          this.inReturn = true;
          throw undefined;
        }
        var result;
        try {
          result = this.decoratedObserver.next(value);
        } catch (e) {
          this.done = true;
          throw e;
        }
        if (result === undefined) {
          return;
        }
        if (result.done) {
          this.done = true;
          this.inReturn = true;
          throw undefined;
        }
        return result.value;
      },
      yieldFor: function(observable) {
        var ctx = this;
        return $traceurRuntime.observeForEach(observable[Symbol.observer].bind(observable), function(value) {
          if (ctx.done) {
            this.return();
            return;
          }
          var result;
          try {
            result = ctx.decoratedObserver.next(value);
          } catch (e) {
            ctx.done = true;
            throw e;
          }
          if (result === undefined) {
            return;
          }
          if (result.done) {
            ctx.done = true;
          }
          return result;
        });
      }
    }, {});
  }();
  AsyncGeneratorFunctionPrototype.prototype[Symbol.observer] = function(observer) {
    var observe = getPrivate(this, observeName);
    var ctx = new AsyncGeneratorContext(observer);
    $traceurRuntime.schedule(function() {
      return observe(ctx);
    }).then(function(value) {
      if (!ctx.done) {
        ctx.decoratedObserver.return(value);
      }
    }).catch(function(error) {
      if (!ctx.done) {
        ctx.decoratedObserver.throw(error);
      }
    });
    return ctx.decoratedObserver;
  };
  defineProperty(AsyncGeneratorFunctionPrototype.prototype, Symbol.observer, {enumerable: false});
  function initAsyncGeneratorFunction(functionObject) {
    functionObject.prototype = create(AsyncGeneratorFunctionPrototype.prototype);
    functionObject.__proto__ = AsyncGeneratorFunctionPrototype;
    return functionObject;
  }
  function createAsyncGeneratorInstance(observe, functionObject) {
    for (var args = [],
        $__10 = 2; $__10 < arguments.length; $__10++)
      args[$__10 - 2] = arguments[$__10];
    var object = create(functionObject.prototype);
    setPrivate(object, observeName, observe);
    return object;
  }
  function observeForEach(observe, next) {
    return new Promise(function(resolve, reject) {
      var generator = observe({
        next: function(value) {
          return next.call(generator, value);
        },
        throw: function(error) {
          reject(error);
        },
        return: function(value) {
          resolve(value);
        }
      });
    });
  }
  function schedule(asyncF) {
    return Promise.resolve().then(asyncF);
  }
  var generator = Symbol();
  var onDone = Symbol();
  var DecoratedGenerator = function() {
    function DecoratedGenerator(_generator, _onDone) {
      this[generator] = _generator;
      this[onDone] = _onDone;
    }
    return ($traceurRuntime.createClass)(DecoratedGenerator, {
      next: function(value) {
        var result = this[generator].next(value);
        if (result !== undefined && result.done) {
          this[onDone].call(this);
        }
        return result;
      },
      throw: function(error) {
        this[onDone].call(this);
        return this[generator].throw(error);
      },
      return: function(value) {
        this[onDone].call(this);
        return this[generator].return(value);
      }
    }, {});
  }();
  function createDecoratedGenerator(generator, onDone) {
    return new DecoratedGenerator(generator, onDone);
  }
  Array.prototype[Symbol.observer] = function(observer) {
    var done = false;
    var decoratedObserver = createDecoratedGenerator(observer, function() {
      return done = true;
    });
    var $__6 = true;
    var $__7 = false;
    var $__8 = undefined;
    try {
      for (var $__4 = void 0,
          $__3 = (this)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
        var value = $__4.value;
        {
          decoratedObserver.next(value);
          if (done) {
            return;
          }
        }
      }
    } catch ($__9) {
      $__7 = true;
      $__8 = $__9;
    } finally {
      try {
        if (!$__6 && $__3.return != null) {
          $__3.return();
        }
      } finally {
        if ($__7) {
          throw $__8;
        }
      }
    }
    decoratedObserver.return();
    return decoratedObserver;
  };
  defineProperty(Array.prototype, Symbol.observer, {enumerable: false});
  $traceurRuntime.initAsyncGeneratorFunction = initAsyncGeneratorFunction;
  $traceurRuntime.createAsyncGeneratorInstance = createAsyncGeneratorInstance;
  $traceurRuntime.observeForEach = observeForEach;
  $traceurRuntime.schedule = schedule;
  $traceurRuntime.createDecoratedGenerator = createDecoratedGenerator;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/classes.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/classes.js";
  var $Object = Object;
  var $TypeError = TypeError;
  var $__1 = Object,
      create = $__1.create,
      defineProperties = $__1.defineProperties,
      defineProperty = $__1.defineProperty,
      getOwnPropertyDescriptor = $__1.getOwnPropertyDescriptor,
      getOwnPropertyNames = $__1.getOwnPropertyNames,
      getOwnPropertySymbols = $__1.getOwnPropertySymbols,
      getPrototypeOf = $__1.getPrototypeOf;
  function superDescriptor(homeObject, name) {
    var proto = getPrototypeOf(homeObject);
    do {
      var result = getOwnPropertyDescriptor(proto, name);
      if (result)
        return result;
      proto = getPrototypeOf(proto);
    } while (proto);
    return undefined;
  }
  function superConstructor(ctor) {
    return ctor.__proto__;
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      var value = descriptor.value;
      if (value)
        return value;
      if (!descriptor.get)
        return value;
      return descriptor.get.call(self);
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError(("super has no setter '" + name + "'."));
  }
  function forEachPropertyKey(object, f) {
    getOwnPropertyNames(object).forEach(f);
    getOwnPropertySymbols(object).forEach(f);
  }
  function getDescriptors(object) {
    var descriptors = {};
    forEachPropertyKey(object, function(key) {
      descriptors[key] = getOwnPropertyDescriptor(object, key);
      descriptors[key].enumerable = false;
    });
    return descriptors;
  }
  var nonEnum = {enumerable: false};
  function makePropertiesNonEnumerable(object) {
    forEachPropertyKey(object, function(key) {
      defineProperty(object, key, nonEnum);
    });
  }
  function createClass(ctor, object, staticObject, superClass) {
    defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = create(getProtoParent(superClass), getDescriptors(object));
    } else {
      makePropertiesNonEnumerable(object);
      ctor.prototype = object;
    }
    defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
      throw new $TypeError('super prototype must be an Object or null');
    }
    if (superClass === null)
      return null;
    throw new $TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
  }
  $traceurRuntime.createClass = createClass;
  $traceurRuntime.superConstructor = superConstructor;
  $traceurRuntime.superGet = superGet;
  $traceurRuntime.superSet = superSet;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/destructuring.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/destructuring.js";
  function iteratorToArray(iter) {
    var rv = [];
    var i = 0;
    var tmp;
    while (!(tmp = iter.next()).done) {
      rv[i++] = tmp.value;
    }
    return rv;
  }
  $traceurRuntime.iteratorToArray = iteratorToArray;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/generators.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/generators.js";
  if (typeof $traceurRuntime !== 'object') {
    throw new Error('traceur runtime not found.');
  }
  var $TypeError = TypeError;
  var $__1 = $traceurRuntime,
      createPrivateSymbol = $__1.createPrivateSymbol,
      getPrivate = $__1.getPrivate,
      setPrivate = $__1.setPrivate;
  var $__2 = Object,
      create = $__2.create,
      defineProperties = $__2.defineProperties,
      defineProperty = $__2.defineProperty;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  var RETURN_SENTINEL = {};
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.oldReturnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    maybeUncatchable: function() {
      if (this.storedException === RETURN_SENTINEL) {
        throw RETURN_SENTINEL;
      }
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    },
    handleException: function(ex) {
      this.GState = ST_CLOSED;
      this.state = END_STATE;
      throw ex;
    },
    wrapYieldStar: function(iterator) {
      var ctx = this;
      return {
        next: function(v) {
          return iterator.next(v);
        },
        throw: function(e) {
          var result;
          if (e === RETURN_SENTINEL) {
            if (iterator.return) {
              result = iterator.return(ctx.returnValue);
              if (!result.done) {
                ctx.returnValue = ctx.oldReturnValue;
                return result;
              }
              ctx.returnValue = result.value;
            }
            throw e;
          }
          if (iterator.throw) {
            return iterator.throw(e);
          }
          iterator.return && iterator.return();
          throw $TypeError('Inner iterator does not have a throw method');
        }
      };
    }
  };
  function nextOrThrow(ctx, moveNext, action, x) {
    switch (ctx.GState) {
      case ST_EXECUTING:
        throw new Error(("\"" + action + "\" on executing generator"));
      case ST_CLOSED:
        if (action == 'next') {
          return {
            value: undefined,
            done: true
          };
        }
        if (x === RETURN_SENTINEL) {
          return {
            value: ctx.returnValue,
            done: true
          };
        }
        throw x;
      case ST_NEWBORN:
        if (action === 'throw') {
          ctx.GState = ST_CLOSED;
          if (x === RETURN_SENTINEL) {
            return {
              value: ctx.returnValue,
              done: true
            };
          }
          throw x;
        }
        if (x !== undefined)
          throw $TypeError('Sent value to newborn generator');
      case ST_SUSPENDED:
        ctx.GState = ST_EXECUTING;
        ctx.action = action;
        ctx.sent = x;
        var value;
        try {
          value = moveNext(ctx);
        } catch (ex) {
          if (ex === RETURN_SENTINEL) {
            value = ctx;
          } else {
            throw ex;
          }
        }
        var done = value === ctx;
        if (done)
          value = ctx.returnValue;
        ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
        return {
          value: value,
          done: done
        };
    }
  }
  var ctxName = createPrivateSymbol();
  var moveNextName = createPrivateSymbol();
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
  GeneratorFunctionPrototype.prototype = {
    constructor: GeneratorFunctionPrototype,
    next: function(v) {
      return nextOrThrow(getPrivate(this, ctxName), getPrivate(this, moveNextName), 'next', v);
    },
    throw: function(v) {
      return nextOrThrow(getPrivate(this, ctxName), getPrivate(this, moveNextName), 'throw', v);
    },
    return: function(v) {
      var ctx = getPrivate(this, ctxName);
      ctx.oldReturnValue = ctx.returnValue;
      ctx.returnValue = v;
      return nextOrThrow(ctx, getPrivate(this, moveNextName), 'throw', RETURN_SENTINEL);
    }
  };
  defineProperties(GeneratorFunctionPrototype.prototype, {
    constructor: {enumerable: false},
    next: {enumerable: false},
    throw: {enumerable: false},
    return: {enumerable: false}
  });
  Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
    return this;
  }));
  function createGeneratorInstance(innerFunction, functionObject, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    var object = create(functionObject.prototype);
    setPrivate(object, ctxName, ctx);
    setPrivate(object, moveNextName, moveNext);
    return object;
  }
  function initGeneratorFunction(functionObject) {
    functionObject.prototype = create(GeneratorFunctionPrototype.prototype);
    functionObject.__proto__ = GeneratorFunctionPrototype;
    return functionObject;
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        this.resolve(this.returnValue);
        break;
      case RETHROW_STATE:
        this.reject(this.storedException);
        break;
      default:
        this.reject(getInternalError(this.state));
    }
  };
  AsyncFunctionContext.prototype.handleException = function() {
    this.state = RETHROW_STATE;
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.errback = function(err) {
      handleCatch(ctx, err);
      moveNext(ctx);
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          handleCatch(ctx, ex);
        }
      }
    };
  }
  function handleCatch(ctx, ex) {
    ctx.storedException = ex;
    var last = ctx.tryStack_[ctx.tryStack_.length - 1];
    if (!last) {
      ctx.handleException(ex);
      return;
    }
    ctx.state = last.catch !== undefined ? last.catch : last.finally;
    if (last.finallyFallThrough !== undefined)
      ctx.finallyFallThrough = last.finallyFallThrough;
  }
  $traceurRuntime.asyncWrap = asyncWrap;
  $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
  $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/proper-tail-calls.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/proper-tail-calls.js";
  if (typeof $traceurRuntime !== 'object') {
    throw new Error('traceur runtime not found.');
  }
  var $apply = Function.prototype.call.bind(Function.prototype.apply);
  var $__1 = $traceurRuntime,
      getPrivate = $__1.getPrivate,
      setPrivate = $__1.setPrivate,
      createPrivateSymbol = $__1.createPrivateSymbol;
  var CONTINUATION_TYPE = Object.create(null);
  var isTailRecursiveName = null;
  function createContinuation(operand, thisArg, argsArray) {
    return [CONTINUATION_TYPE, operand, thisArg, argsArray];
  }
  function isContinuation(object) {
    return object && object[0] === CONTINUATION_TYPE;
  }
  function $bind(operand, thisArg, args) {
    var argArray = [thisArg];
    for (var i = 0; i < args.length; i++) {
      argArray[i + 1] = args[i];
    }
    var func = $apply(Function.prototype.bind, operand, argArray);
    return func;
  }
  function $construct(func, argArray) {
    var object = new ($bind(func, null, argArray));
    return object;
  }
  function isTailRecursive(func) {
    return !!getPrivate(func, isTailRecursiveName);
  }
  function tailCall(func, thisArg, argArray) {
    var continuation = argArray[0];
    if (isContinuation(continuation)) {
      continuation = $apply(func, thisArg, continuation[3]);
      return continuation;
    }
    continuation = createContinuation(func, thisArg, argArray);
    while (true) {
      if (isTailRecursive(func)) {
        continuation = $apply(func, continuation[2], [continuation]);
      } else {
        continuation = $apply(func, continuation[2], continuation[3]);
      }
      if (!isContinuation(continuation)) {
        return continuation;
      }
      func = continuation[1];
    }
  }
  function construct() {
    var object;
    if (isTailRecursive(this)) {
      object = $construct(this, [createContinuation(null, null, arguments)]);
    } else {
      object = $construct(this, arguments);
    }
    return object;
  }
  function setupProperTailCalls() {
    isTailRecursiveName = createPrivateSymbol();
    Function.prototype.call = initTailRecursiveFunction(function call(thisArg) {
      var result = tailCall(function(thisArg) {
        var argArray = [];
        for (var i = 1; i < arguments.length; ++i) {
          argArray[i - 1] = arguments[i];
        }
        var continuation = createContinuation(this, thisArg, argArray);
        return continuation;
      }, this, arguments);
      return result;
    });
    Function.prototype.apply = initTailRecursiveFunction(function apply(thisArg, argArray) {
      var result = tailCall(function(thisArg, argArray) {
        var continuation = createContinuation(this, thisArg, argArray);
        return continuation;
      }, this, arguments);
      return result;
    });
  }
  function initTailRecursiveFunction(func) {
    if (isTailRecursiveName === null) {
      setupProperTailCalls();
    }
    setPrivate(func, isTailRecursiveName, true);
    return func;
  }
  $traceurRuntime.initTailRecursiveFunction = initTailRecursiveFunction;
  $traceurRuntime.call = tailCall;
  $traceurRuntime.continuation = createContinuation;
  $traceurRuntime.construct = construct;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/relativeRequire.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/relativeRequire.js";
  var path;
  function relativeRequire(callerPath, requiredPath) {
    path = path || typeof require !== 'undefined' && require('path');
    function isDirectory(path) {
      return path.slice(-1) === '/';
    }
    function isAbsolute(path) {
      return path[0] === '/';
    }
    function isRelative(path) {
      return path[0] === '.';
    }
    if (isDirectory(requiredPath) || isAbsolute(requiredPath))
      return;
    return isRelative(requiredPath) ? require(path.resolve(path.dirname(callerPath), requiredPath)) : require(requiredPath);
  }
  $traceurRuntime.require = relativeRequire;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/spread.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/spread.js";
  function spread() {
    var rv = [],
        j = 0,
        iterResult;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = $traceurRuntime.checkObjectCoercible(arguments[i]);
      if (typeof valueToSpread[Symbol.iterator] !== 'function') {
        throw new TypeError('Cannot spread non-iterable object.');
      }
      var iter = valueToSpread[Symbol.iterator]();
      while (!(iterResult = iter.next()).done) {
        rv[j++] = iterResult.value;
      }
    }
    return rv;
  }
  $traceurRuntime.spread = spread;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/template.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/template.js";
  var $__1 = Object,
      defineProperty = $__1.defineProperty,
      freeze = $__1.freeze;
  var slice = Array.prototype.slice;
  var map = Object.create(null);
  function getTemplateObject(raw) {
    var cooked = arguments[1];
    var key = raw.join('${}');
    var templateObject = map[key];
    if (templateObject)
      return templateObject;
    if (!cooked) {
      cooked = slice.call(raw);
    }
    return map[key] = freeze(defineProperty(cooked, 'raw', {value: freeze(raw)}));
  }
  $traceurRuntime.getTemplateObject = getTemplateObject;
  return {};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/runtime-modules.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/runtime-modules.js";
  System.get("traceur-runtime@0.0.93/src/runtime/proper-tail-calls.js");
  System.get("traceur-runtime@0.0.93/src/runtime/relativeRequire.js");
  System.get("traceur-runtime@0.0.93/src/runtime/spread.js");
  System.get("traceur-runtime@0.0.93/src/runtime/destructuring.js");
  System.get("traceur-runtime@0.0.93/src/runtime/classes.js");
  System.get("traceur-runtime@0.0.93/src/runtime/async.js");
  System.get("traceur-runtime@0.0.93/src/runtime/generators.js");
  System.get("traceur-runtime@0.0.93/src/runtime/template.js");
  return {};
});
System.get("traceur-runtime@0.0.93/src/runtime/runtime-modules.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/frozen-data.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/frozen-data.js";
  function findIndex(arr, key) {
    for (var i = 0; i < arr.length; i += 2) {
      if (arr[i] === key) {
        return i;
      }
    }
    return -1;
  }
  function setFrozen(arr, key, val) {
    var i = findIndex(arr, key);
    if (i === -1) {
      arr.push(key, val);
    }
  }
  function getFrozen(arr, key) {
    var i = findIndex(arr, key);
    if (i !== -1) {
      return arr[i + 1];
    }
    return undefined;
  }
  function hasFrozen(arr, key) {
    return findIndex(arr, key) !== -1;
  }
  function deleteFrozen(arr, key) {
    var i = findIndex(arr, key);
    if (i !== -1) {
      arr.splice(i, 2);
      return true;
    }
    return false;
  }
  return {
    get setFrozen() {
      return setFrozen;
    },
    get getFrozen() {
      return getFrozen;
    },
    get hasFrozen() {
      return hasFrozen;
    },
    get deleteFrozen() {
      return deleteFrozen;
    }
  };
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/utils.js";
  var $ceil = Math.ceil;
  var $floor = Math.floor;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var $pow = Math.pow;
  var $min = Math.min;
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x >>> 0;
  }
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function isCallable(x) {
    return typeof x === 'function';
  }
  function isNumber(x) {
    return typeof x === 'number';
  }
  function toInteger(x) {
    x = +x;
    if ($isNaN(x))
      return 0;
    if (x === 0 || !$isFinite(x))
      return x;
    return x > 0 ? $floor(x) : $ceil(x);
  }
  var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
  function toLength(x) {
    var len = toInteger(x);
    return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
  }
  function checkIterable(x) {
    return !isObject(x) ? undefined : x[Symbol.iterator];
  }
  function isConstructor(x) {
    return isCallable(x);
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function maybeDefine(object, name, descr) {
    if (!(name in object)) {
      Object.defineProperty(object, name, descr);
    }
  }
  function maybeDefineMethod(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  function maybeDefineConst(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: false,
      enumerable: false,
      writable: false
    });
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function maybeAddConsts(object, consts) {
    for (var i = 0; i < consts.length; i += 2) {
      var name = consts[i];
      var value = consts[i + 1];
      maybeDefineConst(object, name, value);
    }
  }
  function maybeAddIterator(object, func, Symbol) {
    if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
      return;
    if (object['@@iterator'])
      func = object['@@iterator'];
    Object.defineProperty(object, Symbol.iterator, {
      value: func,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  var polyfills = [];
  function registerPolyfill(func) {
    polyfills.push(func);
  }
  function polyfillAll(global) {
    polyfills.forEach(function(f) {
      return f(global);
    });
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    },
    get isObject() {
      return isObject;
    },
    get isCallable() {
      return isCallable;
    },
    get isNumber() {
      return isNumber;
    },
    get toInteger() {
      return toInteger;
    },
    get toLength() {
      return toLength;
    },
    get checkIterable() {
      return checkIterable;
    },
    get isConstructor() {
      return isConstructor;
    },
    get createIteratorResultObject() {
      return createIteratorResultObject;
    },
    get maybeDefine() {
      return maybeDefine;
    },
    get maybeDefineMethod() {
      return maybeDefineMethod;
    },
    get maybeDefineConst() {
      return maybeDefineConst;
    },
    get maybeAddFunctions() {
      return maybeAddFunctions;
    },
    get maybeAddConsts() {
      return maybeAddConsts;
    },
    get maybeAddIterator() {
      return maybeAddIterator;
    },
    get registerPolyfill() {
      return registerPolyfill;
    },
    get polyfillAll() {
      return polyfillAll;
    }
  };
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Map.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Map.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      isObject = $__0.isObject,
      registerPolyfill = $__0.registerPolyfill;
  var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/frozen-data.js"),
      deleteFrozen = $__1.deleteFrozen,
      getFrozen = $__1.getFrozen,
      setFrozen = $__1.setFrozen;
  var $__11 = $traceurRuntime,
      createPrivateSymbol = $__11.createPrivateSymbol,
      getPrivate = $__11.getPrivate,
      hasNativeSymbol = $__11.hasNativeSymbol,
      setPrivate = $__11.setPrivate;
  var $__12 = Object,
      defineProperty = $__12.defineProperty,
      getOwnPropertyDescriptor = $__12.getOwnPropertyDescriptor,
      hasOwnProperty = $__12.hasOwnProperty,
      isExtensible = $__12.isExtensible;
  var deletedSentinel = {};
  var counter = 1;
  var hashCodeName = createPrivateSymbol();
  function getHashCodeForObject(obj) {
    return getPrivate(obj, hashCodeName);
  }
  function getOrSetHashCodeForObject(obj) {
    var hash = getHashCodeForObject(obj);
    if (!hash) {
      hash = counter++;
      setPrivate(obj, hashCodeName, hash);
    }
    return hash;
  }
  function lookupIndex(map, key) {
    if (typeof key === 'string') {
      return map.stringIndex_[key];
    }
    if (isObject(key)) {
      if (!isExtensible(key)) {
        return getFrozen(map.frozenData_, key);
      }
      var hc = getHashCodeForObject(key);
      if (hc === undefined) {
        return undefined;
      }
      return map.objectIndex_[hc];
    }
    return map.primitiveIndex_[key];
  }
  function initMap(map) {
    map.entries_ = [];
    map.objectIndex_ = Object.create(null);
    map.stringIndex_ = Object.create(null);
    map.primitiveIndex_ = Object.create(null);
    map.frozenData_ = [];
    map.deletedCount_ = 0;
  }
  var Map = function() {
    function Map() {
      var $__14,
          $__15;
      var iterable = arguments[0];
      if (!isObject(this))
        throw new TypeError('Map called on incompatible type');
      if (hasOwnProperty.call(this, 'entries_')) {
        throw new TypeError('Map can not be reentrantly initialised');
      }
      initMap(this);
      if (iterable !== null && iterable !== undefined) {
        var $__7 = true;
        var $__8 = false;
        var $__9 = undefined;
        try {
          for (var $__5 = void 0,
              $__4 = (iterable)[Symbol.iterator](); !($__7 = ($__5 = $__4.next()).done); $__7 = true) {
            var $__13 = $__5.value,
                key = ($__14 = $__13[Symbol.iterator](), ($__15 = $__14.next()).done ? void 0 : $__15.value),
                value = ($__15 = $__14.next()).done ? void 0 : $__15.value;
            {
              this.set(key, value);
            }
          }
        } catch ($__10) {
          $__8 = true;
          $__9 = $__10;
        } finally {
          try {
            if (!$__7 && $__4.return != null) {
              $__4.return();
            }
          } finally {
            if ($__8) {
              throw $__9;
            }
          }
        }
      }
    }
    return ($traceurRuntime.createClass)(Map, {
      get size() {
        return this.entries_.length / 2 - this.deletedCount_;
      },
      get: function(key) {
        var index = lookupIndex(this, key);
        if (index !== undefined) {
          return this.entries_[index + 1];
        }
      },
      set: function(key, value) {
        var index = lookupIndex(this, key);
        if (index !== undefined) {
          this.entries_[index + 1] = value;
        } else {
          index = this.entries_.length;
          this.entries_[index] = key;
          this.entries_[index + 1] = value;
          if (isObject(key)) {
            if (!isExtensible(key)) {
              setFrozen(this.frozenData_, key, index);
            } else {
              var hash = getOrSetHashCodeForObject(key);
              this.objectIndex_[hash] = index;
            }
          } else if (typeof key === 'string') {
            this.stringIndex_[key] = index;
          } else {
            this.primitiveIndex_[key] = index;
          }
        }
        return this;
      },
      has: function(key) {
        return lookupIndex(this, key) !== undefined;
      },
      delete: function(key) {
        var index = lookupIndex(this, key);
        if (index === undefined) {
          return false;
        }
        this.entries_[index] = deletedSentinel;
        this.entries_[index + 1] = undefined;
        this.deletedCount_++;
        if (isObject(key)) {
          if (!isExtensible(key)) {
            deleteFrozen(this.frozenData_, key);
          } else {
            var hash = getHashCodeForObject(key);
            delete this.objectIndex_[hash];
          }
        } else if (typeof key === 'string') {
          delete this.stringIndex_[key];
        } else {
          delete this.primitiveIndex_[key];
        }
        return true;
      },
      clear: function() {
        initMap(this);
      },
      forEach: function(callbackFn) {
        var thisArg = arguments[1];
        for (var i = 0; i < this.entries_.length; i += 2) {
          var key = this.entries_[i];
          var value = this.entries_[i + 1];
          if (key === deletedSentinel)
            continue;
          callbackFn.call(thisArg, value, key, this);
        }
      },
      entries: $traceurRuntime.initGeneratorFunction(function $__16() {
        var i,
            key,
            value;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                i = 0;
                $ctx.state = 12;
                break;
              case 12:
                $ctx.state = (i < this.entries_.length) ? 8 : -2;
                break;
              case 4:
                i += 2;
                $ctx.state = 12;
                break;
              case 8:
                key = this.entries_[i];
                value = this.entries_[i + 1];
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = (key === deletedSentinel) ? 4 : 6;
                break;
              case 6:
                $ctx.state = 2;
                return [key, value];
              case 2:
                $ctx.maybeThrow();
                $ctx.state = 4;
                break;
              default:
                return $ctx.end();
            }
        }, $__16, this);
      }),
      keys: $traceurRuntime.initGeneratorFunction(function $__17() {
        var i,
            key,
            value;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                i = 0;
                $ctx.state = 12;
                break;
              case 12:
                $ctx.state = (i < this.entries_.length) ? 8 : -2;
                break;
              case 4:
                i += 2;
                $ctx.state = 12;
                break;
              case 8:
                key = this.entries_[i];
                value = this.entries_[i + 1];
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = (key === deletedSentinel) ? 4 : 6;
                break;
              case 6:
                $ctx.state = 2;
                return key;
              case 2:
                $ctx.maybeThrow();
                $ctx.state = 4;
                break;
              default:
                return $ctx.end();
            }
        }, $__17, this);
      }),
      values: $traceurRuntime.initGeneratorFunction(function $__18() {
        var i,
            key,
            value;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                i = 0;
                $ctx.state = 12;
                break;
              case 12:
                $ctx.state = (i < this.entries_.length) ? 8 : -2;
                break;
              case 4:
                i += 2;
                $ctx.state = 12;
                break;
              case 8:
                key = this.entries_[i];
                value = this.entries_[i + 1];
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = (key === deletedSentinel) ? 4 : 6;
                break;
              case 6:
                $ctx.state = 2;
                return value;
              case 2:
                $ctx.maybeThrow();
                $ctx.state = 4;
                break;
              default:
                return $ctx.end();
            }
        }, $__18, this);
      })
    }, {});
  }();
  defineProperty(Map.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Map.prototype.entries
  });
  function needsPolyfill(global) {
    var $__13 = global,
        Map = $__13.Map,
        Symbol = $__13.Symbol;
    if (!Map || !$traceurRuntime.hasNativeSymbol() || !Map.prototype[Symbol.iterator] || !Map.prototype.entries) {
      return true;
    }
    try {
      return new Map([[]]).size !== 1;
    } catch (e) {
      return false;
    }
  }
  function polyfillMap(global) {
    if (needsPolyfill(global)) {
      global.Map = Map;
    }
  }
  registerPolyfill(polyfillMap);
  return {
    get Map() {
      return Map;
    },
    get polyfillMap() {
      return polyfillMap;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Map.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Set.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Set.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      isObject = $__0.isObject,
      registerPolyfill = $__0.registerPolyfill;
  var Map = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Map.js").Map;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var Set = function() {
    function Set() {
      var iterable = arguments[0];
      if (!isObject(this))
        throw new TypeError('Set called on incompatible type');
      if (hasOwnProperty.call(this, 'map_')) {
        throw new TypeError('Set can not be reentrantly initialised');
      }
      this.map_ = new Map();
      if (iterable !== null && iterable !== undefined) {
        var $__8 = true;
        var $__9 = false;
        var $__10 = undefined;
        try {
          for (var $__6 = void 0,
              $__5 = (iterable)[Symbol.iterator](); !($__8 = ($__6 = $__5.next()).done); $__8 = true) {
            var item = $__6.value;
            {
              this.add(item);
            }
          }
        } catch ($__11) {
          $__9 = true;
          $__10 = $__11;
        } finally {
          try {
            if (!$__8 && $__5.return != null) {
              $__5.return();
            }
          } finally {
            if ($__9) {
              throw $__10;
            }
          }
        }
      }
    }
    return ($traceurRuntime.createClass)(Set, {
      get size() {
        return this.map_.size;
      },
      has: function(key) {
        return this.map_.has(key);
      },
      add: function(key) {
        this.map_.set(key, key);
        return this;
      },
      delete: function(key) {
        return this.map_.delete(key);
      },
      clear: function() {
        return this.map_.clear();
      },
      forEach: function(callbackFn) {
        var thisArg = arguments[1];
        var $__4 = this;
        return this.map_.forEach(function(value, key) {
          callbackFn.call(thisArg, key, key, $__4);
        });
      },
      values: $traceurRuntime.initGeneratorFunction(function $__14() {
        var $__15,
            $__16;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                $__15 = $ctx.wrapYieldStar(this.map_.keys()[Symbol.iterator]());
                $ctx.sent = void 0;
                $ctx.action = 'next';
                $ctx.state = 12;
                break;
              case 12:
                $__16 = $__15[$ctx.action]($ctx.sentIgnoreThrow);
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = ($__16.done) ? 3 : 2;
                break;
              case 3:
                $ctx.sent = $__16.value;
                $ctx.state = -2;
                break;
              case 2:
                $ctx.state = 12;
                return $__16.value;
              default:
                return $ctx.end();
            }
        }, $__14, this);
      }),
      entries: $traceurRuntime.initGeneratorFunction(function $__17() {
        var $__18,
            $__19;
        return $traceurRuntime.createGeneratorInstance(function($ctx) {
          while (true)
            switch ($ctx.state) {
              case 0:
                $__18 = $ctx.wrapYieldStar(this.map_.entries()[Symbol.iterator]());
                $ctx.sent = void 0;
                $ctx.action = 'next';
                $ctx.state = 12;
                break;
              case 12:
                $__19 = $__18[$ctx.action]($ctx.sentIgnoreThrow);
                $ctx.state = 9;
                break;
              case 9:
                $ctx.state = ($__19.done) ? 3 : 2;
                break;
              case 3:
                $ctx.sent = $__19.value;
                $ctx.state = -2;
                break;
              case 2:
                $ctx.state = 12;
                return $__19.value;
              default:
                return $ctx.end();
            }
        }, $__17, this);
      })
    }, {});
  }();
  Object.defineProperty(Set.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  Object.defineProperty(Set.prototype, 'keys', {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  function needsPolyfill(global) {
    var $__13 = global,
        Set = $__13.Set,
        Symbol = $__13.Symbol;
    if (!Set || !$traceurRuntime.hasNativeSymbol() || !Set.prototype[Symbol.iterator] || !Set.prototype.values) {
      return true;
    }
    try {
      return new Set([1]).size !== 1;
    } catch (e) {
      return false;
    }
  }
  function polyfillSet(global) {
    if (needsPolyfill(global)) {
      global.Set = Set;
    }
  }
  registerPolyfill(polyfillSet);
  return {
    get Set() {
      return Set;
    },
    get polyfillSet() {
      return polyfillSet;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Set.js" + '');
System.registerModule("traceur-runtime@0.0.93/node_modules/rsvp/lib/rsvp/asap.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/node_modules/rsvp/lib/rsvp/asap.js";
  var len = 0;
  function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      scheduleFlush();
    }
  }
  var $__default = asap;
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
      channel.port2.postMessage(0);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }
    len = 0;
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Promise.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Promise.js";
  var async = System.get("traceur-runtime@0.0.93/node_modules/rsvp/lib/rsvp/asap.js").default;
  var registerPolyfill = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js").registerPolyfill;
  var promiseRaw = {};
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function idResolveHandler(x) {
    return x;
  }
  function idRejectHandler(x) {
    throw x;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
    var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 0:
        promise.onResolve_.push(onResolve, deferred);
        promise.onReject_.push(onReject, deferred);
        break;
      case +1:
        promiseEnqueue(promise.value_, [onResolve, deferred]);
        break;
      case -1:
        promiseEnqueue(promise.value_, [onReject, deferred]);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    if (this === $Promise) {
      var promise = promiseInit(new $Promise(promiseRaw));
      return {
        promise: promise,
        resolve: function(x) {
          promiseResolve(promise, x);
        },
        reject: function(r) {
          promiseReject(promise, r);
        }
      };
    } else {
      var result = {};
      result.promise = new C(function(resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
      });
      return result;
    }
  }
  function promiseSet(promise, status, value, onResolve, onReject) {
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = onResolve;
    promise.onReject_ = onReject;
    return promise;
  }
  function promiseInit(promise) {
    return promiseSet(promise, 0, undefined, [], []);
  }
  var Promise = function() {
    function Promise(resolver) {
      if (resolver === promiseRaw)
        return;
      if (typeof resolver !== 'function')
        throw new TypeError;
      var promise = promiseInit(this);
      try {
        resolver(function(x) {
          promiseResolve(promise, x);
        }, function(r) {
          promiseReject(promise, r);
        });
      } catch (e) {
        promiseReject(promise, e);
      }
    }
    return ($traceurRuntime.createClass)(Promise, {
      catch: function(onReject) {
        return this.then(undefined, onReject);
      },
      then: function(onResolve, onReject) {
        if (typeof onResolve !== 'function')
          onResolve = idResolveHandler;
        if (typeof onReject !== 'function')
          onReject = idRejectHandler;
        var that = this;
        var constructor = this.constructor;
        return chain(this, function(x) {
          x = promiseCoerce(constructor, x);
          return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
        }, onReject);
      }
    }, {
      resolve: function(x) {
        if (this === $Promise) {
          if (isPromise(x)) {
            return x;
          }
          return promiseSet(new $Promise(promiseRaw), +1, x);
        } else {
          return new this(function(resolve, reject) {
            resolve(x);
          });
        }
      },
      reject: function(r) {
        if (this === $Promise) {
          return promiseSet(new $Promise(promiseRaw), -1, r);
        } else {
          return new this(function(resolve, reject) {
            reject(r);
          });
        }
      },
      all: function(values) {
        var deferred = getDeferred(this);
        var resolutions = [];
        try {
          var makeCountdownFunction = function(i) {
            return function(x) {
              resolutions[i] = x;
              if (--count === 0)
                deferred.resolve(resolutions);
            };
          };
          var count = 0;
          var i = 0;
          var $__6 = true;
          var $__7 = false;
          var $__8 = undefined;
          try {
            for (var $__4 = void 0,
                $__3 = (values)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
              var value = $__4.value;
              {
                var countdownFunction = makeCountdownFunction(i);
                this.resolve(value).then(countdownFunction, function(r) {
                  deferred.reject(r);
                });
                ++i;
                ++count;
              }
            }
          } catch ($__9) {
            $__7 = true;
            $__8 = $__9;
          } finally {
            try {
              if (!$__6 && $__3.return != null) {
                $__3.return();
              }
            } finally {
              if ($__7) {
                throw $__8;
              }
            }
          }
          if (count === 0) {
            deferred.resolve(resolutions);
          }
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      },
      race: function(values) {
        var deferred = getDeferred(this);
        try {
          for (var i = 0; i < values.length; i++) {
            this.resolve(values[i]).then(function(x) {
              deferred.resolve(x);
            }, function(r) {
              deferred.reject(r);
            });
          }
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      }
    });
  }();
  var $Promise = Promise;
  var $PromiseReject = $Promise.reject;
  function promiseResolve(promise, x) {
    promiseDone(promise, +1, x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, -1, r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 0)
      return;
    promiseEnqueue(value, reactions);
    promiseSet(promise, status, value);
  }
  function promiseEnqueue(value, tasks) {
    async(function() {
      for (var i = 0; i < tasks.length; i += 2) {
        promiseHandle(value, tasks[i], tasks[i + 1]);
      }
    });
  }
  function promiseHandle(value, handler, deferred) {
    try {
      var result = handler(value);
      if (result === deferred.promise)
        throw new TypeError;
      else if (isPromise(result))
        chain(result, deferred.resolve, deferred.reject);
      else
        deferred.resolve(result);
    } catch (e) {
      try {
        deferred.reject(e);
      } catch (e) {}
    }
  }
  var thenableSymbol = '@@thenable';
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function promiseCoerce(constructor, x) {
    if (!isPromise(x) && isObject(x)) {
      var then;
      try {
        then = x.then;
      } catch (r) {
        var promise = $PromiseReject.call(constructor, r);
        x[thenableSymbol] = promise;
        return promise;
      }
      if (typeof then === 'function') {
        var p = x[thenableSymbol];
        if (p) {
          return p;
        } else {
          var deferred = getDeferred(constructor);
          x[thenableSymbol] = deferred.promise;
          try {
            then.call(x, deferred.resolve, deferred.reject);
          } catch (r) {
            deferred.reject(r);
          }
          return deferred.promise;
        }
      }
    }
    return x;
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  registerPolyfill(polyfillPromise);
  return {
    get Promise() {
      return Promise;
    },
    get polyfillPromise() {
      return polyfillPromise;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Promise.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/StringIterator.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/StringIterator.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      createIteratorResultObject = $__0.createIteratorResultObject,
      isObject = $__0.isObject;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var iteratedString = Symbol('iteratedString');
  var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
  var StringIterator = function() {
    var $__3;
    function StringIterator() {}
    return ($traceurRuntime.createClass)(StringIterator, ($__3 = {}, Object.defineProperty($__3, "next", {
      value: function() {
        var o = this;
        if (!isObject(o) || !hasOwnProperty.call(o, iteratedString)) {
          throw new TypeError('this must be a StringIterator object');
        }
        var s = o[iteratedString];
        if (s === undefined) {
          return createIteratorResultObject(undefined, true);
        }
        var position = o[stringIteratorNextIndex];
        var len = s.length;
        if (position >= len) {
          o[iteratedString] = undefined;
          return createIteratorResultObject(undefined, true);
        }
        var first = s.charCodeAt(position);
        var resultString;
        if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
          resultString = String.fromCharCode(first);
        } else {
          var second = s.charCodeAt(position + 1);
          if (second < 0xDC00 || second > 0xDFFF) {
            resultString = String.fromCharCode(first);
          } else {
            resultString = String.fromCharCode(first) + String.fromCharCode(second);
          }
        }
        o[stringIteratorNextIndex] = position + resultString.length;
        return createIteratorResultObject(resultString, false);
      },
      configurable: true,
      enumerable: true,
      writable: true
    }), Object.defineProperty($__3, Symbol.iterator, {
      value: function() {
        return this;
      },
      configurable: true,
      enumerable: true,
      writable: true
    }), $__3), {});
  }();
  function createStringIterator(string) {
    var s = String(string);
    var iterator = Object.create(StringIterator.prototype);
    iterator[iteratedString] = s;
    iterator[stringIteratorNextIndex] = 0;
    return iterator;
  }
  return {get createStringIterator() {
      return createStringIterator;
    }};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/String.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/String.js";
  var createStringIterator = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/StringIterator.js").createStringIterator;
  var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      maybeAddFunctions = $__1.maybeAddFunctions,
      maybeAddIterator = $__1.maybeAddIterator,
      registerPolyfill = $__1.registerPolyfill;
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function includes(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    if (search && $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (pos != pos) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    if (searchLength + start > stringLength) {
      return false;
    }
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint(_) {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  function stringPrototypeIterator() {
    var o = $traceurRuntime.checkObjectCoercible(this);
    var s = String(o);
    return createStringIterator(s);
  }
  function polyfillString(global) {
    var String = global.String;
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'endsWith', endsWith, 'includes', includes, 'repeat', repeat, 'startsWith', startsWith]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
    maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
  }
  registerPolyfill(polyfillString);
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get includes() {
      return includes;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    },
    get stringPrototypeIterator() {
      return stringPrototypeIterator;
    },
    get polyfillString() {
      return polyfillString;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/String.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/ArrayIterator.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/ArrayIterator.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      toObject = $__0.toObject,
      toUint32 = $__0.toUint32,
      createIteratorResultObject = $__0.createIteratorResultObject;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function() {
    var $__3;
    function ArrayIterator() {}
    return ($traceurRuntime.createClass)(ArrayIterator, ($__3 = {}, Object.defineProperty($__3, "next", {
      value: function() {
        var iterator = toObject(this);
        var array = iterator.iteratorObject_;
        if (!array) {
          throw new TypeError('Object is not an ArrayIterator');
        }
        var index = iterator.arrayIteratorNextIndex_;
        var itemKind = iterator.arrayIterationKind_;
        var length = toUint32(array.length);
        if (index >= length) {
          iterator.arrayIteratorNextIndex_ = Infinity;
          return createIteratorResultObject(undefined, true);
        }
        iterator.arrayIteratorNextIndex_ = index + 1;
        if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
          return createIteratorResultObject(array[index], false);
        if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
          return createIteratorResultObject([index, array[index]], false);
        return createIteratorResultObject(index, false);
      },
      configurable: true,
      enumerable: true,
      writable: true
    }), Object.defineProperty($__3, Symbol.iterator, {
      value: function() {
        return this;
      },
      configurable: true,
      enumerable: true,
      writable: true
    }), $__3), {});
  }();
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Array.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Array.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/ArrayIterator.js"),
      entries = $__0.entries,
      keys = $__0.keys,
      jsValues = $__0.values;
  var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      checkIterable = $__1.checkIterable,
      isCallable = $__1.isCallable,
      isConstructor = $__1.isConstructor,
      maybeAddFunctions = $__1.maybeAddFunctions,
      maybeAddIterator = $__1.maybeAddIterator,
      registerPolyfill = $__1.registerPolyfill,
      toInteger = $__1.toInteger,
      toLength = $__1.toLength,
      toObject = $__1.toObject;
  function from(arrLike) {
    var mapFn = arguments[1];
    var thisArg = arguments[2];
    var C = this;
    var items = toObject(arrLike);
    var mapping = mapFn !== undefined;
    var k = 0;
    var arr,
        len;
    if (mapping && !isCallable(mapFn)) {
      throw TypeError();
    }
    if (checkIterable(items)) {
      arr = isConstructor(C) ? new C() : [];
      var $__6 = true;
      var $__7 = false;
      var $__8 = undefined;
      try {
        for (var $__4 = void 0,
            $__3 = (items)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
          var item = $__4.value;
          {
            if (mapping) {
              arr[k] = mapFn.call(thisArg, item, k);
            } else {
              arr[k] = item;
            }
            k++;
          }
        }
      } catch ($__9) {
        $__7 = true;
        $__8 = $__9;
      } finally {
        try {
          if (!$__6 && $__3.return != null) {
            $__3.return();
          }
        } finally {
          if ($__7) {
            throw $__8;
          }
        }
      }
      arr.length = k;
      return arr;
    }
    len = toLength(items.length);
    arr = isConstructor(C) ? new C(len) : new Array(len);
    for (; k < len; k++) {
      if (mapping) {
        arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
      } else {
        arr[k] = items[k];
      }
    }
    arr.length = len;
    return arr;
  }
  function of() {
    for (var items = [],
        $__10 = 0; $__10 < arguments.length; $__10++)
      items[$__10] = arguments[$__10];
    var C = this;
    var len = items.length;
    var arr = isConstructor(C) ? new C(len) : new Array(len);
    for (var k = 0; k < len; k++) {
      arr[k] = items[k];
    }
    arr.length = len;
    return arr;
  }
  function fill(value) {
    var start = arguments[1] !== (void 0) ? arguments[1] : 0;
    var end = arguments[2];
    var object = toObject(this);
    var len = toLength(object.length);
    var fillStart = toInteger(start);
    var fillEnd = end !== undefined ? toInteger(end) : len;
    fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
    fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
    while (fillStart < fillEnd) {
      object[fillStart] = value;
      fillStart++;
    }
    return object;
  }
  function find(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg);
  }
  function findIndex(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg, true);
  }
  function findHelper(self, predicate) {
    var thisArg = arguments[2];
    var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
    var object = toObject(self);
    var len = toLength(object.length);
    if (!isCallable(predicate)) {
      throw TypeError();
    }
    for (var i = 0; i < len; i++) {
      var value = object[i];
      if (predicate.call(thisArg, value, i, object)) {
        return returnIndex ? i : value;
      }
    }
    return returnIndex ? -1 : undefined;
  }
  function polyfillArray(global) {
    var $__11 = global,
        Array = $__11.Array,
        Object = $__11.Object,
        Symbol = $__11.Symbol;
    var values = jsValues;
    if (Symbol && Symbol.iterator && Array.prototype[Symbol.iterator]) {
      values = Array.prototype[Symbol.iterator];
    }
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
    maybeAddFunctions(Array, ['from', from, 'of', of]);
    maybeAddIterator(Array.prototype, values, Symbol);
    maybeAddIterator(Object.getPrototypeOf([].values()), function() {
      return this;
    }, Symbol);
  }
  registerPolyfill(polyfillArray);
  return {
    get from() {
      return from;
    },
    get of() {
      return of;
    },
    get fill() {
      return fill;
    },
    get find() {
      return find;
    },
    get findIndex() {
      return findIndex;
    },
    get polyfillArray() {
      return polyfillArray;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Array.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Object.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Object.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      maybeAddFunctions = $__0.maybeAddFunctions,
      registerPolyfill = $__0.registerPolyfill;
  var $__2 = Object,
      defineProperty = $__2.defineProperty,
      getOwnPropertyDescriptor = $__2.getOwnPropertyDescriptor,
      getOwnPropertyNames = $__2.getOwnPropertyNames,
      keys = $__2.keys;
  function is(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    return left !== left && right !== right;
  }
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      var props = source == null ? [] : keys(source);
      var p = void 0,
          length = props.length;
      for (p = 0; p < length; p++) {
        var name = props[p];
        target[name] = source[name];
      }
    }
    return target;
  }
  function mixin(target, source) {
    var props = getOwnPropertyNames(source);
    var p,
        descriptor,
        length = props.length;
    for (p = 0; p < length; p++) {
      var name = props[p];
      descriptor = getOwnPropertyDescriptor(source, props[p]);
      defineProperty(target, props[p], descriptor);
    }
    return target;
  }
  function polyfillObject(global) {
    var Object = global.Object;
    maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
  }
  registerPolyfill(polyfillObject);
  return {
    get is() {
      return is;
    },
    get assign() {
      return assign;
    },
    get mixin() {
      return mixin;
    },
    get polyfillObject() {
      return polyfillObject;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Object.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Number.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Number.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      isNumber = $__0.isNumber,
      maybeAddConsts = $__0.maybeAddConsts,
      maybeAddFunctions = $__0.maybeAddFunctions,
      registerPolyfill = $__0.registerPolyfill,
      toInteger = $__0.toInteger;
  var $abs = Math.abs;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
  var EPSILON = Math.pow(2, -52);
  function NumberIsFinite(number) {
    return isNumber(number) && $isFinite(number);
  }
  function isInteger(number) {
    return NumberIsFinite(number) && toInteger(number) === number;
  }
  function NumberIsNaN(number) {
    return isNumber(number) && $isNaN(number);
  }
  function isSafeInteger(number) {
    if (NumberIsFinite(number)) {
      var integral = toInteger(number);
      if (integral === number)
        return $abs(integral) <= MAX_SAFE_INTEGER;
    }
    return false;
  }
  function polyfillNumber(global) {
    var Number = global.Number;
    maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
    maybeAddFunctions(Number, ['isFinite', NumberIsFinite, 'isInteger', isInteger, 'isNaN', NumberIsNaN, 'isSafeInteger', isSafeInteger]);
  }
  registerPolyfill(polyfillNumber);
  return {
    get MAX_SAFE_INTEGER() {
      return MAX_SAFE_INTEGER;
    },
    get MIN_SAFE_INTEGER() {
      return MIN_SAFE_INTEGER;
    },
    get EPSILON() {
      return EPSILON;
    },
    get isFinite() {
      return NumberIsFinite;
    },
    get isInteger() {
      return isInteger;
    },
    get isNaN() {
      return NumberIsNaN;
    },
    get isSafeInteger() {
      return isSafeInteger;
    },
    get polyfillNumber() {
      return polyfillNumber;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Number.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/fround.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/fround.js";
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var $__1 = Math,
      LN2 = $__1.LN2,
      abs = $__1.abs,
      floor = $__1.floor,
      log = $__1.log,
      min = $__1.min,
      pow = $__1.pow;
  function packIEEE754(v, ebits, fbits) {
    var bias = (1 << (ebits - 1)) - 1,
        s,
        e,
        f,
        ln,
        i,
        bits,
        str,
        bytes;
    function roundToEven(n) {
      var w = floor(n),
          f = n - w;
      if (f < 0.5)
        return w;
      if (f > 0.5)
        return w + 1;
      return w % 2 ? w + 1 : w;
    }
    if (v !== v) {
      e = (1 << ebits) - 1;
      f = pow(2, fbits - 1);
      s = 0;
    } else if (v === Infinity || v === -Infinity) {
      e = (1 << ebits) - 1;
      f = 0;
      s = (v < 0) ? 1 : 0;
    } else if (v === 0) {
      e = 0;
      f = 0;
      s = (1 / v === -Infinity) ? 1 : 0;
    } else {
      s = v < 0;
      v = abs(v);
      if (v >= pow(2, 1 - bias)) {
        e = min(floor(log(v) / LN2), 1023);
        f = roundToEven(v / pow(2, e) * pow(2, fbits));
        if (f / pow(2, fbits) >= 2) {
          e = e + 1;
          f = 1;
        }
        if (e > bias) {
          e = (1 << ebits) - 1;
          f = 0;
        } else {
          e = e + bias;
          f = f - pow(2, fbits);
        }
      } else {
        e = 0;
        f = roundToEven(v / pow(2, 1 - bias - fbits));
      }
    }
    bits = [];
    for (i = fbits; i; i -= 1) {
      bits.push(f % 2 ? 1 : 0);
      f = floor(f / 2);
    }
    for (i = ebits; i; i -= 1) {
      bits.push(e % 2 ? 1 : 0);
      e = floor(e / 2);
    }
    bits.push(s ? 1 : 0);
    bits.reverse();
    str = bits.join('');
    bytes = [];
    while (str.length) {
      bytes.push(parseInt(str.substring(0, 8), 2));
      str = str.substring(8);
    }
    return bytes;
  }
  function unpackIEEE754(bytes, ebits, fbits) {
    var bits = [],
        i,
        j,
        b,
        str,
        bias,
        s,
        e,
        f;
    for (i = bytes.length; i; i -= 1) {
      b = bytes[i - 1];
      for (j = 8; j; j -= 1) {
        bits.push(b % 2 ? 1 : 0);
        b = b >> 1;
      }
    }
    bits.reverse();
    str = bits.join('');
    bias = (1 << (ebits - 1)) - 1;
    s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    e = parseInt(str.substring(1, 1 + ebits), 2);
    f = parseInt(str.substring(1 + ebits), 2);
    if (e === (1 << ebits) - 1) {
      return f !== 0 ? NaN : s * Infinity;
    } else if (e > 0) {
      return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
    } else if (f !== 0) {
      return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
    } else {
      return s < 0 ? -0 : 0;
    }
  }
  function unpackF32(b) {
    return unpackIEEE754(b, 8, 23);
  }
  function packF32(v) {
    return packIEEE754(v, 8, 23);
  }
  function fround(x) {
    if (x === 0 || !$isFinite(x) || $isNaN(x)) {
      return x;
    }
    return unpackF32(packF32(Number(x)));
  }
  return {get fround() {
      return fround;
    }};
});
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Math.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Math.js";
  var jsFround = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/fround.js").fround;
  var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      maybeAddFunctions = $__1.maybeAddFunctions,
      registerPolyfill = $__1.registerPolyfill,
      toUint32 = $__1.toUint32;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var $__3 = Math,
      abs = $__3.abs,
      ceil = $__3.ceil,
      exp = $__3.exp,
      floor = $__3.floor,
      log = $__3.log,
      pow = $__3.pow,
      sqrt = $__3.sqrt;
  function clz32(x) {
    x = toUint32(+x);
    if (x == 0)
      return 32;
    var result = 0;
    if ((x & 0xFFFF0000) === 0) {
      x <<= 16;
      result += 16;
    }
    ;
    if ((x & 0xFF000000) === 0) {
      x <<= 8;
      result += 8;
    }
    ;
    if ((x & 0xF0000000) === 0) {
      x <<= 4;
      result += 4;
    }
    ;
    if ((x & 0xC0000000) === 0) {
      x <<= 2;
      result += 2;
    }
    ;
    if ((x & 0x80000000) === 0) {
      x <<= 1;
      result += 1;
    }
    ;
    return result;
  }
  function imul(x, y) {
    x = toUint32(+x);
    y = toUint32(+y);
    var xh = (x >>> 16) & 0xffff;
    var xl = x & 0xffff;
    var yh = (y >>> 16) & 0xffff;
    var yl = y & 0xffff;
    return xl * yl + (((xh * yl + xl * yh) << 16) >>> 0) | 0;
  }
  function sign(x) {
    x = +x;
    if (x > 0)
      return 1;
    if (x < 0)
      return -1;
    return x;
  }
  function log10(x) {
    return log(x) * 0.434294481903251828;
  }
  function log2(x) {
    return log(x) * 1.442695040888963407;
  }
  function log1p(x) {
    x = +x;
    if (x < -1 || $isNaN(x)) {
      return NaN;
    }
    if (x === 0 || x === Infinity) {
      return x;
    }
    if (x === -1) {
      return -Infinity;
    }
    var result = 0;
    var n = 50;
    if (x < 0 || x > 1) {
      return log(1 + x);
    }
    for (var i = 1; i < n; i++) {
      if ((i % 2) === 0) {
        result -= pow(x, i) / i;
      } else {
        result += pow(x, i) / i;
      }
    }
    return result;
  }
  function expm1(x) {
    x = +x;
    if (x === -Infinity) {
      return -1;
    }
    if (!$isFinite(x) || x === 0) {
      return x;
    }
    return exp(x) - 1;
  }
  function cosh(x) {
    x = +x;
    if (x === 0) {
      return 1;
    }
    if ($isNaN(x)) {
      return NaN;
    }
    if (!$isFinite(x)) {
      return Infinity;
    }
    if (x < 0) {
      x = -x;
    }
    if (x > 21) {
      return exp(x) / 2;
    }
    return (exp(x) + exp(-x)) / 2;
  }
  function sinh(x) {
    x = +x;
    if (!$isFinite(x) || x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  }
  function tanh(x) {
    x = +x;
    if (x === 0)
      return x;
    if (!$isFinite(x))
      return sign(x);
    var exp1 = exp(x);
    var exp2 = exp(-x);
    return (exp1 - exp2) / (exp1 + exp2);
  }
  function acosh(x) {
    x = +x;
    if (x < 1)
      return NaN;
    if (!$isFinite(x))
      return x;
    return log(x + sqrt(x + 1) * sqrt(x - 1));
  }
  function asinh(x) {
    x = +x;
    if (x === 0 || !$isFinite(x))
      return x;
    if (x > 0)
      return log(x + sqrt(x * x + 1));
    return -log(-x + sqrt(x * x + 1));
  }
  function atanh(x) {
    x = +x;
    if (x === -1) {
      return -Infinity;
    }
    if (x === 1) {
      return Infinity;
    }
    if (x === 0) {
      return x;
    }
    if ($isNaN(x) || x < -1 || x > 1) {
      return NaN;
    }
    return 0.5 * log((1 + x) / (1 - x));
  }
  function hypot(x, y) {
    var length = arguments.length;
    var args = new Array(length);
    var max = 0;
    for (var i = 0; i < length; i++) {
      var n = arguments[i];
      n = +n;
      if (n === Infinity || n === -Infinity)
        return Infinity;
      n = abs(n);
      if (n > max)
        max = n;
      args[i] = n;
    }
    if (max === 0)
      max = 1;
    var sum = 0;
    var compensation = 0;
    for (var i = 0; i < length; i++) {
      var n = args[i] / max;
      var summand = n * n - compensation;
      var preliminary = sum + summand;
      compensation = (preliminary - sum) - summand;
      sum = preliminary;
    }
    return sqrt(sum) * max;
  }
  function trunc(x) {
    x = +x;
    if (x > 0)
      return floor(x);
    if (x < 0)
      return ceil(x);
    return x;
  }
  var fround,
      f32;
  if (typeof Float32Array === 'function') {
    f32 = new Float32Array(1);
    fround = function(x) {
      f32[0] = Number(x);
      return f32[0];
    };
  } else {
    fround = jsFround;
  }
  function cbrt(x) {
    x = +x;
    if (x === 0)
      return x;
    var negate = x < 0;
    if (negate)
      x = -x;
    var result = pow(x, 1 / 3);
    return negate ? -result : result;
  }
  function polyfillMath(global) {
    var Math = global.Math;
    maybeAddFunctions(Math, ['acosh', acosh, 'asinh', asinh, 'atanh', atanh, 'cbrt', cbrt, 'clz32', clz32, 'cosh', cosh, 'expm1', expm1, 'fround', fround, 'hypot', hypot, 'imul', imul, 'log10', log10, 'log1p', log1p, 'log2', log2, 'sign', sign, 'sinh', sinh, 'tanh', tanh, 'trunc', trunc]);
  }
  registerPolyfill(polyfillMath);
  return {
    get clz32() {
      return clz32;
    },
    get imul() {
      return imul;
    },
    get sign() {
      return sign;
    },
    get log10() {
      return log10;
    },
    get log2() {
      return log2;
    },
    get log1p() {
      return log1p;
    },
    get expm1() {
      return expm1;
    },
    get cosh() {
      return cosh;
    },
    get sinh() {
      return sinh;
    },
    get tanh() {
      return tanh;
    },
    get acosh() {
      return acosh;
    },
    get asinh() {
      return asinh;
    },
    get atanh() {
      return atanh;
    },
    get hypot() {
      return hypot;
    },
    get trunc() {
      return trunc;
    },
    get fround() {
      return fround;
    },
    get cbrt() {
      return cbrt;
    },
    get polyfillMath() {
      return polyfillMath;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Math.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/WeakMap.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/WeakMap.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/frozen-data.js"),
      deleteFrozen = $__0.deleteFrozen,
      getFrozen = $__0.getFrozen,
      hasFrozen = $__0.hasFrozen,
      setFrozen = $__0.setFrozen;
  var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      isObject = $__1.isObject,
      registerPolyfill = $__1.registerPolyfill;
  var $__4 = Object,
      defineProperty = $__4.defineProperty,
      getOwnPropertyDescriptor = $__4.getOwnPropertyDescriptor,
      isExtensible = $__4.isExtensible;
  var $__5 = $traceurRuntime,
      createPrivateSymbol = $__5.createPrivateSymbol,
      deletePrivate = $__5.deletePrivate,
      getPrivate = $__5.getPrivate,
      hasNativeSymbol = $__5.hasNativeSymbol,
      hasPrivate = $__5.hasPrivate,
      setPrivate = $__5.setPrivate;
  var $TypeError = TypeError;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var sentinel = {};
  var WeakMap = function() {
    function WeakMap() {
      this.name_ = createPrivateSymbol();
      this.frozenData_ = [];
    }
    return ($traceurRuntime.createClass)(WeakMap, {
      set: function(key, value) {
        if (!isObject(key))
          throw new $TypeError('key must be an object');
        if (!isExtensible(key)) {
          setFrozen(this.frozenData_, key, value);
        } else {
          setPrivate(key, this.name_, value);
        }
        return this;
      },
      get: function(key) {
        if (!isObject(key))
          return undefined;
        if (!isExtensible(key)) {
          return getFrozen(this.frozenData_, key);
        }
        return getPrivate(key, this.name_);
      },
      delete: function(key) {
        if (!isObject(key))
          return false;
        if (!isExtensible(key)) {
          return deleteFrozen(this.frozenData_, key);
        }
        return deletePrivate(key, this.name_);
      },
      has: function(key) {
        if (!isObject(key))
          return false;
        if (!isExtensible(key)) {
          return hasFrozen(this.frozenData_, key);
        }
        return hasPrivate(key, this.name_);
      }
    }, {});
  }();
  function needsPolyfill(global) {
    var $__7 = global,
        WeakMap = $__7.WeakMap,
        Symbol = $__7.Symbol;
    if (!WeakMap || !hasNativeSymbol()) {
      return true;
    }
    try {
      var o = {};
      var wm = new WeakMap([[o, false]]);
      return wm.get(o);
    } catch (e) {
      return false;
    }
  }
  function polyfillWeakMap(global) {
    if (needsPolyfill(global)) {
      global.WeakMap = WeakMap;
    }
  }
  registerPolyfill(polyfillWeakMap);
  return {
    get WeakMap() {
      return WeakMap;
    },
    get polyfillWeakMap() {
      return polyfillWeakMap;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/WeakMap.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/WeakSet.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/WeakSet.js";
  var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/frozen-data.js"),
      deleteFrozen = $__0.deleteFrozen,
      getFrozen = $__0.getFrozen,
      setFrozen = $__0.setFrozen;
  var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
      isObject = $__1.isObject,
      registerPolyfill = $__1.registerPolyfill;
  var $__4 = Object,
      defineProperty = $__4.defineProperty,
      isExtensible = $__4.isExtensible;
  var $__5 = $traceurRuntime,
      createPrivateSymbol = $__5.createPrivateSymbol,
      deletePrivate = $__5.deletePrivate,
      getPrivate = $__5.getPrivate,
      hasNativeSymbol = $__5.hasNativeSymbol,
      hasPrivate = $__5.hasPrivate,
      setPrivate = $__5.setPrivate;
  var $TypeError = TypeError;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var WeakSet = function() {
    function WeakSet() {
      this.name_ = createPrivateSymbol();
      this.frozenData_ = [];
    }
    return ($traceurRuntime.createClass)(WeakSet, {
      add: function(value) {
        if (!isObject(value))
          throw new $TypeError('value must be an object');
        if (!isExtensible(value)) {
          setFrozen(this.frozenData_, value, value);
        } else {
          setPrivate(value, this.name_, true);
        }
        return this;
      },
      delete: function(value) {
        if (!isObject(value))
          return false;
        if (!isExtensible(value)) {
          return deleteFrozen(this.frozenData_, value);
        }
        return deletePrivate(value, this.name_);
      },
      has: function(value) {
        if (!isObject(value))
          return false;
        if (!isExtensible(value)) {
          return getFrozen(this.frozenData_, value) === value;
        }
        return hasPrivate(value, this.name_);
      }
    }, {});
  }();
  function needsPolyfill(global) {
    var $__7 = global,
        WeakSet = $__7.WeakSet,
        Symbol = $__7.Symbol;
    if (!WeakSet || !hasNativeSymbol()) {
      return true;
    }
    try {
      var o = {};
      var wm = new WeakSet([[o]]);
      return !wm.has(o);
    } catch (e) {
      return false;
    }
  }
  function polyfillWeakSet(global) {
    if (needsPolyfill(global)) {
      global.WeakSet = WeakSet;
    }
  }
  registerPolyfill(polyfillWeakSet);
  return {
    get WeakSet() {
      return WeakSet;
    },
    get polyfillWeakSet() {
      return polyfillWeakSet;
    }
  };
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/WeakSet.js" + '');
System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/polyfills.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/polyfills.js";
  var polyfillAll = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js").polyfillAll;
  polyfillAll(Reflect.global);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfillAll(global);
  };
  return {};
});
System.get("traceur-runtime@0.0.93/src/runtime/polyfills/polyfills.js" + '');

System = curSystem; })();
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  var getOwnPropertyDescriptor = true;
  try {
    Object.getOwnPropertyDescriptor({ a: 0 }, 'a');
  }
  catch(e) {
    getOwnPropertyDescriptor = false;
  }

  var defineProperty;
  (function () {
    try {
      if (!!Object.defineProperty({}, 'a', {}))
        defineProperty = Object.defineProperty;
    }
    catch (e) {
      defineProperty = function(obj, prop, opt) {
        try {
          obj[prop] = opt.value || opt.get.call(obj);
        }
        catch(e) {}
      }
    }
  })();

  function register(name, deps, declare) {
    if (arguments.length === 4)
      return registerDynamic.apply(this, arguments);
    doRegister(name, {
      declarative: true,
      deps: deps,
      declare: declare
    });
  }

  function registerDynamic(name, deps, executingRequire, execute) {
    doRegister(name, {
      declarative: false,
      deps: deps,
      executingRequire: executingRequire,
      execute: execute
    });
  }

  function doRegister(name, entry) {
    entry.name = name;

    // we never overwrite an existing define
    if (!(name in defined))
      defined[name] = entry;

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }


  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];

      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;

      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {

        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;

      if (typeof name == 'object') {
        for (var p in name)
          exports[p] = name[p];
      }
      else {
        exports[name] = value;
      }

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          for (var j = 0; j < importerModule.dependencies.length; ++j) {
            if (importerModule.dependencies[j] === module) {
              importerModule.setters[j](exports);
            }
          }
        }
      }

      module.locked = false;
      return value;
    }, entry.name);

    module.setters = declaration.setters;
    module.execute = declaration.execute;

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = depEntry.esModule;
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);

      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);

    if (output)
      module.exports = output;

    // create the esModule object, which allows ES6 named imports of dynamics
    exports = module.exports;
 
    if (exports && exports.__esModule) {
      entry.esModule = exports;
    }
    else {
      entry.esModule = {};
      
      // don't trigger getters/setters in environments that support them
      if ((typeof exports == 'object' || typeof exports == 'function') && exports !== global) {
        if (getOwnPropertyDescriptor) {
          var d;
          for (var p in exports)
            if (d = Object.getOwnPropertyDescriptor(exports, p))
              defineProperty(entry.esModule, p, d);
        }
        else {
          var hasOwnProperty = exports && exports.hasOwnProperty;
          for (var p in exports) {
            if (!hasOwnProperty || exports.hasOwnProperty(p))
              entry.esModule[p] = exports[p];
          }
         }
       }
      entry.esModule['default'] = exports;
      defineProperty(entry.esModule, '__useDefault', {
        value: true
      });
    }
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (!entry || entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    // node core modules
    if (name.substr(0, 6) == '@node/')
      return require(name.substr(6));

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    // exported modules get __esModule defined for interop
    if (entry.declarative)
      defineProperty(entry.module.exports, '__esModule', { value: true });

    // return the defined module object
    return modules[name] = entry.declarative ? entry.module.exports : entry.esModule;
  };

  return function(mains, depNames, declare) {
    return function(formatDetect) {
      formatDetect(function(deps) {
        var System = {
          _nodeRequire: typeof require != 'undefined' && require.resolve && typeof process != 'undefined' && require,
          register: register,
          registerDynamic: registerDynamic,
          get: load, 
          set: function(name, module) {
            modules[name] = module; 
          },
          newModule: function(module) {
            return module;
          }
        };
        System.set('@empty', {});

        // register external dependencies
        for (var i = 0; i < depNames.length; i++) (function(depName, dep) {
          if (dep && dep.__esModule)
            System.register(depName, [], function(_export) {
              return {
                setters: [],
                execute: function() {
                  for (var p in dep)
                    if (p != '__esModule' && !(typeof p == 'object' && p + '' == 'Module'))
                      _export(p, dep[p]);
                }
              };
            });
          else
            System.registerDynamic(depName, [], false, function() {
              return dep;
            });
        })(depNames[i], arguments[i]);

        // register modules in this bundle
        declare(System);

        // load mains
        var firstLoad = load(mains[0]);
        if (mains.length > 1)
          for (var i = 1; i < mains.length; i++)
            load(mains[i]);

        if (firstLoad.__useDefault)
          return firstLoad['default'];
        else
          return firstLoad;
      });
    };
  };

})(typeof self != 'undefined' ? self : global)
/* (['mainModule'], ['external-dep'], function($__System) {
  System.register(...);
})
(function(factory) {
  if (typeof define && define.amd)
    define(['external-dep'], factory);
  // etc UMD / module pattern
})*/

(["1"], [], function($__System) {

(function() {
  var loader = $__System;
  
  if (typeof window != 'undefined' && typeof document != 'undefined' && window.location)
    var windowOrigin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

  loader.set('@@cjs-helpers', loader.newModule({
    getPathVars: function(moduleId) {
      // remove any plugin syntax
      var pluginIndex = moduleId.lastIndexOf('!');
      var filename;
      if (pluginIndex != -1)
        filename = moduleId.substr(0, pluginIndex);
      else
        filename = moduleId;

      var dirname = filename.split('/');
      dirname.pop();
      dirname = dirname.join('/');

      if (filename.substr(0, 8) == 'file:///') {
        filename = filename.substr(7);
        dirname = dirname.substr(7);

        // on windows remove leading '/'
        if (isWindows) {
          filename = filename.substr(1);
          dirname = dirname.substr(1);
        }
      }
      else if (windowOrigin && filename.substr(0, windowOrigin.length) === windowOrigin) {
        filename = filename.substr(windowOrigin.length);
        dirname = dirname.substr(windowOrigin.length);
      }

      return {
        filename: filename,
        dirname: dirname
      };
    }
  }));
})();

$__System.registerDynamic("2", [], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  ;
  (function(window, angular, undefined) {
    'use strict';
    (function() {
      angular.module('uiGmapgoogle-maps.providers', ['nemLogging']);
      angular.module('uiGmapgoogle-maps.wrapped', []);
      angular.module('uiGmapgoogle-maps.extensions', ['uiGmapgoogle-maps.wrapped', 'uiGmapgoogle-maps.providers']);
      angular.module('uiGmapgoogle-maps.directives.api.utils', ['uiGmapgoogle-maps.extensions']);
      angular.module('uiGmapgoogle-maps.directives.api.managers', []);
      angular.module('uiGmapgoogle-maps.directives.api.options', ['uiGmapgoogle-maps.directives.api.utils']);
      angular.module('uiGmapgoogle-maps.directives.api.options.builders', []);
      angular.module('uiGmapgoogle-maps.directives.api.models.child', ['uiGmapgoogle-maps.directives.api.utils', 'uiGmapgoogle-maps.directives.api.options', 'uiGmapgoogle-maps.directives.api.options.builders']);
      angular.module('uiGmapgoogle-maps.directives.api.models.parent', ['uiGmapgoogle-maps.directives.api.managers', 'uiGmapgoogle-maps.directives.api.models.child', 'uiGmapgoogle-maps.providers']);
      angular.module('uiGmapgoogle-maps.directives.api', ['uiGmapgoogle-maps.directives.api.models.parent']);
      angular.module('uiGmapgoogle-maps', ['uiGmapgoogle-maps.directives.api', 'uiGmapgoogle-maps.providers']);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.providers').factory('uiGmapMapScriptLoader', ['$q', 'uiGmapuuid', function($q, uuid) {
        var getScriptUrl,
            includeScript,
            isGoogleMapsLoaded,
            scriptId;
        scriptId = void 0;
        getScriptUrl = function(options) {
          if (options.china) {
            return 'http://maps.google.cn/maps/api/js?';
          } else {
            if (options.transport === 'auto') {
              return '//maps.googleapis.com/maps/api/js?';
            } else {
              return options.transport + '://maps.googleapis.com/maps/api/js?';
            }
          }
        };
        includeScript = function(options) {
          var omitOptions,
              query,
              script;
          omitOptions = ['transport', 'isGoogleMapsForWork', 'china'];
          if (options.isGoogleMapsForWork) {
            omitOptions.push('key');
          }
          query = _.map(_.omit(options, omitOptions), function(v, k) {
            return k + '=' + v;
          });
          if (scriptId) {
            document.getElementById(scriptId).remove();
          }
          query = query.join('&');
          script = document.createElement('script');
          script.id = scriptId = "ui_gmap_map_load_" + (uuid.generate());
          script.type = 'text/javascript';
          script.src = getScriptUrl(options) + query;
          return document.body.appendChild(script);
        };
        isGoogleMapsLoaded = function() {
          return angular.isDefined(window.google) && angular.isDefined(window.google.maps);
        };
        return {load: function(options) {
            var deferred,
                randomizedFunctionName;
            deferred = $q.defer();
            if (isGoogleMapsLoaded()) {
              deferred.resolve(window.google.maps);
              return deferred.promise;
            }
            randomizedFunctionName = options.callback = 'onGoogleMapsReady' + Math.round(Math.random() * 1000);
            window[randomizedFunctionName] = function() {
              window[randomizedFunctionName] = null;
              deferred.resolve(window.google.maps);
            };
            if (window.navigator.connection && window.Connection && window.navigator.connection.type === window.Connection.NONE) {
              document.addEventListener('online', function() {
                if (!isGoogleMapsLoaded()) {
                  return includeScript(options);
                }
              });
            } else {
              includeScript(options);
            }
            return deferred.promise;
          }};
      }]).provider('uiGmapGoogleMapApi', function() {
        this.options = {
          transport: 'https',
          isGoogleMapsForWork: false,
          china: false,
          v: '3',
          libraries: '',
          language: 'en',
          sensor: 'false'
        };
        this.configure = function(options) {
          angular.extend(this.options, options);
        };
        this.$get = ['uiGmapMapScriptLoader', (function(_this) {
          return function(loader) {
            return loader.load(_this.options);
          };
        })(this)];
        return this;
      });
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.extensions').service('uiGmapExtendGWin', function() {
        return {init: _.once(function() {
            var uiGmapInfoBox;
            if (!(google || (typeof google !== "undefined" && google !== null ? google.maps : void 0) || (google.maps.InfoWindow != null))) {
              return;
            }
            google.maps.InfoWindow.prototype._open = google.maps.InfoWindow.prototype.open;
            google.maps.InfoWindow.prototype._close = google.maps.InfoWindow.prototype.close;
            google.maps.InfoWindow.prototype._isOpen = false;
            google.maps.InfoWindow.prototype.open = function(map, anchor, recurse) {
              if (recurse != null) {
                return;
              }
              this._isOpen = true;
              this._open(map, anchor, true);
            };
            google.maps.InfoWindow.prototype.close = function(recurse) {
              if (recurse != null) {
                return;
              }
              this._isOpen = false;
              this._close(true);
            };
            google.maps.InfoWindow.prototype.isOpen = function(val) {
              if (val == null) {
                val = void 0;
              }
              if (val == null) {
                return this._isOpen;
              } else {
                return this._isOpen = val;
              }
            };
            if (window.InfoBox) {
              window.InfoBox.prototype._open = window.InfoBox.prototype.open;
              window.InfoBox.prototype._close = window.InfoBox.prototype.close;
              window.InfoBox.prototype._isOpen = false;
              window.InfoBox.prototype.open = function(map, anchor) {
                this._isOpen = true;
                this._open(map, anchor);
              };
              window.InfoBox.prototype.close = function() {
                this._isOpen = false;
                this._close();
              };
              window.InfoBox.prototype.isOpen = function(val) {
                if (val == null) {
                  val = void 0;
                }
                if (val == null) {
                  return this._isOpen;
                } else {
                  return this._isOpen = val;
                }
              };
              uiGmapInfoBox = (function(superClass) {
                extend(uiGmapInfoBox, superClass);
                function uiGmapInfoBox(opts) {
                  this.getOrigCloseBoxImg_ = bind(this.getOrigCloseBoxImg_, this);
                  this.getCloseBoxDiv_ = bind(this.getCloseBoxDiv_, this);
                  var box;
                  box = new window.InfoBox(opts);
                  _.extend(this, box);
                  if (opts.closeBoxDiv != null) {
                    this.closeBoxDiv_ = opts.closeBoxDiv;
                  }
                }
                uiGmapInfoBox.prototype.getCloseBoxDiv_ = function() {
                  return this.closeBoxDiv_;
                };
                uiGmapInfoBox.prototype.getCloseBoxImg_ = function() {
                  var div,
                      img;
                  div = this.getCloseBoxDiv_();
                  img = this.getOrigCloseBoxImg_();
                  return div || img;
                };
                uiGmapInfoBox.prototype.getOrigCloseBoxImg_ = function() {
                  var img;
                  img = "";
                  if (this.closeBoxURL_ !== "") {
                    img = "<img";
                    img += " src='" + this.closeBoxURL_ + "'";
                    img += " align=right";
                    img += " style='";
                    img += " position: relative;";
                    img += " cursor: pointer;";
                    img += " margin: " + this.closeBoxMargin_ + ";";
                    img += "'>";
                  }
                  return img;
                };
                return uiGmapInfoBox;
              })(window.InfoBox);
              window.uiGmapInfoBox = uiGmapInfoBox;
            }
            if (window.MarkerLabel_) {
              return window.MarkerLabel_.prototype.setContent = function() {
                var content;
                content = this.marker_.get('labelContent');
                if (!content || _.isEqual(this.oldContent, content)) {
                  return;
                }
                if (typeof(content != null ? content.nodeType : void 0) === 'undefined') {
                  this.labelDiv_.innerHTML = content;
                  this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
                  this.oldContent = content;
                } else {
                  this.labelDiv_.innerHTML = '';
                  this.labelDiv_.appendChild(content);
                  content = content.cloneNode(true);
                  this.labelDiv_.innerHTML = '';
                  this.eventDiv_.appendChild(content);
                  this.oldContent = content;
                }
              };
            }
          })};
      });
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.extensions').service('uiGmapLodash', function() {
        var baseGet,
            baseToString,
            get,
            reIsDeepProp,
            reIsPlainProp,
            rePropName,
            toObject,
            toPath;
        if (_.get == null) {
          reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/;
          reIsPlainProp = /^\w*$/;
          rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
          toObject = function(value) {
            if (_.isObject(value)) {
              return value;
            } else {
              return Object(value);
            }
          };
          baseToString = function(value) {
            if (value === null) {
              return '';
            } else {
              return value + '';
            }
          };
          toPath = function(value) {
            var result;
            if (_.isArray(value)) {
              return value;
            }
            result = [];
            baseToString(value).replace(rePropName, function(match, number, quote, string) {
              result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
            });
            return result;
          };
          baseGet = function(object, path, pathKey) {
            var index,
                length;
            if (object === null) {
              return;
            }
            if (pathKey !== void 0 && pathKey in toObject(object)) {
              path = [pathKey];
            }
            index = 0;
            length = path.length;
            while (!_.isUndefined(object) && index < length) {
              object = object[path[index++]];
            }
            if (index && index === length) {
              return object;
            } else {
              return void 0;
            }
          };
          get = function(object, path, defaultValue) {
            var result;
            result = object === null ? void 0 : baseGet(object, toPath(path), path + '');
            if (result === void 0) {
              return defaultValue;
            } else {
              return result;
            }
          };
          _.get = get;
        }
        this.intersectionObjects = function(array1, array2, comparison) {
          var res;
          if (comparison == null) {
            comparison = void 0;
          }
          res = _.map(array1, (function(_this) {
            return function(obj1) {
              return _.find(array2, function(obj2) {
                if (comparison != null) {
                  return comparison(obj1, obj2);
                } else {
                  return _.isEqual(obj1, obj2);
                }
              });
            };
          })(this));
          return _.filter(res, function(o) {
            return o != null;
          });
        };
        this.containsObject = _.includeObject = function(obj, target, comparison) {
          if (comparison == null) {
            comparison = void 0;
          }
          if (obj === null) {
            return false;
          }
          return _.any(obj, (function(_this) {
            return function(value) {
              if (comparison != null) {
                return comparison(value, target);
              } else {
                return _.isEqual(value, target);
              }
            };
          })(this));
        };
        this.differenceObjects = function(array1, array2, comparison) {
          if (comparison == null) {
            comparison = void 0;
          }
          return _.filter(array1, (function(_this) {
            return function(value) {
              return !_this.containsObject(array2, value, comparison);
            };
          })(this));
        };
        this.withoutObjects = this.differenceObjects;
        this.indexOfObject = function(array, item, comparison, isSorted) {
          var i,
              length;
          if (array == null) {
            return -1;
          }
          i = 0;
          length = array.length;
          if (isSorted) {
            if (typeof isSorted === "number") {
              i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
            } else {
              i = _.sortedIndex(array, item);
              return (array[i] === item ? i : -1);
            }
          }
          while (i < length) {
            if (comparison != null) {
              if (comparison(array[i], item)) {
                return i;
              }
            } else {
              if (_.isEqual(array[i], item)) {
                return i;
              }
            }
            i++;
          }
          return -1;
        };
        this.isNullOrUndefined = function(thing) {
          return _.isNull(thing || _.isUndefined(thing));
        };
        return this;
      });
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.extensions').factory('uiGmapString', function() {
        return function(str) {
          this.contains = function(value, fromIndex) {
            return str.indexOf(value, fromIndex) !== -1;
          };
          return this;
        };
      });
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmap_sync', [function() {
        return {fakePromise: function() {
            var _cb;
            _cb = void 0;
            return {
              then: function(cb) {
                return _cb = cb;
              },
              resolve: function() {
                return _cb.apply(void 0, arguments);
              }
            };
          }};
      }]).service('uiGmap_async', ['$timeout', 'uiGmapPromise', 'uiGmapLogger', '$q', 'uiGmapDataStructures', 'uiGmapGmapUtil', function($timeout, uiGmapPromise, $log, $q, uiGmapDataStructures, uiGmapGmapUtil) {
        var ExposedPromise,
            PromiseQueueManager,
            SniffedPromise,
            _getArrayAndKeys,
            _getIterateeValue,
            defaultChunkSize,
            doChunk,
            doSkippPromise,
            each,
            errorObject,
            isInProgress,
            kickPromise,
            logTryCatch,
            managePromiseQueue,
            map,
            maybeCancelPromises,
            promiseStatus,
            promiseTypes,
            tryCatch;
        promiseTypes = uiGmapPromise.promiseTypes;
        isInProgress = uiGmapPromise.isInProgress;
        promiseStatus = uiGmapPromise.promiseStatus;
        ExposedPromise = uiGmapPromise.ExposedPromise;
        SniffedPromise = uiGmapPromise.SniffedPromise;
        kickPromise = function(sniffedPromise, cancelCb) {
          var promise;
          promise = sniffedPromise.promise();
          promise.promiseType = sniffedPromise.promiseType;
          if (promise.$$state) {
            $log.debug("promiseType: " + promise.promiseType + ", state: " + (promiseStatus(promise.$$state.status)));
          }
          promise.cancelCb = cancelCb;
          return promise;
        };
        doSkippPromise = function(sniffedPromise, lastPromise) {
          if (sniffedPromise.promiseType === promiseTypes.create && lastPromise.promiseType !== promiseTypes["delete"] && lastPromise.promiseType !== promiseTypes.init) {
            $log.debug("lastPromise.promiseType " + lastPromise.promiseType + ", newPromiseType: " + sniffedPromise.promiseType + ", SKIPPED MUST COME AFTER DELETE ONLY");
            return true;
          }
          return false;
        };
        maybeCancelPromises = function(queue, sniffedPromise, lastPromise) {
          var first;
          if (sniffedPromise.promiseType === promiseTypes["delete"] && lastPromise.promiseType !== promiseTypes["delete"]) {
            if ((lastPromise.cancelCb != null) && _.isFunction(lastPromise.cancelCb) && isInProgress(lastPromise)) {
              $log.debug("promiseType: " + sniffedPromise.promiseType + ", CANCELING LAST PROMISE type: " + lastPromise.promiseType);
              lastPromise.cancelCb('cancel safe');
              first = queue.peek();
              if ((first != null) && isInProgress(first)) {
                if (first.hasOwnProperty("cancelCb") && _.isFunction(first.cancelCb)) {
                  $log.debug("promiseType: " + first.promiseType + ", CANCELING FIRST PROMISE type: " + first.promiseType);
                  return first.cancelCb('cancel safe');
                } else {
                  return $log.warn('first promise was not cancelable');
                }
              }
            }
          }
        };
        PromiseQueueManager = function(existingPiecesObj, sniffedPromise, cancelCb) {
          var lastPromise,
              newPromise;
          if (!existingPiecesObj.existingPieces) {
            existingPiecesObj.existingPieces = new uiGmapDataStructures.Queue();
            return existingPiecesObj.existingPieces.enqueue(kickPromise(sniffedPromise, cancelCb));
          } else {
            lastPromise = _.last(existingPiecesObj.existingPieces._content);
            if (doSkippPromise(sniffedPromise, lastPromise)) {
              return;
            }
            maybeCancelPromises(existingPiecesObj.existingPieces, sniffedPromise, lastPromise);
            newPromise = ExposedPromise(lastPromise["finally"](function() {
              return kickPromise(sniffedPromise, cancelCb);
            }));
            newPromise.cancelCb = cancelCb;
            newPromise.promiseType = sniffedPromise.promiseType;
            existingPiecesObj.existingPieces.enqueue(newPromise);
            return lastPromise["finally"](function() {
              return existingPiecesObj.existingPieces.dequeue();
            });
          }
        };
        managePromiseQueue = function(objectToLock, promiseType, msg, cancelCb, fnPromise) {
          var cancelLogger;
          if (msg == null) {
            msg = '';
          }
          cancelLogger = function(msg) {
            $log.debug(msg + ": " + msg);
            if ((cancelCb != null) && _.isFunction(cancelCb)) {
              return cancelCb(msg);
            }
          };
          return PromiseQueueManager(objectToLock, SniffedPromise(fnPromise, promiseType), cancelLogger);
        };
        defaultChunkSize = 80;
        errorObject = {value: null};
        tryCatch = function(fn, ctx, args) {
          var e;
          try {
            return fn.apply(ctx, args);
          } catch (_error) {
            e = _error;
            errorObject.value = e;
            return errorObject;
          }
        };
        logTryCatch = function(fn, ctx, deferred, args) {
          var msg,
              result;
          result = tryCatch(fn, ctx, args);
          if (result === errorObject) {
            msg = "error within chunking iterator: " + errorObject.value;
            $log.error(msg);
            deferred.reject(msg);
          }
          if (result === 'cancel safe') {
            return false;
          }
          return true;
        };
        _getIterateeValue = function(collection, array, index) {
          var _isArray,
              valOrKey;
          _isArray = collection === array;
          valOrKey = array[index];
          if (_isArray) {
            return valOrKey;
          }
          return collection[valOrKey];
        };
        _getArrayAndKeys = function(collection, keys, bailOutCb, cb) {
          var array;
          if (angular.isArray(collection)) {
            array = collection;
          } else {
            array = keys ? keys : Object.keys(_.omit(collection, ['length', 'forEach', 'map']));
            keys = array;
          }
          if (cb == null) {
            cb = bailOutCb;
          }
          if (angular.isArray(array) && (array === void 0 || (array != null ? array.length : void 0) <= 0)) {
            if (cb !== bailOutCb) {
              return bailOutCb();
            }
          }
          return cb(array, keys);
        };
        doChunk = function(collection, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index, _keys) {
          return _getArrayAndKeys(collection, _keys, function(array, keys) {
            var cnt,
                i,
                keepGoing,
                val;
            if (chunkSizeOrDontChunk && chunkSizeOrDontChunk < array.length) {
              cnt = chunkSizeOrDontChunk;
            } else {
              cnt = array.length;
            }
            i = index;
            keepGoing = true;
            while (keepGoing && cnt-- && i < (array ? array.length : i + 1)) {
              val = _getIterateeValue(collection, array, i);
              keepGoing = angular.isFunction(val) ? true : logTryCatch(chunkCb, void 0, overallD, [val, i]);
              ++i;
            }
            if (array) {
              if (keepGoing && i < array.length) {
                index = i;
                if (chunkSizeOrDontChunk) {
                  if ((pauseCb != null) && _.isFunction(pauseCb)) {
                    logTryCatch(pauseCb, void 0, overallD, []);
                  }
                  return $timeout(function() {
                    return doChunk(collection, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index, keys);
                  }, pauseMilli, false);
                }
              } else {
                return overallD.resolve();
              }
            }
          });
        };
        each = function(collection, chunk, chunkSizeOrDontChunk, pauseCb, index, pauseMilli, _keys) {
          var error,
              overallD,
              ret;
          if (chunkSizeOrDontChunk == null) {
            chunkSizeOrDontChunk = defaultChunkSize;
          }
          if (index == null) {
            index = 0;
          }
          if (pauseMilli == null) {
            pauseMilli = 1;
          }
          ret = void 0;
          overallD = uiGmapPromise.defer();
          ret = overallD.promise;
          if (!pauseMilli) {
            error = 'pause (delay) must be set from _async!';
            $log.error(error);
            overallD.reject(error);
            return ret;
          }
          return _getArrayAndKeys(collection, _keys, function() {
            overallD.resolve();
            return ret;
          }, function(array, keys) {
            doChunk(collection, chunkSizeOrDontChunk, pauseMilli, chunk, pauseCb, overallD, index, keys);
            return ret;
          });
        };
        map = function(collection, iterator, chunkSizeOrDontChunk, pauseCb, index, pauseMilli, _keys) {
          var results;
          results = [];
          return _getArrayAndKeys(collection, _keys, function() {
            return uiGmapPromise.resolve(results);
          }, function(array, keys) {
            return each(collection, function(o) {
              return results.push(iterator(o));
            }, chunkSizeOrDontChunk, pauseCb, index, pauseMilli, keys).then(function() {
              return results;
            });
          });
        };
        return {
          each: each,
          map: map,
          managePromiseQueue: managePromiseQueue,
          promiseLock: managePromiseQueue,
          defaultChunkSize: defaultChunkSize,
          chunkSizeFrom: function(fromSize, ret) {
            if (ret == null) {
              ret = void 0;
            }
            if (_.isNumber(fromSize)) {
              ret = fromSize;
            }
            if (uiGmapGmapUtil.isFalse(fromSize) || fromSize === false) {
              ret = false;
            }
            return ret;
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      var indexOf = [].indexOf || function(item) {
        for (var i = 0,
            l = this.length; i < l; i++) {
          if (i in this && this[i] === item)
            return i;
        }
        return -1;
      };
      angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapBaseObject', function() {
        var BaseObject,
            baseObjectKeywords;
        baseObjectKeywords = ['extended', 'included'];
        BaseObject = (function() {
          function BaseObject() {}
          BaseObject.extend = function(obj) {
            var key,
                ref,
                value;
            for (key in obj) {
              value = obj[key];
              if (indexOf.call(baseObjectKeywords, key) < 0) {
                this[key] = value;
              }
            }
            if ((ref = obj.extended) != null) {
              ref.apply(this);
            }
            return this;
          };
          BaseObject.include = function(obj) {
            var key,
                ref,
                value;
            for (key in obj) {
              value = obj[key];
              if (indexOf.call(baseObjectKeywords, key) < 0) {
                this.prototype[key] = value;
              }
            }
            if ((ref = obj.included) != null) {
              ref.apply(this);
            }
            return this;
          };
          return BaseObject;
        })();
        return BaseObject;
      });
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapChildEvents', function() {
        return {onChildCreation: function(child) {}};
      });
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapCtrlHandle', ['$q', function($q) {
        var CtrlHandle;
        return CtrlHandle = {
          handle: function($scope, $element) {
            $scope.$on('$destroy', function() {
              return CtrlHandle.handle($scope);
            });
            $scope.deferred = $q.defer();
            return {getScope: function() {
                return $scope;
              }};
          },
          mapPromise: function(scope, ctrl) {
            var mapScope;
            mapScope = ctrl.getScope();
            mapScope.deferred.promise.then(function(map) {
              return scope.map = map;
            });
            return mapScope.deferred.promise;
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps.directives.api.utils").service("uiGmapEventsHelper", ["uiGmapLogger", function($log) {
        var _getEventsObj,
            _hasEvents;
        _hasEvents = function(obj) {
          return angular.isDefined(obj.events) && (obj.events != null) && angular.isObject(obj.events);
        };
        _getEventsObj = function(scope, model) {
          if (_hasEvents(scope)) {
            return scope;
          }
          if (_hasEvents(model)) {
            return model;
          }
        };
        return {
          setEvents: function(gObject, scope, model, ignores) {
            var eventObj;
            eventObj = _getEventsObj(scope, model);
            if (eventObj != null) {
              return _.compact(_.map(eventObj.events, function(eventHandler, eventName) {
                var doIgnore;
                if (ignores) {
                  doIgnore = _(ignores).contains(eventName);
                }
                if (eventObj.events.hasOwnProperty(eventName) && angular.isFunction(eventObj.events[eventName]) && !doIgnore) {
                  return google.maps.event.addListener(gObject, eventName, function() {
                    if (!scope.$evalAsync) {
                      scope.$evalAsync = function() {};
                    }
                    return scope.$evalAsync(eventHandler.apply(scope, [gObject, eventName, model, arguments]));
                  });
                }
              }));
            }
          },
          removeEvents: function(listeners) {
            var key,
                l;
            if (!listeners) {
              return;
            }
            for (key in listeners) {
              l = listeners[key];
              if (l) {
                google.maps.event.removeListener(l);
              }
            }
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapFitHelper', ['uiGmapLogger', function($log) {
        return {fit: function(markersOrPoints, gMap) {
            var bounds,
                everSet,
                key,
                markerOrPoint,
                point;
            if (gMap && (markersOrPoints != null ? markersOrPoints.length : void 0)) {
              bounds = new google.maps.LatLngBounds();
              everSet = false;
              for (key in markersOrPoints) {
                markerOrPoint = markersOrPoints[key];
                if (markerOrPoint) {
                  if (!everSet) {
                    everSet = true;
                  }
                  point = _.isFunction(markerOrPoint.getPosition) ? markerOrPoint.getPosition() : markerOrPoint;
                }
                bounds.extend(point);
              }
              if (everSet) {
                return gMap.fitBounds(bounds);
              }
            }
          }};
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapGmapUtil', ['uiGmapLogger', '$compile', function(Logger, $compile) {
        var _isFalse,
            _isTruthy,
            getCoords,
            getLatitude,
            getLongitude,
            validateCoords;
        _isTruthy = function(value, bool, optionsArray) {
          return value === bool || optionsArray.indexOf(value) !== -1;
        };
        _isFalse = function(value) {
          return _isTruthy(value, false, ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO']);
        };
        getLatitude = function(value) {
          if (Array.isArray(value) && value.length === 2) {
            return value[1];
          } else if (angular.isDefined(value.type) && value.type === 'Point') {
            return value.coordinates[1];
          } else {
            return value.latitude;
          }
        };
        getLongitude = function(value) {
          if (Array.isArray(value) && value.length === 2) {
            return value[0];
          } else if (angular.isDefined(value.type) && value.type === 'Point') {
            return value.coordinates[0];
          } else {
            return value.longitude;
          }
        };
        getCoords = function(value) {
          if (!value) {
            return;
          }
          if (Array.isArray(value) && value.length === 2) {
            return new google.maps.LatLng(value[1], value[0]);
          } else if (angular.isDefined(value.type) && value.type === 'Point') {
            return new google.maps.LatLng(value.coordinates[1], value.coordinates[0]);
          } else {
            return new google.maps.LatLng(value.latitude, value.longitude);
          }
        };
        validateCoords = function(coords) {
          if (angular.isUndefined(coords)) {
            return false;
          }
          if (_.isArray(coords)) {
            if (coords.length === 2) {
              return true;
            }
          } else if ((coords != null) && (coords != null ? coords.type : void 0)) {
            if (coords.type === 'Point' && _.isArray(coords.coordinates) && coords.coordinates.length === 2) {
              return true;
            }
          }
          if (coords && angular.isDefined((coords != null ? coords.latitude : void 0) && angular.isDefined(coords != null ? coords.longitude : void 0))) {
            return true;
          }
          return false;
        };
        return {
          setCoordsFromEvent: function(prevValue, newLatLon) {
            if (!prevValue) {
              return;
            }
            if (Array.isArray(prevValue) && prevValue.length === 2) {
              prevValue[1] = newLatLon.lat();
              prevValue[0] = newLatLon.lng();
            } else if (angular.isDefined(prevValue.type) && prevValue.type === 'Point') {
              prevValue.coordinates[1] = newLatLon.lat();
              prevValue.coordinates[0] = newLatLon.lng();
            } else {
              prevValue.latitude = newLatLon.lat();
              prevValue.longitude = newLatLon.lng();
            }
            return prevValue;
          },
          getLabelPositionPoint: function(anchor) {
            var xPos,
                yPos;
            if (anchor === void 0) {
              return void 0;
            }
            anchor = /^([-\d\.]+)\s([-\d\.]+)$/.exec(anchor);
            xPos = parseFloat(anchor[1]);
            yPos = parseFloat(anchor[2]);
            if ((xPos != null) && (yPos != null)) {
              return new google.maps.Point(xPos, yPos);
            }
          },
          createWindowOptions: function(gMarker, scope, content, defaults) {
            var options;
            if ((content != null) && (defaults != null) && ($compile != null)) {
              options = angular.extend({}, defaults, {
                content: this.buildContent(scope, defaults, content),
                position: defaults.position != null ? defaults.position : angular.isObject(gMarker) ? gMarker.getPosition() : getCoords(scope.coords)
              });
              if ((gMarker != null) && ((options != null ? options.pixelOffset : void 0) == null)) {
                if (options.boxClass == null) {} else {
                  options.pixelOffset = {
                    height: 0,
                    width: -2
                  };
                }
              }
              return options;
            } else {
              if (!defaults) {
                Logger.error('infoWindow defaults not defined');
                if (!content) {
                  return Logger.error('infoWindow content not defined');
                }
              } else {
                return defaults;
              }
            }
          },
          buildContent: function(scope, defaults, content) {
            var parsed,
                ret;
            if (defaults.content != null) {
              ret = defaults.content;
            } else {
              if ($compile != null) {
                content = content.replace(/^\s+|\s+$/g, '');
                parsed = content === '' ? '' : $compile(content)(scope);
                if (parsed.length > 0) {
                  ret = parsed[0];
                }
              } else {
                ret = content;
              }
            }
            return ret;
          },
          defaultDelay: 50,
          isTrue: function(value) {
            return _isTruthy(value, true, ['true', 'TRUE', 1, 'y', 'Y', 'yes', 'YES']);
          },
          isFalse: _isFalse,
          isFalsy: function(value) {
            return _isTruthy(value, false, [void 0, null]) || _isFalse(value);
          },
          getCoords: getCoords,
          validateCoords: validateCoords,
          equalCoords: function(coord1, coord2) {
            return getLatitude(coord1) === getLatitude(coord2) && getLongitude(coord1) === getLongitude(coord2);
          },
          validatePath: function(path) {
            var array,
                i,
                polygon,
                trackMaxVertices;
            i = 0;
            if (angular.isUndefined(path.type)) {
              if (!Array.isArray(path) || path.length < 2) {
                return false;
              }
              while (i < path.length) {
                if (!((angular.isDefined(path[i].latitude) && angular.isDefined(path[i].longitude)) || (typeof path[i].lat === 'function' && typeof path[i].lng === 'function'))) {
                  return false;
                }
                i++;
              }
              return true;
            } else {
              if (angular.isUndefined(path.coordinates)) {
                return false;
              }
              if (path.type === 'Polygon') {
                if (path.coordinates[0].length < 4) {
                  return false;
                }
                array = path.coordinates[0];
              } else if (path.type === 'MultiPolygon') {
                trackMaxVertices = {
                  max: 0,
                  index: 0
                };
                _.forEach(path.coordinates, function(polygon, index) {
                  if (polygon[0].length > this.max) {
                    this.max = polygon[0].length;
                    return this.index = index;
                  }
                }, trackMaxVertices);
                polygon = path.coordinates[trackMaxVertices.index];
                array = polygon[0];
                if (array.length < 4) {
                  return false;
                }
              } else if (path.type === 'LineString') {
                if (path.coordinates.length < 2) {
                  return false;
                }
                array = path.coordinates;
              } else {
                return false;
              }
              while (i < array.length) {
                if (array[i].length !== 2) {
                  return false;
                }
                i++;
              }
              return true;
            }
          },
          convertPathPoints: function(path) {
            var array,
                i,
                latlng,
                result,
                trackMaxVertices;
            i = 0;
            result = new google.maps.MVCArray();
            if (angular.isUndefined(path.type)) {
              while (i < path.length) {
                latlng;
                if (angular.isDefined(path[i].latitude) && angular.isDefined(path[i].longitude)) {
                  latlng = new google.maps.LatLng(path[i].latitude, path[i].longitude);
                } else if (typeof path[i].lat === 'function' && typeof path[i].lng === 'function') {
                  latlng = path[i];
                }
                result.push(latlng);
                i++;
              }
            } else {
              array;
              if (path.type === 'Polygon') {
                array = path.coordinates[0];
              } else if (path.type === 'MultiPolygon') {
                trackMaxVertices = {
                  max: 0,
                  index: 0
                };
                _.forEach(path.coordinates, function(polygon, index) {
                  if (polygon[0].length > this.max) {
                    this.max = polygon[0].length;
                    return this.index = index;
                  }
                }, trackMaxVertices);
                array = path.coordinates[trackMaxVertices.index][0];
              } else if (path.type === 'LineString') {
                array = path.coordinates;
              }
              while (i < array.length) {
                result.push(new google.maps.LatLng(array[i][1], array[i][0]));
                i++;
              }
            }
            return result;
          },
          getPath: function(object, key) {
            var obj;
            if ((key == null) || !_.isString(key)) {
              return key;
            }
            obj = object;
            _.each(key.split('.'), function(value) {
              if (obj) {
                return obj = obj[value];
              }
            });
            return obj;
          },
          validateBoundPoints: function(bounds) {
            if (angular.isUndefined(bounds.sw.latitude) || angular.isUndefined(bounds.sw.longitude) || angular.isUndefined(bounds.ne.latitude) || angular.isUndefined(bounds.ne.longitude)) {
              return false;
            }
            return true;
          },
          convertBoundPoints: function(bounds) {
            var result;
            result = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.sw.latitude, bounds.sw.longitude), new google.maps.LatLng(bounds.ne.latitude, bounds.ne.longitude));
            return result;
          },
          fitMapBounds: function(map, bounds) {
            return map.fitBounds(bounds);
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapIsReady', ['$q', '$timeout', function($q, $timeout) {
        var _checkIfReady,
            _ctr,
            _promises,
            _proms;
        _ctr = 0;
        _proms = [];
        _promises = function() {
          return $q.all(_proms);
        };
        _checkIfReady = function(deferred, expectedInstances, retriesLeft) {
          return $timeout(function() {
            if (retriesLeft <= 0) {
              deferred.reject('Your maps are not found we have checked the maximum amount of times. :)');
              return;
            }
            if (_ctr !== expectedInstances) {
              _checkIfReady(deferred, expectedInstances, retriesLeft - 1);
            } else {
              deferred.resolve(_promises());
            }
          }, 100);
        };
        return {
          spawn: function() {
            var d;
            d = $q.defer();
            _proms.push(d.promise);
            _ctr += 1;
            return {
              instance: _ctr,
              deferred: d
            };
          },
          promises: _promises,
          instances: function() {
            return _ctr;
          },
          promise: function(expectedInstances, numRetries) {
            var d;
            if (expectedInstances == null) {
              expectedInstances = 1;
            }
            if (numRetries == null) {
              numRetries = 50;
            }
            d = $q.defer();
            _checkIfReady(d, expectedInstances, numRetries);
            return d.promise;
          },
          reset: function() {
            _ctr = 0;
            _proms.length = 0;
          },
          decrement: function() {
            if (_ctr > 0) {
              _ctr -= 1;
            }
            if (_proms.length) {
              _proms.length -= 1;
            }
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapLinked", ["uiGmapBaseObject", function(BaseObject) {
        var Linked;
        Linked = (function(superClass) {
          extend(Linked, superClass);
          function Linked(scope, element, attrs, ctrls) {
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.ctrls = ctrls;
          }
          return Linked;
        })(BaseObject);
        return Linked;
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapLogger', ['nemSimpleLogger', function(nemSimpleLogger) {
        return nemSimpleLogger.spawn();
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapModelKey', ['uiGmapBaseObject', 'uiGmapGmapUtil', 'uiGmapPromise', '$q', '$timeout', function(BaseObject, GmapUtil, uiGmapPromise, $q, $timeout) {
        var ModelKey;
        return ModelKey = (function(superClass) {
          extend(ModelKey, superClass);
          function ModelKey(scope1) {
            this.scope = scope1;
            this.modelsLength = bind(this.modelsLength, this);
            this.updateChild = bind(this.updateChild, this);
            this.destroy = bind(this.destroy, this);
            this.onDestroy = bind(this.onDestroy, this);
            this.setChildScope = bind(this.setChildScope, this);
            this.getChanges = bind(this.getChanges, this);
            this.getProp = bind(this.getProp, this);
            this.setIdKey = bind(this.setIdKey, this);
            this.modelKeyComparison = bind(this.modelKeyComparison, this);
            ModelKey.__super__.constructor.call(this);
            this["interface"] = {};
            this["interface"].scopeKeys = [];
            this.defaultIdKey = 'id';
            this.idKey = void 0;
          }
          ModelKey.prototype.evalModelHandle = function(model, modelKey) {
            if ((model == null) || (modelKey == null)) {
              return;
            }
            if (modelKey === 'self') {
              return model;
            } else {
              if (_.isFunction(modelKey)) {
                modelKey = modelKey();
              }
              return GmapUtil.getPath(model, modelKey);
            }
          };
          ModelKey.prototype.modelKeyComparison = function(model1, model2) {
            var hasCoords,
                isEqual,
                scope;
            hasCoords = _.contains(this["interface"].scopeKeys, 'coords');
            if (hasCoords && (this.scope.coords != null) || !hasCoords) {
              scope = this.scope;
            }
            if (scope == null) {
              throw 'No scope set!';
            }
            if (hasCoords) {
              isEqual = GmapUtil.equalCoords(this.scopeOrModelVal('coords', scope, model1), this.scopeOrModelVal('coords', scope, model2));
              if (!isEqual) {
                return isEqual;
              }
            }
            isEqual = _.every(_.without(this["interface"].scopeKeys, 'coords'), (function(_this) {
              return function(k) {
                return _this.scopeOrModelVal(scope[k], scope, model1) === _this.scopeOrModelVal(scope[k], scope, model2);
              };
            })(this));
            return isEqual;
          };
          ModelKey.prototype.setIdKey = function(scope) {
            return this.idKey = scope.idKey != null ? scope.idKey : this.defaultIdKey;
          };
          ModelKey.prototype.setVal = function(model, key, newValue) {
            var thingToSet;
            thingToSet = this.modelOrKey(model, key);
            thingToSet = newValue;
            return model;
          };
          ModelKey.prototype.modelOrKey = function(model, key) {
            if (key == null) {
              return;
            }
            if (key !== 'self') {
              return GmapUtil.getPath(model, key);
            }
            return model;
          };
          ModelKey.prototype.getProp = function(propName, scope, model) {
            return this.scopeOrModelVal(propName, scope, model);
          };
          ModelKey.prototype.getChanges = function(now, prev, whitelistedProps) {
            var c,
                changes,
                prop;
            if (whitelistedProps) {
              prev = _.pick(prev, whitelistedProps);
              now = _.pick(now, whitelistedProps);
            }
            changes = {};
            prop = {};
            c = {};
            for (prop in now) {
              if (!prev || prev[prop] !== now[prop]) {
                if (_.isArray(now[prop])) {
                  changes[prop] = now[prop];
                } else if (_.isObject(now[prop])) {
                  c = this.getChanges(now[prop], (prev ? prev[prop] : null));
                  if (!_.isEmpty(c)) {
                    changes[prop] = c;
                  }
                } else {
                  changes[prop] = now[prop];
                }
              }
            }
            return changes;
          };
          ModelKey.prototype.scopeOrModelVal = function(key, scope, model, doWrap) {
            var maybeWrap,
                modelKey,
                modelProp,
                scopeProp;
            if (doWrap == null) {
              doWrap = false;
            }
            maybeWrap = function(isScope, ret, doWrap) {
              if (doWrap == null) {
                doWrap = false;
              }
              if (doWrap) {
                return {
                  isScope: isScope,
                  value: ret
                };
              }
              return ret;
            };
            scopeProp = _.get(scope, key);
            if (_.isFunction(scopeProp)) {
              return maybeWrap(true, scopeProp(model), doWrap);
            }
            if (_.isObject(scopeProp)) {
              return maybeWrap(true, scopeProp, doWrap);
            }
            if (!_.isString(scopeProp)) {
              return maybeWrap(true, scopeProp, doWrap);
            }
            modelKey = scopeProp;
            if (!modelKey) {
              modelProp = _.get(model, key);
            } else {
              modelProp = modelKey === 'self' ? model : _.get(model, modelKey);
            }
            if (_.isFunction(modelProp)) {
              return maybeWrap(false, modelProp(), doWrap);
            }
            return maybeWrap(false, modelProp, doWrap);
          };
          ModelKey.prototype.setChildScope = function(keys, childScope, model) {
            var isScopeObj,
                key,
                name,
                newValue;
            for (key in keys) {
              name = keys[key];
              isScopeObj = this.scopeOrModelVal(name, childScope, model, true);
              if ((isScopeObj != null ? isScopeObj.value : void 0) != null) {
                newValue = isScopeObj.value;
                if (newValue !== childScope[name]) {
                  childScope[name] = newValue;
                }
              }
            }
            return childScope.model = model;
          };
          ModelKey.prototype.onDestroy = function(scope) {};
          ModelKey.prototype.destroy = function(manualOverride) {
            var ref;
            if (manualOverride == null) {
              manualOverride = false;
            }
            if ((this.scope != null) && !((ref = this.scope) != null ? ref.$$destroyed : void 0) && (this.needToManualDestroy || manualOverride)) {
              return this.scope.$destroy();
            } else {
              return this.clean();
            }
          };
          ModelKey.prototype.updateChild = function(child, model) {
            if (model[this.idKey] == null) {
              this.$log.error("Model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.");
              return;
            }
            return child.updateModel(model);
          };
          ModelKey.prototype.modelsLength = function(arrayOrObjModels) {
            var len,
                toCheck;
            if (arrayOrObjModels == null) {
              arrayOrObjModels = void 0;
            }
            len = 0;
            toCheck = arrayOrObjModels ? arrayOrObjModels : this.scope.models;
            if (toCheck == null) {
              return len;
            }
            if (angular.isArray(toCheck) || (toCheck.length != null)) {
              len = toCheck.length;
            } else {
              len = Object.keys(toCheck).length;
            }
            return len;
          };
          return ModelKey;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').factory('uiGmapModelsWatcher', ['uiGmapLogger', 'uiGmap_async', '$q', 'uiGmapPromise', function(Logger, _async, $q, uiGmapPromise) {
        return {
          didQueueInitPromise: function(existingPiecesObj, scope) {
            if (scope.models.length === 0) {
              _async.promiseLock(existingPiecesObj, uiGmapPromise.promiseTypes.init, null, null, ((function(_this) {
                return function() {
                  return uiGmapPromise.resolve();
                };
              })(this)));
              return true;
            }
            return false;
          },
          figureOutState: function(idKey, scope, childObjects, comparison, callBack) {
            var adds,
                children,
                mappedScopeModelIds,
                removals,
                updates;
            adds = [];
            mappedScopeModelIds = {};
            removals = [];
            updates = [];
            scope.models.forEach(function(m) {
              var child;
              if (m[idKey] != null) {
                mappedScopeModelIds[m[idKey]] = {};
                if (childObjects.get(m[idKey]) == null) {
                  return adds.push(m);
                } else {
                  child = childObjects.get(m[idKey]);
                  if (!comparison(m, child.clonedModel, scope)) {
                    return updates.push({
                      model: m,
                      child: child
                    });
                  }
                }
              } else {
                return Logger.error(' id missing for model #{m.toString()},\ncan not use do comparison/insertion');
              }
            });
            children = childObjects.values();
            children.forEach(function(c) {
              var id;
              if (c == null) {
                Logger.error('child undefined in ModelsWatcher.');
                return;
              }
              if (c.model == null) {
                Logger.error('child.model undefined in ModelsWatcher.');
                return;
              }
              id = c.model[idKey];
              if (mappedScopeModelIds[id] == null) {
                return removals.push(c);
              }
            });
            return {
              adds: adds,
              removals: removals,
              updates: updates
            };
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.utils').service('uiGmapPromise', ['$q', '$timeout', 'uiGmapLogger', function($q, $timeout, $log) {
        var ExposedPromise,
            SniffedPromise,
            defer,
            isInProgress,
            isResolved,
            promise,
            promiseStatus,
            promiseStatuses,
            promiseTypes,
            resolve,
            strPromiseStatuses;
        promiseTypes = {
          create: 'create',
          update: 'update',
          "delete": 'delete',
          init: 'init'
        };
        promiseStatuses = {
          IN_PROGRESS: 0,
          RESOLVED: 1,
          REJECTED: 2
        };
        strPromiseStatuses = (function() {
          var obj;
          obj = {};
          obj["" + promiseStatuses.IN_PROGRESS] = 'in-progress';
          obj["" + promiseStatuses.RESOLVED] = 'resolved';
          obj["" + promiseStatuses.REJECTED] = 'rejected';
          return obj;
        })();
        isInProgress = function(promise) {
          if (promise.$$state) {
            return promise.$$state.status === promiseStatuses.IN_PROGRESS;
          }
          if (!promise.hasOwnProperty("$$v")) {
            return true;
          }
        };
        isResolved = function(promise) {
          if (promise.$$state) {
            return promise.$$state.status === promiseStatuses.RESOLVED;
          }
          if (promise.hasOwnProperty("$$v")) {
            return true;
          }
        };
        promiseStatus = function(status) {
          return strPromiseStatuses[status] || 'done w error';
        };
        ExposedPromise = function(promise) {
          var cancelDeferred,
              combined,
              wrapped;
          cancelDeferred = $q.defer();
          combined = $q.all([promise, cancelDeferred.promise]);
          wrapped = $q.defer();
          promise.then(cancelDeferred.resolve, (function() {}), function(notify) {
            cancelDeferred.notify(notify);
            return wrapped.notify(notify);
          });
          combined.then(function(successes) {
            return wrapped.resolve(successes[0] || successes[1]);
          }, function(error) {
            return wrapped.reject(error);
          });
          wrapped.promise.cancel = function(reason) {
            if (reason == null) {
              reason = 'canceled';
            }
            return cancelDeferred.reject(reason);
          };
          wrapped.promise.notify = function(msg) {
            if (msg == null) {
              msg = 'cancel safe';
            }
            wrapped.notify(msg);
            if (promise.hasOwnProperty('notify')) {
              return promise.notify(msg);
            }
          };
          if (promise.promiseType != null) {
            wrapped.promise.promiseType = promise.promiseType;
          }
          return wrapped.promise;
        };
        SniffedPromise = function(fnPromise, promiseType) {
          return {
            promise: fnPromise,
            promiseType: promiseType
          };
        };
        defer = function() {
          return $q.defer();
        };
        resolve = function() {
          var d;
          d = $q.defer();
          d.resolve.apply(void 0, arguments);
          return d.promise;
        };
        promise = function(fnToWrap) {
          var d;
          if (!_.isFunction(fnToWrap)) {
            $log.error("uiGmapPromise.promise() only accepts functions");
            return;
          }
          d = $q.defer();
          $timeout(function() {
            var result;
            result = fnToWrap();
            return d.resolve(result);
          });
          return d.promise;
        };
        return {
          defer: defer,
          promise: promise,
          resolve: resolve,
          promiseTypes: promiseTypes,
          isInProgress: isInProgress,
          isResolved: isResolved,
          promiseStatus: promiseStatus,
          ExposedPromise: ExposedPromise,
          SniffedPromise: SniffedPromise
        };
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      };
      angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapPropMap", function() {
        var PropMap;
        return PropMap = (function() {
          function PropMap() {
            this.removeAll = bind(this.removeAll, this);
            this.slice = bind(this.slice, this);
            this.push = bind(this.push, this);
            this.keys = bind(this.keys, this);
            this.values = bind(this.values, this);
            this.remove = bind(this.remove, this);
            this.put = bind(this.put, this);
            this.stateChanged = bind(this.stateChanged, this);
            this.get = bind(this.get, this);
            this.length = 0;
            this.dict = {};
            this.didValsStateChange = false;
            this.didKeysStateChange = false;
            this.allVals = [];
            this.allKeys = [];
          }
          PropMap.prototype.get = function(key) {
            return this.dict[key];
          };
          PropMap.prototype.stateChanged = function() {
            this.didValsStateChange = true;
            return this.didKeysStateChange = true;
          };
          PropMap.prototype.put = function(key, value) {
            if (this.get(key) == null) {
              this.length++;
            }
            this.stateChanged();
            return this.dict[key] = value;
          };
          PropMap.prototype.remove = function(key, isSafe) {
            var value;
            if (isSafe == null) {
              isSafe = false;
            }
            if (isSafe && !this.get(key)) {
              return void 0;
            }
            value = this.dict[key];
            delete this.dict[key];
            this.length--;
            this.stateChanged();
            return value;
          };
          PropMap.prototype.valuesOrKeys = function(str) {
            var keys,
                vals;
            if (str == null) {
              str = 'Keys';
            }
            if (!this["did" + str + "StateChange"]) {
              return this['all' + str];
            }
            vals = [];
            keys = [];
            _.each(this.dict, function(v, k) {
              vals.push(v);
              return keys.push(k);
            });
            this.didKeysStateChange = false;
            this.didValsStateChange = false;
            this.allVals = vals;
            this.allKeys = keys;
            return this['all' + str];
          };
          PropMap.prototype.values = function() {
            return this.valuesOrKeys('Vals');
          };
          PropMap.prototype.keys = function() {
            return this.valuesOrKeys();
          };
          PropMap.prototype.push = function(obj, key) {
            if (key == null) {
              key = "key";
            }
            return this.put(obj[key], obj);
          };
          PropMap.prototype.slice = function() {
            return this.keys().map((function(_this) {
              return function(k) {
                return _this.remove(k);
              };
            })(this));
          };
          PropMap.prototype.removeAll = function() {
            return this.slice();
          };
          PropMap.prototype.each = function(cb) {
            return _.each(this.dict, function(v, k) {
              return cb(v);
            });
          };
          PropMap.prototype.map = function(cb) {
            return _.map(this.dict, function(v, k) {
              return cb(v);
            });
          };
          return PropMap;
        })();
      });
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapPropertyAction", ["uiGmapLogger", function(Logger) {
        var PropertyAction;
        PropertyAction = function(setterFn) {
          this.setIfChange = function(newVal, oldVal) {
            var callingKey;
            callingKey = this.exp;
            if (!_.isEqual(oldVal, newVal)) {
              return setterFn(callingKey, newVal);
            }
          };
          this.sic = this.setIfChange;
          return this;
        };
        return PropertyAction;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      };
      angular.module('uiGmapgoogle-maps.directives.api.managers').factory('uiGmapClustererMarkerManager', ['uiGmapLogger', 'uiGmapFitHelper', 'uiGmapPropMap', 'uiGmapEventsHelper', function($log, FitHelper, PropMap, EventsHelper) {
        var ClustererMarkerManager;
        ClustererMarkerManager = (function() {
          ClustererMarkerManager.type = 'ClustererMarkerManager';
          function ClustererMarkerManager(gMap, opt_markers, opt_options, opt_events) {
            if (opt_markers == null) {
              opt_markers = {};
            }
            this.opt_options = opt_options != null ? opt_options : {};
            this.opt_events = opt_events;
            this.checkSync = bind(this.checkSync, this);
            this.getGMarkers = bind(this.getGMarkers, this);
            this.fit = bind(this.fit, this);
            this.destroy = bind(this.destroy, this);
            this.attachEvents = bind(this.attachEvents, this);
            this.clear = bind(this.clear, this);
            this.draw = bind(this.draw, this);
            this.removeMany = bind(this.removeMany, this);
            this.remove = bind(this.remove, this);
            this.addMany = bind(this.addMany, this);
            this.update = bind(this.update, this);
            this.add = bind(this.add, this);
            this.type = ClustererMarkerManager.type;
            this.clusterer = new NgMapMarkerClusterer(gMap, opt_markers, this.opt_options);
            this.propMapGMarkers = new PropMap();
            this.attachEvents(this.opt_events, 'opt_events');
            this.clusterer.setIgnoreHidden(true);
            this.noDrawOnSingleAddRemoves = true;
            $log.info(this);
          }
          ClustererMarkerManager.prototype.checkKey = function(gMarker) {
            var msg;
            if (gMarker.key == null) {
              msg = 'gMarker.key undefined and it is REQUIRED!!';
              return $log.error(msg);
            }
          };
          ClustererMarkerManager.prototype.add = function(gMarker) {
            this.checkKey(gMarker);
            this.clusterer.addMarker(gMarker, this.noDrawOnSingleAddRemoves);
            this.propMapGMarkers.put(gMarker.key, gMarker);
            return this.checkSync();
          };
          ClustererMarkerManager.prototype.update = function(gMarker) {
            this.remove(gMarker);
            return this.add(gMarker);
          };
          ClustererMarkerManager.prototype.addMany = function(gMarkers) {
            return gMarkers.forEach((function(_this) {
              return function(gMarker) {
                return _this.add(gMarker);
              };
            })(this));
          };
          ClustererMarkerManager.prototype.remove = function(gMarker) {
            var exists;
            this.checkKey(gMarker);
            exists = this.propMapGMarkers.get(gMarker.key);
            if (exists) {
              this.clusterer.removeMarker(gMarker, this.noDrawOnSingleAddRemoves);
              this.propMapGMarkers.remove(gMarker.key);
            }
            return this.checkSync();
          };
          ClustererMarkerManager.prototype.removeMany = function(gMarkers) {
            return gMarkers.forEach((function(_this) {
              return function(gMarker) {
                return _this.remove(gMarker);
              };
            })(this));
          };
          ClustererMarkerManager.prototype.draw = function() {
            return this.clusterer.repaint();
          };
          ClustererMarkerManager.prototype.clear = function() {
            this.removeMany(this.getGMarkers());
            return this.clusterer.repaint();
          };
          ClustererMarkerManager.prototype.attachEvents = function(options, optionsName) {
            var eventHandler,
                eventName,
                results;
            this.listeners = [];
            if (angular.isDefined(options) && (options != null) && angular.isObject(options)) {
              results = [];
              for (eventName in options) {
                eventHandler = options[eventName];
                if (options.hasOwnProperty(eventName) && angular.isFunction(options[eventName])) {
                  $log.info(optionsName + ": Attaching event: " + eventName + " to clusterer");
                  results.push(this.listeners.push(google.maps.event.addListener(this.clusterer, eventName, options[eventName])));
                } else {
                  results.push(void 0);
                }
              }
              return results;
            }
          };
          ClustererMarkerManager.prototype.clearEvents = function() {
            EventsHelper.removeEvents(this.listeners);
            return this.listeners = [];
          };
          ClustererMarkerManager.prototype.destroy = function() {
            this.clearEvents();
            return this.clear();
          };
          ClustererMarkerManager.prototype.fit = function() {
            return FitHelper.fit(this.getGMarkers(), this.clusterer.getMap());
          };
          ClustererMarkerManager.prototype.getGMarkers = function() {
            return this.clusterer.getMarkers().values();
          };
          ClustererMarkerManager.prototype.checkSync = function() {};
          return ClustererMarkerManager;
        })();
        return ClustererMarkerManager;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      };
      angular.module("uiGmapgoogle-maps.directives.api.managers").factory("uiGmapMarkerManager", ["uiGmapLogger", "uiGmapFitHelper", "uiGmapPropMap", function(Logger, FitHelper, PropMap) {
        var MarkerManager;
        MarkerManager = (function() {
          MarkerManager.type = 'MarkerManager';
          function MarkerManager(gMap, opt_markers, opt_options) {
            this.getGMarkers = bind(this.getGMarkers, this);
            this.fit = bind(this.fit, this);
            this.handleOptDraw = bind(this.handleOptDraw, this);
            this.clear = bind(this.clear, this);
            this.destroy = bind(this.destroy, this);
            this.draw = bind(this.draw, this);
            this.removeMany = bind(this.removeMany, this);
            this.remove = bind(this.remove, this);
            this.addMany = bind(this.addMany, this);
            this.update = bind(this.update, this);
            this.add = bind(this.add, this);
            this.type = MarkerManager.type;
            this.gMap = gMap;
            this.gMarkers = new PropMap();
            this.$log = Logger;
            this.$log.info(this);
          }
          MarkerManager.prototype.add = function(gMarker, optDraw) {
            var exists,
                msg;
            if (optDraw == null) {
              optDraw = true;
            }
            if (gMarker.key == null) {
              msg = "gMarker.key undefined and it is REQUIRED!!";
              Logger.error(msg);
              throw msg;
            }
            exists = this.gMarkers.get(gMarker.key);
            if (!exists) {
              this.handleOptDraw(gMarker, optDraw, true);
              return this.gMarkers.put(gMarker.key, gMarker);
            }
          };
          MarkerManager.prototype.update = function(gMarker, optDraw) {
            if (optDraw == null) {
              optDraw = true;
            }
            this.remove(gMarker, optDraw);
            return this.add(gMarker, optDraw);
          };
          MarkerManager.prototype.addMany = function(gMarkers) {
            return gMarkers.forEach((function(_this) {
              return function(gMarker) {
                return _this.add(gMarker);
              };
            })(this));
          };
          MarkerManager.prototype.remove = function(gMarker, optDraw) {
            if (optDraw == null) {
              optDraw = true;
            }
            this.handleOptDraw(gMarker, optDraw, false);
            if (this.gMarkers.get(gMarker.key)) {
              return this.gMarkers.remove(gMarker.key);
            }
          };
          MarkerManager.prototype.removeMany = function(gMarkers) {
            return gMarkers.forEach((function(_this) {
              return function(marker) {
                return _this.remove(marker);
              };
            })(this));
          };
          MarkerManager.prototype.draw = function() {
            var deletes;
            deletes = [];
            this.gMarkers.each((function(_this) {
              return function(gMarker) {
                if (!gMarker.isDrawn) {
                  if (gMarker.doAdd) {
                    gMarker.setMap(_this.gMap);
                    return gMarker.isDrawn = true;
                  } else {
                    return deletes.push(gMarker);
                  }
                }
              };
            })(this));
            return deletes.forEach((function(_this) {
              return function(gMarker) {
                gMarker.isDrawn = false;
                return _this.remove(gMarker, true);
              };
            })(this));
          };
          MarkerManager.prototype.destroy = function() {
            return this.clear();
          };
          MarkerManager.prototype.clear = function() {
            this.gMarkers.each(function(gMarker) {
              return gMarker.setMap(null);
            });
            delete this.gMarkers;
            return this.gMarkers = new PropMap();
          };
          MarkerManager.prototype.handleOptDraw = function(gMarker, optDraw, doAdd) {
            if (optDraw === true) {
              if (doAdd) {
                gMarker.setMap(this.gMap);
              } else {
                gMarker.setMap(null);
              }
              return gMarker.isDrawn = true;
            } else {
              gMarker.isDrawn = false;
              return gMarker.doAdd = doAdd;
            }
          };
          MarkerManager.prototype.fit = function() {
            return FitHelper.fit(this.getGMarkers(), this.gMap);
          };
          MarkerManager.prototype.getGMarkers = function() {
            return this.gMarkers.values();
          };
          return MarkerManager;
        })();
        return MarkerManager;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      };
      angular.module('uiGmapgoogle-maps.directives.api.managers').factory('uiGmapSpiderfierMarkerManager', ['uiGmapLogger', 'uiGmapFitHelper', 'uiGmapPropMap', 'uiGmapMarkerSpiderfier', function($log, FitHelper, PropMap, MarkerSpiderfier) {
        var SpiderfierMarkerManager;
        return SpiderfierMarkerManager = (function() {
          SpiderfierMarkerManager.type = 'SpiderfierMarkerManager';
          function SpiderfierMarkerManager(gMap, opt_markers, opt_options, opt_events, scope) {
            if (opt_markers == null) {
              opt_markers = {};
            }
            this.opt_options = opt_options != null ? opt_options : {};
            this.opt_events = opt_events;
            this.scope = scope;
            this.checkSync = bind(this.checkSync, this);
            this.isSpiderfied = bind(this.isSpiderfied, this);
            this.getGMarkers = bind(this.getGMarkers, this);
            this.fit = bind(this.fit, this);
            this.destroy = bind(this.destroy, this);
            this.attachEvents = bind(this.attachEvents, this);
            this.clear = bind(this.clear, this);
            this.draw = bind(this.draw, this);
            this.removeMany = bind(this.removeMany, this);
            this.remove = bind(this.remove, this);
            this.addMany = bind(this.addMany, this);
            this.update = bind(this.update, this);
            this.add = bind(this.add, this);
            this.type = SpiderfierMarkerManager.type;
            this.markerSpiderfier = new MarkerSpiderfier(gMap, this.opt_options);
            this.propMapGMarkers = new PropMap();
            this.attachEvents(this.opt_events, 'opt_events');
            this.noDrawOnSingleAddRemoves = true;
            $log.info(this);
          }
          SpiderfierMarkerManager.prototype.checkKey = function(gMarker) {
            var msg;
            if (gMarker.key == null) {
              msg = 'gMarker.key undefined and it is REQUIRED!!';
              return $log.error(msg);
            }
          };
          SpiderfierMarkerManager.prototype.add = function(gMarker) {
            gMarker.setMap(this.markerSpiderfier.map);
            this.checkKey(gMarker);
            this.markerSpiderfier.addMarker(gMarker, this.noDrawOnSingleAddRemoves);
            this.propMapGMarkers.put(gMarker.key, gMarker);
            return this.checkSync();
          };
          SpiderfierMarkerManager.prototype.update = function(gMarker) {
            this.remove(gMarker);
            return this.add(gMarker);
          };
          SpiderfierMarkerManager.prototype.addMany = function(gMarkers) {
            return gMarkers.forEach((function(_this) {
              return function(gMarker) {
                return _this.add(gMarker);
              };
            })(this));
          };
          SpiderfierMarkerManager.prototype.remove = function(gMarker) {
            var exists;
            this.checkKey(gMarker);
            exists = this.propMapGMarkers.get(gMarker.key);
            if (exists) {
              gMarker.setMap(null);
              this.markerSpiderfier.removeMarker(gMarker, this.noDrawOnSingleAddRemoves);
              this.propMapGMarkers.remove(gMarker.key);
            }
            return this.checkSync();
          };
          SpiderfierMarkerManager.prototype.removeMany = function(gMarkers) {
            return gMarkers.forEach((function(_this) {
              return function(gMarker) {
                return _this.remove(gMarker);
              };
            })(this));
          };
          SpiderfierMarkerManager.prototype.draw = function() {};
          SpiderfierMarkerManager.prototype.clear = function() {
            return this.removeMany(this.getGMarkers());
          };
          SpiderfierMarkerManager.prototype.attachEvents = function(options, optionsName) {
            if (angular.isDefined(options) && (options != null) && angular.isObject(options)) {
              return _.each(options, (function(_this) {
                return function(eventHandler, eventName) {
                  if (options.hasOwnProperty(eventName) && angular.isFunction(options[eventName])) {
                    $log.info(optionsName + ": Attaching event: " + eventName + " to markerSpiderfier");
                    return _this.markerSpiderfier.addListener(eventName, function() {
                      if (eventName === 'spiderfy' || eventName === 'unspiderfy') {
                        return _this.scope.$evalAsync(options[eventName].apply(options, arguments));
                      } else {
                        return _this.scope.$evalAsync(options[eventName].apply(options, [arguments[0], eventName, arguments[0].model, arguments]));
                      }
                    });
                  }
                };
              })(this));
            }
          };
          SpiderfierMarkerManager.prototype.clearEvents = function(options, optionsName) {
            var eventHandler,
                eventName;
            if (angular.isDefined(options) && (options != null) && angular.isObject(options)) {
              for (eventName in options) {
                eventHandler = options[eventName];
                if (options.hasOwnProperty(eventName) && angular.isFunction(options[eventName])) {
                  $log.info(optionsName + ": Clearing event: " + eventName + " to markerSpiderfier");
                  this.markerSpiderfier.clearListeners(eventName);
                }
              }
            }
          };
          SpiderfierMarkerManager.prototype.destroy = function() {
            this.clearEvents(this.opt_events, 'opt_events');
            return this.clear();
          };
          SpiderfierMarkerManager.prototype.fit = function() {
            return FitHelper.fit(this.getGMarkers(), this.markerSpiderfier.map);
          };
          SpiderfierMarkerManager.prototype.getGMarkers = function() {
            return this.markerSpiderfier.getMarkers();
          };
          SpiderfierMarkerManager.prototype.isSpiderfied = function() {
            return _.find(this.getGMarkers(), function(gMarker) {
              return (gMarker != null ? gMarker._omsData : void 0) != null;
            });
          };
          SpiderfierMarkerManager.prototype.checkSync = function() {};
          return SpiderfierMarkerManager;
        })();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').factory('uiGmapadd-events', ['$timeout', function($timeout) {
        var addEvent,
            addEvents;
        addEvent = function(target, eventName, handler) {
          return google.maps.event.addListener(target, eventName, function() {
            handler.apply(this, arguments);
            return $timeout((function() {}), true);
          });
        };
        addEvents = function(target, eventName, handler) {
          var remove;
          if (handler) {
            return addEvent(target, eventName, handler);
          }
          remove = [];
          angular.forEach(eventName, function(_handler, key) {
            return remove.push(addEvent(target, key, _handler));
          });
          return function() {
            angular.forEach(remove, function(listener) {
              return google.maps.event.removeListener(listener);
            });
            return remove = null;
          };
        };
        return addEvents;
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').factory('uiGmaparray-sync', ['uiGmapadd-events', function(mapEvents) {
        return function(mapArray, scope, pathEval, pathChangedFn) {
          var geojsonArray,
              geojsonHandlers,
              geojsonWatcher,
              isSetFromScope,
              legacyHandlers,
              legacyWatcher,
              mapArrayListener,
              scopePath,
              watchListener;
          isSetFromScope = false;
          scopePath = scope.$eval(pathEval);
          if (!scope["static"]) {
            legacyHandlers = {
              set_at: function(index) {
                var value;
                if (isSetFromScope) {
                  return;
                }
                value = mapArray.getAt(index);
                if (!value) {
                  return;
                }
                if (!value.lng || !value.lat) {
                  return scopePath[index] = value;
                } else {
                  scopePath[index].latitude = value.lat();
                  return scopePath[index].longitude = value.lng();
                }
              },
              insert_at: function(index) {
                var value;
                if (isSetFromScope) {
                  return;
                }
                value = mapArray.getAt(index);
                if (!value) {
                  return;
                }
                if (!value.lng || !value.lat) {
                  return scopePath.splice(index, 0, value);
                } else {
                  return scopePath.splice(index, 0, {
                    latitude: value.lat(),
                    longitude: value.lng()
                  });
                }
              },
              remove_at: function(index) {
                if (isSetFromScope) {
                  return;
                }
                return scopePath.splice(index, 1);
              }
            };
            geojsonArray;
            if (scopePath.type === 'Polygon') {
              geojsonArray = scopePath.coordinates[0];
            } else if (scopePath.type === 'LineString') {
              geojsonArray = scopePath.coordinates;
            }
            geojsonHandlers = {
              set_at: function(index) {
                var value;
                if (isSetFromScope) {
                  return;
                }
                value = mapArray.getAt(index);
                if (!value) {
                  return;
                }
                if (!value.lng || !value.lat) {
                  return;
                }
                geojsonArray[index][1] = value.lat();
                return geojsonArray[index][0] = value.lng();
              },
              insert_at: function(index) {
                var value;
                if (isSetFromScope) {
                  return;
                }
                value = mapArray.getAt(index);
                if (!value) {
                  return;
                }
                if (!value.lng || !value.lat) {
                  return;
                }
                return geojsonArray.splice(index, 0, [value.lng(), value.lat()]);
              },
              remove_at: function(index) {
                if (isSetFromScope) {
                  return;
                }
                return geojsonArray.splice(index, 1);
              }
            };
            mapArrayListener = mapEvents(mapArray, angular.isUndefined(scopePath.type) ? legacyHandlers : geojsonHandlers);
          }
          legacyWatcher = function(newPath) {
            var changed,
                i,
                l,
                newLength,
                newValue,
                oldArray,
                oldLength,
                oldValue;
            isSetFromScope = true;
            oldArray = mapArray;
            changed = false;
            if (newPath) {
              i = 0;
              oldLength = oldArray.getLength();
              newLength = newPath.length;
              l = Math.min(oldLength, newLength);
              newValue = void 0;
              while (i < l) {
                oldValue = oldArray.getAt(i);
                newValue = newPath[i];
                if (typeof newValue.equals === 'function') {
                  if (!newValue.equals(oldValue)) {
                    oldArray.setAt(i, newValue);
                    changed = true;
                  }
                } else {
                  if ((oldValue.lat() !== newValue.latitude) || (oldValue.lng() !== newValue.longitude)) {
                    oldArray.setAt(i, new google.maps.LatLng(newValue.latitude, newValue.longitude));
                    changed = true;
                  }
                }
                i++;
              }
              while (i < newLength) {
                newValue = newPath[i];
                if (typeof newValue.lat === 'function' && typeof newValue.lng === 'function') {
                  oldArray.push(newValue);
                } else {
                  oldArray.push(new google.maps.LatLng(newValue.latitude, newValue.longitude));
                }
                changed = true;
                i++;
              }
              while (i < oldLength) {
                oldArray.pop();
                changed = true;
                i++;
              }
            }
            isSetFromScope = false;
            if (changed) {
              return pathChangedFn(oldArray);
            }
          };
          geojsonWatcher = function(newPath) {
            var array,
                changed,
                i,
                l,
                newLength,
                newValue,
                oldArray,
                oldLength,
                oldValue;
            isSetFromScope = true;
            oldArray = mapArray;
            changed = false;
            if (newPath) {
              array;
              if (scopePath.type === 'Polygon') {
                array = newPath.coordinates[0];
              } else if (scopePath.type === 'LineString') {
                array = newPath.coordinates;
              }
              i = 0;
              oldLength = oldArray.getLength();
              newLength = array.length;
              l = Math.min(oldLength, newLength);
              newValue = void 0;
              while (i < l) {
                oldValue = oldArray.getAt(i);
                newValue = array[i];
                if ((oldValue.lat() !== newValue[1]) || (oldValue.lng() !== newValue[0])) {
                  oldArray.setAt(i, new google.maps.LatLng(newValue[1], newValue[0]));
                  changed = true;
                }
                i++;
              }
              while (i < newLength) {
                newValue = array[i];
                oldArray.push(new google.maps.LatLng(newValue[1], newValue[0]));
                changed = true;
                i++;
              }
              while (i < oldLength) {
                oldArray.pop();
                changed = true;
                i++;
              }
            }
            isSetFromScope = false;
            if (changed) {
              return pathChangedFn(oldArray);
            }
          };
          watchListener;
          if (!scope["static"]) {
            if (angular.isUndefined(scopePath.type)) {
              watchListener = scope.$watchCollection(pathEval, legacyWatcher);
            } else {
              watchListener = scope.$watch(pathEval, geojsonWatcher, true);
            }
          }
          return function() {
            if (mapArrayListener) {
              mapArrayListener();
              mapArrayListener = null;
            }
            if (watchListener) {
              watchListener();
              return watchListener = null;
            }
          };
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps.directives.api.utils").factory("uiGmapChromeFixes", ['$timeout', function($timeout) {
        return {maybeRepaint: function(el) {
            if (el) {
              el.style.opacity = 0.9;
              return $timeout(function() {
                return el.style.opacity = 1;
              });
            }
          }};
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').service('uiGmapObjectIterators', function() {
        var _ignores,
            _iterators,
            _slapForEach,
            _slapMap;
        _ignores = ['length', 'forEach', 'map'];
        _iterators = [];
        _slapForEach = function(object) {
          object.forEach = function(cb) {
            return _.each(_.omit(object, _ignores), function(val) {
              if (!_.isFunction(val)) {
                return cb(val);
              }
            });
          };
          return object;
        };
        _iterators.push(_slapForEach);
        _slapMap = function(object) {
          object.map = function(cb) {
            return _.map(_.omit(object, _ignores), function(val) {
              if (!_.isFunction(val)) {
                return cb(val);
              }
            });
          };
          return object;
        };
        _iterators.push(_slapMap);
        return {
          slapMap: _slapMap,
          slapForEach: _slapForEach,
          slapAll: function(object) {
            _iterators.forEach(function(it) {
              return it(object);
            });
            return object;
          }
        };
      });
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.options.builders').service('uiGmapCommonOptionsBuilder', ['uiGmapBaseObject', 'uiGmapLogger', 'uiGmapModelKey', function(BaseObject, $log, ModelKey) {
        var CommonOptionsBuilder;
        return CommonOptionsBuilder = (function(superClass) {
          extend(CommonOptionsBuilder, superClass);
          function CommonOptionsBuilder() {
            this.watchProps = bind(this.watchProps, this);
            this.buildOpts = bind(this.buildOpts, this);
            return CommonOptionsBuilder.__super__.constructor.apply(this, arguments);
          }
          CommonOptionsBuilder.prototype.props = ['clickable', 'draggable', 'editable', 'visible', {
            prop: 'stroke',
            isColl: true
          }];
          CommonOptionsBuilder.prototype.getCorrectModel = function(scope) {
            if (angular.isDefined(scope != null ? scope.model : void 0)) {
              return scope.model;
            } else {
              return scope;
            }
          };
          CommonOptionsBuilder.prototype.buildOpts = function(customOpts, cachedEval, forEachOpts) {
            var model,
                opts,
                stroke;
            if (customOpts == null) {
              customOpts = {};
            }
            if (forEachOpts == null) {
              forEachOpts = {};
            }
            if (!this.scope) {
              $log.error('this.scope not defined in CommonOptionsBuilder can not buildOpts');
              return;
            }
            if (!this.map) {
              $log.error('this.map not defined in CommonOptionsBuilder can not buildOpts');
              return;
            }
            model = this.getCorrectModel(this.scope);
            stroke = this.scopeOrModelVal('stroke', this.scope, model);
            opts = angular.extend(customOpts, this.DEFAULTS, {
              map: this.map,
              strokeColor: stroke != null ? stroke.color : void 0,
              strokeOpacity: stroke != null ? stroke.opacity : void 0,
              strokeWeight: stroke != null ? stroke.weight : void 0
            });
            angular.forEach(angular.extend(forEachOpts, {
              clickable: true,
              draggable: false,
              editable: false,
              "static": false,
              fit: false,
              visible: true,
              zIndex: 0,
              icons: []
            }), (function(_this) {
              return function(defaultValue, key) {
                var val;
                val = cachedEval ? cachedEval[key] : _this.scopeOrModelVal(key, _this.scope, model);
                if (angular.isUndefined(val)) {
                  return opts[key] = defaultValue;
                } else {
                  return opts[key] = model[key];
                }
              };
            })(this));
            if (opts["static"]) {
              opts.editable = false;
            }
            return opts;
          };
          CommonOptionsBuilder.prototype.watchProps = function(props) {
            if (props == null) {
              props = this.props;
            }
            return props.forEach((function(_this) {
              return function(prop) {
                if ((_this.attrs[prop] != null) || (_this.attrs[prop != null ? prop.prop : void 0] != null)) {
                  if (prop != null ? prop.isColl : void 0) {
                    return _this.scope.$watchCollection(prop.prop, _this.setMyOptions);
                  } else {
                    return _this.scope.$watch(prop, _this.setMyOptions);
                  }
                }
              };
            })(this));
          };
          return CommonOptionsBuilder;
        })(ModelKey);
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.options.builders').factory('uiGmapPolylineOptionsBuilder', ['uiGmapCommonOptionsBuilder', function(CommonOptionsBuilder) {
        var PolylineOptionsBuilder;
        return PolylineOptionsBuilder = (function(superClass) {
          extend(PolylineOptionsBuilder, superClass);
          function PolylineOptionsBuilder() {
            return PolylineOptionsBuilder.__super__.constructor.apply(this, arguments);
          }
          PolylineOptionsBuilder.prototype.buildOpts = function(pathPoints, cachedEval) {
            return PolylineOptionsBuilder.__super__.buildOpts.call(this, {path: pathPoints}, cachedEval, {geodesic: false});
          };
          return PolylineOptionsBuilder;
        })(CommonOptionsBuilder);
      }]).factory('uiGmapShapeOptionsBuilder', ['uiGmapCommonOptionsBuilder', function(CommonOptionsBuilder) {
        var ShapeOptionsBuilder;
        return ShapeOptionsBuilder = (function(superClass) {
          extend(ShapeOptionsBuilder, superClass);
          function ShapeOptionsBuilder() {
            return ShapeOptionsBuilder.__super__.constructor.apply(this, arguments);
          }
          ShapeOptionsBuilder.prototype.buildOpts = function(customOpts, cachedEval, forEachOpts) {
            var fill,
                model;
            model = this.getCorrectModel(this.scope);
            fill = cachedEval ? cachedEval['fill'] : this.scopeOrModelVal('fill', this.scope, model);
            customOpts = angular.extend(customOpts, {
              fillColor: fill != null ? fill.color : void 0,
              fillOpacity: fill != null ? fill.opacity : void 0
            });
            return ShapeOptionsBuilder.__super__.buildOpts.call(this, customOpts, cachedEval, forEachOpts);
          };
          return ShapeOptionsBuilder;
        })(CommonOptionsBuilder);
      }]).factory('uiGmapPolygonOptionsBuilder', ['uiGmapShapeOptionsBuilder', function(ShapeOptionsBuilder) {
        var PolygonOptionsBuilder;
        return PolygonOptionsBuilder = (function(superClass) {
          extend(PolygonOptionsBuilder, superClass);
          function PolygonOptionsBuilder() {
            return PolygonOptionsBuilder.__super__.constructor.apply(this, arguments);
          }
          PolygonOptionsBuilder.prototype.buildOpts = function(pathPoints, cachedEval) {
            return PolygonOptionsBuilder.__super__.buildOpts.call(this, {path: pathPoints}, cachedEval, {geodesic: false});
          };
          return PolygonOptionsBuilder;
        })(ShapeOptionsBuilder);
      }]).factory('uiGmapRectangleOptionsBuilder', ['uiGmapShapeOptionsBuilder', function(ShapeOptionsBuilder) {
        var RectangleOptionsBuilder;
        return RectangleOptionsBuilder = (function(superClass) {
          extend(RectangleOptionsBuilder, superClass);
          function RectangleOptionsBuilder() {
            return RectangleOptionsBuilder.__super__.constructor.apply(this, arguments);
          }
          RectangleOptionsBuilder.prototype.buildOpts = function(bounds, cachedEval) {
            return RectangleOptionsBuilder.__super__.buildOpts.call(this, {bounds: bounds}, cachedEval);
          };
          return RectangleOptionsBuilder;
        })(ShapeOptionsBuilder);
      }]).factory('uiGmapCircleOptionsBuilder', ['uiGmapShapeOptionsBuilder', function(ShapeOptionsBuilder) {
        var CircleOptionsBuilder;
        return CircleOptionsBuilder = (function(superClass) {
          extend(CircleOptionsBuilder, superClass);
          function CircleOptionsBuilder() {
            return CircleOptionsBuilder.__super__.constructor.apply(this, arguments);
          }
          CircleOptionsBuilder.prototype.buildOpts = function(center, radius, cachedEval) {
            return CircleOptionsBuilder.__super__.buildOpts.call(this, {
              center: center,
              radius: radius
            }, cachedEval);
          };
          return CircleOptionsBuilder;
        })(ShapeOptionsBuilder);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.options').service('uiGmapMarkerOptions', ['uiGmapLogger', 'uiGmapGmapUtil', function($log, GmapUtil) {
        return _.extend(GmapUtil, {
          createOptions: function(coords, icon, defaults, map) {
            var opts;
            if (defaults == null) {
              defaults = {};
            }
            opts = angular.extend({}, defaults, {
              position: defaults.position != null ? defaults.position : GmapUtil.getCoords(coords),
              visible: defaults.visible != null ? defaults.visible : GmapUtil.validateCoords(coords)
            });
            if ((defaults.icon != null) || (icon != null)) {
              opts = angular.extend(opts, {icon: defaults.icon != null ? defaults.icon : icon});
            }
            if (map != null) {
              opts.map = map;
            }
            return opts;
          },
          isLabel: function(options) {
            if (options == null) {
              return false;
            }
            return (options.labelContent != null) || (options.labelAnchor != null) || (options.labelClass != null) || (options.labelStyle != null) || (options.labelVisible != null);
          }
        });
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapBasePolyChildModel', ['uiGmapLogger', '$timeout', 'uiGmaparray-sync', 'uiGmapGmapUtil', 'uiGmapEventsHelper', function($log, $timeout, arraySync, GmapUtil, EventsHelper) {
        return function(Builder, gFactory) {
          var BasePolyChildModel;
          return BasePolyChildModel = (function(superClass) {
            extend(BasePolyChildModel, superClass);
            BasePolyChildModel.include(GmapUtil);
            function BasePolyChildModel(scope, attrs, map, defaults, model, gObjectChangeCb) {
              var create;
              this.scope = scope;
              this.attrs = attrs;
              this.map = map;
              this.defaults = defaults;
              this.model = model;
              this.clean = bind(this.clean, this);
              this.clonedModel = _.clone(this.model, true);
              this.isDragging = false;
              this.internalEvents = {
                dragend: (function(_this) {
                  return function() {
                    return _.defer(function() {
                      return _this.isDragging = false;
                    });
                  };
                })(this),
                dragstart: (function(_this) {
                  return function() {
                    return _this.isDragging = true;
                  };
                })(this)
              };
              create = (function(_this) {
                return function() {
                  var maybeCachedEval;
                  if (_this.isDragging) {
                    return;
                  }
                  _this.pathPoints = _this.convertPathPoints(_this.scope.path);
                  if (_this.gObject != null) {
                    _this.clean();
                  }
                  if (_this.scope.model != null) {
                    maybeCachedEval = _this.scope;
                  }
                  if (_this.pathPoints.length > 0) {
                    _this.gObject = gFactory(_this.buildOpts(_this.pathPoints, maybeCachedEval));
                  }
                  if (_this.gObject) {
                    arraySync(_this.gObject.getPath(), _this.scope, 'path', function(pathPoints) {
                      _this.pathPoints = pathPoints;
                      if (gObjectChangeCb != null) {
                        return gObjectChangeCb();
                      }
                    });
                    if (angular.isDefined(_this.scope.events) && angular.isObject(_this.scope.events)) {
                      _this.listeners = _this.model ? EventsHelper.setEvents(_this.gObject, _this.scope, _this.model) : EventsHelper.setEvents(_this.gObject, _this.scope, _this.scope);
                    }
                    return _this.internalListeners = _this.model ? EventsHelper.setEvents(_this.gObject, {events: _this.internalEvents}, _this.model) : EventsHelper.setEvents(_this.gObject, {events: _this.internalEvents}, _this.scope);
                  }
                };
              })(this);
              create();
              this.scope.$watch('path', (function(_this) {
                return function(newValue, oldValue) {
                  if (!_.isEqual(newValue, oldValue) || !_this.gObject) {
                    return create();
                  }
                };
              })(this), true);
              if (!this.scope["static"] && angular.isDefined(this.scope.editable)) {
                this.scope.$watch('editable', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      newValue = !_this.isFalse(newValue);
                      return (ref = _this.gObject) != null ? ref.setEditable(newValue) : void 0;
                    }
                  };
                })(this), true);
              }
              if (angular.isDefined(this.scope.draggable)) {
                this.scope.$watch('draggable', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      newValue = !_this.isFalse(newValue);
                      return (ref = _this.gObject) != null ? ref.setDraggable(newValue) : void 0;
                    }
                  };
                })(this), true);
              }
              if (angular.isDefined(this.scope.visible)) {
                this.scope.$watch('visible', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      newValue = !_this.isFalse(newValue);
                    }
                    return (ref = _this.gObject) != null ? ref.setVisible(newValue) : void 0;
                  };
                })(this), true);
              }
              if (angular.isDefined(this.scope.geodesic)) {
                this.scope.$watch('geodesic', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      newValue = !_this.isFalse(newValue);
                      return (ref = _this.gObject) != null ? ref.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                    }
                  };
                })(this), true);
              }
              if (angular.isDefined(this.scope.stroke) && angular.isDefined(this.scope.stroke.weight)) {
                this.scope.$watch('stroke.weight', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      return (ref = _this.gObject) != null ? ref.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                    }
                  };
                })(this), true);
              }
              if (angular.isDefined(this.scope.stroke) && angular.isDefined(this.scope.stroke.color)) {
                this.scope.$watch('stroke.color', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      return (ref = _this.gObject) != null ? ref.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                    }
                  };
                })(this), true);
              }
              if (angular.isDefined(this.scope.stroke) && angular.isDefined(this.scope.stroke.opacity)) {
                this.scope.$watch('stroke.opacity', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      return (ref = _this.gObject) != null ? ref.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                    }
                  };
                })(this), true);
              }
              if (angular.isDefined(this.scope.icons)) {
                this.scope.$watch('icons', (function(_this) {
                  return function(newValue, oldValue) {
                    var ref;
                    if (newValue !== oldValue) {
                      return (ref = _this.gObject) != null ? ref.setOptions(_this.buildOpts(_this.gObject.getPath())) : void 0;
                    }
                  };
                })(this), true);
              }
              this.scope.$on('$destroy', (function(_this) {
                return function() {
                  _this.clean();
                  return _this.scope = null;
                };
              })(this));
              if (angular.isDefined(this.scope.fill) && angular.isDefined(this.scope.fill.color)) {
                this.scope.$watch('fill.color', (function(_this) {
                  return function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                      return _this.gObject.setOptions(_this.buildOpts(_this.gObject.getPath()));
                    }
                  };
                })(this));
              }
              if (angular.isDefined(this.scope.fill) && angular.isDefined(this.scope.fill.opacity)) {
                this.scope.$watch('fill.opacity', (function(_this) {
                  return function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                      return _this.gObject.setOptions(_this.buildOpts(_this.gObject.getPath()));
                    }
                  };
                })(this));
              }
              if (angular.isDefined(this.scope.zIndex)) {
                this.scope.$watch('zIndex', (function(_this) {
                  return function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                      return _this.gObject.setOptions(_this.buildOpts(_this.gObject.getPath()));
                    }
                  };
                })(this));
              }
            }
            BasePolyChildModel.prototype.clean = function() {
              var ref;
              EventsHelper.removeEvents(this.listeners);
              EventsHelper.removeEvents(this.internalListeners);
              if ((ref = this.gObject) != null) {
                ref.setMap(null);
              }
              return this.gObject = null;
            };
            return BasePolyChildModel;
          })(Builder);
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api.models.child').factory('uiGmapDrawFreeHandChildModel', ['uiGmapLogger', '$q', function($log, $q) {
        var drawFreeHand,
            freeHandMgr;
        drawFreeHand = function(map, polys, done) {
          var move,
              poly;
          poly = new google.maps.Polyline({
            map: map,
            clickable: false
          });
          move = google.maps.event.addListener(map, 'mousemove', function(e) {
            return poly.getPath().push(e.latLng);
          });
          google.maps.event.addListenerOnce(map, 'mouseup', function(e) {
            var path;
            google.maps.event.removeListener(move);
            path = poly.getPath();
            poly.setMap(null);
            polys.push(new google.maps.Polygon({
              map: map,
              path: path
            }));
            poly = null;
            google.maps.event.clearListeners(map.getDiv(), 'mousedown');
            return done();
          });
          return void 0;
        };
        freeHandMgr = function(map1, scope) {
          var disableMap,
              enableMap;
          this.map = map1;
          disableMap = (function(_this) {
            return function() {
              var mapOptions;
              mapOptions = {
                draggable: false,
                disableDefaultUI: true,
                scrollwheel: false,
                disableDoubleClickZoom: false
              };
              $log.info('disabling map move');
              return _this.map.setOptions(mapOptions);
            };
          })(this);
          enableMap = (function(_this) {
            return function() {
              var mapOptions,
                  ref;
              mapOptions = {
                draggable: true,
                disableDefaultUI: false,
                scrollwheel: true,
                disableDoubleClickZoom: true
              };
              if ((ref = _this.deferred) != null) {
                ref.resolve();
              }
              return _.defer(function() {
                return _this.map.setOptions(_.extend(mapOptions, scope.options));
              });
            };
          })(this);
          this.engage = (function(_this) {
            return function(polys1) {
              _this.polys = polys1;
              _this.deferred = $q.defer();
              disableMap();
              $log.info('DrawFreeHandChildModel is engaged (drawing).');
              google.maps.event.addDomListener(_this.map.getDiv(), 'mousedown', function(e) {
                return drawFreeHand(_this.map, _this.polys, enableMap);
              });
              return _this.deferred.promise;
            };
          })(this);
          return this;
        };
        return freeHandMgr;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.child').factory('uiGmapMarkerChildModel', ['uiGmapModelKey', 'uiGmapGmapUtil', 'uiGmapLogger', 'uiGmapEventsHelper', 'uiGmapPropertyAction', 'uiGmapMarkerOptions', 'uiGmapIMarker', 'uiGmapMarkerManager', 'uiGmapPromise', function(ModelKey, GmapUtil, $log, EventsHelper, PropertyAction, MarkerOptions, IMarker, MarkerManager, uiGmapPromise) {
        var MarkerChildModel;
        MarkerChildModel = (function(superClass) {
          var destroy;
          extend(MarkerChildModel, superClass);
          MarkerChildModel.include(GmapUtil);
          MarkerChildModel.include(EventsHelper);
          MarkerChildModel.include(MarkerOptions);
          destroy = function(child) {
            if ((child != null ? child.gObject : void 0) != null) {
              child.removeEvents(child.externalListeners);
              child.removeEvents(child.internalListeners);
              if (child != null ? child.gObject : void 0) {
                if (child.removeFromManager) {
                  child.gManager.remove(child.gObject);
                }
                child.gObject.setMap(null);
                return child.gObject = null;
              }
            }
          };
          function MarkerChildModel(scope, model1, keys, gMap, defaults, doClick, gManager, doDrawSelf, trackModel, needRedraw) {
            var action;
            this.model = model1;
            this.keys = keys;
            this.gMap = gMap;
            this.defaults = defaults;
            this.doClick = doClick;
            this.gManager = gManager;
            this.doDrawSelf = doDrawSelf != null ? doDrawSelf : true;
            this.trackModel = trackModel != null ? trackModel : true;
            this.needRedraw = needRedraw != null ? needRedraw : false;
            this.internalEvents = bind(this.internalEvents, this);
            this.setLabelOptions = bind(this.setLabelOptions, this);
            this.setOptions = bind(this.setOptions, this);
            this.setIcon = bind(this.setIcon, this);
            this.setCoords = bind(this.setCoords, this);
            this.isNotValid = bind(this.isNotValid, this);
            this.maybeSetScopeValue = bind(this.maybeSetScopeValue, this);
            this.createMarker = bind(this.createMarker, this);
            this.setMyScope = bind(this.setMyScope, this);
            this.updateModel = bind(this.updateModel, this);
            this.handleModelChanges = bind(this.handleModelChanges, this);
            this.destroy = bind(this.destroy, this);
            this.clonedModel = _.clone(this.model, true);
            this.deferred = uiGmapPromise.defer();
            _.each(this.keys, (function(_this) {
              return function(v, k) {
                var keyValue;
                keyValue = _this.keys[k];
                if ((keyValue != null) && !_.isFunction(keyValue) && _.isString(keyValue)) {
                  return _this[k + 'Key'] = keyValue;
                }
              };
            })(this));
            this.idKey = this.idKeyKey || 'id';
            if (this.model[this.idKey] != null) {
              this.id = this.model[this.idKey];
            }
            MarkerChildModel.__super__.constructor.call(this, scope);
            this.scope.getGMarker = (function(_this) {
              return function() {
                return _this.gObject;
              };
            })(this);
            this.firstTime = true;
            if (this.trackModel) {
              this.scope.model = this.model;
              this.scope.$watch('model', (function(_this) {
                return function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    return _this.handleModelChanges(newValue, oldValue);
                  }
                };
              })(this), true);
            } else {
              action = new PropertyAction((function(_this) {
                return function(calledKey, newVal) {
                  if (!_this.firstTime) {
                    return _this.setMyScope(calledKey, scope);
                  }
                };
              })(this), false);
              _.each(this.keys, function(v, k) {
                return scope.$watch(k, action.sic, true);
              });
            }
            this.scope.$on('$destroy', (function(_this) {
              return function() {
                return destroy(_this);
              };
            })(this));
            this.createMarker(this.model);
            $log.info(this);
          }
          MarkerChildModel.prototype.destroy = function(removeFromManager) {
            if (removeFromManager == null) {
              removeFromManager = true;
            }
            this.removeFromManager = removeFromManager;
            return this.scope.$destroy();
          };
          MarkerChildModel.prototype.handleModelChanges = function(newValue, oldValue) {
            var changes,
                ctr,
                len;
            changes = this.getChanges(newValue, oldValue, IMarker.keys);
            if (!this.firstTime) {
              ctr = 0;
              len = _.keys(changes).length;
              return _.each(changes, (function(_this) {
                return function(v, k) {
                  var doDraw;
                  ctr += 1;
                  doDraw = len === ctr;
                  _this.setMyScope(k, newValue, oldValue, false, true, doDraw);
                  return _this.needRedraw = true;
                };
              })(this));
            }
          };
          MarkerChildModel.prototype.updateModel = function(model) {
            this.clonedModel = _.clone(model, true);
            return this.setMyScope('all', model, this.model);
          };
          MarkerChildModel.prototype.renderGMarker = function(doDraw, validCb) {
            var coords,
                isSpiderfied,
                ref;
            if (doDraw == null) {
              doDraw = true;
            }
            coords = this.getProp('coords', this.scope, this.model);
            if (((ref = this.gManager) != null ? ref.isSpiderfied : void 0) != null) {
              isSpiderfied = this.gManager.isSpiderfied();
            }
            if (coords != null) {
              if (!this.validateCoords(coords)) {
                $log.debug('MarkerChild does not have coords yet. They may be defined later.');
                return;
              }
              if (validCb != null) {
                validCb();
              }
              if (doDraw && this.gObject) {
                this.gManager.add(this.gObject);
              }
              if (isSpiderfied) {
                return this.gManager.markerSpiderfier.spiderListener(this.gObject, window.event);
              }
            } else {
              if (doDraw && this.gObject) {
                return this.gManager.remove(this.gObject);
              }
            }
          };
          MarkerChildModel.prototype.setMyScope = function(thingThatChanged, model, oldModel, isInit, doDraw) {
            var justCreated;
            if (oldModel == null) {
              oldModel = void 0;
            }
            if (isInit == null) {
              isInit = false;
            }
            if (doDraw == null) {
              doDraw = true;
            }
            if (model == null) {
              model = this.model;
            } else {
              this.model = model;
            }
            if (!this.gObject) {
              this.setOptions(this.scope, doDraw);
              justCreated = true;
            }
            switch (thingThatChanged) {
              case 'all':
                return _.each(this.keys, (function(_this) {
                  return function(v, k) {
                    return _this.setMyScope(k, model, oldModel, isInit, doDraw);
                  };
                })(this));
              case 'icon':
                return this.maybeSetScopeValue('icon', model, oldModel, this.iconKey, this.evalModelHandle, isInit, this.setIcon, doDraw);
              case 'coords':
                return this.maybeSetScopeValue('coords', model, oldModel, this.coordsKey, this.evalModelHandle, isInit, this.setCoords, doDraw);
              case 'options':
                if (!justCreated) {
                  return this.createMarker(model, oldModel, isInit, doDraw);
                }
            }
          };
          MarkerChildModel.prototype.createMarker = function(model, oldModel, isInit, doDraw) {
            if (oldModel == null) {
              oldModel = void 0;
            }
            if (isInit == null) {
              isInit = false;
            }
            if (doDraw == null) {
              doDraw = true;
            }
            this.maybeSetScopeValue('options', model, oldModel, this.optionsKey, this.evalModelHandle, isInit, this.setOptions, doDraw);
            return this.firstTime = false;
          };
          MarkerChildModel.prototype.maybeSetScopeValue = function(scopePropName, model, oldModel, modelKey, evaluate, isInit, gSetter, doDraw) {
            if (gSetter == null) {
              gSetter = void 0;
            }
            if (doDraw == null) {
              doDraw = true;
            }
            if (gSetter != null) {
              return gSetter(this.scope, doDraw);
            }
          };
          if (MarkerChildModel.doDrawSelf && doDraw) {
            MarkerChildModel.gManager.draw();
          }
          MarkerChildModel.prototype.isNotValid = function(scope, doCheckGmarker) {
            var hasIdenticalScopes,
                hasNoGmarker;
            if (doCheckGmarker == null) {
              doCheckGmarker = true;
            }
            hasNoGmarker = !doCheckGmarker ? false : this.gObject === void 0;
            hasIdenticalScopes = !this.trackModel ? scope.$id !== this.scope.$id : false;
            return hasIdenticalScopes || hasNoGmarker;
          };
          MarkerChildModel.prototype.setCoords = function(scope, doDraw) {
            if (doDraw == null) {
              doDraw = true;
            }
            if (this.isNotValid(scope) || (this.gObject == null)) {
              return;
            }
            return this.renderGMarker(doDraw, (function(_this) {
              return function() {
                var newGValue,
                    newModelVal,
                    oldGValue;
                newModelVal = _this.getProp('coords', scope, _this.model);
                newGValue = _this.getCoords(newModelVal);
                oldGValue = _this.gObject.getPosition();
                if ((oldGValue != null) && (newGValue != null)) {
                  if (newGValue.lng() === oldGValue.lng() && newGValue.lat() === oldGValue.lat()) {
                    return;
                  }
                }
                _this.gObject.setPosition(newGValue);
                return _this.gObject.setVisible(_this.validateCoords(newModelVal));
              };
            })(this));
          };
          MarkerChildModel.prototype.setIcon = function(scope, doDraw) {
            if (doDraw == null) {
              doDraw = true;
            }
            if (this.isNotValid(scope) || (this.gObject == null)) {
              return;
            }
            return this.renderGMarker(doDraw, (function(_this) {
              return function() {
                var coords,
                    newValue,
                    oldValue;
                oldValue = _this.gObject.getIcon();
                newValue = _this.getProp('icon', scope, _this.model);
                if (oldValue === newValue) {
                  return;
                }
                _this.gObject.setIcon(newValue);
                coords = _this.getProp('coords', scope, _this.model);
                _this.gObject.setPosition(_this.getCoords(coords));
                return _this.gObject.setVisible(_this.validateCoords(coords));
              };
            })(this));
          };
          MarkerChildModel.prototype.setOptions = function(scope, doDraw) {
            var ref;
            if (doDraw == null) {
              doDraw = true;
            }
            if (this.isNotValid(scope, false)) {
              return;
            }
            this.renderGMarker(doDraw, (function(_this) {
              return function() {
                var _options,
                    coords,
                    icon;
                coords = _this.getProp('coords', scope, _this.model);
                icon = _this.getProp('icon', scope, _this.model);
                _options = _this.getProp('options', scope, _this.model);
                _this.opts = _this.createOptions(coords, icon, _options);
                if (_this.isLabel(_this.gObject) !== _this.isLabel(_this.opts) && (_this.gObject != null)) {
                  _this.gManager.remove(_this.gObject);
                  _this.gObject = void 0;
                }
                if (_this.gObject != null) {
                  _this.gObject.setOptions(_this.setLabelOptions(_this.opts));
                }
                if (!_this.gObject) {
                  if (_this.isLabel(_this.opts)) {
                    _this.gObject = new MarkerWithLabel(_this.setLabelOptions(_this.opts));
                  } else if (_this.opts.content) {
                    _this.gObject = new RichMarker(_this.opts);
                    _this.gObject.getIcon = _this.gObject.getContent;
                    _this.gObject.setIcon = _this.gObject.setContent;
                  } else {
                    _this.gObject = new google.maps.Marker(_this.opts);
                  }
                  _.extend(_this.gObject, {model: _this.model});
                }
                if (_this.externalListeners) {
                  _this.removeEvents(_this.externalListeners);
                }
                if (_this.internalListeners) {
                  _this.removeEvents(_this.internalListeners);
                }
                _this.externalListeners = _this.setEvents(_this.gObject, _this.scope, _this.model, ['dragend']);
                _this.internalListeners = _this.setEvents(_this.gObject, {
                  events: _this.internalEvents(),
                  $evalAsync: function() {}
                }, _this.model);
                if (_this.id != null) {
                  return _this.gObject.key = _this.id;
                }
              };
            })(this));
            if (this.gObject && (this.gObject.getMap() || this.gManager.type !== MarkerManager.type)) {
              this.deferred.resolve(this.gObject);
            } else {
              if (!this.gObject) {
                return this.deferred.reject('gObject is null');
              }
              if (!(((ref = this.gObject) != null ? ref.getMap() : void 0) && this.gManager.type === MarkerManager.type)) {
                $log.debug('gObject has no map yet');
                this.deferred.resolve(this.gObject);
              }
            }
            if (this.model[this.fitKey]) {
              return this.gManager.fit();
            }
          };
          MarkerChildModel.prototype.setLabelOptions = function(opts) {
            if (opts.labelAnchor) {
              opts.labelAnchor = this.getLabelPositionPoint(opts.labelAnchor);
            }
            return opts;
          };
          MarkerChildModel.prototype.internalEvents = function() {
            return {
              dragend: (function(_this) {
                return function(marker, eventName, model, mousearg) {
                  var events,
                      modelToSet,
                      newCoords;
                  modelToSet = _this.trackModel ? _this.scope.model : _this.model;
                  newCoords = _this.setCoordsFromEvent(_this.modelOrKey(modelToSet, _this.coordsKey), _this.gObject.getPosition());
                  modelToSet = _this.setVal(model, _this.coordsKey, newCoords);
                  events = _this.scope.events;
                  if ((events != null ? events.dragend : void 0) != null) {
                    events.dragend(marker, eventName, modelToSet, mousearg);
                  }
                  return _this.scope.$apply();
                };
              })(this),
              click: (function(_this) {
                return function(marker, eventName, model, mousearg) {
                  var click;
                  click = _this.getProp('click', _this.scope, _this.model);
                  if (_this.doClick && (click != null)) {
                    return _this.scope.$evalAsync(click(marker, eventName, _this.model, mousearg));
                  }
                };
              })(this)
            };
          };
          return MarkerChildModel;
        })(ModelKey);
        return MarkerChildModel;
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolygonChildModel', ['uiGmapBasePolyChildModel', 'uiGmapPolygonOptionsBuilder', function(BaseGen, Builder) {
        var PolygonChildModel,
            base,
            gFactory;
        gFactory = function(opts) {
          return new google.maps.Polygon(opts);
        };
        base = new BaseGen(Builder, gFactory);
        return PolygonChildModel = (function(superClass) {
          extend(PolygonChildModel, superClass);
          function PolygonChildModel() {
            return PolygonChildModel.__super__.constructor.apply(this, arguments);
          }
          return PolygonChildModel;
        })(base);
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolylineChildModel', ['uiGmapBasePolyChildModel', 'uiGmapPolylineOptionsBuilder', function(BaseGen, Builder) {
        var PolylineChildModel,
            base,
            gFactory;
        gFactory = function(opts) {
          return new google.maps.Polyline(opts);
        };
        base = BaseGen(Builder, gFactory);
        return PolylineChildModel = (function(superClass) {
          extend(PolylineChildModel, superClass);
          function PolylineChildModel() {
            return PolylineChildModel.__super__.constructor.apply(this, arguments);
          }
          return PolylineChildModel;
        })(base);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.child').factory('uiGmapWindowChildModel', ['uiGmapBaseObject', 'uiGmapGmapUtil', 'uiGmapLogger', '$compile', '$http', '$templateCache', 'uiGmapChromeFixes', 'uiGmapEventsHelper', function(BaseObject, GmapUtil, $log, $compile, $http, $templateCache, ChromeFixes, EventsHelper) {
        var WindowChildModel;
        WindowChildModel = (function(superClass) {
          extend(WindowChildModel, superClass);
          WindowChildModel.include(GmapUtil);
          WindowChildModel.include(EventsHelper);
          function WindowChildModel(model1, scope1, opts, isIconVisibleOnClick, mapCtrl, markerScope, element, needToManualDestroy, markerIsVisibleAfterWindowClose) {
            var maybeMarker;
            this.model = model1;
            this.scope = scope1;
            this.opts = opts;
            this.isIconVisibleOnClick = isIconVisibleOnClick;
            this.mapCtrl = mapCtrl;
            this.markerScope = markerScope;
            this.element = element;
            this.needToManualDestroy = needToManualDestroy != null ? needToManualDestroy : false;
            this.markerIsVisibleAfterWindowClose = markerIsVisibleAfterWindowClose != null ? markerIsVisibleAfterWindowClose : true;
            this.updateModel = bind(this.updateModel, this);
            this.destroy = bind(this.destroy, this);
            this.remove = bind(this.remove, this);
            this.getLatestPosition = bind(this.getLatestPosition, this);
            this.hideWindow = bind(this.hideWindow, this);
            this.showWindow = bind(this.showWindow, this);
            this.handleClick = bind(this.handleClick, this);
            this.watchOptions = bind(this.watchOptions, this);
            this.watchCoords = bind(this.watchCoords, this);
            this.createGWin = bind(this.createGWin, this);
            this.watchElement = bind(this.watchElement, this);
            this.watchAndDoShow = bind(this.watchAndDoShow, this);
            this.doShow = bind(this.doShow, this);
            this.clonedModel = _.clone(this.model, true);
            this.getGmarker = function() {
              var ref,
                  ref1;
              if (((ref = this.markerScope) != null ? ref['getGMarker'] : void 0) != null) {
                return (ref1 = this.markerScope) != null ? ref1.getGMarker() : void 0;
              }
            };
            this.listeners = [];
            this.createGWin();
            maybeMarker = this.getGmarker();
            if (maybeMarker != null) {
              maybeMarker.setClickable(true);
            }
            this.watchElement();
            this.watchOptions();
            this.watchCoords();
            this.watchAndDoShow();
            this.scope.$on('$destroy', (function(_this) {
              return function() {
                return _this.destroy();
              };
            })(this));
            $log.info(this);
          }
          WindowChildModel.prototype.doShow = function(wasOpen) {
            if (this.scope.show === true || wasOpen) {
              return this.showWindow();
            } else {
              return this.hideWindow();
            }
          };
          WindowChildModel.prototype.watchAndDoShow = function() {
            if (this.model.show != null) {
              this.scope.show = this.model.show;
            }
            this.scope.$watch('show', this.doShow, true);
            return this.doShow();
          };
          WindowChildModel.prototype.watchElement = function() {
            return this.scope.$watch((function(_this) {
              return function() {
                var ref,
                    wasOpen;
                if (!(_this.element || _this.html)) {
                  return;
                }
                if (_this.html !== _this.element.html() && _this.gObject) {
                  if ((ref = _this.opts) != null) {
                    ref.content = void 0;
                  }
                  wasOpen = _this.gObject.isOpen();
                  _this.remove();
                  return _this.createGWin(wasOpen);
                }
              };
            })(this));
          };
          WindowChildModel.prototype.createGWin = function(isOpen) {
            var _opts,
                defaults,
                maybeMarker,
                ref,
                ref1;
            if (isOpen == null) {
              isOpen = false;
            }
            maybeMarker = this.getGmarker();
            defaults = {};
            if (this.opts != null) {
              if (this.scope.coords) {
                this.opts.position = this.getCoords(this.scope.coords);
              }
              defaults = this.opts;
            }
            if (this.element) {
              this.html = _.isObject(this.element) ? this.element.html() : this.element;
            }
            _opts = this.scope.options ? this.scope.options : defaults;
            this.opts = this.createWindowOptions(maybeMarker, this.markerScope || this.scope, this.html, _opts);
            if (this.opts != null) {
              if (!this.gObject) {
                if (this.opts.boxClass && (window.InfoBox && typeof window.InfoBox === 'function')) {
                  this.gObject = new window.InfoBox(this.opts);
                } else {
                  this.gObject = new google.maps.InfoWindow(this.opts);
                }
                this.listeners.push(google.maps.event.addListener(this.gObject, 'domready', function() {
                  return ChromeFixes.maybeRepaint(this.content);
                }));
                this.listeners.push(google.maps.event.addListener(this.gObject, 'closeclick', (function(_this) {
                  return function() {
                    if (maybeMarker) {
                      maybeMarker.setAnimation(_this.oldMarkerAnimation);
                      if (_this.markerIsVisibleAfterWindowClose) {
                        _.delay(function() {
                          maybeMarker.setVisible(false);
                          return maybeMarker.setVisible(_this.markerIsVisibleAfterWindowClose);
                        }, 250);
                      }
                    }
                    _this.gObject.close();
                    _this.model.show = false;
                    if (_this.scope.closeClick != null) {
                      return _this.scope.$evalAsync(_this.scope.closeClick());
                    } else {
                      return _this.scope.$evalAsync();
                    }
                  };
                })(this)));
              }
              this.gObject.setContent(this.opts.content);
              this.handleClick(((ref = this.scope) != null ? (ref1 = ref.options) != null ? ref1.forceClick : void 0 : void 0) || isOpen);
              return this.doShow(this.gObject.isOpen());
            }
          };
          WindowChildModel.prototype.watchCoords = function() {
            var scope;
            scope = this.markerScope != null ? this.markerScope : this.scope;
            return scope.$watch('coords', (function(_this) {
              return function(newValue, oldValue) {
                var pos;
                if (newValue !== oldValue) {
                  if (newValue == null) {
                    _this.hideWindow();
                  } else if (!_this.validateCoords(newValue)) {
                    $log.error("WindowChildMarker cannot render marker as scope.coords as no position on marker: " + (JSON.stringify(_this.model)));
                    return;
                  }
                  pos = _this.getCoords(newValue);
                  _this.doShow();
                  _this.gObject.setPosition(pos);
                  if (_this.opts) {
                    return _this.opts.position = pos;
                  }
                }
              };
            })(this), true);
          };
          WindowChildModel.prototype.watchOptions = function() {
            return this.scope.$watch('options', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  _this.opts = newValue;
                  if (_this.gObject != null) {
                    _this.gObject.setOptions(_this.opts);
                    if ((_this.opts.visible != null) && _this.opts.visible) {
                      return _this.showWindow();
                    } else if (_this.opts.visible != null) {
                      return _this.hideWindow();
                    }
                  }
                }
              };
            })(this), true);
          };
          WindowChildModel.prototype.handleClick = function(forceClick) {
            var click,
                maybeMarker;
            if (this.gObject == null) {
              return;
            }
            maybeMarker = this.getGmarker();
            click = (function(_this) {
              return function() {
                if (_this.gObject == null) {
                  _this.createGWin();
                }
                _this.showWindow();
                if (maybeMarker != null) {
                  _this.initialMarkerVisibility = maybeMarker.getVisible();
                  _this.oldMarkerAnimation = maybeMarker.getAnimation();
                  return maybeMarker.setVisible(_this.isIconVisibleOnClick);
                }
              };
            })(this);
            if (forceClick) {
              click();
            }
            if (maybeMarker) {
              return this.listeners = this.listeners.concat(this.setEvents(maybeMarker, {events: {click: click}}, this.model));
            }
          };
          WindowChildModel.prototype.showWindow = function() {
            var compiled,
                show,
                templateScope;
            if (this.gObject != null) {
              show = (function(_this) {
                return function() {
                  var isOpen,
                      maybeMarker,
                      pos;
                  if (!_this.gObject.isOpen()) {
                    maybeMarker = _this.getGmarker();
                    if ((_this.gObject != null) && (_this.gObject.getPosition != null)) {
                      pos = _this.gObject.getPosition();
                    }
                    if (maybeMarker) {
                      pos = maybeMarker.getPosition();
                    }
                    if (!pos) {
                      return;
                    }
                    _this.gObject.open(_this.mapCtrl, maybeMarker);
                    isOpen = _this.gObject.isOpen();
                    if (_this.model.show !== isOpen) {
                      return _this.model.show = isOpen;
                    }
                  }
                };
              })(this);
              if (this.scope.templateUrl) {
                return $http.get(this.scope.templateUrl, {cache: $templateCache}).then((function(_this) {
                  return function(content) {
                    var compiled,
                        templateScope;
                    templateScope = _this.scope.$new();
                    if (angular.isDefined(_this.scope.templateParameter)) {
                      templateScope.parameter = _this.scope.templateParameter;
                    }
                    compiled = $compile(content.data)(templateScope);
                    _this.gObject.setContent(compiled[0]);
                    return show();
                  };
                })(this));
              } else if (this.scope.template) {
                templateScope = this.scope.$new();
                if (angular.isDefined(this.scope.templateParameter)) {
                  templateScope.parameter = this.scope.templateParameter;
                }
                compiled = $compile(this.scope.template)(templateScope);
                this.gObject.setContent(compiled[0]);
                return show();
              } else {
                return show();
              }
            }
          };
          WindowChildModel.prototype.hideWindow = function() {
            if ((this.gObject != null) && this.gObject.isOpen()) {
              return this.gObject.close();
            }
          };
          WindowChildModel.prototype.getLatestPosition = function(overridePos) {
            var maybeMarker;
            maybeMarker = this.getGmarker();
            if ((this.gObject != null) && (maybeMarker != null) && !overridePos) {
              return this.gObject.setPosition(maybeMarker.getPosition());
            } else {
              if (overridePos) {
                return this.gObject.setPosition(overridePos);
              }
            }
          };
          WindowChildModel.prototype.remove = function() {
            this.hideWindow();
            this.removeEvents(this.listeners);
            this.listeners.length = 0;
            delete this.gObject;
            return delete this.opts;
          };
          WindowChildModel.prototype.destroy = function(manualOverride) {
            var ref;
            if (manualOverride == null) {
              manualOverride = false;
            }
            this.remove();
            if ((this.scope != null) && !((ref = this.scope) != null ? ref.$$destroyed : void 0) && (this.needToManualDestroy || manualOverride)) {
              return this.scope.$destroy();
            }
          };
          WindowChildModel.prototype.updateModel = function(model) {
            this.clonedModel = _.clone(model, true);
            return _.extend(this.model, this.clonedModel);
          };
          return WindowChildModel;
        })(BaseObject);
        return WindowChildModel;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapBasePolysParentModel', ['$timeout', 'uiGmapLogger', 'uiGmapModelKey', 'uiGmapModelsWatcher', 'uiGmapPropMap', 'uiGmap_async', 'uiGmapPromise', 'uiGmapFitHelper', function($timeout, $log, ModelKey, ModelsWatcher, PropMap, _async, uiGmapPromise, FitHelper) {
        return function(IPoly, PolyChildModel, gObjectName) {
          var BasePolysParentModel;
          return BasePolysParentModel = (function(superClass) {
            extend(BasePolysParentModel, superClass);
            BasePolysParentModel.include(ModelsWatcher);
            function BasePolysParentModel(scope, element, attrs, gMap1, defaults) {
              this.element = element;
              this.attrs = attrs;
              this.gMap = gMap1;
              this.defaults = defaults;
              this.maybeFit = bind(this.maybeFit, this);
              this.createChild = bind(this.createChild, this);
              this.pieceMeal = bind(this.pieceMeal, this);
              this.createAllNew = bind(this.createAllNew, this);
              this.watchIdKey = bind(this.watchIdKey, this);
              this.createChildScopes = bind(this.createChildScopes, this);
              this.watchDestroy = bind(this.watchDestroy, this);
              this.onDestroy = bind(this.onDestroy, this);
              this.rebuildAll = bind(this.rebuildAll, this);
              this.doINeedToWipe = bind(this.doINeedToWipe, this);
              this.watchModels = bind(this.watchModels, this);
              BasePolysParentModel.__super__.constructor.call(this, scope);
              this["interface"] = IPoly;
              this.$log = $log;
              this.plurals = new PropMap();
              _.each(IPoly.scopeKeys, (function(_this) {
                return function(name) {
                  return _this[name + 'Key'] = void 0;
                };
              })(this));
              this.models = void 0;
              this.firstTime = true;
              this.$log.info(this);
              this.createChildScopes();
            }
            BasePolysParentModel.prototype.watchModels = function(scope) {
              return scope.$watch('models', (function(_this) {
                return function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    if (_this.doINeedToWipe(newValue) || scope.doRebuildAll) {
                      return _this.rebuildAll(scope, true, true);
                    } else {
                      return _this.createChildScopes(false);
                    }
                  }
                };
              })(this), true);
            };
            BasePolysParentModel.prototype.doINeedToWipe = function(newValue) {
              var newValueIsEmpty;
              newValueIsEmpty = newValue != null ? newValue.length === 0 : true;
              return this.plurals.length > 0 && newValueIsEmpty;
            };
            BasePolysParentModel.prototype.rebuildAll = function(scope, doCreate, doDelete) {
              return this.onDestroy(doDelete).then((function(_this) {
                return function() {
                  if (doCreate) {
                    return _this.createChildScopes();
                  }
                };
              })(this));
            };
            BasePolysParentModel.prototype.onDestroy = function(scope) {
              BasePolysParentModel.__super__.onDestroy.call(this, this.scope);
              return _async.promiseLock(this, uiGmapPromise.promiseTypes["delete"], void 0, void 0, (function(_this) {
                return function() {
                  return _async.each(_this.plurals.values(), function(child) {
                    return child.destroy(true);
                  }, _async.chunkSizeFrom(_this.scope.cleanchunk, false)).then(function() {
                    var ref;
                    return (ref = _this.plurals) != null ? ref.removeAll() : void 0;
                  });
                };
              })(this));
            };
            BasePolysParentModel.prototype.watchDestroy = function(scope) {
              return scope.$on('$destroy', (function(_this) {
                return function() {
                  return _this.rebuildAll(scope, false, true);
                };
              })(this));
            };
            BasePolysParentModel.prototype.createChildScopes = function(isCreatingFromScratch) {
              if (isCreatingFromScratch == null) {
                isCreatingFromScratch = true;
              }
              if (angular.isUndefined(this.scope.models)) {
                this.$log.error("No models to create " + gObjectName + "s from! I Need direct models!");
                return;
              }
              if ((this.gMap == null) || (this.scope.models == null)) {
                return;
              }
              this.watchIdKey(this.scope);
              if (isCreatingFromScratch) {
                return this.createAllNew(this.scope, false);
              } else {
                return this.pieceMeal(this.scope, false);
              }
            };
            BasePolysParentModel.prototype.watchIdKey = function(scope) {
              this.setIdKey(scope);
              return scope.$watch('idKey', (function(_this) {
                return function(newValue, oldValue) {
                  if (newValue !== oldValue && (newValue == null)) {
                    _this.idKey = newValue;
                    return _this.rebuildAll(scope, true, true);
                  }
                };
              })(this));
            };
            BasePolysParentModel.prototype.createAllNew = function(scope, isArray) {
              var maybeCanceled;
              if (isArray == null) {
                isArray = false;
              }
              this.models = scope.models;
              if (this.firstTime) {
                this.watchModels(scope);
                this.watchDestroy(scope);
              }
              if (this.didQueueInitPromise(this, scope)) {
                return;
              }
              maybeCanceled = null;
              return _async.promiseLock(this, uiGmapPromise.promiseTypes.create, 'createAllNew', (function(canceledMsg) {
                return maybeCanceled = canceledMsg;
              }), (function(_this) {
                return function() {
                  return _async.map(scope.models, function(model) {
                    var child;
                    child = _this.createChild(model, _this.gMap);
                    if (maybeCanceled) {
                      $log.debug('createNew should fall through safely');
                      child.isEnabled = false;
                    }
                    maybeCanceled;
                    return child.pathPoints.getArray();
                  }, _async.chunkSizeFrom(scope.chunk)).then(function(pathPoints) {
                    _this.maybeFit(pathPoints);
                    return _this.firstTime = false;
                  });
                };
              })(this));
            };
            BasePolysParentModel.prototype.pieceMeal = function(scope, isArray) {
              var maybeCanceled,
                  payload;
              if (isArray == null) {
                isArray = true;
              }
              if (scope.$$destroyed) {
                return;
              }
              maybeCanceled = null;
              payload = null;
              this.models = scope.models;
              if ((scope != null) && this.modelsLength() && this.plurals.length) {
                return _async.promiseLock(this, uiGmapPromise.promiseTypes.update, 'pieceMeal', (function(canceledMsg) {
                  return maybeCanceled = canceledMsg;
                }), (function(_this) {
                  return function() {
                    return uiGmapPromise.promise(function() {
                      return _this.figureOutState(_this.idKey, scope, _this.plurals, _this.modelKeyComparison);
                    }).then(function(state) {
                      payload = state;
                      if (payload.updates.length) {
                        _async.each(payload.updates, function(obj) {
                          _.extend(obj.child.scope, obj.model);
                          return obj.child.model = obj.model;
                        });
                      }
                      return _async.each(payload.removals, function(child) {
                        if (child != null) {
                          child.destroy();
                          _this.plurals.remove(child.model[_this.idKey]);
                          return maybeCanceled;
                        }
                      }, _async.chunkSizeFrom(scope.chunk));
                    }).then(function() {
                      return _async.each(payload.adds, function(modelToAdd) {
                        if (maybeCanceled) {
                          $log.debug('pieceMeal should fall through safely');
                        }
                        _this.createChild(modelToAdd, _this.gMap);
                        return maybeCanceled;
                      }, _async.chunkSizeFrom(scope.chunk)).then(function() {
                        return _this.maybeFit();
                      });
                    });
                  };
                })(this));
              } else {
                this.inProgress = false;
                return this.rebuildAll(this.scope, true, true);
              }
            };
            BasePolysParentModel.prototype.createChild = function(model, gMap) {
              var child,
                  childScope;
              childScope = this.scope.$new(false);
              this.setChildScope(IPoly.scopeKeys, childScope, model);
              childScope.$watch('model', (function(_this) {
                return function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    return _this.setChildScope(childScope, newValue);
                  }
                };
              })(this), true);
              childScope["static"] = this.scope["static"];
              child = new PolyChildModel(childScope, this.attrs, gMap, this.defaults, model, (function(_this) {
                return function() {
                  return _this.maybeFit();
                };
              })(this));
              if (model[this.idKey] == null) {
                this.$log.error(gObjectName + " model has no id to assign a child to.\nThis is required for performance. Please assign id,\nor redirect id to a different key.");
                return;
              }
              this.plurals.put(model[this.idKey], child);
              return child;
            };
            BasePolysParentModel.prototype.maybeFit = function(pathPoints) {
              if (pathPoints == null) {
                pathPoints = this.plurals.map(function(p) {
                  return p.pathPoints;
                });
              }
              if (this.scope.fit) {
                pathPoints = _.flatten(pathPoints);
                return FitHelper.fit(pathPoints, this.gMap);
              }
            };
            return BasePolysParentModel;
          })(ModelKey);
        };
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapCircleParentModel', ['uiGmapLogger', '$timeout', 'uiGmapGmapUtil', 'uiGmapEventsHelper', 'uiGmapCircleOptionsBuilder', function($log, $timeout, GmapUtil, EventsHelper, Builder) {
        var CircleParentModel,
            _settingFromDirective;
        _settingFromDirective = function(scope, fn) {
          scope.settingFromDirective = true;
          fn();
          return $timeout(function() {
            return scope.settingFromDirective = false;
          });
        };
        return CircleParentModel = (function(superClass) {
          extend(CircleParentModel, superClass);
          CircleParentModel.include(GmapUtil);
          CircleParentModel.include(EventsHelper);
          function CircleParentModel(scope, element, attrs, map, DEFAULTS) {
            var clean,
                gObject,
                lastRadius;
            this.attrs = attrs;
            this.map = map;
            this.DEFAULTS = DEFAULTS;
            this.scope = scope;
            lastRadius = null;
            clean = (function(_this) {
              return function() {
                lastRadius = null;
                if (_this.listeners != null) {
                  _this.removeEvents(_this.listeners);
                  return _this.listeners = void 0;
                }
              };
            })(this);
            gObject = new google.maps.Circle(this.buildOpts(GmapUtil.getCoords(scope.center), scope.radius));
            this.setMyOptions = (function(_this) {
              return function(newVals, oldVals) {
                if (scope.settingFromDirective) {
                  return;
                }
                if (!_.isEqual(newVals, oldVals)) {
                  return gObject.setOptions(_this.buildOpts(GmapUtil.getCoords(scope.center), scope.radius));
                }
              };
            })(this);
            this.props = this.props.concat([{
              prop: 'center',
              isColl: true
            }, {
              prop: 'fill',
              isColl: true
            }, 'radius', 'zIndex']);
            this.watchProps();
            if (this.scope.control != null) {
              this.scope.control.getCircle = function() {
                return gObject;
              };
            }
            clean();
            this.listeners = this.setEvents(gObject, scope, scope, ['radius_changed']) || [];
            this.listeners.push(google.maps.event.addListener(gObject, 'radius_changed', function() {
              var newRadius,
                  work;
              newRadius = gObject.getRadius();
              if (newRadius === lastRadius) {
                return;
              }
              lastRadius = newRadius;
              work = function() {
                return _settingFromDirective(scope, function() {
                  var ref,
                      ref1;
                  if (newRadius !== scope.radius) {
                    scope.radius = newRadius;
                  }
                  if (((ref = scope.events) != null ? ref.radius_changed : void 0) && _.isFunction((ref1 = scope.events) != null ? ref1.radius_changed : void 0)) {
                    return scope.events.radius_changed(gObject, 'radius_changed', scope, arguments);
                  }
                });
              };
              if (!angular.mock) {
                return scope.$evalAsync(function() {
                  return work();
                });
              } else {
                return work();
              }
            }));
            this.listeners.push(google.maps.event.addListener(gObject, 'center_changed', function() {
              return scope.$evalAsync(function() {
                return _settingFromDirective(scope, function() {
                  if (angular.isDefined(scope.center.type)) {
                    scope.center.coordinates[1] = gObject.getCenter().lat();
                    return scope.center.coordinates[0] = gObject.getCenter().lng();
                  } else {
                    scope.center.latitude = gObject.getCenter().lat();
                    return scope.center.longitude = gObject.getCenter().lng();
                  }
                });
              });
            }));
            scope.$on('$destroy', (function(_this) {
              return function() {
                clean();
                return gObject.setMap(null);
              };
            })(this));
            $log.info(this);
          }
          return CircleParentModel;
        })(Builder);
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapDrawingManagerParentModel', ['uiGmapLogger', '$timeout', 'uiGmapBaseObject', 'uiGmapEventsHelper', function($log, $timeout, BaseObject, EventsHelper) {
        var DrawingManagerParentModel;
        return DrawingManagerParentModel = (function(superClass) {
          extend(DrawingManagerParentModel, superClass);
          DrawingManagerParentModel.include(EventsHelper);
          function DrawingManagerParentModel(scope, element, attrs, map) {
            var gObject,
                listeners;
            this.scope = scope;
            this.attrs = attrs;
            this.map = map;
            gObject = new google.maps.drawing.DrawingManager(this.scope.options);
            gObject.setMap(this.map);
            listeners = void 0;
            if (this.scope.control != null) {
              this.scope.control.getDrawingManager = function() {
                return gObject;
              };
            }
            if (!this.scope["static"] && this.scope.options) {
              this.scope.$watch('options', function(newValue) {
                return gObject != null ? gObject.setOptions(newValue) : void 0;
              }, true);
            }
            if (this.scope.events != null) {
              listeners = this.setEvents(gObject, this.scope, this.scope);
              this.scope.$watch('events', (function(_this) {
                return function(newValue, oldValue) {
                  if (!_.isEqual(newValue, oldValue)) {
                    if (listeners != null) {
                      _this.removeEvents(listeners);
                    }
                    return listeners = _this.setEvents(gObject, _this.scope, _this.scope);
                  }
                };
              })(this));
            }
            this.scope.$on('$destroy', (function(_this) {
              return function() {
                if (listeners != null) {
                  _this.removeEvents(listeners);
                }
                gObject.setMap(null);
                return gObject = null;
              };
            })(this));
          }
          return DrawingManagerParentModel;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api.models.parent").factory("uiGmapIMarkerParentModel", ["uiGmapModelKey", "uiGmapLogger", function(ModelKey, Logger) {
        var IMarkerParentModel;
        IMarkerParentModel = (function(superClass) {
          extend(IMarkerParentModel, superClass);
          IMarkerParentModel.prototype.DEFAULTS = {};
          function IMarkerParentModel(scope1, element, attrs, map) {
            this.scope = scope1;
            this.element = element;
            this.attrs = attrs;
            this.map = map;
            this.onWatch = bind(this.onWatch, this);
            this.watch = bind(this.watch, this);
            this.validateScope = bind(this.validateScope, this);
            IMarkerParentModel.__super__.constructor.call(this, this.scope);
            this.$log = Logger;
            if (!this.validateScope(this.scope)) {
              throw new String("Unable to construct IMarkerParentModel due to invalid scope");
            }
            this.doClick = angular.isDefined(this.attrs.click);
            if (this.scope.options != null) {
              this.DEFAULTS = this.scope.options;
            }
            this.watch('coords', this.scope);
            this.watch('icon', this.scope);
            this.watch('options', this.scope);
            this.scope.$on("$destroy", (function(_this) {
              return function() {
                return _this.onDestroy(_this.scope);
              };
            })(this));
          }
          IMarkerParentModel.prototype.validateScope = function(scope) {
            var ret;
            if (scope == null) {
              this.$log.error(this.constructor.name + ": invalid scope used");
              return false;
            }
            ret = scope.coords != null;
            if (!ret) {
              this.$log.error(this.constructor.name + ": no valid coords attribute found");
              return false;
            }
            return ret;
          };
          IMarkerParentModel.prototype.watch = function(propNameToWatch, scope, equalityCheck) {
            if (equalityCheck == null) {
              equalityCheck = true;
            }
            return scope.$watch(propNameToWatch, (function(_this) {
              return function(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue)) {
                  return _this.onWatch(propNameToWatch, scope, newValue, oldValue);
                }
              };
            })(this), equalityCheck);
          };
          IMarkerParentModel.prototype.onWatch = function(propNameToWatch, scope, newValue, oldValue) {};
          return IMarkerParentModel;
        })(ModelKey);
        return IMarkerParentModel;
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api.models.parent").factory("uiGmapIWindowParentModel", ["uiGmapModelKey", "uiGmapGmapUtil", "uiGmapLogger", function(ModelKey, GmapUtil, Logger) {
        var IWindowParentModel;
        return IWindowParentModel = (function(superClass) {
          extend(IWindowParentModel, superClass);
          IWindowParentModel.include(GmapUtil);
          function IWindowParentModel(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache) {
            IWindowParentModel.__super__.constructor.call(this, scope);
            this.$log = Logger;
            this.$timeout = $timeout;
            this.$compile = $compile;
            this.$http = $http;
            this.$templateCache = $templateCache;
            this.DEFAULTS = {};
            if (scope.options != null) {
              this.DEFAULTS = scope.options;
            }
          }
          IWindowParentModel.prototype.getItem = function(scope, modelsPropToIterate, index) {
            if (modelsPropToIterate === 'models') {
              return scope[modelsPropToIterate][index];
            }
            return scope[modelsPropToIterate].get(index);
          };
          return IWindowParentModel;
        })(ModelKey);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapLayerParentModel', ['uiGmapBaseObject', 'uiGmapLogger', '$timeout', function(BaseObject, Logger, $timeout) {
        var LayerParentModel;
        LayerParentModel = (function(superClass) {
          extend(LayerParentModel, superClass);
          function LayerParentModel(scope, element, attrs, gMap, onLayerCreated, $log) {
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.gMap = gMap;
            this.onLayerCreated = onLayerCreated != null ? onLayerCreated : void 0;
            this.$log = $log != null ? $log : Logger;
            this.createGoogleLayer = bind(this.createGoogleLayer, this);
            if (this.attrs.type == null) {
              this.$log.info('type attribute for the layer directive is mandatory. Layer creation aborted!!');
              return;
            }
            this.createGoogleLayer();
            this.doShow = true;
            if (angular.isDefined(this.attrs.show)) {
              this.doShow = this.scope.show;
            }
            if (this.doShow && (this.gMap != null)) {
              this.gObject.setMap(this.gMap);
            }
            this.scope.$watch('show', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  _this.doShow = newValue;
                  if (newValue) {
                    return _this.gObject.setMap(_this.gMap);
                  } else {
                    return _this.gObject.setMap(null);
                  }
                }
              };
            })(this), true);
            this.scope.$watch('options', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue && _this.doShow) {
                  return _this.gObject.setOptions(newValue);
                }
              };
            })(this), true);
            this.scope.$on('$destroy', (function(_this) {
              return function() {
                return _this.gObject.setMap(null);
              };
            })(this));
          }
          LayerParentModel.prototype.createGoogleLayer = function() {
            var base;
            if (this.attrs.options == null) {
              this.gObject = this.attrs.namespace === void 0 ? new google.maps[this.attrs.type]() : new google.maps[this.attrs.namespace][this.attrs.type]();
            } else {
              this.gObject = this.attrs.namespace === void 0 ? new google.maps[this.attrs.type](this.scope.options) : new google.maps[this.attrs.namespace][this.attrs.type](this.scope.options);
            }
            if ((this.gObject != null) && this.doShow) {
              this.gObject.setMap(this.gMap);
            }
            if ((this.gObject != null) && (this.onLayerCreated != null)) {
              return typeof(base = this.onLayerCreated(this.scope, this.gObject)) === "function" ? base(this.gObject) : void 0;
            }
          };
          return LayerParentModel;
        })(BaseObject);
        return LayerParentModel;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapMapTypeParentModel', ['uiGmapBaseObject', 'uiGmapLogger', function(BaseObject, Logger) {
        var MapTypeParentModel;
        MapTypeParentModel = (function(superClass) {
          extend(MapTypeParentModel, superClass);
          function MapTypeParentModel(scope, element, attrs, gMap, $log) {
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.gMap = gMap;
            this.$log = $log != null ? $log : Logger;
            this.hideOverlay = bind(this.hideOverlay, this);
            this.showOverlay = bind(this.showOverlay, this);
            this.refreshMapType = bind(this.refreshMapType, this);
            this.createMapType = bind(this.createMapType, this);
            if (this.attrs.options == null) {
              this.$log.info('options attribute for the map-type directive is mandatory. Map type creation aborted!!');
              return;
            }
            this.id = this.gMap.overlayMapTypesCount = this.gMap.overlayMapTypesCount + 1 || 0;
            this.doShow = true;
            this.createMapType();
            if (angular.isDefined(this.attrs.show)) {
              this.doShow = this.scope.show;
            }
            if (this.doShow && (this.gMap != null)) {
              this.showOverlay();
            }
            this.scope.$watch('show', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  _this.doShow = newValue;
                  if (newValue) {
                    return _this.showOverlay();
                  } else {
                    return _this.hideOverlay();
                  }
                }
              };
            })(this), true);
            this.scope.$watch('options', (function(_this) {
              return function(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue)) {
                  return _this.refreshMapType();
                }
              };
            })(this), true);
            if (angular.isDefined(this.attrs.refresh)) {
              this.scope.$watch('refresh', (function(_this) {
                return function(newValue, oldValue) {
                  if (!_.isEqual(newValue, oldValue)) {
                    return _this.refreshMapType();
                  }
                };
              })(this), true);
            }
            this.scope.$on('$destroy', (function(_this) {
              return function() {
                _this.hideOverlay();
                return _this.mapType = null;
              };
            })(this));
          }
          MapTypeParentModel.prototype.createMapType = function() {
            if (this.scope.options.getTile != null) {
              this.mapType = this.scope.options;
            } else if (this.scope.options.getTileUrl != null) {
              this.mapType = new google.maps.ImageMapType(this.scope.options);
            } else {
              this.$log.info('options should provide either getTile or getTileUrl methods. Map type creation aborted!!');
              return;
            }
            if (this.attrs.id && this.scope.id) {
              this.gMap.mapTypes.set(this.scope.id, this.mapType);
              if (!angular.isDefined(this.attrs.show)) {
                this.doShow = false;
              }
            }
            return this.mapType.layerId = this.id;
          };
          MapTypeParentModel.prototype.refreshMapType = function() {
            this.hideOverlay();
            this.mapType = null;
            this.createMapType();
            if (this.doShow && (this.gMap != null)) {
              return this.showOverlay();
            }
          };
          MapTypeParentModel.prototype.showOverlay = function() {
            return this.gMap.overlayMapTypes.push(this.mapType);
          };
          MapTypeParentModel.prototype.hideOverlay = function() {
            var found;
            found = false;
            return this.gMap.overlayMapTypes.forEach((function(_this) {
              return function(mapType, index) {
                if (!found && mapType.layerId === _this.id) {
                  found = true;
                  _this.gMap.overlayMapTypes.removeAt(index);
                }
              };
            })(this));
          };
          return MapTypeParentModel;
        })(BaseObject);
        return MapTypeParentModel;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api.models.parent").factory("uiGmapMarkersParentModel", ["uiGmapIMarkerParentModel", "uiGmapModelsWatcher", "uiGmapPropMap", "uiGmapMarkerChildModel", "uiGmap_async", "uiGmapClustererMarkerManager", "uiGmapMarkerManager", "$timeout", "uiGmapIMarker", "uiGmapPromise", "uiGmapGmapUtil", "uiGmapLogger", "uiGmapSpiderfierMarkerManager", function(IMarkerParentModel, ModelsWatcher, PropMap, MarkerChildModel, _async, ClustererMarkerManager, MarkerManager, $timeout, IMarker, uiGmapPromise, GmapUtil, $log, SpiderfierMarkerManager) {
        var MarkersParentModel,
            _setPlurals;
        _setPlurals = function(val, objToSet) {
          objToSet.plurals = new PropMap();
          objToSet.scope.plurals = objToSet.plurals;
          return objToSet;
        };
        MarkersParentModel = (function(superClass) {
          extend(MarkersParentModel, superClass);
          MarkersParentModel.include(GmapUtil);
          MarkersParentModel.include(ModelsWatcher);
          function MarkersParentModel(scope, element, attrs, map) {
            this.maybeExecMappedEvent = bind(this.maybeExecMappedEvent, this);
            this.onDestroy = bind(this.onDestroy, this);
            this.newChildMarker = bind(this.newChildMarker, this);
            this.pieceMeal = bind(this.pieceMeal, this);
            this.rebuildAll = bind(this.rebuildAll, this);
            this.createAllNew = bind(this.createAllNew, this);
            this.bindToTypeEvents = bind(this.bindToTypeEvents, this);
            this.createChildScopes = bind(this.createChildScopes, this);
            this.validateScope = bind(this.validateScope, this);
            this.onWatch = bind(this.onWatch, this);
            var self;
            MarkersParentModel.__super__.constructor.call(this, scope, element, attrs, map);
            this["interface"] = IMarker;
            self = this;
            _setPlurals(new PropMap(), this);
            this.scope.pluralsUpdate = {updateCtr: 0};
            this.$log.info(this);
            this.doRebuildAll = this.scope.doRebuildAll != null ? this.scope.doRebuildAll : false;
            this.setIdKey(this.scope);
            this.scope.$watch('doRebuildAll', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  return _this.doRebuildAll = newValue;
                }
              };
            })(this));
            if (!this.modelsLength()) {
              this.modelsRendered = false;
            }
            this.scope.$watch('models', (function(_this) {
              return function(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue) || !_this.modelsRendered) {
                  if (newValue.length === 0 && oldValue.length === 0) {
                    return;
                  }
                  _this.modelsRendered = true;
                  return _this.onWatch('models', _this.scope, newValue, oldValue);
                }
              };
            })(this), !this.isTrue(attrs.modelsbyref));
            this.watch('doCluster', this.scope);
            this.watch('type', this.scope);
            this.watch('clusterOptions', this.scope);
            this.watch('clusterEvents', this.scope);
            this.watch('typeOptions', this.scope);
            this.watch('typeEvents', this.scope);
            this.watch('fit', this.scope);
            this.watch('idKey', this.scope);
            this.gManager = void 0;
            this.createAllNew(this.scope);
          }
          MarkersParentModel.prototype.onWatch = function(propNameToWatch, scope, newValue, oldValue) {
            if (propNameToWatch === "idKey" && newValue !== oldValue) {
              this.idKey = newValue;
            }
            if (this.doRebuildAll || (propNameToWatch === 'doCluster' || propNameToWatch === 'type')) {
              return this.rebuildAll(scope);
            } else {
              return this.pieceMeal(scope);
            }
          };
          MarkersParentModel.prototype.validateScope = function(scope) {
            var modelsNotDefined;
            modelsNotDefined = angular.isUndefined(scope.models) || scope.models === void 0;
            if (modelsNotDefined) {
              this.$log.error(this.constructor.name + ": no valid models attribute found");
            }
            return MarkersParentModel.__super__.validateScope.call(this, scope) || modelsNotDefined;
          };
          MarkersParentModel.prototype.createChildScopes = function(isCreatingFromScratch) {
            if ((this.gMap == null) || (this.scope.models == null)) {
              return;
            }
            if (isCreatingFromScratch) {
              return this.createAllNew(this.scope, false);
            } else {
              return this.pieceMeal(this.scope, false);
            }
          };
          MarkersParentModel.prototype.bindToTypeEvents = function(typeEvents, events) {
            var internalHandles,
                self;
            if (events == null) {
              events = ['click', 'mouseout', 'mouseover'];
            }
            self = this;
            if (!this.origTypeEvents) {
              this.origTypeEvents = {};
              _.each(events, (function(_this) {
                return function(eventName) {
                  return _this.origTypeEvents[eventName] = typeEvents != null ? typeEvents[eventName] : void 0;
                };
              })(this));
            } else {
              angular.extend(typeEvents, this.origTypeEvents);
            }
            internalHandles = {};
            _.each(events, (function(_this) {
              return function(eventName) {
                return internalHandles[eventName] = function(group) {
                  return self.maybeExecMappedEvent(group, eventName);
                };
              };
            })(this));
            return angular.extend(typeEvents, internalHandles);
          };
          MarkersParentModel.prototype.createAllNew = function(scope) {
            var isSpiderfied,
                maybeCanceled,
                typeEvents,
                typeOptions;
            if (this.gManager != null) {
              if (this.gManager instanceof SpiderfierMarkerManager) {
                isSpiderfied = this.gManager.isSpiderfied();
              }
              this.gManager.clear();
              delete this.gManager;
            }
            typeEvents = scope.typeEvents || scope.clusterEvents;
            typeOptions = scope.typeOptions || scope.clusterOptions;
            if (scope.doCluster || scope.type === 'cluster') {
              if (typeEvents != null) {
                this.bindToTypeEvents(typeEvents);
              }
              this.gManager = new ClustererMarkerManager(this.map, void 0, typeOptions, typeEvents);
            } else if (scope.type === 'spider') {
              if (typeEvents != null) {
                this.bindToTypeEvents(typeEvents, ['spiderfy', 'unspiderfy']);
              }
              this.gManager = new SpiderfierMarkerManager(this.map, void 0, typeOptions, typeEvents, this.scope);
              if (isSpiderfied) {
                this.gManager.spiderfy();
              }
            } else {
              this.gManager = new MarkerManager(this.map);
            }
            if (this.didQueueInitPromise(this, scope)) {
              return;
            }
            maybeCanceled = null;
            return _async.promiseLock(this, uiGmapPromise.promiseTypes.create, 'createAllNew', (function(canceledMsg) {
              return maybeCanceled = canceledMsg;
            }), (function(_this) {
              return function() {
                return _async.each(scope.models, function(model) {
                  _this.newChildMarker(model, scope);
                  return maybeCanceled;
                }, _async.chunkSizeFrom(scope.chunk)).then(function() {
                  _this.modelsRendered = true;
                  if (scope.fit) {
                    _this.gManager.fit();
                  }
                  _this.gManager.draw();
                  return _this.scope.pluralsUpdate.updateCtr += 1;
                }, _async.chunkSizeFrom(scope.chunk));
              };
            })(this));
          };
          MarkersParentModel.prototype.rebuildAll = function(scope) {
            var ref;
            if (!scope.doRebuild && scope.doRebuild !== void 0) {
              return;
            }
            if ((ref = this.scope.plurals) != null ? ref.length : void 0) {
              return this.onDestroy(scope).then((function(_this) {
                return function() {
                  return _this.createAllNew(scope);
                };
              })(this));
            } else {
              return this.createAllNew(scope);
            }
          };
          MarkersParentModel.prototype.pieceMeal = function(scope) {
            var maybeCanceled,
                payload;
            if (scope.$$destroyed) {
              return;
            }
            maybeCanceled = null;
            payload = null;
            if (this.modelsLength() && this.scope.plurals.length) {
              return _async.promiseLock(this, uiGmapPromise.promiseTypes.update, 'pieceMeal', (function(canceledMsg) {
                return maybeCanceled = canceledMsg;
              }), (function(_this) {
                return function() {
                  return uiGmapPromise.promise((function() {
                    return _this.figureOutState(_this.idKey, scope, _this.scope.plurals, _this.modelKeyComparison);
                  })).then(function(state) {
                    payload = state;
                    return _async.each(payload.removals, function(child) {
                      if (child != null) {
                        if (child.destroy != null) {
                          child.destroy();
                        }
                        _this.scope.plurals.remove(child.id);
                        return maybeCanceled;
                      }
                    }, _async.chunkSizeFrom(scope.chunk));
                  }).then(function() {
                    return _async.each(payload.adds, function(modelToAdd) {
                      _this.newChildMarker(modelToAdd, scope);
                      return maybeCanceled;
                    }, _async.chunkSizeFrom(scope.chunk));
                  }).then(function() {
                    return _async.each(payload.updates, function(update) {
                      _this.updateChild(update.child, update.model);
                      return maybeCanceled;
                    }, _async.chunkSizeFrom(scope.chunk));
                  }).then(function() {
                    if (payload.adds.length > 0 || payload.removals.length > 0 || payload.updates.length > 0) {
                      scope.plurals = _this.scope.plurals;
                      if (scope.fit) {
                        _this.gManager.fit();
                      }
                      _this.gManager.draw();
                    }
                    return _this.scope.pluralsUpdate.updateCtr += 1;
                  });
                };
              })(this));
            } else {
              this.inProgress = false;
              return this.rebuildAll(scope);
            }
          };
          MarkersParentModel.prototype.newChildMarker = function(model, scope) {
            var child,
                childScope,
                doDrawSelf,
                keys;
            if (model[this.idKey] == null) {
              this.$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.");
              return;
            }
            this.$log.info('child', child, 'markers', this.scope.markerModels);
            childScope = scope.$new(false);
            childScope.events = scope.events;
            keys = {};
            IMarker.scopeKeys.forEach(function(k) {
              return keys[k] = scope[k];
            });
            child = new MarkerChildModel(childScope, model, keys, this.map, this.DEFAULTS, this.doClick, this.gManager, doDrawSelf = false);
            this.scope.plurals.put(model[this.idKey], child);
            return child;
          };
          MarkersParentModel.prototype.onDestroy = function(scope) {
            MarkersParentModel.__super__.onDestroy.call(this, scope);
            return _async.promiseLock(this, uiGmapPromise.promiseTypes["delete"], void 0, void 0, (function(_this) {
              return function() {
                return _async.each(_this.scope.plurals.values(), function(model) {
                  if (model != null) {
                    return model.destroy(false);
                  }
                }, _async.chunkSizeFrom(_this.scope.cleanchunk, false)).then(function() {
                  if (_this.gManager != null) {
                    _this.gManager.destroy();
                  }
                  _this.plurals.removeAll();
                  if (_this.plurals !== _this.scope.plurals) {
                    console.error('plurals out of sync for MarkersParentModel');
                  }
                  return _this.scope.pluralsUpdate.updateCtr += 1;
                });
              };
            })(this));
          };
          MarkersParentModel.prototype.maybeExecMappedEvent = function(group, fnName) {
            var pair,
                typeEvents;
            if (this.scope.$$destroyed) {
              return;
            }
            typeEvents = this.scope.typeEvents || this.scope.clusterEvents;
            if (_.isFunction(typeEvents != null ? typeEvents[fnName] : void 0)) {
              pair = this.mapTypeToPlurals(group);
              if (this.origTypeEvents[fnName]) {
                return this.origTypeEvents[fnName](pair.group, pair.mapped);
              }
            }
          };
          MarkersParentModel.prototype.mapTypeToPlurals = function(group) {
            var arrayToMap,
                mapped,
                ref;
            if (_.isArray(group)) {
              arrayToMap = group;
            } else if (_.isFunction(group.getMarkers)) {
              arrayToMap = group.getMarkers();
            }
            if (arrayToMap == null) {
              $log.error("Unable to map event as we cannot find the array group to map");
              return;
            }
            if ((ref = this.scope.plurals.values()) != null ? ref.length : void 0) {
              mapped = arrayToMap.map((function(_this) {
                return function(g) {
                  return _this.scope.plurals.get(g.key).model;
                };
              })(this));
            } else {
              mapped = [];
            }
            return {
              cluster: group,
              mapped: mapped,
              group: group
            };
          };
          MarkersParentModel.prototype.getItem = function(scope, modelsPropToIterate, index) {
            if (modelsPropToIterate === 'models') {
              return scope[modelsPropToIterate][index];
            }
            return scope[modelsPropToIterate].get(index);
          };
          return MarkersParentModel;
        })(IMarkerParentModel);
        return MarkersParentModel;
      }]);
    }).call(this);
    ;
    (function() {
      ['Polygon', 'Polyline'].forEach(function(name) {
        return angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory("uiGmap" + name + "sParentModel", ['uiGmapBasePolysParentModel', "uiGmap" + name + "ChildModel", "uiGmapI" + name, function(BasePolysParentModel, ChildModel, IPoly) {
          return BasePolysParentModel(IPoly, ChildModel, name);
        }]);
      });
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapRectangleParentModel', ['uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapEventsHelper', 'uiGmapRectangleOptionsBuilder', function($log, GmapUtil, EventsHelper, Builder) {
        var RectangleParentModel;
        return RectangleParentModel = (function(superClass) {
          extend(RectangleParentModel, superClass);
          RectangleParentModel.include(GmapUtil);
          RectangleParentModel.include(EventsHelper);
          function RectangleParentModel(scope, element, attrs, map, DEFAULTS) {
            var bounds,
                clear,
                createBounds,
                dragging,
                fit,
                gObject,
                init,
                listeners,
                myListeners,
                settingBoundsFromScope,
                updateBounds;
            this.scope = scope;
            this.attrs = attrs;
            this.map = map;
            this.DEFAULTS = DEFAULTS;
            bounds = void 0;
            dragging = false;
            myListeners = [];
            listeners = void 0;
            fit = (function(_this) {
              return function() {
                if (_this.isTrue(_this.attrs.fit)) {
                  return _this.fitMapBounds(_this.map, bounds);
                }
              };
            })(this);
            createBounds = (function(_this) {
              return function() {
                var ref,
                    ref1,
                    ref2;
                if ((_this.scope.bounds != null) && (((ref = _this.scope.bounds) != null ? ref.sw : void 0) != null) && (((ref1 = _this.scope.bounds) != null ? ref1.ne : void 0) != null) && _this.validateBoundPoints(_this.scope.bounds)) {
                  bounds = _this.convertBoundPoints(_this.scope.bounds);
                  return $log.info("new new bounds created: " + (JSON.stringify(bounds)));
                } else if ((_this.scope.bounds.getNorthEast != null) && (_this.scope.bounds.getSouthWest != null)) {
                  return bounds = _this.scope.bounds;
                } else {
                  if (_this.scope.bounds != null) {
                    return $log.error("Invalid bounds for newValue: " + (JSON.stringify((ref2 = _this.scope) != null ? ref2.bounds : void 0)));
                  }
                }
              };
            })(this);
            createBounds();
            gObject = new google.maps.Rectangle(this.buildOpts(bounds));
            $log.info("gObject (rectangle) created: " + gObject);
            settingBoundsFromScope = false;
            updateBounds = (function(_this) {
              return function() {
                var b,
                    ne,
                    sw;
                b = gObject.getBounds();
                ne = b.getNorthEast();
                sw = b.getSouthWest();
                if (settingBoundsFromScope) {
                  return;
                }
                return _this.scope.$evalAsync(function(s) {
                  if ((s.bounds != null) && (s.bounds.sw != null) && (s.bounds.ne != null)) {
                    s.bounds.ne = {
                      latitude: ne.lat(),
                      longitude: ne.lng()
                    };
                    s.bounds.sw = {
                      latitude: sw.lat(),
                      longitude: sw.lng()
                    };
                  }
                  if ((s.bounds.getNorthEast != null) && (s.bounds.getSouthWest != null)) {
                    return s.bounds = b;
                  }
                });
              };
            })(this);
            init = (function(_this) {
              return function() {
                fit();
                _this.removeEvents(myListeners);
                myListeners.push(google.maps.event.addListener(gObject, 'dragstart', function() {
                  return dragging = true;
                }));
                myListeners.push(google.maps.event.addListener(gObject, 'dragend', function() {
                  dragging = false;
                  return updateBounds();
                }));
                return myListeners.push(google.maps.event.addListener(gObject, 'bounds_changed', function() {
                  if (dragging) {
                    return;
                  }
                  return updateBounds();
                }));
              };
            })(this);
            clear = (function(_this) {
              return function() {
                _this.removeEvents(myListeners);
                if (listeners != null) {
                  _this.removeEvents(listeners);
                }
                return gObject.setMap(null);
              };
            })(this);
            if (bounds != null) {
              init();
            }
            this.scope.$watch('bounds', (function(newValue, oldValue) {
              var isNew;
              if (_.isEqual(newValue, oldValue) && (bounds != null) || dragging) {
                return;
              }
              settingBoundsFromScope = true;
              if (newValue == null) {
                clear();
                return;
              }
              if (bounds == null) {
                isNew = true;
              } else {
                fit();
              }
              createBounds();
              gObject.setBounds(bounds);
              settingBoundsFromScope = false;
              if (isNew && (bounds != null)) {
                return init();
              }
            }), true);
            this.setMyOptions = (function(_this) {
              return function(newVals, oldVals) {
                if (!_.isEqual(newVals, oldVals)) {
                  if ((bounds != null) && (newVals != null)) {
                    return gObject.setOptions(_this.buildOpts(bounds));
                  }
                }
              };
            })(this);
            this.props.push('bounds');
            this.watchProps(this.props);
            if (this.attrs.events != null) {
              listeners = this.setEvents(gObject, this.scope, this.scope);
              this.scope.$watch('events', (function(_this) {
                return function(newValue, oldValue) {
                  if (!_.isEqual(newValue, oldValue)) {
                    if (listeners != null) {
                      _this.removeEvents(listeners);
                    }
                    return listeners = _this.setEvents(gObject, _this.scope, _this.scope);
                  }
                };
              })(this));
            }
            this.scope.$on('$destroy', (function(_this) {
              return function() {
                return clear();
              };
            })(this));
            $log.info(this);
          }
          return RectangleParentModel;
        })(Builder);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapSearchBoxParentModel', ['uiGmapBaseObject', 'uiGmapLogger', 'uiGmapEventsHelper', '$timeout', '$http', '$templateCache', function(BaseObject, Logger, EventsHelper, $timeout, $http, $templateCache) {
        var SearchBoxParentModel;
        SearchBoxParentModel = (function(superClass) {
          extend(SearchBoxParentModel, superClass);
          SearchBoxParentModel.include(EventsHelper);
          function SearchBoxParentModel(scope, element, attrs, gMap, ctrlPosition, template, $log) {
            var controlDiv;
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.gMap = gMap;
            this.ctrlPosition = ctrlPosition;
            this.template = template;
            this.$log = $log != null ? $log : Logger;
            this.setVisibility = bind(this.setVisibility, this);
            this.getBounds = bind(this.getBounds, this);
            this.setBounds = bind(this.setBounds, this);
            this.createSearchBox = bind(this.createSearchBox, this);
            this.addToParentDiv = bind(this.addToParentDiv, this);
            this.addAsMapControl = bind(this.addAsMapControl, this);
            this.init = bind(this.init, this);
            if (this.attrs.template == null) {
              this.$log.error('template attribute for the search-box directive is mandatory. Places Search Box creation aborted!!');
              return;
            }
            if (angular.isUndefined(this.scope.options)) {
              this.scope.options = {};
              this.scope.options.visible = true;
            }
            if (angular.isUndefined(this.scope.options.visible)) {
              this.scope.options.visible = true;
            }
            if (angular.isUndefined(this.scope.options.autocomplete)) {
              this.scope.options.autocomplete = false;
            }
            this.visible = this.scope.options.visible;
            this.autocomplete = this.scope.options.autocomplete;
            controlDiv = angular.element('<div></div>');
            controlDiv.append(this.template);
            this.input = controlDiv.find('input')[0];
            this.init();
          }
          SearchBoxParentModel.prototype.init = function() {
            this.createSearchBox();
            this.scope.$watch('options', (function(_this) {
              return function(newValue, oldValue) {
                if (angular.isObject(newValue)) {
                  if (newValue.bounds != null) {
                    _this.setBounds(newValue.bounds);
                  }
                  if (newValue.visible != null) {
                    if (_this.visible !== newValue.visible) {
                      return _this.setVisibility(newValue.visible);
                    }
                  }
                }
              };
            })(this), true);
            if (this.attrs.parentdiv != null) {
              this.addToParentDiv();
            } else {
              this.addAsMapControl();
            }
            if (!this.visible) {
              this.setVisibility(this.visible);
            }
            if (this.autocomplete) {
              this.listener = google.maps.event.addListener(this.gObject, 'place_changed', (function(_this) {
                return function() {
                  return _this.places = _this.gObject.getPlace();
                };
              })(this));
            } else {
              this.listener = google.maps.event.addListener(this.gObject, 'places_changed', (function(_this) {
                return function() {
                  return _this.places = _this.gObject.getPlaces();
                };
              })(this));
            }
            this.listeners = this.setEvents(this.gObject, this.scope, this.scope);
            this.$log.info(this);
            return this.scope.$on('$destroy', (function(_this) {
              return function() {
                return _this.gObject = null;
              };
            })(this));
          };
          SearchBoxParentModel.prototype.addAsMapControl = function() {
            return this.gMap.controls[google.maps.ControlPosition[this.ctrlPosition]].push(this.input);
          };
          SearchBoxParentModel.prototype.addToParentDiv = function() {
            this.parentDiv = angular.element(document.getElementById(this.scope.parentdiv));
            return this.parentDiv.append(this.input);
          };
          SearchBoxParentModel.prototype.createSearchBox = function() {
            if (this.autocomplete) {
              return this.gObject = new google.maps.places.Autocomplete(this.input, this.scope.options);
            } else {
              return this.gObject = new google.maps.places.SearchBox(this.input, this.scope.options);
            }
          };
          SearchBoxParentModel.prototype.setBounds = function(bounds) {
            if (angular.isUndefined(bounds.isEmpty)) {
              this.$log.error('Error: SearchBoxParentModel setBounds. Bounds not an instance of LatLngBounds.');
            } else {
              if (bounds.isEmpty() === false) {
                if (this.gObject != null) {
                  return this.gObject.setBounds(bounds);
                }
              }
            }
          };
          SearchBoxParentModel.prototype.getBounds = function() {
            return this.gObject.getBounds();
          };
          SearchBoxParentModel.prototype.setVisibility = function(val) {
            if (this.attrs.parentdiv != null) {
              if (val === false) {
                this.parentDiv.addClass("ng-hide");
              } else {
                this.parentDiv.removeClass("ng-hide");
              }
            } else {
              if (val === false) {
                this.gMap.controls[google.maps.ControlPosition[this.ctrlPosition]].clear();
              } else {
                this.gMap.controls[google.maps.ControlPosition[this.ctrlPosition]].push(this.input);
              }
            }
            return this.visible = val;
          };
          return SearchBoxParentModel;
        })(BaseObject);
        return SearchBoxParentModel;
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api.models.parent').factory('uiGmapWindowsParentModel', ['uiGmapIWindowParentModel', 'uiGmapModelsWatcher', 'uiGmapPropMap', 'uiGmapWindowChildModel', 'uiGmapLinked', 'uiGmap_async', 'uiGmapLogger', '$timeout', '$compile', '$http', '$templateCache', '$interpolate', 'uiGmapPromise', 'uiGmapIWindow', 'uiGmapGmapUtil', function(IWindowParentModel, ModelsWatcher, PropMap, WindowChildModel, Linked, _async, $log, $timeout, $compile, $http, $templateCache, $interpolate, uiGmapPromise, IWindow, GmapUtil) {
        var WindowsParentModel;
        WindowsParentModel = (function(superClass) {
          extend(WindowsParentModel, superClass);
          WindowsParentModel.include(ModelsWatcher);
          function WindowsParentModel(scope, element, attrs, ctrls, gMap1, markersScope) {
            this.gMap = gMap1;
            this.markersScope = markersScope;
            this.modelKeyComparison = bind(this.modelKeyComparison, this);
            this.interpolateContent = bind(this.interpolateContent, this);
            this.setChildScope = bind(this.setChildScope, this);
            this.createWindow = bind(this.createWindow, this);
            this.setContentKeys = bind(this.setContentKeys, this);
            this.pieceMeal = bind(this.pieceMeal, this);
            this.createAllNew = bind(this.createAllNew, this);
            this.watchIdKey = bind(this.watchIdKey, this);
            this.createChildScopes = bind(this.createChildScopes, this);
            this.watchOurScope = bind(this.watchOurScope, this);
            this.watchDestroy = bind(this.watchDestroy, this);
            this.onDestroy = bind(this.onDestroy, this);
            this.rebuildAll = bind(this.rebuildAll, this);
            this.doINeedToWipe = bind(this.doINeedToWipe, this);
            this.watchModels = bind(this.watchModels, this);
            this.go = bind(this.go, this);
            WindowsParentModel.__super__.constructor.call(this, scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache);
            this["interface"] = IWindow;
            this.plurals = new PropMap();
            _.each(IWindow.scopeKeys, (function(_this) {
              return function(name) {
                return _this[name + 'Key'] = void 0;
              };
            })(this));
            this.linked = new Linked(scope, element, attrs, ctrls);
            this.contentKeys = void 0;
            this.isIconVisibleOnClick = void 0;
            this.firstTime = true;
            this.firstWatchModels = true;
            this.$log.info(self);
            this.parentScope = void 0;
            this.go(scope);
          }
          WindowsParentModel.prototype.go = function(scope) {
            this.watchOurScope(scope);
            this.doRebuildAll = this.scope.doRebuildAll != null ? this.scope.doRebuildAll : false;
            scope.$watch('doRebuildAll', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  return _this.doRebuildAll = newValue;
                }
              };
            })(this));
            return this.createChildScopes();
          };
          WindowsParentModel.prototype.watchModels = function(scope) {
            var itemToWatch;
            itemToWatch = this.markersScope != null ? 'pluralsUpdate' : 'models';
            return scope.$watch(itemToWatch, (function(_this) {
              return function(newValue, oldValue) {
                var doScratch;
                if (!_.isEqual(newValue, oldValue) || _this.firstWatchModels) {
                  _this.firstWatchModels = false;
                  if (_this.doRebuildAll || _this.doINeedToWipe(scope.models)) {
                    return _this.rebuildAll(scope, true, true);
                  } else {
                    doScratch = _this.plurals.length === 0;
                    if (_this.existingPieces != null) {
                      return _.last(_this.existingPieces._content).then(function() {
                        return _this.createChildScopes(doScratch);
                      });
                    } else {
                      return _this.createChildScopes(doScratch);
                    }
                  }
                }
              };
            })(this), true);
          };
          WindowsParentModel.prototype.doINeedToWipe = function(newValue) {
            var newValueIsEmpty;
            newValueIsEmpty = newValue != null ? newValue.length === 0 : true;
            return this.plurals.length > 0 && newValueIsEmpty;
          };
          WindowsParentModel.prototype.rebuildAll = function(scope, doCreate, doDelete) {
            return this.onDestroy(doDelete).then((function(_this) {
              return function() {
                if (doCreate) {
                  return _this.createChildScopes();
                }
              };
            })(this));
          };
          WindowsParentModel.prototype.onDestroy = function(scope) {
            WindowsParentModel.__super__.onDestroy.call(this, this.scope);
            return _async.promiseLock(this, uiGmapPromise.promiseTypes["delete"], void 0, void 0, (function(_this) {
              return function() {
                return _async.each(_this.plurals.values(), function(child) {
                  return child.destroy();
                }, _async.chunkSizeFrom(_this.scope.cleanchunk, false)).then(function() {
                  var ref;
                  return (ref = _this.plurals) != null ? ref.removeAll() : void 0;
                });
              };
            })(this));
          };
          WindowsParentModel.prototype.watchDestroy = function(scope) {
            return scope.$on('$destroy', (function(_this) {
              return function() {
                _this.firstWatchModels = true;
                _this.firstTime = true;
                return _this.rebuildAll(scope, false, true);
              };
            })(this));
          };
          WindowsParentModel.prototype.watchOurScope = function(scope) {
            return _.each(IWindow.scopeKeys, (function(_this) {
              return function(name) {
                var nameKey;
                nameKey = name + 'Key';
                return _this[nameKey] = typeof scope[name] === 'function' ? scope[name]() : scope[name];
              };
            })(this));
          };
          WindowsParentModel.prototype.createChildScopes = function(isCreatingFromScratch) {
            var modelsNotDefined,
                ref,
                ref1;
            if (isCreatingFromScratch == null) {
              isCreatingFromScratch = true;
            }
            this.isIconVisibleOnClick = true;
            if (angular.isDefined(this.linked.attrs.isiconvisibleonclick)) {
              this.isIconVisibleOnClick = this.linked.scope.isIconVisibleOnClick;
            }
            modelsNotDefined = angular.isUndefined(this.linked.scope.models);
            if (modelsNotDefined && (this.markersScope === void 0 || (((ref = this.markersScope) != null ? ref.plurals : void 0) === void 0 || ((ref1 = this.markersScope) != null ? ref1.models : void 0) === void 0))) {
              this.$log.error('No models to create windows from! Need direct models or models derived from markers!');
              return;
            }
            if (this.gMap != null) {
              if (this.linked.scope.models != null) {
                this.watchIdKey(this.linked.scope);
                if (isCreatingFromScratch) {
                  return this.createAllNew(this.linked.scope, false);
                } else {
                  return this.pieceMeal(this.linked.scope, false);
                }
              } else {
                this.parentScope = this.markersScope;
                this.watchIdKey(this.parentScope);
                if (isCreatingFromScratch) {
                  return this.createAllNew(this.markersScope, true, 'plurals', false);
                } else {
                  return this.pieceMeal(this.markersScope, true, 'plurals', false);
                }
              }
            }
          };
          WindowsParentModel.prototype.watchIdKey = function(scope) {
            this.setIdKey(scope);
            return scope.$watch('idKey', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue && (newValue == null)) {
                  _this.idKey = newValue;
                  return _this.rebuildAll(scope, true, true);
                }
              };
            })(this));
          };
          WindowsParentModel.prototype.createAllNew = function(scope, hasGMarker, modelsPropToIterate, isArray) {
            var maybeCanceled;
            if (modelsPropToIterate == null) {
              modelsPropToIterate = 'models';
            }
            if (isArray == null) {
              isArray = false;
            }
            if (this.firstTime) {
              this.watchModels(scope);
              this.watchDestroy(scope);
            }
            this.setContentKeys(scope.models);
            if (this.didQueueInitPromise(this, scope)) {
              return;
            }
            maybeCanceled = null;
            return _async.promiseLock(this, uiGmapPromise.promiseTypes.create, 'createAllNew', (function(canceledMsg) {
              return maybeCanceled = canceledMsg;
            }), (function(_this) {
              return function() {
                return _async.each(scope.models, function(model) {
                  var gMarker,
                      ref;
                  gMarker = hasGMarker ? (ref = _this.getItem(scope, modelsPropToIterate, model[_this.idKey])) != null ? ref.gObject : void 0 : void 0;
                  if (!maybeCanceled) {
                    if (!gMarker && _this.markersScope) {
                      $log.error('Unable to get gMarker from markersScope!');
                    }
                    _this.createWindow(model, gMarker, _this.gMap);
                  }
                  return maybeCanceled;
                }, _async.chunkSizeFrom(scope.chunk)).then(function() {
                  return _this.firstTime = false;
                });
              };
            })(this));
          };
          WindowsParentModel.prototype.pieceMeal = function(scope, hasGMarker, modelsPropToIterate, isArray) {
            var maybeCanceled,
                payload;
            if (modelsPropToIterate == null) {
              modelsPropToIterate = 'models';
            }
            if (isArray == null) {
              isArray = true;
            }
            if (scope.$$destroyed) {
              return;
            }
            maybeCanceled = null;
            payload = null;
            if ((scope != null) && this.modelsLength() && this.plurals.length) {
              return _async.promiseLock(this, uiGmapPromise.promiseTypes.update, 'pieceMeal', (function(canceledMsg) {
                return maybeCanceled = canceledMsg;
              }), (function(_this) {
                return function() {
                  return uiGmapPromise.promise((function() {
                    return _this.figureOutState(_this.idKey, scope, _this.plurals, _this.modelKeyComparison);
                  })).then(function(state) {
                    payload = state;
                    return _async.each(payload.removals, function(child) {
                      if (child != null) {
                        _this.plurals.remove(child.id);
                        if (child.destroy != null) {
                          child.destroy(true);
                        }
                        return maybeCanceled;
                      }
                    }, _async.chunkSizeFrom(scope.chunk));
                  }).then(function() {
                    return _async.each(payload.adds, function(modelToAdd) {
                      var gMarker,
                          ref;
                      gMarker = (ref = _this.getItem(scope, modelsPropToIterate, modelToAdd[_this.idKey])) != null ? ref.gObject : void 0;
                      if (!gMarker) {
                        throw 'Gmarker undefined';
                      }
                      _this.createWindow(modelToAdd, gMarker, _this.gMap);
                      return maybeCanceled;
                    });
                  }).then(function() {
                    return _async.each(payload.updates, function(update) {
                      _this.updateChild(update.child, update.model);
                      return maybeCanceled;
                    }, _async.chunkSizeFrom(scope.chunk));
                  });
                };
              })(this));
            } else {
              $log.debug('pieceMeal: rebuildAll');
              return this.rebuildAll(this.scope, true, true);
            }
          };
          WindowsParentModel.prototype.setContentKeys = function(models) {
            if (this.modelsLength(models)) {
              return this.contentKeys = Object.keys(models[0]);
            }
          };
          WindowsParentModel.prototype.createWindow = function(model, gMarker, gMap) {
            var child,
                childScope,
                fakeElement,
                opts,
                ref,
                ref1;
            childScope = this.linked.scope.$new(false);
            this.setChildScope(childScope, model);
            childScope.$watch('model', (function(_this) {
              return function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  return _this.setChildScope(childScope, newValue);
                }
              };
            })(this), true);
            fakeElement = {html: (function(_this) {
                return function() {
                  return _this.interpolateContent(_this.linked.element.html(), model);
                };
              })(this)};
            this.DEFAULTS = this.scopeOrModelVal(this.optionsKey, this.scope, model) || {};
            opts = this.createWindowOptions(gMarker, childScope, fakeElement.html(), this.DEFAULTS);
            child = new WindowChildModel(model, childScope, opts, this.isIconVisibleOnClick, gMap, (ref = this.markersScope) != null ? (ref1 = ref.plurals.get(model[this.idKey])) != null ? ref1.scope : void 0 : void 0, fakeElement, false, true);
            if (model[this.idKey] == null) {
              this.$log.error('Window model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.');
              return;
            }
            this.plurals.put(model[this.idKey], child);
            return child;
          };
          WindowsParentModel.prototype.setChildScope = function(childScope, model) {
            _.each(IWindow.scopeKeys, (function(_this) {
              return function(name) {
                var nameKey,
                    newValue;
                nameKey = name + 'Key';
                newValue = _this[nameKey] === 'self' ? model : model[_this[nameKey]];
                if (newValue !== childScope[name]) {
                  return childScope[name] = newValue;
                }
              };
            })(this));
            return childScope.model = model;
          };
          WindowsParentModel.prototype.interpolateContent = function(content, model) {
            var exp,
                i,
                interpModel,
                key,
                len,
                ref;
            if (this.contentKeys === void 0 || this.contentKeys.length === 0) {
              return;
            }
            exp = $interpolate(content);
            interpModel = {};
            ref = this.contentKeys;
            for (i = 0, len = ref.length; i < len; i++) {
              key = ref[i];
              interpModel[key] = model[key];
            }
            return exp(interpModel);
          };
          WindowsParentModel.prototype.modelKeyComparison = function(model1, model2) {
            var isEqual,
                scope;
            scope = this.scope.coords != null ? this.scope : this.parentScope;
            if (scope == null) {
              throw 'No scope or parentScope set!';
            }
            isEqual = GmapUtil.equalCoords(this.evalModelHandle(model1, scope.coords), this.evalModelHandle(model2, scope.coords));
            if (!isEqual) {
              return isEqual;
            }
            isEqual = _.every(_.without(this["interface"].scopeKeys, 'coords'), (function(_this) {
              return function(k) {
                return _this.evalModelHandle(model1, scope[k]) === _this.evalModelHandle(model2, scope[k]);
              };
            })(this));
            return isEqual;
          };
          return WindowsParentModel;
        })(IWindowParentModel);
        return WindowsParentModel;
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapCircle", ["uiGmapICircle", "uiGmapCircleParentModel", function(ICircle, CircleParentModel) {
        return _.extend(ICircle, {link: function(scope, element, attrs, mapCtrl) {
            return mapCtrl.getScope().deferred.promise.then((function(_this) {
              return function(map) {
                return new CircleParentModel(scope, element, attrs, map);
              };
            })(this));
          }});
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapControl", ["uiGmapIControl", "$http", "$templateCache", "$compile", "$controller", 'uiGmapGoogleMapApi', function(IControl, $http, $templateCache, $compile, $controller, GoogleMapApi) {
        var Control;
        return Control = (function(superClass) {
          extend(Control, superClass);
          function Control() {
            this.link = bind(this.link, this);
            Control.__super__.constructor.call(this);
          }
          Control.prototype.link = function(scope, element, attrs, ctrl) {
            return GoogleMapApi.then((function(_this) {
              return function(maps) {
                var index,
                    position;
                if (angular.isUndefined(scope.template)) {
                  _this.$log.error('mapControl: could not find a valid template property');
                  return;
                }
                index = angular.isDefined(scope.index && !isNaN(parseInt(scope.index))) ? parseInt(scope.index) : void 0;
                position = angular.isDefined(scope.position) ? scope.position.toUpperCase().replace(/-/g, '_') : 'TOP_CENTER';
                if (!maps.ControlPosition[position]) {
                  _this.$log.error('mapControl: invalid position property');
                  return;
                }
                return IControl.mapPromise(scope, ctrl).then(function(map) {
                  var control,
                      controlDiv;
                  control = void 0;
                  controlDiv = angular.element('<div></div>');
                  return $http.get(scope.template, {cache: $templateCache}).success(function(template) {
                    var templateCtrl,
                        templateScope;
                    templateScope = scope.$new();
                    controlDiv.append(template);
                    if (angular.isDefined(scope.controller)) {
                      templateCtrl = $controller(scope.controller, {$scope: templateScope});
                      controlDiv.children().data('$ngControllerController', templateCtrl);
                    }
                    control = $compile(controlDiv.children())(templateScope);
                    if (index) {
                      return control[0].index = index;
                    }
                  }).error(function(error) {
                    return _this.$log.error('mapControl: template could not be found');
                  }).then(function() {
                    return map.controls[google.maps.ControlPosition[position]].push(control[0]);
                  });
                });
              };
            })(this));
          };
          return Control;
        })(IControl);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapDragZoom', ['uiGmapCtrlHandle', 'uiGmapPropertyAction', function(CtrlHandle, PropertyAction) {
        return {
          restrict: 'EMA',
          transclude: true,
          template: '<div class="angular-google-map-dragzoom" ng-transclude style="display: none"></div>',
          require: '^' + 'uiGmapGoogleMap',
          scope: {
            keyboardkey: '=',
            options: '=',
            spec: '='
          },
          controller: ['$scope', '$element', function($scope, $element) {
            $scope.ctrlType = 'uiGmapDragZoom';
            return _.extend(this, CtrlHandle.handle($scope, $element));
          }],
          link: function(scope, element, attrs, ctrl) {
            return CtrlHandle.mapPromise(scope, ctrl).then(function(map) {
              var enableKeyDragZoom,
                  setKeyAction,
                  setOptionsAction;
              enableKeyDragZoom = function(opts) {
                map.enableKeyDragZoom(opts);
                if (scope.spec) {
                  return scope.spec.enableKeyDragZoom(opts);
                }
              };
              setKeyAction = new PropertyAction(function(key, newVal) {
                if (newVal) {
                  return enableKeyDragZoom({key: newVal});
                } else {
                  return enableKeyDragZoom();
                }
              });
              setOptionsAction = new PropertyAction(function(key, newVal) {
                if (newVal) {
                  return enableKeyDragZoom(newVal);
                }
              });
              scope.$watch('keyboardkey', setKeyAction.sic);
              setKeyAction.sic(scope.keyboardkey);
              scope.$watch('options', setOptionsAction.sic);
              return setOptionsAction.sic(scope.options);
            });
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapDrawingManager", ["uiGmapIDrawingManager", "uiGmapDrawingManagerParentModel", function(IDrawingManager, DrawingManagerParentModel) {
        return _.extend(IDrawingManager, {link: function(scope, element, attrs, mapCtrl) {
            return mapCtrl.getScope().deferred.promise.then(function(map) {
              return new DrawingManagerParentModel(scope, element, attrs, map);
            });
          }});
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapApiFreeDrawPolygons', ['uiGmapLogger', 'uiGmapBaseObject', 'uiGmapCtrlHandle', 'uiGmapDrawFreeHandChildModel', 'uiGmapLodash', function($log, BaseObject, CtrlHandle, DrawFreeHandChildModel, uiGmapLodash) {
        var FreeDrawPolygons;
        return FreeDrawPolygons = (function(superClass) {
          extend(FreeDrawPolygons, superClass);
          function FreeDrawPolygons() {
            this.link = bind(this.link, this);
            return FreeDrawPolygons.__super__.constructor.apply(this, arguments);
          }
          FreeDrawPolygons.include(CtrlHandle);
          FreeDrawPolygons.prototype.restrict = 'EMA';
          FreeDrawPolygons.prototype.replace = true;
          FreeDrawPolygons.prototype.require = '^' + 'uiGmapGoogleMap';
          FreeDrawPolygons.prototype.scope = {
            polygons: '=',
            draw: '='
          };
          FreeDrawPolygons.prototype.link = function(scope, element, attrs, ctrl) {
            return this.mapPromise(scope, ctrl).then((function(_this) {
              return function(map) {
                var freeHand,
                    listener;
                if (!scope.polygons) {
                  return $log.error('No polygons to bind to!');
                }
                if (!_.isArray(scope.polygons)) {
                  return $log.error('Free Draw Polygons must be of type Array!');
                }
                freeHand = new DrawFreeHandChildModel(map, ctrl.getScope());
                listener = void 0;
                return scope.draw = function() {
                  if (typeof listener === "function") {
                    listener();
                  }
                  return freeHand.engage(scope.polygons).then(function() {
                    var firstTime;
                    firstTime = true;
                    return listener = scope.$watchCollection('polygons', function(newValue, oldValue) {
                      var removals;
                      if (firstTime || newValue === oldValue) {
                        firstTime = false;
                        return;
                      }
                      removals = uiGmapLodash.differenceObjects(oldValue, newValue);
                      return removals.forEach(function(p) {
                        return p.setMap(null);
                      });
                    });
                  });
                };
              };
            })(this));
          };
          return FreeDrawPolygons;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps.directives.api").service("uiGmapICircle", [function() {
        var DEFAULTS;
        DEFAULTS = {};
        return {
          restrict: "EA",
          replace: true,
          require: '^' + 'uiGmapGoogleMap',
          scope: {
            center: "=center",
            radius: "=radius",
            stroke: "=stroke",
            fill: "=fill",
            clickable: "=",
            draggable: "=",
            editable: "=",
            geodesic: "=",
            icons: "=icons",
            visible: "=",
            events: "=",
            control: "=",
            zIndex: "=zindex"
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapIControl", ["uiGmapBaseObject", "uiGmapLogger", "uiGmapCtrlHandle", function(BaseObject, Logger, CtrlHandle) {
        var IControl;
        return IControl = (function(superClass) {
          extend(IControl, superClass);
          IControl.extend(CtrlHandle);
          function IControl() {
            this.restrict = 'EA';
            this.replace = true;
            this.require = '^' + 'uiGmapGoogleMap';
            this.scope = {
              template: '@template',
              position: '@position',
              controller: '@controller',
              index: '@index'
            };
            this.$log = Logger;
          }
          IControl.prototype.link = function(scope, element, attrs, ctrl) {
            throw new Exception("Not implemented!!");
          };
          return IControl;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapIDrawingManager', [function() {
        return {
          restrict: 'EA',
          replace: true,
          require: '^' + 'uiGmapGoogleMap',
          scope: {
            "static": '@',
            control: '=',
            options: '=',
            events: '='
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIMarker', ['uiGmapBaseObject', 'uiGmapCtrlHandle', function(BaseObject, CtrlHandle) {
        var IMarker;
        return IMarker = (function(superClass) {
          extend(IMarker, superClass);
          IMarker.scope = {
            coords: '=coords',
            icon: '=icon',
            click: '&click',
            options: '=options',
            events: '=events',
            fit: '=fit',
            idKey: '=idkey',
            control: '=control'
          };
          IMarker.scopeKeys = _.keys(IMarker.scope);
          IMarker.keys = IMarker.scopeKeys;
          IMarker.extend(CtrlHandle);
          function IMarker() {
            this.restrict = 'EMA';
            this.require = '^' + 'uiGmapGoogleMap';
            this.priority = -1;
            this.transclude = true;
            this.replace = true;
            this.scope = _.extend(this.scope || {}, IMarker.scope);
          }
          return IMarker;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIPolygon', ['uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle', function(GmapUtil, BaseObject, Logger, CtrlHandle) {
        var IPolygon;
        return IPolygon = (function(superClass) {
          extend(IPolygon, superClass);
          IPolygon.scope = {
            path: '=path',
            stroke: '=stroke',
            clickable: '=',
            draggable: '=',
            editable: '=',
            geodesic: '=',
            fill: '=',
            icons: '=icons',
            visible: '=',
            "static": '=',
            events: '=',
            zIndex: '=zindex',
            fit: '=',
            control: '=control'
          };
          IPolygon.scopeKeys = _.keys(IPolygon.scope);
          IPolygon.include(GmapUtil);
          IPolygon.extend(CtrlHandle);
          function IPolygon() {}
          IPolygon.prototype.restrict = 'EMA';
          IPolygon.prototype.replace = true;
          IPolygon.prototype.require = '^' + 'uiGmapGoogleMap';
          IPolygon.prototype.scope = IPolygon.scope;
          IPolygon.prototype.DEFAULTS = {};
          IPolygon.prototype.$log = Logger;
          return IPolygon;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIPolyline', ['uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle', function(GmapUtil, BaseObject, Logger, CtrlHandle) {
        var IPolyline;
        return IPolyline = (function(superClass) {
          extend(IPolyline, superClass);
          IPolyline.scope = {
            path: '=',
            stroke: '=',
            clickable: '=',
            draggable: '=',
            editable: '=',
            geodesic: '=',
            icons: '=',
            visible: '=',
            "static": '=',
            fit: '=',
            events: '=',
            zIndex: '=zindex'
          };
          IPolyline.scopeKeys = _.keys(IPolyline.scope);
          IPolyline.include(GmapUtil);
          IPolyline.extend(CtrlHandle);
          function IPolyline() {}
          IPolyline.prototype.restrict = 'EMA';
          IPolyline.prototype.replace = true;
          IPolyline.prototype.require = '^' + 'uiGmapGoogleMap';
          IPolyline.prototype.scope = IPolyline.scope;
          IPolyline.prototype.DEFAULTS = {};
          IPolyline.prototype.$log = Logger;
          return IPolyline;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapIRectangle', [function() {
        'use strict';
        var DEFAULTS;
        DEFAULTS = {};
        return {
          restrict: 'EMA',
          require: '^' + 'uiGmapGoogleMap',
          replace: true,
          scope: {
            bounds: '=',
            stroke: '=',
            clickable: '=',
            draggable: '=',
            editable: '=',
            fill: '=',
            visible: '=',
            events: '='
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapIWindow', ['uiGmapBaseObject', 'uiGmapChildEvents', 'uiGmapCtrlHandle', function(BaseObject, ChildEvents, CtrlHandle) {
        var IWindow;
        return IWindow = (function(superClass) {
          extend(IWindow, superClass);
          IWindow.scope = {
            coords: '=coords',
            template: '=template',
            templateUrl: '=templateurl',
            templateParameter: '=templateparameter',
            isIconVisibleOnClick: '=isiconvisibleonclick',
            closeClick: '&closeclick',
            options: '=options',
            control: '=control',
            show: '=show'
          };
          IWindow.scopeKeys = _.keys(IWindow.scope);
          IWindow.include(ChildEvents);
          IWindow.extend(CtrlHandle);
          function IWindow() {
            this.restrict = 'EMA';
            this.template = void 0;
            this.transclude = true;
            this.priority = -100;
            this.require = '^' + 'uiGmapGoogleMap';
            this.replace = true;
            this.scope = _.extend(this.scope || {}, IWindow.scope);
          }
          return IWindow;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapMap', ['$timeout', '$q', 'uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapCtrlHandle', 'uiGmapIsReady', 'uiGmapuuid', 'uiGmapExtendGWin', 'uiGmapExtendMarkerClusterer', 'uiGmapGoogleMapsUtilV3', 'uiGmapGoogleMapApi', 'uiGmapEventsHelper', function($timeout, $q, $log, GmapUtil, BaseObject, CtrlHandle, IsReady, uuid, ExtendGWin, ExtendMarkerClusterer, GoogleMapsUtilV3, GoogleMapApi, EventsHelper) {
        'use strict';
        var DEFAULTS,
            Map,
            initializeItems;
        DEFAULTS = void 0;
        initializeItems = [GoogleMapsUtilV3, ExtendGWin, ExtendMarkerClusterer];
        return Map = (function(superClass) {
          extend(Map, superClass);
          Map.include(GmapUtil);
          function Map() {
            this.link = bind(this.link, this);
            var ctrlFn,
                self;
            ctrlFn = function($scope) {
              var ctrlObj,
                  retCtrl;
              retCtrl = void 0;
              $scope.$on('$destroy', function() {
                return IsReady.decrement();
              });
              ctrlObj = CtrlHandle.handle($scope);
              $scope.ctrlType = 'Map';
              $scope.deferred.promise.then(function() {
                return initializeItems.forEach(function(i) {
                  return i.init();
                });
              });
              ctrlObj.getMap = function() {
                return $scope.map;
              };
              retCtrl = _.extend(this, ctrlObj);
              return retCtrl;
            };
            this.controller = ['$scope', ctrlFn];
            self = this;
          }
          Map.prototype.restrict = 'EMA';
          Map.prototype.transclude = true;
          Map.prototype.replace = false;
          Map.prototype.template = "<div class=\"angular-google-map\"><div class=\"angular-google-map-container\">\n</div><div ng-transclude style=\"display: none\"></div></div>";
          Map.prototype.scope = {
            center: '=',
            zoom: '=',
            dragging: '=',
            control: '=',
            options: '=',
            events: '=',
            eventOpts: '=',
            styles: '=',
            bounds: '=',
            update: '='
          };
          Map.prototype.link = function(scope, element, attrs) {
            var listeners,
                unbindCenterWatch;
            listeners = [];
            scope.$on('$destroy', function() {
              return EventsHelper.removeEvents(listeners);
            });
            scope.idleAndZoomChanged = false;
            if (scope.center == null) {
              unbindCenterWatch = scope.$watch('center', (function(_this) {
                return function() {
                  if (!scope.center) {
                    return;
                  }
                  unbindCenterWatch();
                  return _this.link(scope, element, attrs);
                };
              })(this));
              return;
            }
            return GoogleMapApi.then((function(_this) {
              return function(maps) {
                var _gMap,
                    customListeners,
                    disabledEvents,
                    dragging,
                    el,
                    eventName,
                    getEventHandler,
                    mapOptions,
                    maybeHookToEvent,
                    opts,
                    ref,
                    resolveSpawned,
                    settingFromDirective,
                    spawned,
                    type,
                    updateCenter,
                    zoomPromise;
                DEFAULTS = {mapTypeId: maps.MapTypeId.ROADMAP};
                spawned = IsReady.spawn();
                resolveSpawned = function() {
                  return spawned.deferred.resolve({
                    instance: spawned.instance,
                    map: _gMap
                  });
                };
                if (!_this.validateCoords(scope.center)) {
                  $log.error('angular-google-maps: could not find a valid center property');
                  return;
                }
                if (!angular.isDefined(scope.zoom)) {
                  $log.error('angular-google-maps: map zoom property not set');
                  return;
                }
                el = angular.element(element);
                el.addClass('angular-google-map');
                opts = {options: {}};
                if (attrs.options) {
                  opts.options = scope.options;
                }
                if (attrs.styles) {
                  opts.styles = scope.styles;
                }
                if (attrs.type) {
                  type = attrs.type.toUpperCase();
                  if (google.maps.MapTypeId.hasOwnProperty(type)) {
                    opts.mapTypeId = google.maps.MapTypeId[attrs.type.toUpperCase()];
                  } else {
                    $log.error("angular-google-maps: invalid map type '" + attrs.type + "'");
                  }
                }
                mapOptions = angular.extend({}, DEFAULTS, opts, {
                  center: _this.getCoords(scope.center),
                  zoom: scope.zoom,
                  bounds: scope.bounds
                });
                _gMap = new google.maps.Map(el.find('div')[1], mapOptions);
                _gMap['uiGmap_id'] = uuid.generate();
                dragging = false;
                listeners.push(google.maps.event.addListenerOnce(_gMap, 'idle', function() {
                  scope.deferred.resolve(_gMap);
                  return resolveSpawned();
                }));
                disabledEvents = attrs.events && (((ref = scope.events) != null ? ref.blacklist : void 0) != null) ? scope.events.blacklist : [];
                if (_.isString(disabledEvents)) {
                  disabledEvents = [disabledEvents];
                }
                maybeHookToEvent = function(eventName, fn, prefn) {
                  if (!_.contains(disabledEvents, eventName)) {
                    if (prefn) {
                      prefn();
                    }
                    return listeners.push(google.maps.event.addListener(_gMap, eventName, function() {
                      var ref1;
                      if (!((ref1 = scope.update) != null ? ref1.lazy : void 0)) {
                        return fn();
                      }
                    }));
                  }
                };
                if (!_.contains(disabledEvents, 'all')) {
                  maybeHookToEvent('dragstart', function() {
                    dragging = true;
                    return scope.$evalAsync(function(s) {
                      if (s.dragging != null) {
                        return s.dragging = dragging;
                      }
                    });
                  });
                  maybeHookToEvent('dragend', function() {
                    dragging = false;
                    return scope.$evalAsync(function(s) {
                      if (s.dragging != null) {
                        return s.dragging = dragging;
                      }
                    });
                  });
                  updateCenter = function(c, s) {
                    if (c == null) {
                      c = _gMap.center;
                    }
                    if (s == null) {
                      s = scope;
                    }
                    if (_.contains(disabledEvents, 'center')) {
                      return;
                    }
                    if (angular.isDefined(s.center.type)) {
                      if (s.center.coordinates[1] !== c.lat()) {
                        s.center.coordinates[1] = c.lat();
                      }
                      if (s.center.coordinates[0] !== c.lng()) {
                        return s.center.coordinates[0] = c.lng();
                      }
                    } else {
                      if (s.center.latitude !== c.lat()) {
                        s.center.latitude = c.lat();
                      }
                      if (s.center.longitude !== c.lng()) {
                        return s.center.longitude = c.lng();
                      }
                    }
                  };
                  settingFromDirective = false;
                  maybeHookToEvent('idle', function() {
                    var b,
                        ne,
                        sw;
                    b = _gMap.getBounds();
                    ne = b.getNorthEast();
                    sw = b.getSouthWest();
                    settingFromDirective = true;
                    return scope.$evalAsync(function(s) {
                      updateCenter();
                      if (!_.isUndefined(s.bounds) && !_.contains(disabledEvents, 'bounds')) {
                        s.bounds.northeast = {
                          latitude: ne.lat(),
                          longitude: ne.lng()
                        };
                        s.bounds.southwest = {
                          latitude: sw.lat(),
                          longitude: sw.lng()
                        };
                      }
                      if (!_.contains(disabledEvents, 'zoom')) {
                        s.zoom = _gMap.zoom;
                        scope.idleAndZoomChanged = !scope.idleAndZoomChanged;
                      }
                      return settingFromDirective = false;
                    });
                  });
                }
                if (angular.isDefined(scope.events) && scope.events !== null && angular.isObject(scope.events)) {
                  getEventHandler = function(eventName) {
                    return function() {
                      return scope.events[eventName].apply(scope, [_gMap, eventName, arguments]);
                    };
                  };
                  customListeners = [];
                  for (eventName in scope.events) {
                    if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
                      customListeners.push(google.maps.event.addListener(_gMap, eventName, getEventHandler(eventName)));
                    }
                  }
                  listeners.concat(customListeners);
                }
                _gMap.getOptions = function() {
                  return mapOptions;
                };
                scope.map = _gMap;
                if ((attrs.control != null) && (scope.control != null)) {
                  scope.control.refresh = function(maybeCoords) {
                    var coords,
                        ref1,
                        ref2;
                    if (_gMap == null) {
                      return;
                    }
                    if (((typeof google !== "undefined" && google !== null ? (ref1 = google.maps) != null ? (ref2 = ref1.event) != null ? ref2.trigger : void 0 : void 0 : void 0) != null) && (_gMap != null)) {
                      google.maps.event.trigger(_gMap, 'resize');
                    }
                    if (((maybeCoords != null ? maybeCoords.latitude : void 0) != null) && ((maybeCoords != null ? maybeCoords.longitude : void 0) != null)) {
                      coords = _this.getCoords(maybeCoords);
                      if (_this.isTrue(attrs.pan)) {
                        return _gMap.panTo(coords);
                      } else {
                        return _gMap.setCenter(coords);
                      }
                    }
                  };
                  scope.control.getGMap = function() {
                    return _gMap;
                  };
                  scope.control.getMapOptions = function() {
                    return mapOptions;
                  };
                  scope.control.getCustomEventListeners = function() {
                    return customListeners;
                  };
                  scope.control.removeEvents = function(yourListeners) {
                    return EventsHelper.removeEvents(yourListeners);
                  };
                }
                scope.$watch('center', function(newValue, oldValue) {
                  var coords,
                      settingCenterFromScope;
                  if (newValue === oldValue || settingFromDirective) {
                    return;
                  }
                  coords = _this.getCoords(scope.center);
                  if (coords.lat() === _gMap.center.lat() && coords.lng() === _gMap.center.lng()) {
                    return;
                  }
                  settingCenterFromScope = true;
                  if (!dragging) {
                    if (!_this.validateCoords(newValue)) {
                      $log.error("Invalid center for newValue: " + (JSON.stringify(newValue)));
                    }
                    if (_this.isTrue(attrs.pan) && scope.zoom === _gMap.zoom) {
                      _gMap.panTo(coords);
                    } else {
                      _gMap.setCenter(coords);
                    }
                  }
                  return settingCenterFromScope = false;
                }, true);
                zoomPromise = null;
                scope.$watch('zoom', function(newValue, oldValue) {
                  var ref1,
                      ref2,
                      settingZoomFromScope;
                  if (newValue == null) {
                    return;
                  }
                  if (_.isEqual(newValue, oldValue) || (_gMap != null ? _gMap.getZoom() : void 0) === (scope != null ? scope.zoom : void 0) || settingFromDirective) {
                    return;
                  }
                  settingZoomFromScope = true;
                  if (zoomPromise != null) {
                    $timeout.cancel(zoomPromise);
                  }
                  return zoomPromise = $timeout(function() {
                    _gMap.setZoom(newValue);
                    return settingZoomFromScope = false;
                  }, ((ref1 = scope.eventOpts) != null ? (ref2 = ref1.debounce) != null ? ref2.zoomMs : void 0 : void 0) + 20, false);
                });
                scope.$watch('bounds', function(newValue, oldValue) {
                  var bounds,
                      ne,
                      ref1,
                      ref2,
                      ref3,
                      ref4,
                      sw;
                  if (newValue === oldValue) {
                    return;
                  }
                  if (((newValue != null ? (ref1 = newValue.northeast) != null ? ref1.latitude : void 0 : void 0) == null) || ((newValue != null ? (ref2 = newValue.northeast) != null ? ref2.longitude : void 0 : void 0) == null) || ((newValue != null ? (ref3 = newValue.southwest) != null ? ref3.latitude : void 0 : void 0) == null) || ((newValue != null ? (ref4 = newValue.southwest) != null ? ref4.longitude : void 0 : void 0) == null)) {
                    $log.error("Invalid map bounds for new value: " + (JSON.stringify(newValue)));
                    return;
                  }
                  ne = new google.maps.LatLng(newValue.northeast.latitude, newValue.northeast.longitude);
                  sw = new google.maps.LatLng(newValue.southwest.latitude, newValue.southwest.longitude);
                  bounds = new google.maps.LatLngBounds(sw, ne);
                  return _gMap.fitBounds(bounds);
                });
                return ['options', 'styles'].forEach(function(toWatch) {
                  return scope.$watch(toWatch, function(newValue, oldValue) {
                    var watchItem;
                    watchItem = this.exp;
                    if (_.isEqual(newValue, oldValue)) {
                      return;
                    }
                    if (watchItem === 'options') {
                      opts.options = newValue;
                    } else {
                      opts.options[watchItem] = newValue;
                    }
                    if (_gMap != null) {
                      return _gMap.setOptions(opts);
                    }
                  }, true);
                });
              };
            })(this));
          };
          return Map;
        })(BaseObject);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapMarker", ["uiGmapIMarker", "uiGmapMarkerChildModel", "uiGmapMarkerManager", "uiGmapLogger", function(IMarker, MarkerChildModel, MarkerManager, $log) {
        var Marker;
        return Marker = (function(superClass) {
          extend(Marker, superClass);
          function Marker() {
            this.link = bind(this.link, this);
            Marker.__super__.constructor.call(this);
            this.template = '<span class="angular-google-map-marker" ng-transclude></span>';
            $log.info(this);
          }
          Marker.prototype.controller = ['$scope', '$element', function($scope, $element) {
            $scope.ctrlType = 'Marker';
            return _.extend(this, IMarker.handle($scope, $element));
          }];
          Marker.prototype.link = function(scope, element, attrs, ctrl) {
            var mapPromise;
            mapPromise = IMarker.mapPromise(scope, ctrl);
            mapPromise.then((function(_this) {
              return function(map) {
                var doClick,
                    doDrawSelf,
                    gManager,
                    keys,
                    m,
                    trackModel;
                gManager = new MarkerManager(map);
                keys = _.object(IMarker.keys, IMarker.keys);
                m = new MarkerChildModel(scope, scope, keys, map, {}, doClick = true, gManager, doDrawSelf = false, trackModel = false);
                m.deferred.promise.then(function(gMarker) {
                  return scope.deferred.resolve(gMarker);
                });
                if (scope.control != null) {
                  return scope.control.getGMarkers = gManager.getGMarkers;
                }
              };
            })(this));
            return scope.$on('$destroy', (function(_this) {
              return function() {
                var gManager;
                if (typeof gManager !== "undefined" && gManager !== null) {
                  gManager.clear();
                }
                return gManager = null;
              };
            })(this));
          };
          return Marker;
        })(IMarker);
      }]);
    }).call(this);
    ;
    (function() {
      var extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      },
          hasProp = {}.hasOwnProperty;
      angular.module("uiGmapgoogle-maps.directives.api").factory("uiGmapMarkers", ["uiGmapIMarker", "uiGmapPlural", "uiGmapMarkersParentModel", "uiGmap_sync", "uiGmapLogger", function(IMarker, Plural, MarkersParentModel, _sync, $log) {
        var Markers;
        return Markers = (function(superClass) {
          extend(Markers, superClass);
          function Markers() {
            Markers.__super__.constructor.call(this);
            this.template = '<span class="angular-google-map-markers" ng-transclude></span>';
            Plural.extend(this, {
              doCluster: '=?docluster',
              clusterOptions: '=clusteroptions',
              clusterEvents: '=clusterevents',
              modelsByRef: '=modelsbyref',
              type: '=?type',
              typeOptions: '=?typeoptions',
              typeEvents: '=?typeevents'
            });
            $log.info(this);
          }
          Markers.prototype.controller = ['$scope', '$element', function($scope, $element) {
            $scope.ctrlType = 'Markers';
            return _.extend(this, IMarker.handle($scope, $element));
          }];
          Markers.prototype.link = function(scope, element, attrs, ctrl) {
            var parentModel,
                ready;
            parentModel = void 0;
            ready = function() {
              return scope.deferred.resolve();
            };
            return IMarker.mapPromise(scope, ctrl).then(function(map) {
              var mapScope;
              mapScope = ctrl.getScope();
              mapScope.$watch('idleAndZoomChanged', function() {
                return _.defer(parentModel.gManager.draw);
              });
              parentModel = new MarkersParentModel(scope, element, attrs, map);
              Plural.link(scope, parentModel);
              if (scope.control != null) {
                scope.control.getGMarkers = function() {
                  var ref;
                  return (ref = parentModel.gManager) != null ? ref.getGMarkers() : void 0;
                };
                scope.control.getChildMarkers = function() {
                  return parentModel.plurals;
                };
              }
              return _.last(parentModel.existingPieces._content).then(function() {
                return ready();
              });
            });
          };
          return Markers;
        })(IMarker);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api').service('uiGmapPlural', [function() {
        var _initControl;
        _initControl = function(scope, parent) {
          if (scope.control == null) {
            return;
          }
          scope.control.updateModels = function(models) {
            scope.models = models;
            return parent.createChildScopes(false);
          };
          scope.control.newModels = function(models) {
            scope.models = models;
            return parent.rebuildAll(scope, true, true);
          };
          scope.control.clean = function() {
            return parent.rebuildAll(scope, false, true);
          };
          scope.control.getPlurals = function() {
            return parent.plurals;
          };
          scope.control.getManager = function() {
            return parent.gManager;
          };
          scope.control.hasManager = function() {
            return (parent.gManager != null) === true;
          };
          return scope.control.managerDraw = function() {
            var ref;
            if (scope.control.hasManager()) {
              return (ref = scope.control.getManager()) != null ? ref.draw() : void 0;
            }
          };
        };
        return {
          extend: function(obj, obj2) {
            return _.extend(obj.scope || {}, obj2 || {}, {
              idKey: '=idkey',
              doRebuildAll: '=dorebuildall',
              models: '=models',
              chunk: '=chunk',
              cleanchunk: '=cleanchunk',
              control: '=control'
            });
          },
          link: function(scope, parent) {
            return _initControl(scope, parent);
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolygon', ['uiGmapIPolygon', '$timeout', 'uiGmapPolygonChildModel', function(IPolygon, $timeout, PolygonChild) {
        var Polygon;
        return Polygon = (function(superClass) {
          extend(Polygon, superClass);
          function Polygon() {
            this.link = bind(this.link, this);
            return Polygon.__super__.constructor.apply(this, arguments);
          }
          Polygon.prototype.link = function(scope, element, attrs, mapCtrl) {
            var children,
                promise;
            children = [];
            promise = IPolygon.mapPromise(scope, mapCtrl);
            if (scope.control != null) {
              scope.control.getInstance = this;
              scope.control.polygons = children;
              scope.control.promise = promise;
            }
            return promise.then((function(_this) {
              return function(map) {
                return children.push(new PolygonChild(scope, attrs, map, _this.DEFAULTS));
              };
            })(this));
          };
          return Polygon;
        })(IPolygon);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolygons', ['uiGmapIPolygon', '$timeout', 'uiGmapPolygonsParentModel', 'uiGmapPlural', function(Interface, $timeout, ParentModel, Plural) {
        var Polygons;
        return Polygons = (function(superClass) {
          extend(Polygons, superClass);
          function Polygons() {
            this.link = bind(this.link, this);
            Polygons.__super__.constructor.call(this);
            Plural.extend(this);
            this.$log.info(this);
          }
          Polygons.prototype.link = function(scope, element, attrs, mapCtrl) {
            return mapCtrl.getScope().deferred.promise.then((function(_this) {
              return function(map) {
                if (angular.isUndefined(scope.path) || scope.path === null) {
                  _this.$log.warn('polygons: no valid path attribute found');
                }
                if (!scope.models) {
                  _this.$log.warn('polygons: no models found to create from');
                }
                return Plural.link(scope, new ParentModel(scope, element, attrs, map, _this.DEFAULTS));
              };
            })(this));
          };
          return Polygons;
        })(Interface);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolyline', ['uiGmapIPolyline', '$timeout', 'uiGmapPolylineChildModel', function(IPolyline, $timeout, PolylineChildModel) {
        var Polyline;
        return Polyline = (function(superClass) {
          extend(Polyline, superClass);
          function Polyline() {
            this.link = bind(this.link, this);
            return Polyline.__super__.constructor.apply(this, arguments);
          }
          Polyline.prototype.link = function(scope, element, attrs, mapCtrl) {
            return IPolyline.mapPromise(scope, mapCtrl).then((function(_this) {
              return function(map) {
                if (angular.isUndefined(scope.path) || scope.path === null || !_this.validatePath(scope.path)) {
                  _this.$log.warn('polyline: no valid path attribute found');
                }
                return new PolylineChildModel(scope, attrs, map, _this.DEFAULTS);
              };
            })(this));
          };
          return Polyline;
        })(IPolyline);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapPolylines', ['uiGmapIPolyline', '$timeout', 'uiGmapPolylinesParentModel', 'uiGmapPlural', function(IPolyline, $timeout, PolylinesParentModel, Plural) {
        var Polylines;
        return Polylines = (function(superClass) {
          extend(Polylines, superClass);
          function Polylines() {
            this.link = bind(this.link, this);
            Polylines.__super__.constructor.call(this);
            Plural.extend(this);
            this.$log.info(this);
          }
          Polylines.prototype.link = function(scope, element, attrs, mapCtrl) {
            return mapCtrl.getScope().deferred.promise.then((function(_this) {
              return function(map) {
                if (angular.isUndefined(scope.path) || scope.path === null) {
                  _this.$log.warn('polylines: no valid path attribute found');
                }
                if (!scope.models) {
                  _this.$log.warn('polylines: no models found to create from');
                }
                return Plural.link(scope, new PolylinesParentModel(scope, element, attrs, map, _this.DEFAULTS));
              };
            })(this));
          };
          return Polylines;
        })(IPolyline);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapRectangle', ['uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapIRectangle', 'uiGmapRectangleParentModel', function($log, GmapUtil, IRectangle, RectangleParentModel) {
        return _.extend(IRectangle, {link: function(scope, element, attrs, mapCtrl) {
            return mapCtrl.getScope().deferred.promise.then((function(_this) {
              return function(map) {
                return new RectangleParentModel(scope, element, attrs, map);
              };
            })(this));
          }});
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapWindow', ['uiGmapIWindow', 'uiGmapGmapUtil', 'uiGmapWindowChildModel', 'uiGmapLodash', 'uiGmapLogger', function(IWindow, GmapUtil, WindowChildModel, uiGmapLodash, $log) {
        var Window;
        return Window = (function(superClass) {
          extend(Window, superClass);
          Window.include(GmapUtil);
          function Window() {
            this.link = bind(this.link, this);
            Window.__super__.constructor.call(this);
            this.require = ['^' + 'uiGmapGoogleMap', '^?' + 'uiGmapMarker'];
            this.template = '<span class="angular-google-maps-window" ng-transclude></span>';
            $log.debug(this);
            this.childWindows = [];
          }
          Window.prototype.link = function(scope, element, attrs, ctrls) {
            var markerCtrl,
                markerScope;
            markerCtrl = ctrls.length > 1 && (ctrls[1] != null) ? ctrls[1] : void 0;
            markerScope = markerCtrl != null ? markerCtrl.getScope() : void 0;
            this.mapPromise = IWindow.mapPromise(scope, ctrls[0]);
            return this.mapPromise.then((function(_this) {
              return function(mapCtrl) {
                var isIconVisibleOnClick;
                isIconVisibleOnClick = true;
                if (angular.isDefined(attrs.isiconvisibleonclick)) {
                  isIconVisibleOnClick = scope.isIconVisibleOnClick;
                }
                if (!markerCtrl) {
                  _this.init(scope, element, isIconVisibleOnClick, mapCtrl);
                  return;
                }
                return markerScope.deferred.promise.then(function(gMarker) {
                  return _this.init(scope, element, isIconVisibleOnClick, mapCtrl, markerScope);
                });
              };
            })(this));
          };
          Window.prototype.init = function(scope, element, isIconVisibleOnClick, mapCtrl, markerScope) {
            var childWindow,
                defaults,
                gMarker,
                hasScopeCoords,
                opts;
            defaults = scope.options != null ? scope.options : {};
            hasScopeCoords = (scope != null) && this.validateCoords(scope.coords);
            if ((markerScope != null ? markerScope['getGMarker'] : void 0) != null) {
              gMarker = markerScope.getGMarker();
            }
            opts = hasScopeCoords ? this.createWindowOptions(gMarker, scope, element.html(), defaults) : defaults;
            if (mapCtrl != null) {
              childWindow = new WindowChildModel({}, scope, opts, isIconVisibleOnClick, mapCtrl, markerScope, element);
              this.childWindows.push(childWindow);
              scope.$on('$destroy', (function(_this) {
                return function() {
                  _this.childWindows = uiGmapLodash.withoutObjects(_this.childWindows, [childWindow], function(child1, child2) {
                    return child1.scope.$id === child2.scope.$id;
                  });
                  return _this.childWindows.length = 0;
                };
              })(this));
            }
            if (scope.control != null) {
              scope.control.getGWindows = (function(_this) {
                return function() {
                  return _this.childWindows.map(function(child) {
                    return child.gObject;
                  });
                };
              })(this);
              scope.control.getChildWindows = (function(_this) {
                return function() {
                  return _this.childWindows;
                };
              })(this);
              scope.control.getPlurals = scope.control.getChildWindows;
              scope.control.showWindow = (function(_this) {
                return function() {
                  return _this.childWindows.map(function(child) {
                    return child.showWindow();
                  });
                };
              })(this);
              scope.control.hideWindow = (function(_this) {
                return function() {
                  return _this.childWindows.map(function(child) {
                    return child.hideWindow();
                  });
                };
              })(this);
            }
            if ((this.onChildCreation != null) && (childWindow != null)) {
              return this.onChildCreation(childWindow);
            }
          };
          return Window;
        })(IWindow);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      },
          extend = function(child, parent) {
            for (var key in parent) {
              if (hasProp.call(parent, key))
                child[key] = parent[key];
            }
            function ctor() {
              this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
          },
          hasProp = {}.hasOwnProperty;
      angular.module('uiGmapgoogle-maps.directives.api').factory('uiGmapWindows', ['uiGmapIWindow', 'uiGmapPlural', 'uiGmapWindowsParentModel', 'uiGmapPromise', 'uiGmapLogger', function(IWindow, Plural, WindowsParentModel, uiGmapPromise, $log) {
        var Windows;
        return Windows = (function(superClass) {
          extend(Windows, superClass);
          function Windows() {
            this.init = bind(this.init, this);
            this.link = bind(this.link, this);
            Windows.__super__.constructor.call(this);
            this.require = ['^' + 'uiGmapGoogleMap', '^?' + 'uiGmapMarkers'];
            this.template = '<span class="angular-google-maps-windows" ng-transclude></span>';
            Plural.extend(this);
            $log.debug(this);
          }
          Windows.prototype.link = function(scope, element, attrs, ctrls) {
            var mapScope,
                markerCtrl,
                markerScope;
            mapScope = ctrls[0].getScope();
            markerCtrl = ctrls.length > 1 && (ctrls[1] != null) ? ctrls[1] : void 0;
            markerScope = markerCtrl != null ? markerCtrl.getScope() : void 0;
            return mapScope.deferred.promise.then((function(_this) {
              return function(map) {
                var promise,
                    ref;
                promise = (markerScope != null ? (ref = markerScope.deferred) != null ? ref.promise : void 0 : void 0) || uiGmapPromise.resolve();
                return promise.then(function() {
                  var pieces,
                      ref1;
                  pieces = (ref1 = _this.parentModel) != null ? ref1.existingPieces : void 0;
                  if (pieces) {
                    return pieces.then(function() {
                      return _this.init(scope, element, attrs, ctrls, map, markerScope);
                    });
                  } else {
                    return _this.init(scope, element, attrs, ctrls, map, markerScope);
                  }
                });
              };
            })(this));
          };
          Windows.prototype.init = function(scope, element, attrs, ctrls, map, additionalScope) {
            var parentModel;
            parentModel = new WindowsParentModel(scope, element, attrs, ctrls, map, additionalScope);
            Plural.link(scope, parentModel);
            if (scope.control != null) {
              scope.control.getGWindows = (function(_this) {
                return function() {
                  return parentModel.plurals.map(function(child) {
                    return child.gObject;
                  });
                };
              })(this);
              return scope.control.getChildWindows = (function(_this) {
                return function() {
                  return parentModel.plurals;
                };
              })(this);
            }
          };
          return Windows;
        })(IWindow);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps").directive("uiGmapGoogleMap", ["uiGmapMap", function(Map) {
        return new Map();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapMarker', ['$timeout', 'uiGmapMarker', function($timeout, Marker) {
        return new Marker($timeout);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapMarkers', ['$timeout', 'uiGmapMarkers', function($timeout, Markers) {
        return new Markers($timeout);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapPolygon', ['uiGmapPolygon', function(Polygon) {
        return new Polygon();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive("uiGmapCircle", ["uiGmapCircle", function(Circle) {
        return Circle;
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps").directive("uiGmapPolyline", ["uiGmapPolyline", function(Polyline) {
        return new Polyline();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapPolylines', ['uiGmapPolylines', function(Polylines) {
        return new Polylines();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps").directive("uiGmapRectangle", ["uiGmapLogger", "uiGmapRectangle", function($log, Rectangle) {
        return Rectangle;
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps").directive("uiGmapWindow", ["$timeout", "$compile", "$http", "$templateCache", "uiGmapWindow", function($timeout, $compile, $http, $templateCache, Window) {
        return new Window($timeout, $compile, $http, $templateCache);
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps").directive("uiGmapWindows", ["$timeout", "$compile", "$http", "$templateCache", "$interpolate", "uiGmapWindows", function($timeout, $compile, $http, $templateCache, $interpolate, Windows) {
        return new Windows($timeout, $compile, $http, $templateCache, $interpolate);
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      };
      angular.module('uiGmapgoogle-maps').directive('uiGmapLayer', ['$timeout', 'uiGmapLogger', 'uiGmapLayerParentModel', function($timeout, Logger, LayerParentModel) {
        var Layer;
        Layer = (function() {
          function Layer() {
            this.link = bind(this.link, this);
            this.$log = Logger;
            this.restrict = 'EMA';
            this.require = '^' + 'uiGmapGoogleMap';
            this.priority = -1;
            this.transclude = true;
            this.template = '<span class=\'angular-google-map-layer\' ng-transclude></span>';
            this.replace = true;
            this.scope = {
              show: '=show',
              type: '=type',
              namespace: '=namespace',
              options: '=options',
              onCreated: '&oncreated'
            };
          }
          Layer.prototype.link = function(scope, element, attrs, mapCtrl) {
            return mapCtrl.getScope().deferred.promise.then((function(_this) {
              return function(map) {
                if (scope.onCreated != null) {
                  return new LayerParentModel(scope, element, attrs, map, scope.onCreated);
                } else {
                  return new LayerParentModel(scope, element, attrs, map);
                }
              };
            })(this));
          };
          return Layer;
        })();
        return new Layer();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module("uiGmapgoogle-maps").directive("uiGmapMapControl", ["uiGmapControl", function(Control) {
        return new Control();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapDragZoom', ['uiGmapDragZoom', function(DragZoom) {
        return DragZoom;
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive("uiGmapDrawingManager", ["uiGmapDrawingManager", function(DrawingManager) {
        return DrawingManager;
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapFreeDrawPolygons', ['uiGmapApiFreeDrawPolygons', function(FreeDrawPolygons) {
        return new FreeDrawPolygons();
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      };
      angular.module("uiGmapgoogle-maps").directive("uiGmapMapType", ["$timeout", "uiGmapLogger", "uiGmapMapTypeParentModel", function($timeout, Logger, MapTypeParentModel) {
        var MapType;
        MapType = (function() {
          function MapType() {
            this.link = bind(this.link, this);
            this.$log = Logger;
            this.restrict = "EMA";
            this.require = '^' + 'uiGmapGoogleMap';
            this.priority = -1;
            this.transclude = true;
            this.template = '<span class=\"angular-google-map-layer\" ng-transclude></span>';
            this.replace = true;
            this.scope = {
              show: "=show",
              options: '=options',
              refresh: '=refresh',
              id: '@'
            };
          }
          MapType.prototype.link = function(scope, element, attrs, mapCtrl) {
            return mapCtrl.getScope().deferred.promise.then((function(_this) {
              return function(map) {
                return new MapTypeParentModel(scope, element, attrs, map);
              };
            })(this));
          };
          return MapType;
        })();
        return new MapType();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapPolygons', ['uiGmapPolygons', function(Polygons) {
        return new Polygons();
      }]);
    }).call(this);
    ;
    (function() {
      var bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      };
      angular.module('uiGmapgoogle-maps').directive('uiGmapSearchBox', ['uiGmapGoogleMapApi', 'uiGmapLogger', 'uiGmapSearchBoxParentModel', '$http', '$templateCache', '$compile', function(GoogleMapApi, Logger, SearchBoxParentModel, $http, $templateCache, $compile) {
        var SearchBox;
        SearchBox = (function() {
          SearchBox.prototype.require = 'ngModel';
          function SearchBox() {
            this.link = bind(this.link, this);
            this.$log = Logger;
            this.restrict = 'EMA';
            this.require = '^' + 'uiGmapGoogleMap';
            this.priority = -1;
            this.transclude = true;
            this.template = '<span class=\'angular-google-map-search\' ng-transclude></span>';
            this.replace = true;
            this.scope = {
              template: '=template',
              events: '=events',
              position: '=?position',
              options: '=?options',
              parentdiv: '=?parentdiv',
              ngModel: "=?"
            };
          }
          SearchBox.prototype.link = function(scope, element, attrs, mapCtrl) {
            return GoogleMapApi.then((function(_this) {
              return function(maps) {
                if (scope.template == null) {
                  $templateCache.put('uigmap-searchbox-default.tpl.html', '<input type="text">');
                  scope.template = 'uigmap-searchbox-default.tpl.html';
                }
                return $http.get(scope.template, {cache: $templateCache}).success(function(template) {
                  if (angular.isUndefined(scope.events)) {
                    _this.$log.error('searchBox: the events property is required');
                    return;
                  }
                  return mapCtrl.getScope().deferred.promise.then(function(map) {
                    var ctrlPosition;
                    ctrlPosition = angular.isDefined(scope.position) ? scope.position.toUpperCase().replace(/-/g, '_') : 'TOP_LEFT';
                    if (!maps.ControlPosition[ctrlPosition]) {
                      _this.$log.error('searchBox: invalid position property');
                      return;
                    }
                    return new SearchBoxParentModel(scope, element, attrs, map, ctrlPosition, $compile(template)(scope));
                  });
                });
              };
            })(this));
          };
          return SearchBox;
        })();
        return new SearchBox();
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapShow', ['$animate', 'uiGmapLogger', function($animate, $log) {
        return {
          scope: {
            'uiGmapShow': '=',
            'uiGmapAfterShow': '&',
            'uiGmapAfterHide': '&'
          },
          link: function(scope, element) {
            var angular_post_1_3_handle,
                angular_pre_1_3_handle,
                handle;
            angular_post_1_3_handle = function(animateAction, cb) {
              return $animate[animateAction](element, 'ng-hide').then(function() {
                return cb();
              });
            };
            angular_pre_1_3_handle = function(animateAction, cb) {
              return $animate[animateAction](element, 'ng-hide', cb);
            };
            handle = function(animateAction, cb) {
              if (angular.version.major > 1) {
                return $log.error("uiGmapShow is not supported for Angular Major greater than 1.\nYour Major is " + angular.version.major + "\"");
              }
              if (angular.version.major === 1 && angular.version.minor < 3) {
                return angular_pre_1_3_handle(animateAction, cb);
              }
              return angular_post_1_3_handle(animateAction, cb);
            };
            return scope.$watch('uiGmapShow', function(show) {
              if (show) {
                handle('removeClass', scope.uiGmapAfterShow);
              }
              if (!show) {
                return handle('addClass', scope.uiGmapAfterHide);
              }
            });
          }
        };
      }]);
    }).call(this);
    ;
    (function() {
      angular.module('uiGmapgoogle-maps').directive('uiGmapStreetViewPanorama', ['uiGmapGoogleMapApi', 'uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapEventsHelper', function(GoogleMapApi, $log, GmapUtil, EventsHelper) {
        var name;
        name = 'uiGmapStreetViewPanorama';
        return {
          restrict: 'EMA',
          template: '<div class="angular-google-map-street-view-panorama"></div>',
          replace: true,
          scope: {
            focalcoord: '=',
            radius: '=?',
            events: '=?',
            options: '=?',
            control: '=?',
            povoptions: '=?',
            imagestatus: '='
          },
          link: function(scope, element, attrs) {
            return GoogleMapApi.then((function(_this) {
              return function(maps) {
                var clean,
                    create,
                    didCreateOptionsFromDirective,
                    firstTime,
                    handleSettings,
                    listeners,
                    opts,
                    pano,
                    povOpts,
                    sv;
                pano = void 0;
                sv = void 0;
                didCreateOptionsFromDirective = false;
                listeners = void 0;
                opts = null;
                povOpts = null;
                clean = function() {
                  EventsHelper.removeEvents(listeners);
                  if (pano != null) {
                    pano.unbind('position');
                    pano.setVisible(false);
                  }
                  if (sv != null) {
                    if ((sv != null ? sv.setVisible : void 0) != null) {
                      sv.setVisible(false);
                    }
                    return sv = void 0;
                  }
                };
                handleSettings = function(perspectivePoint, focalPoint) {
                  var heading;
                  heading = google.maps.geometry.spherical.computeHeading(perspectivePoint, focalPoint);
                  didCreateOptionsFromDirective = true;
                  scope.radius = scope.radius || 50;
                  povOpts = angular.extend({
                    heading: heading,
                    zoom: 1,
                    pitch: 0
                  }, scope.povoptions || {});
                  opts = opts = angular.extend({
                    navigationControl: false,
                    addressControl: false,
                    linksControl: false,
                    position: perspectivePoint,
                    pov: povOpts,
                    visible: true
                  }, scope.options || {});
                  return didCreateOptionsFromDirective = false;
                };
                create = function() {
                  var focalPoint;
                  if (!scope.focalcoord) {
                    $log.error(name + ": focalCoord needs to be defined");
                    return;
                  }
                  if (!scope.radius) {
                    $log.error(name + ": needs a radius to set the camera view from its focal target.");
                    return;
                  }
                  clean();
                  if (sv == null) {
                    sv = new google.maps.StreetViewService();
                  }
                  if (scope.events) {
                    listeners = EventsHelper.setEvents(sv, scope, scope);
                  }
                  focalPoint = GmapUtil.getCoords(scope.focalcoord);
                  return sv.getPanoramaByLocation(focalPoint, scope.radius, function(streetViewPanoramaData, status) {
                    var ele,
                        perspectivePoint,
                        ref;
                    if (scope.imagestatus != null) {
                      scope.imagestatus = status;
                    }
                    if (((ref = scope.events) != null ? ref.image_status_changed : void 0) != null) {
                      scope.events.image_status_changed(sv, 'image_status_changed', scope, status);
                    }
                    if (status === "OK") {
                      perspectivePoint = streetViewPanoramaData.location.latLng;
                      handleSettings(perspectivePoint, focalPoint);
                      ele = element[0];
                      return pano = new google.maps.StreetViewPanorama(ele, opts);
                    }
                  });
                };
                if (scope.control != null) {
                  scope.control.getOptions = function() {
                    return opts;
                  };
                  scope.control.getPovOptions = function() {
                    return povOpts;
                  };
                  scope.control.getGObject = function() {
                    return sv;
                  };
                  scope.control.getGPano = function() {
                    return pano;
                  };
                }
                scope.$watch('options', function(newValue, oldValue) {
                  if (newValue === oldValue || newValue === opts || didCreateOptionsFromDirective) {
                    return;
                  }
                  return create();
                });
                firstTime = true;
                scope.$watch('focalcoord', function(newValue, oldValue) {
                  if (newValue === oldValue && !firstTime) {
                    return;
                  }
                  if (newValue == null) {
                    return;
                  }
                  firstTime = false;
                  return create();
                });
                return scope.$on('$destroy', function() {
                  return clean();
                });
              };
            })(this));
          }
        };
      }]);
    }).call(this);
    ;
    angular.module('uiGmapgoogle-maps.wrapped').service('uiGmapuuid', function() {
      function UUID() {}
      UUID.generate = function() {
        var a = UUID._gri,
            b = UUID._ha;
        return b(a(32), 8) + "-" + b(a(16), 4) + "-" + b(16384 | a(12), 4) + "-" + b(32768 | a(14), 4) + "-" + b(a(48), 12);
      };
      UUID._gri = function(a) {
        return 0 > a ? NaN : 30 >= a ? 0 | Math.random() * (1 << a) : 53 >= a ? (0 | 1073741824 * Math.random()) + 1073741824 * (0 | Math.random() * (1 << a - 30)) : NaN;
      };
      UUID._ha = function(a, b) {
        for (var c = a.toString(16),
            d = b - c.length,
            e = "0"; 0 < d; d >>>= 1, e += e)
          d & 1 && (c = e + c);
        return c;
      };
      return UUID;
    });
    ;
    angular.module('uiGmapgoogle-maps.wrapped').service('uiGmapGoogleMapsUtilV3', function() {
      return {init: _.once(function() {
          function InfoBox(opt_opts) {
            opt_opts = opt_opts || {};
            google.maps.OverlayView.apply(this, arguments);
            this.content_ = opt_opts.content || "";
            this.disableAutoPan_ = opt_opts.disableAutoPan || false;
            this.maxWidth_ = opt_opts.maxWidth || 0;
            this.pixelOffset_ = opt_opts.pixelOffset || new google.maps.Size(0, 0);
            this.position_ = opt_opts.position || new google.maps.LatLng(0, 0);
            this.zIndex_ = opt_opts.zIndex || null;
            this.boxClass_ = opt_opts.boxClass || "infoBox";
            this.boxStyle_ = opt_opts.boxStyle || {};
            this.closeBoxMargin_ = opt_opts.closeBoxMargin || "2px";
            this.closeBoxURL_ = opt_opts.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
            if (opt_opts.closeBoxURL === "") {
              this.closeBoxURL_ = "";
            }
            this.infoBoxClearance_ = opt_opts.infoBoxClearance || new google.maps.Size(1, 1);
            if (typeof opt_opts.visible === "undefined") {
              if (typeof opt_opts.isHidden === "undefined") {
                opt_opts.visible = true;
              } else {
                opt_opts.visible = !opt_opts.isHidden;
              }
            }
            this.isHidden_ = !opt_opts.visible;
            this.alignBottom_ = opt_opts.alignBottom || false;
            this.pane_ = opt_opts.pane || "floatPane";
            this.enableEventPropagation_ = opt_opts.enableEventPropagation || false;
            this.div_ = null;
            this.closeListener_ = null;
            this.moveListener_ = null;
            this.contextListener_ = null;
            this.eventListeners_ = null;
            this.fixedWidthSet_ = null;
          }
          InfoBox.prototype = new google.maps.OverlayView();
          InfoBox.prototype.createInfoBoxDiv_ = function() {
            var i;
            var events;
            var bw;
            var me = this;
            var cancelHandler = function(e) {
              e.cancelBubble = true;
              if (e.stopPropagation) {
                e.stopPropagation();
              }
            };
            var ignoreHandler = function(e) {
              e.returnValue = false;
              if (e.preventDefault) {
                e.preventDefault();
              }
              if (!me.enableEventPropagation_) {
                cancelHandler(e);
              }
            };
            if (!this.div_) {
              this.div_ = document.createElement("div");
              this.setBoxStyle_();
              if (typeof this.content_.nodeType === "undefined") {
                this.div_.innerHTML = this.getCloseBoxImg_() + this.content_;
              } else {
                this.div_.innerHTML = this.getCloseBoxImg_();
                this.div_.appendChild(this.content_);
              }
              this.getPanes()[this.pane_].appendChild(this.div_);
              this.addClickHandler_();
              if (this.div_.style.width) {
                this.fixedWidthSet_ = true;
              } else {
                if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {
                  this.div_.style.width = this.maxWidth_;
                  this.div_.style.overflow = "auto";
                  this.fixedWidthSet_ = true;
                } else {
                  bw = this.getBoxWidths_();
                  this.div_.style.width = (this.div_.offsetWidth - bw.left - bw.right) + "px";
                  this.fixedWidthSet_ = false;
                }
              }
              this.panBox_(this.disableAutoPan_);
              if (!this.enableEventPropagation_) {
                this.eventListeners_ = [];
                events = ["mousedown", "mouseover", "mouseout", "mouseup", "click", "dblclick", "touchstart", "touchend", "touchmove"];
                for (i = 0; i < events.length; i++) {
                  this.eventListeners_.push(google.maps.event.addDomListener(this.div_, events[i], cancelHandler));
                }
                this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function(e) {
                  this.style.cursor = "default";
                }));
              }
              this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", ignoreHandler);
              google.maps.event.trigger(this, "domready");
            }
          };
          InfoBox.prototype.getCloseBoxImg_ = function() {
            var img = "";
            if (this.closeBoxURL_ !== "") {
              img = "<img";
              img += " src='" + this.closeBoxURL_ + "'";
              img += " align=right";
              img += " style='";
              img += " position: relative;";
              img += " cursor: pointer;";
              img += " margin: " + this.closeBoxMargin_ + ";";
              img += "'>";
            }
            return img;
          };
          InfoBox.prototype.addClickHandler_ = function() {
            var closeBox;
            if (this.closeBoxURL_ !== "") {
              closeBox = this.div_.firstChild;
              this.closeListener_ = google.maps.event.addDomListener(closeBox, "click", this.getCloseClickHandler_());
            } else {
              this.closeListener_ = null;
            }
          };
          InfoBox.prototype.getCloseClickHandler_ = function() {
            var me = this;
            return function(e) {
              e.cancelBubble = true;
              if (e.stopPropagation) {
                e.stopPropagation();
              }
              google.maps.event.trigger(me, "closeclick");
              me.close();
            };
          };
          InfoBox.prototype.panBox_ = function(disablePan) {
            var map;
            var bounds;
            var xOffset = 0,
                yOffset = 0;
            if (!disablePan) {
              map = this.getMap();
              if (map instanceof google.maps.Map) {
                if (!map.getBounds().contains(this.position_)) {
                  map.setCenter(this.position_);
                }
                bounds = map.getBounds();
                var mapDiv = map.getDiv();
                var mapWidth = mapDiv.offsetWidth;
                var mapHeight = mapDiv.offsetHeight;
                var iwOffsetX = this.pixelOffset_.width;
                var iwOffsetY = this.pixelOffset_.height;
                var iwWidth = this.div_.offsetWidth;
                var iwHeight = this.div_.offsetHeight;
                var padX = this.infoBoxClearance_.width;
                var padY = this.infoBoxClearance_.height;
                var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);
                if (pixPosition.x < (-iwOffsetX + padX)) {
                  xOffset = pixPosition.x + iwOffsetX - padX;
                } else if ((pixPosition.x + iwWidth + iwOffsetX + padX) > mapWidth) {
                  xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
                }
                if (this.alignBottom_) {
                  if (pixPosition.y < (-iwOffsetY + padY + iwHeight)) {
                    yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
                  } else if ((pixPosition.y + iwOffsetY + padY) > mapHeight) {
                    yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
                  }
                } else {
                  if (pixPosition.y < (-iwOffsetY + padY)) {
                    yOffset = pixPosition.y + iwOffsetY - padY;
                  } else if ((pixPosition.y + iwHeight + iwOffsetY + padY) > mapHeight) {
                    yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
                  }
                }
                if (!(xOffset === 0 && yOffset === 0)) {
                  var c = map.getCenter();
                  map.panBy(xOffset, yOffset);
                }
              }
            }
          };
          InfoBox.prototype.setBoxStyle_ = function() {
            var i,
                boxStyle;
            if (this.div_) {
              this.div_.className = this.boxClass_;
              this.div_.style.cssText = "";
              boxStyle = this.boxStyle_;
              for (i in boxStyle) {
                if (boxStyle.hasOwnProperty(i)) {
                  this.div_.style[i] = boxStyle[i];
                }
              }
              this.div_.style.WebkitTransform = "translateZ(0)";
              if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {
                this.div_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (this.div_.style.opacity * 100) + ")\"";
                this.div_.style.filter = "alpha(opacity=" + (this.div_.style.opacity * 100) + ")";
              }
              this.div_.style.position = "absolute";
              this.div_.style.visibility = 'hidden';
              if (this.zIndex_ !== null) {
                this.div_.style.zIndex = this.zIndex_;
              }
            }
          };
          InfoBox.prototype.getBoxWidths_ = function() {
            var computedStyle;
            var bw = {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            };
            var box = this.div_;
            if (document.defaultView && document.defaultView.getComputedStyle) {
              computedStyle = box.ownerDocument.defaultView.getComputedStyle(box, "");
              if (computedStyle) {
                bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
                bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
                bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
                bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
              }
            } else if (document.documentElement.currentStyle) {
              if (box.currentStyle) {
                bw.top = parseInt(box.currentStyle.borderTopWidth, 10) || 0;
                bw.bottom = parseInt(box.currentStyle.borderBottomWidth, 10) || 0;
                bw.left = parseInt(box.currentStyle.borderLeftWidth, 10) || 0;
                bw.right = parseInt(box.currentStyle.borderRightWidth, 10) || 0;
              }
            }
            return bw;
          };
          InfoBox.prototype.onRemove = function() {
            if (this.div_) {
              this.div_.parentNode.removeChild(this.div_);
              this.div_ = null;
            }
          };
          InfoBox.prototype.draw = function() {
            this.createInfoBoxDiv_();
            var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);
            this.div_.style.left = (pixPosition.x + this.pixelOffset_.width) + "px";
            if (this.alignBottom_) {
              this.div_.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + "px";
            } else {
              this.div_.style.top = (pixPosition.y + this.pixelOffset_.height) + "px";
            }
            if (this.isHidden_) {
              this.div_.style.visibility = "hidden";
            } else {
              this.div_.style.visibility = "visible";
            }
          };
          InfoBox.prototype.setOptions = function(opt_opts) {
            if (typeof opt_opts.boxClass !== "undefined") {
              this.boxClass_ = opt_opts.boxClass;
              this.setBoxStyle_();
            }
            if (typeof opt_opts.boxStyle !== "undefined") {
              this.boxStyle_ = opt_opts.boxStyle;
              this.setBoxStyle_();
            }
            if (typeof opt_opts.content !== "undefined") {
              this.setContent(opt_opts.content);
            }
            if (typeof opt_opts.disableAutoPan !== "undefined") {
              this.disableAutoPan_ = opt_opts.disableAutoPan;
            }
            if (typeof opt_opts.maxWidth !== "undefined") {
              this.maxWidth_ = opt_opts.maxWidth;
            }
            if (typeof opt_opts.pixelOffset !== "undefined") {
              this.pixelOffset_ = opt_opts.pixelOffset;
            }
            if (typeof opt_opts.alignBottom !== "undefined") {
              this.alignBottom_ = opt_opts.alignBottom;
            }
            if (typeof opt_opts.position !== "undefined") {
              this.setPosition(opt_opts.position);
            }
            if (typeof opt_opts.zIndex !== "undefined") {
              this.setZIndex(opt_opts.zIndex);
            }
            if (typeof opt_opts.closeBoxMargin !== "undefined") {
              this.closeBoxMargin_ = opt_opts.closeBoxMargin;
            }
            if (typeof opt_opts.closeBoxURL !== "undefined") {
              this.closeBoxURL_ = opt_opts.closeBoxURL;
            }
            if (typeof opt_opts.infoBoxClearance !== "undefined") {
              this.infoBoxClearance_ = opt_opts.infoBoxClearance;
            }
            if (typeof opt_opts.isHidden !== "undefined") {
              this.isHidden_ = opt_opts.isHidden;
            }
            if (typeof opt_opts.visible !== "undefined") {
              this.isHidden_ = !opt_opts.visible;
            }
            if (typeof opt_opts.enableEventPropagation !== "undefined") {
              this.enableEventPropagation_ = opt_opts.enableEventPropagation;
            }
            if (this.div_) {
              this.draw();
            }
          };
          InfoBox.prototype.setContent = function(content) {
            this.content_ = content;
            if (this.div_) {
              if (this.closeListener_) {
                google.maps.event.removeListener(this.closeListener_);
                this.closeListener_ = null;
              }
              if (!this.fixedWidthSet_) {
                this.div_.style.width = "";
              }
              if (typeof content.nodeType === "undefined") {
                this.div_.innerHTML = this.getCloseBoxImg_() + content;
              } else {
                this.div_.innerHTML = this.getCloseBoxImg_();
                this.div_.appendChild(content);
              }
              if (!this.fixedWidthSet_) {
                this.div_.style.width = this.div_.offsetWidth + "px";
                if (typeof content.nodeType === "undefined") {
                  this.div_.innerHTML = this.getCloseBoxImg_() + content;
                } else {
                  this.div_.innerHTML = this.getCloseBoxImg_();
                  this.div_.appendChild(content);
                }
              }
              this.addClickHandler_();
            }
            google.maps.event.trigger(this, "content_changed");
          };
          InfoBox.prototype.setPosition = function(latlng) {
            this.position_ = latlng;
            if (this.div_) {
              this.draw();
            }
            google.maps.event.trigger(this, "position_changed");
          };
          InfoBox.prototype.setZIndex = function(index) {
            this.zIndex_ = index;
            if (this.div_) {
              this.div_.style.zIndex = index;
            }
            google.maps.event.trigger(this, "zindex_changed");
          };
          InfoBox.prototype.setVisible = function(isVisible) {
            this.isHidden_ = !isVisible;
            if (this.div_) {
              this.div_.style.visibility = (this.isHidden_ ? "hidden" : "visible");
            }
          };
          InfoBox.prototype.getContent = function() {
            return this.content_;
          };
          InfoBox.prototype.getPosition = function() {
            return this.position_;
          };
          InfoBox.prototype.getZIndex = function() {
            return this.zIndex_;
          };
          InfoBox.prototype.getVisible = function() {
            var isVisible;
            if ((typeof this.getMap() === "undefined") || (this.getMap() === null)) {
              isVisible = false;
            } else {
              isVisible = !this.isHidden_;
            }
            return isVisible;
          };
          InfoBox.prototype.show = function() {
            this.isHidden_ = false;
            if (this.div_) {
              this.div_.style.visibility = "visible";
            }
          };
          InfoBox.prototype.hide = function() {
            this.isHidden_ = true;
            if (this.div_) {
              this.div_.style.visibility = "hidden";
            }
          };
          InfoBox.prototype.open = function(map, anchor) {
            var me = this;
            if (anchor) {
              this.position_ = anchor.getPosition();
              this.moveListener_ = google.maps.event.addListener(anchor, "position_changed", function() {
                me.setPosition(this.getPosition());
              });
            }
            this.setMap(map);
            if (this.div_) {
              this.panBox_();
            }
          };
          InfoBox.prototype.close = function() {
            var i;
            if (this.closeListener_) {
              google.maps.event.removeListener(this.closeListener_);
              this.closeListener_ = null;
            }
            if (this.eventListeners_) {
              for (i = 0; i < this.eventListeners_.length; i++) {
                google.maps.event.removeListener(this.eventListeners_[i]);
              }
              this.eventListeners_ = null;
            }
            if (this.moveListener_) {
              google.maps.event.removeListener(this.moveListener_);
              this.moveListener_ = null;
            }
            if (this.contextListener_) {
              google.maps.event.removeListener(this.contextListener_);
              this.contextListener_ = null;
            }
            this.setMap(null);
          };
          (function() {
            var toPixels = function(widthValue) {
              var px;
              switch (widthValue) {
                case "thin":
                  px = "2px";
                  break;
                case "medium":
                  px = "4px";
                  break;
                case "thick":
                  px = "6px";
                  break;
                default:
                  px = widthValue;
              }
              return px;
            };
            var getBorderWidths = function(h) {
              var computedStyle;
              var bw = {};
              if (document.defaultView && document.defaultView.getComputedStyle) {
                computedStyle = h.ownerDocument.defaultView.getComputedStyle(h, "");
                if (computedStyle) {
                  bw.top = parseInt(computedStyle.borderTopWidth, 10) || 0;
                  bw.bottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
                  bw.left = parseInt(computedStyle.borderLeftWidth, 10) || 0;
                  bw.right = parseInt(computedStyle.borderRightWidth, 10) || 0;
                  return bw;
                }
              } else if (document.documentElement.currentStyle) {
                if (h.currentStyle) {
                  bw.top = parseInt(toPixels(h.currentStyle.borderTopWidth), 10) || 0;
                  bw.bottom = parseInt(toPixels(h.currentStyle.borderBottomWidth), 10) || 0;
                  bw.left = parseInt(toPixels(h.currentStyle.borderLeftWidth), 10) || 0;
                  bw.right = parseInt(toPixels(h.currentStyle.borderRightWidth), 10) || 0;
                  return bw;
                }
              }
              bw.top = parseInt(h.style["border-top-width"], 10) || 0;
              bw.bottom = parseInt(h.style["border-bottom-width"], 10) || 0;
              bw.left = parseInt(h.style["border-left-width"], 10) || 0;
              bw.right = parseInt(h.style["border-right-width"], 10) || 0;
              return bw;
            };
            var scroll = {
              x: 0,
              y: 0
            };
            var getScrollValue = function(e) {
              scroll.x = (typeof document.documentElement.scrollLeft !== "undefined" ? document.documentElement.scrollLeft : document.body.scrollLeft);
              scroll.y = (typeof document.documentElement.scrollTop !== "undefined" ? document.documentElement.scrollTop : document.body.scrollTop);
            };
            getScrollValue();
            var getMousePosition = function(e) {
              var posX = 0,
                  posY = 0;
              e = e || window.event;
              if (typeof e.pageX !== "undefined") {
                posX = e.pageX;
                posY = e.pageY;
              } else if (typeof e.clientX !== "undefined") {
                posX = e.clientX + scroll.x;
                posY = e.clientY + scroll.y;
              }
              return {
                left: posX,
                top: posY
              };
            };
            var getElementPosition = function(h) {
              var posX = h.offsetLeft;
              var posY = h.offsetTop;
              var parent = h.offsetParent;
              while (parent !== null) {
                if (parent !== document.body && parent !== document.documentElement) {
                  posX -= parent.scrollLeft;
                  posY -= parent.scrollTop;
                }
                var m = parent;
                var moffx = m.offsetLeft;
                var moffy = m.offsetTop;
                if (!moffx && !moffy && window.getComputedStyle) {
                  var matrix = document.defaultView.getComputedStyle(m, null).MozTransform || document.defaultView.getComputedStyle(m, null).WebkitTransform;
                  if (matrix) {
                    if (typeof matrix === "string") {
                      var parms = matrix.split(",");
                      moffx += parseInt(parms[4], 10) || 0;
                      moffy += parseInt(parms[5], 10) || 0;
                    }
                  }
                }
                posX += moffx;
                posY += moffy;
                parent = parent.offsetParent;
              }
              return {
                left: posX,
                top: posY
              };
            };
            var setVals = function(obj, vals) {
              if (obj && vals) {
                for (var x in vals) {
                  if (vals.hasOwnProperty(x)) {
                    obj[x] = vals[x];
                  }
                }
              }
              return obj;
            };
            var setOpacity = function(h, op) {
              if (typeof op !== "undefined") {
                h.style.opacity = op;
              }
              if (typeof h.style.opacity !== "undefined" && h.style.opacity !== "") {
                h.style.filter = "alpha(opacity=" + (h.style.opacity * 100) + ")";
              }
            };
            function DragZoom(map, opt_zoomOpts) {
              var me = this;
              var ov = new google.maps.OverlayView();
              ov.onAdd = function() {
                me.init_(map, opt_zoomOpts);
              };
              ov.draw = function() {};
              ov.onRemove = function() {};
              ov.setMap(map);
              this.prjov_ = ov;
            }
            DragZoom.prototype.init_ = function(map, opt_zoomOpts) {
              var i;
              var me = this;
              this.map_ = map;
              opt_zoomOpts = opt_zoomOpts || {};
              this.key_ = opt_zoomOpts.key || "shift";
              this.key_ = this.key_.toLowerCase();
              this.borderWidths_ = getBorderWidths(this.map_.getDiv());
              this.veilDiv_ = [];
              for (i = 0; i < 4; i++) {
                this.veilDiv_[i] = document.createElement("div");
                this.veilDiv_[i].onselectstart = function() {
                  return false;
                };
                setVals(this.veilDiv_[i].style, {
                  backgroundColor: "gray",
                  opacity: 0.25,
                  cursor: "crosshair"
                });
                setVals(this.veilDiv_[i].style, opt_zoomOpts.paneStyle);
                setVals(this.veilDiv_[i].style, opt_zoomOpts.veilStyle);
                setVals(this.veilDiv_[i].style, {
                  position: "absolute",
                  overflow: "hidden",
                  display: "none"
                });
                if (this.key_ === "shift") {
                  this.veilDiv_[i].style.MozUserSelect = "none";
                }
                setOpacity(this.veilDiv_[i]);
                if (this.veilDiv_[i].style.backgroundColor === "transparent") {
                  this.veilDiv_[i].style.backgroundColor = "white";
                  setOpacity(this.veilDiv_[i], 0);
                }
                this.map_.getDiv().appendChild(this.veilDiv_[i]);
              }
              this.noZoom_ = opt_zoomOpts.noZoom || false;
              this.visualEnabled_ = opt_zoomOpts.visualEnabled || false;
              this.visualClass_ = opt_zoomOpts.visualClass || "";
              this.visualPosition_ = opt_zoomOpts.visualPosition || google.maps.ControlPosition.LEFT_TOP;
              this.visualPositionOffset_ = opt_zoomOpts.visualPositionOffset || new google.maps.Size(35, 0);
              this.visualPositionIndex_ = opt_zoomOpts.visualPositionIndex || null;
              this.visualSprite_ = opt_zoomOpts.visualSprite || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/mapfiles/ftr/controls/dragzoom_btn.png";
              this.visualSize_ = opt_zoomOpts.visualSize || new google.maps.Size(20, 20);
              this.visualTips_ = opt_zoomOpts.visualTips || {};
              this.visualTips_.off = this.visualTips_.off || "Turn on drag zoom mode";
              this.visualTips_.on = this.visualTips_.on || "Turn off drag zoom mode";
              this.boxDiv_ = document.createElement("div");
              setVals(this.boxDiv_.style, {border: "4px solid #736AFF"});
              setVals(this.boxDiv_.style, opt_zoomOpts.boxStyle);
              setVals(this.boxDiv_.style, {
                position: "absolute",
                display: "none"
              });
              setOpacity(this.boxDiv_);
              this.map_.getDiv().appendChild(this.boxDiv_);
              this.boxBorderWidths_ = getBorderWidths(this.boxDiv_);
              this.listeners_ = [google.maps.event.addDomListener(document, "keydown", function(e) {
                me.onKeyDown_(e);
              }), google.maps.event.addDomListener(document, "keyup", function(e) {
                me.onKeyUp_(e);
              }), google.maps.event.addDomListener(this.veilDiv_[0], "mousedown", function(e) {
                me.onMouseDown_(e);
              }), google.maps.event.addDomListener(this.veilDiv_[1], "mousedown", function(e) {
                me.onMouseDown_(e);
              }), google.maps.event.addDomListener(this.veilDiv_[2], "mousedown", function(e) {
                me.onMouseDown_(e);
              }), google.maps.event.addDomListener(this.veilDiv_[3], "mousedown", function(e) {
                me.onMouseDown_(e);
              }), google.maps.event.addDomListener(document, "mousedown", function(e) {
                me.onMouseDownDocument_(e);
              }), google.maps.event.addDomListener(document, "mousemove", function(e) {
                me.onMouseMove_(e);
              }), google.maps.event.addDomListener(document, "mouseup", function(e) {
                me.onMouseUp_(e);
              }), google.maps.event.addDomListener(window, "scroll", getScrollValue)];
              this.hotKeyDown_ = false;
              this.mouseDown_ = false;
              this.dragging_ = false;
              this.startPt_ = null;
              this.endPt_ = null;
              this.mapWidth_ = null;
              this.mapHeight_ = null;
              this.mousePosn_ = null;
              this.mapPosn_ = null;
              if (this.visualEnabled_) {
                this.buttonDiv_ = this.initControl_(this.visualPositionOffset_);
                if (this.visualPositionIndex_ !== null) {
                  this.buttonDiv_.index = this.visualPositionIndex_;
                }
                this.map_.controls[this.visualPosition_].push(this.buttonDiv_);
                this.controlIndex_ = this.map_.controls[this.visualPosition_].length - 1;
              }
            };
            DragZoom.prototype.initControl_ = function(offset) {
              var control;
              var image;
              var me = this;
              control = document.createElement("div");
              control.className = this.visualClass_;
              control.style.position = "relative";
              control.style.overflow = "hidden";
              control.style.height = this.visualSize_.height + "px";
              control.style.width = this.visualSize_.width + "px";
              control.title = this.visualTips_.off;
              image = document.createElement("img");
              image.src = this.visualSprite_;
              image.style.position = "absolute";
              image.style.left = -(this.visualSize_.width * 2) + "px";
              image.style.top = 0 + "px";
              control.appendChild(image);
              control.onclick = function(e) {
                me.hotKeyDown_ = !me.hotKeyDown_;
                if (me.hotKeyDown_) {
                  me.buttonDiv_.firstChild.style.left = -(me.visualSize_.width * 0) + "px";
                  me.buttonDiv_.title = me.visualTips_.on;
                  me.activatedByControl_ = true;
                  google.maps.event.trigger(me, "activate");
                } else {
                  me.buttonDiv_.firstChild.style.left = -(me.visualSize_.width * 2) + "px";
                  me.buttonDiv_.title = me.visualTips_.off;
                  google.maps.event.trigger(me, "deactivate");
                }
                me.onMouseMove_(e);
              };
              control.onmouseover = function() {
                me.buttonDiv_.firstChild.style.left = -(me.visualSize_.width * 1) + "px";
              };
              control.onmouseout = function() {
                if (me.hotKeyDown_) {
                  me.buttonDiv_.firstChild.style.left = -(me.visualSize_.width * 0) + "px";
                  me.buttonDiv_.title = me.visualTips_.on;
                } else {
                  me.buttonDiv_.firstChild.style.left = -(me.visualSize_.width * 2) + "px";
                  me.buttonDiv_.title = me.visualTips_.off;
                }
              };
              control.ondragstart = function() {
                return false;
              };
              setVals(control.style, {
                cursor: "pointer",
                marginTop: offset.height + "px",
                marginLeft: offset.width + "px"
              });
              return control;
            };
            DragZoom.prototype.isHotKeyDown_ = function(e) {
              var isHot;
              e = e || window.event;
              isHot = (e.shiftKey && this.key_ === "shift") || (e.altKey && this.key_ === "alt") || (e.ctrlKey && this.key_ === "ctrl");
              if (!isHot) {
                switch (e.keyCode) {
                  case 16:
                    if (this.key_ === "shift") {
                      isHot = true;
                    }
                    break;
                  case 17:
                    if (this.key_ === "ctrl") {
                      isHot = true;
                    }
                    break;
                  case 18:
                    if (this.key_ === "alt") {
                      isHot = true;
                    }
                    break;
                }
              }
              return isHot;
            };
            DragZoom.prototype.isMouseOnMap_ = function() {
              var mousePosn = this.mousePosn_;
              if (mousePosn) {
                var mapPosn = this.mapPosn_;
                var mapDiv = this.map_.getDiv();
                return mousePosn.left > mapPosn.left && mousePosn.left < (mapPosn.left + mapDiv.offsetWidth) && mousePosn.top > mapPosn.top && mousePosn.top < (mapPosn.top + mapDiv.offsetHeight);
              } else {
                return false;
              }
            };
            DragZoom.prototype.setVeilVisibility_ = function() {
              var i;
              if (this.map_ && this.hotKeyDown_ && this.isMouseOnMap_()) {
                var mapDiv = this.map_.getDiv();
                this.mapWidth_ = mapDiv.offsetWidth - (this.borderWidths_.left + this.borderWidths_.right);
                this.mapHeight_ = mapDiv.offsetHeight - (this.borderWidths_.top + this.borderWidths_.bottom);
                if (this.activatedByControl_) {
                  var left = parseInt(this.buttonDiv_.style.left, 10) + this.visualPositionOffset_.width;
                  var top = parseInt(this.buttonDiv_.style.top, 10) + this.visualPositionOffset_.height;
                  var width = this.visualSize_.width;
                  var height = this.visualSize_.height;
                  this.veilDiv_[0].style.top = "0px";
                  this.veilDiv_[0].style.left = "0px";
                  this.veilDiv_[0].style.width = left + "px";
                  this.veilDiv_[0].style.height = this.mapHeight_ + "px";
                  this.veilDiv_[1].style.top = "0px";
                  this.veilDiv_[1].style.left = (left + width) + "px";
                  this.veilDiv_[1].style.width = (this.mapWidth_ - (left + width)) + "px";
                  this.veilDiv_[1].style.height = this.mapHeight_ + "px";
                  this.veilDiv_[2].style.top = "0px";
                  this.veilDiv_[2].style.left = left + "px";
                  this.veilDiv_[2].style.width = width + "px";
                  this.veilDiv_[2].style.height = top + "px";
                  this.veilDiv_[3].style.top = (top + height) + "px";
                  this.veilDiv_[3].style.left = left + "px";
                  this.veilDiv_[3].style.width = width + "px";
                  this.veilDiv_[3].style.height = (this.mapHeight_ - (top + height)) + "px";
                  for (i = 0; i < this.veilDiv_.length; i++) {
                    this.veilDiv_[i].style.display = "block";
                  }
                } else {
                  this.veilDiv_[0].style.left = "0px";
                  this.veilDiv_[0].style.top = "0px";
                  this.veilDiv_[0].style.width = this.mapWidth_ + "px";
                  this.veilDiv_[0].style.height = this.mapHeight_ + "px";
                  for (i = 1; i < this.veilDiv_.length; i++) {
                    this.veilDiv_[i].style.width = "0px";
                    this.veilDiv_[i].style.height = "0px";
                  }
                  for (i = 0; i < this.veilDiv_.length; i++) {
                    this.veilDiv_[i].style.display = "block";
                  }
                }
              } else {
                for (i = 0; i < this.veilDiv_.length; i++) {
                  this.veilDiv_[i].style.display = "none";
                }
              }
            };
            DragZoom.prototype.onKeyDown_ = function(e) {
              if (this.map_ && !this.hotKeyDown_ && this.isHotKeyDown_(e)) {
                this.mapPosn_ = getElementPosition(this.map_.getDiv());
                this.hotKeyDown_ = true;
                this.activatedByControl_ = false;
                this.setVeilVisibility_();
                google.maps.event.trigger(this, "activate");
              }
            };
            DragZoom.prototype.getMousePoint_ = function(e) {
              var mousePosn = getMousePosition(e);
              var p = new google.maps.Point();
              p.x = mousePosn.left - this.mapPosn_.left - this.borderWidths_.left;
              p.y = mousePosn.top - this.mapPosn_.top - this.borderWidths_.top;
              p.x = Math.min(p.x, this.mapWidth_);
              p.y = Math.min(p.y, this.mapHeight_);
              p.x = Math.max(p.x, 0);
              p.y = Math.max(p.y, 0);
              return p;
            };
            DragZoom.prototype.onMouseDown_ = function(e) {
              if (this.map_ && this.hotKeyDown_) {
                this.mapPosn_ = getElementPosition(this.map_.getDiv());
                this.dragging_ = true;
                this.startPt_ = this.endPt_ = this.getMousePoint_(e);
                this.boxDiv_.style.width = this.boxDiv_.style.height = "0px";
                var prj = this.prjov_.getProjection();
                var latlng = prj.fromContainerPixelToLatLng(this.startPt_);
                google.maps.event.trigger(this, "dragstart", latlng);
              }
            };
            DragZoom.prototype.onMouseDownDocument_ = function(e) {
              this.mouseDown_ = true;
            };
            DragZoom.prototype.onMouseMove_ = function(e) {
              this.mousePosn_ = getMousePosition(e);
              if (this.dragging_) {
                this.endPt_ = this.getMousePoint_(e);
                var left = Math.min(this.startPt_.x, this.endPt_.x);
                var top = Math.min(this.startPt_.y, this.endPt_.y);
                var width = Math.abs(this.startPt_.x - this.endPt_.x);
                var height = Math.abs(this.startPt_.y - this.endPt_.y);
                var boxWidth = Math.max(0, width - (this.boxBorderWidths_.left + this.boxBorderWidths_.right));
                var boxHeight = Math.max(0, height - (this.boxBorderWidths_.top + this.boxBorderWidths_.bottom));
                this.veilDiv_[0].style.top = "0px";
                this.veilDiv_[0].style.left = "0px";
                this.veilDiv_[0].style.width = left + "px";
                this.veilDiv_[0].style.height = this.mapHeight_ + "px";
                this.veilDiv_[1].style.top = "0px";
                this.veilDiv_[1].style.left = (left + width) + "px";
                this.veilDiv_[1].style.width = (this.mapWidth_ - (left + width)) + "px";
                this.veilDiv_[1].style.height = this.mapHeight_ + "px";
                this.veilDiv_[2].style.top = "0px";
                this.veilDiv_[2].style.left = left + "px";
                this.veilDiv_[2].style.width = width + "px";
                this.veilDiv_[2].style.height = top + "px";
                this.veilDiv_[3].style.top = (top + height) + "px";
                this.veilDiv_[3].style.left = left + "px";
                this.veilDiv_[3].style.width = width + "px";
                this.veilDiv_[3].style.height = (this.mapHeight_ - (top + height)) + "px";
                this.boxDiv_.style.top = top + "px";
                this.boxDiv_.style.left = left + "px";
                this.boxDiv_.style.width = boxWidth + "px";
                this.boxDiv_.style.height = boxHeight + "px";
                this.boxDiv_.style.display = "block";
                google.maps.event.trigger(this, "drag", new google.maps.Point(left, top + height), new google.maps.Point(left + width, top), this.prjov_.getProjection());
              } else if (!this.mouseDown_) {
                this.mapPosn_ = getElementPosition(this.map_.getDiv());
                this.setVeilVisibility_();
              }
            };
            DragZoom.prototype.onMouseUp_ = function(e) {
              var z;
              var me = this;
              this.mouseDown_ = false;
              if (this.dragging_) {
                if ((this.getMousePoint_(e).x === this.startPt_.x) && (this.getMousePoint_(e).y === this.startPt_.y)) {
                  this.onKeyUp_(e);
                  return;
                }
                var left = Math.min(this.startPt_.x, this.endPt_.x);
                var top = Math.min(this.startPt_.y, this.endPt_.y);
                var width = Math.abs(this.startPt_.x - this.endPt_.x);
                var height = Math.abs(this.startPt_.y - this.endPt_.y);
                var kGoogleCenteringBug = true;
                if (kGoogleCenteringBug) {
                  left += this.borderWidths_.left;
                  top += this.borderWidths_.top;
                }
                var prj = this.prjov_.getProjection();
                var sw = prj.fromContainerPixelToLatLng(new google.maps.Point(left, top + height));
                var ne = prj.fromContainerPixelToLatLng(new google.maps.Point(left + width, top));
                var bnds = new google.maps.LatLngBounds(sw, ne);
                if (this.noZoom_) {
                  this.boxDiv_.style.display = "none";
                } else {
                  z = this.map_.getZoom();
                  this.map_.fitBounds(bnds);
                  if (this.map_.getZoom() < z) {
                    this.map_.setZoom(z);
                  }
                  var swPt = prj.fromLatLngToContainerPixel(sw);
                  var nePt = prj.fromLatLngToContainerPixel(ne);
                  if (kGoogleCenteringBug) {
                    swPt.x -= this.borderWidths_.left;
                    swPt.y -= this.borderWidths_.top;
                    nePt.x -= this.borderWidths_.left;
                    nePt.y -= this.borderWidths_.top;
                  }
                  this.boxDiv_.style.left = swPt.x + "px";
                  this.boxDiv_.style.top = nePt.y + "px";
                  this.boxDiv_.style.width = (Math.abs(nePt.x - swPt.x) - (this.boxBorderWidths_.left + this.boxBorderWidths_.right)) + "px";
                  this.boxDiv_.style.height = (Math.abs(nePt.y - swPt.y) - (this.boxBorderWidths_.top + this.boxBorderWidths_.bottom)) + "px";
                  setTimeout(function() {
                    me.boxDiv_.style.display = "none";
                  }, 1000);
                }
                this.dragging_ = false;
                this.onMouseMove_(e);
                google.maps.event.trigger(this, "dragend", bnds);
                if (!this.isHotKeyDown_(e)) {
                  this.onKeyUp_(e);
                }
              }
            };
            DragZoom.prototype.onKeyUp_ = function(e) {
              var i;
              var left,
                  top,
                  width,
                  height,
                  prj,
                  sw,
                  ne;
              var bnds = null;
              if (this.map_ && this.hotKeyDown_) {
                this.hotKeyDown_ = false;
                if (this.dragging_) {
                  this.boxDiv_.style.display = "none";
                  this.dragging_ = false;
                  left = Math.min(this.startPt_.x, this.endPt_.x);
                  top = Math.min(this.startPt_.y, this.endPt_.y);
                  width = Math.abs(this.startPt_.x - this.endPt_.x);
                  height = Math.abs(this.startPt_.y - this.endPt_.y);
                  prj = this.prjov_.getProjection();
                  sw = prj.fromContainerPixelToLatLng(new google.maps.Point(left, top + height));
                  ne = prj.fromContainerPixelToLatLng(new google.maps.Point(left + width, top));
                  bnds = new google.maps.LatLngBounds(sw, ne);
                }
                for (i = 0; i < this.veilDiv_.length; i++) {
                  this.veilDiv_[i].style.display = "none";
                }
                if (this.visualEnabled_) {
                  this.buttonDiv_.firstChild.style.left = -(this.visualSize_.width * 2) + "px";
                  this.buttonDiv_.title = this.visualTips_.off;
                  this.buttonDiv_.style.display = "";
                }
                google.maps.event.trigger(this, "deactivate", bnds);
              }
            };
            google.maps.Map.prototype.enableKeyDragZoom = function(opt_zoomOpts) {
              this.dragZoom_ = new DragZoom(this, opt_zoomOpts);
            };
            google.maps.Map.prototype.disableKeyDragZoom = function() {
              var i;
              var d = this.dragZoom_;
              if (d) {
                for (i = 0; i < d.listeners_.length; ++i) {
                  google.maps.event.removeListener(d.listeners_[i]);
                }
                this.getDiv().removeChild(d.boxDiv_);
                for (i = 0; i < d.veilDiv_.length; i++) {
                  this.getDiv().removeChild(d.veilDiv_[i]);
                }
                if (d.visualEnabled_) {
                  this.controls[d.visualPosition_].removeAt(d.controlIndex_);
                }
                d.prjov_.setMap(null);
                this.dragZoom_ = null;
              }
            };
            google.maps.Map.prototype.keyDragZoomEnabled = function() {
              return this.dragZoom_ !== null;
            };
            google.maps.Map.prototype.getDragZoomObject = function() {
              return this.dragZoom_;
            };
          })();
          function ClusterIcon(cluster, styles) {
            cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);
            this.cluster_ = cluster;
            this.className_ = cluster.getMarkerClusterer().getClusterClass();
            this.styles_ = styles;
            this.center_ = null;
            this.div_ = null;
            this.sums_ = null;
            this.visible_ = false;
            this.setMap(cluster.getMap());
          }
          ClusterIcon.prototype.onAdd = function() {
            var cClusterIcon = this;
            var cMouseDownInCluster;
            var cDraggingMapByCluster;
            this.div_ = document.createElement("div");
            this.div_.className = this.className_;
            if (this.visible_) {
              this.show();
            }
            this.getPanes().overlayMouseTarget.appendChild(this.div_);
            this.boundsChangedListener_ = google.maps.event.addListener(this.getMap(), "bounds_changed", function() {
              cDraggingMapByCluster = cMouseDownInCluster;
            });
            google.maps.event.addDomListener(this.div_, "mousedown", function() {
              cMouseDownInCluster = true;
              cDraggingMapByCluster = false;
            });
            google.maps.event.addDomListener(this.div_, "click", function(e) {
              cMouseDownInCluster = false;
              if (!cDraggingMapByCluster) {
                var theBounds;
                var mz;
                var mc = cClusterIcon.cluster_.getMarkerClusterer();
                google.maps.event.trigger(mc, "click", cClusterIcon.cluster_);
                google.maps.event.trigger(mc, "clusterclick", cClusterIcon.cluster_);
                if (mc.getZoomOnClick()) {
                  mz = mc.getMaxZoom();
                  theBounds = cClusterIcon.cluster_.getBounds();
                  mc.getMap().fitBounds(theBounds);
                  setTimeout(function() {
                    mc.getMap().fitBounds(theBounds);
                    if (mz !== null && (mc.getMap().getZoom() > mz)) {
                      mc.getMap().setZoom(mz + 1);
                    }
                  }, 100);
                }
                e.cancelBubble = true;
                if (e.stopPropagation) {
                  e.stopPropagation();
                }
              }
            });
            google.maps.event.addDomListener(this.div_, "mouseover", function() {
              var mc = cClusterIcon.cluster_.getMarkerClusterer();
              google.maps.event.trigger(mc, "mouseover", cClusterIcon.cluster_);
            });
            google.maps.event.addDomListener(this.div_, "mouseout", function() {
              var mc = cClusterIcon.cluster_.getMarkerClusterer();
              google.maps.event.trigger(mc, "mouseout", cClusterIcon.cluster_);
            });
          };
          ClusterIcon.prototype.onRemove = function() {
            if (this.div_ && this.div_.parentNode) {
              this.hide();
              google.maps.event.removeListener(this.boundsChangedListener_);
              google.maps.event.clearInstanceListeners(this.div_);
              this.div_.parentNode.removeChild(this.div_);
              this.div_ = null;
            }
          };
          ClusterIcon.prototype.draw = function() {
            if (this.visible_) {
              var pos = this.getPosFromLatLng_(this.center_);
              this.div_.style.top = pos.y + "px";
              this.div_.style.left = pos.x + "px";
            }
          };
          ClusterIcon.prototype.hide = function() {
            if (this.div_) {
              this.div_.style.display = "none";
            }
            this.visible_ = false;
          };
          ClusterIcon.prototype.show = function() {
            if (this.div_) {
              var img = "";
              var bp = this.backgroundPosition_.split(" ");
              var spriteH = parseInt(bp[0].trim(), 10);
              var spriteV = parseInt(bp[1].trim(), 10);
              var pos = this.getPosFromLatLng_(this.center_);
              this.div_.style.cssText = this.createCss(pos);
              img = "<img src='" + this.url_ + "' style='position: absolute; top: " + spriteV + "px; left: " + spriteH + "px; ";
              if (!this.cluster_.getMarkerClusterer().enableRetinaIcons_) {
                img += "clip: rect(" + (-1 * spriteV) + "px, " + ((-1 * spriteH) + this.width_) + "px, " + ((-1 * spriteV) + this.height_) + "px, " + (-1 * spriteH) + "px);";
              }
              img += "'>";
              this.div_.innerHTML = img + "<div style='" + "position: absolute;" + "top: " + this.anchorText_[0] + "px;" + "left: " + this.anchorText_[1] + "px;" + "color: " + this.textColor_ + ";" + "font-size: " + this.textSize_ + "px;" + "font-family: " + this.fontFamily_ + ";" + "font-weight: " + this.fontWeight_ + ";" + "font-style: " + this.fontStyle_ + ";" + "text-decoration: " + this.textDecoration_ + ";" + "text-align: center;" + "width: " + this.width_ + "px;" + "line-height:" + this.height_ + "px;" + "'>" + this.sums_.text + "</div>";
              if (typeof this.sums_.title === "undefined" || this.sums_.title === "") {
                this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
              } else {
                this.div_.title = this.sums_.title;
              }
              this.div_.style.display = "";
            }
            this.visible_ = true;
          };
          ClusterIcon.prototype.useStyle = function(sums) {
            this.sums_ = sums;
            var index = Math.max(0, sums.index - 1);
            index = Math.min(this.styles_.length - 1, index);
            var style = this.styles_[index];
            this.url_ = style.url;
            this.height_ = style.height;
            this.width_ = style.width;
            this.anchorText_ = style.anchorText || [0, 0];
            this.anchorIcon_ = style.anchorIcon || [parseInt(this.height_ / 2, 10), parseInt(this.width_ / 2, 10)];
            this.textColor_ = style.textColor || "black";
            this.textSize_ = style.textSize || 11;
            this.textDecoration_ = style.textDecoration || "none";
            this.fontWeight_ = style.fontWeight || "bold";
            this.fontStyle_ = style.fontStyle || "normal";
            this.fontFamily_ = style.fontFamily || "Arial,sans-serif";
            this.backgroundPosition_ = style.backgroundPosition || "0 0";
          };
          ClusterIcon.prototype.setCenter = function(center) {
            this.center_ = center;
          };
          ClusterIcon.prototype.createCss = function(pos) {
            var style = [];
            style.push("cursor: pointer;");
            style.push("position: absolute; top: " + pos.y + "px; left: " + pos.x + "px;");
            style.push("width: " + this.width_ + "px; height: " + this.height_ + "px;");
            return style.join("");
          };
          ClusterIcon.prototype.getPosFromLatLng_ = function(latlng) {
            var pos = this.getProjection().fromLatLngToDivPixel(latlng);
            pos.x -= this.anchorIcon_[1];
            pos.y -= this.anchorIcon_[0];
            pos.x = parseInt(pos.x, 10);
            pos.y = parseInt(pos.y, 10);
            return pos;
          };
          function Cluster(mc) {
            this.markerClusterer_ = mc;
            this.map_ = mc.getMap();
            this.gridSize_ = mc.getGridSize();
            this.minClusterSize_ = mc.getMinimumClusterSize();
            this.averageCenter_ = mc.getAverageCenter();
            this.markers_ = [];
            this.center_ = null;
            this.bounds_ = null;
            this.clusterIcon_ = new ClusterIcon(this, mc.getStyles());
          }
          Cluster.prototype.getSize = function() {
            return this.markers_.length;
          };
          Cluster.prototype.getMarkers = function() {
            return this.markers_;
          };
          Cluster.prototype.getCenter = function() {
            return this.center_;
          };
          Cluster.prototype.getMap = function() {
            return this.map_;
          };
          Cluster.prototype.getMarkerClusterer = function() {
            return this.markerClusterer_;
          };
          Cluster.prototype.getBounds = function() {
            var i;
            var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
            var markers = this.getMarkers();
            for (i = 0; i < markers.length; i++) {
              bounds.extend(markers[i].getPosition());
            }
            return bounds;
          };
          Cluster.prototype.remove = function() {
            this.clusterIcon_.setMap(null);
            this.markers_ = [];
            delete this.markers_;
          };
          Cluster.prototype.addMarker = function(marker) {
            var i;
            var mCount;
            var mz;
            if (this.isMarkerAlreadyAdded_(marker)) {
              return false;
            }
            if (!this.center_) {
              this.center_ = marker.getPosition();
              this.calculateBounds_();
            } else {
              if (this.averageCenter_) {
                var l = this.markers_.length + 1;
                var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
                var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
                this.center_ = new google.maps.LatLng(lat, lng);
                this.calculateBounds_();
              }
            }
            marker.isAdded = true;
            this.markers_.push(marker);
            mCount = this.markers_.length;
            mz = this.markerClusterer_.getMaxZoom();
            if (mz !== null && this.map_.getZoom() > mz) {
              if (marker.getMap() !== this.map_) {
                marker.setMap(this.map_);
              }
            } else if (mCount < this.minClusterSize_) {
              if (marker.getMap() !== this.map_) {
                marker.setMap(this.map_);
              }
            } else if (mCount === this.minClusterSize_) {
              for (i = 0; i < mCount; i++) {
                this.markers_[i].setMap(null);
              }
            } else {
              marker.setMap(null);
            }
            this.updateIcon_();
            return true;
          };
          Cluster.prototype.isMarkerInClusterBounds = function(marker) {
            return this.bounds_.contains(marker.getPosition());
          };
          Cluster.prototype.calculateBounds_ = function() {
            var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
            this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
          };
          Cluster.prototype.updateIcon_ = function() {
            var mCount = this.markers_.length;
            var mz = this.markerClusterer_.getMaxZoom();
            if (mz !== null && this.map_.getZoom() > mz) {
              this.clusterIcon_.hide();
              return;
            }
            if (mCount < this.minClusterSize_) {
              this.clusterIcon_.hide();
              return;
            }
            var numStyles = this.markerClusterer_.getStyles().length;
            var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
            this.clusterIcon_.setCenter(this.center_);
            this.clusterIcon_.useStyle(sums);
            this.clusterIcon_.show();
          };
          Cluster.prototype.isMarkerAlreadyAdded_ = function(marker) {
            var i;
            if (this.markers_.indexOf) {
              return this.markers_.indexOf(marker) !== -1;
            } else {
              for (i = 0; i < this.markers_.length; i++) {
                if (marker === this.markers_[i]) {
                  return true;
                }
              }
            }
            return false;
          };
          function MarkerClusterer(map, opt_markers, opt_options) {
            this.extend(MarkerClusterer, google.maps.OverlayView);
            opt_markers = opt_markers || [];
            opt_options = opt_options || {};
            this.markers_ = [];
            this.clusters_ = [];
            this.listeners_ = [];
            this.activeMap_ = null;
            this.ready_ = false;
            this.gridSize_ = opt_options.gridSize || 60;
            this.minClusterSize_ = opt_options.minimumClusterSize || 2;
            this.maxZoom_ = opt_options.maxZoom || null;
            this.styles_ = opt_options.styles || [];
            this.title_ = opt_options.title || "";
            this.zoomOnClick_ = true;
            if (opt_options.zoomOnClick !== undefined) {
              this.zoomOnClick_ = opt_options.zoomOnClick;
            }
            this.averageCenter_ = false;
            if (opt_options.averageCenter !== undefined) {
              this.averageCenter_ = opt_options.averageCenter;
            }
            this.ignoreHidden_ = false;
            if (opt_options.ignoreHidden !== undefined) {
              this.ignoreHidden_ = opt_options.ignoreHidden;
            }
            this.enableRetinaIcons_ = false;
            if (opt_options.enableRetinaIcons !== undefined) {
              this.enableRetinaIcons_ = opt_options.enableRetinaIcons;
            }
            this.imagePath_ = opt_options.imagePath || MarkerClusterer.IMAGE_PATH;
            this.imageExtension_ = opt_options.imageExtension || MarkerClusterer.IMAGE_EXTENSION;
            this.imageSizes_ = opt_options.imageSizes || MarkerClusterer.IMAGE_SIZES;
            this.calculator_ = opt_options.calculator || MarkerClusterer.CALCULATOR;
            this.batchSize_ = opt_options.batchSize || MarkerClusterer.BATCH_SIZE;
            this.batchSizeIE_ = opt_options.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE;
            this.clusterClass_ = opt_options.clusterClass || "cluster";
            if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) {
              this.batchSize_ = this.batchSizeIE_;
            }
            this.setupStyles_();
            this.addMarkers(opt_markers, true);
            this.setMap(map);
          }
          MarkerClusterer.prototype.onAdd = function() {
            var cMarkerClusterer = this;
            this.activeMap_ = this.getMap();
            this.ready_ = true;
            this.repaint();
            this.listeners_ = [google.maps.event.addListener(this.getMap(), "zoom_changed", function() {
              cMarkerClusterer.resetViewport_(false);
              if (this.getZoom() === (this.get("minZoom") || 0) || this.getZoom() === this.get("maxZoom")) {
                google.maps.event.trigger(this, "idle");
              }
            }), google.maps.event.addListener(this.getMap(), "idle", function() {
              cMarkerClusterer.redraw_();
            })];
          };
          MarkerClusterer.prototype.onRemove = function() {
            var i;
            for (i = 0; i < this.markers_.length; i++) {
              if (this.markers_[i].getMap() !== this.activeMap_) {
                this.markers_[i].setMap(this.activeMap_);
              }
            }
            for (i = 0; i < this.clusters_.length; i++) {
              this.clusters_[i].remove();
            }
            this.clusters_ = [];
            for (i = 0; i < this.listeners_.length; i++) {
              google.maps.event.removeListener(this.listeners_[i]);
            }
            this.listeners_ = [];
            this.activeMap_ = null;
            this.ready_ = false;
          };
          MarkerClusterer.prototype.draw = function() {};
          MarkerClusterer.prototype.setupStyles_ = function() {
            var i,
                size;
            if (this.styles_.length > 0) {
              return;
            }
            for (i = 0; i < this.imageSizes_.length; i++) {
              size = this.imageSizes_[i];
              this.styles_.push({
                url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,
                height: size,
                width: size
              });
            }
          };
          MarkerClusterer.prototype.fitMapToMarkers = function() {
            var i;
            var markers = this.getMarkers();
            var bounds = new google.maps.LatLngBounds();
            for (i = 0; i < markers.length; i++) {
              bounds.extend(markers[i].getPosition());
            }
            this.getMap().fitBounds(bounds);
          };
          MarkerClusterer.prototype.getGridSize = function() {
            return this.gridSize_;
          };
          MarkerClusterer.prototype.setGridSize = function(gridSize) {
            this.gridSize_ = gridSize;
          };
          MarkerClusterer.prototype.getMinimumClusterSize = function() {
            return this.minClusterSize_;
          };
          MarkerClusterer.prototype.setMinimumClusterSize = function(minimumClusterSize) {
            this.minClusterSize_ = minimumClusterSize;
          };
          MarkerClusterer.prototype.getMaxZoom = function() {
            return this.maxZoom_;
          };
          MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
            this.maxZoom_ = maxZoom;
          };
          MarkerClusterer.prototype.getStyles = function() {
            return this.styles_;
          };
          MarkerClusterer.prototype.setStyles = function(styles) {
            this.styles_ = styles;
          };
          MarkerClusterer.prototype.getTitle = function() {
            return this.title_;
          };
          MarkerClusterer.prototype.setTitle = function(title) {
            this.title_ = title;
          };
          MarkerClusterer.prototype.getZoomOnClick = function() {
            return this.zoomOnClick_;
          };
          MarkerClusterer.prototype.setZoomOnClick = function(zoomOnClick) {
            this.zoomOnClick_ = zoomOnClick;
          };
          MarkerClusterer.prototype.getAverageCenter = function() {
            return this.averageCenter_;
          };
          MarkerClusterer.prototype.setAverageCenter = function(averageCenter) {
            this.averageCenter_ = averageCenter;
          };
          MarkerClusterer.prototype.getIgnoreHidden = function() {
            return this.ignoreHidden_;
          };
          MarkerClusterer.prototype.setIgnoreHidden = function(ignoreHidden) {
            this.ignoreHidden_ = ignoreHidden;
          };
          MarkerClusterer.prototype.getEnableRetinaIcons = function() {
            return this.enableRetinaIcons_;
          };
          MarkerClusterer.prototype.setEnableRetinaIcons = function(enableRetinaIcons) {
            this.enableRetinaIcons_ = enableRetinaIcons;
          };
          MarkerClusterer.prototype.getImageExtension = function() {
            return this.imageExtension_;
          };
          MarkerClusterer.prototype.setImageExtension = function(imageExtension) {
            this.imageExtension_ = imageExtension;
          };
          MarkerClusterer.prototype.getImagePath = function() {
            return this.imagePath_;
          };
          MarkerClusterer.prototype.setImagePath = function(imagePath) {
            this.imagePath_ = imagePath;
          };
          MarkerClusterer.prototype.getImageSizes = function() {
            return this.imageSizes_;
          };
          MarkerClusterer.prototype.setImageSizes = function(imageSizes) {
            this.imageSizes_ = imageSizes;
          };
          MarkerClusterer.prototype.getCalculator = function() {
            return this.calculator_;
          };
          MarkerClusterer.prototype.setCalculator = function(calculator) {
            this.calculator_ = calculator;
          };
          MarkerClusterer.prototype.getBatchSizeIE = function() {
            return this.batchSizeIE_;
          };
          MarkerClusterer.prototype.setBatchSizeIE = function(batchSizeIE) {
            this.batchSizeIE_ = batchSizeIE;
          };
          MarkerClusterer.prototype.getClusterClass = function() {
            return this.clusterClass_;
          };
          MarkerClusterer.prototype.setClusterClass = function(clusterClass) {
            this.clusterClass_ = clusterClass;
          };
          MarkerClusterer.prototype.getMarkers = function() {
            return this.markers_;
          };
          MarkerClusterer.prototype.getTotalMarkers = function() {
            return this.markers_.length;
          };
          MarkerClusterer.prototype.getClusters = function() {
            return this.clusters_;
          };
          MarkerClusterer.prototype.getTotalClusters = function() {
            return this.clusters_.length;
          };
          MarkerClusterer.prototype.addMarker = function(marker, opt_nodraw) {
            this.pushMarkerTo_(marker);
            if (!opt_nodraw) {
              this.redraw_();
            }
          };
          MarkerClusterer.prototype.addMarkers = function(markers, opt_nodraw) {
            var key;
            for (key in markers) {
              if (markers.hasOwnProperty(key)) {
                this.pushMarkerTo_(markers[key]);
              }
            }
            if (!opt_nodraw) {
              this.redraw_();
            }
          };
          MarkerClusterer.prototype.pushMarkerTo_ = function(marker) {
            if (marker.getDraggable()) {
              var cMarkerClusterer = this;
              google.maps.event.addListener(marker, "dragend", function() {
                if (cMarkerClusterer.ready_) {
                  this.isAdded = false;
                  cMarkerClusterer.repaint();
                }
              });
            }
            marker.isAdded = false;
            this.markers_.push(marker);
          };
          MarkerClusterer.prototype.removeMarker = function(marker, opt_nodraw) {
            var removed = this.removeMarker_(marker);
            if (!opt_nodraw && removed) {
              this.repaint();
            }
            return removed;
          };
          MarkerClusterer.prototype.removeMarkers = function(markers, opt_nodraw) {
            var i,
                r;
            var removed = false;
            for (i = 0; i < markers.length; i++) {
              r = this.removeMarker_(markers[i]);
              removed = removed || r;
            }
            if (!opt_nodraw && removed) {
              this.repaint();
            }
            return removed;
          };
          MarkerClusterer.prototype.removeMarker_ = function(marker) {
            var i;
            var index = -1;
            if (this.markers_.indexOf) {
              index = this.markers_.indexOf(marker);
            } else {
              for (i = 0; i < this.markers_.length; i++) {
                if (marker === this.markers_[i]) {
                  index = i;
                  break;
                }
              }
            }
            if (index === -1) {
              return false;
            }
            marker.setMap(null);
            this.markers_.splice(index, 1);
            return true;
          };
          MarkerClusterer.prototype.clearMarkers = function() {
            this.resetViewport_(true);
            this.markers_ = [];
          };
          MarkerClusterer.prototype.repaint = function() {
            var oldClusters = this.clusters_.slice();
            this.clusters_ = [];
            this.resetViewport_(false);
            this.redraw_();
            setTimeout(function() {
              var i;
              for (i = 0; i < oldClusters.length; i++) {
                oldClusters[i].remove();
              }
            }, 0);
          };
          MarkerClusterer.prototype.getExtendedBounds = function(bounds) {
            var projection = this.getProjection();
            var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
            var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());
            var trPix = projection.fromLatLngToDivPixel(tr);
            trPix.x += this.gridSize_;
            trPix.y -= this.gridSize_;
            var blPix = projection.fromLatLngToDivPixel(bl);
            blPix.x -= this.gridSize_;
            blPix.y += this.gridSize_;
            var ne = projection.fromDivPixelToLatLng(trPix);
            var sw = projection.fromDivPixelToLatLng(blPix);
            bounds.extend(ne);
            bounds.extend(sw);
            return bounds;
          };
          MarkerClusterer.prototype.redraw_ = function() {
            this.createClusters_(0);
          };
          MarkerClusterer.prototype.resetViewport_ = function(opt_hide) {
            var i,
                marker;
            for (i = 0; i < this.clusters_.length; i++) {
              this.clusters_[i].remove();
            }
            this.clusters_ = [];
            for (i = 0; i < this.markers_.length; i++) {
              marker = this.markers_[i];
              marker.isAdded = false;
              if (opt_hide) {
                marker.setMap(null);
              }
            }
          };
          MarkerClusterer.prototype.distanceBetweenPoints_ = function(p1, p2) {
            var R = 6371;
            var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
            var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
          };
          MarkerClusterer.prototype.isMarkerInBounds_ = function(marker, bounds) {
            return bounds.contains(marker.getPosition());
          };
          MarkerClusterer.prototype.addToClosestCluster_ = function(marker) {
            var i,
                d,
                cluster,
                center;
            var distance = 40000;
            var clusterToAddTo = null;
            for (i = 0; i < this.clusters_.length; i++) {
              cluster = this.clusters_[i];
              center = cluster.getCenter();
              if (center) {
                d = this.distanceBetweenPoints_(center, marker.getPosition());
                if (d < distance) {
                  distance = d;
                  clusterToAddTo = cluster;
                }
              }
            }
            if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
              clusterToAddTo.addMarker(marker);
            } else {
              cluster = new Cluster(this);
              cluster.addMarker(marker);
              this.clusters_.push(cluster);
            }
          };
          MarkerClusterer.prototype.createClusters_ = function(iFirst) {
            var i,
                marker;
            var mapBounds;
            var cMarkerClusterer = this;
            if (!this.ready_) {
              return;
            }
            if (iFirst === 0) {
              google.maps.event.trigger(this, "clusteringbegin", this);
              if (typeof this.timerRefStatic !== "undefined") {
                clearTimeout(this.timerRefStatic);
                delete this.timerRefStatic;
              }
            }
            if (this.getMap().getZoom() > 3) {
              mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(), this.getMap().getBounds().getNorthEast());
            } else {
              mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472, -178.48388434375), new google.maps.LatLng(-85.08136444384544, 178.00048865625));
            }
            var bounds = this.getExtendedBounds(mapBounds);
            var iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);
            for (i = iFirst; i < iLast; i++) {
              marker = this.markers_[i];
              if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
                if (!this.ignoreHidden_ || (this.ignoreHidden_ && marker.getVisible())) {
                  this.addToClosestCluster_(marker);
                }
              }
            }
            if (iLast < this.markers_.length) {
              this.timerRefStatic = setTimeout(function() {
                cMarkerClusterer.createClusters_(iLast);
              }, 0);
            } else {
              delete this.timerRefStatic;
              google.maps.event.trigger(this, "clusteringend", this);
            }
          };
          MarkerClusterer.prototype.extend = function(obj1, obj2) {
            return (function(object) {
              var property;
              for (property in object.prototype) {
                this.prototype[property] = object.prototype[property];
              }
              return this;
            }).apply(obj1, [obj2]);
          };
          MarkerClusterer.CALCULATOR = function(markers, numStyles) {
            var index = 0;
            var title = "";
            var count = markers.length.toString();
            var dv = count;
            while (dv !== 0) {
              dv = parseInt(dv / 10, 10);
              index++;
            }
            index = Math.min(index, numStyles);
            return {
              text: count,
              index: index,
              title: title
            };
          };
          MarkerClusterer.BATCH_SIZE = 2000;
          MarkerClusterer.BATCH_SIZE_IE = 500;
          MarkerClusterer.IMAGE_PATH = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/images/m";
          MarkerClusterer.IMAGE_EXTENSION = "png";
          MarkerClusterer.IMAGE_SIZES = [53, 56, 66, 78, 90];
          function inherits(childCtor, parentCtor) {
            function tempCtor() {}
            tempCtor.prototype = parentCtor.prototype;
            childCtor.superClass_ = parentCtor.prototype;
            childCtor.prototype = new tempCtor();
            childCtor.prototype.constructor = childCtor;
          }
          function MarkerLabel_(marker, crossURL, handCursorURL) {
            this.marker_ = marker;
            this.handCursorURL_ = marker.handCursorURL;
            this.labelDiv_ = document.createElement("div");
            this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";
            this.eventDiv_ = document.createElement("div");
            this.eventDiv_.style.cssText = this.labelDiv_.style.cssText;
            this.eventDiv_.setAttribute("onselectstart", "return false;");
            this.eventDiv_.setAttribute("ondragstart", "return false;");
            this.crossDiv_ = MarkerLabel_.getSharedCross(crossURL);
          }
          inherits(MarkerLabel_, google.maps.OverlayView);
          MarkerLabel_.getSharedCross = function(crossURL) {
            var div;
            if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
              div = document.createElement("img");
              div.style.cssText = "position: absolute; z-index: 1000002; display: none;";
              div.style.marginLeft = "-8px";
              div.style.marginTop = "-9px";
              div.src = crossURL;
              MarkerLabel_.getSharedCross.crossDiv = div;
            }
            return MarkerLabel_.getSharedCross.crossDiv;
          };
          MarkerLabel_.prototype.onAdd = function() {
            var me = this;
            var cMouseIsDown = false;
            var cDraggingLabel = false;
            var cSavedZIndex;
            var cLatOffset,
                cLngOffset;
            var cIgnoreClick;
            var cRaiseEnabled;
            var cStartPosition;
            var cStartCenter;
            var cRaiseOffset = 20;
            var cDraggingCursor = "url(" + this.handCursorURL_ + ")";
            var cAbortEvent = function(e) {
              if (e.preventDefault) {
                e.preventDefault();
              }
              e.cancelBubble = true;
              if (e.stopPropagation) {
                e.stopPropagation();
              }
            };
            var cStopBounce = function() {
              me.marker_.setAnimation(null);
            };
            this.getPanes().overlayImage.appendChild(this.labelDiv_);
            this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);
            if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
              this.getPanes().overlayImage.appendChild(this.crossDiv_);
              MarkerLabel_.getSharedCross.processed = true;
            }
            this.listeners_ = [google.maps.event.addDomListener(this.eventDiv_, "mouseover", function(e) {
              if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                this.style.cursor = "pointer";
                google.maps.event.trigger(me.marker_, "mouseover", e);
              }
            }), google.maps.event.addDomListener(this.eventDiv_, "mouseout", function(e) {
              if ((me.marker_.getDraggable() || me.marker_.getClickable()) && !cDraggingLabel) {
                this.style.cursor = me.marker_.getCursor();
                google.maps.event.trigger(me.marker_, "mouseout", e);
              }
            }), google.maps.event.addDomListener(this.eventDiv_, "mousedown", function(e) {
              cDraggingLabel = false;
              if (me.marker_.getDraggable()) {
                cMouseIsDown = true;
                this.style.cursor = cDraggingCursor;
              }
              if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                google.maps.event.trigger(me.marker_, "mousedown", e);
                cAbortEvent(e);
              }
            }), google.maps.event.addDomListener(document, "mouseup", function(mEvent) {
              var position;
              if (cMouseIsDown) {
                cMouseIsDown = false;
                me.eventDiv_.style.cursor = "pointer";
                google.maps.event.trigger(me.marker_, "mouseup", mEvent);
              }
              if (cDraggingLabel) {
                if (cRaiseEnabled) {
                  position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());
                  position.y += cRaiseOffset;
                  me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
                  try {
                    me.marker_.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(cStopBounce, 1406);
                  } catch (e) {}
                }
                me.crossDiv_.style.display = "none";
                me.marker_.setZIndex(cSavedZIndex);
                cIgnoreClick = true;
                cDraggingLabel = false;
                mEvent.latLng = me.marker_.getPosition();
                google.maps.event.trigger(me.marker_, "dragend", mEvent);
              }
            }), google.maps.event.addListener(me.marker_.getMap(), "mousemove", function(mEvent) {
              var position;
              if (cMouseIsDown) {
                if (cDraggingLabel) {
                  mEvent.latLng = new google.maps.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
                  position = me.getProjection().fromLatLngToDivPixel(mEvent.latLng);
                  if (cRaiseEnabled) {
                    me.crossDiv_.style.left = position.x + "px";
                    me.crossDiv_.style.top = position.y + "px";
                    me.crossDiv_.style.display = "";
                    position.y -= cRaiseOffset;
                  }
                  me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
                  if (cRaiseEnabled) {
                    me.eventDiv_.style.top = (position.y + cRaiseOffset) + "px";
                  }
                  google.maps.event.trigger(me.marker_, "drag", mEvent);
                } else {
                  cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
                  cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
                  cSavedZIndex = me.marker_.getZIndex();
                  cStartPosition = me.marker_.getPosition();
                  cStartCenter = me.marker_.getMap().getCenter();
                  cRaiseEnabled = me.marker_.get("raiseOnDrag");
                  cDraggingLabel = true;
                  me.marker_.setZIndex(1000000);
                  mEvent.latLng = me.marker_.getPosition();
                  google.maps.event.trigger(me.marker_, "dragstart", mEvent);
                }
              }
            }), google.maps.event.addDomListener(document, "keydown", function(e) {
              if (cDraggingLabel) {
                if (e.keyCode === 27) {
                  cRaiseEnabled = false;
                  me.marker_.setPosition(cStartPosition);
                  me.marker_.getMap().setCenter(cStartCenter);
                  google.maps.event.trigger(document, "mouseup", e);
                }
              }
            }), google.maps.event.addDomListener(this.eventDiv_, "click", function(e) {
              if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                if (cIgnoreClick) {
                  cIgnoreClick = false;
                } else {
                  google.maps.event.trigger(me.marker_, "click", e);
                  cAbortEvent(e);
                }
              }
            }), google.maps.event.addDomListener(this.eventDiv_, "dblclick", function(e) {
              if (me.marker_.getDraggable() || me.marker_.getClickable()) {
                google.maps.event.trigger(me.marker_, "dblclick", e);
                cAbortEvent(e);
              }
            }), google.maps.event.addListener(this.marker_, "dragstart", function(mEvent) {
              if (!cDraggingLabel) {
                cRaiseEnabled = this.get("raiseOnDrag");
              }
            }), google.maps.event.addListener(this.marker_, "drag", function(mEvent) {
              if (!cDraggingLabel) {
                if (cRaiseEnabled) {
                  me.setPosition(cRaiseOffset);
                  me.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1);
                }
              }
            }), google.maps.event.addListener(this.marker_, "dragend", function(mEvent) {
              if (!cDraggingLabel) {
                if (cRaiseEnabled) {
                  me.setPosition(0);
                }
              }
            }), google.maps.event.addListener(this.marker_, "position_changed", function() {
              me.setPosition();
            }), google.maps.event.addListener(this.marker_, "zindex_changed", function() {
              me.setZIndex();
            }), google.maps.event.addListener(this.marker_, "visible_changed", function() {
              me.setVisible();
            }), google.maps.event.addListener(this.marker_, "labelvisible_changed", function() {
              me.setVisible();
            }), google.maps.event.addListener(this.marker_, "title_changed", function() {
              me.setTitle();
            }), google.maps.event.addListener(this.marker_, "labelcontent_changed", function() {
              me.setContent();
            }), google.maps.event.addListener(this.marker_, "labelanchor_changed", function() {
              me.setAnchor();
            }), google.maps.event.addListener(this.marker_, "labelclass_changed", function() {
              me.setStyles();
            }), google.maps.event.addListener(this.marker_, "labelstyle_changed", function() {
              me.setStyles();
            })];
          };
          MarkerLabel_.prototype.onRemove = function() {
            var i;
            this.labelDiv_.parentNode.removeChild(this.labelDiv_);
            this.eventDiv_.parentNode.removeChild(this.eventDiv_);
            for (i = 0; i < this.listeners_.length; i++) {
              google.maps.event.removeListener(this.listeners_[i]);
            }
          };
          MarkerLabel_.prototype.draw = function() {
            this.setContent();
            this.setTitle();
            this.setStyles();
          };
          MarkerLabel_.prototype.setContent = function() {
            var content = this.marker_.get("labelContent");
            if (typeof content.nodeType === "undefined") {
              this.labelDiv_.innerHTML = content;
              this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
            } else {
              this.labelDiv_.innerHTML = "";
              this.labelDiv_.appendChild(content);
              content = content.cloneNode(true);
              this.eventDiv_.innerHTML = "";
              this.eventDiv_.appendChild(content);
            }
          };
          MarkerLabel_.prototype.setTitle = function() {
            this.eventDiv_.title = this.marker_.getTitle() || "";
          };
          MarkerLabel_.prototype.setStyles = function() {
            var i,
                labelStyle;
            this.labelDiv_.className = this.marker_.get("labelClass");
            this.eventDiv_.className = this.labelDiv_.className;
            this.labelDiv_.style.cssText = "";
            this.eventDiv_.style.cssText = "";
            labelStyle = this.marker_.get("labelStyle");
            for (i in labelStyle) {
              if (labelStyle.hasOwnProperty(i)) {
                this.labelDiv_.style[i] = labelStyle[i];
                this.eventDiv_.style[i] = labelStyle[i];
              }
            }
            this.setMandatoryStyles();
          };
          MarkerLabel_.prototype.setMandatoryStyles = function() {
            this.labelDiv_.style.position = "absolute";
            this.labelDiv_.style.overflow = "hidden";
            if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
              this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
              this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
            }
            this.eventDiv_.style.position = this.labelDiv_.style.position;
            this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
            this.eventDiv_.style.opacity = 0.01;
            this.eventDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=1)\"";
            this.eventDiv_.style.filter = "alpha(opacity=1)";
            this.setAnchor();
            this.setPosition();
            this.setVisible();
          };
          MarkerLabel_.prototype.setAnchor = function() {
            var anchor = this.marker_.get("labelAnchor");
            this.labelDiv_.style.marginLeft = -anchor.x + "px";
            this.labelDiv_.style.marginTop = -anchor.y + "px";
            this.eventDiv_.style.marginLeft = -anchor.x + "px";
            this.eventDiv_.style.marginTop = -anchor.y + "px";
          };
          MarkerLabel_.prototype.setPosition = function(yOffset) {
            var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
            if (typeof yOffset === "undefined") {
              yOffset = 0;
            }
            this.labelDiv_.style.left = Math.round(position.x) + "px";
            this.labelDiv_.style.top = Math.round(position.y - yOffset) + "px";
            this.eventDiv_.style.left = this.labelDiv_.style.left;
            this.eventDiv_.style.top = this.labelDiv_.style.top;
            this.setZIndex();
          };
          MarkerLabel_.prototype.setZIndex = function() {
            var zAdjust = (this.marker_.get("labelInBackground") ? -1 : +1);
            if (typeof this.marker_.getZIndex() === "undefined") {
              this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
              this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
            } else {
              this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
              this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
            }
          };
          MarkerLabel_.prototype.setVisible = function() {
            if (this.marker_.get("labelVisible")) {
              this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
            } else {
              this.labelDiv_.style.display = "none";
            }
            this.eventDiv_.style.display = this.labelDiv_.style.display;
          };
          function MarkerWithLabel(opt_options) {
            opt_options = opt_options || {};
            opt_options.labelContent = opt_options.labelContent || "";
            opt_options.labelAnchor = opt_options.labelAnchor || new google.maps.Point(0, 0);
            opt_options.labelClass = opt_options.labelClass || "markerLabels";
            opt_options.labelStyle = opt_options.labelStyle || {};
            opt_options.labelInBackground = opt_options.labelInBackground || false;
            if (typeof opt_options.labelVisible === "undefined") {
              opt_options.labelVisible = true;
            }
            if (typeof opt_options.raiseOnDrag === "undefined") {
              opt_options.raiseOnDrag = true;
            }
            if (typeof opt_options.clickable === "undefined") {
              opt_options.clickable = true;
            }
            if (typeof opt_options.draggable === "undefined") {
              opt_options.draggable = false;
            }
            if (typeof opt_options.optimized === "undefined") {
              opt_options.optimized = false;
            }
            opt_options.crossImage = opt_options.crossImage || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
            opt_options.handCursor = opt_options.handCursor || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";
            opt_options.optimized = false;
            this.label = new MarkerLabel_(this, opt_options.crossImage, opt_options.handCursor);
            google.maps.Marker.apply(this, arguments);
          }
          inherits(MarkerWithLabel, google.maps.Marker);
          MarkerWithLabel.prototype.setMap = function(theMap) {
            google.maps.Marker.prototype.setMap.apply(this, arguments);
            this.label.setMap(theMap);
          };
          function RichMarker(opt_options) {
            var options = opt_options || {};
            this.ready_ = false;
            this.dragging_ = false;
            if (opt_options['visible'] == undefined) {
              opt_options['visible'] = true;
            }
            if (opt_options['shadow'] == undefined) {
              opt_options['shadow'] = '7px -3px 5px rgba(88,88,88,0.7)';
            }
            if (opt_options['anchor'] == undefined) {
              opt_options['anchor'] = RichMarkerPosition['BOTTOM'];
            }
            this.setValues(options);
          }
          RichMarker.prototype = new google.maps.OverlayView();
          window['RichMarker'] = RichMarker;
          RichMarker.prototype.getVisible = function() {
            return (this.get('visible'));
          };
          RichMarker.prototype['getVisible'] = RichMarker.prototype.getVisible;
          RichMarker.prototype.setVisible = function(visible) {
            this.set('visible', visible);
          };
          RichMarker.prototype['setVisible'] = RichMarker.prototype.setVisible;
          RichMarker.prototype.visible_changed = function() {
            if (this.ready_) {
              this.markerWrapper_.style['display'] = this.getVisible() ? '' : 'none';
              this.draw();
            }
          };
          RichMarker.prototype['visible_changed'] = RichMarker.prototype.visible_changed;
          RichMarker.prototype.setFlat = function(flat) {
            this.set('flat', !!flat);
          };
          RichMarker.prototype['setFlat'] = RichMarker.prototype.setFlat;
          RichMarker.prototype.getFlat = function() {
            return (this.get('flat'));
          };
          RichMarker.prototype['getFlat'] = RichMarker.prototype.getFlat;
          RichMarker.prototype.getWidth = function() {
            return (this.get('width'));
          };
          RichMarker.prototype['getWidth'] = RichMarker.prototype.getWidth;
          RichMarker.prototype.getHeight = function() {
            return (this.get('height'));
          };
          RichMarker.prototype['getHeight'] = RichMarker.prototype.getHeight;
          RichMarker.prototype.setShadow = function(shadow) {
            this.set('shadow', shadow);
            this.flat_changed();
          };
          RichMarker.prototype['setShadow'] = RichMarker.prototype.setShadow;
          RichMarker.prototype.getShadow = function() {
            return (this.get('shadow'));
          };
          RichMarker.prototype['getShadow'] = RichMarker.prototype.getShadow;
          RichMarker.prototype.flat_changed = function() {
            if (!this.ready_) {
              return;
            }
            this.markerWrapper_.style['boxShadow'] = this.markerWrapper_.style['webkitBoxShadow'] = this.markerWrapper_.style['MozBoxShadow'] = this.getFlat() ? '' : this.getShadow();
          };
          RichMarker.prototype['flat_changed'] = RichMarker.prototype.flat_changed;
          RichMarker.prototype.setZIndex = function(index) {
            this.set('zIndex', index);
          };
          RichMarker.prototype['setZIndex'] = RichMarker.prototype.setZIndex;
          RichMarker.prototype.getZIndex = function() {
            return (this.get('zIndex'));
          };
          RichMarker.prototype['getZIndex'] = RichMarker.prototype.getZIndex;
          RichMarker.prototype.zIndex_changed = function() {
            if (this.getZIndex() && this.ready_) {
              this.markerWrapper_.style.zIndex = this.getZIndex();
            }
          };
          RichMarker.prototype['zIndex_changed'] = RichMarker.prototype.zIndex_changed;
          RichMarker.prototype.getDraggable = function() {
            return (this.get('draggable'));
          };
          RichMarker.prototype['getDraggable'] = RichMarker.prototype.getDraggable;
          RichMarker.prototype.setDraggable = function(draggable) {
            this.set('draggable', !!draggable);
          };
          RichMarker.prototype['setDraggable'] = RichMarker.prototype.setDraggable;
          RichMarker.prototype.draggable_changed = function() {
            if (this.ready_) {
              if (this.getDraggable()) {
                this.addDragging_(this.markerWrapper_);
              } else {
                this.removeDragListeners_();
              }
            }
          };
          RichMarker.prototype['draggable_changed'] = RichMarker.prototype.draggable_changed;
          RichMarker.prototype.getPosition = function() {
            return (this.get('position'));
          };
          RichMarker.prototype['getPosition'] = RichMarker.prototype.getPosition;
          RichMarker.prototype.setPosition = function(position) {
            this.set('position', position);
          };
          RichMarker.prototype['setPosition'] = RichMarker.prototype.setPosition;
          RichMarker.prototype.position_changed = function() {
            this.draw();
          };
          RichMarker.prototype['position_changed'] = RichMarker.prototype.position_changed;
          RichMarker.prototype.getAnchor = function() {
            return (this.get('anchor'));
          };
          RichMarker.prototype['getAnchor'] = RichMarker.prototype.getAnchor;
          RichMarker.prototype.setAnchor = function(anchor) {
            this.set('anchor', anchor);
          };
          RichMarker.prototype['setAnchor'] = RichMarker.prototype.setAnchor;
          RichMarker.prototype.anchor_changed = function() {
            this.draw();
          };
          RichMarker.prototype['anchor_changed'] = RichMarker.prototype.anchor_changed;
          RichMarker.prototype.htmlToDocumentFragment_ = function(htmlString) {
            var tempDiv = document.createElement('DIV');
            tempDiv.innerHTML = htmlString;
            if (tempDiv.childNodes.length == 1) {
              return (tempDiv.removeChild(tempDiv.firstChild));
            } else {
              var fragment = document.createDocumentFragment();
              while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
              }
              return fragment;
            }
          };
          RichMarker.prototype.removeChildren_ = function(node) {
            if (!node) {
              return;
            }
            var child;
            while (child = node.firstChild) {
              node.removeChild(child);
            }
          };
          RichMarker.prototype.setContent = function(content) {
            this.set('content', content);
          };
          RichMarker.prototype['setContent'] = RichMarker.prototype.setContent;
          RichMarker.prototype.getContent = function() {
            return (this.get('content'));
          };
          RichMarker.prototype['getContent'] = RichMarker.prototype.getContent;
          RichMarker.prototype.content_changed = function() {
            if (!this.markerContent_) {
              return;
            }
            this.removeChildren_(this.markerContent_);
            var content = this.getContent();
            if (content) {
              if (typeof content == 'string') {
                content = content.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
                content = this.htmlToDocumentFragment_(content);
              }
              this.markerContent_.appendChild(content);
              var that = this;
              var images = this.markerContent_.getElementsByTagName('IMG');
              for (var i = 0,
                  image; image = images[i]; i++) {
                google.maps.event.addDomListener(image, 'mousedown', function(e) {
                  if (that.getDraggable()) {
                    if (e.preventDefault) {
                      e.preventDefault();
                    }
                    e.returnValue = false;
                  }
                });
                google.maps.event.addDomListener(image, 'load', function() {
                  that.draw();
                });
              }
              google.maps.event.trigger(this, 'domready');
            }
            if (this.ready_) {
              this.draw();
            }
          };
          RichMarker.prototype['content_changed'] = RichMarker.prototype.content_changed;
          RichMarker.prototype.setCursor_ = function(whichCursor) {
            if (!this.ready_) {
              return;
            }
            var cursor = '';
            if (navigator.userAgent.indexOf('Gecko/') !== -1) {
              if (whichCursor == 'dragging') {
                cursor = '-moz-grabbing';
              }
              if (whichCursor == 'dragready') {
                cursor = '-moz-grab';
              }
              if (whichCursor == 'draggable') {
                cursor = 'pointer';
              }
            } else {
              if (whichCursor == 'dragging' || whichCursor == 'dragready') {
                cursor = 'move';
              }
              if (whichCursor == 'draggable') {
                cursor = 'pointer';
              }
            }
            if (this.markerWrapper_.style.cursor != cursor) {
              this.markerWrapper_.style.cursor = cursor;
            }
          };
          RichMarker.prototype.startDrag = function(e) {
            if (!this.getDraggable()) {
              return;
            }
            if (!this.dragging_) {
              this.dragging_ = true;
              var map = this.getMap();
              this.mapDraggable_ = map.get('draggable');
              map.set('draggable', false);
              this.mouseX_ = e.clientX;
              this.mouseY_ = e.clientY;
              this.setCursor_('dragready');
              this.markerWrapper_.style['MozUserSelect'] = 'none';
              this.markerWrapper_.style['KhtmlUserSelect'] = 'none';
              this.markerWrapper_.style['WebkitUserSelect'] = 'none';
              this.markerWrapper_['unselectable'] = 'on';
              this.markerWrapper_['onselectstart'] = function() {
                return false;
              };
              this.addDraggingListeners_();
              google.maps.event.trigger(this, 'dragstart');
            }
          };
          RichMarker.prototype.stopDrag = function() {
            if (!this.getDraggable()) {
              return;
            }
            if (this.dragging_) {
              this.dragging_ = false;
              this.getMap().set('draggable', this.mapDraggable_);
              this.mouseX_ = this.mouseY_ = this.mapDraggable_ = null;
              this.markerWrapper_.style['MozUserSelect'] = '';
              this.markerWrapper_.style['KhtmlUserSelect'] = '';
              this.markerWrapper_.style['WebkitUserSelect'] = '';
              this.markerWrapper_['unselectable'] = 'off';
              this.markerWrapper_['onselectstart'] = function() {};
              this.removeDraggingListeners_();
              this.setCursor_('draggable');
              google.maps.event.trigger(this, 'dragend');
              this.draw();
            }
          };
          RichMarker.prototype.drag = function(e) {
            if (!this.getDraggable() || !this.dragging_) {
              this.stopDrag();
              return;
            }
            var dx = this.mouseX_ - e.clientX;
            var dy = this.mouseY_ - e.clientY;
            this.mouseX_ = e.clientX;
            this.mouseY_ = e.clientY;
            var left = parseInt(this.markerWrapper_.style['left'], 10) - dx;
            var top = parseInt(this.markerWrapper_.style['top'], 10) - dy;
            this.markerWrapper_.style['left'] = left + 'px';
            this.markerWrapper_.style['top'] = top + 'px';
            var offset = this.getOffset_();
            var point = new google.maps.Point(left - offset.width, top - offset.height);
            var projection = this.getProjection();
            this.setPosition(projection.fromDivPixelToLatLng(point));
            this.setCursor_('dragging');
            google.maps.event.trigger(this, 'drag');
          };
          RichMarker.prototype.removeDragListeners_ = function() {
            if (this.draggableListener_) {
              google.maps.event.removeListener(this.draggableListener_);
              delete this.draggableListener_;
            }
            this.setCursor_('');
          };
          RichMarker.prototype.addDragging_ = function(node) {
            if (!node) {
              return;
            }
            var that = this;
            this.draggableListener_ = google.maps.event.addDomListener(node, 'mousedown', function(e) {
              that.startDrag(e);
            });
            this.setCursor_('draggable');
          };
          RichMarker.prototype.addDraggingListeners_ = function() {
            var that = this;
            if (this.markerWrapper_.setCapture) {
              this.markerWrapper_.setCapture(true);
              this.draggingListeners_ = [google.maps.event.addDomListener(this.markerWrapper_, 'mousemove', function(e) {
                that.drag(e);
              }, true), google.maps.event.addDomListener(this.markerWrapper_, 'mouseup', function() {
                that.stopDrag();
                that.markerWrapper_.releaseCapture();
              }, true)];
            } else {
              this.draggingListeners_ = [google.maps.event.addDomListener(window, 'mousemove', function(e) {
                that.drag(e);
              }, true), google.maps.event.addDomListener(window, 'mouseup', function() {
                that.stopDrag();
              }, true)];
            }
          };
          RichMarker.prototype.removeDraggingListeners_ = function() {
            if (this.draggingListeners_) {
              for (var i = 0,
                  listener; listener = this.draggingListeners_[i]; i++) {
                google.maps.event.removeListener(listener);
              }
              this.draggingListeners_.length = 0;
            }
          };
          RichMarker.prototype.getOffset_ = function() {
            var anchor = this.getAnchor();
            if (typeof anchor == 'object') {
              return (anchor);
            }
            var offset = new google.maps.Size(0, 0);
            if (!this.markerContent_) {
              return offset;
            }
            var width = this.markerContent_.offsetWidth;
            var height = this.markerContent_.offsetHeight;
            switch (anchor) {
              case RichMarkerPosition['TOP_LEFT']:
                break;
              case RichMarkerPosition['TOP']:
                offset.width = -width / 2;
                break;
              case RichMarkerPosition['TOP_RIGHT']:
                offset.width = -width;
                break;
              case RichMarkerPosition['LEFT']:
                offset.height = -height / 2;
                break;
              case RichMarkerPosition['MIDDLE']:
                offset.width = -width / 2;
                offset.height = -height / 2;
                break;
              case RichMarkerPosition['RIGHT']:
                offset.width = -width;
                offset.height = -height / 2;
                break;
              case RichMarkerPosition['BOTTOM_LEFT']:
                offset.height = -height;
                break;
              case RichMarkerPosition['BOTTOM']:
                offset.width = -width / 2;
                offset.height = -height;
                break;
              case RichMarkerPosition['BOTTOM_RIGHT']:
                offset.width = -width;
                offset.height = -height;
                break;
            }
            return offset;
          };
          RichMarker.prototype.onAdd = function() {
            if (!this.markerWrapper_) {
              this.markerWrapper_ = document.createElement('DIV');
              this.markerWrapper_.style['position'] = 'absolute';
            }
            if (this.getZIndex()) {
              this.markerWrapper_.style['zIndex'] = this.getZIndex();
            }
            this.markerWrapper_.style['display'] = this.getVisible() ? '' : 'none';
            if (!this.markerContent_) {
              this.markerContent_ = document.createElement('DIV');
              this.markerWrapper_.appendChild(this.markerContent_);
              var that = this;
              google.maps.event.addDomListener(this.markerContent_, 'click', function(e) {
                google.maps.event.trigger(that, 'click');
              });
              google.maps.event.addDomListener(this.markerContent_, 'mouseover', function(e) {
                google.maps.event.trigger(that, 'mouseover');
              });
              google.maps.event.addDomListener(this.markerContent_, 'mouseout', function(e) {
                google.maps.event.trigger(that, 'mouseout');
              });
            }
            this.ready_ = true;
            this.content_changed();
            this.flat_changed();
            this.draggable_changed();
            var panes = this.getPanes();
            if (panes) {
              panes.overlayMouseTarget.appendChild(this.markerWrapper_);
            }
            google.maps.event.trigger(this, 'ready');
          };
          RichMarker.prototype['onAdd'] = RichMarker.prototype.onAdd;
          RichMarker.prototype.draw = function() {
            if (!this.ready_ || this.dragging_) {
              return;
            }
            var projection = this.getProjection();
            if (!projection) {
              return;
            }
            var latLng = (this.get('position'));
            var pos = projection.fromLatLngToDivPixel(latLng);
            var offset = this.getOffset_();
            this.markerWrapper_.style['top'] = (pos.y + offset.height) + 'px';
            this.markerWrapper_.style['left'] = (pos.x + offset.width) + 'px';
            var height = this.markerContent_.offsetHeight;
            var width = this.markerContent_.offsetWidth;
            if (width != this.get('width')) {
              this.set('width', width);
            }
            if (height != this.get('height')) {
              this.set('height', height);
            }
          };
          RichMarker.prototype['draw'] = RichMarker.prototype.draw;
          RichMarker.prototype.onRemove = function() {
            if (this.markerWrapper_ && this.markerWrapper_.parentNode) {
              this.markerWrapper_.parentNode.removeChild(this.markerWrapper_);
            }
            this.removeDragListeners_();
          };
          RichMarker.prototype['onRemove'] = RichMarker.prototype.onRemove;
          var RichMarkerPosition = {
            'TOP_LEFT': 1,
            'TOP': 2,
            'TOP_RIGHT': 3,
            'LEFT': 4,
            'MIDDLE': 5,
            'RIGHT': 6,
            'BOTTOM_LEFT': 7,
            'BOTTOM': 8,
            'BOTTOM_RIGHT': 9
          };
          window['RichMarkerPosition'] = RichMarkerPosition;
          window.InfoBox = InfoBox;
          window.Cluster = Cluster;
          window.ClusterIcon = ClusterIcon;
          window.MarkerClusterer = MarkerClusterer;
          window.MarkerLabel_ = MarkerLabel_;
          window.MarkerWithLabel = MarkerWithLabel;
          window.RichMarker = RichMarker;
        })};
    });
    ;
    (function(modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId])
          return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
          exports: {},
          id: moduleId,
          loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.p = "";
      return __webpack_require__(0);
    })([function(module, exports, __webpack_require__) {
      angular.module('uiGmapgoogle-maps.wrapped').service('uiGmapDataStructures', function() {
        return {
          Graph: __webpack_require__(1).Graph,
          Queue: __webpack_require__(1).Queue
        };
      });
    }, function(module, exports, __webpack_require__) {
      (function() {
        module.exports = {
          Graph: __webpack_require__(2),
          Heap: __webpack_require__(3),
          LinkedList: __webpack_require__(4),
          Map: __webpack_require__(5),
          Queue: __webpack_require__(6),
          RedBlackTree: __webpack_require__(7),
          Trie: __webpack_require__(8)
        };
      }).call(this);
    }, function(module, exports) {
      (function() {
        var Graph,
            __hasProp = {}.hasOwnProperty;
        Graph = (function() {
          function Graph() {
            this._nodes = {};
            this.nodeSize = 0;
            this.edgeSize = 0;
          }
          Graph.prototype.addNode = function(id) {
            if (!this._nodes[id]) {
              this.nodeSize++;
              return this._nodes[id] = {
                _outEdges: {},
                _inEdges: {}
              };
            }
          };
          Graph.prototype.getNode = function(id) {
            return this._nodes[id];
          };
          Graph.prototype.removeNode = function(id) {
            var inEdgeId,
                nodeToRemove,
                outEdgeId,
                _ref,
                _ref1;
            nodeToRemove = this._nodes[id];
            if (!nodeToRemove) {
              return;
            } else {
              _ref = nodeToRemove._outEdges;
              for (outEdgeId in _ref) {
                if (!__hasProp.call(_ref, outEdgeId))
                  continue;
                this.removeEdge(id, outEdgeId);
              }
              _ref1 = nodeToRemove._inEdges;
              for (inEdgeId in _ref1) {
                if (!__hasProp.call(_ref1, inEdgeId))
                  continue;
                this.removeEdge(inEdgeId, id);
              }
              this.nodeSize--;
              delete this._nodes[id];
            }
            return nodeToRemove;
          };
          Graph.prototype.addEdge = function(fromId, toId, weight) {
            var edgeToAdd,
                fromNode,
                toNode;
            if (weight == null) {
              weight = 1;
            }
            if (this.getEdge(fromId, toId)) {
              return;
            }
            fromNode = this._nodes[fromId];
            toNode = this._nodes[toId];
            if (!fromNode || !toNode) {
              return;
            }
            edgeToAdd = {weight: weight};
            fromNode._outEdges[toId] = edgeToAdd;
            toNode._inEdges[fromId] = edgeToAdd;
            this.edgeSize++;
            return edgeToAdd;
          };
          Graph.prototype.getEdge = function(fromId, toId) {
            var fromNode,
                toNode;
            fromNode = this._nodes[fromId];
            toNode = this._nodes[toId];
            if (!fromNode || !toNode) {} else {
              return fromNode._outEdges[toId];
            }
          };
          Graph.prototype.removeEdge = function(fromId, toId) {
            var edgeToDelete,
                fromNode,
                toNode;
            fromNode = this._nodes[fromId];
            toNode = this._nodes[toId];
            edgeToDelete = this.getEdge(fromId, toId);
            if (!edgeToDelete) {
              return;
            }
            delete fromNode._outEdges[toId];
            delete toNode._inEdges[fromId];
            this.edgeSize--;
            return edgeToDelete;
          };
          Graph.prototype.getInEdgesOf = function(nodeId) {
            var fromId,
                inEdges,
                toNode,
                _ref;
            toNode = this._nodes[nodeId];
            inEdges = [];
            _ref = toNode != null ? toNode._inEdges : void 0;
            for (fromId in _ref) {
              if (!__hasProp.call(_ref, fromId))
                continue;
              inEdges.push(this.getEdge(fromId, nodeId));
            }
            return inEdges;
          };
          Graph.prototype.getOutEdgesOf = function(nodeId) {
            var fromNode,
                outEdges,
                toId,
                _ref;
            fromNode = this._nodes[nodeId];
            outEdges = [];
            _ref = fromNode != null ? fromNode._outEdges : void 0;
            for (toId in _ref) {
              if (!__hasProp.call(_ref, toId))
                continue;
              outEdges.push(this.getEdge(nodeId, toId));
            }
            return outEdges;
          };
          Graph.prototype.getAllEdgesOf = function(nodeId) {
            var i,
                inEdges,
                outEdges,
                selfEdge,
                _i,
                _ref,
                _ref1;
            inEdges = this.getInEdgesOf(nodeId);
            outEdges = this.getOutEdgesOf(nodeId);
            if (inEdges.length === 0) {
              return outEdges;
            }
            selfEdge = this.getEdge(nodeId, nodeId);
            for (i = _i = 0, _ref = inEdges.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
              if (inEdges[i] === selfEdge) {
                _ref1 = [inEdges[inEdges.length - 1], inEdges[i]], inEdges[i] = _ref1[0], inEdges[inEdges.length - 1] = _ref1[1];
                inEdges.pop();
                break;
              }
            }
            return inEdges.concat(outEdges);
          };
          Graph.prototype.forEachNode = function(operation) {
            var nodeId,
                nodeObject,
                _ref;
            _ref = this._nodes;
            for (nodeId in _ref) {
              if (!__hasProp.call(_ref, nodeId))
                continue;
              nodeObject = _ref[nodeId];
              operation(nodeObject, nodeId);
            }
          };
          Graph.prototype.forEachEdge = function(operation) {
            var edgeObject,
                nodeId,
                nodeObject,
                toId,
                _ref,
                _ref1;
            _ref = this._nodes;
            for (nodeId in _ref) {
              if (!__hasProp.call(_ref, nodeId))
                continue;
              nodeObject = _ref[nodeId];
              _ref1 = nodeObject._outEdges;
              for (toId in _ref1) {
                if (!__hasProp.call(_ref1, toId))
                  continue;
                edgeObject = _ref1[toId];
                operation(edgeObject);
              }
            }
          };
          return Graph;
        })();
        module.exports = Graph;
      }).call(this);
    }, function(module, exports) {
      (function() {
        var Heap,
            _leftChild,
            _parent,
            _rightChild;
        Heap = (function() {
          function Heap(dataToHeapify) {
            var i,
                item,
                _i,
                _j,
                _len,
                _ref;
            if (dataToHeapify == null) {
              dataToHeapify = [];
            }
            this._data = [void 0];
            for (_i = 0, _len = dataToHeapify.length; _i < _len; _i++) {
              item = dataToHeapify[_i];
              if (item != null) {
                this._data.push(item);
              }
            }
            if (this._data.length > 1) {
              for (i = _j = 2, _ref = this._data.length; 2 <= _ref ? _j < _ref : _j > _ref; i = 2 <= _ref ? ++_j : --_j) {
                this._upHeap(i);
              }
            }
            this.size = this._data.length - 1;
          }
          Heap.prototype.add = function(value) {
            if (value == null) {
              return;
            }
            this._data.push(value);
            this._upHeap(this._data.length - 1);
            this.size++;
            return value;
          };
          Heap.prototype.removeMin = function() {
            var min;
            if (this._data.length === 1) {
              return;
            }
            this.size--;
            if (this._data.length === 2) {
              return this._data.pop();
            }
            min = this._data[1];
            this._data[1] = this._data.pop();
            this._downHeap();
            return min;
          };
          Heap.prototype.peekMin = function() {
            return this._data[1];
          };
          Heap.prototype._upHeap = function(index) {
            var valueHolder,
                _ref;
            valueHolder = this._data[index];
            while (this._data[index] < this._data[_parent(index)] && index > 1) {
              _ref = [this._data[_parent(index)], this._data[index]], this._data[index] = _ref[0], this._data[_parent(index)] = _ref[1];
              index = _parent(index);
            }
          };
          Heap.prototype._downHeap = function() {
            var currentIndex,
                smallerChildIndex,
                _ref;
            currentIndex = 1;
            while (_leftChild(currentIndex < this._data.length)) {
              smallerChildIndex = _leftChild(currentIndex);
              if (smallerChildIndex < this._data.length - 1) {
                if (this._data[_rightChild(currentIndex)] < this._data[smallerChildIndex]) {
                  smallerChildIndex = _rightChild(currentIndex);
                }
              }
              if (this._data[smallerChildIndex] < this._data[currentIndex]) {
                _ref = [this._data[currentIndex], this._data[smallerChildIndex]], this._data[smallerChildIndex] = _ref[0], this._data[currentIndex] = _ref[1];
                currentIndex = smallerChildIndex;
              } else {
                break;
              }
            }
          };
          return Heap;
        })();
        _parent = function(index) {
          return index >> 1;
        };
        _leftChild = function(index) {
          return index << 1;
        };
        _rightChild = function(index) {
          return (index << 1) + 1;
        };
        module.exports = Heap;
      }).call(this);
    }, function(module, exports) {
      (function() {
        var LinkedList;
        LinkedList = (function() {
          function LinkedList(valuesToAdd) {
            var value,
                _i,
                _len;
            if (valuesToAdd == null) {
              valuesToAdd = [];
            }
            this.head = {
              prev: void 0,
              value: void 0,
              next: void 0
            };
            this.tail = {
              prev: void 0,
              value: void 0,
              next: void 0
            };
            this.size = 0;
            for (_i = 0, _len = valuesToAdd.length; _i < _len; _i++) {
              value = valuesToAdd[_i];
              this.add(value);
            }
          }
          LinkedList.prototype.at = function(position) {
            var currentNode,
                i,
                _i,
                _j,
                _ref;
            if (!((-this.size <= position && position < this.size))) {
              return;
            }
            position = this._adjust(position);
            if (position * 2 < this.size) {
              currentNode = this.head;
              for (i = _i = 1; _i <= position; i = _i += 1) {
                currentNode = currentNode.next;
              }
            } else {
              currentNode = this.tail;
              for (i = _j = 1, _ref = this.size - position - 1; _j <= _ref; i = _j += 1) {
                currentNode = currentNode.prev;
              }
            }
            return currentNode;
          };
          LinkedList.prototype.add = function(value, position) {
            var currentNode,
                nodeToAdd,
                _ref,
                _ref1,
                _ref2;
            if (position == null) {
              position = this.size;
            }
            if (!((-this.size <= position && position <= this.size))) {
              return;
            }
            nodeToAdd = {value: value};
            position = this._adjust(position);
            if (this.size === 0) {
              this.head = nodeToAdd;
            } else {
              if (position === 0) {
                _ref = [nodeToAdd, this.head, nodeToAdd], this.head.prev = _ref[0], nodeToAdd.next = _ref[1], this.head = _ref[2];
              } else {
                currentNode = this.at(position - 1);
                _ref1 = [currentNode.next, nodeToAdd, nodeToAdd, currentNode], nodeToAdd.next = _ref1[0], (_ref2 = currentNode.next) != null ? _ref2.prev = _ref1[1] : void 0, currentNode.next = _ref1[2], nodeToAdd.prev = _ref1[3];
              }
            }
            if (position === this.size) {
              this.tail = nodeToAdd;
            }
            this.size++;
            return value;
          };
          LinkedList.prototype.removeAt = function(position) {
            var currentNode,
                valueToReturn,
                _ref;
            if (position == null) {
              position = this.size - 1;
            }
            if (!((-this.size <= position && position < this.size))) {
              return;
            }
            if (this.size === 0) {
              return;
            }
            position = this._adjust(position);
            if (this.size === 1) {
              valueToReturn = this.head.value;
              this.head.value = this.tail.value = void 0;
            } else {
              if (position === 0) {
                valueToReturn = this.head.value;
                this.head = this.head.next;
                this.head.prev = void 0;
              } else {
                currentNode = this.at(position);
                valueToReturn = currentNode.value;
                currentNode.prev.next = currentNode.next;
                if ((_ref = currentNode.next) != null) {
                  _ref.prev = currentNode.prev;
                }
                if (position === this.size - 1) {
                  this.tail = currentNode.prev;
                }
              }
            }
            this.size--;
            return valueToReturn;
          };
          LinkedList.prototype.remove = function(value) {
            var currentNode;
            if (value == null) {
              return;
            }
            currentNode = this.head;
            while (currentNode && currentNode.value !== value) {
              currentNode = currentNode.next;
            }
            if (!currentNode) {
              return;
            }
            if (this.size === 1) {
              this.head.value = this.tail.value = void 0;
            } else if (currentNode === this.head) {
              this.head = this.head.next;
              this.head.prev = void 0;
            } else if (currentNode === this.tail) {
              this.tail = this.tail.prev;
              this.tail.next = void 0;
            } else {
              currentNode.prev.next = currentNode.next;
              currentNode.next.prev = currentNode.prev;
            }
            this.size--;
            return value;
          };
          LinkedList.prototype.indexOf = function(value, startingPosition) {
            var currentNode,
                position;
            if (startingPosition == null) {
              startingPosition = 0;
            }
            if (((this.head.value == null) && !this.head.next) || startingPosition >= this.size) {
              return -1;
            }
            startingPosition = Math.max(0, this._adjust(startingPosition));
            currentNode = this.at(startingPosition);
            position = startingPosition;
            while (currentNode) {
              if (currentNode.value === value) {
                break;
              }
              currentNode = currentNode.next;
              position++;
            }
            if (position === this.size) {
              return -1;
            } else {
              return position;
            }
          };
          LinkedList.prototype._adjust = function(position) {
            if (position < 0) {
              return this.size + position;
            } else {
              return position;
            }
          };
          return LinkedList;
        })();
        module.exports = LinkedList;
      }).call(this);
    }, function(module, exports) {
      (function() {
        var Map,
            SPECIAL_TYPE_KEY_PREFIX,
            _extractDataType,
            _isSpecialType,
            __hasProp = {}.hasOwnProperty;
        SPECIAL_TYPE_KEY_PREFIX = '_mapId_';
        Map = (function() {
          Map._mapIdTracker = 0;
          Map._newMapId = function() {
            return this._mapIdTracker++;
          };
          function Map(objectToMap) {
            var key,
                value;
            this._content = {};
            this._itemId = 0;
            this._id = Map._newMapId();
            this.size = 0;
            for (key in objectToMap) {
              if (!__hasProp.call(objectToMap, key))
                continue;
              value = objectToMap[key];
              this.set(key, value);
            }
          }
          Map.prototype.hash = function(key, makeHash) {
            var propertyForMap,
                type;
            if (makeHash == null) {
              makeHash = false;
            }
            type = _extractDataType(key);
            if (_isSpecialType(key)) {
              propertyForMap = SPECIAL_TYPE_KEY_PREFIX + this._id;
              if (makeHash && !key[propertyForMap]) {
                key[propertyForMap] = this._itemId++;
              }
              return propertyForMap + '_' + key[propertyForMap];
            } else {
              return type + '_' + key;
            }
          };
          Map.prototype.set = function(key, value) {
            if (!this.has(key)) {
              this.size++;
            }
            this._content[this.hash(key, true)] = [value, key];
            return value;
          };
          Map.prototype.get = function(key) {
            var _ref;
            return (_ref = this._content[this.hash(key)]) != null ? _ref[0] : void 0;
          };
          Map.prototype.has = function(key) {
            return this.hash(key) in this._content;
          };
          Map.prototype["delete"] = function(key) {
            var hashedKey;
            hashedKey = this.hash(key);
            if (hashedKey in this._content) {
              delete this._content[hashedKey];
              if (_isSpecialType(key)) {
                delete key[SPECIAL_TYPE_KEY_PREFIX + this._id];
              }
              this.size--;
              return true;
            }
            return false;
          };
          Map.prototype.forEach = function(operation) {
            var key,
                value,
                _ref;
            _ref = this._content;
            for (key in _ref) {
              if (!__hasProp.call(_ref, key))
                continue;
              value = _ref[key];
              operation(value[1], value[0]);
            }
          };
          return Map;
        })();
        _isSpecialType = function(key) {
          var simpleHashableTypes,
              simpleType,
              type,
              _i,
              _len;
          simpleHashableTypes = ['Boolean', 'Number', 'String', 'Undefined', 'Null', 'RegExp', 'Function'];
          type = _extractDataType(key);
          for (_i = 0, _len = simpleHashableTypes.length; _i < _len; _i++) {
            simpleType = simpleHashableTypes[_i];
            if (type === simpleType) {
              return false;
            }
          }
          return true;
        };
        _extractDataType = function(type) {
          return Object.prototype.toString.apply(type).match(/\[object (.+)\]/)[1];
        };
        module.exports = Map;
      }).call(this);
    }, function(module, exports) {
      (function() {
        var Queue;
        Queue = (function() {
          function Queue(initialArray) {
            if (initialArray == null) {
              initialArray = [];
            }
            this._content = initialArray;
            this._dequeueIndex = 0;
            this.size = this._content.length;
          }
          Queue.prototype.enqueue = function(item) {
            this.size++;
            this._content.push(item);
            return item;
          };
          Queue.prototype.dequeue = function() {
            var itemToDequeue;
            if (this.size === 0) {
              return;
            }
            this.size--;
            itemToDequeue = this._content[this._dequeueIndex];
            this._dequeueIndex++;
            if (this._dequeueIndex * 2 > this._content.length) {
              this._content = this._content.slice(this._dequeueIndex);
              this._dequeueIndex = 0;
            }
            return itemToDequeue;
          };
          Queue.prototype.peek = function() {
            return this._content[this._dequeueIndex];
          };
          return Queue;
        })();
        module.exports = Queue;
      }).call(this);
    }, function(module, exports) {
      (function() {
        var BLACK,
            NODE_FOUND,
            NODE_TOO_BIG,
            NODE_TOO_SMALL,
            RED,
            RedBlackTree,
            STOP_SEARCHING,
            _findNode,
            _grandParentOf,
            _isLeft,
            _leftOrRight,
            _peekMaxNode,
            _peekMinNode,
            _siblingOf,
            _uncleOf;
        NODE_FOUND = 0;
        NODE_TOO_BIG = 1;
        NODE_TOO_SMALL = 2;
        STOP_SEARCHING = 3;
        RED = 1;
        BLACK = 2;
        RedBlackTree = (function() {
          function RedBlackTree(valuesToAdd) {
            var value,
                _i,
                _len;
            if (valuesToAdd == null) {
              valuesToAdd = [];
            }
            this._root;
            this.size = 0;
            for (_i = 0, _len = valuesToAdd.length; _i < _len; _i++) {
              value = valuesToAdd[_i];
              if (value != null) {
                this.add(value);
              }
            }
          }
          RedBlackTree.prototype.add = function(value) {
            var currentNode,
                foundNode,
                nodeToInsert,
                _ref;
            if (value == null) {
              return;
            }
            this.size++;
            nodeToInsert = {
              value: value,
              _color: RED
            };
            if (!this._root) {
              this._root = nodeToInsert;
            } else {
              foundNode = _findNode(this._root, function(node) {
                if (value === node.value) {
                  return NODE_FOUND;
                } else {
                  if (value < node.value) {
                    if (node._left) {
                      return NODE_TOO_BIG;
                    } else {
                      nodeToInsert._parent = node;
                      node._left = nodeToInsert;
                      return STOP_SEARCHING;
                    }
                  } else {
                    if (node._right) {
                      return NODE_TOO_SMALL;
                    } else {
                      nodeToInsert._parent = node;
                      node._right = nodeToInsert;
                      return STOP_SEARCHING;
                    }
                  }
                }
              });
              if (foundNode != null) {
                return;
              }
            }
            currentNode = nodeToInsert;
            while (true) {
              if (currentNode === this._root) {
                currentNode._color = BLACK;
                break;
              }
              if (currentNode._parent._color === BLACK) {
                break;
              }
              if (((_ref = _uncleOf(currentNode)) != null ? _ref._color : void 0) === RED) {
                currentNode._parent._color = BLACK;
                _uncleOf(currentNode)._color = BLACK;
                _grandParentOf(currentNode)._color = RED;
                currentNode = _grandParentOf(currentNode);
                continue;
              }
              if (!_isLeft(currentNode) && _isLeft(currentNode._parent)) {
                this._rotateLeft(currentNode._parent);
                currentNode = currentNode._left;
              } else if (_isLeft(currentNode) && !_isLeft(currentNode._parent)) {
                this._rotateRight(currentNode._parent);
                currentNode = currentNode._right;
              }
              currentNode._parent._color = BLACK;
              _grandParentOf(currentNode)._color = RED;
              if (_isLeft(currentNode)) {
                this._rotateRight(_grandParentOf(currentNode));
              } else {
                this._rotateLeft(_grandParentOf(currentNode));
              }
              break;
            }
            return value;
          };
          RedBlackTree.prototype.has = function(value) {
            var foundNode;
            foundNode = _findNode(this._root, function(node) {
              if (value === node.value) {
                return NODE_FOUND;
              } else if (value < node.value) {
                return NODE_TOO_BIG;
              } else {
                return NODE_TOO_SMALL;
              }
            });
            if (foundNode) {
              return true;
            } else {
              return false;
            }
          };
          RedBlackTree.prototype.peekMin = function() {
            var _ref;
            return (_ref = _peekMinNode(this._root)) != null ? _ref.value : void 0;
          };
          RedBlackTree.prototype.peekMax = function() {
            var _ref;
            return (_ref = _peekMaxNode(this._root)) != null ? _ref.value : void 0;
          };
          RedBlackTree.prototype.remove = function(value) {
            var foundNode;
            foundNode = _findNode(this._root, function(node) {
              if (value === node.value) {
                return NODE_FOUND;
              } else if (value < node.value) {
                return NODE_TOO_BIG;
              } else {
                return NODE_TOO_SMALL;
              }
            });
            if (!foundNode) {
              return;
            }
            this._removeNode(this._root, foundNode);
            this.size--;
            return value;
          };
          RedBlackTree.prototype.removeMin = function() {
            var nodeToRemove,
                valueToReturn;
            nodeToRemove = _peekMinNode(this._root);
            if (!nodeToRemove) {
              return;
            }
            valueToReturn = nodeToRemove.value;
            this._removeNode(this._root, nodeToRemove);
            return valueToReturn;
          };
          RedBlackTree.prototype.removeMax = function() {
            var nodeToRemove,
                valueToReturn;
            nodeToRemove = _peekMaxNode(this._root);
            if (!nodeToRemove) {
              return;
            }
            valueToReturn = nodeToRemove.value;
            this._removeNode(this._root, nodeToRemove);
            return valueToReturn;
          };
          RedBlackTree.prototype._removeNode = function(root, node) {
            var sibling,
                successor,
                _ref,
                _ref1,
                _ref2,
                _ref3,
                _ref4,
                _ref5,
                _ref6,
                _ref7;
            if (node._left && node._right) {
              successor = _peekMinNode(node._right);
              node.value = successor.value;
              node = successor;
            }
            successor = node._left || node._right;
            if (!successor) {
              successor = {
                color: BLACK,
                _right: void 0,
                _left: void 0,
                isLeaf: true
              };
            }
            successor._parent = node._parent;
            if ((_ref = node._parent) != null) {
              _ref[_leftOrRight(node)] = successor;
            }
            if (node._color === BLACK) {
              if (successor._color === RED) {
                successor._color = BLACK;
                if (!successor._parent) {
                  this._root = successor;
                }
              } else {
                while (true) {
                  if (!successor._parent) {
                    if (!successor.isLeaf) {
                      this._root = successor;
                    } else {
                      this._root = void 0;
                    }
                    break;
                  }
                  sibling = _siblingOf(successor);
                  if ((sibling != null ? sibling._color : void 0) === RED) {
                    successor._parent._color = RED;
                    sibling._color = BLACK;
                    if (_isLeft(successor)) {
                      this._rotateLeft(successor._parent);
                    } else {
                      this._rotateRight(successor._parent);
                    }
                  }
                  sibling = _siblingOf(successor);
                  if (successor._parent._color === BLACK && (!sibling || (sibling._color === BLACK && (!sibling._left || sibling._left._color === BLACK) && (!sibling._right || sibling._right._color === BLACK)))) {
                    if (sibling != null) {
                      sibling._color = RED;
                    }
                    if (successor.isLeaf) {
                      successor._parent[_leftOrRight(successor)] = void 0;
                    }
                    successor = successor._parent;
                    continue;
                  }
                  if (successor._parent._color === RED && (!sibling || (sibling._color === BLACK && (!sibling._left || ((_ref1 = sibling._left) != null ? _ref1._color : void 0) === BLACK) && (!sibling._right || ((_ref2 = sibling._right) != null ? _ref2._color : void 0) === BLACK)))) {
                    if (sibling != null) {
                      sibling._color = RED;
                    }
                    successor._parent._color = BLACK;
                    break;
                  }
                  if ((sibling != null ? sibling._color : void 0) === BLACK) {
                    if (_isLeft(successor) && (!sibling._right || sibling._right._color === BLACK) && ((_ref3 = sibling._left) != null ? _ref3._color : void 0) === RED) {
                      sibling._color = RED;
                      if ((_ref4 = sibling._left) != null) {
                        _ref4._color = BLACK;
                      }
                      this._rotateRight(sibling);
                    } else if (!_isLeft(successor) && (!sibling._left || sibling._left._color === BLACK) && ((_ref5 = sibling._right) != null ? _ref5._color : void 0) === RED) {
                      sibling._color = RED;
                      if ((_ref6 = sibling._right) != null) {
                        _ref6._color = BLACK;
                      }
                      this._rotateLeft(sibling);
                    }
                    break;
                  }
                  sibling = _siblingOf(successor);
                  sibling._color = successor._parent._color;
                  if (_isLeft(successor)) {
                    sibling._right._color = BLACK;
                    this._rotateRight(successor._parent);
                  } else {
                    sibling._left._color = BLACK;
                    this._rotateLeft(successor._parent);
                  }
                }
              }
            }
            if (successor.isLeaf) {
              return (_ref7 = successor._parent) != null ? _ref7[_leftOrRight(successor)] = void 0 : void 0;
            }
          };
          RedBlackTree.prototype._rotateLeft = function(node) {
            var _ref,
                _ref1;
            if ((_ref = node._parent) != null) {
              _ref[_leftOrRight(node)] = node._right;
            }
            node._right._parent = node._parent;
            node._parent = node._right;
            node._right = node._right._left;
            node._parent._left = node;
            if ((_ref1 = node._right) != null) {
              _ref1._parent = node;
            }
            if (node._parent._parent == null) {
              return this._root = node._parent;
            }
          };
          RedBlackTree.prototype._rotateRight = function(node) {
            var _ref,
                _ref1;
            if ((_ref = node._parent) != null) {
              _ref[_leftOrRight(node)] = node._left;
            }
            node._left._parent = node._parent;
            node._parent = node._left;
            node._left = node._left._right;
            node._parent._right = node;
            if ((_ref1 = node._left) != null) {
              _ref1._parent = node;
            }
            if (node._parent._parent == null) {
              return this._root = node._parent;
            }
          };
          return RedBlackTree;
        })();
        _isLeft = function(node) {
          return node === node._parent._left;
        };
        _leftOrRight = function(node) {
          if (_isLeft(node)) {
            return '_left';
          } else {
            return '_right';
          }
        };
        _findNode = function(startingNode, comparator) {
          var comparisonResult,
              currentNode,
              foundNode;
          currentNode = startingNode;
          foundNode = void 0;
          while (currentNode) {
            comparisonResult = comparator(currentNode);
            if (comparisonResult === NODE_FOUND) {
              foundNode = currentNode;
              break;
            }
            if (comparisonResult === NODE_TOO_BIG) {
              currentNode = currentNode._left;
            } else if (comparisonResult === NODE_TOO_SMALL) {
              currentNode = currentNode._right;
            } else if (comparisonResult === STOP_SEARCHING) {
              break;
            }
          }
          return foundNode;
        };
        _peekMinNode = function(startingNode) {
          return _findNode(startingNode, function(node) {
            if (node._left) {
              return NODE_TOO_BIG;
            } else {
              return NODE_FOUND;
            }
          });
        };
        _peekMaxNode = function(startingNode) {
          return _findNode(startingNode, function(node) {
            if (node._right) {
              return NODE_TOO_SMALL;
            } else {
              return NODE_FOUND;
            }
          });
        };
        _grandParentOf = function(node) {
          var _ref;
          return (_ref = node._parent) != null ? _ref._parent : void 0;
        };
        _uncleOf = function(node) {
          if (!_grandParentOf(node)) {
            return;
          }
          if (_isLeft(node._parent)) {
            return _grandParentOf(node)._right;
          } else {
            return _grandParentOf(node)._left;
          }
        };
        _siblingOf = function(node) {
          if (_isLeft(node)) {
            return node._parent._right;
          } else {
            return node._parent._left;
          }
        };
        module.exports = RedBlackTree;
      }).call(this);
    }, function(module, exports, __webpack_require__) {
      (function() {
        var Queue,
            Trie,
            WORD_END,
            _hasAtLeastNChildren,
            __hasProp = {}.hasOwnProperty;
        Queue = __webpack_require__(6);
        WORD_END = 'end';
        Trie = (function() {
          function Trie(words) {
            var word,
                _i,
                _len;
            if (words == null) {
              words = [];
            }
            this._root = {};
            this.size = 0;
            for (_i = 0, _len = words.length; _i < _len; _i++) {
              word = words[_i];
              this.add(word);
            }
          }
          Trie.prototype.add = function(word) {
            var currentNode,
                letter,
                _i,
                _len;
            if (word == null) {
              return;
            }
            this.size++;
            currentNode = this._root;
            for (_i = 0, _len = word.length; _i < _len; _i++) {
              letter = word[_i];
              if (currentNode[letter] == null) {
                currentNode[letter] = {};
              }
              currentNode = currentNode[letter];
            }
            currentNode[WORD_END] = true;
            return word;
          };
          Trie.prototype.has = function(word) {
            var currentNode,
                letter,
                _i,
                _len;
            if (word == null) {
              return false;
            }
            currentNode = this._root;
            for (_i = 0, _len = word.length; _i < _len; _i++) {
              letter = word[_i];
              if (currentNode[letter] == null) {
                return false;
              }
              currentNode = currentNode[letter];
            }
            if (currentNode[WORD_END]) {
              return true;
            } else {
              return false;
            }
          };
          Trie.prototype.longestPrefixOf = function(word) {
            var currentNode,
                letter,
                prefix,
                _i,
                _len;
            if (word == null) {
              return '';
            }
            currentNode = this._root;
            prefix = '';
            for (_i = 0, _len = word.length; _i < _len; _i++) {
              letter = word[_i];
              if (currentNode[letter] == null) {
                break;
              }
              prefix += letter;
              currentNode = currentNode[letter];
            }
            return prefix;
          };
          Trie.prototype.wordsWithPrefix = function(prefix) {
            var accumulatedLetters,
                currentNode,
                letter,
                node,
                queue,
                subNode,
                words,
                _i,
                _len,
                _ref;
            if (prefix == null) {
              return [];
            }
            (prefix != null) || (prefix = '');
            words = [];
            currentNode = this._root;
            for (_i = 0, _len = prefix.length; _i < _len; _i++) {
              letter = prefix[_i];
              currentNode = currentNode[letter];
              if (currentNode == null) {
                return [];
              }
            }
            queue = new Queue();
            queue.enqueue([currentNode, '']);
            while (queue.size !== 0) {
              _ref = queue.dequeue(), node = _ref[0], accumulatedLetters = _ref[1];
              if (node[WORD_END]) {
                words.push(prefix + accumulatedLetters);
              }
              for (letter in node) {
                if (!__hasProp.call(node, letter))
                  continue;
                subNode = node[letter];
                queue.enqueue([subNode, accumulatedLetters + letter]);
              }
            }
            return words;
          };
          Trie.prototype.remove = function(word) {
            var currentNode,
                i,
                letter,
                prefix,
                _i,
                _j,
                _len,
                _ref;
            if (word == null) {
              return;
            }
            currentNode = this._root;
            prefix = [];
            for (_i = 0, _len = word.length; _i < _len; _i++) {
              letter = word[_i];
              if (currentNode[letter] == null) {
                return;
              }
              currentNode = currentNode[letter];
              prefix.push([letter, currentNode]);
            }
            if (!currentNode[WORD_END]) {
              return;
            }
            this.size--;
            delete currentNode[WORD_END];
            if (_hasAtLeastNChildren(currentNode, 1)) {
              return word;
            }
            for (i = _j = _ref = prefix.length - 1; _ref <= 1 ? _j <= 1 : _j >= 1; i = _ref <= 1 ? ++_j : --_j) {
              if (!_hasAtLeastNChildren(prefix[i][1], 1)) {
                delete prefix[i - 1][1][prefix[i][0]];
              } else {
                break;
              }
            }
            if (!_hasAtLeastNChildren(this._root[prefix[0][0]], 1)) {
              delete this._root[prefix[0][0]];
            }
            return word;
          };
          return Trie;
        })();
        _hasAtLeastNChildren = function(node, n) {
          var child,
              childCount;
          if (n === 0) {
            return true;
          }
          childCount = 0;
          for (child in node) {
            if (!__hasProp.call(node, child))
              continue;
            childCount++;
            if (childCount >= n) {
              return true;
            }
          }
          return false;
        };
        module.exports = Trie;
      }).call(this);
    }]);
    ;
    angular.module('uiGmapgoogle-maps.wrapped').service('uiGmapMarkerSpiderfier', ['uiGmapGoogleMapApi', function(GoogleMapApi) {
      var self = this;
      var hasProp = {}.hasOwnProperty,
          slice = [].slice;
      this['OverlappingMarkerSpiderfier'] = (function() {
        var ge,
            gm,
            j,
            lcH,
            lcU,
            len,
            mt,
            p,
            ref,
            twoPi,
            x;
        p = _Class.prototype;
        ref = [_Class, p];
        for (j = 0, len = ref.length; j < len; j++) {
          x = ref[j];
          x['VERSION'] = '0.3.3';
        }
        gm = void 0;
        ge = void 0;
        mt = void 0;
        twoPi = Math.PI * 2;
        p['keepSpiderfied'] = false;
        p['markersWontHide'] = false;
        p['markersWontMove'] = false;
        p['nearbyDistance'] = 20;
        p['circleSpiralSwitchover'] = 9;
        p['circleFootSeparation'] = 23;
        p['circleStartAngle'] = twoPi / 12;
        p['spiralFootSeparation'] = 26;
        p['spiralLengthStart'] = 11;
        p['spiralLengthFactor'] = 4;
        p['spiderfiedZIndex'] = 1000;
        p['usualLegZIndex'] = 10;
        p['highlightedLegZIndex'] = 20;
        p['event'] = 'click';
        p['minZoomLevel'] = false;
        p['legWeight'] = 1.5;
        p['legColors'] = {
          'usual': {},
          'highlighted': {}
        };
        lcU = p['legColors']['usual'];
        lcH = p['legColors']['highlighted'];
        _Class['initializeGoogleMaps'] = function(google) {
          gm = google.maps;
          ge = gm.event;
          mt = gm.MapTypeId;
          lcU[mt.HYBRID] = lcU[mt.SATELLITE] = '#fff';
          lcH[mt.HYBRID] = lcH[mt.SATELLITE] = '#f00';
          lcU[mt.TERRAIN] = lcU[mt.ROADMAP] = '#444';
          lcH[mt.TERRAIN] = lcH[mt.ROADMAP] = '#f00';
          this.ProjHelper = function(map) {
            return this.setMap(map);
          };
          this.ProjHelper.prototype = new gm.OverlayView();
          return this.ProjHelper.prototype['draw'] = function() {};
        };
        function _Class(map1, opts) {
          var e,
              k,
              l,
              len1,
              ref1,
              v;
          this.map = map1;
          if (opts == null) {
            opts = {};
          }
          for (k in opts) {
            if (!hasProp.call(opts, k))
              continue;
            v = opts[k];
            this[k] = v;
          }
          this.projHelper = new this.constructor.ProjHelper(this.map);
          this.initMarkerArrays();
          this.listeners = {};
          ref1 = ['click', 'zoom_changed', 'maptypeid_changed'];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            e = ref1[l];
            ge.addListener(this.map, e, (function(_this) {
              return function() {
                return _this['unspiderfy']();
              };
            })(this));
          }
        }
        p.initMarkerArrays = function() {
          this.markers = [];
          return this.markerListenerRefs = [];
        };
        p['addMarker'] = function(marker) {
          var listenerRefs;
          if (marker['_oms'] != null) {
            return this;
          }
          marker['_oms'] = true;
          listenerRefs = [ge.addListener(marker, this['event'], (function(_this) {
            return function(event) {
              return _this.spiderListener(marker, event);
            };
          })(this))];
          if (!this['markersWontHide']) {
            listenerRefs.push(ge.addListener(marker, 'visible_changed', (function(_this) {
              return function() {
                return _this.markerChangeListener(marker, false);
              };
            })(this)));
          }
          if (!this['markersWontMove']) {
            listenerRefs.push(ge.addListener(marker, 'position_changed', (function(_this) {
              return function() {
                return _this.markerChangeListener(marker, true);
              };
            })(this)));
          }
          this.markerListenerRefs.push(listenerRefs);
          this.markers.push(marker);
          return this;
        };
        p.markerChangeListener = function(marker, positionChanged) {
          if ((marker['_omsData'] != null) && (positionChanged || !marker.getVisible()) && !((this.spiderfying != null) || (this.unspiderfying != null))) {
            return this['unspiderfy'](positionChanged ? marker : null);
          }
        };
        p['getMarkers'] = function() {
          return this.markers.slice(0);
        };
        p['removeMarker'] = function(marker) {
          var i,
              l,
              len1,
              listenerRef,
              listenerRefs;
          if (marker['_omsData'] != null) {
            this['unspiderfy']();
          }
          i = this.arrIndexOf(this.markers, marker);
          if (i < 0) {
            return this;
          }
          listenerRefs = this.markerListenerRefs.splice(i, 1)[0];
          for (l = 0, len1 = listenerRefs.length; l < len1; l++) {
            listenerRef = listenerRefs[l];
            ge.removeListener(listenerRef);
          }
          delete marker['_oms'];
          this.markers.splice(i, 1);
          return this;
        };
        p['clearMarkers'] = function() {
          var i,
              l,
              len1,
              len2,
              listenerRef,
              listenerRefs,
              marker,
              n,
              ref1;
          this['unspiderfy']();
          ref1 = this.markers;
          for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
            marker = ref1[i];
            listenerRefs = this.markerListenerRefs[i];
            for (n = 0, len2 = listenerRefs.length; n < len2; n++) {
              listenerRef = listenerRefs[n];
              ge.removeListener(listenerRef);
            }
            delete marker['_oms'];
          }
          this.initMarkerArrays();
          return this;
        };
        p['addListener'] = function(event, func) {
          var base;
          ((base = this.listeners)[event] != null ? base[event] : base[event] = []).push(func);
          return this;
        };
        p['removeListener'] = function(event, func) {
          var i;
          i = this.arrIndexOf(this.listeners[event], func);
          if (!(i < 0)) {
            this.listeners[event].splice(i, 1);
          }
          return this;
        };
        p['clearListeners'] = function(event) {
          this.listeners[event] = [];
          return this;
        };
        p.trigger = function() {
          var args,
              event,
              func,
              l,
              len1,
              ref1,
              ref2,
              results;
          event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref2 = (ref1 = this.listeners[event]) != null ? ref1 : [];
          results = [];
          for (l = 0, len1 = ref2.length; l < len1; l++) {
            func = ref2[l];
            results.push(func.apply(null, args));
          }
          return results;
        };
        p.generatePtsCircle = function(count, centerPt) {
          var angle,
              angleStep,
              circumference,
              i,
              l,
              legLength,
              ref1,
              results;
          circumference = this['circleFootSeparation'] * (2 + count);
          legLength = circumference / twoPi;
          angleStep = twoPi / count;
          results = [];
          for (i = l = 0, ref1 = count; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
            angle = this['circleStartAngle'] + i * angleStep;
            results.push(new gm.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle)));
          }
          return results;
        };
        p.generatePtsSpiral = function(count, centerPt) {
          var angle,
              i,
              l,
              legLength,
              pt,
              ref1,
              results;
          legLength = this['spiralLengthStart'];
          angle = 0;
          results = [];
          for (i = l = 0, ref1 = count; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
            angle += this['spiralFootSeparation'] / legLength + i * 0.0005;
            pt = new gm.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle));
            legLength += twoPi * this['spiralLengthFactor'] / angle;
            results.push(pt);
          }
          return results;
        };
        p.spiderListener = function(marker, event) {
          var $this,
              clear,
              l,
              len1,
              m,
              mPt,
              markerPt,
              markerSpiderfied,
              nDist,
              nearbyMarkerData,
              nonNearbyMarkers,
              pxSq,
              ref1;
          markerSpiderfied = marker['_omsData'] != null;
          if (!(markerSpiderfied && this['keepSpiderfied'])) {
            if (this['event'] === 'mouseover') {
              $this = this;
              clear = function() {
                return $this['unspiderfy']();
              };
              window.clearTimeout(p.timeout);
              p.timeout = setTimeout(clear, 3000);
            } else {
              this['unspiderfy']();
            }
          }
          if (markerSpiderfied || this.map.getStreetView().getVisible() || this.map.getMapTypeId() === 'GoogleEarthAPI') {
            return this.trigger('click', marker, event);
          } else {
            nearbyMarkerData = [];
            nonNearbyMarkers = [];
            nDist = this['nearbyDistance'];
            pxSq = nDist * nDist;
            markerPt = this.llToPt(marker.position);
            ref1 = this.markers;
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              m = ref1[l];
              if (!((m.map != null) && m.getVisible())) {
                continue;
              }
              mPt = this.llToPt(m.position);
              if (this.ptDistanceSq(mPt, markerPt) < pxSq) {
                nearbyMarkerData.push({
                  marker: m,
                  markerPt: mPt
                });
              } else {
                nonNearbyMarkers.push(m);
              }
            }
            if (nearbyMarkerData.length === 1) {
              return this.trigger('click', marker, event);
            } else {
              return this.spiderfy(nearbyMarkerData, nonNearbyMarkers);
            }
          }
        };
        p['markersNearMarker'] = function(marker, firstOnly) {
          var l,
              len1,
              m,
              mPt,
              markerPt,
              markers,
              nDist,
              pxSq,
              ref1,
              ref2,
              ref3;
          if (firstOnly == null) {
            firstOnly = false;
          }
          if (this.projHelper.getProjection() == null) {
            throw "Must wait for 'idle' event on map before calling markersNearMarker";
          }
          nDist = this['nearbyDistance'];
          pxSq = nDist * nDist;
          markerPt = this.llToPt(marker.position);
          markers = [];
          ref1 = this.markers;
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            m = ref1[l];
            if (m === marker || (m.map == null) || !m.getVisible()) {
              continue;
            }
            mPt = this.llToPt((ref2 = (ref3 = m['_omsData']) != null ? ref3.usualPosition : void 0) != null ? ref2 : m.position);
            if (this.ptDistanceSq(mPt, markerPt) < pxSq) {
              markers.push(m);
              if (firstOnly) {
                break;
              }
            }
          }
          return markers;
        };
        p['markersNearAnyOtherMarker'] = function() {
          var i,
              i1,
              i2,
              l,
              len1,
              len2,
              len3,
              m,
              m1,
              m1Data,
              m2,
              m2Data,
              mData,
              n,
              nDist,
              pxSq,
              q,
              ref1,
              ref2,
              ref3,
              results;
          if (this.projHelper.getProjection() == null) {
            throw "Must wait for 'idle' event on map before calling markersNearAnyOtherMarker";
          }
          nDist = this['nearbyDistance'];
          pxSq = nDist * nDist;
          mData = (function() {
            var l,
                len1,
                ref1,
                ref2,
                ref3,
                results;
            ref1 = this.markers;
            results = [];
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              m = ref1[l];
              results.push({
                pt: this.llToPt((ref2 = (ref3 = m['_omsData']) != null ? ref3.usualPosition : void 0) != null ? ref2 : m.position),
                willSpiderfy: false
              });
            }
            return results;
          }).call(this);
          ref1 = this.markers;
          for (i1 = l = 0, len1 = ref1.length; l < len1; i1 = ++l) {
            m1 = ref1[i1];
            if (!((m1.map != null) && m1.getVisible())) {
              continue;
            }
            m1Data = mData[i1];
            if (m1Data.willSpiderfy) {
              continue;
            }
            ref2 = this.markers;
            for (i2 = n = 0, len2 = ref2.length; n < len2; i2 = ++n) {
              m2 = ref2[i2];
              if (i2 === i1) {
                continue;
              }
              if (!((m2.map != null) && m2.getVisible())) {
                continue;
              }
              m2Data = mData[i2];
              if (i2 < i1 && !m2Data.willSpiderfy) {
                continue;
              }
              if (this.ptDistanceSq(m1Data.pt, m2Data.pt) < pxSq) {
                m1Data.willSpiderfy = m2Data.willSpiderfy = true;
                break;
              }
            }
          }
          ref3 = this.markers;
          results = [];
          for (i = q = 0, len3 = ref3.length; q < len3; i = ++q) {
            m = ref3[i];
            if (mData[i].willSpiderfy) {
              results.push(m);
            }
          }
          return results;
        };
        p.makeHighlightListenerFuncs = function(marker) {
          return {
            highlight: (function(_this) {
              return function() {
                return marker['_omsData'].leg.setOptions({
                  strokeColor: _this['legColors']['highlighted'][_this.map.mapTypeId],
                  zIndex: _this['highlightedLegZIndex']
                });
              };
            })(this),
            unhighlight: (function(_this) {
              return function() {
                return marker['_omsData'].leg.setOptions({
                  strokeColor: _this['legColors']['usual'][_this.map.mapTypeId],
                  zIndex: _this['usualLegZIndex']
                });
              };
            })(this)
          };
        };
        p.spiderfy = function(markerData, nonNearbyMarkers) {
          var bodyPt,
              footLl,
              footPt,
              footPts,
              highlightListenerFuncs,
              leg,
              marker,
              md,
              nearestMarkerDatum,
              numFeet,
              spiderfiedMarkers;
          if (this['minZoomLevel'] && this.map.getZoom() < this['minZoomLevel']) {
            return false;
          }
          this.spiderfying = true;
          numFeet = markerData.length;
          bodyPt = this.ptAverage((function() {
            var l,
                len1,
                results;
            results = [];
            for (l = 0, len1 = markerData.length; l < len1; l++) {
              md = markerData[l];
              results.push(md.markerPt);
            }
            return results;
          })());
          footPts = numFeet >= this['circleSpiralSwitchover'] ? this.generatePtsSpiral(numFeet, bodyPt).reverse() : this.generatePtsCircle(numFeet, bodyPt);
          spiderfiedMarkers = (function() {
            var l,
                len1,
                results;
            results = [];
            for (l = 0, len1 = footPts.length; l < len1; l++) {
              footPt = footPts[l];
              footLl = this.ptToLl(footPt);
              nearestMarkerDatum = this.minExtract(markerData, (function(_this) {
                return function(md) {
                  return _this.ptDistanceSq(md.markerPt, footPt);
                };
              })(this));
              marker = nearestMarkerDatum.marker;
              leg = new gm.Polyline({
                map: this.map,
                path: [marker.position, footLl],
                strokeColor: this['legColors']['usual'][this.map.mapTypeId],
                strokeWeight: this['legWeight'],
                zIndex: this['usualLegZIndex']
              });
              marker['_omsData'] = {
                usualPosition: marker.position,
                leg: leg
              };
              if (this['legColors']['highlighted'][this.map.mapTypeId] !== this['legColors']['usual'][this.map.mapTypeId]) {
                highlightListenerFuncs = this.makeHighlightListenerFuncs(marker);
                marker['_omsData'].hightlightListeners = {
                  highlight: ge.addListener(marker, 'mouseover', highlightListenerFuncs.highlight),
                  unhighlight: ge.addListener(marker, 'mouseout', highlightListenerFuncs.unhighlight)
                };
              }
              marker.setPosition(footLl);
              marker.setZIndex(Math.round(this['spiderfiedZIndex'] + footPt.y));
              results.push(marker);
            }
            return results;
          }).call(this);
          delete this.spiderfying;
          this.spiderfied = true;
          return this.trigger('spiderfy', spiderfiedMarkers, nonNearbyMarkers);
        };
        p['unspiderfy'] = function(markerNotToMove) {
          var l,
              len1,
              listeners,
              marker,
              nonNearbyMarkers,
              ref1,
              unspiderfiedMarkers;
          if (markerNotToMove == null) {
            markerNotToMove = null;
          }
          if (this.spiderfied == null) {
            return this;
          }
          this.unspiderfying = true;
          unspiderfiedMarkers = [];
          nonNearbyMarkers = [];
          ref1 = this.markers;
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            marker = ref1[l];
            if (marker['_omsData'] != null) {
              marker['_omsData'].leg.setMap(null);
              if (marker !== markerNotToMove) {
                marker.setPosition(marker['_omsData'].usualPosition);
              }
              marker.setZIndex(null);
              listeners = marker['_omsData'].hightlightListeners;
              if (listeners != null) {
                ge.removeListener(listeners.highlight);
                ge.removeListener(listeners.unhighlight);
              }
              delete marker['_omsData'];
              unspiderfiedMarkers.push(marker);
            } else {
              nonNearbyMarkers.push(marker);
            }
          }
          delete this.unspiderfying;
          delete this.spiderfied;
          this.trigger('unspiderfy', unspiderfiedMarkers, nonNearbyMarkers);
          return this;
        };
        p.ptDistanceSq = function(pt1, pt2) {
          var dx,
              dy;
          dx = pt1.x - pt2.x;
          dy = pt1.y - pt2.y;
          return dx * dx + dy * dy;
        };
        p.ptAverage = function(pts) {
          var l,
              len1,
              numPts,
              pt,
              sumX,
              sumY;
          sumX = sumY = 0;
          for (l = 0, len1 = pts.length; l < len1; l++) {
            pt = pts[l];
            sumX += pt.x;
            sumY += pt.y;
          }
          numPts = pts.length;
          return new gm.Point(sumX / numPts, sumY / numPts);
        };
        p.llToPt = function(ll) {
          return this.projHelper.getProjection().fromLatLngToDivPixel(ll);
        };
        p.ptToLl = function(pt) {
          return this.projHelper.getProjection().fromDivPixelToLatLng(pt);
        };
        p.minExtract = function(set, func) {
          var bestIndex,
              bestVal,
              index,
              item,
              l,
              len1,
              val;
          for (index = l = 0, len1 = set.length; l < len1; index = ++l) {
            item = set[index];
            val = func(item);
            if ((typeof bestIndex === "undefined" || bestIndex === null) || val < bestVal) {
              bestVal = val;
              bestIndex = index;
            }
          }
          return set.splice(bestIndex, 1)[0];
        };
        p.arrIndexOf = function(arr, obj) {
          var i,
              l,
              len1,
              o;
          if (arr.indexOf != null) {
            return arr.indexOf(obj);
          }
          for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
            o = arr[i];
            if (o === obj) {
              return i;
            }
          }
          return -1;
        };
        return _Class;
      })();
      GoogleMapApi.then(function() {
        self.OverlappingMarkerSpiderfier.initializeGoogleMaps(window.google);
      });
      return this.OverlappingMarkerSpiderfier;
    }]);
    ;
    angular.module('uiGmapgoogle-maps.extensions').service('uiGmapExtendMarkerClusterer', ['uiGmapLodash', 'uiGmapPropMap', function(uiGmapLodash, PropMap) {
      return {init: _.once(function() {
          (function() {
            var __hasProp = {}.hasOwnProperty,
                __extends = function(child, parent) {
                  for (var key in parent) {
                    if (__hasProp.call(parent, key))
                      child[key] = parent[key];
                  }
                  function ctor() {
                    this.constructor = child;
                  }
                  ctor.prototype = parent.prototype;
                  child.prototype = new ctor();
                  child.__super__ = parent.prototype;
                  return child;
                };
            window.NgMapCluster = (function(_super) {
              __extends(NgMapCluster, _super);
              function NgMapCluster(opts) {
                NgMapCluster.__super__.constructor.call(this, opts);
                this.markers_ = new PropMap();
              }
              NgMapCluster.prototype.addMarker = function(marker) {
                var i;
                var mCount;
                var mz;
                if (this.isMarkerAlreadyAdded_(marker)) {
                  var oldMarker = this.markers_.get(marker.key);
                  if (oldMarker.getPosition().lat() == marker.getPosition().lat() && oldMarker.getPosition().lon() == marker.getPosition().lon())
                    return false;
                }
                if (!this.center_) {
                  this.center_ = marker.getPosition();
                  this.calculateBounds_();
                } else {
                  if (this.averageCenter_) {
                    var l = this.markers_.length + 1;
                    var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
                    var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
                    this.center_ = new google.maps.LatLng(lat, lng);
                    this.calculateBounds_();
                  }
                }
                marker.isAdded = true;
                this.markers_.push(marker);
                mCount = this.markers_.length;
                mz = this.markerClusterer_.getMaxZoom();
                if (mz !== null && this.map_.getZoom() > mz) {
                  if (marker.getMap() !== this.map_) {
                    marker.setMap(this.map_);
                  }
                } else if (mCount < this.minClusterSize_) {
                  if (marker.getMap() !== this.map_) {
                    marker.setMap(this.map_);
                  }
                } else if (mCount === this.minClusterSize_) {
                  this.markers_.each(function(m) {
                    m.setMap(null);
                  });
                } else {
                  marker.setMap(null);
                }
                return true;
              };
              NgMapCluster.prototype.isMarkerAlreadyAdded_ = function(marker) {
                return uiGmapLodash.isNullOrUndefined(this.markers_.get(marker.key));
              };
              NgMapCluster.prototype.getBounds = function() {
                var i;
                var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
                this.getMarkers().each(function(m) {
                  bounds.extend(m.getPosition());
                });
                return bounds;
              };
              NgMapCluster.prototype.remove = function() {
                this.clusterIcon_.setMap(null);
                this.markers_ = new PropMap();
                delete this.markers_;
              };
              return NgMapCluster;
            })(Cluster);
            window.NgMapMarkerClusterer = (function(_super) {
              __extends(NgMapMarkerClusterer, _super);
              function NgMapMarkerClusterer(map, opt_markers, opt_options) {
                NgMapMarkerClusterer.__super__.constructor.call(this, map, opt_markers, opt_options);
                this.markers_ = new PropMap();
              }
              NgMapMarkerClusterer.prototype.clearMarkers = function() {
                this.resetViewport_(true);
                this.markers_ = new PropMap();
              };
              NgMapMarkerClusterer.prototype.removeMarker_ = function(marker) {
                if (!this.markers_.get(marker.key)) {
                  return false;
                }
                marker.setMap(null);
                this.markers_.remove(marker.key);
                return true;
              };
              NgMapMarkerClusterer.prototype.createClusters_ = function(iFirst) {
                var i,
                    marker;
                var mapBounds;
                var cMarkerClusterer = this;
                if (!this.ready_) {
                  return;
                }
                if (iFirst === 0) {
                  google.maps.event.trigger(this, 'clusteringbegin', this);
                  if (typeof this.timerRefStatic !== 'undefined') {
                    clearTimeout(this.timerRefStatic);
                    delete this.timerRefStatic;
                  }
                }
                if (this.getMap().getZoom() > 3) {
                  mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(), this.getMap().getBounds().getNorthEast());
                } else {
                  mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472, -178.48388434375), new google.maps.LatLng(-85.08136444384544, 178.00048865625));
                }
                var bounds = this.getExtendedBounds(mapBounds);
                var iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);
                var _ms = this.markers_.values();
                for (i = iFirst; i < iLast; i++) {
                  marker = _ms[i];
                  if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
                    if (!this.ignoreHidden_ || (this.ignoreHidden_ && marker.getVisible())) {
                      this.addToClosestCluster_(marker);
                    }
                  }
                }
                if (iLast < this.markers_.length) {
                  this.timerRefStatic = setTimeout(function() {
                    cMarkerClusterer.createClusters_(iLast);
                  }, 0);
                } else {
                  for (i = 0; i < this.clusters_.length; i++) {
                    this.clusters_[i].updateIcon_();
                  }
                  delete this.timerRefStatic;
                  google.maps.event.trigger(this, 'clusteringend', this);
                }
              };
              NgMapMarkerClusterer.prototype.addToClosestCluster_ = function(marker) {
                var i,
                    d,
                    cluster,
                    center;
                var distance = 40000;
                var clusterToAddTo = null;
                for (i = 0; i < this.clusters_.length; i++) {
                  cluster = this.clusters_[i];
                  center = cluster.getCenter();
                  if (center) {
                    d = this.distanceBetweenPoints_(center, marker.getPosition());
                    if (d < distance) {
                      distance = d;
                      clusterToAddTo = cluster;
                    }
                  }
                }
                if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
                  clusterToAddTo.addMarker(marker);
                } else {
                  cluster = new NgMapCluster(this);
                  cluster.addMarker(marker);
                  this.clusters_.push(cluster);
                }
              };
              NgMapMarkerClusterer.prototype.redraw_ = function() {
                this.createClusters_(0);
              };
              NgMapMarkerClusterer.prototype.resetViewport_ = function(opt_hide) {
                var i,
                    marker;
                for (i = 0; i < this.clusters_.length; i++) {
                  this.clusters_[i].remove();
                }
                this.clusters_ = [];
                this.markers_.each(function(marker) {
                  marker.isAdded = false;
                  if (opt_hide) {
                    marker.setMap(null);
                  }
                });
              };
              NgMapMarkerClusterer.prototype.extend = function(obj1, obj2) {
                return (function(object) {
                  var property;
                  for (property in object.prototype) {
                    if (property !== 'constructor')
                      this.prototype[property] = object.prototype[property];
                  }
                  return this;
                }).apply(obj1, [obj2]);
              };
              ClusterIcon.prototype.show = function() {
                if (this.div_) {
                  var img = "";
                  var bp = this.backgroundPosition_.split(" ");
                  var spriteH = parseInt(bp[0].trim(), 10);
                  var spriteV = parseInt(bp[1].trim(), 10);
                  var pos = this.getPosFromLatLng_(this.center_);
                  this.div_.style.cssText = this.createCss(pos);
                  img = "<img src='" + this.url_ + "' style='position: absolute; top: " + spriteV + "px; left: " + spriteH + "px; ";
                  if (!this.cluster_.getMarkerClusterer().enableRetinaIcons_) {
                    img += "clip: rect(" + (-1 * spriteV) + "px, " + ((-1 * spriteH) + this.width_) + "px, " + ((-1 * spriteV) + this.height_) + "px, " + (-1 * spriteH) + "px);";
                  } else {
                    img += "width: " + this.width_ + "px;" + "height: " + this.height_ + "px;";
                  }
                  img += "'>";
                  this.div_.innerHTML = img + "<div style='" + "position: absolute;" + "top: " + this.anchorText_[0] + "px;" + "left: " + this.anchorText_[1] + "px;" + "color: " + this.textColor_ + ";" + "font-size: " + this.textSize_ + "px;" + "font-family: " + this.fontFamily_ + ";" + "font-weight: " + this.fontWeight_ + ";" + "font-style: " + this.fontStyle_ + ";" + "text-decoration: " + this.textDecoration_ + ";" + "text-align: center;" + "width: " + this.width_ + "px;" + "line-height:" + this.height_ + "px;" + "'>" + this.sums_.text + "</div>";
                  if (typeof this.sums_.title === "undefined" || this.sums_.title === "") {
                    this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
                  } else {
                    this.div_.title = this.sums_.title;
                  }
                  this.div_.style.display = "";
                }
                this.visible_ = true;
              };
              return NgMapMarkerClusterer;
            })(MarkerClusterer);
          }).call(this);
        })};
    }]);
  }(window, angular));
  global.define = __define;
  return module.exports;
});

$__System.register("3", [], function($__export) {
  "use strict";
  var __moduleName = "3";
  var Configuration;
  return {
    setters: [],
    execute: function() {
      Configuration = function() {
        function Configuration($stateProvider, $urlRouterProvider, uiGmapApiProvider, $ionicConfigProvider) {
          uiGmapApiProvider.configure({
            key: 'AIzaSyDo0kZXQYLevduL7ffansIOEJpp3Hi45Eg',
            libraries: 'weather, geometry'
          });
          $ionicConfigProvider.scrolling.jsScrolling(true);
          $stateProvider.state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
          }).state('tab.map', {
            url: '/map',
            views: {'tab-map': {
                templateUrl: './pages/map/map.template.html',
                controller: 'MapController',
                controllerAs: 'mapCtrl',
                resolve: {curPosition: getWatchPosition}
              }}
          });
          $urlRouterProvider.otherwise('/tab/map');
          function getWatchPosition($cordovaGeolocation, $log) {
            var watchOptions = {
              timeout: 10000,
              enableHighAccuracy: false
            };
            return $cordovaGeolocation.getCurrentPosition(watchOptions);
          }
          getWatchPosition.$inject = ['$cordovaGeolocation', '$log'];
        }
        return ($traceurRuntime.createClass)(Configuration, {}, {});
      }();
      $__export("Configuration", Configuration);
      Configuration.$inject = ['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', '$ionicConfigProvider'];
    }
  };
});

$__System.register("4", [], function($__export) {
  "use strict";
  var __moduleName = "4";
  var _$corGeo,
      _watchGeoObj,
      _curPosition,
      _googleMaps,
      _$timeout,
      _$log,
      MapController;
  function _panTo(ctrl, position) {
    ctrl.gMapConfig.coords = _getCoords(position);
    _zoom(ctrl, 15);
  }
  function _getCoords(position) {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  }
  function _zoom(ctrl, value) {
    _$timeout(function() {
      ctrl.gMapConfig.zoom = value;
    }, 100);
  }
  function _watchUserPos(ctrl, milliseconds) {
    var watchOptions = {
      timeout: 3000,
      enableHighAccuracy: false
    };
    _$timeout(function() {
      _watchGeoObj = _$corGeo.watchPosition(watchOptions);
      _watchGeoObj.then(null, function(error) {
        _$log.info(error);
      }, function(position) {
        _curPosition = position;
        ctrl.gMapConfig.coords = _getCoords(position);
        ctrl.markers.user.coords = _getCoords(position);
      });
    }, milliseconds);
  }
  return {
    setters: [],
    execute: function() {
      _$corGeo = null, _watchGeoObj = null, _curPosition = null, _googleMaps = null, _$timeout = null, _$log = null;
      MapController = function() {
        function MapController($scope, uiGmapApi, $cordovaGeolocation, $ionicPlatform, $timeout, curPosition, $log) {
          _$corGeo = $cordovaGeolocation;
          _$timeout = $timeout;
          _$log = $log;
          var ctrl = this;
          ctrl.gMapConfig = {
            coords: _getCoords(curPosition),
            zoom: 12
          };
          ctrl.markers = {user: {
              id: 1,
              coords: _getCoords(curPosition)
            }};
          _watchUserPos(ctrl, 5000);
          uiGmapApi.then(function(maps) {
            _googleMaps = maps;
          });
        }
        return ($traceurRuntime.createClass)(MapController, {gotoCurPosition: function() {
            _panTo(this, _curPosition);
          }}, {toString: function() {
            return 'MapController';
          }});
      }();
      $__export("MapController", MapController);
      MapController.$inject = ['$scope', 'uiGmapGoogleMapApi', '$cordovaGeolocation', '$ionicPlatform', '$timeout', 'curPosition', '$log'];
    }
  };
});

$__System.register("1", ["2", "3", "4"], function($__export) {
  "use strict";
  var __moduleName = "1";
  var Configuration,
      MapController;
  return {
    setters: [function($__m) {}, function($__m) {
      Configuration = $__m.Configuration;
    }, function($__m) {
      MapController = $__m.MapController;
    }],
    execute: function() {
      (function() {
        'use strict';
        angular.module('starter', ['ionic', 'uiGmapgoogle-maps', 'ngCordova']).run(function($ionicPlatform) {
          $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
              StatusBar.styleDefault();
            }
          });
        }).config(Configuration).controller(MapController, MapController);
        ;
      })();
    }
  };
});

})
(function(factory) {
  factory();
});
//# sourceMappingURL=all.js.map
