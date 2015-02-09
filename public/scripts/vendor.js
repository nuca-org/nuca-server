"format global";

"deps angular";

"deps moment";

!function(window, document, undefined) {
    "use strict";
    function minErr(module, ErrorConstructor) {
        return ErrorConstructor = ErrorConstructor || Error, function() {
            var message, i, code = arguments[0], prefix = "[" + (module ? module + ":" : "") + code + "] ", template = arguments[1], templateArgs = arguments;
            for (message = prefix + template.replace(/\{\d+\}/g, function(match) {
                var index = +match.slice(1, -1);
                return index + 2 < templateArgs.length ? toDebugString(templateArgs[index + 2]) : match;
            }), message = message + "\nhttp://errors.angularjs.org/1.3.11/" + (module ? module + "/" : "") + code, 
            i = 2; i < arguments.length; i++) message = message + (2 == i ? "?" : "&") + "p" + (i - 2) + "=" + encodeURIComponent(toDebugString(arguments[i]));
            return new ErrorConstructor(message);
        };
    }
    function isArrayLike(obj) {
        if (null == obj || isWindow(obj)) return !1;
        var length = obj.length;
        return obj.nodeType === NODE_TYPE_ELEMENT && length ? !0 : isString(obj) || isArray(obj) || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj;
    }
    function forEach(obj, iterator, context) {
        var key, length;
        if (obj) if (isFunction(obj)) for (key in obj) "prototype" == key || "length" == key || "name" == key || obj.hasOwnProperty && !obj.hasOwnProperty(key) || iterator.call(context, obj[key], key, obj); else if (isArray(obj) || isArrayLike(obj)) {
            var isPrimitive = "object" != typeof obj;
            for (key = 0, length = obj.length; length > key; key++) (isPrimitive || key in obj) && iterator.call(context, obj[key], key, obj);
        } else if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context, obj); else for (key in obj) obj.hasOwnProperty(key) && iterator.call(context, obj[key], key, obj);
        return obj;
    }
    function sortedKeys(obj) {
        return Object.keys(obj).sort();
    }
    function forEachSorted(obj, iterator, context) {
        for (var keys = sortedKeys(obj), i = 0; i < keys.length; i++) iterator.call(context, obj[keys[i]], keys[i]);
        return keys;
    }
    function reverseParams(iteratorFn) {
        return function(value, key) {
            iteratorFn(key, value);
        };
    }
    function nextUid() {
        return ++uid;
    }
    function setHashKey(obj, h) {
        h ? obj.$$hashKey = h : delete obj.$$hashKey;
    }
    function extend(dst) {
        for (var h = dst.$$hashKey, i = 1, ii = arguments.length; ii > i; i++) {
            var obj = arguments[i];
            if (obj) for (var keys = Object.keys(obj), j = 0, jj = keys.length; jj > j; j++) {
                var key = keys[j];
                dst[key] = obj[key];
            }
        }
        return setHashKey(dst, h), dst;
    }
    function int(str) {
        return parseInt(str, 10);
    }
    function inherit(parent, extra) {
        return extend(Object.create(parent), extra);
    }
    function noop() {}
    function identity($) {
        return $;
    }
    function valueFn(value) {
        return function() {
            return value;
        };
    }
    function isUndefined(value) {
        return "undefined" == typeof value;
    }
    function isDefined(value) {
        return "undefined" != typeof value;
    }
    function isObject(value) {
        return null !== value && "object" == typeof value;
    }
    function isString(value) {
        return "string" == typeof value;
    }
    function isNumber(value) {
        return "number" == typeof value;
    }
    function isDate(value) {
        return "[object Date]" === toString.call(value);
    }
    function isFunction(value) {
        return "function" == typeof value;
    }
    function isRegExp(value) {
        return "[object RegExp]" === toString.call(value);
    }
    function isWindow(obj) {
        return obj && obj.window === obj;
    }
    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }
    function isFile(obj) {
        return "[object File]" === toString.call(obj);
    }
    function isFormData(obj) {
        return "[object FormData]" === toString.call(obj);
    }
    function isBlob(obj) {
        return "[object Blob]" === toString.call(obj);
    }
    function isBoolean(value) {
        return "boolean" == typeof value;
    }
    function isPromiseLike(obj) {
        return obj && isFunction(obj.then);
    }
    function isElement(node) {
        return !(!node || !(node.nodeName || node.prop && node.attr && node.find));
    }
    function makeMap(str) {
        var i, obj = {}, items = str.split(",");
        for (i = 0; i < items.length; i++) obj[items[i]] = !0;
        return obj;
    }
    function nodeName_(element) {
        return lowercase(element.nodeName || element[0] && element[0].nodeName);
    }
    function arrayRemove(array, value) {
        var index = array.indexOf(value);
        return index >= 0 && array.splice(index, 1), value;
    }
    function copy(source, destination, stackSource, stackDest) {
        if (isWindow(source) || isScope(source)) throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        if (destination) {
            if (source === destination) throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
            if (stackSource = stackSource || [], stackDest = stackDest || [], isObject(source)) {
                var index = stackSource.indexOf(source);
                if (-1 !== index) return stackDest[index];
                stackSource.push(source), stackDest.push(destination);
            }
            var result;
            if (isArray(source)) {
                destination.length = 0;
                for (var i = 0; i < source.length; i++) result = copy(source[i], null, stackSource, stackDest), 
                isObject(source[i]) && (stackSource.push(source[i]), stackDest.push(result)), destination.push(result);
            } else {
                var h = destination.$$hashKey;
                isArray(destination) ? destination.length = 0 : forEach(destination, function(value, key) {
                    delete destination[key];
                });
                for (var key in source) source.hasOwnProperty(key) && (result = copy(source[key], null, stackSource, stackDest), 
                isObject(source[key]) && (stackSource.push(source[key]), stackDest.push(result)), 
                destination[key] = result);
                setHashKey(destination, h);
            }
        } else if (destination = source, source) if (isArray(source)) destination = copy(source, [], stackSource, stackDest); else if (isDate(source)) destination = new Date(source.getTime()); else if (isRegExp(source)) destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]), 
        destination.lastIndex = source.lastIndex; else if (isObject(source)) {
            var emptyObject = Object.create(Object.getPrototypeOf(source));
            destination = copy(source, emptyObject, stackSource, stackDest);
        }
        return destination;
    }
    function shallowCopy(src, dst) {
        if (isArray(src)) {
            dst = dst || [];
            for (var i = 0, ii = src.length; ii > i; i++) dst[i] = src[i];
        } else if (isObject(src)) {
            dst = dst || {};
            for (var key in src) ("$" !== key.charAt(0) || "$" !== key.charAt(1)) && (dst[key] = src[key]);
        }
        return dst || src;
    }
    function equals(o1, o2) {
        if (o1 === o2) return !0;
        if (null === o1 || null === o2) return !1;
        if (o1 !== o1 && o2 !== o2) return !0;
        var length, key, keySet, t1 = typeof o1, t2 = typeof o2;
        if (t1 == t2 && "object" == t1) {
            if (!isArray(o1)) {
                if (isDate(o1)) return isDate(o2) ? equals(o1.getTime(), o2.getTime()) : !1;
                if (isRegExp(o1) && isRegExp(o2)) return o1.toString() == o2.toString();
                if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return !1;
                keySet = {};
                for (key in o1) if ("$" !== key.charAt(0) && !isFunction(o1[key])) {
                    if (!equals(o1[key], o2[key])) return !1;
                    keySet[key] = !0;
                }
                for (key in o2) if (!keySet.hasOwnProperty(key) && "$" !== key.charAt(0) && o2[key] !== undefined && !isFunction(o2[key])) return !1;
                return !0;
            }
            if (!isArray(o2)) return !1;
            if ((length = o1.length) == o2.length) {
                for (key = 0; length > key; key++) if (!equals(o1[key], o2[key])) return !1;
                return !0;
            }
        }
        return !1;
    }
    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }
    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0);
    }
    function bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        return !isFunction(fn) || fn instanceof RegExp ? fn : curryArgs.length ? function() {
            return arguments.length ? fn.apply(self, concat(curryArgs, arguments, 0)) : fn.apply(self, curryArgs);
        } : function() {
            return arguments.length ? fn.apply(self, arguments) : fn.call(self);
        };
    }
    function toJsonReplacer(key, value) {
        var val = value;
        return "string" == typeof key && "$" === key.charAt(0) && "$" === key.charAt(1) ? val = undefined : isWindow(value) ? val = "$WINDOW" : value && document === value ? val = "$DOCUMENT" : isScope(value) && (val = "$SCOPE"), 
        val;
    }
    function toJson(obj, pretty) {
        return "undefined" == typeof obj ? undefined : (isNumber(pretty) || (pretty = pretty ? 2 : null), 
        JSON.stringify(obj, toJsonReplacer, pretty));
    }
    function fromJson(json) {
        return isString(json) ? JSON.parse(json) : json;
    }
    function startingTag(element) {
        element = jqLite(element).clone();
        try {
            element.empty();
        } catch (e) {}
        var elemHtml = jqLite("<div>").append(element).html();
        try {
            return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(match, nodeName) {
                return "<" + lowercase(nodeName);
            });
        } catch (e) {
            return lowercase(elemHtml);
        }
    }
    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {}
    }
    function parseKeyValue(keyValue) {
        var key_value, key, obj = {};
        return forEach((keyValue || "").split("&"), function(keyValue) {
            if (keyValue && (key_value = keyValue.replace(/\+/g, "%20").split("="), key = tryDecodeURIComponent(key_value[0]), 
            isDefined(key))) {
                var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : !0;
                hasOwnProperty.call(obj, key) ? isArray(obj[key]) ? obj[key].push(val) : obj[key] = [ obj[key], val ] : obj[key] = val;
            }
        }), obj;
    }
    function toKeyValue(obj) {
        var parts = [];
        return forEach(obj, function(value, key) {
            isArray(value) ? forEach(value, function(arrayValue) {
                parts.push(encodeUriQuery(key, !0) + (arrayValue === !0 ? "" : "=" + encodeUriQuery(arrayValue, !0)));
            }) : parts.push(encodeUriQuery(key, !0) + (value === !0 ? "" : "=" + encodeUriQuery(value, !0)));
        }), parts.length ? parts.join("&") : "";
    }
    function encodeUriSegment(val) {
        return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
    }
    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
    }
    function getNgAttribute(element, ngAttr) {
        var attr, i, ii = ngAttrPrefixes.length;
        for (element = jqLite(element), i = 0; ii > i; ++i) if (attr = ngAttrPrefixes[i] + ngAttr, 
        isString(attr = element.attr(attr))) return attr;
        return null;
    }
    function angularInit(element, bootstrap) {
        var appElement, module, config = {};
        forEach(ngAttrPrefixes, function(prefix) {
            var name = prefix + "app";
            !appElement && element.hasAttribute && element.hasAttribute(name) && (appElement = element, 
            module = element.getAttribute(name));
        }), forEach(ngAttrPrefixes, function(prefix) {
            var candidate, name = prefix + "app";
            !appElement && (candidate = element.querySelector("[" + name.replace(":", "\\:") + "]")) && (appElement = candidate, 
            module = candidate.getAttribute(name));
        }), appElement && (config.strictDi = null !== getNgAttribute(appElement, "strict-di"), 
        bootstrap(appElement, module ? [ module ] : [], config));
    }
    function bootstrap(element, modules, config) {
        isObject(config) || (config = {});
        var defaultConfig = {
            strictDi: !1
        };
        config = extend(defaultConfig, config);
        var doBootstrap = function() {
            if (element = jqLite(element), element.injector()) {
                var tag = element[0] === document ? "document" : startingTag(element);
                throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", tag.replace(/</, "&lt;").replace(/>/, "&gt;"));
            }
            modules = modules || [], modules.unshift([ "$provide", function($provide) {
                $provide.value("$rootElement", element);
            } ]), config.debugInfoEnabled && modules.push([ "$compileProvider", function($compileProvider) {
                $compileProvider.debugInfoEnabled(!0);
            } ]), modules.unshift("ng");
            var injector = createInjector(modules, config.strictDi);
            return injector.invoke([ "$rootScope", "$rootElement", "$compile", "$injector", function(scope, element, compile, injector) {
                scope.$apply(function() {
                    element.data("$injector", injector), compile(element)(scope);
                });
            } ]), injector;
        }, NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/, NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
        return window && NG_ENABLE_DEBUG_INFO.test(window.name) && (config.debugInfoEnabled = !0, 
        window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, "")), window && !NG_DEFER_BOOTSTRAP.test(window.name) ? doBootstrap() : (window.name = window.name.replace(NG_DEFER_BOOTSTRAP, ""), 
        void (angular.resumeBootstrap = function(extraModules) {
            forEach(extraModules, function(module) {
                modules.push(module);
            }), doBootstrap();
        }));
    }
    function reloadWithDebugInfo() {
        window.name = "NG_ENABLE_DEBUG_INFO!" + window.name, window.location.reload();
    }
    function getTestability(rootElement) {
        var injector = angular.element(rootElement).injector();
        if (!injector) throw ngMinErr("test", "no injector found for element argument to getTestability");
        return injector.get("$$testability");
    }
    function snake_case(name, separator) {
        return separator = separator || "_", name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
            return (pos ? separator : "") + letter.toLowerCase();
        });
    }
    function bindJQuery() {
        var originalCleanData;
        bindJQueryFired || (jQuery = window.jQuery, jQuery && jQuery.fn.on ? (jqLite = jQuery, 
        extend(jQuery.fn, {
            scope: JQLitePrototype.scope,
            isolateScope: JQLitePrototype.isolateScope,
            controller: JQLitePrototype.controller,
            injector: JQLitePrototype.injector,
            inheritedData: JQLitePrototype.inheritedData
        }), originalCleanData = jQuery.cleanData, jQuery.cleanData = function(elems) {
            var events;
            if (skipDestroyOnNextJQueryCleanData) skipDestroyOnNextJQueryCleanData = !1; else for (var elem, i = 0; null != (elem = elems[i]); i++) events = jQuery._data(elem, "events"), 
            events && events.$destroy && jQuery(elem).triggerHandler("$destroy");
            originalCleanData(elems);
        }) : jqLite = JQLite, angular.element = jqLite, bindJQueryFired = !0);
    }
    function assertArg(arg, name, reason) {
        if (!arg) throw ngMinErr("areq", "Argument '{0}' is {1}", name || "?", reason || "required");
        return arg;
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
        return acceptArrayAnnotation && isArray(arg) && (arg = arg[arg.length - 1]), assertArg(isFunction(arg), name, "not a function, got " + (arg && "object" == typeof arg ? arg.constructor.name || "Object" : typeof arg)), 
        arg;
    }
    function assertNotHasOwnProperty(name, context) {
        if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context);
    }
    function getter(obj, path, bindFnToScope) {
        if (!path) return obj;
        for (var key, keys = path.split("."), lastInstance = obj, len = keys.length, i = 0; len > i; i++) key = keys[i], 
        obj && (obj = (lastInstance = obj)[key]);
        return !bindFnToScope && isFunction(obj) ? bind(lastInstance, obj) : obj;
    }
    function getBlockNodes(nodes) {
        var node = nodes[0], endNode = nodes[nodes.length - 1], blockNodes = [ node ];
        do {
            if (node = node.nextSibling, !node) break;
            blockNodes.push(node);
        } while (node !== endNode);
        return jqLite(blockNodes);
    }
    function createMap() {
        return Object.create(null);
    }
    function setupModuleLoader(window) {
        function ensure(obj, name, factory) {
            return obj[name] || (obj[name] = factory());
        }
        var $injectorMinErr = minErr("$injector"), ngMinErr = minErr("ng"), angular = ensure(window, "angular", Object);
        return angular.$$minErr = angular.$$minErr || minErr, ensure(angular, "module", function() {
            var modules = {};
            return function(name, requires, configFn) {
                var assertNotHasOwnProperty = function(name, context) {
                    if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context);
                };
                return assertNotHasOwnProperty(name, "module"), requires && modules.hasOwnProperty(name) && (modules[name] = null), 
                ensure(modules, name, function() {
                    function invokeLater(provider, method, insertMethod, queue) {
                        return queue || (queue = invokeQueue), function() {
                            return queue[insertMethod || "push"]([ provider, method, arguments ]), moduleInstance;
                        };
                    }
                    if (!requires) throw $injectorMinErr("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", name);
                    var invokeQueue = [], configBlocks = [], runBlocks = [], config = invokeLater("$injector", "invoke", "push", configBlocks), moduleInstance = {
                        _invokeQueue: invokeQueue,
                        _configBlocks: configBlocks,
                        _runBlocks: runBlocks,
                        requires: requires,
                        name: name,
                        provider: invokeLater("$provide", "provider"),
                        factory: invokeLater("$provide", "factory"),
                        service: invokeLater("$provide", "service"),
                        value: invokeLater("$provide", "value"),
                        constant: invokeLater("$provide", "constant", "unshift"),
                        animation: invokeLater("$animateProvider", "register"),
                        filter: invokeLater("$filterProvider", "register"),
                        controller: invokeLater("$controllerProvider", "register"),
                        directive: invokeLater("$compileProvider", "directive"),
                        config: config,
                        run: function(block) {
                            return runBlocks.push(block), this;
                        }
                    };
                    return configFn && config(configFn), moduleInstance;
                });
            };
        });
    }
    function serializeObject(obj) {
        var seen = [];
        return JSON.stringify(obj, function(key, val) {
            if (val = toJsonReplacer(key, val), isObject(val)) {
                if (seen.indexOf(val) >= 0) return "<<already seen>>";
                seen.push(val);
            }
            return val;
        });
    }
    function toDebugString(obj) {
        return "function" == typeof obj ? obj.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof obj ? "undefined" : "string" != typeof obj ? serializeObject(obj) : obj;
    }
    function publishExternalAPI(angular) {
        extend(angular, {
            bootstrap: bootstrap,
            copy: copy,
            extend: extend,
            equals: equals,
            element: jqLite,
            forEach: forEach,
            injector: createInjector,
            noop: noop,
            bind: bind,
            toJson: toJson,
            fromJson: fromJson,
            identity: identity,
            isUndefined: isUndefined,
            isDefined: isDefined,
            isString: isString,
            isFunction: isFunction,
            isObject: isObject,
            isNumber: isNumber,
            isElement: isElement,
            isArray: isArray,
            version: version,
            isDate: isDate,
            lowercase: lowercase,
            uppercase: uppercase,
            callbacks: {
                counter: 0
            },
            getTestability: getTestability,
            $$minErr: minErr,
            $$csp: csp,
            reloadWithDebugInfo: reloadWithDebugInfo
        }), angularModule = setupModuleLoader(window);
        try {
            angularModule("ngLocale");
        } catch (e) {
            angularModule("ngLocale", []).provider("$locale", $LocaleProvider);
        }
        angularModule("ng", [ "ngLocale" ], [ "$provide", function($provide) {
            $provide.provider({
                $$sanitizeUri: $$SanitizeUriProvider
            }), $provide.provider("$compile", $CompileProvider).directive({
                a: htmlAnchorDirective,
                input: inputDirective,
                textarea: inputDirective,
                form: formDirective,
                script: scriptDirective,
                select: selectDirective,
                style: styleDirective,
                option: optionDirective,
                ngBind: ngBindDirective,
                ngBindHtml: ngBindHtmlDirective,
                ngBindTemplate: ngBindTemplateDirective,
                ngClass: ngClassDirective,
                ngClassEven: ngClassEvenDirective,
                ngClassOdd: ngClassOddDirective,
                ngCloak: ngCloakDirective,
                ngController: ngControllerDirective,
                ngForm: ngFormDirective,
                ngHide: ngHideDirective,
                ngIf: ngIfDirective,
                ngInclude: ngIncludeDirective,
                ngInit: ngInitDirective,
                ngNonBindable: ngNonBindableDirective,
                ngPluralize: ngPluralizeDirective,
                ngRepeat: ngRepeatDirective,
                ngShow: ngShowDirective,
                ngStyle: ngStyleDirective,
                ngSwitch: ngSwitchDirective,
                ngSwitchWhen: ngSwitchWhenDirective,
                ngSwitchDefault: ngSwitchDefaultDirective,
                ngOptions: ngOptionsDirective,
                ngTransclude: ngTranscludeDirective,
                ngModel: ngModelDirective,
                ngList: ngListDirective,
                ngChange: ngChangeDirective,
                pattern: patternDirective,
                ngPattern: patternDirective,
                required: requiredDirective,
                ngRequired: requiredDirective,
                minlength: minlengthDirective,
                ngMinlength: minlengthDirective,
                maxlength: maxlengthDirective,
                ngMaxlength: maxlengthDirective,
                ngValue: ngValueDirective,
                ngModelOptions: ngModelOptionsDirective
            }).directive({
                ngInclude: ngIncludeFillContentDirective
            }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives), $provide.provider({
                $anchorScroll: $AnchorScrollProvider,
                $animate: $AnimateProvider,
                $browser: $BrowserProvider,
                $cacheFactory: $CacheFactoryProvider,
                $controller: $ControllerProvider,
                $document: $DocumentProvider,
                $exceptionHandler: $ExceptionHandlerProvider,
                $filter: $FilterProvider,
                $interpolate: $InterpolateProvider,
                $interval: $IntervalProvider,
                $http: $HttpProvider,
                $httpBackend: $HttpBackendProvider,
                $location: $LocationProvider,
                $log: $LogProvider,
                $parse: $ParseProvider,
                $rootScope: $RootScopeProvider,
                $q: $QProvider,
                $$q: $$QProvider,
                $sce: $SceProvider,
                $sceDelegate: $SceDelegateProvider,
                $sniffer: $SnifferProvider,
                $templateCache: $TemplateCacheProvider,
                $templateRequest: $TemplateRequestProvider,
                $$testability: $$TestabilityProvider,
                $timeout: $TimeoutProvider,
                $window: $WindowProvider,
                $$rAF: $$RAFProvider,
                $$asyncCallback: $$AsyncCallbackProvider,
                $$jqLite: $$jqLiteProvider
            });
        } ]);
    }
    function jqNextId() {
        return ++jqId;
    }
    function camelCase(name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).replace(MOZ_HACK_REGEXP, "Moz$1");
    }
    function jqLiteIsTextNode(html) {
        return !HTML_REGEXP.test(html);
    }
    function jqLiteAcceptsData(node) {
        var nodeType = node.nodeType;
        return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
    }
    function jqLiteBuildFragment(html, context) {
        var tmp, tag, wrap, i, fragment = context.createDocumentFragment(), nodes = [];
        if (jqLiteIsTextNode(html)) nodes.push(context.createTextNode(html)); else {
            for (tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (TAG_NAME_REGEXP.exec(html) || [ "", "" ])[1].toLowerCase(), 
            wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2], 
            i = wrap[0]; i--; ) tmp = tmp.lastChild;
            nodes = concat(nodes, tmp.childNodes), tmp = fragment.firstChild, tmp.textContent = "";
        }
        return fragment.textContent = "", fragment.innerHTML = "", forEach(nodes, function(node) {
            fragment.appendChild(node);
        }), fragment;
    }
    function jqLiteParseHTML(html, context) {
        context = context || document;
        var parsed;
        return (parsed = SINGLE_TAG_REGEXP.exec(html)) ? [ context.createElement(parsed[1]) ] : (parsed = jqLiteBuildFragment(html, context)) ? parsed.childNodes : [];
    }
    function JQLite(element) {
        if (element instanceof JQLite) return element;
        var argIsString;
        if (isString(element) && (element = trim(element), argIsString = !0), !(this instanceof JQLite)) {
            if (argIsString && "<" != element.charAt(0)) throw jqLiteMinErr("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
            return new JQLite(element);
        }
        argIsString ? jqLiteAddNodes(this, jqLiteParseHTML(element)) : jqLiteAddNodes(this, element);
    }
    function jqLiteClone(element) {
        return element.cloneNode(!0);
    }
    function jqLiteDealoc(element, onlyDescendants) {
        if (onlyDescendants || jqLiteRemoveData(element), element.querySelectorAll) for (var descendants = element.querySelectorAll("*"), i = 0, l = descendants.length; l > i; i++) jqLiteRemoveData(descendants[i]);
    }
    function jqLiteOff(element, type, fn, unsupported) {
        if (isDefined(unsupported)) throw jqLiteMinErr("offargs", "jqLite#off() does not support the `selector` argument");
        var expandoStore = jqLiteExpandoStore(element), events = expandoStore && expandoStore.events, handle = expandoStore && expandoStore.handle;
        if (handle) if (type) forEach(type.split(" "), function(type) {
            if (isDefined(fn)) {
                var listenerFns = events[type];
                if (arrayRemove(listenerFns || [], fn), listenerFns && listenerFns.length > 0) return;
            }
            removeEventListenerFn(element, type, handle), delete events[type];
        }); else for (type in events) "$destroy" !== type && removeEventListenerFn(element, type, handle), 
        delete events[type];
    }
    function jqLiteRemoveData(element, name) {
        var expandoId = element.ng339, expandoStore = expandoId && jqCache[expandoId];
        if (expandoStore) {
            if (name) return void delete expandoStore.data[name];
            expandoStore.handle && (expandoStore.events.$destroy && expandoStore.handle({}, "$destroy"), 
            jqLiteOff(element)), delete jqCache[expandoId], element.ng339 = undefined;
        }
    }
    function jqLiteExpandoStore(element, createIfNecessary) {
        var expandoId = element.ng339, expandoStore = expandoId && jqCache[expandoId];
        return createIfNecessary && !expandoStore && (element.ng339 = expandoId = jqNextId(), 
        expandoStore = jqCache[expandoId] = {
            events: {},
            data: {},
            handle: undefined
        }), expandoStore;
    }
    function jqLiteData(element, key, value) {
        if (jqLiteAcceptsData(element)) {
            var isSimpleSetter = isDefined(value), isSimpleGetter = !isSimpleSetter && key && !isObject(key), massGetter = !key, expandoStore = jqLiteExpandoStore(element, !isSimpleGetter), data = expandoStore && expandoStore.data;
            if (isSimpleSetter) data[key] = value; else {
                if (massGetter) return data;
                if (isSimpleGetter) return data && data[key];
                extend(data, key);
            }
        }
    }
    function jqLiteHasClass(element, selector) {
        return element.getAttribute ? (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1 : !1;
    }
    function jqLiteRemoveClass(element, cssClasses) {
        cssClasses && element.setAttribute && forEach(cssClasses.split(" "), function(cssClass) {
            element.setAttribute("class", trim((" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + trim(cssClass) + " ", " ")));
        });
    }
    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            forEach(cssClasses.split(" "), function(cssClass) {
                cssClass = trim(cssClass), -1 === existingClasses.indexOf(" " + cssClass + " ") && (existingClasses += cssClass + " ");
            }), element.setAttribute("class", trim(existingClasses));
        }
    }
    function jqLiteAddNodes(root, elements) {
        if (elements) if (elements.nodeType) root[root.length++] = elements; else {
            var length = elements.length;
            if ("number" == typeof length && elements.window !== elements) {
                if (length) for (var i = 0; length > i; i++) root[root.length++] = elements[i];
            } else root[root.length++] = elements;
        }
    }
    function jqLiteController(element, name) {
        return jqLiteInheritedData(element, "$" + (name || "ngController") + "Controller");
    }
    function jqLiteInheritedData(element, name, value) {
        element.nodeType == NODE_TYPE_DOCUMENT && (element = element.documentElement);
        for (var names = isArray(name) ? name : [ name ]; element; ) {
            for (var i = 0, ii = names.length; ii > i; i++) if ((value = jqLite.data(element, names[i])) !== undefined) return value;
            element = element.parentNode || element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host;
        }
    }
    function jqLiteEmpty(element) {
        for (jqLiteDealoc(element, !0); element.firstChild; ) element.removeChild(element.firstChild);
    }
    function jqLiteRemove(element, keepData) {
        keepData || jqLiteDealoc(element);
        var parent = element.parentNode;
        parent && parent.removeChild(element);
    }
    function jqLiteDocumentLoaded(action, win) {
        win = win || window, "complete" === win.document.readyState ? win.setTimeout(action) : jqLite(win).on("load", action);
    }
    function getBooleanAttrName(element, name) {
        var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
        return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
    }
    function getAliasedAttrName(element, name) {
        var nodeName = element.nodeName;
        return ("INPUT" === nodeName || "TEXTAREA" === nodeName) && ALIASED_ATTR[name];
    }
    function createEventHandler(element, events) {
        var eventHandler = function(event, type) {
            event.isDefaultPrevented = function() {
                return event.defaultPrevented;
            };
            var eventFns = events[type || event.type], eventFnsLength = eventFns ? eventFns.length : 0;
            if (eventFnsLength) {
                if (isUndefined(event.immediatePropagationStopped)) {
                    var originalStopImmediatePropagation = event.stopImmediatePropagation;
                    event.stopImmediatePropagation = function() {
                        event.immediatePropagationStopped = !0, event.stopPropagation && event.stopPropagation(), 
                        originalStopImmediatePropagation && originalStopImmediatePropagation.call(event);
                    };
                }
                event.isImmediatePropagationStopped = function() {
                    return event.immediatePropagationStopped === !0;
                }, eventFnsLength > 1 && (eventFns = shallowCopy(eventFns));
                for (var i = 0; eventFnsLength > i; i++) event.isImmediatePropagationStopped() || eventFns[i].call(element, event);
            }
        };
        return eventHandler.elem = element, eventHandler;
    }
    function $$jqLiteProvider() {
        this.$get = function() {
            return extend(JQLite, {
                hasClass: function(node, classes) {
                    return node.attr && (node = node[0]), jqLiteHasClass(node, classes);
                },
                addClass: function(node, classes) {
                    return node.attr && (node = node[0]), jqLiteAddClass(node, classes);
                },
                removeClass: function(node, classes) {
                    return node.attr && (node = node[0]), jqLiteRemoveClass(node, classes);
                }
            });
        };
    }
    function hashKey(obj, nextUidFn) {
        var key = obj && obj.$$hashKey;
        if (key) return "function" == typeof key && (key = obj.$$hashKey()), key;
        var objType = typeof obj;
        return key = "function" == objType || "object" == objType && null !== obj ? obj.$$hashKey = objType + ":" + (nextUidFn || nextUid)() : objType + ":" + obj;
    }
    function HashMap(array, isolatedUid) {
        if (isolatedUid) {
            var uid = 0;
            this.nextUid = function() {
                return ++uid;
            };
        }
        forEach(array, this.put, this);
    }
    function anonFn(fn) {
        var fnText = fn.toString().replace(STRIP_COMMENTS, ""), args = fnText.match(FN_ARGS);
        return args ? "function(" + (args[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn";
    }
    function annotate(fn, strictDi, name) {
        var $inject, fnText, argDecl, last;
        if ("function" == typeof fn) {
            if (!($inject = fn.$inject)) {
                if ($inject = [], fn.length) {
                    if (strictDi) throw isString(name) && name || (name = fn.name || anonFn(fn)), $injectorMinErr("strictdi", "{0} is not using explicit annotation and cannot be invoked in strict mode", name);
                    fnText = fn.toString().replace(STRIP_COMMENTS, ""), argDecl = fnText.match(FN_ARGS), 
                    forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
                        arg.replace(FN_ARG, function(all, underscore, name) {
                            $inject.push(name);
                        });
                    });
                }
                fn.$inject = $inject;
            }
        } else isArray(fn) ? (last = fn.length - 1, assertArgFn(fn[last], "fn"), $inject = fn.slice(0, last)) : assertArgFn(fn, "fn", !0);
        return $inject;
    }
    function createInjector(modulesToLoad, strictDi) {
        function supportObject(delegate) {
            return function(key, value) {
                return isObject(key) ? void forEach(key, reverseParams(delegate)) : delegate(key, value);
            };
        }
        function provider(name, provider_) {
            if (assertNotHasOwnProperty(name, "service"), (isFunction(provider_) || isArray(provider_)) && (provider_ = providerInjector.instantiate(provider_)), 
            !provider_.$get) throw $injectorMinErr("pget", "Provider '{0}' must define $get factory method.", name);
            return providerCache[name + providerSuffix] = provider_;
        }
        function enforceReturnValue(name, factory) {
            return function() {
                var result = instanceInjector.invoke(factory, this);
                if (isUndefined(result)) throw $injectorMinErr("undef", "Provider '{0}' must return a value from $get factory method.", name);
                return result;
            };
        }
        function factory(name, factoryFn, enforce) {
            return provider(name, {
                $get: enforce !== !1 ? enforceReturnValue(name, factoryFn) : factoryFn
            });
        }
        function service(name, constructor) {
            return factory(name, [ "$injector", function($injector) {
                return $injector.instantiate(constructor);
            } ]);
        }
        function value(name, val) {
            return factory(name, valueFn(val), !1);
        }
        function constant(name, value) {
            assertNotHasOwnProperty(name, "constant"), providerCache[name] = value, instanceCache[name] = value;
        }
        function decorator(serviceName, decorFn) {
            var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
            origProvider.$get = function() {
                var origInstance = instanceInjector.invoke(orig$get, origProvider);
                return instanceInjector.invoke(decorFn, null, {
                    $delegate: origInstance
                });
            };
        }
        function loadModules(modulesToLoad) {
            var moduleFn, runBlocks = [];
            return forEach(modulesToLoad, function(module) {
                function runInvokeQueue(queue) {
                    var i, ii;
                    for (i = 0, ii = queue.length; ii > i; i++) {
                        var invokeArgs = queue[i], provider = providerInjector.get(invokeArgs[0]);
                        provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                    }
                }
                if (!loadedModules.get(module)) {
                    loadedModules.put(module, !0);
                    try {
                        isString(module) ? (moduleFn = angularModule(module), runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks), 
                        runInvokeQueue(moduleFn._invokeQueue), runInvokeQueue(moduleFn._configBlocks)) : isFunction(module) ? runBlocks.push(providerInjector.invoke(module)) : isArray(module) ? runBlocks.push(providerInjector.invoke(module)) : assertArgFn(module, "module");
                    } catch (e) {
                        throw isArray(module) && (module = module[module.length - 1]), e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), 
                        $injectorMinErr("modulerr", "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e);
                    }
                }
            }), runBlocks;
        }
        function createInternalInjector(cache, factory) {
            function getService(serviceName, caller) {
                if (cache.hasOwnProperty(serviceName)) {
                    if (cache[serviceName] === INSTANTIATING) throw $injectorMinErr("cdep", "Circular dependency found: {0}", serviceName + " <- " + path.join(" <- "));
                    return cache[serviceName];
                }
                try {
                    return path.unshift(serviceName), cache[serviceName] = INSTANTIATING, cache[serviceName] = factory(serviceName, caller);
                } catch (err) {
                    throw cache[serviceName] === INSTANTIATING && delete cache[serviceName], err;
                } finally {
                    path.shift();
                }
            }
            function invoke(fn, self, locals, serviceName) {
                "string" == typeof locals && (serviceName = locals, locals = null);
                var length, i, key, args = [], $inject = annotate(fn, strictDi, serviceName);
                for (i = 0, length = $inject.length; length > i; i++) {
                    if (key = $inject[i], "string" != typeof key) throw $injectorMinErr("itkn", "Incorrect injection token! Expected service name as string, got {0}", key);
                    args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key, serviceName));
                }
                return isArray(fn) && (fn = fn[length]), fn.apply(self, args);
            }
            function instantiate(Type, locals, serviceName) {
                var instance = Object.create((isArray(Type) ? Type[Type.length - 1] : Type).prototype || null), returnedValue = invoke(Type, instance, locals, serviceName);
                return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
            }
            return {
                invoke: invoke,
                instantiate: instantiate,
                get: getService,
                annotate: annotate,
                has: function(name) {
                    return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
                }
            };
        }
        strictDi = strictDi === !0;
        var INSTANTIATING = {}, providerSuffix = "Provider", path = [], loadedModules = new HashMap([], !0), providerCache = {
            $provide: {
                provider: supportObject(provider),
                factory: supportObject(factory),
                service: supportObject(service),
                value: supportObject(value),
                constant: supportObject(constant),
                decorator: decorator
            }
        }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function(serviceName, caller) {
            throw angular.isString(caller) && path.push(caller), $injectorMinErr("unpr", "Unknown provider: {0}", path.join(" <- "));
        }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function(serviceName, caller) {
            var provider = providerInjector.get(serviceName + providerSuffix, caller);
            return instanceInjector.invoke(provider.$get, provider, undefined, serviceName);
        });
        return forEach(loadModules(modulesToLoad), function(fn) {
            instanceInjector.invoke(fn || noop);
        }), instanceInjector;
    }
    function $AnchorScrollProvider() {
        var autoScrollingEnabled = !0;
        this.disableAutoScrolling = function() {
            autoScrollingEnabled = !1;
        }, this.$get = [ "$window", "$location", "$rootScope", function($window, $location, $rootScope) {
            function getFirstAnchor(list) {
                var result = null;
                return Array.prototype.some.call(list, function(element) {
                    return "a" === nodeName_(element) ? (result = element, !0) : void 0;
                }), result;
            }
            function getYOffset() {
                var offset = scroll.yOffset;
                if (isFunction(offset)) offset = offset(); else if (isElement(offset)) {
                    var elem = offset[0], style = $window.getComputedStyle(elem);
                    offset = "fixed" !== style.position ? 0 : elem.getBoundingClientRect().bottom;
                } else isNumber(offset) || (offset = 0);
                return offset;
            }
            function scrollTo(elem) {
                if (elem) {
                    elem.scrollIntoView();
                    var offset = getYOffset();
                    if (offset) {
                        var elemTop = elem.getBoundingClientRect().top;
                        $window.scrollBy(0, elemTop - offset);
                    }
                } else $window.scrollTo(0, 0);
            }
            function scroll() {
                var elm, hash = $location.hash();
                hash ? (elm = document.getElementById(hash)) ? scrollTo(elm) : (elm = getFirstAnchor(document.getElementsByName(hash))) ? scrollTo(elm) : "top" === hash && scrollTo(null) : scrollTo(null);
            }
            var document = $window.document;
            return autoScrollingEnabled && $rootScope.$watch(function() {
                return $location.hash();
            }, function(newVal, oldVal) {
                (newVal !== oldVal || "" !== newVal) && jqLiteDocumentLoaded(function() {
                    $rootScope.$evalAsync(scroll);
                });
            }), scroll;
        } ];
    }
    function $$AsyncCallbackProvider() {
        this.$get = [ "$$rAF", "$timeout", function($$rAF, $timeout) {
            return $$rAF.supported ? function(fn) {
                return $$rAF(fn);
            } : function(fn) {
                return $timeout(fn, 0, !1);
            };
        } ];
    }
    function Browser(window, document, $log, $sniffer) {
        function completeOutstandingRequest(fn) {
            try {
                fn.apply(null, sliceArgs(arguments, 1));
            } finally {
                if (outstandingRequestCount--, 0 === outstandingRequestCount) for (;outstandingRequestCallbacks.length; ) try {
                    outstandingRequestCallbacks.pop()();
                } catch (e) {
                    $log.error(e);
                }
            }
        }
        function getHash(url) {
            var index = url.indexOf("#");
            return -1 === index ? "" : url.substr(index + 1);
        }
        function startPoller(interval, setTimeout) {
            !function check() {
                forEach(pollFns, function(pollFn) {
                    pollFn();
                }), pollTimeout = setTimeout(check, interval);
            }();
        }
        function cacheStateAndFireUrlChange() {
            cacheState(), fireUrlChange();
        }
        function cacheState() {
            cachedState = window.history.state, cachedState = isUndefined(cachedState) ? null : cachedState, 
            equals(cachedState, lastCachedState) && (cachedState = lastCachedState), lastCachedState = cachedState;
        }
        function fireUrlChange() {
            (lastBrowserUrl !== self.url() || lastHistoryState !== cachedState) && (lastBrowserUrl = self.url(), 
            lastHistoryState = cachedState, forEach(urlChangeListeners, function(listener) {
                listener(self.url(), cachedState);
            }));
        }
        function safeDecodeURIComponent(str) {
            try {
                return decodeURIComponent(str);
            } catch (e) {
                return str;
            }
        }
        var self = this, rawDocument = document[0], location = window.location, history = window.history, setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, pendingDeferIds = {};
        self.isMock = !1;
        var outstandingRequestCount = 0, outstandingRequestCallbacks = [];
        self.$$completeOutstandingRequest = completeOutstandingRequest, self.$$incOutstandingRequestCount = function() {
            outstandingRequestCount++;
        }, self.notifyWhenNoOutstandingRequests = function(callback) {
            forEach(pollFns, function(pollFn) {
                pollFn();
            }), 0 === outstandingRequestCount ? callback() : outstandingRequestCallbacks.push(callback);
        };
        var pollTimeout, pollFns = [];
        self.addPollFn = function(fn) {
            return isUndefined(pollTimeout) && startPoller(100, setTimeout), pollFns.push(fn), 
            fn;
        };
        var cachedState, lastHistoryState, lastBrowserUrl = location.href, baseElement = document.find("base"), reloadLocation = null;
        cacheState(), lastHistoryState = cachedState, self.url = function(url, replace, state) {
            if (isUndefined(state) && (state = null), location !== window.location && (location = window.location), 
            history !== window.history && (history = window.history), url) {
                var sameState = lastHistoryState === state;
                if (lastBrowserUrl === url && (!$sniffer.history || sameState)) return self;
                var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
                return lastBrowserUrl = url, lastHistoryState = state, !$sniffer.history || sameBase && sameState ? (sameBase || (reloadLocation = url), 
                replace ? location.replace(url) : sameBase ? location.hash = getHash(url) : location.href = url) : (history[replace ? "replaceState" : "pushState"](state, "", url), 
                cacheState(), lastHistoryState = cachedState), self;
            }
            return reloadLocation || location.href.replace(/%27/g, "'");
        }, self.state = function() {
            return cachedState;
        };
        var urlChangeListeners = [], urlChangeInit = !1, lastCachedState = null;
        self.onUrlChange = function(callback) {
            return urlChangeInit || ($sniffer.history && jqLite(window).on("popstate", cacheStateAndFireUrlChange), 
            jqLite(window).on("hashchange", cacheStateAndFireUrlChange), urlChangeInit = !0), 
            urlChangeListeners.push(callback), callback;
        }, self.$$checkUrlChange = fireUrlChange, self.baseHref = function() {
            var href = baseElement.attr("href");
            return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, "") : "";
        };
        var lastCookies = {}, lastCookieString = "", cookiePath = self.baseHref();
        self.cookies = function(name, value) {
            var cookieLength, cookieArray, cookie, i, index;
            if (!name) {
                if (rawDocument.cookie !== lastCookieString) for (lastCookieString = rawDocument.cookie, 
                cookieArray = lastCookieString.split("; "), lastCookies = {}, i = 0; i < cookieArray.length; i++) cookie = cookieArray[i], 
                index = cookie.indexOf("="), index > 0 && (name = safeDecodeURIComponent(cookie.substring(0, index)), 
                lastCookies[name] === undefined && (lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1))));
                return lastCookies;
            }
            value === undefined ? rawDocument.cookie = encodeURIComponent(name) + "=;path=" + cookiePath + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : isString(value) && (cookieLength = (rawDocument.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";path=" + cookiePath).length + 1, 
            cookieLength > 4096 && $log.warn("Cookie '" + name + "' possibly not set or overflowed because it was too large (" + cookieLength + " > 4096 bytes)!"));
        }, self.defer = function(fn, delay) {
            var timeoutId;
            return outstandingRequestCount++, timeoutId = setTimeout(function() {
                delete pendingDeferIds[timeoutId], completeOutstandingRequest(fn);
            }, delay || 0), pendingDeferIds[timeoutId] = !0, timeoutId;
        }, self.defer.cancel = function(deferId) {
            return pendingDeferIds[deferId] ? (delete pendingDeferIds[deferId], clearTimeout(deferId), 
            completeOutstandingRequest(noop), !0) : !1;
        };
    }
    function $BrowserProvider() {
        this.$get = [ "$window", "$log", "$sniffer", "$document", function($window, $log, $sniffer, $document) {
            return new Browser($window, $document, $log, $sniffer);
        } ];
    }
    function $CacheFactoryProvider() {
        this.$get = function() {
            function cacheFactory(cacheId, options) {
                function refresh(entry) {
                    entry != freshEnd && (staleEnd ? staleEnd == entry && (staleEnd = entry.n) : staleEnd = entry, 
                    link(entry.n, entry.p), link(entry, freshEnd), freshEnd = entry, freshEnd.n = null);
                }
                function link(nextEntry, prevEntry) {
                    nextEntry != prevEntry && (nextEntry && (nextEntry.p = prevEntry), prevEntry && (prevEntry.n = nextEntry));
                }
                if (cacheId in caches) throw minErr("$cacheFactory")("iid", "CacheId '{0}' is already taken!", cacheId);
                var size = 0, stats = extend({}, options, {
                    id: cacheId
                }), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
                return caches[cacheId] = {
                    put: function(key, value) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key] || (lruHash[key] = {
                                key: key
                            });
                            refresh(lruEntry);
                        }
                        if (!isUndefined(value)) return key in data || size++, data[key] = value, size > capacity && this.remove(staleEnd.key), 
                        value;
                    },
                    get: function(key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry) return;
                            refresh(lruEntry);
                        }
                        return data[key];
                    },
                    remove: function(key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry) return;
                            lruEntry == freshEnd && (freshEnd = lruEntry.p), lruEntry == staleEnd && (staleEnd = lruEntry.n), 
                            link(lruEntry.n, lruEntry.p), delete lruHash[key];
                        }
                        delete data[key], size--;
                    },
                    removeAll: function() {
                        data = {}, size = 0, lruHash = {}, freshEnd = staleEnd = null;
                    },
                    destroy: function() {
                        data = null, stats = null, lruHash = null, delete caches[cacheId];
                    },
                    info: function() {
                        return extend({}, stats, {
                            size: size
                        });
                    }
                };
            }
            var caches = {};
            return cacheFactory.info = function() {
                var info = {};
                return forEach(caches, function(cache, cacheId) {
                    info[cacheId] = cache.info();
                }), info;
            }, cacheFactory.get = function(cacheId) {
                return caches[cacheId];
            }, cacheFactory;
        };
    }
    function $TemplateCacheProvider() {
        this.$get = [ "$cacheFactory", function($cacheFactory) {
            return $cacheFactory("templates");
        } ];
    }
    function $CompileProvider($provide, $$sanitizeUriProvider) {
        function parseIsolateBindings(scope, directiveName) {
            var LOCAL_REGEXP = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/, bindings = {};
            return forEach(scope, function(definition, scopeName) {
                var match = definition.match(LOCAL_REGEXP);
                if (!match) throw $compileMinErr("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", directiveName, scopeName, definition);
                bindings[scopeName] = {
                    mode: match[1][0],
                    collection: "*" === match[2],
                    optional: "?" === match[3],
                    attrName: match[4] || scopeName
                };
            }), bindings;
        }
        var hasDirectives = {}, Suffix = "Directive", COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\w\-]+)(?:\:([^;]+))?;?)/, ALL_OR_NOTHING_ATTRS = makeMap("ngSrc,ngSrcset,src,srcset"), REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/, EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
        this.directive = function registerDirective(name, directiveFactory) {
            return assertNotHasOwnProperty(name, "directive"), isString(name) ? (assertArg(directiveFactory, "directiveFactory"), 
            hasDirectives.hasOwnProperty(name) || (hasDirectives[name] = [], $provide.factory(name + Suffix, [ "$injector", "$exceptionHandler", function($injector, $exceptionHandler) {
                var directives = [];
                return forEach(hasDirectives[name], function(directiveFactory, index) {
                    try {
                        var directive = $injector.invoke(directiveFactory);
                        isFunction(directive) ? directive = {
                            compile: valueFn(directive)
                        } : !directive.compile && directive.link && (directive.compile = valueFn(directive.link)), 
                        directive.priority = directive.priority || 0, directive.index = index, directive.name = directive.name || name, 
                        directive.require = directive.require || directive.controller && directive.name, 
                        directive.restrict = directive.restrict || "EA", isObject(directive.scope) && (directive.$$isolateBindings = parseIsolateBindings(directive.scope, directive.name)), 
                        directives.push(directive);
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                }), directives;
            } ])), hasDirectives[name].push(directiveFactory)) : forEach(name, reverseParams(registerDirective)), 
            this;
        }, this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp), 
            this) : $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }, this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp), 
            this) : $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        };
        var debugInfoEnabled = !0;
        this.debugInfoEnabled = function(enabled) {
            return isDefined(enabled) ? (debugInfoEnabled = enabled, this) : debugInfoEnabled;
        }, this.$get = [ "$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function($injector, $interpolate, $exceptionHandler, $templateRequest, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
            function safeAddClass($element, className) {
                try {
                    $element.addClass(className);
                } catch (e) {}
            }
            function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
                $compileNodes instanceof jqLite || ($compileNodes = jqLite($compileNodes)), forEach($compileNodes, function(node, index) {
                    node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/) && ($compileNodes[index] = jqLite(node).wrap("<span></span>").parent()[0]);
                });
                var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
                compile.$$addScopeClass($compileNodes);
                var namespace = null;
                return function(scope, cloneConnectFn, options) {
                    assertArg(scope, "scope"), options = options || {};
                    var parentBoundTranscludeFn = options.parentBoundTranscludeFn, transcludeControllers = options.transcludeControllers, futureParentElement = options.futureParentElement;
                    parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude && (parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude), 
                    namespace || (namespace = detectNamespaceForChildElements(futureParentElement));
                    var $linkNode;
                    if ($linkNode = "html" !== namespace ? jqLite(wrapTemplate(namespace, jqLite("<div>").append($compileNodes).html())) : cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes, 
                    transcludeControllers) for (var controllerName in transcludeControllers) $linkNode.data("$" + controllerName + "Controller", transcludeControllers[controllerName].instance);
                    return compile.$$addScopeInfo($linkNode, scope), cloneConnectFn && cloneConnectFn($linkNode, scope), 
                    compositeLinkFn && compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn), 
                    $linkNode;
                };
            }
            function detectNamespaceForChildElements(parentElement) {
                var node = parentElement && parentElement[0];
                return node && "foreignobject" !== nodeName_(node) && node.toString().match(/SVG/) ? "svg" : "html";
            }
            function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
                function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
                    var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn, stableNodeList;
                    if (nodeLinkFnFound) {
                        var nodeListLength = nodeList.length;
                        for (stableNodeList = new Array(nodeListLength), i = 0; i < linkFns.length; i += 3) idx = linkFns[i], 
                        stableNodeList[idx] = nodeList[idx];
                    } else stableNodeList = nodeList;
                    for (i = 0, ii = linkFns.length; ii > i; ) node = stableNodeList[linkFns[i++]], 
                    nodeLinkFn = linkFns[i++], childLinkFn = linkFns[i++], nodeLinkFn ? (nodeLinkFn.scope ? (childScope = scope.$new(), 
                    compile.$$addScopeInfo(jqLite(node), childScope)) : childScope = scope, childBoundTranscludeFn = nodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, nodeLinkFn.transclude, parentBoundTranscludeFn, nodeLinkFn.elementTranscludeOnThisElement) : !nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn ? parentBoundTranscludeFn : !parentBoundTranscludeFn && transcludeFn ? createBoundTranscludeFn(scope, transcludeFn) : null, 
                    nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn)) : childLinkFn && childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
                }
                for (var attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound, linkFns = [], i = 0; i < nodeList.length; i++) attrs = new Attributes(), 
                directives = collectDirectives(nodeList[i], [], attrs, 0 === i ? maxPriority : undefined, ignoreDirective), 
                nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null, 
                nodeLinkFn && nodeLinkFn.scope && compile.$$addScopeClass(attrs.$$element), childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude : transcludeFn), 
                (nodeLinkFn || childLinkFn) && (linkFns.push(i, nodeLinkFn, childLinkFn), linkFnFound = !0, 
                nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn), previousCompileContext = null;
                return linkFnFound ? compositeLinkFn : null;
            }
            function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn) {
                var boundTranscludeFn = function(transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
                    return transcludedScope || (transcludedScope = scope.$new(!1, containingScope), 
                    transcludedScope.$$transcluded = !0), transcludeFn(transcludedScope, cloneFn, {
                        parentBoundTranscludeFn: previousBoundTranscludeFn,
                        transcludeControllers: controllers,
                        futureParentElement: futureParentElement
                    });
                };
                return boundTranscludeFn;
            }
            function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                var match, className, nodeType = node.nodeType, attrsMap = attrs.$attr;
                switch (nodeType) {
                  case NODE_TYPE_ELEMENT:
                    addDirective(directives, directiveNormalize(nodeName_(node)), "E", maxPriority, ignoreDirective);
                    for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; jj > j; j++) {
                        var attrStartName = !1, attrEndName = !1;
                        attr = nAttrs[j], name = attr.name, value = trim(attr.value), ngAttrName = directiveNormalize(name), 
                        (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) && (name = name.replace(PREFIX_REGEXP, "").substr(8).replace(/_(.)/g, function(match, letter) {
                            return letter.toUpperCase();
                        }));
                        var directiveNName = ngAttrName.replace(/(Start|End)$/, "");
                        directiveIsMultiElement(directiveNName) && ngAttrName === directiveNName + "Start" && (attrStartName = name, 
                        attrEndName = name.substr(0, name.length - 5) + "end", name = name.substr(0, name.length - 6)), 
                        nName = directiveNormalize(name.toLowerCase()), attrsMap[nName] = name, (isNgAttr || !attrs.hasOwnProperty(nName)) && (attrs[nName] = value, 
                        getBooleanAttrName(node, nName) && (attrs[nName] = !0)), addAttrInterpolateDirective(node, directives, value, nName, isNgAttr), 
                        addDirective(directives, nName, "A", maxPriority, ignoreDirective, attrStartName, attrEndName);
                    }
                    if (className = node.className, isObject(className) && (className = className.animVal), 
                    isString(className) && "" !== className) for (;match = CLASS_DIRECTIVE_REGEXP.exec(className); ) nName = directiveNormalize(match[2]), 
                    addDirective(directives, nName, "C", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[3])), 
                    className = className.substr(match.index + match[0].length);
                    break;

                  case NODE_TYPE_TEXT:
                    addTextInterpolateDirective(directives, node.nodeValue);
                    break;

                  case NODE_TYPE_COMMENT:
                    try {
                        match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue), match && (nName = directiveNormalize(match[1]), 
                        addDirective(directives, nName, "M", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[2])));
                    } catch (e) {}
                }
                return directives.sort(byPriority), directives;
            }
            function groupScan(node, attrStart, attrEnd) {
                var nodes = [], depth = 0;
                if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
                    do {
                        if (!node) throw $compileMinErr("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
                        node.nodeType == NODE_TYPE_ELEMENT && (node.hasAttribute(attrStart) && depth++, 
                        node.hasAttribute(attrEnd) && depth--), nodes.push(node), node = node.nextSibling;
                    } while (depth > 0);
                } else nodes.push(node);
                return jqLite(nodes);
            }
            function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                return function(scope, element, attrs, controllers, transcludeFn) {
                    return element = groupScan(element[0], attrStart, attrEnd), linkFn(scope, element, attrs, controllers, transcludeFn);
                };
            }
            function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
                function addLinkFns(pre, post, attrStart, attrEnd) {
                    pre && (attrStart && (pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd)), 
                    pre.require = directive.require, pre.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (pre = cloneAndAnnotateFn(pre, {
                        isolateScope: !0
                    })), preLinkFns.push(pre)), post && (attrStart && (post = groupElementsLinkFnWrapper(post, attrStart, attrEnd)), 
                    post.require = directive.require, post.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (post = cloneAndAnnotateFn(post, {
                        isolateScope: !0
                    })), postLinkFns.push(post));
                }
                function getControllers(directiveName, require, $element, elementControllers) {
                    var value, match, retrievalMethod = "data", optional = !1, $searchElement = $element;
                    if (isString(require)) {
                        if (match = require.match(REQUIRE_PREFIX_REGEXP), require = require.substring(match[0].length), 
                        match[3] && (match[1] ? match[3] = null : match[1] = match[3]), "^" === match[1] ? retrievalMethod = "inheritedData" : "^^" === match[1] && (retrievalMethod = "inheritedData", 
                        $searchElement = $element.parent()), "?" === match[2] && (optional = !0), value = null, 
                        elementControllers && "data" === retrievalMethod && (value = elementControllers[require]) && (value = value.instance), 
                        value = value || $searchElement[retrievalMethod]("$" + require + "Controller"), 
                        !value && !optional) throw $compileMinErr("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", require, directiveName);
                        return value || null;
                    }
                    return isArray(require) && (value = [], forEach(require, function(require) {
                        value.push(getControllers(directiveName, require, $element, elementControllers));
                    })), value;
                }
                function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
                    function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
                        var transcludeControllers;
                        return isScope(scope) || (futureParentElement = cloneAttachFn, cloneAttachFn = scope, 
                        scope = undefined), hasElementTranscludeDirective && (transcludeControllers = elementControllers), 
                        futureParentElement || (futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element), 
                        boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
                    }
                    var i, ii, linkFn, controller, isolateScope, elementControllers, transcludeFn, $element, attrs;
                    if (compileNode === linkNode ? (attrs = templateAttrs, $element = templateAttrs.$$element) : ($element = jqLite(linkNode), 
                    attrs = new Attributes($element, templateAttrs)), newIsolateScopeDirective && (isolateScope = scope.$new(!0)), 
                    boundTranscludeFn && (transcludeFn = controllersBoundTransclude, transcludeFn.$$boundTransclude = boundTranscludeFn), 
                    controllerDirectives && (controllers = {}, elementControllers = {}, forEach(controllerDirectives, function(directive) {
                        var controllerInstance, locals = {
                            $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                            $element: $element,
                            $attrs: attrs,
                            $transclude: transcludeFn
                        };
                        controller = directive.controller, "@" == controller && (controller = attrs[directive.name]), 
                        controllerInstance = $controller(controller, locals, !0, directive.controllerAs), 
                        elementControllers[directive.name] = controllerInstance, hasElementTranscludeDirective || $element.data("$" + directive.name + "Controller", controllerInstance.instance), 
                        controllers[directive.name] = controllerInstance;
                    })), newIsolateScopeDirective) {
                        compile.$$addScopeInfo($element, isolateScope, !0, !(templateDirective && (templateDirective === newIsolateScopeDirective || templateDirective === newIsolateScopeDirective.$$originalDirective))), 
                        compile.$$addScopeClass($element, !0);
                        var isolateScopeController = controllers && controllers[newIsolateScopeDirective.name], isolateBindingContext = isolateScope;
                        isolateScopeController && isolateScopeController.identifier && newIsolateScopeDirective.bindToController === !0 && (isolateBindingContext = isolateScopeController.instance), 
                        forEach(isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings, function(definition, scopeName) {
                            var lastValue, parentGet, parentSet, compare, attrName = definition.attrName, optional = definition.optional, mode = definition.mode;
                            switch (mode) {
                              case "@":
                                attrs.$observe(attrName, function(value) {
                                    isolateBindingContext[scopeName] = value;
                                }), attrs.$$observers[attrName].$$scope = scope, attrs[attrName] && (isolateBindingContext[scopeName] = $interpolate(attrs[attrName])(scope));
                                break;

                              case "=":
                                if (optional && !attrs[attrName]) return;
                                parentGet = $parse(attrs[attrName]), compare = parentGet.literal ? equals : function(a, b) {
                                    return a === b || a !== a && b !== b;
                                }, parentSet = parentGet.assign || function() {
                                    throw lastValue = isolateBindingContext[scopeName] = parentGet(scope), $compileMinErr("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], newIsolateScopeDirective.name);
                                }, lastValue = isolateBindingContext[scopeName] = parentGet(scope);
                                var parentValueWatch = function(parentValue) {
                                    return compare(parentValue, isolateBindingContext[scopeName]) || (compare(parentValue, lastValue) ? parentSet(scope, parentValue = isolateBindingContext[scopeName]) : isolateBindingContext[scopeName] = parentValue), 
                                    lastValue = parentValue;
                                };
                                parentValueWatch.$stateful = !0;
                                var unwatch;
                                unwatch = definition.collection ? scope.$watchCollection(attrs[attrName], parentValueWatch) : scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal), 
                                isolateScope.$on("$destroy", unwatch);
                                break;

                              case "&":
                                parentGet = $parse(attrs[attrName]), isolateBindingContext[scopeName] = function(locals) {
                                    return parentGet(scope, locals);
                                };
                            }
                        });
                    }
                    for (controllers && (forEach(controllers, function(controller) {
                        controller();
                    }), controllers = null), i = 0, ii = preLinkFns.length; ii > i; i++) linkFn = preLinkFns[i], 
                    invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
                    var scopeToChild = scope;
                    for (newIsolateScopeDirective && (newIsolateScopeDirective.template || null === newIsolateScopeDirective.templateUrl) && (scopeToChild = isolateScope), 
                    childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn), 
                    i = postLinkFns.length - 1; i >= 0; i--) linkFn = postLinkFns[i], invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
                }
                previousCompileContext = previousCompileContext || {};
                for (var newScopeDirective, controllers, directive, directiveName, $template, linkFn, directiveValue, terminalPriority = -Number.MAX_VALUE, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = !1, hasTemplate = !1, hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective, $compileNode = templateAttrs.$$element = jqLite(compileNode), replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, i = 0, ii = directives.length; ii > i; i++) {
                    directive = directives[i];
                    var attrStart = directive.$$start, attrEnd = directive.$$end;
                    if (attrStart && ($compileNode = groupScan(compileNode, attrStart, attrEnd)), $template = undefined, 
                    terminalPriority > directive.priority) break;
                    if ((directiveValue = directive.scope) && (directive.templateUrl || (isObject(directiveValue) ? (assertNoDuplicate("new/isolated scope", newIsolateScopeDirective || newScopeDirective, directive, $compileNode), 
                    newIsolateScopeDirective = directive) : assertNoDuplicate("new/isolated scope", newIsolateScopeDirective, directive, $compileNode)), 
                    newScopeDirective = newScopeDirective || directive), directiveName = directive.name, 
                    !directive.templateUrl && directive.controller && (directiveValue = directive.controller, 
                    controllerDirectives = controllerDirectives || {}, assertNoDuplicate("'" + directiveName + "' controller", controllerDirectives[directiveName], directive, $compileNode), 
                    controllerDirectives[directiveName] = directive), (directiveValue = directive.transclude) && (hasTranscludeDirective = !0, 
                    directive.$$tlb || (assertNoDuplicate("transclusion", nonTlbTranscludeDirective, directive, $compileNode), 
                    nonTlbTranscludeDirective = directive), "element" == directiveValue ? (hasElementTranscludeDirective = !0, 
                    terminalPriority = directive.priority, $template = $compileNode, $compileNode = templateAttrs.$$element = jqLite(document.createComment(" " + directiveName + ": " + templateAttrs[directiveName] + " ")), 
                    compileNode = $compileNode[0], replaceWith(jqCollection, sliceArgs($template), compileNode), 
                    childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {
                        nonTlbTranscludeDirective: nonTlbTranscludeDirective
                    })) : ($template = jqLite(jqLiteClone(compileNode)).contents(), $compileNode.empty(), 
                    childTranscludeFn = compile($template, transcludeFn))), directive.template) if (hasTemplate = !0, 
                    assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, 
                    directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template, 
                    directiveValue = denormalizeTemplate(directiveValue), directive.replace) {
                        if (replaceDirective = directive, $template = jqLiteIsTextNode(directiveValue) ? [] : removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue))), 
                        compileNode = $template[0], 1 != $template.length || compileNode.nodeType !== NODE_TYPE_ELEMENT) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", directiveName, "");
                        replaceWith(jqCollection, $compileNode, compileNode);
                        var newTemplateAttrs = {
                            $attr: {}
                        }, templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs), unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                        newIsolateScopeDirective && markDirectivesAsIsolate(templateDirectives), directives = directives.concat(templateDirectives).concat(unprocessedDirectives), 
                        mergeTemplateAttributes(templateAttrs, newTemplateAttrs), ii = directives.length;
                    } else $compileNode.html(directiveValue);
                    if (directive.templateUrl) hasTemplate = !0, assertNoDuplicate("template", templateDirective, directive, $compileNode), 
                    templateDirective = directive, directive.replace && (replaceDirective = directive), 
                    nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                        controllerDirectives: controllerDirectives,
                        newIsolateScopeDirective: newIsolateScopeDirective,
                        templateDirective: templateDirective,
                        nonTlbTranscludeDirective: nonTlbTranscludeDirective
                    }), ii = directives.length; else if (directive.compile) try {
                        linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn), isFunction(linkFn) ? addLinkFns(null, linkFn, attrStart, attrEnd) : linkFn && addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                    } catch (e) {
                        $exceptionHandler(e, startingTag($compileNode));
                    }
                    directive.terminal && (nodeLinkFn.terminal = !0, terminalPriority = Math.max(terminalPriority, directive.priority));
                }
                return nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === !0, nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective, 
                nodeLinkFn.elementTranscludeOnThisElement = hasElementTranscludeDirective, nodeLinkFn.templateOnThisElement = hasTemplate, 
                nodeLinkFn.transclude = childTranscludeFn, previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective, 
                nodeLinkFn;
            }
            function markDirectivesAsIsolate(directives) {
                for (var j = 0, jj = directives.length; jj > j; j++) directives[j] = inherit(directives[j], {
                    $$isolateScope: !0
                });
            }
            function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
                if (name === ignoreDirective) return null;
                var match = null;
                if (hasDirectives.hasOwnProperty(name)) for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; ii > i; i++) try {
                    directive = directives[i], (maxPriority === undefined || maxPriority > directive.priority) && -1 != directive.restrict.indexOf(location) && (startAttrName && (directive = inherit(directive, {
                        $$start: startAttrName,
                        $$end: endAttrName
                    })), tDirectives.push(directive), match = directive);
                } catch (e) {
                    $exceptionHandler(e);
                }
                return match;
            }
            function directiveIsMultiElement(name) {
                if (hasDirectives.hasOwnProperty(name)) for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; ii > i; i++) if (directive = directives[i], 
                directive.multiElement) return !0;
                return !1;
            }
            function mergeTemplateAttributes(dst, src) {
                var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
                forEach(dst, function(value, key) {
                    "$" != key.charAt(0) && (src[key] && src[key] !== value && (value += ("style" === key ? ";" : " ") + src[key]), 
                    dst.$set(key, value, !0, srcAttr[key]));
                }), forEach(src, function(value, key) {
                    "class" == key ? (safeAddClass($element, value), dst["class"] = (dst["class"] ? dst["class"] + " " : "") + value) : "style" == key ? ($element.attr("style", $element.attr("style") + ";" + value), 
                    dst.style = (dst.style ? dst.style + ";" : "") + value) : "$" == key.charAt(0) || dst.hasOwnProperty(key) || (dst[key] = value, 
                    dstAttr[key] = srcAttr[key]);
                });
            }
            function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                var afterTemplateNodeLinkFn, afterTemplateChildLinkFn, linkQueue = [], beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = extend({}, origAsyncDirective, {
                    templateUrl: null,
                    transclude: null,
                    replace: null,
                    $$originalDirective: origAsyncDirective
                }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl, templateNamespace = origAsyncDirective.templateNamespace;
                return $compileNode.empty(), $templateRequest($sce.getTrustedResourceUrl(templateUrl)).then(function(content) {
                    var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
                    if (content = denormalizeTemplate(content), origAsyncDirective.replace) {
                        if ($template = jqLiteIsTextNode(content) ? [] : removeComments(wrapTemplate(templateNamespace, trim(content))), 
                        compileNode = $template[0], 1 != $template.length || compileNode.nodeType !== NODE_TYPE_ELEMENT) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
                        tempTemplateAttrs = {
                            $attr: {}
                        }, replaceWith($rootElement, $compileNode, compileNode);
                        var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                        isObject(origAsyncDirective.scope) && markDirectivesAsIsolate(templateDirectives), 
                        directives = templateDirectives.concat(directives), mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
                    } else compileNode = beforeTemplateCompileNode, $compileNode.html(content);
                    for (directives.unshift(derivedSyncDirective), afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext), 
                    forEach($rootElement, function(node, i) {
                        node == compileNode && ($rootElement[i] = $compileNode[0]);
                    }), afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn); linkQueue.length; ) {
                        var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
                        if (!scope.$$destroyed) {
                            if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                                var oldClasses = beforeTemplateLinkNode.className;
                                previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace || (linkNode = jqLiteClone(compileNode)), 
                                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode), safeAddClass(jqLite(linkNode), oldClasses);
                            }
                            childBoundTranscludeFn = afterTemplateNodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn) : boundTranscludeFn, 
                            afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
                        }
                    }
                    linkQueue = null;
                }), function(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                    var childBoundTranscludeFn = boundTranscludeFn;
                    scope.$$destroyed || (linkQueue ? linkQueue.push(scope, node, rootElement, childBoundTranscludeFn) : (afterTemplateNodeLinkFn.transcludeOnThisElement && (childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn)), 
                    afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn)));
                };
            }
            function byPriority(a, b) {
                var diff = b.priority - a.priority;
                return 0 !== diff ? diff : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index;
            }
            function assertNoDuplicate(what, previousDirective, directive, element) {
                if (previousDirective) throw $compileMinErr("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", previousDirective.name, directive.name, what, startingTag(element));
            }
            function addTextInterpolateDirective(directives, text) {
                var interpolateFn = $interpolate(text, !0);
                interpolateFn && directives.push({
                    priority: 0,
                    compile: function(templateNode) {
                        var templateNodeParent = templateNode.parent(), hasCompileParent = !!templateNodeParent.length;
                        return hasCompileParent && compile.$$addBindingClass(templateNodeParent), function(scope, node) {
                            var parent = node.parent();
                            hasCompileParent || compile.$$addBindingClass(parent), compile.$$addBindingInfo(parent, interpolateFn.expressions), 
                            scope.$watch(interpolateFn, function(value) {
                                node[0].nodeValue = value;
                            });
                        };
                    }
                });
            }
            function wrapTemplate(type, template) {
                switch (type = lowercase(type || "html")) {
                  case "svg":
                  case "math":
                    var wrapper = document.createElement("div");
                    return wrapper.innerHTML = "<" + type + ">" + template + "</" + type + ">", wrapper.childNodes[0].childNodes;

                  default:
                    return template;
                }
            }
            function getTrustedContext(node, attrNormalizedName) {
                if ("srcdoc" == attrNormalizedName) return $sce.HTML;
                var tag = nodeName_(node);
                return "xlinkHref" == attrNormalizedName || "form" == tag && "action" == attrNormalizedName || "img" != tag && ("src" == attrNormalizedName || "ngSrc" == attrNormalizedName) ? $sce.RESOURCE_URL : void 0;
            }
            function addAttrInterpolateDirective(node, directives, value, name, allOrNothing) {
                var trustedContext = getTrustedContext(node, name);
                allOrNothing = ALL_OR_NOTHING_ATTRS[name] || allOrNothing;
                var interpolateFn = $interpolate(value, !0, trustedContext, allOrNothing);
                if (interpolateFn) {
                    if ("multiple" === name && "select" === nodeName_(node)) throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
                    directives.push({
                        priority: 100,
                        compile: function() {
                            return {
                                pre: function(scope, element, attr) {
                                    var $$observers = attr.$$observers || (attr.$$observers = {});
                                    if (EVENT_HANDLER_ATTR_REGEXP.test(name)) throw $compileMinErr("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                    var newValue = attr[name];
                                    newValue !== value && (interpolateFn = newValue && $interpolate(newValue, !0, trustedContext, allOrNothing), 
                                    value = newValue), interpolateFn && (attr[name] = interpolateFn(scope), ($$observers[name] || ($$observers[name] = [])).$$inter = !0, 
                                    (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function(newValue, oldValue) {
                                        "class" === name && newValue != oldValue ? attr.$updateClass(newValue, oldValue) : attr.$set(name, newValue);
                                    }));
                                }
                            };
                        }
                    });
                }
            }
            function replaceWith($rootElement, elementsToRemove, newNode) {
                var i, ii, firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode;
                if ($rootElement) for (i = 0, ii = $rootElement.length; ii > i; i++) if ($rootElement[i] == firstElementToRemove) {
                    $rootElement[i++] = newNode;
                    for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; jj > j; j++, 
                    j2++) jj > j2 ? $rootElement[j] = $rootElement[j2] : delete $rootElement[j];
                    $rootElement.length -= removeCount - 1, $rootElement.context === firstElementToRemove && ($rootElement.context = newNode);
                    break;
                }
                parent && parent.replaceChild(newNode, firstElementToRemove);
                var fragment = document.createDocumentFragment();
                fragment.appendChild(firstElementToRemove), jqLite(newNode).data(jqLite(firstElementToRemove).data()), 
                jQuery ? (skipDestroyOnNextJQueryCleanData = !0, jQuery.cleanData([ firstElementToRemove ])) : delete jqLite.cache[firstElementToRemove[jqLite.expando]];
                for (var k = 1, kk = elementsToRemove.length; kk > k; k++) {
                    var element = elementsToRemove[k];
                    jqLite(element).remove(), fragment.appendChild(element), delete elementsToRemove[k];
                }
                elementsToRemove[0] = newNode, elementsToRemove.length = 1;
            }
            function cloneAndAnnotateFn(fn, annotation) {
                return extend(function() {
                    return fn.apply(null, arguments);
                }, fn, annotation);
            }
            function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
                try {
                    linkFn(scope, $element, attrs, controllers, transcludeFn);
                } catch (e) {
                    $exceptionHandler(e, startingTag($element));
                }
            }
            var Attributes = function(element, attributesToCopy) {
                if (attributesToCopy) {
                    var i, l, key, keys = Object.keys(attributesToCopy);
                    for (i = 0, l = keys.length; l > i; i++) key = keys[i], this[key] = attributesToCopy[key];
                } else this.$attr = {};
                this.$$element = element;
            };
            Attributes.prototype = {
                $normalize: directiveNormalize,
                $addClass: function(classVal) {
                    classVal && classVal.length > 0 && $animate.addClass(this.$$element, classVal);
                },
                $removeClass: function(classVal) {
                    classVal && classVal.length > 0 && $animate.removeClass(this.$$element, classVal);
                },
                $updateClass: function(newClasses, oldClasses) {
                    var toAdd = tokenDifference(newClasses, oldClasses);
                    toAdd && toAdd.length && $animate.addClass(this.$$element, toAdd);
                    var toRemove = tokenDifference(oldClasses, newClasses);
                    toRemove && toRemove.length && $animate.removeClass(this.$$element, toRemove);
                },
                $set: function(key, value, writeAttr, attrName) {
                    var nodeName, node = this.$$element[0], booleanKey = getBooleanAttrName(node, key), aliasedKey = getAliasedAttrName(node, key), observer = key;
                    if (booleanKey ? (this.$$element.prop(key, value), attrName = booleanKey) : aliasedKey && (this[aliasedKey] = value, 
                    observer = aliasedKey), this[key] = value, attrName ? this.$attr[key] = attrName : (attrName = this.$attr[key], 
                    attrName || (this.$attr[key] = attrName = snake_case(key, "-"))), nodeName = nodeName_(this.$$element), 
                    "a" === nodeName && "href" === key || "img" === nodeName && "src" === key) this[key] = value = $$sanitizeUri(value, "src" === key); else if ("img" === nodeName && "srcset" === key) {
                        for (var result = "", trimmedSrcset = trim(value), srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/, rawUris = trimmedSrcset.split(pattern), nbrUrisWith2parts = Math.floor(rawUris.length / 2), i = 0; nbrUrisWith2parts > i; i++) {
                            var innerIdx = 2 * i;
                            result += $$sanitizeUri(trim(rawUris[innerIdx]), !0), result += " " + trim(rawUris[innerIdx + 1]);
                        }
                        var lastTuple = trim(rawUris[2 * i]).split(/\s/);
                        result += $$sanitizeUri(trim(lastTuple[0]), !0), 2 === lastTuple.length && (result += " " + trim(lastTuple[1])), 
                        this[key] = value = result;
                    }
                    writeAttr !== !1 && (null === value || value === undefined ? this.$$element.removeAttr(attrName) : this.$$element.attr(attrName, value));
                    var $$observers = this.$$observers;
                    $$observers && forEach($$observers[observer], function(fn) {
                        try {
                            fn(value);
                        } catch (e) {
                            $exceptionHandler(e);
                        }
                    });
                },
                $observe: function(key, fn) {
                    var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = createMap()), listeners = $$observers[key] || ($$observers[key] = []);
                    return listeners.push(fn), $rootScope.$evalAsync(function() {
                        !listeners.$$inter && attrs.hasOwnProperty(key) && fn(attrs[key]);
                    }), function() {
                        arrayRemove(listeners, fn);
                    };
                }
            };
            var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = "{{" == startSymbol || "}}" == endSymbol ? identity : function(template) {
                return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
            }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
            return compile.$$addBindingInfo = debugInfoEnabled ? function($element, binding) {
                var bindings = $element.data("$binding") || [];
                isArray(binding) ? bindings = bindings.concat(binding) : bindings.push(binding), 
                $element.data("$binding", bindings);
            } : noop, compile.$$addBindingClass = debugInfoEnabled ? function($element) {
                safeAddClass($element, "ng-binding");
            } : noop, compile.$$addScopeInfo = debugInfoEnabled ? function($element, scope, isolated, noTemplate) {
                var dataName = isolated ? noTemplate ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope";
                $element.data(dataName, scope);
            } : noop, compile.$$addScopeClass = debugInfoEnabled ? function($element, isolated) {
                safeAddClass($element, isolated ? "ng-isolate-scope" : "ng-scope");
            } : noop, compile;
        } ];
    }
    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ""));
    }
    function tokenDifference(str1, str2) {
        var values = "", tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
        outer: for (var i = 0; i < tokens1.length; i++) {
            for (var token = tokens1[i], j = 0; j < tokens2.length; j++) if (token == tokens2[j]) continue outer;
            values += (values.length > 0 ? " " : "") + token;
        }
        return values;
    }
    function removeComments(jqNodes) {
        jqNodes = jqLite(jqNodes);
        var i = jqNodes.length;
        if (1 >= i) return jqNodes;
        for (;i--; ) {
            var node = jqNodes[i];
            node.nodeType === NODE_TYPE_COMMENT && splice.call(jqNodes, i, 1);
        }
        return jqNodes;
    }
    function $ControllerProvider() {
        var controllers = {}, globals = !1, CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        this.register = function(name, constructor) {
            assertNotHasOwnProperty(name, "controller"), isObject(name) ? extend(controllers, name) : controllers[name] = constructor;
        }, this.allowGlobals = function() {
            globals = !0;
        }, this.$get = [ "$injector", "$window", function($injector, $window) {
            function addIdentifier(locals, identifier, instance, name) {
                if (!locals || !isObject(locals.$scope)) throw minErr("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", name, identifier);
                locals.$scope[identifier] = instance;
            }
            return function(expression, locals, later, ident) {
                var instance, match, constructor, identifier;
                if (later = later === !0, ident && isString(ident) && (identifier = ident), isString(expression) && (match = expression.match(CNTRL_REG), 
                constructor = match[1], identifier = identifier || match[3], expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, !0) || (globals ? getter($window, constructor, !0) : undefined), 
                assertArgFn(expression, constructor, !0)), later) {
                    var controllerPrototype = (isArray(expression) ? expression[expression.length - 1] : expression).prototype;
                    return instance = Object.create(controllerPrototype || null), identifier && addIdentifier(locals, identifier, instance, constructor || expression.name), 
                    extend(function() {
                        return $injector.invoke(expression, instance, locals, constructor), instance;
                    }, {
                        instance: instance,
                        identifier: identifier
                    });
                }
                return instance = $injector.instantiate(expression, locals, constructor), identifier && addIdentifier(locals, identifier, instance, constructor || expression.name), 
                instance;
            };
        } ];
    }
    function $DocumentProvider() {
        this.$get = [ "$window", function(window) {
            return jqLite(window.document);
        } ];
    }
    function $ExceptionHandlerProvider() {
        this.$get = [ "$log", function($log) {
            return function() {
                $log.error.apply($log, arguments);
            };
        } ];
    }
    function defaultHttpResponseTransform(data, headers) {
        if (isString(data)) {
            var tempData = data.replace(JSON_PROTECTION_PREFIX, "").trim();
            if (tempData) {
                var contentType = headers("Content-Type");
                (contentType && 0 === contentType.indexOf(APPLICATION_JSON) || isJsonLike(tempData)) && (data = fromJson(tempData));
            }
        }
        return data;
    }
    function isJsonLike(str) {
        var jsonStart = str.match(JSON_START);
        return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
    }
    function parseHeaders(headers) {
        var key, val, i, parsed = createMap();
        return headers ? (forEach(headers.split("\n"), function(line) {
            i = line.indexOf(":"), key = lowercase(trim(line.substr(0, i))), val = trim(line.substr(i + 1)), 
            key && (parsed[key] = parsed[key] ? parsed[key] + ", " + val : val);
        }), parsed) : parsed;
    }
    function headersGetter(headers) {
        var headersObj = isObject(headers) ? headers : undefined;
        return function(name) {
            if (headersObj || (headersObj = parseHeaders(headers)), name) {
                var value = headersObj[lowercase(name)];
                return void 0 === value && (value = null), value;
            }
            return headersObj;
        };
    }
    function transformData(data, headers, status, fns) {
        return isFunction(fns) ? fns(data, headers, status) : (forEach(fns, function(fn) {
            data = fn(data, headers, status);
        }), data);
    }
    function isSuccess(status) {
        return status >= 200 && 300 > status;
    }
    function $HttpProvider() {
        var defaults = this.defaults = {
            transformResponse: [ defaultHttpResponseTransform ],
            transformRequest: [ function(d) {
                return !isObject(d) || isFile(d) || isBlob(d) || isFormData(d) ? d : toJson(d);
            } ],
            headers: {
                common: {
                    Accept: "application/json, text/plain, */*"
                },
                post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN"
        }, useApplyAsync = !1;
        this.useApplyAsync = function(value) {
            return isDefined(value) ? (useApplyAsync = !!value, this) : useApplyAsync;
        };
        var interceptorFactories = this.interceptors = [];
        this.$get = [ "$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector", function($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
            function $http(requestConfig) {
                function transformResponse(response) {
                    var resp = extend({}, response);
                    return resp.data = response.data ? transformData(response.data, response.headers, response.status, config.transformResponse) : response.data, 
                    isSuccess(response.status) ? resp : $q.reject(resp);
                }
                function executeHeaderFns(headers) {
                    var headerContent, processedHeaders = {};
                    return forEach(headers, function(headerFn, header) {
                        isFunction(headerFn) ? (headerContent = headerFn(), null != headerContent && (processedHeaders[header] = headerContent)) : processedHeaders[header] = headerFn;
                    }), processedHeaders;
                }
                function mergeHeaders(config) {
                    var defHeaderName, lowercaseDefHeaderName, reqHeaderName, defHeaders = defaults.headers, reqHeaders = extend({}, config.headers);
                    defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
                    defaultHeadersIteration: for (defHeaderName in defHeaders) {
                        lowercaseDefHeaderName = lowercase(defHeaderName);
                        for (reqHeaderName in reqHeaders) if (lowercase(reqHeaderName) === lowercaseDefHeaderName) continue defaultHeadersIteration;
                        reqHeaders[defHeaderName] = defHeaders[defHeaderName];
                    }
                    return executeHeaderFns(reqHeaders);
                }
                if (!angular.isObject(requestConfig)) throw minErr("$http")("badreq", "Http request configuration must be an object.  Received: {0}", requestConfig);
                var config = extend({
                    method: "get",
                    transformRequest: defaults.transformRequest,
                    transformResponse: defaults.transformResponse
                }, requestConfig);
                config.headers = mergeHeaders(requestConfig), config.method = uppercase(config.method);
                var serverRequest = function(config) {
                    var headers = config.headers, reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);
                    return isUndefined(reqData) && forEach(headers, function(value, header) {
                        "content-type" === lowercase(header) && delete headers[header];
                    }), isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials) && (config.withCredentials = defaults.withCredentials), 
                    sendReq(config, reqData).then(transformResponse, transformResponse);
                }, chain = [ serverRequest, undefined ], promise = $q.when(config);
                for (forEach(reversedInterceptors, function(interceptor) {
                    (interceptor.request || interceptor.requestError) && chain.unshift(interceptor.request, interceptor.requestError), 
                    (interceptor.response || interceptor.responseError) && chain.push(interceptor.response, interceptor.responseError);
                }); chain.length; ) {
                    var thenFn = chain.shift(), rejectFn = chain.shift();
                    promise = promise.then(thenFn, rejectFn);
                }
                return promise.success = function(fn) {
                    return promise.then(function(response) {
                        fn(response.data, response.status, response.headers, config);
                    }), promise;
                }, promise.error = function(fn) {
                    return promise.then(null, function(response) {
                        fn(response.data, response.status, response.headers, config);
                    }), promise;
                }, promise;
            }
            function createShortMethods() {
                forEach(arguments, function(name) {
                    $http[name] = function(url, config) {
                        return $http(extend(config || {}, {
                            method: name,
                            url: url
                        }));
                    };
                });
            }
            function createShortMethodsWithData() {
                forEach(arguments, function(name) {
                    $http[name] = function(url, data, config) {
                        return $http(extend(config || {}, {
                            method: name,
                            url: url,
                            data: data
                        }));
                    };
                });
            }
            function sendReq(config, reqData) {
                function done(status, response, headersString, statusText) {
                    function resolveHttpPromise() {
                        resolvePromise(response, status, headersString, statusText);
                    }
                    cache && (isSuccess(status) ? cache.put(url, [ status, response, parseHeaders(headersString), statusText ]) : cache.remove(url)), 
                    useApplyAsync ? $rootScope.$applyAsync(resolveHttpPromise) : (resolveHttpPromise(), 
                    $rootScope.$$phase || $rootScope.$apply());
                }
                function resolvePromise(response, status, headers, statusText) {
                    status = Math.max(status, 0), (isSuccess(status) ? deferred.resolve : deferred.reject)({
                        data: response,
                        status: status,
                        headers: headersGetter(headers),
                        config: config,
                        statusText: statusText
                    });
                }
                function resolvePromiseWithResult(result) {
                    resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
                }
                function removePendingReq() {
                    var idx = $http.pendingRequests.indexOf(config);
                    -1 !== idx && $http.pendingRequests.splice(idx, 1);
                }
                var cache, cachedResp, deferred = $q.defer(), promise = deferred.promise, reqHeaders = config.headers, url = buildUrl(config.url, config.params);
                if ($http.pendingRequests.push(config), promise.then(removePendingReq, removePendingReq), 
                !config.cache && !defaults.cache || config.cache === !1 || "GET" !== config.method && "JSONP" !== config.method || (cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache), 
                cache && (cachedResp = cache.get(url), isDefined(cachedResp) ? isPromiseLike(cachedResp) ? cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult) : isArray(cachedResp) ? resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]) : resolvePromise(cachedResp, 200, {}, "OK") : cache.put(url, promise)), 
                isUndefined(cachedResp)) {
                    var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
                    xsrfValue && (reqHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue), 
                    $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType);
                }
                return promise;
            }
            function buildUrl(url, params) {
                if (!params) return url;
                var parts = [];
                return forEachSorted(params, function(value, key) {
                    null === value || isUndefined(value) || (isArray(value) || (value = [ value ]), 
                    forEach(value, function(v) {
                        isObject(v) && (v = isDate(v) ? v.toISOString() : toJson(v)), parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v));
                    }));
                }), parts.length > 0 && (url += (-1 == url.indexOf("?") ? "?" : "&") + parts.join("&")), 
                url;
            }
            var defaultCache = $cacheFactory("$http"), reversedInterceptors = [];
            return forEach(interceptorFactories, function(interceptorFactory) {
                reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
            }), $http.pendingRequests = [], createShortMethods("get", "delete", "head", "jsonp"), 
            createShortMethodsWithData("post", "put", "patch"), $http.defaults = defaults, $http;
        } ];
    }
    function createXhr() {
        return new window.XMLHttpRequest();
    }
    function $HttpBackendProvider() {
        this.$get = [ "$browser", "$window", "$document", function($browser, $window, $document) {
            return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
        } ];
    }
    function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
        function jsonpReq(url, callbackId, done) {
            var script = rawDocument.createElement("script"), callback = null;
            return script.type = "text/javascript", script.src = url, script.async = !0, callback = function(event) {
                removeEventListenerFn(script, "load", callback), removeEventListenerFn(script, "error", callback), 
                rawDocument.body.removeChild(script), script = null;
                var status = -1, text = "unknown";
                event && ("load" !== event.type || callbacks[callbackId].called || (event = {
                    type: "error"
                }), text = event.type, status = "error" === event.type ? 404 : 200), done && done(status, text);
            }, addEventListenerFn(script, "load", callback), addEventListenerFn(script, "error", callback), 
            rawDocument.body.appendChild(script), callback;
        }
        return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
            function timeoutRequest() {
                jsonpDone && jsonpDone(), xhr && xhr.abort();
            }
            function completeRequest(callback, status, response, headersString, statusText) {
                timeoutId !== undefined && $browserDefer.cancel(timeoutId), jsonpDone = xhr = null, 
                callback(status, response, headersString, statusText), $browser.$$completeOutstandingRequest(noop);
            }
            if ($browser.$$incOutstandingRequestCount(), url = url || $browser.url(), "jsonp" == lowercase(method)) {
                var callbackId = "_" + (callbacks.counter++).toString(36);
                callbacks[callbackId] = function(data) {
                    callbacks[callbackId].data = data, callbacks[callbackId].called = !0;
                };
                var jsonpDone = jsonpReq(url.replace("JSON_CALLBACK", "angular.callbacks." + callbackId), callbackId, function(status, text) {
                    completeRequest(callback, status, callbacks[callbackId].data, "", text), callbacks[callbackId] = noop;
                });
            } else {
                var xhr = createXhr();
                xhr.open(method, url, !0), forEach(headers, function(value, key) {
                    isDefined(value) && xhr.setRequestHeader(key, value);
                }), xhr.onload = function() {
                    var statusText = xhr.statusText || "", response = "response" in xhr ? xhr.response : xhr.responseText, status = 1223 === xhr.status ? 204 : xhr.status;
                    0 === status && (status = response ? 200 : "file" == urlResolve(url).protocol ? 404 : 0), 
                    completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText);
                };
                var requestError = function() {
                    completeRequest(callback, -1, null, null, "");
                };
                if (xhr.onerror = requestError, xhr.onabort = requestError, withCredentials && (xhr.withCredentials = !0), 
                responseType) try {
                    xhr.responseType = responseType;
                } catch (e) {
                    if ("json" !== responseType) throw e;
                }
                xhr.send(post || null);
            }
            if (timeout > 0) var timeoutId = $browserDefer(timeoutRequest, timeout); else isPromiseLike(timeout) && timeout.then(timeoutRequest);
        };
    }
    function $InterpolateProvider() {
        var startSymbol = "{{", endSymbol = "}}";
        this.startSymbol = function(value) {
            return value ? (startSymbol = value, this) : startSymbol;
        }, this.endSymbol = function(value) {
            return value ? (endSymbol = value, this) : endSymbol;
        }, this.$get = [ "$parse", "$exceptionHandler", "$sce", function($parse, $exceptionHandler, $sce) {
            function escape(ch) {
                return "\\\\\\" + ch;
            }
            function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
                function unescapeText(text) {
                    return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol);
                }
                function parseStringifyInterceptor(value) {
                    try {
                        return value = getValue(value), allOrNothing && !isDefined(value) ? value : stringify(value);
                    } catch (err) {
                        var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                        $exceptionHandler(newErr);
                    }
                }
                allOrNothing = !!allOrNothing;
                for (var startIndex, endIndex, exp, index = 0, expressions = [], parseFns = [], textLength = text.length, concat = [], expressionPositions = []; textLength > index; ) {
                    if (-1 == (startIndex = text.indexOf(startSymbol, index)) || -1 == (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength))) {
                        index !== textLength && concat.push(unescapeText(text.substring(index)));
                        break;
                    }
                    index !== startIndex && concat.push(unescapeText(text.substring(index, startIndex))), 
                    exp = text.substring(startIndex + startSymbolLength, endIndex), expressions.push(exp), 
                    parseFns.push($parse(exp, parseStringifyInterceptor)), index = endIndex + endSymbolLength, 
                    expressionPositions.push(concat.length), concat.push("");
                }
                if (trustedContext && concat.length > 1) throw $interpolateMinErr("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", text);
                if (!mustHaveExpression || expressions.length) {
                    var compute = function(values) {
                        for (var i = 0, ii = expressions.length; ii > i; i++) {
                            if (allOrNothing && isUndefined(values[i])) return;
                            concat[expressionPositions[i]] = values[i];
                        }
                        return concat.join("");
                    }, getValue = function(value) {
                        return trustedContext ? $sce.getTrusted(trustedContext, value) : $sce.valueOf(value);
                    }, stringify = function(value) {
                        if (null == value) return "";
                        switch (typeof value) {
                          case "string":
                            break;

                          case "number":
                            value = "" + value;
                            break;

                          default:
                            value = toJson(value);
                        }
                        return value;
                    };
                    return extend(function(context) {
                        var i = 0, ii = expressions.length, values = new Array(ii);
                        try {
                            for (;ii > i; i++) values[i] = parseFns[i](context);
                            return compute(values);
                        } catch (err) {
                            var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                            $exceptionHandler(newErr);
                        }
                    }, {
                        exp: text,
                        expressions: expressions,
                        $$watchDelegate: function(scope, listener, objectEquality) {
                            var lastValue;
                            return scope.$watchGroup(parseFns, function(values, oldValues) {
                                var currValue = compute(values);
                                isFunction(listener) && listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope), 
                                lastValue = currValue;
                            }, objectEquality);
                        }
                    });
                }
            }
            var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length, escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), "g"), escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), "g");
            return $interpolate.startSymbol = function() {
                return startSymbol;
            }, $interpolate.endSymbol = function() {
                return endSymbol;
            }, $interpolate;
        } ];
    }
    function $IntervalProvider() {
        this.$get = [ "$rootScope", "$window", "$q", "$$q", function($rootScope, $window, $q, $$q) {
            function interval(fn, delay, count, invokeApply) {
                var setInterval = $window.setInterval, clearInterval = $window.clearInterval, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise;
                return count = isDefined(count) ? count : 0, promise.then(null, null, fn), promise.$$intervalId = setInterval(function() {
                    deferred.notify(iteration++), count > 0 && iteration >= count && (deferred.resolve(iteration), 
                    clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId]), skipApply || $rootScope.$apply();
                }, delay), intervals[promise.$$intervalId] = deferred, promise;
            }
            var intervals = {};
            return interval.cancel = function(promise) {
                return promise && promise.$$intervalId in intervals ? (intervals[promise.$$intervalId].reject("canceled"), 
                $window.clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId], 
                !0) : !1;
            }, interval;
        } ];
    }
    function $LocaleProvider() {
        this.$get = function() {
            return {
                id: "en-us",
                NUMBER_FORMATS: {
                    DECIMAL_SEP: ".",
                    GROUP_SEP: ",",
                    PATTERNS: [ {
                        minInt: 1,
                        minFrac: 0,
                        maxFrac: 3,
                        posPre: "",
                        posSuf: "",
                        negPre: "-",
                        negSuf: "",
                        gSize: 3,
                        lgSize: 3
                    }, {
                        minInt: 1,
                        minFrac: 2,
                        maxFrac: 2,
                        posPre: "¤",
                        posSuf: "",
                        negPre: "(¤",
                        negSuf: ")",
                        gSize: 3,
                        lgSize: 3
                    } ],
                    CURRENCY_SYM: "$"
                },
                DATETIME_FORMATS: {
                    MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                    SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                    DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                    SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    AMPMS: [ "AM", "PM" ],
                    medium: "MMM d, y h:mm:ss a",
                    "short": "M/d/yy h:mm a",
                    fullDate: "EEEE, MMMM d, y",
                    longDate: "MMMM d, y",
                    mediumDate: "MMM d, y",
                    shortDate: "M/d/yy",
                    mediumTime: "h:mm:ss a",
                    shortTime: "h:mm a"
                },
                pluralCat: function(num) {
                    return 1 === num ? "one" : "other";
                }
            };
        };
    }
    function encodePath(path) {
        for (var segments = path.split("/"), i = segments.length; i--; ) segments[i] = encodeUriSegment(segments[i]);
        return segments.join("/");
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj) {
        var parsedUrl = urlResolve(absoluteUrl);
        locationObj.$$protocol = parsedUrl.protocol, locationObj.$$host = parsedUrl.hostname, 
        locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
    }
    function parseAppUrl(relativeUrl, locationObj) {
        var prefixed = "/" !== relativeUrl.charAt(0);
        prefixed && (relativeUrl = "/" + relativeUrl);
        var match = urlResolve(relativeUrl);
        locationObj.$$path = decodeURIComponent(prefixed && "/" === match.pathname.charAt(0) ? match.pathname.substring(1) : match.pathname), 
        locationObj.$$search = parseKeyValue(match.search), locationObj.$$hash = decodeURIComponent(match.hash), 
        locationObj.$$path && "/" != locationObj.$$path.charAt(0) && (locationObj.$$path = "/" + locationObj.$$path);
    }
    function beginsWith(begin, whole) {
        return 0 === whole.indexOf(begin) ? whole.substr(begin.length) : void 0;
    }
    function stripHash(url) {
        var index = url.indexOf("#");
        return -1 == index ? url : url.substr(0, index);
    }
    function trimEmptyHash(url) {
        return url.replace(/(#.+)|#$/, "$1");
    }
    function stripFile(url) {
        return url.substr(0, stripHash(url).lastIndexOf("/") + 1);
    }
    function serverBase(url) {
        return url.substring(0, url.indexOf("/", url.indexOf("//") + 2));
    }
    function LocationHtml5Url(appBase, basePrefix) {
        this.$$html5 = !0, basePrefix = basePrefix || "";
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this), this.$$parse = function(url) {
            var pathUrl = beginsWith(appBaseNoFile, url);
            if (!isString(pathUrl)) throw $locationMinErr("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
            parseAppUrl(pathUrl, this), this.$$path || (this.$$path = "/"), this.$$compose();
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
        }, this.$$parseLinkUrl = function(url, relHref) {
            if (relHref && "#" === relHref[0]) return this.hash(relHref.slice(1)), !0;
            var appUrl, prevAppUrl, rewrittenUrl;
            return (appUrl = beginsWith(appBase, url)) !== undefined ? (prevAppUrl = appUrl, 
            rewrittenUrl = (appUrl = beginsWith(basePrefix, appUrl)) !== undefined ? appBaseNoFile + (beginsWith("/", appUrl) || appUrl) : appBase + prevAppUrl) : (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ? rewrittenUrl = appBaseNoFile + appUrl : appBaseNoFile == url + "/" && (rewrittenUrl = appBaseNoFile), 
            rewrittenUrl && this.$$parse(rewrittenUrl), !!rewrittenUrl;
        };
    }
    function LocationHashbangUrl(appBase, hashPrefix) {
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this), this.$$parse = function(url) {
            function removeWindowsDriveName(path, url, base) {
                var firstPathSegmentMatch, windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
                return 0 === url.indexOf(base) && (url = url.replace(base, "")), windowsFilePathExp.exec(url) ? path : (firstPathSegmentMatch = windowsFilePathExp.exec(path), 
                firstPathSegmentMatch ? firstPathSegmentMatch[1] : path);
            }
            var withoutHashUrl, withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
            "#" === withoutBaseUrl.charAt(0) ? (withoutHashUrl = beginsWith(hashPrefix, withoutBaseUrl), 
            isUndefined(withoutHashUrl) && (withoutHashUrl = withoutBaseUrl)) : withoutHashUrl = this.$$html5 ? withoutBaseUrl : "", 
            parseAppUrl(withoutHashUrl, this), this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase), 
            this.$$compose();
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : "");
        }, this.$$parseLinkUrl = function(url) {
            return stripHash(appBase) == stripHash(url) ? (this.$$parse(url), !0) : !1;
        };
    }
    function LocationHashbangInHtml5Url(appBase, hashPrefix) {
        this.$$html5 = !0, LocationHashbangUrl.apply(this, arguments);
        var appBaseNoFile = stripFile(appBase);
        this.$$parseLinkUrl = function(url, relHref) {
            if (relHref && "#" === relHref[0]) return this.hash(relHref.slice(1)), !0;
            var rewrittenUrl, appUrl;
            return appBase == stripHash(url) ? rewrittenUrl = url : (appUrl = beginsWith(appBaseNoFile, url)) ? rewrittenUrl = appBase + hashPrefix + appUrl : appBaseNoFile === url + "/" && (rewrittenUrl = appBaseNoFile), 
            rewrittenUrl && this.$$parse(rewrittenUrl), !!rewrittenUrl;
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + hashPrefix + this.$$url;
        };
    }
    function locationGetter(property) {
        return function() {
            return this[property];
        };
    }
    function locationGetterSetter(property, preprocess) {
        return function(value) {
            return isUndefined(value) ? this[property] : (this[property] = preprocess(value), 
            this.$$compose(), this);
        };
    }
    function $LocationProvider() {
        var hashPrefix = "", html5Mode = {
            enabled: !1,
            requireBase: !0,
            rewriteLinks: !0
        };
        this.hashPrefix = function(prefix) {
            return isDefined(prefix) ? (hashPrefix = prefix, this) : hashPrefix;
        }, this.html5Mode = function(mode) {
            return isBoolean(mode) ? (html5Mode.enabled = mode, this) : isObject(mode) ? (isBoolean(mode.enabled) && (html5Mode.enabled = mode.enabled), 
            isBoolean(mode.requireBase) && (html5Mode.requireBase = mode.requireBase), isBoolean(mode.rewriteLinks) && (html5Mode.rewriteLinks = mode.rewriteLinks), 
            this) : html5Mode;
        }, this.$get = [ "$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function($rootScope, $browser, $sniffer, $rootElement, $window) {
            function setBrowserUrlWithFallback(url, replace, state) {
                var oldUrl = $location.url(), oldState = $location.$$state;
                try {
                    $browser.url(url, replace, state), $location.$$state = $browser.state();
                } catch (e) {
                    throw $location.url(oldUrl), $location.$$state = oldState, e;
                }
            }
            function afterLocationChange(oldUrl, oldState) {
                $rootScope.$broadcast("$locationChangeSuccess", $location.absUrl(), oldUrl, $location.$$state, oldState);
            }
            var $location, LocationMode, appBase, baseHref = $browser.baseHref(), initialUrl = $browser.url();
            if (html5Mode.enabled) {
                if (!baseHref && html5Mode.requireBase) throw $locationMinErr("nobase", "$location in HTML5 mode requires a <base> tag to be present!");
                appBase = serverBase(initialUrl) + (baseHref || "/"), LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
            } else appBase = stripHash(initialUrl), LocationMode = LocationHashbangUrl;
            $location = new LocationMode(appBase, "#" + hashPrefix), $location.$$parseLinkUrl(initialUrl, initialUrl), 
            $location.$$state = $browser.state();
            var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
            $rootElement.on("click", function(event) {
                if (html5Mode.rewriteLinks && !event.ctrlKey && !event.metaKey && !event.shiftKey && 2 != event.which && 2 != event.button) {
                    for (var elm = jqLite(event.target); "a" !== nodeName_(elm[0]); ) if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
                    var absHref = elm.prop("href"), relHref = elm.attr("href") || elm.attr("xlink:href");
                    isObject(absHref) && "[object SVGAnimatedString]" === absHref.toString() && (absHref = urlResolve(absHref.animVal).href), 
                    IGNORE_URI_REGEXP.test(absHref) || !absHref || elm.attr("target") || event.isDefaultPrevented() || $location.$$parseLinkUrl(absHref, relHref) && (event.preventDefault(), 
                    $location.absUrl() != $browser.url() && ($rootScope.$apply(), $window.angular["ff-684208-preventDefault"] = !0));
                }
            }), $location.absUrl() != initialUrl && $browser.url($location.absUrl(), !0);
            var initializing = !0;
            return $browser.onUrlChange(function(newUrl, newState) {
                $rootScope.$evalAsync(function() {
                    var defaultPrevented, oldUrl = $location.absUrl(), oldState = $location.$$state;
                    $location.$$parse(newUrl), $location.$$state = newState, defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl, newState, oldState).defaultPrevented, 
                    $location.absUrl() === newUrl && (defaultPrevented ? ($location.$$parse(oldUrl), 
                    $location.$$state = oldState, setBrowserUrlWithFallback(oldUrl, !1, oldState)) : (initializing = !1, 
                    afterLocationChange(oldUrl, oldState)));
                }), $rootScope.$$phase || $rootScope.$digest();
            }), $rootScope.$watch(function() {
                var oldUrl = trimEmptyHash($browser.url()), newUrl = trimEmptyHash($location.absUrl()), oldState = $browser.state(), currentReplace = $location.$$replace, urlOrStateChanged = oldUrl !== newUrl || $location.$$html5 && $sniffer.history && oldState !== $location.$$state;
                (initializing || urlOrStateChanged) && (initializing = !1, $rootScope.$evalAsync(function() {
                    var newUrl = $location.absUrl(), defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl, $location.$$state, oldState).defaultPrevented;
                    $location.absUrl() === newUrl && (defaultPrevented ? ($location.$$parse(oldUrl), 
                    $location.$$state = oldState) : (urlOrStateChanged && setBrowserUrlWithFallback(newUrl, currentReplace, oldState === $location.$$state ? null : $location.$$state), 
                    afterLocationChange(oldUrl, oldState)));
                })), $location.$$replace = !1;
            }), $location;
        } ];
    }
    function $LogProvider() {
        var debug = !0, self = this;
        this.debugEnabled = function(flag) {
            return isDefined(flag) ? (debug = flag, this) : debug;
        }, this.$get = [ "$window", function($window) {
            function formatError(arg) {
                return arg instanceof Error && (arg.stack ? arg = arg.message && -1 === arg.stack.indexOf(arg.message) ? "Error: " + arg.message + "\n" + arg.stack : arg.stack : arg.sourceURL && (arg = arg.message + "\n" + arg.sourceURL + ":" + arg.line)), 
                arg;
            }
            function consoleLog(type) {
                var console = $window.console || {}, logFn = console[type] || console.log || noop, hasApply = !1;
                try {
                    hasApply = !!logFn.apply;
                } catch (e) {}
                return hasApply ? function() {
                    var args = [];
                    return forEach(arguments, function(arg) {
                        args.push(formatError(arg));
                    }), logFn.apply(console, args);
                } : function(arg1, arg2) {
                    logFn(arg1, null == arg2 ? "" : arg2);
                };
            }
            return {
                log: consoleLog("log"),
                info: consoleLog("info"),
                warn: consoleLog("warn"),
                error: consoleLog("error"),
                debug: function() {
                    var fn = consoleLog("debug");
                    return function() {
                        debug && fn.apply(self, arguments);
                    };
                }()
            };
        } ];
    }
    function ensureSafeMemberName(name, fullExpression) {
        if ("__defineGetter__" === name || "__defineSetter__" === name || "__lookupGetter__" === name || "__lookupSetter__" === name || "__proto__" === name) throw $parseMinErr("isecfld", "Attempting to access a disallowed field in Angular expressions! Expression: {0}", fullExpression);
        return name;
    }
    function ensureSafeObject(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.window === obj) throw $parseMinErr("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) throw $parseMinErr("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj === Object) throw $parseMinErr("isecobj", "Referencing Object in Angular expressions is disallowed! Expression: {0}", fullExpression);
        }
        return obj;
    }
    function ensureSafeFunction(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj === CALL || obj === APPLY || obj === BIND) throw $parseMinErr("isecff", "Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}", fullExpression);
        }
    }
    function isConstant(exp) {
        return exp.constant;
    }
    function setter(obj, locals, path, setValue, fullExp) {
        ensureSafeObject(obj, fullExp), ensureSafeObject(locals, fullExp);
        for (var key, element = path.split("."), i = 0; element.length > 1; i++) {
            key = ensureSafeMemberName(element.shift(), fullExp);
            var propertyObj = 0 === i && locals && locals[key] || obj[key];
            propertyObj || (propertyObj = {}, obj[key] = propertyObj), obj = ensureSafeObject(propertyObj, fullExp);
        }
        return key = ensureSafeMemberName(element.shift(), fullExp), ensureSafeObject(obj[key], fullExp), 
        obj[key] = setValue, setValue;
    }
    function isPossiblyDangerousMemberName(name) {
        return "constructor" == name;
    }
    function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, expensiveChecks) {
        ensureSafeMemberName(key0, fullExp), ensureSafeMemberName(key1, fullExp), ensureSafeMemberName(key2, fullExp), 
        ensureSafeMemberName(key3, fullExp), ensureSafeMemberName(key4, fullExp);
        var eso = function(o) {
            return ensureSafeObject(o, fullExp);
        }, eso0 = expensiveChecks || isPossiblyDangerousMemberName(key0) ? eso : identity, eso1 = expensiveChecks || isPossiblyDangerousMemberName(key1) ? eso : identity, eso2 = expensiveChecks || isPossiblyDangerousMemberName(key2) ? eso : identity, eso3 = expensiveChecks || isPossiblyDangerousMemberName(key3) ? eso : identity, eso4 = expensiveChecks || isPossiblyDangerousMemberName(key4) ? eso : identity;
        return function(scope, locals) {
            var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
            return null == pathVal ? pathVal : (pathVal = eso0(pathVal[key0]), key1 ? null == pathVal ? undefined : (pathVal = eso1(pathVal[key1]), 
            key2 ? null == pathVal ? undefined : (pathVal = eso2(pathVal[key2]), key3 ? null == pathVal ? undefined : (pathVal = eso3(pathVal[key3]), 
            key4 ? null == pathVal ? undefined : pathVal = eso4(pathVal[key4]) : pathVal) : pathVal) : pathVal) : pathVal);
        };
    }
    function getterFnWithEnsureSafeObject(fn, fullExpression) {
        return function(s, l) {
            return fn(s, l, ensureSafeObject, fullExpression);
        };
    }
    function getterFn(path, options, fullExp) {
        var expensiveChecks = options.expensiveChecks, getterFnCache = expensiveChecks ? getterFnCacheExpensive : getterFnCacheDefault, fn = getterFnCache[path];
        if (fn) return fn;
        var pathKeys = path.split("."), pathKeysLength = pathKeys.length;
        if (options.csp) fn = 6 > pathKeysLength ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, expensiveChecks) : function(scope, locals) {
            var val, i = 0;
            do val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, expensiveChecks)(scope, locals), 
            locals = undefined, scope = val; while (pathKeysLength > i);
            return val;
        }; else {
            var code = "";
            expensiveChecks && (code += "s = eso(s, fe);\nl = eso(l, fe);\n");
            var needsEnsureSafeObject = expensiveChecks;
            forEach(pathKeys, function(key, index) {
                ensureSafeMemberName(key, fullExp);
                var lookupJs = (index ? "s" : '((l&&l.hasOwnProperty("' + key + '"))?l:s)') + "." + key;
                (expensiveChecks || isPossiblyDangerousMemberName(key)) && (lookupJs = "eso(" + lookupJs + ", fe)", 
                needsEnsureSafeObject = !0), code += "if(s == null) return undefined;\ns=" + lookupJs + ";\n";
            }), code += "return s;";
            var evaledFnGetter = new Function("s", "l", "eso", "fe", code);
            evaledFnGetter.toString = valueFn(code), needsEnsureSafeObject && (evaledFnGetter = getterFnWithEnsureSafeObject(evaledFnGetter, fullExp)), 
            fn = evaledFnGetter;
        }
        return fn.sharedGetter = !0, fn.assign = function(self, value, locals) {
            return setter(self, locals, path, value, path);
        }, getterFnCache[path] = fn, fn;
    }
    function getValueOf(value) {
        return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
    }
    function $ParseProvider() {
        var cacheDefault = createMap(), cacheExpensive = createMap();
        this.$get = [ "$filter", "$sniffer", function($filter, $sniffer) {
            function wrapSharedExpression(exp) {
                var wrapped = exp;
                return exp.sharedGetter && (wrapped = function(self, locals) {
                    return exp(self, locals);
                }, wrapped.literal = exp.literal, wrapped.constant = exp.constant, wrapped.assign = exp.assign), 
                wrapped;
            }
            function collectExpressionInputs(inputs, list) {
                for (var i = 0, ii = inputs.length; ii > i; i++) {
                    var input = inputs[i];
                    input.constant || (input.inputs ? collectExpressionInputs(input.inputs, list) : -1 === list.indexOf(input) && list.push(input));
                }
                return list;
            }
            function expressionInputDirtyCheck(newValue, oldValueOfValue) {
                return null == newValue || null == oldValueOfValue ? newValue === oldValueOfValue : "object" == typeof newValue && (newValue = getValueOf(newValue), 
                "object" == typeof newValue) ? !1 : newValue === oldValueOfValue || newValue !== newValue && oldValueOfValue !== oldValueOfValue;
            }
            function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var lastResult, inputExpressions = parsedExpression.$$inputs || (parsedExpression.$$inputs = collectExpressionInputs(parsedExpression.inputs, []));
                if (1 === inputExpressions.length) {
                    var oldInputValue = expressionInputDirtyCheck;
                    return inputExpressions = inputExpressions[0], scope.$watch(function(scope) {
                        var newInputValue = inputExpressions(scope);
                        return expressionInputDirtyCheck(newInputValue, oldInputValue) || (lastResult = parsedExpression(scope), 
                        oldInputValue = newInputValue && getValueOf(newInputValue)), lastResult;
                    }, listener, objectEquality);
                }
                for (var oldInputValueOfValues = [], i = 0, ii = inputExpressions.length; ii > i; i++) oldInputValueOfValues[i] = expressionInputDirtyCheck;
                return scope.$watch(function(scope) {
                    for (var changed = !1, i = 0, ii = inputExpressions.length; ii > i; i++) {
                        var newInputValue = inputExpressions[i](scope);
                        (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) && (oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue));
                    }
                    return changed && (lastResult = parsedExpression(scope)), lastResult;
                }, listener, objectEquality);
            }
            function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var unwatch, lastValue;
                return unwatch = scope.$watch(function(scope) {
                    return parsedExpression(scope);
                }, function(value, old, scope) {
                    lastValue = value, isFunction(listener) && listener.apply(this, arguments), isDefined(value) && scope.$$postDigest(function() {
                        isDefined(lastValue) && unwatch();
                    });
                }, objectEquality);
            }
            function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                function isAllDefined(value) {
                    var allDefined = !0;
                    return forEach(value, function(val) {
                        isDefined(val) || (allDefined = !1);
                    }), allDefined;
                }
                var unwatch, lastValue;
                return unwatch = scope.$watch(function(scope) {
                    return parsedExpression(scope);
                }, function(value, old, scope) {
                    lastValue = value, isFunction(listener) && listener.call(this, value, old, scope), 
                    isAllDefined(value) && scope.$$postDigest(function() {
                        isAllDefined(lastValue) && unwatch();
                    });
                }, objectEquality);
            }
            function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var unwatch;
                return unwatch = scope.$watch(function(scope) {
                    return parsedExpression(scope);
                }, function() {
                    isFunction(listener) && listener.apply(this, arguments), unwatch();
                }, objectEquality);
            }
            function addInterceptor(parsedExpression, interceptorFn) {
                if (!interceptorFn) return parsedExpression;
                var watchDelegate = parsedExpression.$$watchDelegate, regularWatch = watchDelegate !== oneTimeLiteralWatchDelegate && watchDelegate !== oneTimeWatchDelegate, fn = regularWatch ? function(scope, locals) {
                    var value = parsedExpression(scope, locals);
                    return interceptorFn(value, scope, locals);
                } : function(scope, locals) {
                    var value = parsedExpression(scope, locals), result = interceptorFn(value, scope, locals);
                    return isDefined(value) ? result : value;
                };
                return parsedExpression.$$watchDelegate && parsedExpression.$$watchDelegate !== inputsWatchDelegate ? fn.$$watchDelegate = parsedExpression.$$watchDelegate : interceptorFn.$stateful || (fn.$$watchDelegate = inputsWatchDelegate, 
                fn.inputs = [ parsedExpression ]), fn;
            }
            var $parseOptions = {
                csp: $sniffer.csp,
                expensiveChecks: !1
            }, $parseOptionsExpensive = {
                csp: $sniffer.csp,
                expensiveChecks: !0
            };
            return function(exp, interceptorFn, expensiveChecks) {
                var parsedExpression, oneTime, cacheKey;
                switch (typeof exp) {
                  case "string":
                    cacheKey = exp = exp.trim();
                    var cache = expensiveChecks ? cacheExpensive : cacheDefault;
                    if (parsedExpression = cache[cacheKey], !parsedExpression) {
                        ":" === exp.charAt(0) && ":" === exp.charAt(1) && (oneTime = !0, exp = exp.substring(2));
                        var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions, lexer = new Lexer(parseOptions), parser = new Parser(lexer, $filter, parseOptions);
                        parsedExpression = parser.parse(exp), parsedExpression.constant ? parsedExpression.$$watchDelegate = constantWatchDelegate : oneTime ? (parsedExpression = wrapSharedExpression(parsedExpression), 
                        parsedExpression.$$watchDelegate = parsedExpression.literal ? oneTimeLiteralWatchDelegate : oneTimeWatchDelegate) : parsedExpression.inputs && (parsedExpression.$$watchDelegate = inputsWatchDelegate), 
                        cache[cacheKey] = parsedExpression;
                    }
                    return addInterceptor(parsedExpression, interceptorFn);

                  case "function":
                    return addInterceptor(exp, interceptorFn);

                  default:
                    return addInterceptor(noop, interceptorFn);
                }
            };
        } ];
    }
    function $QProvider() {
        this.$get = [ "$rootScope", "$exceptionHandler", function($rootScope, $exceptionHandler) {
            return qFactory(function(callback) {
                $rootScope.$evalAsync(callback);
            }, $exceptionHandler);
        } ];
    }
    function $$QProvider() {
        this.$get = [ "$browser", "$exceptionHandler", function($browser, $exceptionHandler) {
            return qFactory(function(callback) {
                $browser.defer(callback);
            }, $exceptionHandler);
        } ];
    }
    function qFactory(nextTick, exceptionHandler) {
        function callOnce(self, resolveFn, rejectFn) {
            function wrap(fn) {
                return function(value) {
                    called || (called = !0, fn.call(self, value));
                };
            }
            var called = !1;
            return [ wrap(resolveFn), wrap(rejectFn) ];
        }
        function Promise() {
            this.$$state = {
                status: 0
            };
        }
        function simpleBind(context, fn) {
            return function(value) {
                fn.call(context, value);
            };
        }
        function processQueue(state) {
            var fn, promise, pending;
            pending = state.pending, state.processScheduled = !1, state.pending = undefined;
            for (var i = 0, ii = pending.length; ii > i; ++i) {
                promise = pending[i][0], fn = pending[i][state.status];
                try {
                    isFunction(fn) ? promise.resolve(fn(state.value)) : 1 === state.status ? promise.resolve(state.value) : promise.reject(state.value);
                } catch (e) {
                    promise.reject(e), exceptionHandler(e);
                }
            }
        }
        function scheduleProcessQueue(state) {
            !state.processScheduled && state.pending && (state.processScheduled = !0, nextTick(function() {
                processQueue(state);
            }));
        }
        function Deferred() {
            this.promise = new Promise(), this.resolve = simpleBind(this, this.resolve), this.reject = simpleBind(this, this.reject), 
            this.notify = simpleBind(this, this.notify);
        }
        function all(promises) {
            var deferred = new Deferred(), counter = 0, results = isArray(promises) ? [] : {};
            return forEach(promises, function(promise, key) {
                counter++, when(promise).then(function(value) {
                    results.hasOwnProperty(key) || (results[key] = value, --counter || deferred.resolve(results));
                }, function(reason) {
                    results.hasOwnProperty(key) || deferred.reject(reason);
                });
            }), 0 === counter && deferred.resolve(results), deferred.promise;
        }
        var $qMinErr = minErr("$q", TypeError), defer = function() {
            return new Deferred();
        };
        Promise.prototype = {
            then: function(onFulfilled, onRejected, progressBack) {
                var result = new Deferred();
                return this.$$state.pending = this.$$state.pending || [], this.$$state.pending.push([ result, onFulfilled, onRejected, progressBack ]), 
                this.$$state.status > 0 && scheduleProcessQueue(this.$$state), result.promise;
            },
            "catch": function(callback) {
                return this.then(null, callback);
            },
            "finally": function(callback, progressBack) {
                return this.then(function(value) {
                    return handleCallback(value, !0, callback);
                }, function(error) {
                    return handleCallback(error, !1, callback);
                }, progressBack);
            }
        }, Deferred.prototype = {
            resolve: function(val) {
                this.promise.$$state.status || (val === this.promise ? this.$$reject($qMinErr("qcycle", "Expected promise to be resolved with value other than itself '{0}'", val)) : this.$$resolve(val));
            },
            $$resolve: function(val) {
                var then, fns;
                fns = callOnce(this, this.$$resolve, this.$$reject);
                try {
                    (isObject(val) || isFunction(val)) && (then = val && val.then), isFunction(then) ? (this.promise.$$state.status = -1, 
                    then.call(val, fns[0], fns[1], this.notify)) : (this.promise.$$state.value = val, 
                    this.promise.$$state.status = 1, scheduleProcessQueue(this.promise.$$state));
                } catch (e) {
                    fns[1](e), exceptionHandler(e);
                }
            },
            reject: function(reason) {
                this.promise.$$state.status || this.$$reject(reason);
            },
            $$reject: function(reason) {
                this.promise.$$state.value = reason, this.promise.$$state.status = 2, scheduleProcessQueue(this.promise.$$state);
            },
            notify: function(progress) {
                var callbacks = this.promise.$$state.pending;
                this.promise.$$state.status <= 0 && callbacks && callbacks.length && nextTick(function() {
                    for (var callback, result, i = 0, ii = callbacks.length; ii > i; i++) {
                        result = callbacks[i][0], callback = callbacks[i][3];
                        try {
                            result.notify(isFunction(callback) ? callback(progress) : progress);
                        } catch (e) {
                            exceptionHandler(e);
                        }
                    }
                });
            }
        };
        var reject = function(reason) {
            var result = new Deferred();
            return result.reject(reason), result.promise;
        }, makePromise = function(value, resolved) {
            var result = new Deferred();
            return resolved ? result.resolve(value) : result.reject(value), result.promise;
        }, handleCallback = function(value, isResolved, callback) {
            var callbackOutput = null;
            try {
                isFunction(callback) && (callbackOutput = callback());
            } catch (e) {
                return makePromise(e, !1);
            }
            return isPromiseLike(callbackOutput) ? callbackOutput.then(function() {
                return makePromise(value, isResolved);
            }, function(error) {
                return makePromise(error, !1);
            }) : makePromise(value, isResolved);
        }, when = function(value, callback, errback, progressBack) {
            var result = new Deferred();
            return result.resolve(value), result.promise.then(callback, errback, progressBack);
        }, $Q = function Q(resolver) {
            function resolveFn(value) {
                deferred.resolve(value);
            }
            function rejectFn(reason) {
                deferred.reject(reason);
            }
            if (!isFunction(resolver)) throw $qMinErr("norslvr", "Expected resolverFn, got '{0}'", resolver);
            if (!(this instanceof Q)) return new Q(resolver);
            var deferred = new Deferred();
            return resolver(resolveFn, rejectFn), deferred.promise;
        };
        return $Q.defer = defer, $Q.reject = reject, $Q.when = when, $Q.all = all, $Q;
    }
    function $$RAFProvider() {
        this.$get = [ "$window", "$timeout", function($window, $timeout) {
            var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame, cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame, rafSupported = !!requestAnimationFrame, raf = rafSupported ? function(fn) {
                var id = requestAnimationFrame(fn);
                return function() {
                    cancelAnimationFrame(id);
                };
            } : function(fn) {
                var timer = $timeout(fn, 16.66, !1);
                return function() {
                    $timeout.cancel(timer);
                };
            };
            return raf.supported = rafSupported, raf;
        } ];
    }
    function $RootScopeProvider() {
        var TTL = 10, $rootScopeMinErr = minErr("$rootScope"), lastDirtyWatch = null, applyAsyncId = null;
        this.digestTtl = function(value) {
            return arguments.length && (TTL = value), TTL;
        }, this.$get = [ "$injector", "$exceptionHandler", "$parse", "$browser", function($injector, $exceptionHandler, $parse, $browser) {
            function Scope() {
                this.$id = nextUid(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, 
                this.$root = this, this.$$destroyed = !1, this.$$listeners = {}, this.$$listenerCount = {}, 
                this.$$isolateBindings = null;
            }
            function beginPhase(phase) {
                if ($rootScope.$$phase) throw $rootScopeMinErr("inprog", "{0} already in progress", $rootScope.$$phase);
                $rootScope.$$phase = phase;
            }
            function clearPhase() {
                $rootScope.$$phase = null;
            }
            function decrementListenerCount(current, count, name) {
                do current.$$listenerCount[name] -= count, 0 === current.$$listenerCount[name] && delete current.$$listenerCount[name]; while (current = current.$parent);
            }
            function initWatchVal() {}
            function flushApplyAsync() {
                for (;applyAsyncQueue.length; ) try {
                    applyAsyncQueue.shift()();
                } catch (e) {
                    $exceptionHandler(e);
                }
                applyAsyncId = null;
            }
            function scheduleApplyAsync() {
                null === applyAsyncId && (applyAsyncId = $browser.defer(function() {
                    $rootScope.$apply(flushApplyAsync);
                }));
            }
            Scope.prototype = {
                constructor: Scope,
                $new: function(isolate, parent) {
                    function destroyChild() {
                        child.$$destroyed = !0;
                    }
                    var child;
                    return parent = parent || this, isolate ? (child = new Scope(), child.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = function() {
                        this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null, 
                        this.$$listeners = {}, this.$$listenerCount = {}, this.$id = nextUid(), this.$$ChildScope = null;
                    }, this.$$ChildScope.prototype = this), child = new this.$$ChildScope()), child.$parent = parent, 
                    child.$$prevSibling = parent.$$childTail, parent.$$childHead ? (parent.$$childTail.$$nextSibling = child, 
                    parent.$$childTail = child) : parent.$$childHead = parent.$$childTail = child, (isolate || parent != this) && child.$on("$destroy", destroyChild), 
                    child;
                },
                $watch: function(watchExp, listener, objectEquality) {
                    var get = $parse(watchExp);
                    if (get.$$watchDelegate) return get.$$watchDelegate(this, listener, objectEquality, get);
                    var scope = this, array = scope.$$watchers, watcher = {
                        fn: listener,
                        last: initWatchVal,
                        get: get,
                        exp: watchExp,
                        eq: !!objectEquality
                    };
                    return lastDirtyWatch = null, isFunction(listener) || (watcher.fn = noop), array || (array = scope.$$watchers = []), 
                    array.unshift(watcher), function() {
                        arrayRemove(array, watcher), lastDirtyWatch = null;
                    };
                },
                $watchGroup: function(watchExpressions, listener) {
                    function watchGroupAction() {
                        changeReactionScheduled = !1, firstRun ? (firstRun = !1, listener(newValues, newValues, self)) : listener(newValues, oldValues, self);
                    }
                    var oldValues = new Array(watchExpressions.length), newValues = new Array(watchExpressions.length), deregisterFns = [], self = this, changeReactionScheduled = !1, firstRun = !0;
                    if (!watchExpressions.length) {
                        var shouldCall = !0;
                        return self.$evalAsync(function() {
                            shouldCall && listener(newValues, newValues, self);
                        }), function() {
                            shouldCall = !1;
                        };
                    }
                    return 1 === watchExpressions.length ? this.$watch(watchExpressions[0], function(value, oldValue, scope) {
                        newValues[0] = value, oldValues[0] = oldValue, listener(newValues, value === oldValue ? newValues : oldValues, scope);
                    }) : (forEach(watchExpressions, function(expr, i) {
                        var unwatchFn = self.$watch(expr, function(value, oldValue) {
                            newValues[i] = value, oldValues[i] = oldValue, changeReactionScheduled || (changeReactionScheduled = !0, 
                            self.$evalAsync(watchGroupAction));
                        });
                        deregisterFns.push(unwatchFn);
                    }), function() {
                        for (;deregisterFns.length; ) deregisterFns.shift()();
                    });
                },
                $watchCollection: function(obj, listener) {
                    function $watchCollectionInterceptor(_value) {
                        newValue = _value;
                        var newLength, key, bothNaN, newItem, oldItem;
                        if (!isUndefined(newValue)) {
                            if (isObject(newValue)) if (isArrayLike(newValue)) {
                                oldValue !== internalArray && (oldValue = internalArray, oldLength = oldValue.length = 0, 
                                changeDetected++), newLength = newValue.length, oldLength !== newLength && (changeDetected++, 
                                oldValue.length = oldLength = newLength);
                                for (var i = 0; newLength > i; i++) oldItem = oldValue[i], newItem = newValue[i], 
                                bothNaN = oldItem !== oldItem && newItem !== newItem, bothNaN || oldItem === newItem || (changeDetected++, 
                                oldValue[i] = newItem);
                            } else {
                                oldValue !== internalObject && (oldValue = internalObject = {}, oldLength = 0, changeDetected++), 
                                newLength = 0;
                                for (key in newValue) newValue.hasOwnProperty(key) && (newLength++, newItem = newValue[key], 
                                oldItem = oldValue[key], key in oldValue ? (bothNaN = oldItem !== oldItem && newItem !== newItem, 
                                bothNaN || oldItem === newItem || (changeDetected++, oldValue[key] = newItem)) : (oldLength++, 
                                oldValue[key] = newItem, changeDetected++));
                                if (oldLength > newLength) {
                                    changeDetected++;
                                    for (key in oldValue) newValue.hasOwnProperty(key) || (oldLength--, delete oldValue[key]);
                                }
                            } else oldValue !== newValue && (oldValue = newValue, changeDetected++);
                            return changeDetected;
                        }
                    }
                    function $watchCollectionAction() {
                        if (initRun ? (initRun = !1, listener(newValue, newValue, self)) : listener(newValue, veryOldValue, self), 
                        trackVeryOldValue) if (isObject(newValue)) if (isArrayLike(newValue)) {
                            veryOldValue = new Array(newValue.length);
                            for (var i = 0; i < newValue.length; i++) veryOldValue[i] = newValue[i];
                        } else {
                            veryOldValue = {};
                            for (var key in newValue) hasOwnProperty.call(newValue, key) && (veryOldValue[key] = newValue[key]);
                        } else veryOldValue = newValue;
                    }
                    $watchCollectionInterceptor.$stateful = !0;
                    var newValue, oldValue, veryOldValue, self = this, trackVeryOldValue = listener.length > 1, changeDetected = 0, changeDetector = $parse(obj, $watchCollectionInterceptor), internalArray = [], internalObject = {}, initRun = !0, oldLength = 0;
                    return this.$watch(changeDetector, $watchCollectionAction);
                },
                $digest: function() {
                    var watch, value, last, watchers, length, dirty, next, current, logIdx, asyncTask, ttl = TTL, target = this, watchLog = [];
                    beginPhase("$digest"), $browser.$$checkUrlChange(), this === $rootScope && null !== applyAsyncId && ($browser.defer.cancel(applyAsyncId), 
                    flushApplyAsync()), lastDirtyWatch = null;
                    do {
                        for (dirty = !1, current = target; asyncQueue.length; ) {
                            try {
                                asyncTask = asyncQueue.shift(), asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals);
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                            lastDirtyWatch = null;
                        }
                        traverseScopesLoop: do {
                            if (watchers = current.$$watchers) for (length = watchers.length; length--; ) try {
                                if (watch = watchers[length]) if ((value = watch.get(current)) === (last = watch.last) || (watch.eq ? equals(value, last) : "number" == typeof value && "number" == typeof last && isNaN(value) && isNaN(last))) {
                                    if (watch === lastDirtyWatch) {
                                        dirty = !1;
                                        break traverseScopesLoop;
                                    }
                                } else dirty = !0, lastDirtyWatch = watch, watch.last = watch.eq ? copy(value, null) : value, 
                                watch.fn(value, last === initWatchVal ? value : last, current), 5 > ttl && (logIdx = 4 - ttl, 
                                watchLog[logIdx] || (watchLog[logIdx] = []), watchLog[logIdx].push({
                                    msg: isFunction(watch.exp) ? "fn: " + (watch.exp.name || watch.exp.toString()) : watch.exp,
                                    newVal: value,
                                    oldVal: last
                                }));
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                            if (!(next = current.$$childHead || current !== target && current.$$nextSibling)) for (;current !== target && !(next = current.$$nextSibling); ) current = current.$parent;
                        } while (current = next);
                        if ((dirty || asyncQueue.length) && !ttl--) throw clearPhase(), $rootScopeMinErr("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", TTL, watchLog);
                    } while (dirty || asyncQueue.length);
                    for (clearPhase(); postDigestQueue.length; ) try {
                        postDigestQueue.shift()();
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                },
                $destroy: function() {
                    if (!this.$$destroyed) {
                        var parent = this.$parent;
                        if (this.$broadcast("$destroy"), this.$$destroyed = !0, this !== $rootScope) {
                            for (var eventName in this.$$listenerCount) decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
                            parent.$$childHead == this && (parent.$$childHead = this.$$nextSibling), parent.$$childTail == this && (parent.$$childTail = this.$$prevSibling), 
                            this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), 
                            this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop, 
                            this.$on = this.$watch = this.$watchGroup = function() {
                                return noop;
                            }, this.$$listeners = {}, this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null;
                        }
                    }
                },
                $eval: function(expr, locals) {
                    return $parse(expr)(this, locals);
                },
                $evalAsync: function(expr, locals) {
                    $rootScope.$$phase || asyncQueue.length || $browser.defer(function() {
                        asyncQueue.length && $rootScope.$digest();
                    }), asyncQueue.push({
                        scope: this,
                        expression: expr,
                        locals: locals
                    });
                },
                $$postDigest: function(fn) {
                    postDigestQueue.push(fn);
                },
                $apply: function(expr) {
                    try {
                        return beginPhase("$apply"), this.$eval(expr);
                    } catch (e) {
                        $exceptionHandler(e);
                    } finally {
                        clearPhase();
                        try {
                            $rootScope.$digest();
                        } catch (e) {
                            throw $exceptionHandler(e), e;
                        }
                    }
                },
                $applyAsync: function(expr) {
                    function $applyAsyncExpression() {
                        scope.$eval(expr);
                    }
                    var scope = this;
                    expr && applyAsyncQueue.push($applyAsyncExpression), scheduleApplyAsync();
                },
                $on: function(name, listener) {
                    var namedListeners = this.$$listeners[name];
                    namedListeners || (this.$$listeners[name] = namedListeners = []), namedListeners.push(listener);
                    var current = this;
                    do current.$$listenerCount[name] || (current.$$listenerCount[name] = 0), current.$$listenerCount[name]++; while (current = current.$parent);
                    var self = this;
                    return function() {
                        var indexOfListener = namedListeners.indexOf(listener);
                        -1 !== indexOfListener && (namedListeners[indexOfListener] = null, decrementListenerCount(self, 1, name));
                    };
                },
                $emit: function(name) {
                    var namedListeners, i, length, empty = [], scope = this, stopPropagation = !1, event = {
                        name: name,
                        targetScope: scope,
                        stopPropagation: function() {
                            stopPropagation = !0;
                        },
                        preventDefault: function() {
                            event.defaultPrevented = !0;
                        },
                        defaultPrevented: !1
                    }, listenerArgs = concat([ event ], arguments, 1);
                    do {
                        for (namedListeners = scope.$$listeners[name] || empty, event.currentScope = scope, 
                        i = 0, length = namedListeners.length; length > i; i++) if (namedListeners[i]) try {
                            namedListeners[i].apply(null, listenerArgs);
                        } catch (e) {
                            $exceptionHandler(e);
                        } else namedListeners.splice(i, 1), i--, length--;
                        if (stopPropagation) return event.currentScope = null, event;
                        scope = scope.$parent;
                    } while (scope);
                    return event.currentScope = null, event;
                },
                $broadcast: function(name) {
                    var target = this, current = target, next = target, event = {
                        name: name,
                        targetScope: target,
                        preventDefault: function() {
                            event.defaultPrevented = !0;
                        },
                        defaultPrevented: !1
                    };
                    if (!target.$$listenerCount[name]) return event;
                    for (var listeners, i, length, listenerArgs = concat([ event ], arguments, 1); current = next; ) {
                        for (event.currentScope = current, listeners = current.$$listeners[name] || [], 
                        i = 0, length = listeners.length; length > i; i++) if (listeners[i]) try {
                            listeners[i].apply(null, listenerArgs);
                        } catch (e) {
                            $exceptionHandler(e);
                        } else listeners.splice(i, 1), i--, length--;
                        if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling)) for (;current !== target && !(next = current.$$nextSibling); ) current = current.$parent;
                    }
                    return event.currentScope = null, event;
                }
            };
            var $rootScope = new Scope(), asyncQueue = $rootScope.$$asyncQueue = [], postDigestQueue = $rootScope.$$postDigestQueue = [], applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
            return $rootScope;
        } ];
    }
    function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (aHrefSanitizationWhitelist = regexp, this) : aHrefSanitizationWhitelist;
        }, this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (imgSrcSanitizationWhitelist = regexp, this) : imgSrcSanitizationWhitelist;
        }, this.$get = function() {
            return function(uri, isImage) {
                var normalizedVal, regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
                return normalizedVal = urlResolve(uri).href, "" === normalizedVal || normalizedVal.match(regex) ? uri : "unsafe:" + normalizedVal;
            };
        };
    }
    function adjustMatcher(matcher) {
        if ("self" === matcher) return matcher;
        if (isString(matcher)) {
            if (matcher.indexOf("***") > -1) throw $sceMinErr("iwcard", "Illegal sequence *** in string matcher.  String: {0}", matcher);
            return matcher = escapeForRegexp(matcher).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), 
            new RegExp("^" + matcher + "$");
        }
        if (isRegExp(matcher)) return new RegExp("^" + matcher.source + "$");
        throw $sceMinErr("imatcher", 'Matchers may only be "self", string patterns or RegExp objects');
    }
    function adjustMatchers(matchers) {
        var adjustedMatchers = [];
        return isDefined(matchers) && forEach(matchers, function(matcher) {
            adjustedMatchers.push(adjustMatcher(matcher));
        }), adjustedMatchers;
    }
    function $SceDelegateProvider() {
        this.SCE_CONTEXTS = SCE_CONTEXTS;
        var resourceUrlWhitelist = [ "self" ], resourceUrlBlacklist = [];
        this.resourceUrlWhitelist = function(value) {
            return arguments.length && (resourceUrlWhitelist = adjustMatchers(value)), resourceUrlWhitelist;
        }, this.resourceUrlBlacklist = function(value) {
            return arguments.length && (resourceUrlBlacklist = adjustMatchers(value)), resourceUrlBlacklist;
        }, this.$get = [ "$injector", function($injector) {
            function matchUrl(matcher, parsedUrl) {
                return "self" === matcher ? urlIsSameOrigin(parsedUrl) : !!matcher.exec(parsedUrl.href);
            }
            function isResourceUrlAllowedByPolicy(url) {
                var i, n, parsedUrl = urlResolve(url.toString()), allowed = !1;
                for (i = 0, n = resourceUrlWhitelist.length; n > i; i++) if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                    allowed = !0;
                    break;
                }
                if (allowed) for (i = 0, n = resourceUrlBlacklist.length; n > i; i++) if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                    allowed = !1;
                    break;
                }
                return allowed;
            }
            function generateHolderType(Base) {
                var holderType = function(trustedValue) {
                    this.$$unwrapTrustedValue = function() {
                        return trustedValue;
                    };
                };
                return Base && (holderType.prototype = new Base()), holderType.prototype.valueOf = function() {
                    return this.$$unwrapTrustedValue();
                }, holderType.prototype.toString = function() {
                    return this.$$unwrapTrustedValue().toString();
                }, holderType;
            }
            function trustAs(type, trustedValue) {
                var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                if (!Constructor) throw $sceMinErr("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", type, trustedValue);
                if (null === trustedValue || trustedValue === undefined || "" === trustedValue) return trustedValue;
                if ("string" != typeof trustedValue) throw $sceMinErr("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", type);
                return new Constructor(trustedValue);
            }
            function valueOf(maybeTrusted) {
                return maybeTrusted instanceof trustedValueHolderBase ? maybeTrusted.$$unwrapTrustedValue() : maybeTrusted;
            }
            function getTrusted(type, maybeTrusted) {
                if (null === maybeTrusted || maybeTrusted === undefined || "" === maybeTrusted) return maybeTrusted;
                var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                if (constructor && maybeTrusted instanceof constructor) return maybeTrusted.$$unwrapTrustedValue();
                if (type === SCE_CONTEXTS.RESOURCE_URL) {
                    if (isResourceUrlAllowedByPolicy(maybeTrusted)) return maybeTrusted;
                    throw $sceMinErr("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", maybeTrusted.toString());
                }
                if (type === SCE_CONTEXTS.HTML) return htmlSanitizer(maybeTrusted);
                throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
            }
            var htmlSanitizer = function() {
                throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
            };
            $injector.has("$sanitize") && (htmlSanitizer = $injector.get("$sanitize"));
            var trustedValueHolderBase = generateHolderType(), byType = {};
            return byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase), 
            byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase), 
            byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]), 
            {
                trustAs: trustAs,
                getTrusted: getTrusted,
                valueOf: valueOf
            };
        } ];
    }
    function $SceProvider() {
        var enabled = !0;
        this.enabled = function(value) {
            return arguments.length && (enabled = !!value), enabled;
        }, this.$get = [ "$parse", "$sceDelegate", function($parse, $sceDelegate) {
            if (enabled && 8 > msie) throw $sceMinErr("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
            var sce = shallowCopy(SCE_CONTEXTS);
            sce.isEnabled = function() {
                return enabled;
            }, sce.trustAs = $sceDelegate.trustAs, sce.getTrusted = $sceDelegate.getTrusted, 
            sce.valueOf = $sceDelegate.valueOf, enabled || (sce.trustAs = sce.getTrusted = function(type, value) {
                return value;
            }, sce.valueOf = identity), sce.parseAs = function(type, expr) {
                var parsed = $parse(expr);
                return parsed.literal && parsed.constant ? parsed : $parse(expr, function(value) {
                    return sce.getTrusted(type, value);
                });
            };
            var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
            return forEach(SCE_CONTEXTS, function(enumValue, name) {
                var lName = lowercase(name);
                sce[camelCase("parse_as_" + lName)] = function(expr) {
                    return parse(enumValue, expr);
                }, sce[camelCase("get_trusted_" + lName)] = function(value) {
                    return getTrusted(enumValue, value);
                }, sce[camelCase("trust_as_" + lName)] = function(value) {
                    return trustAs(enumValue, value);
                };
            }), sce;
        } ];
    }
    function $SnifferProvider() {
        this.$get = [ "$window", "$document", function($window, $document) {
            var vendorPrefix, match, eventSupport = {}, android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document = $document[0] || {}, vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/, bodyStyle = document.body && document.body.style, transitions = !1, animations = !1;
            if (bodyStyle) {
                for (var prop in bodyStyle) if (match = vendorRegex.exec(prop)) {
                    vendorPrefix = match[0], vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                    break;
                }
                vendorPrefix || (vendorPrefix = "WebkitOpacity" in bodyStyle && "webkit"), transitions = !!("transition" in bodyStyle || vendorPrefix + "Transition" in bodyStyle), 
                animations = !!("animation" in bodyStyle || vendorPrefix + "Animation" in bodyStyle), 
                !android || transitions && animations || (transitions = isString(document.body.style.webkitTransition), 
                animations = isString(document.body.style.webkitAnimation));
            }
            return {
                history: !(!$window.history || !$window.history.pushState || 4 > android || boxee),
                hasEvent: function(event) {
                    if ("input" === event && 11 >= msie) return !1;
                    if (isUndefined(eventSupport[event])) {
                        var divElm = document.createElement("div");
                        eventSupport[event] = "on" + event in divElm;
                    }
                    return eventSupport[event];
                },
                csp: csp(),
                vendorPrefix: vendorPrefix,
                transitions: transitions,
                animations: animations,
                android: android
            };
        } ];
    }
    function $TemplateRequestProvider() {
        this.$get = [ "$templateCache", "$http", "$q", function($templateCache, $http, $q) {
            function handleRequestFn(tpl, ignoreRequestError) {
                function handleError(resp) {
                    if (!ignoreRequestError) throw $compileMinErr("tpload", "Failed to load template: {0}", tpl);
                    return $q.reject(resp);
                }
                handleRequestFn.totalPendingRequests++;
                var transformResponse = $http.defaults && $http.defaults.transformResponse;
                isArray(transformResponse) ? transformResponse = transformResponse.filter(function(transformer) {
                    return transformer !== defaultHttpResponseTransform;
                }) : transformResponse === defaultHttpResponseTransform && (transformResponse = null);
                var httpOptions = {
                    cache: $templateCache,
                    transformResponse: transformResponse
                };
                return $http.get(tpl, httpOptions)["finally"](function() {
                    handleRequestFn.totalPendingRequests--;
                }).then(function(response) {
                    return response.data;
                }, handleError);
            }
            return handleRequestFn.totalPendingRequests = 0, handleRequestFn;
        } ];
    }
    function $$TestabilityProvider() {
        this.$get = [ "$rootScope", "$browser", "$location", function($rootScope, $browser, $location) {
            var testability = {};
            return testability.findBindings = function(element, expression, opt_exactMatch) {
                var bindings = element.getElementsByClassName("ng-binding"), matches = [];
                return forEach(bindings, function(binding) {
                    var dataBinding = angular.element(binding).data("$binding");
                    dataBinding && forEach(dataBinding, function(bindingName) {
                        if (opt_exactMatch) {
                            var matcher = new RegExp("(^|\\s)" + escapeForRegexp(expression) + "(\\s|\\||$)");
                            matcher.test(bindingName) && matches.push(binding);
                        } else -1 != bindingName.indexOf(expression) && matches.push(binding);
                    });
                }), matches;
            }, testability.findModels = function(element, expression, opt_exactMatch) {
                for (var prefixes = [ "ng-", "data-ng-", "ng\\:" ], p = 0; p < prefixes.length; ++p) {
                    var attributeEquals = opt_exactMatch ? "=" : "*=", selector = "[" + prefixes[p] + "model" + attributeEquals + '"' + expression + '"]', elements = element.querySelectorAll(selector);
                    if (elements.length) return elements;
                }
            }, testability.getLocation = function() {
                return $location.url();
            }, testability.setLocation = function(url) {
                url !== $location.url() && ($location.url(url), $rootScope.$digest());
            }, testability.whenStable = function(callback) {
                $browser.notifyWhenNoOutstandingRequests(callback);
            }, testability;
        } ];
    }
    function $TimeoutProvider() {
        this.$get = [ "$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function($rootScope, $browser, $q, $$q, $exceptionHandler) {
            function timeout(fn, delay, invokeApply) {
                var timeoutId, skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise;
                return timeoutId = $browser.defer(function() {
                    try {
                        deferred.resolve(fn());
                    } catch (e) {
                        deferred.reject(e), $exceptionHandler(e);
                    } finally {
                        delete deferreds[promise.$$timeoutId];
                    }
                    skipApply || $rootScope.$apply();
                }, delay), promise.$$timeoutId = timeoutId, deferreds[timeoutId] = deferred, promise;
            }
            var deferreds = {};
            return timeout.cancel = function(promise) {
                return promise && promise.$$timeoutId in deferreds ? (deferreds[promise.$$timeoutId].reject("canceled"), 
                delete deferreds[promise.$$timeoutId], $browser.defer.cancel(promise.$$timeoutId)) : !1;
            }, timeout;
        } ];
    }
    function urlResolve(url) {
        var href = url;
        return msie && (urlParsingNode.setAttribute("href", href), href = urlParsingNode.href), 
        urlParsingNode.setAttribute("href", href), {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: "/" === urlParsingNode.pathname.charAt(0) ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
    }
    function urlIsSameOrigin(requestUrl) {
        var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
        return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
    }
    function $WindowProvider() {
        this.$get = valueFn(window);
    }
    function $FilterProvider($provide) {
        function register(name, factory) {
            if (isObject(name)) {
                var filters = {};
                return forEach(name, function(filter, key) {
                    filters[key] = register(key, filter);
                }), filters;
            }
            return $provide.factory(name + suffix, factory);
        }
        var suffix = "Filter";
        this.register = register, this.$get = [ "$injector", function($injector) {
            return function(name) {
                return $injector.get(name + suffix);
            };
        } ], register("currency", currencyFilter), register("date", dateFilter), register("filter", filterFilter), 
        register("json", jsonFilter), register("limitTo", limitToFilter), register("lowercase", lowercaseFilter), 
        register("number", numberFilter), register("orderBy", orderByFilter), register("uppercase", uppercaseFilter);
    }
    function filterFilter() {
        return function(array, expression, comparator) {
            if (!isArray(array)) return array;
            var predicateFn, matchAgainstAnyProp;
            switch (typeof expression) {
              case "function":
                predicateFn = expression;
                break;

              case "boolean":
              case "number":
              case "string":
                matchAgainstAnyProp = !0;

              case "object":
                predicateFn = createPredicateFn(expression, comparator, matchAgainstAnyProp);
                break;

              default:
                return array;
            }
            return array.filter(predicateFn);
        };
    }
    function createPredicateFn(expression, comparator, matchAgainstAnyProp) {
        var predicateFn, shouldMatchPrimitives = isObject(expression) && "$" in expression;
        return comparator === !0 ? comparator = equals : isFunction(comparator) || (comparator = function(actual, expected) {
            return isObject(actual) || isObject(expected) ? !1 : (actual = lowercase("" + actual), 
            expected = lowercase("" + expected), -1 !== actual.indexOf(expected));
        }), predicateFn = function(item) {
            return shouldMatchPrimitives && !isObject(item) ? deepCompare(item, expression.$, comparator, !1) : deepCompare(item, expression, comparator, matchAgainstAnyProp);
        };
    }
    function deepCompare(actual, expected, comparator, matchAgainstAnyProp, dontMatchWholeObject) {
        var actualType = typeof actual, expectedType = typeof expected;
        if ("string" === expectedType && "!" === expected.charAt(0)) return !deepCompare(actual, expected.substring(1), comparator, matchAgainstAnyProp);
        if (isArray(actual)) return actual.some(function(item) {
            return deepCompare(item, expected, comparator, matchAgainstAnyProp);
        });
        switch (actualType) {
          case "object":
            var key;
            if (matchAgainstAnyProp) {
                for (key in actual) if ("$" !== key.charAt(0) && deepCompare(actual[key], expected, comparator, !0)) return !0;
                return dontMatchWholeObject ? !1 : deepCompare(actual, expected, comparator, !1);
            }
            if ("object" === expectedType) {
                for (key in expected) {
                    var expectedVal = expected[key];
                    if (!isFunction(expectedVal)) {
                        var matchAnyProperty = "$" === key, actualVal = matchAnyProperty ? actual : actual[key];
                        if (!deepCompare(actualVal, expectedVal, comparator, matchAnyProperty, matchAnyProperty)) return !1;
                    }
                }
                return !0;
            }
            return comparator(actual, expected);

          case "function":
            return !1;

          default:
            return comparator(actual, expected);
        }
    }
    function currencyFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(amount, currencySymbol, fractionSize) {
            return isUndefined(currencySymbol) && (currencySymbol = formats.CURRENCY_SYM), isUndefined(fractionSize) && (fractionSize = formats.PATTERNS[1].maxFrac), 
            null == amount ? amount : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).replace(/\u00A4/g, currencySymbol);
        };
    }
    function numberFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(number, fractionSize) {
            return null == number ? number : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
        };
    }
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
        if (!isFinite(number) || isObject(number)) return "";
        var isNegative = 0 > number;
        number = Math.abs(number);
        var numStr = number + "", formatedText = "", parts = [], hasExponent = !1;
        if (-1 !== numStr.indexOf("e")) {
            var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
            match && "-" == match[2] && match[3] > fractionSize + 1 ? number = 0 : (formatedText = numStr, 
            hasExponent = !0);
        }
        if (hasExponent) fractionSize > 0 && 1 > number && (formatedText = number.toFixed(fractionSize), 
        number = parseFloat(formatedText)); else {
            var fractionLen = (numStr.split(DECIMAL_SEP)[1] || "").length;
            isUndefined(fractionSize) && (fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac)), 
            number = +(Math.round(+(number.toString() + "e" + fractionSize)).toString() + "e" + -fractionSize);
            var fraction = ("" + number).split(DECIMAL_SEP), whole = fraction[0];
            fraction = fraction[1] || "";
            var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
            if (whole.length >= lgroup + group) for (pos = whole.length - lgroup, i = 0; pos > i; i++) (pos - i) % group === 0 && 0 !== i && (formatedText += groupSep), 
            formatedText += whole.charAt(i);
            for (i = pos; i < whole.length; i++) (whole.length - i) % lgroup === 0 && 0 !== i && (formatedText += groupSep), 
            formatedText += whole.charAt(i);
            for (;fraction.length < fractionSize; ) fraction += "0";
            fractionSize && "0" !== fractionSize && (formatedText += decimalSep + fraction.substr(0, fractionSize));
        }
        return 0 === number && (isNegative = !1), parts.push(isNegative ? pattern.negPre : pattern.posPre, formatedText, isNegative ? pattern.negSuf : pattern.posSuf), 
        parts.join("");
    }
    function padNumber(num, digits, trim) {
        var neg = "";
        for (0 > num && (neg = "-", num = -num), num = "" + num; num.length < digits; ) num = "0" + num;
        return trim && (num = num.substr(num.length - digits)), neg + num;
    }
    function dateGetter(name, size, offset, trim) {
        return offset = offset || 0, function(date) {
            var value = date["get" + name]();
            return (offset > 0 || value > -offset) && (value += offset), 0 === value && -12 == offset && (value = 12), 
            padNumber(value, size, trim);
        };
    }
    function dateStrGetter(name, shortForm) {
        return function(date, formats) {
            var value = date["get" + name](), get = uppercase(shortForm ? "SHORT" + name : name);
            return formats[get][value];
        };
    }
    function timeZoneGetter(date) {
        var zone = -1 * date.getTimezoneOffset(), paddedZone = zone >= 0 ? "+" : "";
        return paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
    }
    function getFirstThursdayOfYear(year) {
        var dayOfWeekOnFirst = new Date(year, 0, 1).getDay();
        return new Date(year, 0, (4 >= dayOfWeekOnFirst ? 5 : 12) - dayOfWeekOnFirst);
    }
    function getThursdayThisWeek(datetime) {
        return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay()));
    }
    function weekGetter(size) {
        return function(date) {
            var firstThurs = getFirstThursdayOfYear(date.getFullYear()), thisThurs = getThursdayThisWeek(date), diff = +thisThurs - +firstThurs, result = 1 + Math.round(diff / 6048e5);
            return padNumber(result, size);
        };
    }
    function ampmGetter(date, formats) {
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }
    function dateFilter($locale) {
        function jsonStringToDate(string) {
            var match;
            if (match = string.match(R_ISO8601_STR)) {
                var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
                match[9] && (tzHour = int(match[9] + match[10]), tzMin = int(match[9] + match[11])), 
                dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
                var h = int(match[4] || 0) - tzHour, m = int(match[5] || 0) - tzMin, s = int(match[6] || 0), ms = Math.round(1e3 * parseFloat("0." + (match[7] || 0)));
                return timeSetter.call(date, h, m, s, ms), date;
            }
            return string;
        }
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(date, format, timezone) {
            var fn, match, text = "", parts = [];
            if (format = format || "mediumDate", format = $locale.DATETIME_FORMATS[format] || format, 
            isString(date) && (date = NUMBER_STRING.test(date) ? int(date) : jsonStringToDate(date)), 
            isNumber(date) && (date = new Date(date)), !isDate(date)) return date;
            for (;format; ) match = DATE_FORMATS_SPLIT.exec(format), match ? (parts = concat(parts, match, 1), 
            format = parts.pop()) : (parts.push(format), format = null);
            return timezone && "UTC" === timezone && (date = new Date(date.getTime()), date.setMinutes(date.getMinutes() + date.getTimezoneOffset())), 
            forEach(parts, function(value) {
                fn = DATE_FORMATS[value], text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'");
            }), text;
        };
    }
    function jsonFilter() {
        return function(object, spacing) {
            return isUndefined(spacing) && (spacing = 2), toJson(object, spacing);
        };
    }
    function limitToFilter() {
        return function(input, limit) {
            return isNumber(input) && (input = input.toString()), isArray(input) || isString(input) ? (limit = 1/0 === Math.abs(Number(limit)) ? Number(limit) : int(limit), 
            limit ? limit > 0 ? input.slice(0, limit) : input.slice(limit) : isString(input) ? "" : []) : input;
        };
    }
    function orderByFilter($parse) {
        return function(array, sortPredicate, reverseOrder) {
            function comparator(o1, o2) {
                for (var i = 0; i < sortPredicate.length; i++) {
                    var comp = sortPredicate[i](o1, o2);
                    if (0 !== comp) return comp;
                }
                return 0;
            }
            function reverseComparator(comp, descending) {
                return descending ? function(a, b) {
                    return comp(b, a);
                } : comp;
            }
            function isPrimitive(value) {
                switch (typeof value) {
                  case "number":
                  case "boolean":
                  case "string":
                    return !0;

                  default:
                    return !1;
                }
            }
            function objectToString(value) {
                return null === value ? "null" : "function" == typeof value.valueOf && (value = value.valueOf(), 
                isPrimitive(value)) ? value : "function" == typeof value.toString && (value = value.toString(), 
                isPrimitive(value)) ? value : "";
            }
            function compare(v1, v2) {
                var t1 = typeof v1, t2 = typeof v2;
                return t1 === t2 && "object" === t1 && (v1 = objectToString(v1), v2 = objectToString(v2)), 
                t1 === t2 ? ("string" === t1 && (v1 = v1.toLowerCase(), v2 = v2.toLowerCase()), 
                v1 === v2 ? 0 : v2 > v1 ? -1 : 1) : t2 > t1 ? -1 : 1;
            }
            return isArrayLike(array) ? (sortPredicate = isArray(sortPredicate) ? sortPredicate : [ sortPredicate ], 
            0 === sortPredicate.length && (sortPredicate = [ "+" ]), sortPredicate = sortPredicate.map(function(predicate) {
                var descending = !1, get = predicate || identity;
                if (isString(predicate)) {
                    if (("+" == predicate.charAt(0) || "-" == predicate.charAt(0)) && (descending = "-" == predicate.charAt(0), 
                    predicate = predicate.substring(1)), "" === predicate) return reverseComparator(compare, descending);
                    if (get = $parse(predicate), get.constant) {
                        var key = get();
                        return reverseComparator(function(a, b) {
                            return compare(a[key], b[key]);
                        }, descending);
                    }
                }
                return reverseComparator(function(a, b) {
                    return compare(get(a), get(b));
                }, descending);
            }), slice.call(array).sort(reverseComparator(comparator, reverseOrder))) : array;
        };
    }
    function ngDirective(directive) {
        return isFunction(directive) && (directive = {
            link: directive
        }), directive.restrict = directive.restrict || "AC", valueFn(directive);
    }
    function nullFormRenameControl(control, name) {
        control.$name = name;
    }
    function FormController(element, attrs, $scope, $animate, $interpolate) {
        var form = this, controls = [], parentForm = form.$$parentForm = element.parent().controller("form") || nullFormCtrl;
        form.$error = {}, form.$$success = {}, form.$pending = undefined, form.$name = $interpolate(attrs.name || attrs.ngForm || "")($scope), 
        form.$dirty = !1, form.$pristine = !0, form.$valid = !0, form.$invalid = !1, form.$submitted = !1, 
        parentForm.$addControl(form), form.$rollbackViewValue = function() {
            forEach(controls, function(control) {
                control.$rollbackViewValue();
            });
        }, form.$commitViewValue = function() {
            forEach(controls, function(control) {
                control.$commitViewValue();
            });
        }, form.$addControl = function(control) {
            assertNotHasOwnProperty(control.$name, "input"), controls.push(control), control.$name && (form[control.$name] = control);
        }, form.$$renameControl = function(control, newName) {
            var oldName = control.$name;
            form[oldName] === control && delete form[oldName], form[newName] = control, control.$name = newName;
        }, form.$removeControl = function(control) {
            control.$name && form[control.$name] === control && delete form[control.$name], 
            forEach(form.$pending, function(value, name) {
                form.$setValidity(name, null, control);
            }), forEach(form.$error, function(value, name) {
                form.$setValidity(name, null, control);
            }), forEach(form.$$success, function(value, name) {
                form.$setValidity(name, null, control);
            }), arrayRemove(controls, control);
        }, addSetValidityMethod({
            ctrl: this,
            $element: element,
            set: function(object, property, controller) {
                var list = object[property];
                if (list) {
                    var index = list.indexOf(controller);
                    -1 === index && list.push(controller);
                } else object[property] = [ controller ];
            },
            unset: function(object, property, controller) {
                var list = object[property];
                list && (arrayRemove(list, controller), 0 === list.length && delete object[property]);
            },
            parentForm: parentForm,
            $animate: $animate
        }), form.$setDirty = function() {
            $animate.removeClass(element, PRISTINE_CLASS), $animate.addClass(element, DIRTY_CLASS), 
            form.$dirty = !0, form.$pristine = !1, parentForm.$setDirty();
        }, form.$setPristine = function() {
            $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + " " + SUBMITTED_CLASS), 
            form.$dirty = !1, form.$pristine = !0, form.$submitted = !1, forEach(controls, function(control) {
                control.$setPristine();
            });
        }, form.$setUntouched = function() {
            forEach(controls, function(control) {
                control.$setUntouched();
            });
        }, form.$setSubmitted = function() {
            $animate.addClass(element, SUBMITTED_CLASS), form.$submitted = !0, parentForm.$setSubmitted();
        };
    }
    function stringBasedInputType(ctrl) {
        ctrl.$formatters.push(function(value) {
            return ctrl.$isEmpty(value) ? value : value.toString();
        });
    }
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl);
    }
    function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        var type = lowercase(element[0].type);
        if (!$sniffer.android) {
            var composing = !1;
            element.on("compositionstart", function() {
                composing = !0;
            }), element.on("compositionend", function() {
                composing = !1, listener();
            });
        }
        var listener = function(ev) {
            if (timeout && ($browser.defer.cancel(timeout), timeout = null), !composing) {
                var value = element.val(), event = ev && ev.type;
                "password" === type || attr.ngTrim && "false" === attr.ngTrim || (value = trim(value)), 
                (ctrl.$viewValue !== value || "" === value && ctrl.$$hasNativeValidators) && ctrl.$setViewValue(value, event);
            }
        };
        if ($sniffer.hasEvent("input")) element.on("input", listener); else {
            var timeout, deferListener = function(ev, input, origValue) {
                timeout || (timeout = $browser.defer(function() {
                    timeout = null, input && input.value === origValue || listener(ev);
                }));
            };
            element.on("keydown", function(event) {
                var key = event.keyCode;
                91 === key || key > 15 && 19 > key || key >= 37 && 40 >= key || deferListener(event, this, this.value);
            }), $sniffer.hasEvent("paste") && element.on("paste cut", deferListener);
        }
        element.on("change", listener), ctrl.$render = function() {
            element.val(ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
        };
    }
    function weekParser(isoWeek, existingDate) {
        if (isDate(isoWeek)) return isoWeek;
        if (isString(isoWeek)) {
            WEEK_REGEXP.lastIndex = 0;
            var parts = WEEK_REGEXP.exec(isoWeek);
            if (parts) {
                var year = +parts[1], week = +parts[2], hours = 0, minutes = 0, seconds = 0, milliseconds = 0, firstThurs = getFirstThursdayOfYear(year), addDays = 7 * (week - 1);
                return existingDate && (hours = existingDate.getHours(), minutes = existingDate.getMinutes(), 
                seconds = existingDate.getSeconds(), milliseconds = existingDate.getMilliseconds()), 
                new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
            }
        }
        return 0/0;
    }
    function createDateParser(regexp, mapping) {
        return function(iso, date) {
            var parts, map;
            if (isDate(iso)) return iso;
            if (isString(iso)) {
                if ('"' == iso.charAt(0) && '"' == iso.charAt(iso.length - 1) && (iso = iso.substring(1, iso.length - 1)), 
                ISO_DATE_REGEXP.test(iso)) return new Date(iso);
                if (regexp.lastIndex = 0, parts = regexp.exec(iso)) return parts.shift(), map = date ? {
                    yyyy: date.getFullYear(),
                    MM: date.getMonth() + 1,
                    dd: date.getDate(),
                    HH: date.getHours(),
                    mm: date.getMinutes(),
                    ss: date.getSeconds(),
                    sss: date.getMilliseconds() / 1e3
                } : {
                    yyyy: 1970,
                    MM: 1,
                    dd: 1,
                    HH: 0,
                    mm: 0,
                    ss: 0,
                    sss: 0
                }, forEach(parts, function(part, index) {
                    index < mapping.length && (map[mapping[index]] = +part);
                }), new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, 1e3 * map.sss || 0);
            }
            return 0/0;
        };
    }
    function createDateInputType(type, regexp, parseDate, format) {
        return function(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
            function isValidDate(value) {
                return value && !(value.getTime && value.getTime() !== value.getTime());
            }
            function parseObservedDateValue(val) {
                return isDefined(val) ? isDate(val) ? val : parseDate(val) : undefined;
            }
            badInputChecker(scope, element, attr, ctrl), baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var previousDate, timezone = ctrl && ctrl.$options && ctrl.$options.timezone;
            if (ctrl.$$parserName = type, ctrl.$parsers.push(function(value) {
                if (ctrl.$isEmpty(value)) return null;
                if (regexp.test(value)) {
                    var parsedDate = parseDate(value, previousDate);
                    return "UTC" === timezone && parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset()), 
                    parsedDate;
                }
                return undefined;
            }), ctrl.$formatters.push(function(value) {
                if (value && !isDate(value)) throw $ngModelMinErr("datefmt", "Expected `{0}` to be a date", value);
                if (isValidDate(value)) {
                    if (previousDate = value, previousDate && "UTC" === timezone) {
                        var timezoneOffset = 6e4 * previousDate.getTimezoneOffset();
                        previousDate = new Date(previousDate.getTime() + timezoneOffset);
                    }
                    return $filter("date")(value, format, timezone);
                }
                return previousDate = null, "";
            }), isDefined(attr.min) || attr.ngMin) {
                var minVal;
                ctrl.$validators.min = function(value) {
                    return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal;
                }, attr.$observe("min", function(val) {
                    minVal = parseObservedDateValue(val), ctrl.$validate();
                });
            }
            if (isDefined(attr.max) || attr.ngMax) {
                var maxVal;
                ctrl.$validators.max = function(value) {
                    return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal;
                }, attr.$observe("max", function(val) {
                    maxVal = parseObservedDateValue(val), ctrl.$validate();
                });
            }
        };
    }
    function badInputChecker(scope, element, attr, ctrl) {
        var node = element[0], nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
        nativeValidation && ctrl.$parsers.push(function(value) {
            var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
            return validity.badInput && !validity.typeMismatch ? undefined : value;
        });
    }
    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        if (badInputChecker(scope, element, attr, ctrl), baseInputType(scope, element, attr, ctrl, $sniffer, $browser), 
        ctrl.$$parserName = "number", ctrl.$parsers.push(function(value) {
            return ctrl.$isEmpty(value) ? null : NUMBER_REGEXP.test(value) ? parseFloat(value) : undefined;
        }), ctrl.$formatters.push(function(value) {
            if (!ctrl.$isEmpty(value)) {
                if (!isNumber(value)) throw $ngModelMinErr("numfmt", "Expected `{0}` to be a number", value);
                value = value.toString();
            }
            return value;
        }), attr.min || attr.ngMin) {
            var minVal;
            ctrl.$validators.min = function(value) {
                return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
            }, attr.$observe("min", function(val) {
                isDefined(val) && !isNumber(val) && (val = parseFloat(val, 10)), minVal = isNumber(val) && !isNaN(val) ? val : undefined, 
                ctrl.$validate();
            });
        }
        if (attr.max || attr.ngMax) {
            var maxVal;
            ctrl.$validators.max = function(value) {
                return ctrl.$isEmpty(value) || isUndefined(maxVal) || maxVal >= value;
            }, attr.$observe("max", function(val) {
                isDefined(val) && !isNumber(val) && (val = parseFloat(val, 10)), maxVal = isNumber(val) && !isNaN(val) ? val : undefined, 
                ctrl.$validate();
            });
        }
    }
    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl), 
        ctrl.$$parserName = "url", ctrl.$validators.url = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
        };
    }
    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl), 
        ctrl.$$parserName = "email", ctrl.$validators.email = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
        };
    }
    function radioInputType(scope, element, attr, ctrl) {
        isUndefined(attr.name) && element.attr("name", nextUid());
        var listener = function(ev) {
            element[0].checked && ctrl.$setViewValue(attr.value, ev && ev.type);
        };
        element.on("click", listener), ctrl.$render = function() {
            var value = attr.value;
            element[0].checked = value == ctrl.$viewValue;
        }, attr.$observe("value", ctrl.$render);
    }
    function parseConstantExpr($parse, context, name, expression, fallback) {
        var parseFn;
        if (isDefined(expression)) {
            if (parseFn = $parse(expression), !parseFn.constant) throw minErr("ngModel")("constexpr", "Expected constant expression for `{0}`, but saw `{1}`.", name, expression);
            return parseFn(context);
        }
        return fallback;
    }
    function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
        var trueValue = parseConstantExpr($parse, scope, "ngTrueValue", attr.ngTrueValue, !0), falseValue = parseConstantExpr($parse, scope, "ngFalseValue", attr.ngFalseValue, !1), listener = function(ev) {
            ctrl.$setViewValue(element[0].checked, ev && ev.type);
        };
        element.on("click", listener), ctrl.$render = function() {
            element[0].checked = ctrl.$viewValue;
        }, ctrl.$isEmpty = function(value) {
            return value === !1;
        }, ctrl.$formatters.push(function(value) {
            return equals(value, trueValue);
        }), ctrl.$parsers.push(function(value) {
            return value ? trueValue : falseValue;
        });
    }
    function classDirective(name, selector) {
        return name = "ngClass" + name, [ "$animate", function($animate) {
            function arrayDifference(tokens1, tokens2) {
                var values = [];
                outer: for (var i = 0; i < tokens1.length; i++) {
                    for (var token = tokens1[i], j = 0; j < tokens2.length; j++) if (token == tokens2[j]) continue outer;
                    values.push(token);
                }
                return values;
            }
            function arrayClasses(classVal) {
                if (isArray(classVal)) return classVal;
                if (isString(classVal)) return classVal.split(" ");
                if (isObject(classVal)) {
                    var classes = [];
                    return forEach(classVal, function(v, k) {
                        v && (classes = classes.concat(k.split(" ")));
                    }), classes;
                }
                return classVal;
            }
            return {
                restrict: "AC",
                link: function(scope, element, attr) {
                    function addClasses(classes) {
                        var newClasses = digestClassCounts(classes, 1);
                        attr.$addClass(newClasses);
                    }
                    function removeClasses(classes) {
                        var newClasses = digestClassCounts(classes, -1);
                        attr.$removeClass(newClasses);
                    }
                    function digestClassCounts(classes, count) {
                        var classCounts = element.data("$classCounts") || {}, classesToUpdate = [];
                        return forEach(classes, function(className) {
                            (count > 0 || classCounts[className]) && (classCounts[className] = (classCounts[className] || 0) + count, 
                            classCounts[className] === +(count > 0) && classesToUpdate.push(className));
                        }), element.data("$classCounts", classCounts), classesToUpdate.join(" ");
                    }
                    function updateClasses(oldClasses, newClasses) {
                        var toAdd = arrayDifference(newClasses, oldClasses), toRemove = arrayDifference(oldClasses, newClasses);
                        toAdd = digestClassCounts(toAdd, 1), toRemove = digestClassCounts(toRemove, -1), 
                        toAdd && toAdd.length && $animate.addClass(element, toAdd), toRemove && toRemove.length && $animate.removeClass(element, toRemove);
                    }
                    function ngClassWatchAction(newVal) {
                        if (selector === !0 || scope.$index % 2 === selector) {
                            var newClasses = arrayClasses(newVal || []);
                            if (oldVal) {
                                if (!equals(newVal, oldVal)) {
                                    var oldClasses = arrayClasses(oldVal);
                                    updateClasses(oldClasses, newClasses);
                                }
                            } else addClasses(newClasses);
                        }
                        oldVal = shallowCopy(newVal);
                    }
                    var oldVal;
                    scope.$watch(attr[name], ngClassWatchAction, !0), attr.$observe("class", function() {
                        ngClassWatchAction(scope.$eval(attr[name]));
                    }), "ngClass" !== name && scope.$watch("$index", function($index, old$index) {
                        var mod = 1 & $index;
                        if (mod !== (1 & old$index)) {
                            var classes = arrayClasses(scope.$eval(attr[name]));
                            mod === selector ? addClasses(classes) : removeClasses(classes);
                        }
                    });
                }
            };
        } ];
    }
    function addSetValidityMethod(context) {
        function setValidity(validationErrorKey, state, controller) {
            state === undefined ? createAndSet("$pending", validationErrorKey, controller) : unsetAndCleanup("$pending", validationErrorKey, controller), 
            isBoolean(state) ? state ? (unset(ctrl.$error, validationErrorKey, controller), 
            set(ctrl.$$success, validationErrorKey, controller)) : (set(ctrl.$error, validationErrorKey, controller), 
            unset(ctrl.$$success, validationErrorKey, controller)) : (unset(ctrl.$error, validationErrorKey, controller), 
            unset(ctrl.$$success, validationErrorKey, controller)), ctrl.$pending ? (cachedToggleClass(PENDING_CLASS, !0), 
            ctrl.$valid = ctrl.$invalid = undefined, toggleValidationCss("", null)) : (cachedToggleClass(PENDING_CLASS, !1), 
            ctrl.$valid = isObjectEmpty(ctrl.$error), ctrl.$invalid = !ctrl.$valid, toggleValidationCss("", ctrl.$valid));
            var combinedState;
            combinedState = ctrl.$pending && ctrl.$pending[validationErrorKey] ? undefined : ctrl.$error[validationErrorKey] ? !1 : ctrl.$$success[validationErrorKey] ? !0 : null, 
            toggleValidationCss(validationErrorKey, combinedState), parentForm.$setValidity(validationErrorKey, combinedState, ctrl);
        }
        function createAndSet(name, value, controller) {
            ctrl[name] || (ctrl[name] = {}), set(ctrl[name], value, controller);
        }
        function unsetAndCleanup(name, value, controller) {
            ctrl[name] && unset(ctrl[name], value, controller), isObjectEmpty(ctrl[name]) && (ctrl[name] = undefined);
        }
        function cachedToggleClass(className, switchValue) {
            switchValue && !classCache[className] ? ($animate.addClass($element, className), 
            classCache[className] = !0) : !switchValue && classCache[className] && ($animate.removeClass($element, className), 
            classCache[className] = !1);
        }
        function toggleValidationCss(validationErrorKey, isValid) {
            validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "", 
            cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === !0), cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === !1);
        }
        var ctrl = context.ctrl, $element = context.$element, classCache = {}, set = context.set, unset = context.unset, parentForm = context.parentForm, $animate = context.$animate;
        classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS)), 
        ctrl.$setValidity = setValidity;
    }
    function isObjectEmpty(obj) {
        if (obj) for (var prop in obj) return !1;
        return !0;
    }
    var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/, VALIDITY_STATE_PROPERTY = "validity", lowercase = function(string) {
        return isString(string) ? string.toLowerCase() : string;
    }, hasOwnProperty = Object.prototype.hasOwnProperty, uppercase = function(string) {
        return isString(string) ? string.toUpperCase() : string;
    }, manualLowercase = function(s) {
        return isString(s) ? s.replace(/[A-Z]/g, function(ch) {
            return String.fromCharCode(32 | ch.charCodeAt(0));
        }) : s;
    }, manualUppercase = function(s) {
        return isString(s) ? s.replace(/[a-z]/g, function(ch) {
            return String.fromCharCode(-33 & ch.charCodeAt(0));
        }) : s;
    };
    "i" !== "I".toLowerCase() && (lowercase = manualLowercase, uppercase = manualUppercase);
    var msie, jqLite, jQuery, angularModule, slice = [].slice, splice = [].splice, push = [].push, toString = Object.prototype.toString, ngMinErr = minErr("ng"), angular = window.angular || (window.angular = {}), uid = 0;
    msie = document.documentMode, noop.$inject = [], identity.$inject = [];
    var skipDestroyOnNextJQueryCleanData, isArray = Array.isArray, trim = function(value) {
        return isString(value) ? value.trim() : value;
    }, escapeForRegexp = function(s) {
        return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
    }, csp = function() {
        if (isDefined(csp.isActive_)) return csp.isActive_;
        var active = !(!document.querySelector("[ng-csp]") && !document.querySelector("[data-ng-csp]"));
        if (!active) try {
            new Function("");
        } catch (e) {
            active = !0;
        }
        return csp.isActive_ = active;
    }, ngAttrPrefixes = [ "ng-", "data-ng-", "ng:", "x-ng-" ], SNAKE_CASE_REGEXP = /[A-Z]/g, bindJQueryFired = !1, NODE_TYPE_ELEMENT = 1, NODE_TYPE_TEXT = 3, NODE_TYPE_COMMENT = 8, NODE_TYPE_DOCUMENT = 9, NODE_TYPE_DOCUMENT_FRAGMENT = 11, version = {
        full: "1.3.11",
        major: 1,
        minor: 3,
        dot: 11,
        codeName: "spiffy-manatee"
    };
    JQLite.expando = "ng339";
    var jqCache = JQLite.cache = {}, jqId = 1, addEventListenerFn = function(element, type, fn) {
        element.addEventListener(type, fn, !1);
    }, removeEventListenerFn = function(element, type, fn) {
        element.removeEventListener(type, fn, !1);
    };
    JQLite._data = function(node) {
        return this.cache[node[this.expando]] || {};
    };
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g, MOZ_HACK_REGEXP = /^moz([A-Z])/, MOUSE_EVENT_MAP = {
        mouseleave: "mouseout",
        mouseenter: "mouseover"
    }, jqLiteMinErr = minErr("jqLite"), SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, HTML_REGEXP = /<|&#?\w+;/, TAG_NAME_REGEXP = /<([\w:]+)/, XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, wrapMap = {
        option: [ 1, '<select multiple="multiple">', "</select>" ],
        thead: [ 1, "<table>", "</table>" ],
        col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        _default: [ 0, "", "" ]
    };
    wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, 
    wrapMap.th = wrapMap.td;
    var JQLitePrototype = JQLite.prototype = {
        ready: function(fn) {
            function trigger() {
                fired || (fired = !0, fn());
            }
            var fired = !1;
            "complete" === document.readyState ? setTimeout(trigger) : (this.on("DOMContentLoaded", trigger), 
            JQLite(window).on("load", trigger));
        },
        toString: function() {
            var value = [];
            return forEach(this, function(e) {
                value.push("" + e);
            }), "[" + value.join(", ") + "]";
        },
        eq: function(index) {
            return jqLite(index >= 0 ? this[index] : this[this.length + index]);
        },
        length: 0,
        push: push,
        sort: [].sort,
        splice: [].splice
    }, BOOLEAN_ATTR = {};
    forEach("multiple,selected,checked,disabled,readOnly,required,open".split(","), function(value) {
        BOOLEAN_ATTR[lowercase(value)] = value;
    });
    var BOOLEAN_ELEMENTS = {};
    forEach("input,select,option,textarea,button,form,details".split(","), function(value) {
        BOOLEAN_ELEMENTS[value] = !0;
    });
    var ALIASED_ATTR = {
        ngMinlength: "minlength",
        ngMaxlength: "maxlength",
        ngMin: "min",
        ngMax: "max",
        ngPattern: "pattern"
    };
    forEach({
        data: jqLiteData,
        removeData: jqLiteRemoveData
    }, function(fn, name) {
        JQLite[name] = fn;
    }), forEach({
        data: jqLiteData,
        inheritedData: jqLiteInheritedData,
        scope: function(element) {
            return jqLite.data(element, "$scope") || jqLiteInheritedData(element.parentNode || element, [ "$isolateScope", "$scope" ]);
        },
        isolateScope: function(element) {
            return jqLite.data(element, "$isolateScope") || jqLite.data(element, "$isolateScopeNoTemplate");
        },
        controller: jqLiteController,
        injector: function(element) {
            return jqLiteInheritedData(element, "$injector");
        },
        removeAttr: function(element, name) {
            element.removeAttribute(name);
        },
        hasClass: jqLiteHasClass,
        css: function(element, name, value) {
            return name = camelCase(name), isDefined(value) ? void (element.style[name] = value) : element.style[name];
        },
        attr: function(element, name, value) {
            var lowercasedName = lowercase(name);
            if (BOOLEAN_ATTR[lowercasedName]) {
                if (!isDefined(value)) return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
                value ? (element[name] = !0, element.setAttribute(name, lowercasedName)) : (element[name] = !1, 
                element.removeAttribute(lowercasedName));
            } else if (isDefined(value)) element.setAttribute(name, value); else if (element.getAttribute) {
                var ret = element.getAttribute(name, 2);
                return null === ret ? undefined : ret;
            }
        },
        prop: function(element, name, value) {
            return isDefined(value) ? void (element[name] = value) : element[name];
        },
        text: function() {
            function getText(element, value) {
                if (isUndefined(value)) {
                    var nodeType = element.nodeType;
                    return nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT ? element.textContent : "";
                }
                element.textContent = value;
            }
            return getText.$dv = "", getText;
        }(),
        val: function(element, value) {
            if (isUndefined(value)) {
                if (element.multiple && "select" === nodeName_(element)) {
                    var result = [];
                    return forEach(element.options, function(option) {
                        option.selected && result.push(option.value || option.text);
                    }), 0 === result.length ? null : result;
                }
                return element.value;
            }
            element.value = value;
        },
        html: function(element, value) {
            return isUndefined(value) ? element.innerHTML : (jqLiteDealoc(element, !0), void (element.innerHTML = value));
        },
        empty: jqLiteEmpty
    }, function(fn, name) {
        JQLite.prototype[name] = function(arg1, arg2) {
            var i, key, nodeCount = this.length;
            if (fn !== jqLiteEmpty && (2 == fn.length && fn !== jqLiteHasClass && fn !== jqLiteController ? arg1 : arg2) === undefined) {
                if (isObject(arg1)) {
                    for (i = 0; nodeCount > i; i++) if (fn === jqLiteData) fn(this[i], arg1); else for (key in arg1) fn(this[i], key, arg1[key]);
                    return this;
                }
                for (var value = fn.$dv, jj = value === undefined ? Math.min(nodeCount, 1) : nodeCount, j = 0; jj > j; j++) {
                    var nodeValue = fn(this[j], arg1, arg2);
                    value = value ? value + nodeValue : nodeValue;
                }
                return value;
            }
            for (i = 0; nodeCount > i; i++) fn(this[i], arg1, arg2);
            return this;
        };
    }), forEach({
        removeData: jqLiteRemoveData,
        on: function jqLiteOn(element, type, fn, unsupported) {
            if (isDefined(unsupported)) throw jqLiteMinErr("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
            if (jqLiteAcceptsData(element)) {
                var expandoStore = jqLiteExpandoStore(element, !0), events = expandoStore.events, handle = expandoStore.handle;
                handle || (handle = expandoStore.handle = createEventHandler(element, events));
                for (var types = type.indexOf(" ") >= 0 ? type.split(" ") : [ type ], i = types.length; i--; ) {
                    type = types[i];
                    var eventFns = events[type];
                    eventFns || (events[type] = [], "mouseenter" === type || "mouseleave" === type ? jqLiteOn(element, MOUSE_EVENT_MAP[type], function(event) {
                        var target = this, related = event.relatedTarget;
                        (!related || related !== target && !target.contains(related)) && handle(event, type);
                    }) : "$destroy" !== type && addEventListenerFn(element, type, handle), eventFns = events[type]), 
                    eventFns.push(fn);
                }
            }
        },
        off: jqLiteOff,
        one: function(element, type, fn) {
            element = jqLite(element), element.on(type, function onFn() {
                element.off(type, fn), element.off(type, onFn);
            }), element.on(type, fn);
        },
        replaceWith: function(element, replaceNode) {
            var index, parent = element.parentNode;
            jqLiteDealoc(element), forEach(new JQLite(replaceNode), function(node) {
                index ? parent.insertBefore(node, index.nextSibling) : parent.replaceChild(node, element), 
                index = node;
            });
        },
        children: function(element) {
            var children = [];
            return forEach(element.childNodes, function(element) {
                element.nodeType === NODE_TYPE_ELEMENT && children.push(element);
            }), children;
        },
        contents: function(element) {
            return element.contentDocument || element.childNodes || [];
        },
        append: function(element, node) {
            var nodeType = element.nodeType;
            if (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_DOCUMENT_FRAGMENT) {
                node = new JQLite(node);
                for (var i = 0, ii = node.length; ii > i; i++) {
                    var child = node[i];
                    element.appendChild(child);
                }
            }
        },
        prepend: function(element, node) {
            if (element.nodeType === NODE_TYPE_ELEMENT) {
                var index = element.firstChild;
                forEach(new JQLite(node), function(child) {
                    element.insertBefore(child, index);
                });
            }
        },
        wrap: function(element, wrapNode) {
            wrapNode = jqLite(wrapNode).eq(0).clone()[0];
            var parent = element.parentNode;
            parent && parent.replaceChild(wrapNode, element), wrapNode.appendChild(element);
        },
        remove: jqLiteRemove,
        detach: function(element) {
            jqLiteRemove(element, !0);
        },
        after: function(element, newElement) {
            var index = element, parent = element.parentNode;
            newElement = new JQLite(newElement);
            for (var i = 0, ii = newElement.length; ii > i; i++) {
                var node = newElement[i];
                parent.insertBefore(node, index.nextSibling), index = node;
            }
        },
        addClass: jqLiteAddClass,
        removeClass: jqLiteRemoveClass,
        toggleClass: function(element, selector, condition) {
            selector && forEach(selector.split(" "), function(className) {
                var classCondition = condition;
                isUndefined(classCondition) && (classCondition = !jqLiteHasClass(element, className)), 
                (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
            });
        },
        parent: function(element) {
            var parent = element.parentNode;
            return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
        },
        next: function(element) {
            return element.nextElementSibling;
        },
        find: function(element, selector) {
            return element.getElementsByTagName ? element.getElementsByTagName(selector) : [];
        },
        clone: jqLiteClone,
        triggerHandler: function(element, event, extraParameters) {
            var dummyEvent, eventFnsCopy, handlerArgs, eventName = event.type || event, expandoStore = jqLiteExpandoStore(element), events = expandoStore && expandoStore.events, eventFns = events && events[eventName];
            eventFns && (dummyEvent = {
                preventDefault: function() {
                    this.defaultPrevented = !0;
                },
                isDefaultPrevented: function() {
                    return this.defaultPrevented === !0;
                },
                stopImmediatePropagation: function() {
                    this.immediatePropagationStopped = !0;
                },
                isImmediatePropagationStopped: function() {
                    return this.immediatePropagationStopped === !0;
                },
                stopPropagation: noop,
                type: eventName,
                target: element
            }, event.type && (dummyEvent = extend(dummyEvent, event)), eventFnsCopy = shallowCopy(eventFns), 
            handlerArgs = extraParameters ? [ dummyEvent ].concat(extraParameters) : [ dummyEvent ], 
            forEach(eventFnsCopy, function(fn) {
                dummyEvent.isImmediatePropagationStopped() || fn.apply(element, handlerArgs);
            }));
        }
    }, function(fn, name) {
        JQLite.prototype[name] = function(arg1, arg2, arg3) {
            for (var value, i = 0, ii = this.length; ii > i; i++) isUndefined(value) ? (value = fn(this[i], arg1, arg2, arg3), 
            isDefined(value) && (value = jqLite(value))) : jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
            return isDefined(value) ? value : this;
        }, JQLite.prototype.bind = JQLite.prototype.on, JQLite.prototype.unbind = JQLite.prototype.off;
    }), HashMap.prototype = {
        put: function(key, value) {
            this[hashKey(key, this.nextUid)] = value;
        },
        get: function(key) {
            return this[hashKey(key, this.nextUid)];
        },
        remove: function(key) {
            var value = this[key = hashKey(key, this.nextUid)];
            return delete this[key], value;
        }
    };
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, FN_ARG_SPLIT = /,/, FN_ARG = /^\s*(_?)(\S+?)\1\s*$/, STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, $injectorMinErr = minErr("$injector");
    createInjector.$$annotate = annotate;
    var $animateMinErr = minErr("$animate"), $AnimateProvider = [ "$provide", function($provide) {
        this.$$selectors = {}, this.register = function(name, factory) {
            var key = name + "-animation";
            if (name && "." != name.charAt(0)) throw $animateMinErr("notcsel", "Expecting class selector starting with '.' got '{0}'.", name);
            this.$$selectors[name.substr(1)] = key, $provide.factory(key, factory);
        }, this.classNameFilter = function(expression) {
            return 1 === arguments.length && (this.$$classNameFilter = expression instanceof RegExp ? expression : null), 
            this.$$classNameFilter;
        }, this.$get = [ "$$q", "$$asyncCallback", "$rootScope", function($$q, $$asyncCallback, $rootScope) {
            function runAnimationPostDigest(fn) {
                var cancelFn, defer = $$q.defer();
                return defer.promise.$$cancelFn = function() {
                    cancelFn && cancelFn();
                }, $rootScope.$$postDigest(function() {
                    cancelFn = fn(function() {
                        defer.resolve();
                    });
                }), defer.promise;
            }
            function resolveElementClasses(element, classes) {
                var toAdd = [], toRemove = [], hasClasses = createMap();
                return forEach((element.attr("class") || "").split(/\s+/), function(className) {
                    hasClasses[className] = !0;
                }), forEach(classes, function(status, className) {
                    var hasClass = hasClasses[className];
                    status === !1 && hasClass ? toRemove.push(className) : status !== !0 || hasClass || toAdd.push(className);
                }), toAdd.length + toRemove.length > 0 && [ toAdd.length ? toAdd : null, toRemove.length ? toRemove : null ];
            }
            function cachedClassManipulation(cache, classes, op) {
                for (var i = 0, ii = classes.length; ii > i; ++i) {
                    var className = classes[i];
                    cache[className] = op;
                }
            }
            function asyncPromise() {
                return currentDefer || (currentDefer = $$q.defer(), $$asyncCallback(function() {
                    currentDefer.resolve(), currentDefer = null;
                })), currentDefer.promise;
            }
            function applyStyles(element, options) {
                if (angular.isObject(options)) {
                    var styles = extend(options.from || {}, options.to || {});
                    element.css(styles);
                }
            }
            var currentDefer;
            return {
                animate: function(element, from, to) {
                    return applyStyles(element, {
                        from: from,
                        to: to
                    }), asyncPromise();
                },
                enter: function(element, parent, after, options) {
                    return applyStyles(element, options), after ? after.after(element) : parent.prepend(element), 
                    asyncPromise();
                },
                leave: function(element) {
                    return element.remove(), asyncPromise();
                },
                move: function(element, parent, after, options) {
                    return this.enter(element, parent, after, options);
                },
                addClass: function(element, className, options) {
                    return this.setClass(element, className, [], options);
                },
                $$addClassImmediately: function(element, className, options) {
                    return element = jqLite(element), className = isString(className) ? className : isArray(className) ? className.join(" ") : "", 
                    forEach(element, function(element) {
                        jqLiteAddClass(element, className);
                    }), applyStyles(element, options), asyncPromise();
                },
                removeClass: function(element, className, options) {
                    return this.setClass(element, [], className, options);
                },
                $$removeClassImmediately: function(element, className, options) {
                    return element = jqLite(element), className = isString(className) ? className : isArray(className) ? className.join(" ") : "", 
                    forEach(element, function(element) {
                        jqLiteRemoveClass(element, className);
                    }), applyStyles(element, options), asyncPromise();
                },
                setClass: function(element, add, remove, options) {
                    var self = this, STORAGE_KEY = "$$animateClasses", createdCache = !1;
                    element = jqLite(element);
                    var cache = element.data(STORAGE_KEY);
                    cache ? options && cache.options && (cache.options = angular.extend(cache.options || {}, options)) : (cache = {
                        classes: {},
                        options: options
                    }, createdCache = !0);
                    var classes = cache.classes;
                    return add = isArray(add) ? add : add.split(" "), remove = isArray(remove) ? remove : remove.split(" "), 
                    cachedClassManipulation(classes, add, !0), cachedClassManipulation(classes, remove, !1), 
                    createdCache && (cache.promise = runAnimationPostDigest(function(done) {
                        var cache = element.data(STORAGE_KEY);
                        if (element.removeData(STORAGE_KEY), cache) {
                            var classes = resolveElementClasses(element, cache.classes);
                            classes && self.$$setClassImmediately(element, classes[0], classes[1], cache.options);
                        }
                        done();
                    }), element.data(STORAGE_KEY, cache)), cache.promise;
                },
                $$setClassImmediately: function(element, add, remove, options) {
                    return add && this.$$addClassImmediately(element, add), remove && this.$$removeClassImmediately(element, remove), 
                    applyStyles(element, options), asyncPromise();
                },
                enabled: noop,
                cancel: noop
            };
        } ];
    } ], $compileMinErr = minErr("$compile");
    $CompileProvider.$inject = [ "$provide", "$$sanitizeUriProvider" ];
    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i, APPLICATION_JSON = "application/json", CONTENT_TYPE_APPLICATION_JSON = {
        "Content-Type": APPLICATION_JSON + ";charset=utf-8"
    }, JSON_START = /^\[|^\{(?!\{)/, JSON_ENDS = {
        "[": /]$/,
        "{": /}$/
    }, JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/, $interpolateMinErr = minErr("$interpolate"), PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {
        http: 80,
        https: 443,
        ftp: 21
    }, $locationMinErr = minErr("$location"), locationPrototype = {
        $$html5: !1,
        $$replace: !1,
        absUrl: locationGetter("$$absUrl"),
        url: function(url) {
            if (isUndefined(url)) return this.$$url;
            var match = PATH_MATCH.exec(url);
            return (match[1] || "" === url) && this.path(decodeURIComponent(match[1])), (match[2] || match[1] || "" === url) && this.search(match[3] || ""), 
            this.hash(match[5] || ""), this;
        },
        protocol: locationGetter("$$protocol"),
        host: locationGetter("$$host"),
        port: locationGetter("$$port"),
        path: locationGetterSetter("$$path", function(path) {
            return path = null !== path ? path.toString() : "", "/" == path.charAt(0) ? path : "/" + path;
        }),
        search: function(search, paramValue) {
            switch (arguments.length) {
              case 0:
                return this.$$search;

              case 1:
                if (isString(search) || isNumber(search)) search = search.toString(), this.$$search = parseKeyValue(search); else {
                    if (!isObject(search)) throw $locationMinErr("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                    search = copy(search, {}), forEach(search, function(value, key) {
                        null == value && delete search[key];
                    }), this.$$search = search;
                }
                break;

              default:
                isUndefined(paramValue) || null === paramValue ? delete this.$$search[search] : this.$$search[search] = paramValue;
            }
            return this.$$compose(), this;
        },
        hash: locationGetterSetter("$$hash", function(hash) {
            return null !== hash ? hash.toString() : "";
        }),
        replace: function() {
            return this.$$replace = !0, this;
        }
    };
    forEach([ LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url ], function(Location) {
        Location.prototype = Object.create(locationPrototype), Location.prototype.state = function(state) {
            if (!arguments.length) return this.$$state;
            if (Location !== LocationHtml5Url || !this.$$html5) throw $locationMinErr("nostate", "History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API");
            return this.$$state = isUndefined(state) ? null : state, this;
        };
    });
    var $parseMinErr = minErr("$parse"), CALL = Function.prototype.call, APPLY = Function.prototype.apply, BIND = Function.prototype.bind, CONSTANTS = createMap();
    forEach({
        "null": function() {
            return null;
        },
        "true": function() {
            return !0;
        },
        "false": function() {
            return !1;
        },
        undefined: function() {}
    }, function(constantGetter, name) {
        constantGetter.constant = constantGetter.literal = constantGetter.sharedGetter = !0, 
        CONSTANTS[name] = constantGetter;
    }), CONSTANTS["this"] = function(self) {
        return self;
    }, CONSTANTS["this"].sharedGetter = !0;
    var OPERATORS = extend(createMap(), {
        "+": function(self, locals, a, b) {
            return a = a(self, locals), b = b(self, locals), isDefined(a) ? isDefined(b) ? a + b : a : isDefined(b) ? b : undefined;
        },
        "-": function(self, locals, a, b) {
            return a = a(self, locals), b = b(self, locals), (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
        },
        "*": function(self, locals, a, b) {
            return a(self, locals) * b(self, locals);
        },
        "/": function(self, locals, a, b) {
            return a(self, locals) / b(self, locals);
        },
        "%": function(self, locals, a, b) {
            return a(self, locals) % b(self, locals);
        },
        "===": function(self, locals, a, b) {
            return a(self, locals) === b(self, locals);
        },
        "!==": function(self, locals, a, b) {
            return a(self, locals) !== b(self, locals);
        },
        "==": function(self, locals, a, b) {
            return a(self, locals) == b(self, locals);
        },
        "!=": function(self, locals, a, b) {
            return a(self, locals) != b(self, locals);
        },
        "<": function(self, locals, a, b) {
            return a(self, locals) < b(self, locals);
        },
        ">": function(self, locals, a, b) {
            return a(self, locals) > b(self, locals);
        },
        "<=": function(self, locals, a, b) {
            return a(self, locals) <= b(self, locals);
        },
        ">=": function(self, locals, a, b) {
            return a(self, locals) >= b(self, locals);
        },
        "&&": function(self, locals, a, b) {
            return a(self, locals) && b(self, locals);
        },
        "||": function(self, locals, a, b) {
            return a(self, locals) || b(self, locals);
        },
        "!": function(self, locals, a) {
            return !a(self, locals);
        },
        "=": !0,
        "|": !0
    }), ESCAPE = {
        n: "\n",
        f: "\f",
        r: "\r",
        t: "	",
        v: "",
        "'": "'",
        '"': '"'
    }, Lexer = function(options) {
        this.options = options;
    };
    Lexer.prototype = {
        constructor: Lexer,
        lex: function(text) {
            for (this.text = text, this.index = 0, this.tokens = []; this.index < this.text.length; ) {
                var ch = this.text.charAt(this.index);
                if ('"' === ch || "'" === ch) this.readString(ch); else if (this.isNumber(ch) || "." === ch && this.isNumber(this.peek())) this.readNumber(); else if (this.isIdent(ch)) this.readIdent(); else if (this.is(ch, "(){}[].,;:?")) this.tokens.push({
                    index: this.index,
                    text: ch
                }), this.index++; else if (this.isWhitespace(ch)) this.index++; else {
                    var ch2 = ch + this.peek(), ch3 = ch2 + this.peek(2), op1 = OPERATORS[ch], op2 = OPERATORS[ch2], op3 = OPERATORS[ch3];
                    if (op1 || op2 || op3) {
                        var token = op3 ? ch3 : op2 ? ch2 : ch;
                        this.tokens.push({
                            index: this.index,
                            text: token,
                            operator: !0
                        }), this.index += token.length;
                    } else this.throwError("Unexpected next character ", this.index, this.index + 1);
                }
            }
            return this.tokens;
        },
        is: function(ch, chars) {
            return -1 !== chars.indexOf(ch);
        },
        peek: function(i) {
            var num = i || 1;
            return this.index + num < this.text.length ? this.text.charAt(this.index + num) : !1;
        },
        isNumber: function(ch) {
            return ch >= "0" && "9" >= ch && "string" == typeof ch;
        },
        isWhitespace: function(ch) {
            return " " === ch || "\r" === ch || "	" === ch || "\n" === ch || "" === ch || " " === ch;
        },
        isIdent: function(ch) {
            return ch >= "a" && "z" >= ch || ch >= "A" && "Z" >= ch || "_" === ch || "$" === ch;
        },
        isExpOperator: function(ch) {
            return "-" === ch || "+" === ch || this.isNumber(ch);
        },
        throwError: function(error, start, end) {
            end = end || this.index;
            var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
            throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
        },
        readNumber: function() {
            for (var number = "", start = this.index; this.index < this.text.length; ) {
                var ch = lowercase(this.text.charAt(this.index));
                if ("." == ch || this.isNumber(ch)) number += ch; else {
                    var peekCh = this.peek();
                    if ("e" == ch && this.isExpOperator(peekCh)) number += ch; else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && "e" == number.charAt(number.length - 1)) number += ch; else {
                        if (!this.isExpOperator(ch) || peekCh && this.isNumber(peekCh) || "e" != number.charAt(number.length - 1)) break;
                        this.throwError("Invalid exponent");
                    }
                }
                this.index++;
            }
            this.tokens.push({
                index: start,
                text: number,
                constant: !0,
                value: Number(number)
            });
        },
        readIdent: function() {
            for (var start = this.index; this.index < this.text.length; ) {
                var ch = this.text.charAt(this.index);
                if (!this.isIdent(ch) && !this.isNumber(ch)) break;
                this.index++;
            }
            this.tokens.push({
                index: start,
                text: this.text.slice(start, this.index),
                identifier: !0
            });
        },
        readString: function(quote) {
            var start = this.index;
            this.index++;
            for (var string = "", rawString = quote, escape = !1; this.index < this.text.length; ) {
                var ch = this.text.charAt(this.index);
                if (rawString += ch, escape) {
                    if ("u" === ch) {
                        var hex = this.text.substring(this.index + 1, this.index + 5);
                        hex.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + hex + "]"), 
                        this.index += 4, string += String.fromCharCode(parseInt(hex, 16));
                    } else {
                        var rep = ESCAPE[ch];
                        string += rep || ch;
                    }
                    escape = !1;
                } else if ("\\" === ch) escape = !0; else {
                    if (ch === quote) return this.index++, void this.tokens.push({
                        index: start,
                        text: rawString,
                        constant: !0,
                        value: string
                    });
                    string += ch;
                }
                this.index++;
            }
            this.throwError("Unterminated quote", start);
        }
    };
    var Parser = function(lexer, $filter, options) {
        this.lexer = lexer, this.$filter = $filter, this.options = options;
    };
    Parser.ZERO = extend(function() {
        return 0;
    }, {
        sharedGetter: !0,
        constant: !0
    }), Parser.prototype = {
        constructor: Parser,
        parse: function(text) {
            this.text = text, this.tokens = this.lexer.lex(text);
            var value = this.statements();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), 
            value.literal = !!value.literal, value.constant = !!value.constant, value;
        },
        primary: function() {
            var primary;
            this.expect("(") ? (primary = this.filterChain(), this.consume(")")) : this.expect("[") ? primary = this.arrayDeclaration() : this.expect("{") ? primary = this.object() : this.peek().identifier && this.peek().text in CONSTANTS ? primary = CONSTANTS[this.consume().text] : this.peek().identifier ? primary = this.identifier() : this.peek().constant ? primary = this.constant() : this.throwError("not a primary expression", this.peek());
            for (var next, context; next = this.expect("(", "[", "."); ) "(" === next.text ? (primary = this.functionCall(primary, context), 
            context = null) : "[" === next.text ? (context = primary, primary = this.objectIndex(primary)) : "." === next.text ? (context = primary, 
            primary = this.fieldAccess(primary)) : this.throwError("IMPOSSIBLE");
            return primary;
        },
        throwError: function(msg, token) {
            throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
        },
        peekToken: function() {
            if (0 === this.tokens.length) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            return this.tokens[0];
        },
        peek: function(e1, e2, e3, e4) {
            return this.peekAhead(0, e1, e2, e3, e4);
        },
        peekAhead: function(i, e1, e2, e3, e4) {
            if (this.tokens.length > i) {
                var token = this.tokens[i], t = token.text;
                if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) return token;
            }
            return !1;
        },
        expect: function(e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            return token ? (this.tokens.shift(), token) : !1;
        },
        consume: function(e1) {
            if (0 === this.tokens.length) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            var token = this.expect(e1);
            return token || this.throwError("is unexpected, expecting [" + e1 + "]", this.peek()), 
            token;
        },
        unaryFn: function(op, right) {
            var fn = OPERATORS[op];
            return extend(function(self, locals) {
                return fn(self, locals, right);
            }, {
                constant: right.constant,
                inputs: [ right ]
            });
        },
        binaryFn: function(left, op, right, isBranching) {
            var fn = OPERATORS[op];
            return extend(function(self, locals) {
                return fn(self, locals, left, right);
            }, {
                constant: left.constant && right.constant,
                inputs: !isBranching && [ left, right ]
            });
        },
        identifier: function() {
            for (var id = this.consume().text; this.peek(".") && this.peekAhead(1).identifier && !this.peekAhead(2, "("); ) id += this.consume().text + this.consume().text;
            return getterFn(id, this.options, this.text);
        },
        constant: function() {
            var value = this.consume().value;
            return extend(function() {
                return value;
            }, {
                constant: !0,
                literal: !0
            });
        },
        statements: function() {
            for (var statements = []; ;) if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && statements.push(this.filterChain()), 
            !this.expect(";")) return 1 === statements.length ? statements[0] : function(self, locals) {
                for (var value, i = 0, ii = statements.length; ii > i; i++) value = statements[i](self, locals);
                return value;
            };
        },
        filterChain: function() {
            for (var token, left = this.expression(); token = this.expect("|"); ) left = this.filter(left);
            return left;
        },
        filter: function(inputFn) {
            var argsFn, args, fn = this.$filter(this.consume().text);
            if (this.peek(":")) for (argsFn = [], args = []; this.expect(":"); ) argsFn.push(this.expression());
            var inputs = [ inputFn ].concat(argsFn || []);
            return extend(function(self, locals) {
                var input = inputFn(self, locals);
                if (args) {
                    args[0] = input;
                    for (var i = argsFn.length; i--; ) args[i + 1] = argsFn[i](self, locals);
                    return fn.apply(undefined, args);
                }
                return fn(input);
            }, {
                constant: !fn.$stateful && inputs.every(isConstant),
                inputs: !fn.$stateful && inputs
            });
        },
        expression: function() {
            return this.assignment();
        },
        assignment: function() {
            var right, token, left = this.ternary();
            return (token = this.expect("=")) ? (left.assign || this.throwError("implies assignment but [" + this.text.substring(0, token.index) + "] can not be assigned to", token), 
            right = this.ternary(), extend(function(scope, locals) {
                return left.assign(scope, right(scope, locals), locals);
            }, {
                inputs: [ left, right ]
            })) : left;
        },
        ternary: function() {
            var middle, token, left = this.logicalOR();
            if ((token = this.expect("?")) && (middle = this.assignment(), this.consume(":"))) {
                var right = this.assignment();
                return extend(function(self, locals) {
                    return left(self, locals) ? middle(self, locals) : right(self, locals);
                }, {
                    constant: left.constant && middle.constant && right.constant
                });
            }
            return left;
        },
        logicalOR: function() {
            for (var token, left = this.logicalAND(); token = this.expect("||"); ) left = this.binaryFn(left, token.text, this.logicalAND(), !0);
            return left;
        },
        logicalAND: function() {
            for (var token, left = this.equality(); token = this.expect("&&"); ) left = this.binaryFn(left, token.text, this.equality(), !0);
            return left;
        },
        equality: function() {
            for (var token, left = this.relational(); token = this.expect("==", "!=", "===", "!=="); ) left = this.binaryFn(left, token.text, this.relational());
            return left;
        },
        relational: function() {
            for (var token, left = this.additive(); token = this.expect("<", ">", "<=", ">="); ) left = this.binaryFn(left, token.text, this.additive());
            return left;
        },
        additive: function() {
            for (var token, left = this.multiplicative(); token = this.expect("+", "-"); ) left = this.binaryFn(left, token.text, this.multiplicative());
            return left;
        },
        multiplicative: function() {
            for (var token, left = this.unary(); token = this.expect("*", "/", "%"); ) left = this.binaryFn(left, token.text, this.unary());
            return left;
        },
        unary: function() {
            var token;
            return this.expect("+") ? this.primary() : (token = this.expect("-")) ? this.binaryFn(Parser.ZERO, token.text, this.unary()) : (token = this.expect("!")) ? this.unaryFn(token.text, this.unary()) : this.primary();
        },
        fieldAccess: function(object) {
            var getter = this.identifier();
            return extend(function(scope, locals, self) {
                var o = self || object(scope, locals);
                return null == o ? undefined : getter(o);
            }, {
                assign: function(scope, value, locals) {
                    var o = object(scope, locals);
                    return o || object.assign(scope, o = {}, locals), getter.assign(o, value);
                }
            });
        },
        objectIndex: function(obj) {
            var expression = this.text, indexFn = this.expression();
            return this.consume("]"), extend(function(self, locals) {
                var v, o = obj(self, locals), i = indexFn(self, locals);
                return ensureSafeMemberName(i, expression), o ? v = ensureSafeObject(o[i], expression) : undefined;
            }, {
                assign: function(self, value, locals) {
                    var key = ensureSafeMemberName(indexFn(self, locals), expression), o = ensureSafeObject(obj(self, locals), expression);
                    return o || obj.assign(self, o = {}, locals), o[key] = value;
                }
            });
        },
        functionCall: function(fnGetter, contextGetter) {
            var argsFn = [];
            if (")" !== this.peekToken().text) do argsFn.push(this.expression()); while (this.expect(","));
            this.consume(")");
            var expressionText = this.text, args = argsFn.length ? [] : null;
            return function(scope, locals) {
                var context = contextGetter ? contextGetter(scope, locals) : isDefined(contextGetter) ? undefined : scope, fn = fnGetter(scope, locals, context) || noop;
                if (args) for (var i = argsFn.length; i--; ) args[i] = ensureSafeObject(argsFn[i](scope, locals), expressionText);
                ensureSafeObject(context, expressionText), ensureSafeFunction(fn, expressionText);
                var v = fn.apply ? fn.apply(context, args) : fn(args[0], args[1], args[2], args[3], args[4]);
                return ensureSafeObject(v, expressionText);
            };
        },
        arrayDeclaration: function() {
            var elementFns = [];
            if ("]" !== this.peekToken().text) do {
                if (this.peek("]")) break;
                elementFns.push(this.expression());
            } while (this.expect(","));
            return this.consume("]"), extend(function(self, locals) {
                for (var array = [], i = 0, ii = elementFns.length; ii > i; i++) array.push(elementFns[i](self, locals));
                return array;
            }, {
                literal: !0,
                constant: elementFns.every(isConstant),
                inputs: elementFns
            });
        },
        object: function() {
            var keys = [], valueFns = [];
            if ("}" !== this.peekToken().text) do {
                if (this.peek("}")) break;
                var token = this.consume();
                token.constant ? keys.push(token.value) : token.identifier ? keys.push(token.text) : this.throwError("invalid key", token), 
                this.consume(":"), valueFns.push(this.expression());
            } while (this.expect(","));
            return this.consume("}"), extend(function(self, locals) {
                for (var object = {}, i = 0, ii = valueFns.length; ii > i; i++) object[keys[i]] = valueFns[i](self, locals);
                return object;
            }, {
                literal: !0,
                constant: valueFns.every(isConstant),
                inputs: valueFns
            });
        }
    };
    var getterFnCacheDefault = createMap(), getterFnCacheExpensive = createMap(), objectValueOf = Object.prototype.valueOf, $sceMinErr = minErr("$sce"), SCE_CONTEXTS = {
        HTML: "html",
        CSS: "css",
        URL: "url",
        RESOURCE_URL: "resourceUrl",
        JS: "js"
    }, $compileMinErr = minErr("$compile"), urlParsingNode = document.createElement("a"), originUrl = urlResolve(window.location.href);
    $FilterProvider.$inject = [ "$provide" ], currencyFilter.$inject = [ "$locale" ], 
    numberFilter.$inject = [ "$locale" ];
    var DECIMAL_SEP = ".", DATE_FORMATS = {
        yyyy: dateGetter("FullYear", 4),
        yy: dateGetter("FullYear", 2, 0, !0),
        y: dateGetter("FullYear", 1),
        MMMM: dateStrGetter("Month"),
        MMM: dateStrGetter("Month", !0),
        MM: dateGetter("Month", 2, 1),
        M: dateGetter("Month", 1, 1),
        dd: dateGetter("Date", 2),
        d: dateGetter("Date", 1),
        HH: dateGetter("Hours", 2),
        H: dateGetter("Hours", 1),
        hh: dateGetter("Hours", 2, -12),
        h: dateGetter("Hours", 1, -12),
        mm: dateGetter("Minutes", 2),
        m: dateGetter("Minutes", 1),
        ss: dateGetter("Seconds", 2),
        s: dateGetter("Seconds", 1),
        sss: dateGetter("Milliseconds", 3),
        EEEE: dateStrGetter("Day"),
        EEE: dateStrGetter("Day", !0),
        a: ampmGetter,
        Z: timeZoneGetter,
        ww: weekGetter(2),
        w: weekGetter(1)
    }, DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/, NUMBER_STRING = /^\-?\d+$/;
    dateFilter.$inject = [ "$locale" ];
    var lowercaseFilter = valueFn(lowercase), uppercaseFilter = valueFn(uppercase);
    orderByFilter.$inject = [ "$parse" ];
    var htmlAnchorDirective = valueFn({
        restrict: "E",
        compile: function(element, attr) {
            return attr.href || attr.xlinkHref || attr.name ? void 0 : function(scope, element) {
                if ("a" === element[0].nodeName.toLowerCase()) {
                    var href = "[object SVGAnimatedString]" === toString.call(element.prop("href")) ? "xlink:href" : "href";
                    element.on("click", function(event) {
                        element.attr(href) || event.preventDefault();
                    });
                }
            };
        }
    }), ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function(propName, attrName) {
        if ("multiple" != propName) {
            var normalized = directiveNormalize("ng-" + attrName);
            ngAttributeAliasDirectives[normalized] = function() {
                return {
                    restrict: "A",
                    priority: 100,
                    link: function(scope, element, attr) {
                        scope.$watch(attr[normalized], function(value) {
                            attr.$set(attrName, !!value);
                        });
                    }
                };
            };
        }
    }), forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
        ngAttributeAliasDirectives[ngAttr] = function() {
            return {
                priority: 100,
                link: function(scope, element, attr) {
                    if ("ngPattern" === ngAttr && "/" == attr.ngPattern.charAt(0)) {
                        var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
                        if (match) return void attr.$set("ngPattern", new RegExp(match[1], match[2]));
                    }
                    scope.$watch(attr[ngAttr], function(value) {
                        attr.$set(ngAttr, value);
                    });
                }
            };
        };
    }), forEach([ "src", "srcset", "href" ], function(attrName) {
        var normalized = directiveNormalize("ng-" + attrName);
        ngAttributeAliasDirectives[normalized] = function() {
            return {
                priority: 99,
                link: function(scope, element, attr) {
                    var propName = attrName, name = attrName;
                    "href" === attrName && "[object SVGAnimatedString]" === toString.call(element.prop("href")) && (name = "xlinkHref", 
                    attr.$attr[name] = "xlink:href", propName = null), attr.$observe(normalized, function(value) {
                        return value ? (attr.$set(name, value), void (msie && propName && element.prop(propName, attr[name]))) : void ("href" === attrName && attr.$set(name, null));
                    });
                }
            };
        };
    });
    var nullFormCtrl = {
        $addControl: noop,
        $$renameControl: nullFormRenameControl,
        $removeControl: noop,
        $setValidity: noop,
        $setDirty: noop,
        $setPristine: noop,
        $setSubmitted: noop
    }, SUBMITTED_CLASS = "ng-submitted";
    FormController.$inject = [ "$element", "$attrs", "$scope", "$animate", "$interpolate" ];
    var formDirectiveFactory = function(isNgForm) {
        return [ "$timeout", function($timeout) {
            var formDirective = {
                name: "form",
                restrict: isNgForm ? "EAC" : "E",
                controller: FormController,
                compile: function(formElement) {
                    return formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS), {
                        pre: function(scope, formElement, attr, controller) {
                            if (!("action" in attr)) {
                                var handleFormSubmission = function(event) {
                                    scope.$apply(function() {
                                        controller.$commitViewValue(), controller.$setSubmitted();
                                    }), event.preventDefault();
                                };
                                addEventListenerFn(formElement[0], "submit", handleFormSubmission), formElement.on("$destroy", function() {
                                    $timeout(function() {
                                        removeEventListenerFn(formElement[0], "submit", handleFormSubmission);
                                    }, 0, !1);
                                });
                            }
                            var parentFormCtrl = controller.$$parentForm, alias = controller.$name;
                            alias && (setter(scope, null, alias, controller, alias), attr.$observe(attr.name ? "name" : "ngForm", function(newValue) {
                                alias !== newValue && (setter(scope, null, alias, undefined, alias), alias = newValue, 
                                setter(scope, null, alias, controller, alias), parentFormCtrl.$$renameControl(controller, alias));
                            })), formElement.on("$destroy", function() {
                                parentFormCtrl.$removeControl(controller), alias && setter(scope, null, alias, undefined, alias), 
                                extend(controller, nullFormCtrl);
                            });
                        }
                    };
                }
            };
            return formDirective;
        } ];
    }, formDirective = formDirectiveFactory(), ngFormDirective = formDirectiveFactory(!0), ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/, URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i, NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/, DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/, WEEK_REGEXP = /^(\d{4})-W(\d\d)$/, MONTH_REGEXP = /^(\d{4})-(\d\d)$/, TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/, inputType = {
        text: textInputType,
        date: createDateInputType("date", DATE_REGEXP, createDateParser(DATE_REGEXP, [ "yyyy", "MM", "dd" ]), "yyyy-MM-dd"),
        "datetime-local": createDateInputType("datetimelocal", DATETIMELOCAL_REGEXP, createDateParser(DATETIMELOCAL_REGEXP, [ "yyyy", "MM", "dd", "HH", "mm", "ss", "sss" ]), "yyyy-MM-ddTHH:mm:ss.sss"),
        time: createDateInputType("time", TIME_REGEXP, createDateParser(TIME_REGEXP, [ "HH", "mm", "ss", "sss" ]), "HH:mm:ss.sss"),
        week: createDateInputType("week", WEEK_REGEXP, weekParser, "yyyy-Www"),
        month: createDateInputType("month", MONTH_REGEXP, createDateParser(MONTH_REGEXP, [ "yyyy", "MM" ]), "yyyy-MM"),
        number: numberInputType,
        url: urlInputType,
        email: emailInputType,
        radio: radioInputType,
        checkbox: checkboxInputType,
        hidden: noop,
        button: noop,
        submit: noop,
        reset: noop,
        file: noop
    }, inputDirective = [ "$browser", "$sniffer", "$filter", "$parse", function($browser, $sniffer, $filter, $parse) {
        return {
            restrict: "E",
            require: [ "?ngModel" ],
            link: {
                pre: function(scope, element, attr, ctrls) {
                    ctrls[0] && (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer, $browser, $filter, $parse);
                }
            }
        };
    } ], CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/, ngValueDirective = function() {
        return {
            restrict: "A",
            priority: 100,
            compile: function(tpl, tplAttr) {
                return CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue) ? function(scope, elm, attr) {
                    attr.$set("value", scope.$eval(attr.ngValue));
                } : function(scope, elm, attr) {
                    scope.$watch(attr.ngValue, function(value) {
                        attr.$set("value", value);
                    });
                };
            }
        };
    }, ngBindDirective = [ "$compile", function($compile) {
        return {
            restrict: "AC",
            compile: function(templateElement) {
                return $compile.$$addBindingClass(templateElement), function(scope, element, attr) {
                    $compile.$$addBindingInfo(element, attr.ngBind), element = element[0], scope.$watch(attr.ngBind, function(value) {
                        element.textContent = value === undefined ? "" : value;
                    });
                };
            }
        };
    } ], ngBindTemplateDirective = [ "$interpolate", "$compile", function($interpolate, $compile) {
        return {
            compile: function(templateElement) {
                return $compile.$$addBindingClass(templateElement), function(scope, element, attr) {
                    var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
                    $compile.$$addBindingInfo(element, interpolateFn.expressions), element = element[0], 
                    attr.$observe("ngBindTemplate", function(value) {
                        element.textContent = value === undefined ? "" : value;
                    });
                };
            }
        };
    } ], ngBindHtmlDirective = [ "$sce", "$parse", "$compile", function($sce, $parse, $compile) {
        return {
            restrict: "A",
            compile: function(tElement, tAttrs) {
                var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml), ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function(value) {
                    return (value || "").toString();
                });
                return $compile.$$addBindingClass(tElement), function(scope, element, attr) {
                    $compile.$$addBindingInfo(element, attr.ngBindHtml), scope.$watch(ngBindHtmlWatch, function() {
                        element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || "");
                    });
                };
            }
        };
    } ], ngChangeDirective = valueFn({
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attr, ctrl) {
            ctrl.$viewChangeListeners.push(function() {
                scope.$eval(attr.ngChange);
            });
        }
    }), ngClassDirective = classDirective("", !0), ngClassOddDirective = classDirective("Odd", 0), ngClassEvenDirective = classDirective("Even", 1), ngCloakDirective = ngDirective({
        compile: function(element, attr) {
            attr.$set("ngCloak", undefined), element.removeClass("ng-cloak");
        }
    }), ngControllerDirective = [ function() {
        return {
            restrict: "A",
            scope: !0,
            controller: "@",
            priority: 500
        };
    } ], ngEventDirectives = {}, forceAsyncEvents = {
        blur: !0,
        focus: !0
    };
    forEach("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(eventName) {
        var directiveName = directiveNormalize("ng-" + eventName);
        ngEventDirectives[directiveName] = [ "$parse", "$rootScope", function($parse, $rootScope) {
            return {
                restrict: "A",
                compile: function($element, attr) {
                    var fn = $parse(attr[directiveName], null, !0);
                    return function(scope, element) {
                        element.on(eventName, function(event) {
                            var callback = function() {
                                fn(scope, {
                                    $event: event
                                });
                            };
                            forceAsyncEvents[eventName] && $rootScope.$$phase ? scope.$evalAsync(callback) : scope.$apply(callback);
                        });
                    };
                }
            };
        } ];
    });
    var ngIfDirective = [ "$animate", function($animate) {
        return {
            multiElement: !0,
            transclude: "element",
            priority: 600,
            terminal: !0,
            restrict: "A",
            $$tlb: !0,
            link: function($scope, $element, $attr, ctrl, $transclude) {
                var block, childScope, previousElements;
                $scope.$watch($attr.ngIf, function(value) {
                    value ? childScope || $transclude(function(clone, newScope) {
                        childScope = newScope, clone[clone.length++] = document.createComment(" end ngIf: " + $attr.ngIf + " "), 
                        block = {
                            clone: clone
                        }, $animate.enter(clone, $element.parent(), $element);
                    }) : (previousElements && (previousElements.remove(), previousElements = null), 
                    childScope && (childScope.$destroy(), childScope = null), block && (previousElements = getBlockNodes(block.clone), 
                    $animate.leave(previousElements).then(function() {
                        previousElements = null;
                    }), block = null));
                });
            }
        };
    } ], ngIncludeDirective = [ "$templateRequest", "$anchorScroll", "$animate", "$sce", function($templateRequest, $anchorScroll, $animate, $sce) {
        return {
            restrict: "ECA",
            priority: 400,
            terminal: !0,
            transclude: "element",
            controller: angular.noop,
            compile: function(element, attr) {
                var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || "", autoScrollExp = attr.autoscroll;
                return function(scope, $element, $attr, ctrl, $transclude) {
                    var currentScope, previousElement, currentElement, changeCounter = 0, cleanupLastIncludeContent = function() {
                        previousElement && (previousElement.remove(), previousElement = null), currentScope && (currentScope.$destroy(), 
                        currentScope = null), currentElement && ($animate.leave(currentElement).then(function() {
                            previousElement = null;
                        }), previousElement = currentElement, currentElement = null);
                    };
                    scope.$watch($sce.parseAsResourceUrl(srcExp), function(src) {
                        var afterAnimation = function() {
                            !isDefined(autoScrollExp) || autoScrollExp && !scope.$eval(autoScrollExp) || $anchorScroll();
                        }, thisChangeId = ++changeCounter;
                        src ? ($templateRequest(src, !0).then(function(response) {
                            if (thisChangeId === changeCounter) {
                                var newScope = scope.$new();
                                ctrl.template = response;
                                var clone = $transclude(newScope, function(clone) {
                                    cleanupLastIncludeContent(), $animate.enter(clone, null, $element).then(afterAnimation);
                                });
                                currentScope = newScope, currentElement = clone, currentScope.$emit("$includeContentLoaded", src), 
                                scope.$eval(onloadExp);
                            }
                        }, function() {
                            thisChangeId === changeCounter && (cleanupLastIncludeContent(), scope.$emit("$includeContentError", src));
                        }), scope.$emit("$includeContentRequested", src)) : (cleanupLastIncludeContent(), 
                        ctrl.template = null);
                    });
                };
            }
        };
    } ], ngIncludeFillContentDirective = [ "$compile", function($compile) {
        return {
            restrict: "ECA",
            priority: -400,
            require: "ngInclude",
            link: function(scope, $element, $attr, ctrl) {
                return /SVG/.test($element[0].toString()) ? ($element.empty(), void $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope, function(clone) {
                    $element.append(clone);
                }, {
                    futureParentElement: $element
                })) : ($element.html(ctrl.template), void $compile($element.contents())(scope));
            }
        };
    } ], ngInitDirective = ngDirective({
        priority: 450,
        compile: function() {
            return {
                pre: function(scope, element, attrs) {
                    scope.$eval(attrs.ngInit);
                }
            };
        }
    }), ngListDirective = function() {
        return {
            restrict: "A",
            priority: 100,
            require: "ngModel",
            link: function(scope, element, attr, ctrl) {
                var ngList = element.attr(attr.$attr.ngList) || ", ", trimValues = "false" !== attr.ngTrim, separator = trimValues ? trim(ngList) : ngList, parse = function(viewValue) {
                    if (!isUndefined(viewValue)) {
                        var list = [];
                        return viewValue && forEach(viewValue.split(separator), function(value) {
                            value && list.push(trimValues ? trim(value) : value);
                        }), list;
                    }
                };
                ctrl.$parsers.push(parse), ctrl.$formatters.push(function(value) {
                    return isArray(value) ? value.join(ngList) : undefined;
                }), ctrl.$isEmpty = function(value) {
                    return !value || !value.length;
                };
            }
        };
    }, VALID_CLASS = "ng-valid", INVALID_CLASS = "ng-invalid", PRISTINE_CLASS = "ng-pristine", DIRTY_CLASS = "ng-dirty", UNTOUCHED_CLASS = "ng-untouched", TOUCHED_CLASS = "ng-touched", PENDING_CLASS = "ng-pending", $ngModelMinErr = new minErr("ngModel"), NgModelController = [ "$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
        this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$$rawModelValue = undefined, 
        this.$validators = {}, this.$asyncValidators = {}, this.$parsers = [], this.$formatters = [], 
        this.$viewChangeListeners = [], this.$untouched = !0, this.$touched = !1, this.$pristine = !0, 
        this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$error = {}, this.$$success = {}, 
        this.$pending = undefined, this.$name = $interpolate($attr.name || "", !1)($scope);
        var parsedNgModel = $parse($attr.ngModel), parsedNgModelAssign = parsedNgModel.assign, ngModelGet = parsedNgModel, ngModelSet = parsedNgModelAssign, pendingDebounce = null, ctrl = this;
        this.$$setOptions = function(options) {
            if (ctrl.$options = options, options && options.getterSetter) {
                var invokeModelGetter = $parse($attr.ngModel + "()"), invokeModelSetter = $parse($attr.ngModel + "($$$p)");
                ngModelGet = function($scope) {
                    var modelValue = parsedNgModel($scope);
                    return isFunction(modelValue) && (modelValue = invokeModelGetter($scope)), modelValue;
                }, ngModelSet = function($scope) {
                    isFunction(parsedNgModel($scope)) ? invokeModelSetter($scope, {
                        $$$p: ctrl.$modelValue
                    }) : parsedNgModelAssign($scope, ctrl.$modelValue);
                };
            } else if (!parsedNgModel.assign) throw $ngModelMinErr("nonassign", "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element));
        }, this.$render = noop, this.$isEmpty = function(value) {
            return isUndefined(value) || "" === value || null === value || value !== value;
        };
        var parentForm = $element.inheritedData("$formController") || nullFormCtrl, currentValidationRunId = 0;
        addSetValidityMethod({
            ctrl: this,
            $element: $element,
            set: function(object, property) {
                object[property] = !0;
            },
            unset: function(object, property) {
                delete object[property];
            },
            parentForm: parentForm,
            $animate: $animate
        }), this.$setPristine = function() {
            ctrl.$dirty = !1, ctrl.$pristine = !0, $animate.removeClass($element, DIRTY_CLASS), 
            $animate.addClass($element, PRISTINE_CLASS);
        }, this.$setDirty = function() {
            ctrl.$dirty = !0, ctrl.$pristine = !1, $animate.removeClass($element, PRISTINE_CLASS), 
            $animate.addClass($element, DIRTY_CLASS), parentForm.$setDirty();
        }, this.$setUntouched = function() {
            ctrl.$touched = !1, ctrl.$untouched = !0, $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS);
        }, this.$setTouched = function() {
            ctrl.$touched = !0, ctrl.$untouched = !1, $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS);
        }, this.$rollbackViewValue = function() {
            $timeout.cancel(pendingDebounce), ctrl.$viewValue = ctrl.$$lastCommittedViewValue, 
            ctrl.$render();
        }, this.$validate = function() {
            if (!isNumber(ctrl.$modelValue) || !isNaN(ctrl.$modelValue)) {
                var viewValue = ctrl.$$lastCommittedViewValue, modelValue = ctrl.$$rawModelValue, parserName = ctrl.$$parserName || "parse", parserValid = ctrl.$error[parserName] ? !1 : undefined, prevValid = ctrl.$valid, prevModelValue = ctrl.$modelValue, allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
                ctrl.$$runValidators(parserValid, modelValue, viewValue, function(allValid) {
                    allowInvalid || prevValid === allValid || (ctrl.$modelValue = allValid ? modelValue : undefined, 
                    ctrl.$modelValue !== prevModelValue && ctrl.$$writeModelToScope());
                });
            }
        }, this.$$runValidators = function(parseValid, modelValue, viewValue, doneCallback) {
            function processParseErrors(parseValid) {
                var errorKey = ctrl.$$parserName || "parse";
                if (parseValid === undefined) setValidity(errorKey, null); else if (setValidity(errorKey, parseValid), 
                !parseValid) return forEach(ctrl.$validators, function(v, name) {
                    setValidity(name, null);
                }), forEach(ctrl.$asyncValidators, function(v, name) {
                    setValidity(name, null);
                }), !1;
                return !0;
            }
            function processSyncValidators() {
                var syncValidatorsValid = !0;
                return forEach(ctrl.$validators, function(validator, name) {
                    var result = validator(modelValue, viewValue);
                    syncValidatorsValid = syncValidatorsValid && result, setValidity(name, result);
                }), syncValidatorsValid ? !0 : (forEach(ctrl.$asyncValidators, function(v, name) {
                    setValidity(name, null);
                }), !1);
            }
            function processAsyncValidators() {
                var validatorPromises = [], allValid = !0;
                forEach(ctrl.$asyncValidators, function(validator, name) {
                    var promise = validator(modelValue, viewValue);
                    if (!isPromiseLike(promise)) throw $ngModelMinErr("$asyncValidators", "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
                    setValidity(name, undefined), validatorPromises.push(promise.then(function() {
                        setValidity(name, !0);
                    }, function() {
                        allValid = !1, setValidity(name, !1);
                    }));
                }), validatorPromises.length ? $q.all(validatorPromises).then(function() {
                    validationDone(allValid);
                }, noop) : validationDone(!0);
            }
            function setValidity(name, isValid) {
                localValidationRunId === currentValidationRunId && ctrl.$setValidity(name, isValid);
            }
            function validationDone(allValid) {
                localValidationRunId === currentValidationRunId && doneCallback(allValid);
            }
            currentValidationRunId++;
            var localValidationRunId = currentValidationRunId;
            return processParseErrors(parseValid) && processSyncValidators() ? void processAsyncValidators() : void validationDone(!1);
        }, this.$commitViewValue = function() {
            var viewValue = ctrl.$viewValue;
            $timeout.cancel(pendingDebounce), (ctrl.$$lastCommittedViewValue !== viewValue || "" === viewValue && ctrl.$$hasNativeValidators) && (ctrl.$$lastCommittedViewValue = viewValue, 
            ctrl.$pristine && this.$setDirty(), this.$$parseAndValidate());
        }, this.$$parseAndValidate = function() {
            function writeToModelIfNeeded() {
                ctrl.$modelValue !== prevModelValue && ctrl.$$writeModelToScope();
            }
            var viewValue = ctrl.$$lastCommittedViewValue, modelValue = viewValue, parserValid = isUndefined(modelValue) ? undefined : !0;
            if (parserValid) for (var i = 0; i < ctrl.$parsers.length; i++) if (modelValue = ctrl.$parsers[i](modelValue), 
            isUndefined(modelValue)) {
                parserValid = !1;
                break;
            }
            isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue) && (ctrl.$modelValue = ngModelGet($scope));
            var prevModelValue = ctrl.$modelValue, allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
            ctrl.$$rawModelValue = modelValue, allowInvalid && (ctrl.$modelValue = modelValue, 
            writeToModelIfNeeded()), ctrl.$$runValidators(parserValid, modelValue, ctrl.$$lastCommittedViewValue, function(allValid) {
                allowInvalid || (ctrl.$modelValue = allValid ? modelValue : undefined, writeToModelIfNeeded());
            });
        }, this.$$writeModelToScope = function() {
            ngModelSet($scope, ctrl.$modelValue), forEach(ctrl.$viewChangeListeners, function(listener) {
                try {
                    listener();
                } catch (e) {
                    $exceptionHandler(e);
                }
            });
        }, this.$setViewValue = function(value, trigger) {
            ctrl.$viewValue = value, (!ctrl.$options || ctrl.$options.updateOnDefault) && ctrl.$$debounceViewValueCommit(trigger);
        }, this.$$debounceViewValueCommit = function(trigger) {
            var debounce, debounceDelay = 0, options = ctrl.$options;
            options && isDefined(options.debounce) && (debounce = options.debounce, isNumber(debounce) ? debounceDelay = debounce : isNumber(debounce[trigger]) ? debounceDelay = debounce[trigger] : isNumber(debounce["default"]) && (debounceDelay = debounce["default"])), 
            $timeout.cancel(pendingDebounce), debounceDelay ? pendingDebounce = $timeout(function() {
                ctrl.$commitViewValue();
            }, debounceDelay) : $rootScope.$$phase ? ctrl.$commitViewValue() : $scope.$apply(function() {
                ctrl.$commitViewValue();
            });
        }, $scope.$watch(function() {
            var modelValue = ngModelGet($scope);
            if (modelValue !== ctrl.$modelValue) {
                ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
                for (var formatters = ctrl.$formatters, idx = formatters.length, viewValue = modelValue; idx--; ) viewValue = formatters[idx](viewValue);
                ctrl.$viewValue !== viewValue && (ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue, 
                ctrl.$render(), ctrl.$$runValidators(undefined, modelValue, viewValue, noop));
            }
            return modelValue;
        });
    } ], ngModelDirective = [ "$rootScope", function($rootScope) {
        return {
            restrict: "A",
            require: [ "ngModel", "^?form", "^?ngModelOptions" ],
            controller: NgModelController,
            priority: 1,
            compile: function(element) {
                return element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS), 
                {
                    pre: function(scope, element, attr, ctrls) {
                        var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
                        modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options), formCtrl.$addControl(modelCtrl), 
                        attr.$observe("name", function(newValue) {
                            modelCtrl.$name !== newValue && formCtrl.$$renameControl(modelCtrl, newValue);
                        }), scope.$on("$destroy", function() {
                            formCtrl.$removeControl(modelCtrl);
                        });
                    },
                    post: function(scope, element, attr, ctrls) {
                        var modelCtrl = ctrls[0];
                        modelCtrl.$options && modelCtrl.$options.updateOn && element.on(modelCtrl.$options.updateOn, function(ev) {
                            modelCtrl.$$debounceViewValueCommit(ev && ev.type);
                        }), element.on("blur", function() {
                            modelCtrl.$touched || ($rootScope.$$phase ? scope.$evalAsync(modelCtrl.$setTouched) : scope.$apply(modelCtrl.$setTouched));
                        });
                    }
                };
            }
        };
    } ], DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/, ngModelOptionsDirective = function() {
        return {
            restrict: "A",
            controller: [ "$scope", "$attrs", function($scope, $attrs) {
                var that = this;
                this.$options = $scope.$eval($attrs.ngModelOptions), this.$options.updateOn !== undefined ? (this.$options.updateOnDefault = !1, 
                this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function() {
                    return that.$options.updateOnDefault = !0, " ";
                }))) : this.$options.updateOnDefault = !0;
            } ]
        };
    }, ngNonBindableDirective = ngDirective({
        terminal: !0,
        priority: 1e3
    }), ngPluralizeDirective = [ "$locale", "$interpolate", function($locale, $interpolate) {
        var BRACE = /{}/g, IS_WHEN = /^when(Minus)?(.+)$/;
        return {
            restrict: "EA",
            link: function(scope, element, attr) {
                function updateElementText(newText) {
                    element.text(newText || "");
                }
                var lastCount, numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), braceReplacement = startSymbol + numberExp + "-" + offset + endSymbol, watchRemover = angular.noop;
                forEach(attr, function(expression, attributeName) {
                    var tmpMatch = IS_WHEN.exec(attributeName);
                    if (tmpMatch) {
                        var whenKey = (tmpMatch[1] ? "-" : "") + lowercase(tmpMatch[2]);
                        whens[whenKey] = element.attr(attr.$attr[attributeName]);
                    }
                }), forEach(whens, function(expression, key) {
                    whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));
                }), scope.$watch(numberExp, function(newVal) {
                    var count = parseFloat(newVal), countIsNaN = isNaN(count);
                    countIsNaN || count in whens || (count = $locale.pluralCat(count - offset)), count === lastCount || countIsNaN && isNaN(lastCount) || (watchRemover(), 
                    watchRemover = scope.$watch(whensExpFns[count], updateElementText), lastCount = count);
                });
            }
        };
    } ], ngRepeatDirective = [ "$parse", "$animate", function($parse, $animate) {
        var NG_REMOVED = "$$NG_REMOVED", ngRepeatMinErr = minErr("ngRepeat"), updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
            scope[valueIdentifier] = value, keyIdentifier && (scope[keyIdentifier] = key), scope.$index = index, 
            scope.$first = 0 === index, scope.$last = index === arrayLength - 1, scope.$middle = !(scope.$first || scope.$last), 
            scope.$odd = !(scope.$even = 0 === (1 & index));
        }, getBlockStart = function(block) {
            return block.clone[0];
        }, getBlockEnd = function(block) {
            return block.clone[block.clone.length - 1];
        };
        return {
            restrict: "A",
            multiElement: !0,
            transclude: "element",
            priority: 1e3,
            terminal: !0,
            $$tlb: !0,
            compile: function($element, $attr) {
                var expression = $attr.ngRepeat, ngRepeatEndComment = document.createComment(" end ngRepeat: " + expression + " "), match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                if (!match) throw ngRepeatMinErr("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                var lhs = match[1], rhs = match[2], aliasAs = match[3], trackByExp = match[4];
                if (match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/), 
                !match) throw ngRepeatMinErr("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                var valueIdentifier = match[3] || match[1], keyIdentifier = match[2];
                if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) throw ngRepeatMinErr("badident", "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
                var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, hashFnLocals = {
                    $id: hashKey
                };
                return trackByExp ? trackByExpGetter = $parse(trackByExp) : (trackByIdArrayFn = function(key, value) {
                    return hashKey(value);
                }, trackByIdObjFn = function(key) {
                    return key;
                }), function($scope, $element, $attr, ctrl, $transclude) {
                    trackByExpGetter && (trackByIdExpFn = function(key, value, index) {
                        return keyIdentifier && (hashFnLocals[keyIdentifier] = key), hashFnLocals[valueIdentifier] = value, 
                        hashFnLocals.$index = index, trackByExpGetter($scope, hashFnLocals);
                    });
                    var lastBlockMap = createMap();
                    $scope.$watchCollection(rhs, function(collection) {
                        var index, length, nextNode, collectionLength, key, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder, elementsToRemove, previousNode = $element[0], nextBlockMap = createMap();
                        if (aliasAs && ($scope[aliasAs] = collection), isArrayLike(collection)) collectionKeys = collection, 
                        trackByIdFn = trackByIdExpFn || trackByIdArrayFn; else {
                            trackByIdFn = trackByIdExpFn || trackByIdObjFn, collectionKeys = [];
                            for (var itemKey in collection) collection.hasOwnProperty(itemKey) && "$" != itemKey.charAt(0) && collectionKeys.push(itemKey);
                            collectionKeys.sort();
                        }
                        for (collectionLength = collectionKeys.length, nextBlockOrder = new Array(collectionLength), 
                        index = 0; collectionLength > index; index++) if (key = collection === collectionKeys ? index : collectionKeys[index], 
                        value = collection[key], trackById = trackByIdFn(key, value, index), lastBlockMap[trackById]) block = lastBlockMap[trackById], 
                        delete lastBlockMap[trackById], nextBlockMap[trackById] = block, nextBlockOrder[index] = block; else {
                            if (nextBlockMap[trackById]) throw forEach(nextBlockOrder, function(block) {
                                block && block.scope && (lastBlockMap[block.id] = block);
                            }), ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
                            nextBlockOrder[index] = {
                                id: trackById,
                                scope: undefined,
                                clone: undefined
                            }, nextBlockMap[trackById] = !0;
                        }
                        for (var blockKey in lastBlockMap) {
                            if (block = lastBlockMap[blockKey], elementsToRemove = getBlockNodes(block.clone), 
                            $animate.leave(elementsToRemove), elementsToRemove[0].parentNode) for (index = 0, 
                            length = elementsToRemove.length; length > index; index++) elementsToRemove[index][NG_REMOVED] = !0;
                            block.scope.$destroy();
                        }
                        for (index = 0; collectionLength > index; index++) if (key = collection === collectionKeys ? index : collectionKeys[index], 
                        value = collection[key], block = nextBlockOrder[index], block.scope) {
                            nextNode = previousNode;
                            do nextNode = nextNode.nextSibling; while (nextNode && nextNode[NG_REMOVED]);
                            getBlockStart(block) != nextNode && $animate.move(getBlockNodes(block.clone), null, jqLite(previousNode)), 
                            previousNode = getBlockEnd(block), updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                        } else $transclude(function(clone, scope) {
                            block.scope = scope;
                            var endNode = ngRepeatEndComment.cloneNode(!1);
                            clone[clone.length++] = endNode, $animate.enter(clone, null, jqLite(previousNode)), 
                            previousNode = endNode, block.clone = clone, nextBlockMap[block.id] = block, updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                        });
                        lastBlockMap = nextBlockMap;
                    });
                };
            }
        };
    } ], NG_HIDE_CLASS = "ng-hide", NG_HIDE_IN_PROGRESS_CLASS = "ng-hide-animate", ngShowDirective = [ "$animate", function($animate) {
        return {
            restrict: "A",
            multiElement: !0,
            link: function(scope, element, attr) {
                scope.$watch(attr.ngShow, function(value) {
                    $animate[value ? "removeClass" : "addClass"](element, NG_HIDE_CLASS, {
                        tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                    });
                });
            }
        };
    } ], ngHideDirective = [ "$animate", function($animate) {
        return {
            restrict: "A",
            multiElement: !0,
            link: function(scope, element, attr) {
                scope.$watch(attr.ngHide, function(value) {
                    $animate[value ? "addClass" : "removeClass"](element, NG_HIDE_CLASS, {
                        tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                    });
                });
            }
        };
    } ], ngStyleDirective = ngDirective(function(scope, element, attr) {
        scope.$watchCollection(attr.ngStyle, function(newStyles, oldStyles) {
            oldStyles && newStyles !== oldStyles && forEach(oldStyles, function(val, style) {
                element.css(style, "");
            }), newStyles && element.css(newStyles);
        });
    }), ngSwitchDirective = [ "$animate", function($animate) {
        return {
            restrict: "EA",
            require: "ngSwitch",
            controller: [ "$scope", function() {
                this.cases = {};
            } ],
            link: function(scope, element, attr, ngSwitchController) {
                var watchExpr = attr.ngSwitch || attr.on, selectedTranscludes = [], selectedElements = [], previousLeaveAnimations = [], selectedScopes = [], spliceFactory = function(array, index) {
                    return function() {
                        array.splice(index, 1);
                    };
                };
                scope.$watch(watchExpr, function(value) {
                    var i, ii;
                    for (i = 0, ii = previousLeaveAnimations.length; ii > i; ++i) $animate.cancel(previousLeaveAnimations[i]);
                    for (previousLeaveAnimations.length = 0, i = 0, ii = selectedScopes.length; ii > i; ++i) {
                        var selected = getBlockNodes(selectedElements[i].clone);
                        selectedScopes[i].$destroy();
                        var promise = previousLeaveAnimations[i] = $animate.leave(selected);
                        promise.then(spliceFactory(previousLeaveAnimations, i));
                    }
                    selectedElements.length = 0, selectedScopes.length = 0, (selectedTranscludes = ngSwitchController.cases["!" + value] || ngSwitchController.cases["?"]) && forEach(selectedTranscludes, function(selectedTransclude) {
                        selectedTransclude.transclude(function(caseElement, selectedScope) {
                            selectedScopes.push(selectedScope);
                            var anchor = selectedTransclude.element;
                            caseElement[caseElement.length++] = document.createComment(" end ngSwitchWhen: ");
                            var block = {
                                clone: caseElement
                            };
                            selectedElements.push(block), $animate.enter(caseElement, anchor.parent(), anchor);
                        });
                    });
                });
            }
        };
    } ], ngSwitchWhenDirective = ngDirective({
        transclude: "element",
        priority: 1200,
        require: "^ngSwitch",
        multiElement: !0,
        link: function(scope, element, attrs, ctrl, $transclude) {
            ctrl.cases["!" + attrs.ngSwitchWhen] = ctrl.cases["!" + attrs.ngSwitchWhen] || [], 
            ctrl.cases["!" + attrs.ngSwitchWhen].push({
                transclude: $transclude,
                element: element
            });
        }
    }), ngSwitchDefaultDirective = ngDirective({
        transclude: "element",
        priority: 1200,
        require: "^ngSwitch",
        multiElement: !0,
        link: function(scope, element, attr, ctrl, $transclude) {
            ctrl.cases["?"] = ctrl.cases["?"] || [], ctrl.cases["?"].push({
                transclude: $transclude,
                element: element
            });
        }
    }), ngTranscludeDirective = ngDirective({
        restrict: "EAC",
        link: function($scope, $element, $attrs, controller, $transclude) {
            if (!$transclude) throw minErr("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", startingTag($element));
            $transclude(function(clone) {
                $element.empty(), $element.append(clone);
            });
        }
    }), scriptDirective = [ "$templateCache", function($templateCache) {
        return {
            restrict: "E",
            terminal: !0,
            compile: function(element, attr) {
                if ("text/ng-template" == attr.type) {
                    var templateUrl = attr.id, text = element[0].text;
                    $templateCache.put(templateUrl, text);
                }
            }
        };
    } ], ngOptionsMinErr = minErr("ngOptions"), ngOptionsDirective = valueFn({
        restrict: "A",
        terminal: !0
    }), selectDirective = [ "$compile", "$parse", function($compile, $parse) {
        var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, nullModelCtrl = {
            $setViewValue: noop
        };
        return {
            restrict: "E",
            require: [ "select", "?ngModel" ],
            controller: [ "$element", "$scope", "$attrs", function($element, $scope, $attrs) {
                var nullOption, unknownOption, self = this, optionsMap = {}, ngModelCtrl = nullModelCtrl;
                self.databound = $attrs.ngModel, self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {
                    ngModelCtrl = ngModelCtrl_, nullOption = nullOption_, unknownOption = unknownOption_;
                }, self.addOption = function(value, element) {
                    assertNotHasOwnProperty(value, '"option value"'), optionsMap[value] = !0, ngModelCtrl.$viewValue == value && ($element.val(value), 
                    unknownOption.parent() && unknownOption.remove()), element && element[0].hasAttribute("selected") && (element[0].selected = !0);
                }, self.removeOption = function(value) {
                    this.hasOption(value) && (delete optionsMap[value], ngModelCtrl.$viewValue === value && this.renderUnknownOption(value));
                }, self.renderUnknownOption = function(val) {
                    var unknownVal = "? " + hashKey(val) + " ?";
                    unknownOption.val(unknownVal), $element.prepend(unknownOption), $element.val(unknownVal), 
                    unknownOption.prop("selected", !0);
                }, self.hasOption = function(value) {
                    return optionsMap.hasOwnProperty(value);
                }, $scope.$on("$destroy", function() {
                    self.renderUnknownOption = noop;
                });
            } ],
            link: function(scope, element, attr, ctrls) {
                function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
                    ngModelCtrl.$render = function() {
                        var viewValue = ngModelCtrl.$viewValue;
                        selectCtrl.hasOption(viewValue) ? (unknownOption.parent() && unknownOption.remove(), 
                        selectElement.val(viewValue), "" === viewValue && emptyOption.prop("selected", !0)) : isUndefined(viewValue) && emptyOption ? selectElement.val("") : selectCtrl.renderUnknownOption(viewValue);
                    }, selectElement.on("change", function() {
                        scope.$apply(function() {
                            unknownOption.parent() && unknownOption.remove(), ngModelCtrl.$setViewValue(selectElement.val());
                        });
                    });
                }
                function setupAsMultiple(scope, selectElement, ctrl) {
                    var lastView;
                    ctrl.$render = function() {
                        var items = new HashMap(ctrl.$viewValue);
                        forEach(selectElement.find("option"), function(option) {
                            option.selected = isDefined(items.get(option.value));
                        });
                    }, scope.$watch(function() {
                        equals(lastView, ctrl.$viewValue) || (lastView = shallowCopy(ctrl.$viewValue), ctrl.$render());
                    }), selectElement.on("change", function() {
                        scope.$apply(function() {
                            var array = [];
                            forEach(selectElement.find("option"), function(option) {
                                option.selected && array.push(option.value);
                            }), ctrl.$setViewValue(array);
                        });
                    });
                }
                function setupAsOptions(scope, selectElement, ctrl) {
                    function callExpression(exprFn, key, value) {
                        return locals[valueName] = value, keyName && (locals[keyName] = key), exprFn(scope, locals);
                    }
                    function selectionChanged() {
                        scope.$apply(function() {
                            var viewValue, collection = valuesFn(scope) || [];
                            if (multiple) viewValue = [], forEach(selectElement.val(), function(selectedKey) {
                                selectedKey = trackFn ? trackKeysCache[selectedKey] : selectedKey, viewValue.push(getViewValue(selectedKey, collection[selectedKey]));
                            }); else {
                                var selectedKey = trackFn ? trackKeysCache[selectElement.val()] : selectElement.val();
                                viewValue = getViewValue(selectedKey, collection[selectedKey]);
                            }
                            ctrl.$setViewValue(viewValue), render();
                        });
                    }
                    function getViewValue(key, value) {
                        if ("?" === key) return undefined;
                        if ("" === key) return null;
                        var viewValueFn = selectAsFn ? selectAsFn : valueFn;
                        return callExpression(viewValueFn, key, value);
                    }
                    function getLabels() {
                        var toDisplay, values = valuesFn(scope);
                        if (values && isArray(values)) {
                            toDisplay = new Array(values.length);
                            for (var i = 0, ii = values.length; ii > i; i++) toDisplay[i] = callExpression(displayFn, i, values[i]);
                            return toDisplay;
                        }
                        if (values) {
                            toDisplay = {};
                            for (var prop in values) values.hasOwnProperty(prop) && (toDisplay[prop] = callExpression(displayFn, prop, values[prop]));
                        }
                        return toDisplay;
                    }
                    function createIsSelectedFn(viewValue) {
                        var selectedSet;
                        if (multiple) if (trackFn && isArray(viewValue)) {
                            selectedSet = new HashMap([]);
                            for (var trackIndex = 0; trackIndex < viewValue.length; trackIndex++) selectedSet.put(callExpression(trackFn, null, viewValue[trackIndex]), !0);
                        } else selectedSet = new HashMap(viewValue); else trackFn && (viewValue = callExpression(trackFn, null, viewValue));
                        return function(key, value) {
                            var compareValueFn;
                            return compareValueFn = trackFn ? trackFn : selectAsFn ? selectAsFn : valueFn, multiple ? isDefined(selectedSet.remove(callExpression(compareValueFn, key, value))) : viewValue === callExpression(compareValueFn, key, value);
                        };
                    }
                    function scheduleRendering() {
                        renderScheduled || (scope.$$postDigest(render), renderScheduled = !0);
                    }
                    function updateLabelMap(labelMap, label, added) {
                        labelMap[label] = labelMap[label] || 0, labelMap[label] += added ? 1 : -1;
                    }
                    function render() {
                        renderScheduled = !1;
                        var optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, key, value, groupLength, length, groupIndex, index, selected, lastElement, element, label, optionId, optionGroups = {
                            "": []
                        }, optionGroupNames = [ "" ], viewValue = ctrl.$viewValue, values = valuesFn(scope) || [], keys = keyName ? sortedKeys(values) : values, labelMap = {}, isSelected = createIsSelectedFn(viewValue), anySelected = !1;
                        for (trackKeysCache = {}, index = 0; length = keys.length, length > index; index++) key = index, 
                        keyName && (key = keys[index], "$" === key.charAt(0)) || (value = values[key], optionGroupName = callExpression(groupByFn, key, value) || "", 
                        (optionGroup = optionGroups[optionGroupName]) || (optionGroup = optionGroups[optionGroupName] = [], 
                        optionGroupNames.push(optionGroupName)), selected = isSelected(key, value), anySelected = anySelected || selected, 
                        label = callExpression(displayFn, key, value), label = isDefined(label) ? label : "", 
                        optionId = trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index, trackFn && (trackKeysCache[optionId] = key), 
                        optionGroup.push({
                            id: optionId,
                            label: label,
                            selected: selected
                        }));
                        for (multiple || (nullOption || null === viewValue ? optionGroups[""].unshift({
                            id: "",
                            label: "",
                            selected: !anySelected
                        }) : anySelected || optionGroups[""].unshift({
                            id: "?",
                            label: "",
                            selected: !0
                        })), groupIndex = 0, groupLength = optionGroupNames.length; groupLength > groupIndex; groupIndex++) {
                            for (optionGroupName = optionGroupNames[groupIndex], optionGroup = optionGroups[optionGroupName], 
                            optionGroupsCache.length <= groupIndex ? (existingParent = {
                                element: optGroupTemplate.clone().attr("label", optionGroupName),
                                label: optionGroup.label
                            }, existingOptions = [ existingParent ], optionGroupsCache.push(existingOptions), 
                            selectElement.append(existingParent.element)) : (existingOptions = optionGroupsCache[groupIndex], 
                            existingParent = existingOptions[0], existingParent.label != optionGroupName && existingParent.element.attr("label", existingParent.label = optionGroupName)), 
                            lastElement = null, index = 0, length = optionGroup.length; length > index; index++) option = optionGroup[index], 
                            (existingOption = existingOptions[index + 1]) ? (lastElement = existingOption.element, 
                            existingOption.label !== option.label && (updateLabelMap(labelMap, existingOption.label, !1), 
                            updateLabelMap(labelMap, option.label, !0), lastElement.text(existingOption.label = option.label), 
                            lastElement.prop("label", existingOption.label)), existingOption.id !== option.id && lastElement.val(existingOption.id = option.id), 
                            lastElement[0].selected !== option.selected && (lastElement.prop("selected", existingOption.selected = option.selected), 
                            msie && lastElement.prop("selected", existingOption.selected))) : ("" === option.id && nullOption ? element = nullOption : (element = optionTemplate.clone()).val(option.id).prop("selected", option.selected).attr("selected", option.selected).prop("label", option.label).text(option.label), 
                            existingOptions.push(existingOption = {
                                element: element,
                                label: option.label,
                                id: option.id,
                                selected: option.selected
                            }), updateLabelMap(labelMap, option.label, !0), lastElement ? lastElement.after(element) : existingParent.element.append(element), 
                            lastElement = element);
                            for (index++; existingOptions.length > index; ) option = existingOptions.pop(), 
                            updateLabelMap(labelMap, option.label, !1), option.element.remove();
                        }
                        for (;optionGroupsCache.length > groupIndex; ) {
                            for (optionGroup = optionGroupsCache.pop(), index = 1; index < optionGroup.length; ++index) updateLabelMap(labelMap, optionGroup[index].label, !1);
                            optionGroup[0].element.remove();
                        }
                        forEach(labelMap, function(count, label) {
                            count > 0 ? selectCtrl.addOption(label) : 0 > count && selectCtrl.removeOption(label);
                        });
                    }
                    var match;
                    if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) throw ngOptionsMinErr("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
                    var displayFn = $parse(match[2] || match[1]), valueName = match[4] || match[6], selectAs = / as /.test(match[0]) && match[1], selectAsFn = selectAs ? $parse(selectAs) : null, keyName = match[5], groupByFn = $parse(match[3] || ""), valueFn = $parse(match[2] ? match[1] : valueName), valuesFn = $parse(match[7]), track = match[8], trackFn = track ? $parse(match[8]) : null, trackKeysCache = {}, optionGroupsCache = [ [ {
                        element: selectElement,
                        label: ""
                    } ] ], locals = {};
                    nullOption && ($compile(nullOption)(scope), nullOption.removeClass("ng-scope"), 
                    nullOption.remove()), selectElement.empty(), selectElement.on("change", selectionChanged), 
                    ctrl.$render = render, scope.$watchCollection(valuesFn, scheduleRendering), scope.$watchCollection(getLabels, scheduleRendering), 
                    multiple && scope.$watchCollection(function() {
                        return ctrl.$modelValue;
                    }, scheduleRendering);
                }
                if (ctrls[1]) {
                    for (var emptyOption, selectCtrl = ctrls[0], ngModelCtrl = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = !1, renderScheduled = !1, optionTemplate = jqLite(document.createElement("option")), optGroupTemplate = jqLite(document.createElement("optgroup")), unknownOption = optionTemplate.clone(), i = 0, children = element.children(), ii = children.length; ii > i; i++) if ("" === children[i].value) {
                        emptyOption = nullOption = children.eq(i);
                        break;
                    }
                    selectCtrl.init(ngModelCtrl, nullOption, unknownOption), multiple && (ngModelCtrl.$isEmpty = function(value) {
                        return !value || 0 === value.length;
                    }), optionsExp ? setupAsOptions(scope, element, ngModelCtrl) : multiple ? setupAsMultiple(scope, element, ngModelCtrl) : setupAsSingle(scope, element, ngModelCtrl, selectCtrl);
                }
            }
        };
    } ], optionDirective = [ "$interpolate", function($interpolate) {
        var nullSelectCtrl = {
            addOption: noop,
            removeOption: noop
        };
        return {
            restrict: "E",
            priority: 100,
            compile: function(element, attr) {
                if (isUndefined(attr.value)) {
                    var interpolateFn = $interpolate(element.text(), !0);
                    interpolateFn || attr.$set("value", element.text());
                }
                return function(scope, element, attr) {
                    var selectCtrlName = "$selectController", parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
                    selectCtrl && selectCtrl.databound || (selectCtrl = nullSelectCtrl), interpolateFn ? scope.$watch(interpolateFn, function(newVal, oldVal) {
                        attr.$set("value", newVal), oldVal !== newVal && selectCtrl.removeOption(oldVal), 
                        selectCtrl.addOption(newVal, element);
                    }) : selectCtrl.addOption(attr.value, element), element.on("$destroy", function() {
                        selectCtrl.removeOption(attr.value);
                    });
                };
            }
        };
    } ], styleDirective = valueFn({
        restrict: "E",
        terminal: !1
    }), requiredDirective = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, elm, attr, ctrl) {
                ctrl && (attr.required = !0, ctrl.$validators.required = function(modelValue, viewValue) {
                    return !attr.required || !ctrl.$isEmpty(viewValue);
                }, attr.$observe("required", function() {
                    ctrl.$validate();
                }));
            }
        };
    }, patternDirective = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, elm, attr, ctrl) {
                if (ctrl) {
                    var regexp, patternExp = attr.ngPattern || attr.pattern;
                    attr.$observe("pattern", function(regex) {
                        if (isString(regex) && regex.length > 0 && (regex = new RegExp("^" + regex + "$")), 
                        regex && !regex.test) throw minErr("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", patternExp, regex, startingTag(elm));
                        regexp = regex || undefined, ctrl.$validate();
                    }), ctrl.$validators.pattern = function(value) {
                        return ctrl.$isEmpty(value) || isUndefined(regexp) || regexp.test(value);
                    };
                }
            }
        };
    }, maxlengthDirective = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, elm, attr, ctrl) {
                if (ctrl) {
                    var maxlength = -1;
                    attr.$observe("maxlength", function(value) {
                        var intVal = int(value);
                        maxlength = isNaN(intVal) ? -1 : intVal, ctrl.$validate();
                    }), ctrl.$validators.maxlength = function(modelValue, viewValue) {
                        return 0 > maxlength || ctrl.$isEmpty(modelValue) || viewValue.length <= maxlength;
                    };
                }
            }
        };
    }, minlengthDirective = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, elm, attr, ctrl) {
                if (ctrl) {
                    var minlength = 0;
                    attr.$observe("minlength", function(value) {
                        minlength = int(value) || 0, ctrl.$validate();
                    }), ctrl.$validators.minlength = function(modelValue, viewValue) {
                        return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
                    };
                }
            }
        };
    };
    return window.angular.bootstrap ? void console.log("WARNING: Tried to load angular more than once.") : (bindJQuery(), 
    publishExternalAPI(angular), void jqLite(document).ready(function() {
        angularInit(document, bootstrap);
    }));
}(window, document), !window.angular.$$csp() && window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>'), 
function(window, angular) {
    "use strict";
    function $RouteProvider() {
        function inherit(parent, extra) {
            return angular.extend(Object.create(parent), extra);
        }
        function pathRegExp(path, opts) {
            var insensitive = opts.caseInsensitiveMatch, ret = {
                originalPath: path,
                regexp: path
            }, keys = ret.keys = [];
            return path = path.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
                var optional = "?" === option ? option : null, star = "*" === option ? option : null;
                return keys.push({
                    name: key,
                    optional: !!optional
                }), slash = slash || "", "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + (star && "(.+?)" || "([^/]+)") + (optional || "") + ")" + (optional || "");
            }).replace(/([\/$\*])/g, "\\$1"), ret.regexp = new RegExp("^" + path + "$", insensitive ? "i" : ""), 
            ret;
        }
        var routes = {};
        this.when = function(path, route) {
            var routeCopy = angular.copy(route);
            if (angular.isUndefined(routeCopy.reloadOnSearch) && (routeCopy.reloadOnSearch = !0), 
            angular.isUndefined(routeCopy.caseInsensitiveMatch) && (routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch), 
            routes[path] = angular.extend(routeCopy, path && pathRegExp(path, routeCopy)), path) {
                var redirectPath = "/" == path[path.length - 1] ? path.substr(0, path.length - 1) : path + "/";
                routes[redirectPath] = angular.extend({
                    redirectTo: path
                }, pathRegExp(redirectPath, routeCopy));
            }
            return this;
        }, this.caseInsensitiveMatch = !1, this.otherwise = function(params) {
            return "string" == typeof params && (params = {
                redirectTo: params
            }), this.when(null, params), this;
        }, this.$get = [ "$rootScope", "$location", "$routeParams", "$q", "$injector", "$templateRequest", "$sce", function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {
            function switchRouteMatcher(on, route) {
                var keys = route.keys, params = {};
                if (!route.regexp) return null;
                var m = route.regexp.exec(on);
                if (!m) return null;
                for (var i = 1, len = m.length; len > i; ++i) {
                    var key = keys[i - 1], val = m[i];
                    key && val && (params[key.name] = val);
                }
                return params;
            }
            function prepareRoute($locationEvent) {
                var lastRoute = $route.current;
                preparedRoute = parseRoute(), preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route && angular.equals(preparedRoute.pathParams, lastRoute.pathParams) && !preparedRoute.reloadOnSearch && !forceReload, 
                preparedRouteIsUpdateOnly || !lastRoute && !preparedRoute || $rootScope.$broadcast("$routeChangeStart", preparedRoute, lastRoute).defaultPrevented && $locationEvent && $locationEvent.preventDefault();
            }
            function commitRoute() {
                var lastRoute = $route.current, nextRoute = preparedRoute;
                preparedRouteIsUpdateOnly ? (lastRoute.params = nextRoute.params, angular.copy(lastRoute.params, $routeParams), 
                $rootScope.$broadcast("$routeUpdate", lastRoute)) : (nextRoute || lastRoute) && (forceReload = !1, 
                $route.current = nextRoute, nextRoute && nextRoute.redirectTo && (angular.isString(nextRoute.redirectTo) ? $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params).replace() : $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search())).replace()), 
                $q.when(nextRoute).then(function() {
                    if (nextRoute) {
                        var template, templateUrl, locals = angular.extend({}, nextRoute.resolve);
                        return angular.forEach(locals, function(value, key) {
                            locals[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
                        }), angular.isDefined(template = nextRoute.template) ? angular.isFunction(template) && (template = template(nextRoute.params)) : angular.isDefined(templateUrl = nextRoute.templateUrl) && (angular.isFunction(templateUrl) && (templateUrl = templateUrl(nextRoute.params)), 
                        templateUrl = $sce.getTrustedResourceUrl(templateUrl), angular.isDefined(templateUrl) && (nextRoute.loadedTemplateUrl = templateUrl, 
                        template = $templateRequest(templateUrl))), angular.isDefined(template) && (locals.$template = template), 
                        $q.all(locals);
                    }
                }).then(function(locals) {
                    nextRoute == $route.current && (nextRoute && (nextRoute.locals = locals, angular.copy(nextRoute.params, $routeParams)), 
                    $rootScope.$broadcast("$routeChangeSuccess", nextRoute, lastRoute));
                }, function(error) {
                    nextRoute == $route.current && $rootScope.$broadcast("$routeChangeError", nextRoute, lastRoute, error);
                }));
            }
            function parseRoute() {
                var params, match;
                return angular.forEach(routes, function(route) {
                    !match && (params = switchRouteMatcher($location.path(), route)) && (match = inherit(route, {
                        params: angular.extend({}, $location.search(), params),
                        pathParams: params
                    }), match.$$route = route);
                }), match || routes[null] && inherit(routes[null], {
                    params: {},
                    pathParams: {}
                });
            }
            function interpolate(string, params) {
                var result = [];
                return angular.forEach((string || "").split(":"), function(segment, i) {
                    if (0 === i) result.push(segment); else {
                        var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/), key = segmentMatch[1];
                        result.push(params[key]), result.push(segmentMatch[2] || ""), delete params[key];
                    }
                }), result.join("");
            }
            var preparedRoute, preparedRouteIsUpdateOnly, forceReload = !1, $route = {
                routes: routes,
                reload: function() {
                    forceReload = !0, $rootScope.$evalAsync(function() {
                        prepareRoute(), commitRoute();
                    });
                },
                updateParams: function(newParams) {
                    if (!this.current || !this.current.$$route) throw $routeMinErr("norout", "Tried updating route when with no current route");
                    var searchParams = {}, self = this;
                    angular.forEach(Object.keys(newParams), function(key) {
                        self.current.pathParams[key] || (searchParams[key] = newParams[key]);
                    }), newParams = angular.extend({}, this.current.params, newParams), $location.path(interpolate(this.current.$$route.originalPath, newParams)), 
                    $location.search(angular.extend({}, $location.search(), searchParams));
                }
            };
            return $rootScope.$on("$locationChangeStart", prepareRoute), $rootScope.$on("$locationChangeSuccess", commitRoute), 
            $route;
        } ];
    }
    function $RouteParamsProvider() {
        this.$get = function() {
            return {};
        };
    }
    function ngViewFactory($route, $anchorScroll, $animate) {
        return {
            restrict: "ECA",
            terminal: !0,
            priority: 400,
            transclude: "element",
            link: function(scope, $element, attr, ctrl, $transclude) {
                function cleanupLastView() {
                    previousLeaveAnimation && ($animate.cancel(previousLeaveAnimation), previousLeaveAnimation = null), 
                    currentScope && (currentScope.$destroy(), currentScope = null), currentElement && (previousLeaveAnimation = $animate.leave(currentElement), 
                    previousLeaveAnimation.then(function() {
                        previousLeaveAnimation = null;
                    }), currentElement = null);
                }
                function update() {
                    var locals = $route.current && $route.current.locals, template = locals && locals.$template;
                    if (angular.isDefined(template)) {
                        var newScope = scope.$new(), current = $route.current, clone = $transclude(newScope, function(clone) {
                            $animate.enter(clone, null, currentElement || $element).then(function() {
                                !angular.isDefined(autoScrollExp) || autoScrollExp && !scope.$eval(autoScrollExp) || $anchorScroll();
                            }), cleanupLastView();
                        });
                        currentElement = clone, currentScope = current.scope = newScope, currentScope.$emit("$viewContentLoaded"), 
                        currentScope.$eval(onloadExp);
                    } else cleanupLastView();
                }
                var currentScope, currentElement, previousLeaveAnimation, autoScrollExp = attr.autoscroll, onloadExp = attr.onload || "";
                scope.$on("$routeChangeSuccess", update), update();
            }
        };
    }
    function ngViewFillContentFactory($compile, $controller, $route) {
        return {
            restrict: "ECA",
            priority: -400,
            link: function(scope, $element) {
                var current = $route.current, locals = current.locals;
                $element.html(locals.$template);
                var link = $compile($element.contents());
                if (current.controller) {
                    locals.$scope = scope;
                    var controller = $controller(current.controller, locals);
                    current.controllerAs && (scope[current.controllerAs] = controller), $element.data("$ngControllerController", controller), 
                    $element.children().data("$ngControllerController", controller);
                }
                link(scope);
            }
        };
    }
    var ngRouteModule = angular.module("ngRoute", [ "ng" ]).provider("$route", $RouteProvider), $routeMinErr = angular.$$minErr("ngRoute");
    ngRouteModule.provider("$routeParams", $RouteParamsProvider), ngRouteModule.directive("ngView", ngViewFactory), 
    ngRouteModule.directive("ngView", ngViewFillContentFactory), ngViewFactory.$inject = [ "$route", "$anchorScroll", "$animate" ], 
    ngViewFillContentFactory.$inject = [ "$compile", "$controller", "$route" ];
}(window, window.angular), function(window, angular, undefined) {
    "use strict";
    function isValidDottedPath(path) {
        return null != path && "" !== path && "hasOwnProperty" !== path && MEMBER_NAME_REGEX.test("." + path);
    }
    function lookupDottedPath(obj, path) {
        if (!isValidDottedPath(path)) throw $resourceMinErr("badmember", 'Dotted member path "@{0}" is invalid.', path);
        for (var keys = path.split("."), i = 0, ii = keys.length; ii > i && obj !== undefined; i++) {
            var key = keys[i];
            obj = null !== obj ? obj[key] : undefined;
        }
        return obj;
    }
    function shallowClearAndCopy(src, dst) {
        dst = dst || {}, angular.forEach(dst, function(value, key) {
            delete dst[key];
        });
        for (var key in src) !src.hasOwnProperty(key) || "$" === key.charAt(0) && "$" === key.charAt(1) || (dst[key] = src[key]);
        return dst;
    }
    var $resourceMinErr = angular.$$minErr("$resource"), MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;
    angular.module("ngResource", [ "ng" ]).provider("$resource", function() {
        var provider = this;
        this.defaults = {
            stripTrailingSlashes: !0,
            actions: {
                get: {
                    method: "GET"
                },
                save: {
                    method: "POST"
                },
                query: {
                    method: "GET",
                    isArray: !0
                },
                remove: {
                    method: "DELETE"
                },
                "delete": {
                    method: "DELETE"
                }
            }
        }, this.$get = [ "$http", "$q", function($http, $q) {
            function encodeUriSegment(val) {
                return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
            }
            function encodeUriQuery(val, pctEncodeSpaces) {
                return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
            }
            function Route(template, defaults) {
                this.template = template, this.defaults = extend({}, provider.defaults, defaults), 
                this.urlParams = {};
            }
            function resourceFactory(url, paramDefaults, actions, options) {
                function extractParams(data, actionParams) {
                    var ids = {};
                    return actionParams = extend({}, paramDefaults, actionParams), forEach(actionParams, function(value, key) {
                        isFunction(value) && (value = value()), ids[key] = value && value.charAt && "@" == value.charAt(0) ? lookupDottedPath(data, value.substr(1)) : value;
                    }), ids;
                }
                function defaultResponseInterceptor(response) {
                    return response.resource;
                }
                function Resource(value) {
                    shallowClearAndCopy(value || {}, this);
                }
                var route = new Route(url, options);
                return actions = extend({}, provider.defaults.actions, actions), Resource.prototype.toJSON = function() {
                    var data = extend({}, this);
                    return delete data.$promise, delete data.$resolved, data;
                }, forEach(actions, function(action, name) {
                    var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
                    Resource[name] = function(a1, a2, a3, a4) {
                        var data, success, error, params = {};
                        switch (arguments.length) {
                          case 4:
                            error = a4, success = a3;

                          case 3:
                          case 2:
                            if (!isFunction(a2)) {
                                params = a1, data = a2, success = a3;
                                break;
                            }
                            if (isFunction(a1)) {
                                success = a1, error = a2;
                                break;
                            }
                            success = a2, error = a3;

                          case 1:
                            isFunction(a1) ? success = a1 : hasBody ? data = a1 : params = a1;
                            break;

                          case 0:
                            break;

                          default:
                            throw $resourceMinErr("badargs", "Expected up to 4 arguments [params, data, success, error], got {0} arguments", arguments.length);
                        }
                        var isInstanceCall = this instanceof Resource, value = isInstanceCall ? data : action.isArray ? [] : new Resource(data), httpConfig = {}, responseInterceptor = action.interceptor && action.interceptor.response || defaultResponseInterceptor, responseErrorInterceptor = action.interceptor && action.interceptor.responseError || undefined;
                        forEach(action, function(value, key) {
                            "params" != key && "isArray" != key && "interceptor" != key && (httpConfig[key] = copy(value));
                        }), hasBody && (httpConfig.data = data), route.setUrlParams(httpConfig, extend({}, extractParams(data, action.params || {}), params), action.url);
                        var promise = $http(httpConfig).then(function(response) {
                            var data = response.data, promise = value.$promise;
                            if (data) {
                                if (angular.isArray(data) !== !!action.isArray) throw $resourceMinErr("badcfg", "Error in resource configuration for action `{0}`. Expected response to contain an {1} but got an {2}", name, action.isArray ? "array" : "object", angular.isArray(data) ? "array" : "object");
                                action.isArray ? (value.length = 0, forEach(data, function(item) {
                                    value.push("object" == typeof item ? new Resource(item) : item);
                                })) : (shallowClearAndCopy(data, value), value.$promise = promise);
                            }
                            return value.$resolved = !0, response.resource = value, response;
                        }, function(response) {
                            return value.$resolved = !0, (error || noop)(response), $q.reject(response);
                        });
                        return promise = promise.then(function(response) {
                            var value = responseInterceptor(response);
                            return (success || noop)(value, response.headers), value;
                        }, responseErrorInterceptor), isInstanceCall ? promise : (value.$promise = promise, 
                        value.$resolved = !1, value);
                    }, Resource.prototype["$" + name] = function(params, success, error) {
                        isFunction(params) && (error = success, success = params, params = {});
                        var result = Resource[name].call(this, params, this, success, error);
                        return result.$promise || result;
                    };
                }), Resource.bind = function(additionalParamDefaults) {
                    return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
                }, Resource;
            }
            var noop = angular.noop, forEach = angular.forEach, extend = angular.extend, copy = angular.copy, isFunction = angular.isFunction;
            return Route.prototype = {
                setUrlParams: function(config, params, actionUrl) {
                    var val, encodedVal, self = this, url = actionUrl || self.template, urlParams = self.urlParams = {};
                    forEach(url.split(/\W/), function(param) {
                        if ("hasOwnProperty" === param) throw $resourceMinErr("badname", "hasOwnProperty is not a valid parameter name.");
                        !new RegExp("^\\d+$").test(param) && param && new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url) && (urlParams[param] = !0);
                    }), url = url.replace(/\\:/g, ":"), params = params || {}, forEach(self.urlParams, function(_, urlParam) {
                        val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam], 
                        angular.isDefined(val) && null !== val ? (encodedVal = encodeUriSegment(val), url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
                            return encodedVal + p1;
                        })) : url = url.replace(new RegExp("(/?):" + urlParam + "(\\W|$)", "g"), function(match, leadingSlashes, tail) {
                            return "/" == tail.charAt(0) ? tail : leadingSlashes + tail;
                        });
                    }), self.defaults.stripTrailingSlashes && (url = url.replace(/\/+$/, "") || "/"), 
                    url = url.replace(/\/\.(?=\w+($|\?))/, "."), config.url = url.replace(/\/\\\./, "/."), 
                    forEach(params, function(value, key) {
                        self.urlParams[key] || (config.params = config.params || {}, config.params[key] = value);
                    });
                }
            }, resourceFactory;
        } ];
    });
}(window, window.angular), angular.module("ui.bootstrap", [ "ui.bootstrap.tpls", "ui.bootstrap.transition", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead" ]), 
angular.module("ui.bootstrap.tpls", [ "template/accordion/accordion-group.html", "template/accordion/accordion.html", "template/alert/alert.html", "template/carousel/carousel.html", "template/carousel/slide.html", "template/datepicker/datepicker.html", "template/datepicker/day.html", "template/datepicker/month.html", "template/datepicker/popup.html", "template/datepicker/year.html", "template/modal/backdrop.html", "template/modal/window.html", "template/pagination/pager.html", "template/pagination/pagination.html", "template/tooltip/tooltip-html-unsafe-popup.html", "template/tooltip/tooltip-popup.html", "template/popover/popover.html", "template/progressbar/bar.html", "template/progressbar/progress.html", "template/progressbar/progressbar.html", "template/rating/rating.html", "template/tabs/tab.html", "template/tabs/tabset.html", "template/timepicker/timepicker.html", "template/typeahead/typeahead-match.html", "template/typeahead/typeahead-popup.html" ]), 
angular.module("ui.bootstrap.transition", []).factory("$transition", [ "$q", "$timeout", "$rootScope", function($q, $timeout, $rootScope) {
    function findEndEventName(endEventNames) {
        for (var name in endEventNames) if (void 0 !== transElement.style[name]) return endEventNames[name];
    }
    var $transition = function(element, trigger, options) {
        options = options || {};
        var deferred = $q.defer(), endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"], transitionEndHandler = function() {
            $rootScope.$apply(function() {
                element.unbind(endEventName, transitionEndHandler), deferred.resolve(element);
            });
        };
        return endEventName && element.bind(endEventName, transitionEndHandler), $timeout(function() {
            angular.isString(trigger) ? element.addClass(trigger) : angular.isFunction(trigger) ? trigger(element) : angular.isObject(trigger) && element.css(trigger), 
            endEventName || deferred.resolve(element);
        }), deferred.promise.cancel = function() {
            endEventName && element.unbind(endEventName, transitionEndHandler), deferred.reject("Transition cancelled");
        }, deferred.promise;
    }, transElement = document.createElement("trans"), transitionEndEventNames = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        transition: "transitionend"
    }, animationEndEventNames = {
        WebkitTransition: "webkitAnimationEnd",
        MozTransition: "animationend",
        OTransition: "oAnimationEnd",
        transition: "animationend"
    };
    return $transition.transitionEndEventName = findEndEventName(transitionEndEventNames), 
    $transition.animationEndEventName = findEndEventName(animationEndEventNames), $transition;
} ]), angular.module("ui.bootstrap.collapse", [ "ui.bootstrap.transition" ]).directive("collapse", [ "$transition", function($transition) {
    return {
        link: function(scope, element, attrs) {
            function doTransition(change) {
                function newTransitionDone() {
                    currentTransition === newTransition && (currentTransition = void 0);
                }
                var newTransition = $transition(element, change);
                return currentTransition && currentTransition.cancel(), currentTransition = newTransition, 
                newTransition.then(newTransitionDone, newTransitionDone), newTransition;
            }
            function expand() {
                initialAnimSkip ? (initialAnimSkip = !1, expandDone()) : (element.removeClass("collapse").addClass("collapsing"), 
                doTransition({
                    height: element[0].scrollHeight + "px"
                }).then(expandDone));
            }
            function expandDone() {
                element.removeClass("collapsing"), element.addClass("collapse in"), element.css({
                    height: "auto"
                });
            }
            function collapse() {
                if (initialAnimSkip) initialAnimSkip = !1, collapseDone(), element.css({
                    height: 0
                }); else {
                    element.css({
                        height: element[0].scrollHeight + "px"
                    });
                    {
                        element[0].offsetWidth;
                    }
                    element.removeClass("collapse in").addClass("collapsing"), doTransition({
                        height: 0
                    }).then(collapseDone);
                }
            }
            function collapseDone() {
                element.removeClass("collapsing"), element.addClass("collapse");
            }
            var currentTransition, initialAnimSkip = !0;
            scope.$watch(attrs.collapse, function(shouldCollapse) {
                shouldCollapse ? collapse() : expand();
            });
        }
    };
} ]), angular.module("ui.bootstrap.accordion", [ "ui.bootstrap.collapse" ]).constant("accordionConfig", {
    closeOthers: !0
}).controller("AccordionController", [ "$scope", "$attrs", "accordionConfig", function($scope, $attrs, accordionConfig) {
    this.groups = [], this.closeOthers = function(openGroup) {
        var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
        closeOthers && angular.forEach(this.groups, function(group) {
            group !== openGroup && (group.isOpen = !1);
        });
    }, this.addGroup = function(groupScope) {
        var that = this;
        this.groups.push(groupScope), groupScope.$on("$destroy", function() {
            that.removeGroup(groupScope);
        });
    }, this.removeGroup = function(group) {
        var index = this.groups.indexOf(group);
        -1 !== index && this.groups.splice(index, 1);
    };
} ]).directive("accordion", function() {
    return {
        restrict: "EA",
        controller: "AccordionController",
        transclude: !0,
        replace: !1,
        templateUrl: "template/accordion/accordion.html"
    };
}).directive("accordionGroup", function() {
    return {
        require: "^accordion",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: "template/accordion/accordion-group.html",
        scope: {
            heading: "@",
            isOpen: "=?",
            isDisabled: "=?"
        },
        controller: function() {
            this.setHeading = function(element) {
                this.heading = element;
            };
        },
        link: function(scope, element, attrs, accordionCtrl) {
            accordionCtrl.addGroup(scope), scope.$watch("isOpen", function(value) {
                value && accordionCtrl.closeOthers(scope);
            }), scope.toggleOpen = function() {
                scope.isDisabled || (scope.isOpen = !scope.isOpen);
            };
        }
    };
}).directive("accordionHeading", function() {
    return {
        restrict: "EA",
        transclude: !0,
        template: "",
        replace: !0,
        require: "^accordionGroup",
        link: function(scope, element, attr, accordionGroupCtrl, transclude) {
            accordionGroupCtrl.setHeading(transclude(scope, function() {}));
        }
    };
}).directive("accordionTransclude", function() {
    return {
        require: "^accordionGroup",
        link: function(scope, element, attr, controller) {
            scope.$watch(function() {
                return controller[attr.accordionTransclude];
            }, function(heading) {
                heading && (element.html(""), element.append(heading));
            });
        }
    };
}), angular.module("ui.bootstrap.alert", []).controller("AlertController", [ "$scope", "$attrs", function($scope, $attrs) {
    $scope.closeable = "close" in $attrs, this.close = $scope.close;
} ]).directive("alert", function() {
    return {
        restrict: "EA",
        controller: "AlertController",
        templateUrl: "template/alert/alert.html",
        transclude: !0,
        replace: !0,
        scope: {
            type: "@",
            close: "&"
        }
    };
}).directive("dismissOnTimeout", [ "$timeout", function($timeout) {
    return {
        require: "alert",
        link: function(scope, element, attrs, alertCtrl) {
            $timeout(function() {
                alertCtrl.close();
            }, parseInt(attrs.dismissOnTimeout, 10));
        }
    };
} ]), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function() {
    return function(scope, element, attr) {
        element.addClass("ng-binding").data("$binding", attr.bindHtmlUnsafe), scope.$watch(attr.bindHtmlUnsafe, function(value) {
            element.html(value || "");
        });
    };
}), angular.module("ui.bootstrap.buttons", []).constant("buttonConfig", {
    activeClass: "active",
    toggleEvent: "click"
}).controller("ButtonsController", [ "buttonConfig", function(buttonConfig) {
    this.activeClass = buttonConfig.activeClass || "active", this.toggleEvent = buttonConfig.toggleEvent || "click";
} ]).directive("btnRadio", function() {
    return {
        require: [ "btnRadio", "ngModel" ],
        controller: "ButtonsController",
        link: function(scope, element, attrs, ctrls) {
            var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            ngModelCtrl.$render = function() {
                element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
            }, element.bind(buttonsCtrl.toggleEvent, function() {
                var isActive = element.hasClass(buttonsCtrl.activeClass);
                (!isActive || angular.isDefined(attrs.uncheckable)) && scope.$apply(function() {
                    ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.btnRadio)), ngModelCtrl.$render();
                });
            });
        }
    };
}).directive("btnCheckbox", function() {
    return {
        require: [ "btnCheckbox", "ngModel" ],
        controller: "ButtonsController",
        link: function(scope, element, attrs, ctrls) {
            function getTrueValue() {
                return getCheckboxValue(attrs.btnCheckboxTrue, !0);
            }
            function getFalseValue() {
                return getCheckboxValue(attrs.btnCheckboxFalse, !1);
            }
            function getCheckboxValue(attributeValue, defaultValue) {
                var val = scope.$eval(attributeValue);
                return angular.isDefined(val) ? val : defaultValue;
            }
            var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            ngModelCtrl.$render = function() {
                element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
            }, element.bind(buttonsCtrl.toggleEvent, function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue()), 
                    ngModelCtrl.$render();
                });
            });
        }
    };
}), angular.module("ui.bootstrap.carousel", [ "ui.bootstrap.transition" ]).controller("CarouselController", [ "$scope", "$timeout", "$interval", "$transition", function($scope, $timeout, $interval, $transition) {
    function restartTimer() {
        resetTimer();
        var interval = +$scope.interval;
        !isNaN(interval) && interval > 0 && (currentInterval = $interval(timerFn, interval));
    }
    function resetTimer() {
        currentInterval && ($interval.cancel(currentInterval), currentInterval = null);
    }
    function timerFn() {
        var interval = +$scope.interval;
        isPlaying && !isNaN(interval) && interval > 0 ? $scope.next() : $scope.pause();
    }
    var currentInterval, isPlaying, self = this, slides = self.slides = $scope.slides = [], currentIndex = -1;
    self.currentSlide = null;
    var destroyed = !1;
    self.select = $scope.select = function(nextSlide, direction) {
        function goNext() {
            if (!destroyed) {
                if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
                    nextSlide.$element.addClass(direction);
                    {
                        nextSlide.$element[0].offsetWidth;
                    }
                    angular.forEach(slides, function(slide) {
                        angular.extend(slide, {
                            direction: "",
                            entering: !1,
                            leaving: !1,
                            active: !1
                        });
                    }), angular.extend(nextSlide, {
                        direction: direction,
                        active: !0,
                        entering: !0
                    }), angular.extend(self.currentSlide || {}, {
                        direction: direction,
                        leaving: !0
                    }), $scope.$currentTransition = $transition(nextSlide.$element, {}), function(next, current) {
                        $scope.$currentTransition.then(function() {
                            transitionDone(next, current);
                        }, function() {
                            transitionDone(next, current);
                        });
                    }(nextSlide, self.currentSlide);
                } else transitionDone(nextSlide, self.currentSlide);
                self.currentSlide = nextSlide, currentIndex = nextIndex, restartTimer();
            }
        }
        function transitionDone(next, current) {
            angular.extend(next, {
                direction: "",
                active: !0,
                leaving: !1,
                entering: !1
            }), angular.extend(current || {}, {
                direction: "",
                active: !1,
                leaving: !1,
                entering: !1
            }), $scope.$currentTransition = null;
        }
        var nextIndex = slides.indexOf(nextSlide);
        void 0 === direction && (direction = nextIndex > currentIndex ? "next" : "prev"), 
        nextSlide && nextSlide !== self.currentSlide && ($scope.$currentTransition ? ($scope.$currentTransition.cancel(), 
        $timeout(goNext)) : goNext());
    }, $scope.$on("$destroy", function() {
        destroyed = !0;
    }), self.indexOfSlide = function(slide) {
        return slides.indexOf(slide);
    }, $scope.next = function() {
        var newIndex = (currentIndex + 1) % slides.length;
        return $scope.$currentTransition ? void 0 : self.select(slides[newIndex], "next");
    }, $scope.prev = function() {
        var newIndex = 0 > currentIndex - 1 ? slides.length - 1 : currentIndex - 1;
        return $scope.$currentTransition ? void 0 : self.select(slides[newIndex], "prev");
    }, $scope.isActive = function(slide) {
        return self.currentSlide === slide;
    }, $scope.$watch("interval", restartTimer), $scope.$on("$destroy", resetTimer), 
    $scope.play = function() {
        isPlaying || (isPlaying = !0, restartTimer());
    }, $scope.pause = function() {
        $scope.noPause || (isPlaying = !1, resetTimer());
    }, self.addSlide = function(slide, element) {
        slide.$element = element, slides.push(slide), 1 === slides.length || slide.active ? (self.select(slides[slides.length - 1]), 
        1 == slides.length && $scope.play()) : slide.active = !1;
    }, self.removeSlide = function(slide) {
        var index = slides.indexOf(slide);
        slides.splice(index, 1), slides.length > 0 && slide.active ? self.select(index >= slides.length ? slides[index - 1] : slides[index]) : currentIndex > index && currentIndex--;
    };
} ]).directive("carousel", [ function() {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        controller: "CarouselController",
        require: "carousel",
        templateUrl: "template/carousel/carousel.html",
        scope: {
            interval: "=",
            noTransition: "=",
            noPause: "="
        }
    };
} ]).directive("slide", function() {
    return {
        require: "^carousel",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: "template/carousel/slide.html",
        scope: {
            active: "=?"
        },
        link: function(scope, element, attrs, carouselCtrl) {
            carouselCtrl.addSlide(scope, element), scope.$on("$destroy", function() {
                carouselCtrl.removeSlide(scope);
            }), scope.$watch("active", function(active) {
                active && carouselCtrl.select(scope);
            });
        }
    };
}), angular.module("ui.bootstrap.dateparser", []).service("dateParser", [ "$locale", "orderByFilter", function($locale, orderByFilter) {
    function createParser(format) {
        var map = [], regex = format.split("");
        return angular.forEach(formatCodeToRegex, function(data, code) {
            var index = format.indexOf(code);
            if (index > -1) {
                format = format.split(""), regex[index] = "(" + data.regex + ")", format[index] = "$";
                for (var i = index + 1, n = index + code.length; n > i; i++) regex[i] = "", format[i] = "$";
                format = format.join(""), map.push({
                    index: index,
                    apply: data.apply
                });
            }
        }), {
            regex: new RegExp("^" + regex.join("") + "$"),
            map: orderByFilter(map, "index")
        };
    }
    function isValid(year, month, date) {
        return 1 === month && date > 28 ? 29 === date && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) : 3 === month || 5 === month || 8 === month || 10 === month ? 31 > date : !0;
    }
    this.parsers = {};
    var formatCodeToRegex = {
        yyyy: {
            regex: "\\d{4}",
            apply: function(value) {
                this.year = +value;
            }
        },
        yy: {
            regex: "\\d{2}",
            apply: function(value) {
                this.year = +value + 2e3;
            }
        },
        y: {
            regex: "\\d{1,4}",
            apply: function(value) {
                this.year = +value;
            }
        },
        MMMM: {
            regex: $locale.DATETIME_FORMATS.MONTH.join("|"),
            apply: function(value) {
                this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value);
            }
        },
        MMM: {
            regex: $locale.DATETIME_FORMATS.SHORTMONTH.join("|"),
            apply: function(value) {
                this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value);
            }
        },
        MM: {
            regex: "0[1-9]|1[0-2]",
            apply: function(value) {
                this.month = value - 1;
            }
        },
        M: {
            regex: "[1-9]|1[0-2]",
            apply: function(value) {
                this.month = value - 1;
            }
        },
        dd: {
            regex: "[0-2][0-9]{1}|3[0-1]{1}",
            apply: function(value) {
                this.date = +value;
            }
        },
        d: {
            regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
            apply: function(value) {
                this.date = +value;
            }
        },
        EEEE: {
            regex: $locale.DATETIME_FORMATS.DAY.join("|")
        },
        EEE: {
            regex: $locale.DATETIME_FORMATS.SHORTDAY.join("|")
        }
    };
    this.parse = function(input, format) {
        if (!angular.isString(input) || !format) return input;
        format = $locale.DATETIME_FORMATS[format] || format, this.parsers[format] || (this.parsers[format] = createParser(format));
        var parser = this.parsers[format], regex = parser.regex, map = parser.map, results = input.match(regex);
        if (results && results.length) {
            for (var dt, fields = {
                year: 1900,
                month: 0,
                date: 1,
                hours: 0
            }, i = 1, n = results.length; n > i; i++) {
                var mapper = map[i - 1];
                mapper.apply && mapper.apply.call(fields, results[i]);
            }
            return isValid(fields.year, fields.month, fields.date) && (dt = new Date(fields.year, fields.month, fields.date, fields.hours)), 
            dt;
        }
    };
} ]), angular.module("ui.bootstrap.position", []).factory("$position", [ "$document", "$window", function($document, $window) {
    function getStyle(el, cssprop) {
        return el.currentStyle ? el.currentStyle[cssprop] : $window.getComputedStyle ? $window.getComputedStyle(el)[cssprop] : el.style[cssprop];
    }
    function isStaticPositioned(element) {
        return "static" === (getStyle(element, "position") || "static");
    }
    var parentOffsetEl = function(element) {
        for (var docDomEl = $document[0], offsetParent = element.offsetParent || docDomEl; offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent); ) offsetParent = offsetParent.offsetParent;
        return offsetParent || docDomEl;
    };
    return {
        position: function(element) {
            var elBCR = this.offset(element), offsetParentBCR = {
                top: 0,
                left: 0
            }, offsetParentEl = parentOffsetEl(element[0]);
            offsetParentEl != $document[0] && (offsetParentBCR = this.offset(angular.element(offsetParentEl)), 
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop, offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft);
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
                width: boundingClientRect.width || element.prop("offsetWidth"),
                height: boundingClientRect.height || element.prop("offsetHeight"),
                top: elBCR.top - offsetParentBCR.top,
                left: elBCR.left - offsetParentBCR.left
            };
        },
        offset: function(element) {
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
                width: boundingClientRect.width || element.prop("offsetWidth"),
                height: boundingClientRect.height || element.prop("offsetHeight"),
                top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
            };
        },
        positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
            var hostElPos, targetElWidth, targetElHeight, targetElPos, positionStrParts = positionStr.split("-"), pos0 = positionStrParts[0], pos1 = positionStrParts[1] || "center";
            hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl), targetElWidth = targetEl.prop("offsetWidth"), 
            targetElHeight = targetEl.prop("offsetHeight");
            var shiftWidth = {
                center: function() {
                    return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
                },
                left: function() {
                    return hostElPos.left;
                },
                right: function() {
                    return hostElPos.left + hostElPos.width;
                }
            }, shiftHeight = {
                center: function() {
                    return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
                },
                top: function() {
                    return hostElPos.top;
                },
                bottom: function() {
                    return hostElPos.top + hostElPos.height;
                }
            };
            switch (pos0) {
              case "right":
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: shiftWidth[pos0]()
                };
                break;

              case "left":
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: hostElPos.left - targetElWidth
                };
                break;

              case "bottom":
                targetElPos = {
                    top: shiftHeight[pos0](),
                    left: shiftWidth[pos1]()
                };
                break;

              default:
                targetElPos = {
                    top: hostElPos.top - targetElHeight,
                    left: shiftWidth[pos1]()
                };
            }
            return targetElPos;
        }
    };
} ]), angular.module("ui.bootstrap.datepicker", [ "ui.bootstrap.dateparser", "ui.bootstrap.position" ]).constant("datepickerConfig", {
    formatDay: "dd",
    formatMonth: "MMMM",
    formatYear: "yyyy",
    formatDayHeader: "EEE",
    formatDayTitle: "MMMM yyyy",
    formatMonthTitle: "yyyy",
    datepickerMode: "day",
    minMode: "day",
    maxMode: "year",
    showWeeks: !0,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null
}).controller("DatepickerController", [ "$scope", "$attrs", "$parse", "$interpolate", "$timeout", "$log", "dateFilter", "datepickerConfig", function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
    var self = this, ngModelCtrl = {
        $setViewValue: angular.noop
    };
    this.modes = [ "day", "month", "year" ], angular.forEach([ "formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "minMode", "maxMode", "showWeeks", "startingDay", "yearRange" ], function(key, index) {
        self[key] = angular.isDefined($attrs[key]) ? 8 > index ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key]) : datepickerConfig[key];
    }), angular.forEach([ "minDate", "maxDate" ], function(key) {
        $attrs[key] ? $scope.$parent.$watch($parse($attrs[key]), function(value) {
            self[key] = value ? new Date(value) : null, self.refreshView();
        }) : self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
    }), $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode, 
    $scope.uniqueId = "datepicker-" + $scope.$id + "-" + Math.floor(1e4 * Math.random()), 
    this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date(), 
    $scope.isActive = function(dateObject) {
        return 0 === self.compare(dateObject.date, self.activeDate) ? ($scope.activeDateId = dateObject.uid, 
        !0) : !1;
    }, this.init = function(ngModelCtrl_) {
        ngModelCtrl = ngModelCtrl_, ngModelCtrl.$render = function() {
            self.render();
        };
    }, this.render = function() {
        if (ngModelCtrl.$modelValue) {
            var date = new Date(ngModelCtrl.$modelValue), isValid = !isNaN(date);
            isValid ? this.activeDate = date : $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'), 
            ngModelCtrl.$setValidity("date", isValid);
        }
        this.refreshView();
    }, this.refreshView = function() {
        if (this.element) {
            this._refreshView();
            var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
            ngModelCtrl.$setValidity("date-disabled", !date || this.element && !this.isDisabled(date));
        }
    }, this.createDateObject = function(date, format) {
        var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
        return {
            date: date,
            label: dateFilter(date, format),
            selected: model && 0 === this.compare(date, model),
            disabled: this.isDisabled(date),
            current: 0 === this.compare(date, new Date())
        };
    }, this.isDisabled = function(date) {
        return this.minDate && this.compare(date, this.minDate) < 0 || this.maxDate && this.compare(date, this.maxDate) > 0 || $attrs.dateDisabled && $scope.dateDisabled({
            date: date,
            mode: $scope.datepickerMode
        });
    }, this.split = function(arr, size) {
        for (var arrays = []; arr.length > 0; ) arrays.push(arr.splice(0, size));
        return arrays;
    }, $scope.select = function(date) {
        if ($scope.datepickerMode === self.minMode) {
            var dt = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
            dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()), ngModelCtrl.$setViewValue(dt), 
            ngModelCtrl.$render();
        } else self.activeDate = date, $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
    }, $scope.move = function(direction) {
        var year = self.activeDate.getFullYear() + direction * (self.step.years || 0), month = self.activeDate.getMonth() + direction * (self.step.months || 0);
        self.activeDate.setFullYear(year, month, 1), self.refreshView();
    }, $scope.toggleMode = function(direction) {
        direction = direction || 1, $scope.datepickerMode === self.maxMode && 1 === direction || $scope.datepickerMode === self.minMode && -1 === direction || ($scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction]);
    }, $scope.keys = {
        13: "enter",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    var focusElement = function() {
        $timeout(function() {
            self.element[0].focus();
        }, 0, !1);
    };
    $scope.$on("datepicker.focus", focusElement), $scope.keydown = function(evt) {
        var key = $scope.keys[evt.which];
        if (key && !evt.shiftKey && !evt.altKey) if (evt.preventDefault(), evt.stopPropagation(), 
        "enter" === key || "space" === key) {
            if (self.isDisabled(self.activeDate)) return;
            $scope.select(self.activeDate), focusElement();
        } else !evt.ctrlKey || "up" !== key && "down" !== key ? (self.handleKeyDown(key, evt), 
        self.refreshView()) : ($scope.toggleMode("up" === key ? 1 : -1), focusElement());
    };
} ]).directive("datepicker", function() {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/datepicker.html",
        scope: {
            datepickerMode: "=?",
            dateDisabled: "&"
        },
        require: [ "datepicker", "?^ngModel" ],
        controller: "DatepickerController",
        link: function(scope, element, attrs, ctrls) {
            var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            ngModelCtrl && datepickerCtrl.init(ngModelCtrl);
        }
    };
}).directive("daypicker", [ "dateFilter", function(dateFilter) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/day.html",
        require: "^datepicker",
        link: function(scope, element, attrs, ctrl) {
            function getDaysInMonth(year, month) {
                return 1 !== month || year % 4 !== 0 || year % 100 === 0 && year % 400 !== 0 ? DAYS_IN_MONTH[month] : 29;
            }
            function getDates(startDate, n) {
                var dates = new Array(n), current = new Date(startDate), i = 0;
                for (current.setHours(12); n > i; ) dates[i++] = new Date(current), current.setDate(current.getDate() + 1);
                return dates;
            }
            function getISO8601WeekNumber(date) {
                var checkDate = new Date(date);
                checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
                var time = checkDate.getTime();
                return checkDate.setMonth(0), checkDate.setDate(1), Math.floor(Math.round((time - checkDate) / 864e5) / 7) + 1;
            }
            scope.showWeeks = ctrl.showWeeks, ctrl.step = {
                months: 1
            }, ctrl.element = element;
            var DAYS_IN_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
            ctrl._refreshView = function() {
                var year = ctrl.activeDate.getFullYear(), month = ctrl.activeDate.getMonth(), firstDayOfMonth = new Date(year, month, 1), difference = ctrl.startingDay - firstDayOfMonth.getDay(), numDisplayedFromPreviousMonth = difference > 0 ? 7 - difference : -difference, firstDate = new Date(firstDayOfMonth);
                numDisplayedFromPreviousMonth > 0 && firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
                for (var days = getDates(firstDate, 42), i = 0; 42 > i; i++) days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
                    secondary: days[i].getMonth() !== month,
                    uid: scope.uniqueId + "-" + i
                });
                scope.labels = new Array(7);
                for (var j = 0; 7 > j; j++) scope.labels[j] = {
                    abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
                    full: dateFilter(days[j].date, "EEEE")
                };
                if (scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle), scope.rows = ctrl.split(days, 7), 
                scope.showWeeks) {
                    scope.weekNumbers = [];
                    for (var weekNumber = getISO8601WeekNumber(scope.rows[0][0].date), numWeeks = scope.rows.length; scope.weekNumbers.push(weekNumber++) < numWeeks; ) ;
                }
            }, ctrl.compare = function(date1, date2) {
                return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
            }, ctrl.handleKeyDown = function(key) {
                var date = ctrl.activeDate.getDate();
                if ("left" === key) date -= 1; else if ("up" === key) date -= 7; else if ("right" === key) date += 1; else if ("down" === key) date += 7; else if ("pageup" === key || "pagedown" === key) {
                    var month = ctrl.activeDate.getMonth() + ("pageup" === key ? -1 : 1);
                    ctrl.activeDate.setMonth(month, 1), date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);
                } else "home" === key ? date = 1 : "end" === key && (date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()));
                ctrl.activeDate.setDate(date);
            }, ctrl.refreshView();
        }
    };
} ]).directive("monthpicker", [ "dateFilter", function(dateFilter) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/month.html",
        require: "^datepicker",
        link: function(scope, element, attrs, ctrl) {
            ctrl.step = {
                years: 1
            }, ctrl.element = element, ctrl._refreshView = function() {
                for (var months = new Array(12), year = ctrl.activeDate.getFullYear(), i = 0; 12 > i; i++) months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
                    uid: scope.uniqueId + "-" + i
                });
                scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle), scope.rows = ctrl.split(months, 3);
            }, ctrl.compare = function(date1, date2) {
                return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
            }, ctrl.handleKeyDown = function(key) {
                var date = ctrl.activeDate.getMonth();
                if ("left" === key) date -= 1; else if ("up" === key) date -= 3; else if ("right" === key) date += 1; else if ("down" === key) date += 3; else if ("pageup" === key || "pagedown" === key) {
                    var year = ctrl.activeDate.getFullYear() + ("pageup" === key ? -1 : 1);
                    ctrl.activeDate.setFullYear(year);
                } else "home" === key ? date = 0 : "end" === key && (date = 11);
                ctrl.activeDate.setMonth(date);
            }, ctrl.refreshView();
        }
    };
} ]).directive("yearpicker", [ "dateFilter", function() {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/year.html",
        require: "^datepicker",
        link: function(scope, element, attrs, ctrl) {
            function getStartingYear(year) {
                return parseInt((year - 1) / range, 10) * range + 1;
            }
            var range = ctrl.yearRange;
            ctrl.step = {
                years: range
            }, ctrl.element = element, ctrl._refreshView = function() {
                for (var years = new Array(range), i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); range > i; i++) years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
                    uid: scope.uniqueId + "-" + i
                });
                scope.title = [ years[0].label, years[range - 1].label ].join(" - "), scope.rows = ctrl.split(years, 5);
            }, ctrl.compare = function(date1, date2) {
                return date1.getFullYear() - date2.getFullYear();
            }, ctrl.handleKeyDown = function(key) {
                var date = ctrl.activeDate.getFullYear();
                "left" === key ? date -= 1 : "up" === key ? date -= 5 : "right" === key ? date += 1 : "down" === key ? date += 5 : "pageup" === key || "pagedown" === key ? date += ("pageup" === key ? -1 : 1) * ctrl.step.years : "home" === key ? date = getStartingYear(ctrl.activeDate.getFullYear()) : "end" === key && (date = getStartingYear(ctrl.activeDate.getFullYear()) + range - 1), 
                ctrl.activeDate.setFullYear(date);
            }, ctrl.refreshView();
        }
    };
} ]).constant("datepickerPopupConfig", {
    datepickerPopup: "yyyy-MM-dd",
    currentText: "Today",
    clearText: "Clear",
    closeText: "Done",
    closeOnDateSelection: !0,
    appendToBody: !1,
    showButtonBar: !0
}).directive("datepickerPopup", [ "$compile", "$parse", "$document", "$position", "dateFilter", "dateParser", "datepickerPopupConfig", function($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig) {
    return {
        restrict: "EA",
        require: "ngModel",
        scope: {
            isOpen: "=?",
            currentText: "@",
            clearText: "@",
            closeText: "@",
            dateDisabled: "&"
        },
        link: function(scope, element, attrs, ngModel) {
            function cameltoDash(string) {
                return string.replace(/([A-Z])/g, function($1) {
                    return "-" + $1.toLowerCase();
                });
            }
            function parseDate(viewValue) {
                if (viewValue) {
                    if (angular.isDate(viewValue) && !isNaN(viewValue)) return ngModel.$setValidity("date", !0), 
                    viewValue;
                    if (angular.isString(viewValue)) {
                        var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
                        return isNaN(date) ? void ngModel.$setValidity("date", !1) : (ngModel.$setValidity("date", !0), 
                        date);
                    }
                    return void ngModel.$setValidity("date", !1);
                }
                return ngModel.$setValidity("date", !0), null;
            }
            var dateFormat, closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection, appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;
            scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar, 
            scope.getText = function(key) {
                return scope[key + "Text"] || datepickerPopupConfig[key + "Text"];
            }, attrs.$observe("datepickerPopup", function(value) {
                dateFormat = value || datepickerPopupConfig.datepickerPopup, ngModel.$render();
            });
            var popupEl = angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");
            popupEl.attr({
                "ng-model": "date",
                "ng-change": "dateSelection()"
            });
            var datepickerEl = angular.element(popupEl.children()[0]);
            attrs.datepickerOptions && angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function(value, option) {
                datepickerEl.attr(cameltoDash(option), value);
            }), scope.watchData = {}, angular.forEach([ "minDate", "maxDate", "datepickerMode" ], function(key) {
                if (attrs[key]) {
                    var getAttribute = $parse(attrs[key]);
                    if (scope.$parent.$watch(getAttribute, function(value) {
                        scope.watchData[key] = value;
                    }), datepickerEl.attr(cameltoDash(key), "watchData." + key), "datepickerMode" === key) {
                        var setAttribute = getAttribute.assign;
                        scope.$watch("watchData." + key, function(value, oldvalue) {
                            value !== oldvalue && setAttribute(scope.$parent, value);
                        });
                    }
                }
            }), attrs.dateDisabled && datepickerEl.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"), 
            ngModel.$parsers.unshift(parseDate), scope.dateSelection = function(dt) {
                angular.isDefined(dt) && (scope.date = dt), ngModel.$setViewValue(scope.date), ngModel.$render(), 
                closeOnDateSelection && (scope.isOpen = !1, element[0].focus());
            }, element.bind("input change keyup", function() {
                scope.$apply(function() {
                    scope.date = ngModel.$modelValue;
                });
            }), ngModel.$render = function() {
                var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : "";
                element.val(date), scope.date = parseDate(ngModel.$modelValue);
            };
            var documentClickBind = function(event) {
                scope.isOpen && event.target !== element[0] && scope.$apply(function() {
                    scope.isOpen = !1;
                });
            }, keydown = function(evt) {
                scope.keydown(evt);
            };
            element.bind("keydown", keydown), scope.keydown = function(evt) {
                27 === evt.which ? (evt.preventDefault(), evt.stopPropagation(), scope.close()) : 40 !== evt.which || scope.isOpen || (scope.isOpen = !0);
            }, scope.$watch("isOpen", function(value) {
                value ? (scope.$broadcast("datepicker.focus"), scope.position = appendToBody ? $position.offset(element) : $position.position(element), 
                scope.position.top = scope.position.top + element.prop("offsetHeight"), $document.bind("click", documentClickBind)) : $document.unbind("click", documentClickBind);
            }), scope.select = function(date) {
                if ("today" === date) {
                    var today = new Date();
                    angular.isDate(ngModel.$modelValue) ? (date = new Date(ngModel.$modelValue), date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate())) : date = new Date(today.setHours(0, 0, 0, 0));
                }
                scope.dateSelection(date);
            }, scope.close = function() {
                scope.isOpen = !1, element[0].focus();
            };
            var $popup = $compile(popupEl)(scope);
            popupEl.remove(), appendToBody ? $document.find("body").append($popup) : element.after($popup), 
            scope.$on("$destroy", function() {
                $popup.remove(), element.unbind("keydown", keydown), $document.unbind("click", documentClickBind);
            });
        }
    };
} ]).directive("datepickerPopupWrap", function() {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        templateUrl: "template/datepicker/popup.html",
        link: function(scope, element) {
            element.bind("click", function(event) {
                event.preventDefault(), event.stopPropagation();
            });
        }
    };
}), angular.module("ui.bootstrap.dropdown", []).constant("dropdownConfig", {
    openClass: "open"
}).service("dropdownService", [ "$document", function($document) {
    var openScope = null;
    this.open = function(dropdownScope) {
        openScope || ($document.bind("click", closeDropdown), $document.bind("keydown", escapeKeyBind)), 
        openScope && openScope !== dropdownScope && (openScope.isOpen = !1), openScope = dropdownScope;
    }, this.close = function(dropdownScope) {
        openScope === dropdownScope && (openScope = null, $document.unbind("click", closeDropdown), 
        $document.unbind("keydown", escapeKeyBind));
    };
    var closeDropdown = function(evt) {
        if (openScope) {
            var toggleElement = openScope.getToggleElement();
            evt && toggleElement && toggleElement[0].contains(evt.target) || openScope.$apply(function() {
                openScope.isOpen = !1;
            });
        }
    }, escapeKeyBind = function(evt) {
        27 === evt.which && (openScope.focusToggleElement(), closeDropdown());
    };
} ]).controller("DropdownController", [ "$scope", "$attrs", "$parse", "dropdownConfig", "dropdownService", "$animate", function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
    var getIsOpen, self = this, scope = $scope.$new(), openClass = dropdownConfig.openClass, setIsOpen = angular.noop, toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;
    this.init = function(element) {
        self.$element = element, $attrs.isOpen && (getIsOpen = $parse($attrs.isOpen), setIsOpen = getIsOpen.assign, 
        $scope.$watch(getIsOpen, function(value) {
            scope.isOpen = !!value;
        }));
    }, this.toggle = function(open) {
        return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
    }, this.isOpen = function() {
        return scope.isOpen;
    }, scope.getToggleElement = function() {
        return self.toggleElement;
    }, scope.focusToggleElement = function() {
        self.toggleElement && self.toggleElement[0].focus();
    }, scope.$watch("isOpen", function(isOpen, wasOpen) {
        $animate[isOpen ? "addClass" : "removeClass"](self.$element, openClass), isOpen ? (scope.focusToggleElement(), 
        dropdownService.open(scope)) : dropdownService.close(scope), setIsOpen($scope, isOpen), 
        angular.isDefined(isOpen) && isOpen !== wasOpen && toggleInvoker($scope, {
            open: !!isOpen
        });
    }), $scope.$on("$locationChangeSuccess", function() {
        scope.isOpen = !1;
    }), $scope.$on("$destroy", function() {
        scope.$destroy();
    });
} ]).directive("dropdown", function() {
    return {
        controller: "DropdownController",
        link: function(scope, element, attrs, dropdownCtrl) {
            dropdownCtrl.init(element);
        }
    };
}).directive("dropdownToggle", function() {
    return {
        require: "?^dropdown",
        link: function(scope, element, attrs, dropdownCtrl) {
            if (dropdownCtrl) {
                dropdownCtrl.toggleElement = element;
                var toggleDropdown = function(event) {
                    event.preventDefault(), element.hasClass("disabled") || attrs.disabled || scope.$apply(function() {
                        dropdownCtrl.toggle();
                    });
                };
                element.bind("click", toggleDropdown), element.attr({
                    "aria-haspopup": !0,
                    "aria-expanded": !1
                }), scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
                    element.attr("aria-expanded", !!isOpen);
                }), scope.$on("$destroy", function() {
                    element.unbind("click", toggleDropdown);
                });
            }
        }
    };
}), angular.module("ui.bootstrap.modal", [ "ui.bootstrap.transition" ]).factory("$$stackedMap", function() {
    return {
        createNew: function() {
            var stack = [];
            return {
                add: function(key, value) {
                    stack.push({
                        key: key,
                        value: value
                    });
                },
                get: function(key) {
                    for (var i = 0; i < stack.length; i++) if (key == stack[i].key) return stack[i];
                },
                keys: function() {
                    for (var keys = [], i = 0; i < stack.length; i++) keys.push(stack[i].key);
                    return keys;
                },
                top: function() {
                    return stack[stack.length - 1];
                },
                remove: function(key) {
                    for (var idx = -1, i = 0; i < stack.length; i++) if (key == stack[i].key) {
                        idx = i;
                        break;
                    }
                    return stack.splice(idx, 1)[0];
                },
                removeTop: function() {
                    return stack.splice(stack.length - 1, 1)[0];
                },
                length: function() {
                    return stack.length;
                }
            };
        }
    };
}).directive("modalBackdrop", [ "$timeout", function($timeout) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/modal/backdrop.html",
        link: function(scope, element, attrs) {
            scope.backdropClass = attrs.backdropClass || "", scope.animate = !1, $timeout(function() {
                scope.animate = !0;
            });
        }
    };
} ]).directive("modalWindow", [ "$modalStack", "$timeout", function($modalStack, $timeout) {
    return {
        restrict: "EA",
        scope: {
            index: "@",
            animate: "="
        },
        replace: !0,
        transclude: !0,
        templateUrl: function(tElement, tAttrs) {
            return tAttrs.templateUrl || "template/modal/window.html";
        },
        link: function(scope, element, attrs) {
            element.addClass(attrs.windowClass || ""), scope.size = attrs.size, $timeout(function() {
                scope.animate = !0, element[0].querySelectorAll("[autofocus]").length || element[0].focus();
            }), scope.close = function(evt) {
                var modal = $modalStack.getTop();
                modal && modal.value.backdrop && "static" != modal.value.backdrop && evt.target === evt.currentTarget && (evt.preventDefault(), 
                evt.stopPropagation(), $modalStack.dismiss(modal.key, "backdrop click"));
            };
        }
    };
} ]).directive("modalTransclude", function() {
    return {
        link: function($scope, $element, $attrs, controller, $transclude) {
            $transclude($scope.$parent, function(clone) {
                $element.empty(), $element.append(clone);
            });
        }
    };
}).factory("$modalStack", [ "$transition", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {
    function backdropIndex() {
        for (var topBackdropIndex = -1, opened = openedWindows.keys(), i = 0; i < opened.length; i++) openedWindows.get(opened[i]).value.backdrop && (topBackdropIndex = i);
        return topBackdropIndex;
    }
    function removeModalWindow(modalInstance) {
        var body = $document.find("body").eq(0), modalWindow = openedWindows.get(modalInstance).value;
        openedWindows.remove(modalInstance), removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
            modalWindow.modalScope.$destroy(), body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0), 
            checkRemoveBackdrop();
        });
    }
    function checkRemoveBackdrop() {
        if (backdropDomEl && -1 == backdropIndex()) {
            var backdropScopeRef = backdropScope;
            removeAfterAnimate(backdropDomEl, backdropScope, 150, function() {
                backdropScopeRef.$destroy(), backdropScopeRef = null;
            }), backdropDomEl = void 0, backdropScope = void 0;
        }
    }
    function removeAfterAnimate(domEl, scope, emulateTime, done) {
        function afterAnimating() {
            afterAnimating.done || (afterAnimating.done = !0, domEl.remove(), done && done());
        }
        scope.animate = !1;
        var transitionEndEventName = $transition.transitionEndEventName;
        if (transitionEndEventName) {
            var timeout = $timeout(afterAnimating, emulateTime);
            domEl.bind(transitionEndEventName, function() {
                $timeout.cancel(timeout), afterAnimating(), scope.$apply();
            });
        } else $timeout(afterAnimating);
    }
    var backdropDomEl, backdropScope, OPENED_MODAL_CLASS = "modal-open", openedWindows = $$stackedMap.createNew(), $modalStack = {};
    return $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
        backdropScope && (backdropScope.index = newBackdropIndex);
    }), $document.bind("keydown", function(evt) {
        var modal;
        27 === evt.which && (modal = openedWindows.top(), modal && modal.value.keyboard && (evt.preventDefault(), 
        $rootScope.$apply(function() {
            $modalStack.dismiss(modal.key, "escape key press");
        })));
    }), $modalStack.open = function(modalInstance, modal) {
        openedWindows.add(modalInstance, {
            deferred: modal.deferred,
            modalScope: modal.scope,
            backdrop: modal.backdrop,
            keyboard: modal.keyboard
        });
        var body = $document.find("body").eq(0), currBackdropIndex = backdropIndex();
        if (currBackdropIndex >= 0 && !backdropDomEl) {
            backdropScope = $rootScope.$new(!0), backdropScope.index = currBackdropIndex;
            var angularBackgroundDomEl = angular.element("<div modal-backdrop></div>");
            angularBackgroundDomEl.attr("backdrop-class", modal.backdropClass), backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope), 
            body.append(backdropDomEl);
        }
        var angularDomEl = angular.element("<div modal-window></div>");
        angularDomEl.attr({
            "template-url": modal.windowTemplateUrl,
            "window-class": modal.windowClass,
            size: modal.size,
            index: openedWindows.length() - 1,
            animate: "animate"
        }).html(modal.content);
        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl, body.append(modalDomEl), body.addClass(OPENED_MODAL_CLASS);
    }, $modalStack.close = function(modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        modalWindow && (modalWindow.value.deferred.resolve(result), removeModalWindow(modalInstance));
    }, $modalStack.dismiss = function(modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        modalWindow && (modalWindow.value.deferred.reject(reason), removeModalWindow(modalInstance));
    }, $modalStack.dismissAll = function(reason) {
        for (var topModal = this.getTop(); topModal; ) this.dismiss(topModal.key, reason), 
        topModal = this.getTop();
    }, $modalStack.getTop = function() {
        return openedWindows.top();
    }, $modalStack;
} ]).provider("$modal", function() {
    var $modalProvider = {
        options: {
            backdrop: !0,
            keyboard: !0
        },
        $get: [ "$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack", function($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
            function getTemplatePromise(options) {
                return options.template ? $q.when(options.template) : $http.get(angular.isFunction(options.templateUrl) ? options.templateUrl() : options.templateUrl, {
                    cache: $templateCache
                }).then(function(result) {
                    return result.data;
                });
            }
            function getResolvePromises(resolves) {
                var promisesArr = [];
                return angular.forEach(resolves, function(value) {
                    (angular.isFunction(value) || angular.isArray(value)) && promisesArr.push($q.when($injector.invoke(value)));
                }), promisesArr;
            }
            var $modal = {};
            return $modal.open = function(modalOptions) {
                var modalResultDeferred = $q.defer(), modalOpenedDeferred = $q.defer(), modalInstance = {
                    result: modalResultDeferred.promise,
                    opened: modalOpenedDeferred.promise,
                    close: function(result) {
                        $modalStack.close(modalInstance, result);
                    },
                    dismiss: function(reason) {
                        $modalStack.dismiss(modalInstance, reason);
                    }
                };
                if (modalOptions = angular.extend({}, $modalProvider.options, modalOptions), modalOptions.resolve = modalOptions.resolve || {}, 
                !modalOptions.template && !modalOptions.templateUrl) throw new Error("One of template or templateUrl options is required.");
                var templateAndResolvePromise = $q.all([ getTemplatePromise(modalOptions) ].concat(getResolvePromises(modalOptions.resolve)));
                return templateAndResolvePromise.then(function(tplAndVars) {
                    var modalScope = (modalOptions.scope || $rootScope).$new();
                    modalScope.$close = modalInstance.close, modalScope.$dismiss = modalInstance.dismiss;
                    var ctrlInstance, ctrlLocals = {}, resolveIter = 1;
                    modalOptions.controller && (ctrlLocals.$scope = modalScope, ctrlLocals.$modalInstance = modalInstance, 
                    angular.forEach(modalOptions.resolve, function(value, key) {
                        ctrlLocals[key] = tplAndVars[resolveIter++];
                    }), ctrlInstance = $controller(modalOptions.controller, ctrlLocals), modalOptions.controllerAs && (modalScope[modalOptions.controllerAs] = ctrlInstance)), 
                    $modalStack.open(modalInstance, {
                        scope: modalScope,
                        deferred: modalResultDeferred,
                        content: tplAndVars[0],
                        backdrop: modalOptions.backdrop,
                        keyboard: modalOptions.keyboard,
                        backdropClass: modalOptions.backdropClass,
                        windowClass: modalOptions.windowClass,
                        windowTemplateUrl: modalOptions.windowTemplateUrl,
                        size: modalOptions.size
                    });
                }, function(reason) {
                    modalResultDeferred.reject(reason);
                }), templateAndResolvePromise.then(function() {
                    modalOpenedDeferred.resolve(!0);
                }, function() {
                    modalOpenedDeferred.reject(!1);
                }), modalInstance;
            }, $modal;
        } ]
    };
    return $modalProvider;
}), angular.module("ui.bootstrap.pagination", []).controller("PaginationController", [ "$scope", "$attrs", "$parse", function($scope, $attrs, $parse) {
    var self = this, ngModelCtrl = {
        $setViewValue: angular.noop
    }, setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
    this.init = function(ngModelCtrl_, config) {
        ngModelCtrl = ngModelCtrl_, this.config = config, ngModelCtrl.$render = function() {
            self.render();
        }, $attrs.itemsPerPage ? $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
            self.itemsPerPage = parseInt(value, 10), $scope.totalPages = self.calculateTotalPages();
        }) : this.itemsPerPage = config.itemsPerPage;
    }, this.calculateTotalPages = function() {
        var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
        return Math.max(totalPages || 0, 1);
    }, this.render = function() {
        $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
    }, $scope.selectPage = function(page) {
        $scope.page !== page && page > 0 && page <= $scope.totalPages && (ngModelCtrl.$setViewValue(page), 
        ngModelCtrl.$render());
    }, $scope.getText = function(key) {
        return $scope[key + "Text"] || self.config[key + "Text"];
    }, $scope.noPrevious = function() {
        return 1 === $scope.page;
    }, $scope.noNext = function() {
        return $scope.page === $scope.totalPages;
    }, $scope.$watch("totalItems", function() {
        $scope.totalPages = self.calculateTotalPages();
    }), $scope.$watch("totalPages", function(value) {
        setNumPages($scope.$parent, value), $scope.page > value ? $scope.selectPage(value) : ngModelCtrl.$render();
    });
} ]).constant("paginationConfig", {
    itemsPerPage: 10,
    boundaryLinks: !1,
    directionLinks: !0,
    firstText: "First",
    previousText: "Previous",
    nextText: "Next",
    lastText: "Last",
    rotate: !0
}).directive("pagination", [ "$parse", "paginationConfig", function($parse, paginationConfig) {
    return {
        restrict: "EA",
        scope: {
            totalItems: "=",
            firstText: "@",
            previousText: "@",
            nextText: "@",
            lastText: "@"
        },
        require: [ "pagination", "?ngModel" ],
        controller: "PaginationController",
        templateUrl: "template/pagination/pagination.html",
        replace: !0,
        link: function(scope, element, attrs, ctrls) {
            function makePage(number, text, isActive) {
                return {
                    number: number,
                    text: text,
                    active: isActive
                };
            }
            function getPages(currentPage, totalPages) {
                var pages = [], startPage = 1, endPage = totalPages, isMaxSized = angular.isDefined(maxSize) && totalPages > maxSize;
                isMaxSized && (rotate ? (startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1), 
                endPage = startPage + maxSize - 1, endPage > totalPages && (endPage = totalPages, 
                startPage = endPage - maxSize + 1)) : (startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1, 
                endPage = Math.min(startPage + maxSize - 1, totalPages)));
                for (var number = startPage; endPage >= number; number++) {
                    var page = makePage(number, number, number === currentPage);
                    pages.push(page);
                }
                if (isMaxSized && !rotate) {
                    if (startPage > 1) {
                        var previousPageSet = makePage(startPage - 1, "...", !1);
                        pages.unshift(previousPageSet);
                    }
                    if (totalPages > endPage) {
                        var nextPageSet = makePage(endPage + 1, "...", !1);
                        pages.push(nextPageSet);
                    }
                }
                return pages;
            }
            var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            if (ngModelCtrl) {
                var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize, rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
                scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks, 
                scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks, 
                paginationCtrl.init(ngModelCtrl, paginationConfig), attrs.maxSize && scope.$parent.$watch($parse(attrs.maxSize), function(value) {
                    maxSize = parseInt(value, 10), paginationCtrl.render();
                });
                var originalRender = paginationCtrl.render;
                paginationCtrl.render = function() {
                    originalRender(), scope.page > 0 && scope.page <= scope.totalPages && (scope.pages = getPages(scope.page, scope.totalPages));
                };
            }
        }
    };
} ]).constant("pagerConfig", {
    itemsPerPage: 10,
    previousText: "« Previous",
    nextText: "Next »",
    align: !0
}).directive("pager", [ "pagerConfig", function(pagerConfig) {
    return {
        restrict: "EA",
        scope: {
            totalItems: "=",
            previousText: "@",
            nextText: "@"
        },
        require: [ "pager", "?ngModel" ],
        controller: "PaginationController",
        templateUrl: "template/pagination/pager.html",
        replace: !0,
        link: function(scope, element, attrs, ctrls) {
            var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            ngModelCtrl && (scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align, 
            paginationCtrl.init(ngModelCtrl, pagerConfig));
        }
    };
} ]), angular.module("ui.bootstrap.tooltip", [ "ui.bootstrap.position", "ui.bootstrap.bindHtml" ]).provider("$tooltip", function() {
    function snake_case(name) {
        var regexp = /[A-Z]/g, separator = "-";
        return name.replace(regexp, function(letter, pos) {
            return (pos ? separator : "") + letter.toLowerCase();
        });
    }
    var defaultOptions = {
        placement: "top",
        animation: !0,
        popupDelay: 0
    }, triggerMap = {
        mouseenter: "mouseleave",
        click: "click",
        focus: "blur"
    }, globalOptions = {};
    this.options = function(value) {
        angular.extend(globalOptions, value);
    }, this.setTriggers = function(triggers) {
        angular.extend(triggerMap, triggers);
    }, this.$get = [ "$window", "$compile", "$timeout", "$document", "$position", "$interpolate", function($window, $compile, $timeout, $document, $position, $interpolate) {
        return function(type, prefix, defaultTriggerShow) {
            function getTriggers(trigger) {
                var show = trigger || options.trigger || defaultTriggerShow, hide = triggerMap[show] || show;
                return {
                    show: show,
                    hide: hide
                };
            }
            var options = angular.extend({}, defaultOptions, globalOptions), directiveName = snake_case(type), startSym = $interpolate.startSymbol(), endSym = $interpolate.endSymbol(), template = "<div " + directiveName + '-popup title="' + startSym + "title" + endSym + '" content="' + startSym + "content" + endSym + '" placement="' + startSym + "placement" + endSym + '" animation="animation" is-open="isOpen"></div>';
            return {
                restrict: "EA",
                compile: function() {
                    var tooltipLinker = $compile(template);
                    return function(scope, element, attrs) {
                        function toggleTooltipBind() {
                            ttScope.isOpen ? hideTooltipBind() : showTooltipBind();
                        }
                        function showTooltipBind() {
                            (!hasEnableExp || scope.$eval(attrs[prefix + "Enable"])) && (prepareTooltip(), ttScope.popupDelay ? popupTimeout || (popupTimeout = $timeout(show, ttScope.popupDelay, !1), 
                            popupTimeout.then(function(reposition) {
                                reposition();
                            })) : show()());
                        }
                        function hideTooltipBind() {
                            scope.$apply(function() {
                                hide();
                            });
                        }
                        function show() {
                            return popupTimeout = null, transitionTimeout && ($timeout.cancel(transitionTimeout), 
                            transitionTimeout = null), ttScope.content ? (createTooltip(), tooltip.css({
                                top: 0,
                                left: 0,
                                display: "block"
                            }), appendToBody ? $document.find("body").append(tooltip) : element.after(tooltip), 
                            positionTooltip(), ttScope.isOpen = !0, ttScope.$digest(), positionTooltip) : angular.noop;
                        }
                        function hide() {
                            ttScope.isOpen = !1, $timeout.cancel(popupTimeout), popupTimeout = null, ttScope.animation ? transitionTimeout || (transitionTimeout = $timeout(removeTooltip, 500)) : removeTooltip();
                        }
                        function createTooltip() {
                            tooltip && removeTooltip(), tooltipLinkedScope = ttScope.$new(), tooltip = tooltipLinker(tooltipLinkedScope, angular.noop);
                        }
                        function removeTooltip() {
                            transitionTimeout = null, tooltip && (tooltip.remove(), tooltip = null), tooltipLinkedScope && (tooltipLinkedScope.$destroy(), 
                            tooltipLinkedScope = null);
                        }
                        function prepareTooltip() {
                            prepPlacement(), prepPopupDelay();
                        }
                        function prepPlacement() {
                            var val = attrs[prefix + "Placement"];
                            ttScope.placement = angular.isDefined(val) ? val : options.placement;
                        }
                        function prepPopupDelay() {
                            var val = attrs[prefix + "PopupDelay"], delay = parseInt(val, 10);
                            ttScope.popupDelay = isNaN(delay) ? options.popupDelay : delay;
                        }
                        function prepTriggers() {
                            var val = attrs[prefix + "Trigger"];
                            unregisterTriggers(), triggers = getTriggers(val), triggers.show === triggers.hide ? element.bind(triggers.show, toggleTooltipBind) : (element.bind(triggers.show, showTooltipBind), 
                            element.bind(triggers.hide, hideTooltipBind));
                        }
                        var tooltip, tooltipLinkedScope, transitionTimeout, popupTimeout, appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : !1, triggers = getTriggers(void 0), hasEnableExp = angular.isDefined(attrs[prefix + "Enable"]), ttScope = scope.$new(!0), positionTooltip = function() {
                            var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                            ttPosition.top += "px", ttPosition.left += "px", tooltip.css(ttPosition);
                        };
                        ttScope.isOpen = !1, attrs.$observe(type, function(val) {
                            ttScope.content = val, !val && ttScope.isOpen && hide();
                        }), attrs.$observe(prefix + "Title", function(val) {
                            ttScope.title = val;
                        });
                        var unregisterTriggers = function() {
                            element.unbind(triggers.show, showTooltipBind), element.unbind(triggers.hide, hideTooltipBind);
                        };
                        prepTriggers();
                        var animation = scope.$eval(attrs[prefix + "Animation"]);
                        ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;
                        var appendToBodyVal = scope.$eval(attrs[prefix + "AppendToBody"]);
                        appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody, 
                        appendToBody && scope.$on("$locationChangeSuccess", function() {
                            ttScope.isOpen && hide();
                        }), scope.$on("$destroy", function() {
                            $timeout.cancel(transitionTimeout), $timeout.cancel(popupTimeout), unregisterTriggers(), 
                            removeTooltip(), ttScope = null;
                        });
                    };
                }
            };
        };
    } ];
}).directive("tooltipPopup", function() {
    return {
        restrict: "EA",
        replace: !0,
        scope: {
            content: "@",
            placement: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/tooltip/tooltip-popup.html"
    };
}).directive("tooltip", [ "$tooltip", function($tooltip) {
    return $tooltip("tooltip", "tooltip", "mouseenter");
} ]).directive("tooltipHtmlUnsafePopup", function() {
    return {
        restrict: "EA",
        replace: !0,
        scope: {
            content: "@",
            placement: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/tooltip/tooltip-html-unsafe-popup.html"
    };
}).directive("tooltipHtmlUnsafe", [ "$tooltip", function($tooltip) {
    return $tooltip("tooltipHtmlUnsafe", "tooltip", "mouseenter");
} ]), angular.module("ui.bootstrap.popover", [ "ui.bootstrap.tooltip" ]).directive("popoverPopup", function() {
    return {
        restrict: "EA",
        replace: !0,
        scope: {
            title: "@",
            content: "@",
            placement: "@",
            animation: "&",
            isOpen: "&"
        },
        templateUrl: "template/popover/popover.html"
    };
}).directive("popover", [ "$tooltip", function($tooltip) {
    return $tooltip("popover", "popover", "click");
} ]), angular.module("ui.bootstrap.progressbar", []).constant("progressConfig", {
    animate: !0,
    max: 100
}).controller("ProgressController", [ "$scope", "$attrs", "progressConfig", function($scope, $attrs, progressConfig) {
    var self = this, animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;
    this.bars = [], $scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max, 
    this.addBar = function(bar, element) {
        animate || element.css({
            transition: "none"
        }), this.bars.push(bar), bar.$watch("value", function(value) {
            bar.percent = +(100 * value / $scope.max).toFixed(2);
        }), bar.$on("$destroy", function() {
            element = null, self.removeBar(bar);
        });
    }, this.removeBar = function(bar) {
        this.bars.splice(this.bars.indexOf(bar), 1);
    };
} ]).directive("progress", function() {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        require: "progress",
        scope: {},
        templateUrl: "template/progressbar/progress.html"
    };
}).directive("bar", function() {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        require: "^progress",
        scope: {
            value: "=",
            type: "@"
        },
        templateUrl: "template/progressbar/bar.html",
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, element);
        }
    };
}).directive("progressbar", function() {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        scope: {
            value: "=",
            type: "@"
        },
        templateUrl: "template/progressbar/progressbar.html",
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, angular.element(element.children()[0]));
        }
    };
}), angular.module("ui.bootstrap.rating", []).constant("ratingConfig", {
    max: 5,
    stateOn: null,
    stateOff: null
}).controller("RatingController", [ "$scope", "$attrs", "ratingConfig", function($scope, $attrs, ratingConfig) {
    var ngModelCtrl = {
        $setViewValue: angular.noop
    };
    this.init = function(ngModelCtrl_) {
        ngModelCtrl = ngModelCtrl_, ngModelCtrl.$render = this.render, this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn, 
        this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
        var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) : new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
        $scope.range = this.buildTemplateObjects(ratingStates);
    }, this.buildTemplateObjects = function(states) {
        for (var i = 0, n = states.length; n > i; i++) states[i] = angular.extend({
            index: i
        }, {
            stateOn: this.stateOn,
            stateOff: this.stateOff
        }, states[i]);
        return states;
    }, $scope.rate = function(value) {
        !$scope.readonly && value >= 0 && value <= $scope.range.length && (ngModelCtrl.$setViewValue(value), 
        ngModelCtrl.$render());
    }, $scope.enter = function(value) {
        $scope.readonly || ($scope.value = value), $scope.onHover({
            value: value
        });
    }, $scope.reset = function() {
        $scope.value = ngModelCtrl.$viewValue, $scope.onLeave();
    }, $scope.onKeydown = function(evt) {
        /(37|38|39|40)/.test(evt.which) && (evt.preventDefault(), evt.stopPropagation(), 
        $scope.rate($scope.value + (38 === evt.which || 39 === evt.which ? 1 : -1)));
    }, this.render = function() {
        $scope.value = ngModelCtrl.$viewValue;
    };
} ]).directive("rating", function() {
    return {
        restrict: "EA",
        require: [ "rating", "ngModel" ],
        scope: {
            readonly: "=?",
            onHover: "&",
            onLeave: "&"
        },
        controller: "RatingController",
        templateUrl: "template/rating/rating.html",
        replace: !0,
        link: function(scope, element, attrs, ctrls) {
            var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            ngModelCtrl && ratingCtrl.init(ngModelCtrl);
        }
    };
}), angular.module("ui.bootstrap.tabs", []).controller("TabsetController", [ "$scope", function($scope) {
    var ctrl = this, tabs = ctrl.tabs = $scope.tabs = [];
    ctrl.select = function(selectedTab) {
        angular.forEach(tabs, function(tab) {
            tab.active && tab !== selectedTab && (tab.active = !1, tab.onDeselect());
        }), selectedTab.active = !0, selectedTab.onSelect();
    }, ctrl.addTab = function(tab) {
        tabs.push(tab), 1 === tabs.length ? tab.active = !0 : tab.active && ctrl.select(tab);
    }, ctrl.removeTab = function(tab) {
        var index = tabs.indexOf(tab);
        if (tab.active && tabs.length > 1 && !destroyed) {
            var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
            ctrl.select(tabs[newActiveIndex]);
        }
        tabs.splice(index, 1);
    };
    var destroyed;
    $scope.$on("$destroy", function() {
        destroyed = !0;
    });
} ]).directive("tabset", function() {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        scope: {
            type: "@"
        },
        controller: "TabsetController",
        templateUrl: "template/tabs/tabset.html",
        link: function(scope, element, attrs) {
            scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : !1, 
            scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : !1;
        }
    };
}).directive("tab", [ "$parse", function($parse) {
    return {
        require: "^tabset",
        restrict: "EA",
        replace: !0,
        templateUrl: "template/tabs/tab.html",
        transclude: !0,
        scope: {
            active: "=?",
            heading: "@",
            onSelect: "&select",
            onDeselect: "&deselect"
        },
        controller: function() {},
        compile: function(elm, attrs, transclude) {
            return function(scope, elm, attrs, tabsetCtrl) {
                scope.$watch("active", function(active) {
                    active && tabsetCtrl.select(scope);
                }), scope.disabled = !1, attrs.disabled && scope.$parent.$watch($parse(attrs.disabled), function(value) {
                    scope.disabled = !!value;
                }), scope.select = function() {
                    scope.disabled || (scope.active = !0);
                }, tabsetCtrl.addTab(scope), scope.$on("$destroy", function() {
                    tabsetCtrl.removeTab(scope);
                }), scope.$transcludeFn = transclude;
            };
        }
    };
} ]).directive("tabHeadingTransclude", [ function() {
    return {
        restrict: "A",
        require: "^tab",
        link: function(scope, elm) {
            scope.$watch("headingElement", function(heading) {
                heading && (elm.html(""), elm.append(heading));
            });
        }
    };
} ]).directive("tabContentTransclude", function() {
    function isTabHeading(node) {
        return node.tagName && (node.hasAttribute("tab-heading") || node.hasAttribute("data-tab-heading") || "tab-heading" === node.tagName.toLowerCase() || "data-tab-heading" === node.tagName.toLowerCase());
    }
    return {
        restrict: "A",
        require: "^tabset",
        link: function(scope, elm, attrs) {
            var tab = scope.$eval(attrs.tabContentTransclude);
            tab.$transcludeFn(tab.$parent, function(contents) {
                angular.forEach(contents, function(node) {
                    isTabHeading(node) ? tab.headingElement = node : elm.append(node);
                });
            });
        }
    };
}), angular.module("ui.bootstrap.timepicker", []).constant("timepickerConfig", {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: !0,
    meridians: null,
    readonlyInput: !1,
    mousewheel: !0
}).controller("TimepickerController", [ "$scope", "$attrs", "$parse", "$log", "$locale", "timepickerConfig", function($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
    function getHoursFromTemplate() {
        var hours = parseInt($scope.hours, 10), valid = $scope.showMeridian ? hours > 0 && 13 > hours : hours >= 0 && 24 > hours;
        return valid ? ($scope.showMeridian && (12 === hours && (hours = 0), $scope.meridian === meridians[1] && (hours += 12)), 
        hours) : void 0;
    }
    function getMinutesFromTemplate() {
        var minutes = parseInt($scope.minutes, 10);
        return minutes >= 0 && 60 > minutes ? minutes : void 0;
    }
    function pad(value) {
        return angular.isDefined(value) && value.toString().length < 2 ? "0" + value : value;
    }
    function refresh(keyboardChange) {
        makeValid(), ngModelCtrl.$setViewValue(new Date(selected)), updateTemplate(keyboardChange);
    }
    function makeValid() {
        ngModelCtrl.$setValidity("time", !0), $scope.invalidHours = !1, $scope.invalidMinutes = !1;
    }
    function updateTemplate(keyboardChange) {
        var hours = selected.getHours(), minutes = selected.getMinutes();
        $scope.showMeridian && (hours = 0 === hours || 12 === hours ? 12 : hours % 12), 
        $scope.hours = "h" === keyboardChange ? hours : pad(hours), $scope.minutes = "m" === keyboardChange ? minutes : pad(minutes), 
        $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
    }
    function addMinutes(minutes) {
        var dt = new Date(selected.getTime() + 6e4 * minutes);
        selected.setHours(dt.getHours(), dt.getMinutes()), refresh();
    }
    var selected = new Date(), ngModelCtrl = {
        $setViewValue: angular.noop
    }, meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;
    this.init = function(ngModelCtrl_, inputs) {
        ngModelCtrl = ngModelCtrl_, ngModelCtrl.$render = this.render;
        var hoursInputEl = inputs.eq(0), minutesInputEl = inputs.eq(1), mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
        mousewheel && this.setupMousewheelEvents(hoursInputEl, minutesInputEl), $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput, 
        this.setupInputEvents(hoursInputEl, minutesInputEl);
    };
    var hourStep = timepickerConfig.hourStep;
    $attrs.hourStep && $scope.$parent.$watch($parse($attrs.hourStep), function(value) {
        hourStep = parseInt(value, 10);
    });
    var minuteStep = timepickerConfig.minuteStep;
    $attrs.minuteStep && $scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
        minuteStep = parseInt(value, 10);
    }), $scope.showMeridian = timepickerConfig.showMeridian, $attrs.showMeridian && $scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
        if ($scope.showMeridian = !!value, ngModelCtrl.$error.time) {
            var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
            angular.isDefined(hours) && angular.isDefined(minutes) && (selected.setHours(hours), 
            refresh());
        } else updateTemplate();
    }), this.setupMousewheelEvents = function(hoursInputEl, minutesInputEl) {
        var isScrollingUp = function(e) {
            e.originalEvent && (e = e.originalEvent);
            var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
            return e.detail || delta > 0;
        };
        hoursInputEl.bind("mousewheel wheel", function(e) {
            $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours()), 
            e.preventDefault();
        }), minutesInputEl.bind("mousewheel wheel", function(e) {
            $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes()), 
            e.preventDefault();
        });
    }, this.setupInputEvents = function(hoursInputEl, minutesInputEl) {
        if ($scope.readonlyInput) return $scope.updateHours = angular.noop, void ($scope.updateMinutes = angular.noop);
        var invalidate = function(invalidHours, invalidMinutes) {
            ngModelCtrl.$setViewValue(null), ngModelCtrl.$setValidity("time", !1), angular.isDefined(invalidHours) && ($scope.invalidHours = invalidHours), 
            angular.isDefined(invalidMinutes) && ($scope.invalidMinutes = invalidMinutes);
        };
        $scope.updateHours = function() {
            var hours = getHoursFromTemplate();
            angular.isDefined(hours) ? (selected.setHours(hours), refresh("h")) : invalidate(!0);
        }, hoursInputEl.bind("blur", function() {
            !$scope.invalidHours && $scope.hours < 10 && $scope.$apply(function() {
                $scope.hours = pad($scope.hours);
            });
        }), $scope.updateMinutes = function() {
            var minutes = getMinutesFromTemplate();
            angular.isDefined(minutes) ? (selected.setMinutes(minutes), refresh("m")) : invalidate(void 0, !0);
        }, minutesInputEl.bind("blur", function() {
            !$scope.invalidMinutes && $scope.minutes < 10 && $scope.$apply(function() {
                $scope.minutes = pad($scope.minutes);
            });
        });
    }, this.render = function() {
        var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
        isNaN(date) ? (ngModelCtrl.$setValidity("time", !1), $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (date && (selected = date), 
        makeValid(), updateTemplate());
    }, $scope.incrementHours = function() {
        addMinutes(60 * hourStep);
    }, $scope.decrementHours = function() {
        addMinutes(60 * -hourStep);
    }, $scope.incrementMinutes = function() {
        addMinutes(minuteStep);
    }, $scope.decrementMinutes = function() {
        addMinutes(-minuteStep);
    }, $scope.toggleMeridian = function() {
        addMinutes(720 * (selected.getHours() < 12 ? 1 : -1));
    };
} ]).directive("timepicker", function() {
    return {
        restrict: "EA",
        require: [ "timepicker", "?^ngModel" ],
        controller: "TimepickerController",
        replace: !0,
        scope: {},
        templateUrl: "template/timepicker/timepicker.html",
        link: function(scope, element, attrs, ctrls) {
            var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            ngModelCtrl && timepickerCtrl.init(ngModelCtrl, element.find("input"));
        }
    };
}), angular.module("ui.bootstrap.typeahead", [ "ui.bootstrap.position", "ui.bootstrap.bindHtml" ]).factory("typeaheadParser", [ "$parse", function($parse) {
    var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
        parse: function(input) {
            var match = input.match(TYPEAHEAD_REGEXP);
            if (!match) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + input + '".');
            return {
                itemName: match[3],
                source: $parse(match[4]),
                viewMapper: $parse(match[2] || match[1]),
                modelMapper: $parse(match[1])
            };
        }
    };
} ]).directive("typeahead", [ "$compile", "$parse", "$q", "$timeout", "$document", "$position", "typeaheadParser", function($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {
    var HOT_KEYS = [ 9, 13, 27, 38, 40 ];
    return {
        require: "ngModel",
        link: function(originalScope, element, attrs, modelCtrl) {
            var hasFocus, minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1, waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0, isEditable = originalScope.$eval(attrs.typeaheadEditable) !== !1, isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop, onSelectCallback = $parse(attrs.typeaheadOnSelect), inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : void 0, appendToBody = attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : !1, focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== !1, $setModelValue = $parse(attrs.ngModel).assign, parserResult = typeaheadParser.parse(attrs.typeahead), scope = originalScope.$new();
            originalScope.$on("$destroy", function() {
                scope.$destroy();
            });
            var popupId = "typeahead-" + scope.$id + "-" + Math.floor(1e4 * Math.random());
            element.attr({
                "aria-autocomplete": "list",
                "aria-expanded": !1,
                "aria-owns": popupId
            });
            var popUpEl = angular.element("<div typeahead-popup></div>");
            popUpEl.attr({
                id: popupId,
                matches: "matches",
                active: "activeIdx",
                select: "select(activeIdx)",
                query: "query",
                position: "position"
            }), angular.isDefined(attrs.typeaheadTemplateUrl) && popUpEl.attr("template-url", attrs.typeaheadTemplateUrl);
            var resetMatches = function() {
                scope.matches = [], scope.activeIdx = -1, element.attr("aria-expanded", !1);
            }, getMatchId = function(index) {
                return popupId + "-option-" + index;
            };
            scope.$watch("activeIdx", function(index) {
                0 > index ? element.removeAttr("aria-activedescendant") : element.attr("aria-activedescendant", getMatchId(index));
            });
            var getMatchesAsync = function(inputValue) {
                var locals = {
                    $viewValue: inputValue
                };
                isLoadingSetter(originalScope, !0), $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
                    var onCurrentRequest = inputValue === modelCtrl.$viewValue;
                    if (onCurrentRequest && hasFocus) if (matches.length > 0) {
                        scope.activeIdx = focusFirst ? 0 : -1, scope.matches.length = 0;
                        for (var i = 0; i < matches.length; i++) locals[parserResult.itemName] = matches[i], 
                        scope.matches.push({
                            id: getMatchId(i),
                            label: parserResult.viewMapper(scope, locals),
                            model: matches[i]
                        });
                        scope.query = inputValue, scope.position = appendToBody ? $position.offset(element) : $position.position(element), 
                        scope.position.top = scope.position.top + element.prop("offsetHeight"), element.attr("aria-expanded", !0);
                    } else resetMatches();
                    onCurrentRequest && isLoadingSetter(originalScope, !1);
                }, function() {
                    resetMatches(), isLoadingSetter(originalScope, !1);
                });
            };
            resetMatches(), scope.query = void 0;
            var timeoutPromise, scheduleSearchWithTimeout = function(inputValue) {
                timeoutPromise = $timeout(function() {
                    getMatchesAsync(inputValue);
                }, waitTime);
            }, cancelPreviousTimeout = function() {
                timeoutPromise && $timeout.cancel(timeoutPromise);
            };
            modelCtrl.$parsers.unshift(function(inputValue) {
                return hasFocus = !0, inputValue && inputValue.length >= minSearch ? waitTime > 0 ? (cancelPreviousTimeout(), 
                scheduleSearchWithTimeout(inputValue)) : getMatchesAsync(inputValue) : (isLoadingSetter(originalScope, !1), 
                cancelPreviousTimeout(), resetMatches()), isEditable ? inputValue : inputValue ? void modelCtrl.$setValidity("editable", !1) : (modelCtrl.$setValidity("editable", !0), 
                inputValue);
            }), modelCtrl.$formatters.push(function(modelValue) {
                var candidateViewValue, emptyViewValue, locals = {};
                return inputFormatter ? (locals.$model = modelValue, inputFormatter(originalScope, locals)) : (locals[parserResult.itemName] = modelValue, 
                candidateViewValue = parserResult.viewMapper(originalScope, locals), locals[parserResult.itemName] = void 0, 
                emptyViewValue = parserResult.viewMapper(originalScope, locals), candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue);
            }), scope.select = function(activeIdx) {
                var model, item, locals = {};
                locals[parserResult.itemName] = item = scope.matches[activeIdx].model, model = parserResult.modelMapper(originalScope, locals), 
                $setModelValue(originalScope, model), modelCtrl.$setValidity("editable", !0), onSelectCallback(originalScope, {
                    $item: item,
                    $model: model,
                    $label: parserResult.viewMapper(originalScope, locals)
                }), resetMatches(), $timeout(function() {
                    element[0].focus();
                }, 0, !1);
            }, element.bind("keydown", function(evt) {
                0 !== scope.matches.length && -1 !== HOT_KEYS.indexOf(evt.which) && (-1 != scope.activeIdx || 13 !== evt.which && 9 !== evt.which) && (evt.preventDefault(), 
                40 === evt.which ? (scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length, 
                scope.$digest()) : 38 === evt.which ? (scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1, 
                scope.$digest()) : 13 === evt.which || 9 === evt.which ? scope.$apply(function() {
                    scope.select(scope.activeIdx);
                }) : 27 === evt.which && (evt.stopPropagation(), resetMatches(), scope.$digest()));
            }), element.bind("blur", function() {
                hasFocus = !1;
            });
            var dismissClickHandler = function(evt) {
                element[0] !== evt.target && (resetMatches(), scope.$digest());
            };
            $document.bind("click", dismissClickHandler), originalScope.$on("$destroy", function() {
                $document.unbind("click", dismissClickHandler), appendToBody && $popup.remove();
            });
            var $popup = $compile(popUpEl)(scope);
            appendToBody ? $document.find("body").append($popup) : element.after($popup);
        }
    };
} ]).directive("typeaheadPopup", function() {
    return {
        restrict: "EA",
        scope: {
            matches: "=",
            query: "=",
            active: "=",
            position: "=",
            select: "&"
        },
        replace: !0,
        templateUrl: "template/typeahead/typeahead-popup.html",
        link: function(scope, element, attrs) {
            scope.templateUrl = attrs.templateUrl, scope.isOpen = function() {
                return scope.matches.length > 0;
            }, scope.isActive = function(matchIdx) {
                return scope.active == matchIdx;
            }, scope.selectActive = function(matchIdx) {
                scope.active = matchIdx;
            }, scope.selectMatch = function(activeIdx) {
                scope.select({
                    activeIdx: activeIdx
                });
            };
        }
    };
}).directive("typeaheadMatch", [ "$http", "$templateCache", "$compile", "$parse", function($http, $templateCache, $compile, $parse) {
    return {
        restrict: "EA",
        scope: {
            index: "=",
            match: "=",
            query: "="
        },
        link: function(scope, element, attrs) {
            var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || "template/typeahead/typeahead-match.html";
            $http.get(tplUrl, {
                cache: $templateCache
            }).success(function(tplContent) {
                element.replaceWith($compile(tplContent.trim())(scope));
            });
        }
    };
} ]).filter("typeaheadHighlight", function() {
    function escapeRegexp(queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }
    return function(matchItem, query) {
        return query ? ("" + matchItem).replace(new RegExp(escapeRegexp(query), "gi"), "<strong>$&</strong>") : matchItem;
    };
}), angular.module("template/accordion/accordion-group.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion-group.html", '<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n');
} ]), angular.module("template/accordion/accordion.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion.html", '<div class="panel-group" ng-transclude></div>');
} ]), angular.module("template/alert/alert.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/alert/alert.html", '<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n');
} ]), angular.module("template/carousel/carousel.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/carousel/carousel.html", '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n');
} ]), angular.module("template/carousel/slide.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/carousel/slide.html", "<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n");
} ]), angular.module("template/datepicker/datepicker.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/datepicker.html", '<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>');
} ]), angular.module("template/datepicker/day.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/day.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
} ]), angular.module("template/datepicker/month.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/month.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
} ]), angular.module("template/datepicker/popup.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/popup.html", '<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group pull-left">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n');
} ]), angular.module("template/datepicker/year.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/year.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
} ]), angular.module("template/modal/backdrop.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/modal/backdrop.html", '<div class="modal-backdrop fade {{ backdropClass }}"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n');
} ]), angular.module("template/modal/window.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/modal/window.html", '<div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" modal-transclude></div></div>\n</div>');
} ]), angular.module("template/pagination/pager.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/pagination/pager.html", '<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n</ul>');
} ]), angular.module("template/pagination/pagination.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/pagination/pagination.html", '<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n</ul>');
} ]), angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n');
} ]), angular.module("template/tooltip/tooltip-popup.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/tooltip/tooltip-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n');
} ]), angular.module("template/popover/popover.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/popover/popover.html", '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n');
} ]), angular.module("template/progressbar/bar.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>');
} ]), angular.module("template/progressbar/progress.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/progressbar/progress.html", '<div class="progress" ng-transclude></div>');
} ]), angular.module("template/progressbar/progressbar.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>');
} ]), angular.module("template/rating/rating.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>');
} ]), angular.module("template/tabs/tab.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/tabs/tab.html", '<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n');
} ]), angular.module("template/tabs/tabset.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n');
} ]), angular.module("template/timepicker/timepicker.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/timepicker/timepicker.html", '<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n');
} ]), angular.module("template/typeahead/typeahead-match.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/typeahead/typeahead-match.html", '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>');
} ]), angular.module("template/typeahead/typeahead-popup.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n');
} ]), function(window, angular, undefined) {
    "use strict";
    angular.module("ngAnimate", [ "ng" ]).directive("ngAnimateChildren", function() {
        var NG_ANIMATE_CHILDREN = "$$ngAnimateChildren";
        return function(scope, element, attrs) {
            var val = attrs.ngAnimateChildren;
            angular.isString(val) && 0 === val.length ? element.data(NG_ANIMATE_CHILDREN, !0) : scope.$watch(val, function(value) {
                element.data(NG_ANIMATE_CHILDREN, !!value);
            });
        };
    }).factory("$$animateReflow", [ "$$rAF", "$document", function($$rAF, $document) {
        var bod = $document[0].body;
        return function(fn) {
            return $$rAF(function() {
                bod.offsetWidth + 1;
                fn();
            });
        };
    } ]).config([ "$provide", "$animateProvider", function($provide, $animateProvider) {
        function extractElementNode(element) {
            for (var i = 0; i < element.length; i++) {
                var elm = element[i];
                if (elm.nodeType == ELEMENT_NODE) return elm;
            }
        }
        function prepareElement(element) {
            return element && angular.element(element);
        }
        function stripCommentsFromElement(element) {
            return angular.element(extractElementNode(element));
        }
        function isMatchingElement(elm1, elm2) {
            return extractElementNode(elm1) == extractElementNode(elm2);
        }
        var $$jqLite, noop = angular.noop, forEach = angular.forEach, selectors = $animateProvider.$$selectors, isArray = angular.isArray, isString = angular.isString, isObject = angular.isObject, ELEMENT_NODE = 1, NG_ANIMATE_STATE = "$$ngAnimateState", NG_ANIMATE_CHILDREN = "$$ngAnimateChildren", NG_ANIMATE_CLASS_NAME = "ng-animate", rootAnimateState = {
            running: !0
        };
        $provide.decorator("$animate", [ "$delegate", "$$q", "$injector", "$sniffer", "$rootElement", "$$asyncCallback", "$rootScope", "$document", "$templateRequest", "$$jqLite", function($delegate, $$q, $injector, $sniffer, $rootElement, $$asyncCallback, $rootScope, $document, $templateRequest, $$$jqLite) {
            function classBasedAnimationsBlocked(element, setter) {
                var data = element.data(NG_ANIMATE_STATE) || {};
                return setter && (data.running = !0, data.structural = !0, element.data(NG_ANIMATE_STATE, data)), 
                data.disabled || data.running && data.structural;
            }
            function runAnimationPostDigest(fn) {
                var cancelFn, defer = $$q.defer();
                return defer.promise.$$cancelFn = function() {
                    cancelFn && cancelFn();
                }, $rootScope.$$postDigest(function() {
                    cancelFn = fn(function() {
                        defer.resolve();
                    });
                }), defer.promise;
            }
            function parseAnimateOptions(options) {
                return isObject(options) ? (options.tempClasses && isString(options.tempClasses) && (options.tempClasses = options.tempClasses.split(/\s+/)), 
                options) : void 0;
            }
            function resolveElementClasses(element, cache, runningAnimations) {
                runningAnimations = runningAnimations || {};
                var lookup = {};
                forEach(runningAnimations, function(data, selector) {
                    forEach(selector.split(" "), function(s) {
                        lookup[s] = data;
                    });
                });
                var hasClasses = Object.create(null);
                forEach((element.attr("class") || "").split(/\s+/), function(className) {
                    hasClasses[className] = !0;
                });
                var toAdd = [], toRemove = [];
                return forEach(cache && cache.classes || [], function(status, className) {
                    var hasClass = hasClasses[className], matchingAnimation = lookup[className] || {};
                    status === !1 ? (hasClass || "addClass" == matchingAnimation.event) && toRemove.push(className) : status === !0 && (hasClass && "removeClass" != matchingAnimation.event || toAdd.push(className));
                }), toAdd.length + toRemove.length > 0 && [ toAdd.join(" "), toRemove.join(" ") ];
            }
            function lookup(name) {
                if (name) {
                    var matches = [], flagMap = {}, classes = name.substr(1).split(".");
                    ($sniffer.transitions || $sniffer.animations) && matches.push($injector.get(selectors[""]));
                    for (var i = 0; i < classes.length; i++) {
                        var klass = classes[i], selectorFactoryName = selectors[klass];
                        selectorFactoryName && !flagMap[klass] && (matches.push($injector.get(selectorFactoryName)), 
                        flagMap[klass] = !0);
                    }
                    return matches;
                }
            }
            function animationRunner(element, animationEvent, className, options) {
                function registerAnimation(animationFactory, event) {
                    var afterFn = animationFactory[event], beforeFn = animationFactory["before" + event.charAt(0).toUpperCase() + event.substr(1)];
                    return afterFn || beforeFn ? ("leave" == event && (beforeFn = afterFn, afterFn = null), 
                    after.push({
                        event: event,
                        fn: afterFn
                    }), before.push({
                        event: event,
                        fn: beforeFn
                    }), !0) : void 0;
                }
                function run(fns, cancellations, allCompleteFn) {
                    function afterAnimationComplete(index) {
                        if (cancellations) {
                            if ((cancellations[index] || noop)(), ++count < animations.length) return;
                            cancellations = null;
                        }
                        allCompleteFn();
                    }
                    var animations = [];
                    forEach(fns, function(animation) {
                        animation.fn && animations.push(animation);
                    });
                    var count = 0;
                    forEach(animations, function(animation, index) {
                        var progress = function() {
                            afterAnimationComplete(index);
                        };
                        switch (animation.event) {
                          case "setClass":
                            cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress, options));
                            break;

                          case "animate":
                            cancellations.push(animation.fn(element, className, options.from, options.to, progress));
                            break;

                          case "addClass":
                            cancellations.push(animation.fn(element, classNameAdd || className, progress, options));
                            break;

                          case "removeClass":
                            cancellations.push(animation.fn(element, classNameRemove || className, progress, options));
                            break;

                          default:
                            cancellations.push(animation.fn(element, progress, options));
                        }
                    }), cancellations && 0 === cancellations.length && allCompleteFn();
                }
                var node = element[0];
                if (node) {
                    options && (options.to = options.to || {}, options.from = options.from || {});
                    var classNameAdd, classNameRemove;
                    isArray(className) && (classNameAdd = className[0], classNameRemove = className[1], 
                    classNameAdd ? classNameRemove ? className = classNameAdd + " " + classNameRemove : (className = classNameAdd, 
                    animationEvent = "addClass") : (className = classNameRemove, animationEvent = "removeClass"));
                    var isSetClassOperation = "setClass" == animationEvent, isClassBased = isSetClassOperation || "addClass" == animationEvent || "removeClass" == animationEvent || "animate" == animationEvent, currentClassName = element.attr("class"), classes = currentClassName + " " + className;
                    if (isAnimatableClassName(classes)) {
                        var beforeComplete = noop, beforeCancel = [], before = [], afterComplete = noop, afterCancel = [], after = [], animationLookup = (" " + classes).replace(/\s+/g, ".");
                        return forEach(lookup(animationLookup), function(animationFactory) {
                            var created = registerAnimation(animationFactory, animationEvent);
                            !created && isSetClassOperation && (registerAnimation(animationFactory, "addClass"), 
                            registerAnimation(animationFactory, "removeClass"));
                        }), {
                            node: node,
                            event: animationEvent,
                            className: className,
                            isClassBased: isClassBased,
                            isSetClassOperation: isSetClassOperation,
                            applyStyles: function() {
                                options && element.css(angular.extend(options.from || {}, options.to || {}));
                            },
                            before: function(allCompleteFn) {
                                beforeComplete = allCompleteFn, run(before, beforeCancel, function() {
                                    beforeComplete = noop, allCompleteFn();
                                });
                            },
                            after: function(allCompleteFn) {
                                afterComplete = allCompleteFn, run(after, afterCancel, function() {
                                    afterComplete = noop, allCompleteFn();
                                });
                            },
                            cancel: function() {
                                beforeCancel && (forEach(beforeCancel, function(cancelFn) {
                                    (cancelFn || noop)(!0);
                                }), beforeComplete(!0)), afterCancel && (forEach(afterCancel, function(cancelFn) {
                                    (cancelFn || noop)(!0);
                                }), afterComplete(!0));
                            }
                        };
                    }
                }
            }
            function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, options, doneCallback) {
                function fireDOMCallback(animationPhase) {
                    var eventName = "$animate:" + animationPhase;
                    elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0 && $$asyncCallback(function() {
                        element.triggerHandler(eventName, {
                            event: animationEvent,
                            className: className
                        });
                    });
                }
                function fireBeforeCallbackAsync() {
                    fireDOMCallback("before");
                }
                function fireAfterCallbackAsync() {
                    fireDOMCallback("after");
                }
                function fireDoneCallbackAsync() {
                    fireDOMCallback("close"), doneCallback();
                }
                function fireDOMOperation() {
                    fireDOMOperation.hasBeenRun || (fireDOMOperation.hasBeenRun = !0, domOperation());
                }
                function closeAnimation() {
                    if (!closeAnimation.hasBeenRun) {
                        runner && runner.applyStyles(), closeAnimation.hasBeenRun = !0, options && options.tempClasses && forEach(options.tempClasses, function(className) {
                            $$jqLite.removeClass(element, className);
                        });
                        var data = element.data(NG_ANIMATE_STATE);
                        data && (runner && runner.isClassBased ? cleanup(element, className) : ($$asyncCallback(function() {
                            var data = element.data(NG_ANIMATE_STATE) || {};
                            localAnimationCount == data.index && cleanup(element, className, animationEvent);
                        }), element.data(NG_ANIMATE_STATE, data))), fireDoneCallbackAsync();
                    }
                }
                var noopCancel = noop, runner = animationRunner(element, animationEvent, className, options);
                if (!runner) return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), 
                closeAnimation(), noopCancel;
                animationEvent = runner.event, className = runner.className;
                var elementEvents = angular.element._data(runner.node);
                if (elementEvents = elementEvents && elementEvents.events, parentElement || (parentElement = afterElement ? afterElement.parent() : element.parent()), 
                animationsDisabled(element, parentElement)) return fireDOMOperation(), fireBeforeCallbackAsync(), 
                fireAfterCallbackAsync(), closeAnimation(), noopCancel;
                var ngAnimateState = element.data(NG_ANIMATE_STATE) || {}, runningAnimations = ngAnimateState.active || {}, totalActiveAnimations = ngAnimateState.totalActive || 0, lastAnimation = ngAnimateState.last, skipAnimation = !1;
                if (totalActiveAnimations > 0) {
                    var animationsToCancel = [];
                    if (runner.isClassBased) {
                        if ("setClass" == lastAnimation.event) animationsToCancel.push(lastAnimation), cleanup(element, className); else if (runningAnimations[className]) {
                            var current = runningAnimations[className];
                            current.event == animationEvent ? skipAnimation = !0 : (animationsToCancel.push(current), 
                            cleanup(element, className));
                        }
                    } else if ("leave" == animationEvent && runningAnimations["ng-leave"]) skipAnimation = !0; else {
                        for (var klass in runningAnimations) animationsToCancel.push(runningAnimations[klass]);
                        ngAnimateState = {}, cleanup(element, !0);
                    }
                    animationsToCancel.length > 0 && forEach(animationsToCancel, function(operation) {
                        operation.cancel();
                    });
                }
                if (!runner.isClassBased || runner.isSetClassOperation || "animate" == animationEvent || skipAnimation || (skipAnimation = "addClass" == animationEvent == element.hasClass(className)), 
                skipAnimation) return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), 
                fireDoneCallbackAsync(), noopCancel;
                runningAnimations = ngAnimateState.active || {}, totalActiveAnimations = ngAnimateState.totalActive || 0, 
                "leave" == animationEvent && element.one("$destroy", function() {
                    var element = angular.element(this), state = element.data(NG_ANIMATE_STATE);
                    if (state) {
                        var activeLeaveAnimation = state.active["ng-leave"];
                        activeLeaveAnimation && (activeLeaveAnimation.cancel(), cleanup(element, "ng-leave"));
                    }
                }), $$jqLite.addClass(element, NG_ANIMATE_CLASS_NAME), options && options.tempClasses && forEach(options.tempClasses, function(className) {
                    $$jqLite.addClass(element, className);
                });
                var localAnimationCount = globalAnimationCounter++;
                return totalActiveAnimations++, runningAnimations[className] = runner, element.data(NG_ANIMATE_STATE, {
                    last: runner,
                    active: runningAnimations,
                    index: localAnimationCount,
                    totalActive: totalActiveAnimations
                }), fireBeforeCallbackAsync(), runner.before(function(cancelled) {
                    var data = element.data(NG_ANIMATE_STATE);
                    cancelled = cancelled || !data || !data.active[className] || runner.isClassBased && data.active[className].event != animationEvent, 
                    fireDOMOperation(), cancelled === !0 ? closeAnimation() : (fireAfterCallbackAsync(), 
                    runner.after(closeAnimation));
                }), runner.cancel;
            }
            function cancelChildAnimations(element) {
                var node = extractElementNode(element);
                if (node) {
                    var nodes = angular.isFunction(node.getElementsByClassName) ? node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) : node.querySelectorAll("." + NG_ANIMATE_CLASS_NAME);
                    forEach(nodes, function(element) {
                        element = angular.element(element);
                        var data = element.data(NG_ANIMATE_STATE);
                        data && data.active && forEach(data.active, function(runner) {
                            runner.cancel();
                        });
                    });
                }
            }
            function cleanup(element, className) {
                if (isMatchingElement(element, $rootElement)) rootAnimateState.disabled || (rootAnimateState.running = !1, 
                rootAnimateState.structural = !1); else if (className) {
                    var data = element.data(NG_ANIMATE_STATE) || {}, removeAnimations = className === !0;
                    !removeAnimations && data.active && data.active[className] && (data.totalActive--, 
                    delete data.active[className]), (removeAnimations || !data.totalActive) && ($$jqLite.removeClass(element, NG_ANIMATE_CLASS_NAME), 
                    element.removeData(NG_ANIMATE_STATE));
                }
            }
            function animationsDisabled(element, parentElement) {
                if (rootAnimateState.disabled) return !0;
                if (isMatchingElement(element, $rootElement)) return rootAnimateState.running;
                var allowChildAnimations, parentRunningAnimation, hasParent;
                do {
                    if (0 === parentElement.length) break;
                    var isRoot = isMatchingElement(parentElement, $rootElement), state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE) || {};
                    if (state.disabled) return !0;
                    if (isRoot && (hasParent = !0), allowChildAnimations !== !1) {
                        var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
                        angular.isDefined(animateChildrenFlag) && (allowChildAnimations = animateChildrenFlag);
                    }
                    parentRunningAnimation = parentRunningAnimation || state.running || state.last && !state.last.isClassBased;
                } while (parentElement = parentElement.parent());
                return !hasParent || !allowChildAnimations && parentRunningAnimation;
            }
            $$jqLite = $$$jqLite, $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);
            var deregisterWatch = $rootScope.$watch(function() {
                return $templateRequest.totalPendingRequests;
            }, function(val) {
                0 === val && (deregisterWatch(), $rootScope.$$postDigest(function() {
                    $rootScope.$$postDigest(function() {
                        rootAnimateState.running = !1;
                    });
                }));
            }), globalAnimationCounter = 0, classNameFilter = $animateProvider.classNameFilter(), isAnimatableClassName = classNameFilter ? function(className) {
                return classNameFilter.test(className);
            } : function() {
                return !0;
            };
            return {
                animate: function(element, from, to, className, options) {
                    return className = className || "ng-inline-animate", options = parseAnimateOptions(options) || {}, 
                    options.from = to ? from : null, options.to = to ? to : from, runAnimationPostDigest(function(done) {
                        return performAnimation("animate", className, stripCommentsFromElement(element), null, null, noop, options, done);
                    });
                },
                enter: function(element, parentElement, afterElement, options) {
                    return options = parseAnimateOptions(options), element = angular.element(element), 
                    parentElement = prepareElement(parentElement), afterElement = prepareElement(afterElement), 
                    classBasedAnimationsBlocked(element, !0), $delegate.enter(element, parentElement, afterElement), 
                    runAnimationPostDigest(function(done) {
                        return performAnimation("enter", "ng-enter", stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
                    });
                },
                leave: function(element, options) {
                    return options = parseAnimateOptions(options), element = angular.element(element), 
                    cancelChildAnimations(element), classBasedAnimationsBlocked(element, !0), runAnimationPostDigest(function(done) {
                        return performAnimation("leave", "ng-leave", stripCommentsFromElement(element), null, null, function() {
                            $delegate.leave(element);
                        }, options, done);
                    });
                },
                move: function(element, parentElement, afterElement, options) {
                    return options = parseAnimateOptions(options), element = angular.element(element), 
                    parentElement = prepareElement(parentElement), afterElement = prepareElement(afterElement), 
                    cancelChildAnimations(element), classBasedAnimationsBlocked(element, !0), $delegate.move(element, parentElement, afterElement), 
                    runAnimationPostDigest(function(done) {
                        return performAnimation("move", "ng-move", stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
                    });
                },
                addClass: function(element, className, options) {
                    return this.setClass(element, className, [], options);
                },
                removeClass: function(element, className, options) {
                    return this.setClass(element, [], className, options);
                },
                setClass: function(element, add, remove, options) {
                    options = parseAnimateOptions(options);
                    var STORAGE_KEY = "$$animateClasses";
                    if (element = angular.element(element), element = stripCommentsFromElement(element), 
                    classBasedAnimationsBlocked(element)) return $delegate.$$setClassImmediately(element, add, remove, options);
                    var classes, cache = element.data(STORAGE_KEY), hasCache = !!cache;
                    return cache || (cache = {}, cache.classes = {}), classes = cache.classes, add = isArray(add) ? add : add.split(" "), 
                    forEach(add, function(c) {
                        c && c.length && (classes[c] = !0);
                    }), remove = isArray(remove) ? remove : remove.split(" "), forEach(remove, function(c) {
                        c && c.length && (classes[c] = !1);
                    }), hasCache ? (options && cache.options && (cache.options = angular.extend(cache.options || {}, options)), 
                    cache.promise) : (element.data(STORAGE_KEY, cache = {
                        classes: classes,
                        options: options
                    }), cache.promise = runAnimationPostDigest(function(done) {
                        var parentElement = element.parent(), elementNode = extractElementNode(element), parentNode = elementNode.parentNode;
                        if (!parentNode || parentNode.$$NG_REMOVED || elementNode.$$NG_REMOVED) return void done();
                        var cache = element.data(STORAGE_KEY);
                        element.removeData(STORAGE_KEY);
                        var state = element.data(NG_ANIMATE_STATE) || {}, classes = resolveElementClasses(element, cache, state.active);
                        return classes ? performAnimation("setClass", classes, element, parentElement, null, function() {
                            classes[0] && $delegate.$$addClassImmediately(element, classes[0]), classes[1] && $delegate.$$removeClassImmediately(element, classes[1]);
                        }, cache.options, done) : done();
                    }));
                },
                cancel: function(promise) {
                    promise.$$cancelFn();
                },
                enabled: function(value, element) {
                    switch (arguments.length) {
                      case 2:
                        if (value) cleanup(element); else {
                            var data = element.data(NG_ANIMATE_STATE) || {};
                            data.disabled = !0, element.data(NG_ANIMATE_STATE, data);
                        }
                        break;

                      case 1:
                        rootAnimateState.disabled = !value;
                        break;

                      default:
                        value = !rootAnimateState.disabled;
                    }
                    return !!value;
                }
            };
        } ]), $animateProvider.register("", [ "$window", "$sniffer", "$timeout", "$$animateReflow", function($window, $sniffer, $timeout, $$animateReflow) {
            function clearCacheAfterReflow() {
                cancelAnimationReflow || (cancelAnimationReflow = $$animateReflow(function() {
                    animationReflowQueue = [], cancelAnimationReflow = null, lookupCache = {};
                }));
            }
            function afterReflow(element, callback) {
                cancelAnimationReflow && cancelAnimationReflow(), animationReflowQueue.push(callback), 
                cancelAnimationReflow = $$animateReflow(function() {
                    forEach(animationReflowQueue, function(fn) {
                        fn();
                    }), animationReflowQueue = [], cancelAnimationReflow = null, lookupCache = {};
                });
            }
            function animationCloseHandler(element, totalTime) {
                var node = extractElementNode(element);
                element = angular.element(node), animationElementQueue.push(element);
                var futureTimestamp = Date.now() + totalTime;
                closingTimestamp >= futureTimestamp || ($timeout.cancel(closingTimer), closingTimestamp = futureTimestamp, 
                closingTimer = $timeout(function() {
                    closeAllAnimations(animationElementQueue), animationElementQueue = [];
                }, totalTime, !1));
            }
            function closeAllAnimations(elements) {
                forEach(elements, function(element) {
                    var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
                    elementData && forEach(elementData.closeAnimationFns, function(fn) {
                        fn();
                    });
                });
            }
            function getElementAnimationDetails(element, cacheKey) {
                var data = cacheKey ? lookupCache[cacheKey] : null;
                if (!data) {
                    var transitionDuration = 0, transitionDelay = 0, animationDuration = 0, animationDelay = 0;
                    forEach(element, function(element) {
                        if (element.nodeType == ELEMENT_NODE) {
                            var elementStyles = $window.getComputedStyle(element) || {}, transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];
                            transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);
                            var transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];
                            transitionDelay = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);
                            {
                                elementStyles[ANIMATION_PROP + DELAY_KEY];
                            }
                            animationDelay = Math.max(parseMaxTime(elementStyles[ANIMATION_PROP + DELAY_KEY]), animationDelay);
                            var aDuration = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);
                            aDuration > 0 && (aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1), 
                            animationDuration = Math.max(aDuration, animationDuration);
                        }
                    }), data = {
                        total: 0,
                        transitionDelay: transitionDelay,
                        transitionDuration: transitionDuration,
                        animationDelay: animationDelay,
                        animationDuration: animationDuration
                    }, cacheKey && (lookupCache[cacheKey] = data);
                }
                return data;
            }
            function parseMaxTime(str) {
                var maxValue = 0, values = isString(str) ? str.split(/\s*,\s*/) : [];
                return forEach(values, function(value) {
                    maxValue = Math.max(parseFloat(value) || 0, maxValue);
                }), maxValue;
            }
            function getCacheKey(element) {
                var parentElement = element.parent(), parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
                return parentID || (parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter), 
                parentID = parentCounter), parentID + "-" + extractElementNode(element).getAttribute("class");
            }
            function animateSetup(animationEvent, element, className, styles) {
                var structural = [ "ng-enter", "ng-leave", "ng-move" ].indexOf(className) >= 0, cacheKey = getCacheKey(element), eventCacheKey = cacheKey + " " + className, itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0, stagger = {};
                if (itemIndex > 0) {
                    var staggerClassName = className + "-stagger", staggerCacheKey = cacheKey + " " + staggerClassName, applyClasses = !lookupCache[staggerCacheKey];
                    applyClasses && $$jqLite.addClass(element, staggerClassName), stagger = getElementAnimationDetails(element, staggerCacheKey), 
                    applyClasses && $$jqLite.removeClass(element, staggerClassName);
                }
                $$jqLite.addClass(element, className);
                var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {}, timings = getElementAnimationDetails(element, eventCacheKey), transitionDuration = timings.transitionDuration, animationDuration = timings.animationDuration;
                if (structural && 0 === transitionDuration && 0 === animationDuration) return $$jqLite.removeClass(element, className), 
                !1;
                var blockTransition = styles || structural && transitionDuration > 0, blockAnimation = animationDuration > 0 && stagger.animationDelay > 0 && 0 === stagger.animationDuration, closeAnimationFns = formerData.closeAnimationFns || [];
                element.data(NG_ANIMATE_CSS_DATA_KEY, {
                    stagger: stagger,
                    cacheKey: eventCacheKey,
                    running: formerData.running || 0,
                    itemIndex: itemIndex,
                    blockTransition: blockTransition,
                    closeAnimationFns: closeAnimationFns
                });
                var node = extractElementNode(element);
                return blockTransition && (blockTransitions(node, !0), styles && element.css(styles)), 
                blockAnimation && blockAnimations(node, !0), !0;
            }
            function animateRun(animationEvent, element, className, activeAnimationComplete, styles) {
                function onEnd() {
                    element.off(css3AnimationEvents, onAnimationProgress), $$jqLite.removeClass(element, activeClassName), 
                    $$jqLite.removeClass(element, pendingClassName), staggerTimeout && $timeout.cancel(staggerTimeout), 
                    animateClose(element, className);
                    var node = extractElementNode(element);
                    for (var i in appliedStyles) node.style.removeProperty(appliedStyles[i]);
                }
                function onAnimationProgress(event) {
                    event.stopPropagation();
                    var ev = event.originalEvent || event, timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now(), elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));
                    Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration && activeAnimationComplete();
                }
                var node = extractElementNode(element), elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
                if (-1 == node.getAttribute("class").indexOf(className) || !elementData) return void activeAnimationComplete();
                var activeClassName = "", pendingClassName = "";
                forEach(className.split(" "), function(klass, i) {
                    var prefix = (i > 0 ? " " : "") + klass;
                    activeClassName += prefix + "-active", pendingClassName += prefix + "-pending";
                });
                var style = "", appliedStyles = [], itemIndex = elementData.itemIndex, stagger = elementData.stagger, staggerTime = 0;
                if (itemIndex > 0) {
                    var transitionStaggerDelay = 0;
                    stagger.transitionDelay > 0 && 0 === stagger.transitionDuration && (transitionStaggerDelay = stagger.transitionDelay * itemIndex);
                    var animationStaggerDelay = 0;
                    stagger.animationDelay > 0 && 0 === stagger.animationDuration && (animationStaggerDelay = stagger.animationDelay * itemIndex, 
                    appliedStyles.push(CSS_PREFIX + "animation-play-state")), staggerTime = Math.round(100 * Math.max(transitionStaggerDelay, animationStaggerDelay)) / 100;
                }
                staggerTime || ($$jqLite.addClass(element, activeClassName), elementData.blockTransition && blockTransitions(node, !1));
                var eventCacheKey = elementData.cacheKey + " " + activeClassName, timings = getElementAnimationDetails(element, eventCacheKey), maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
                if (0 === maxDuration) return $$jqLite.removeClass(element, activeClassName), animateClose(element, className), 
                void activeAnimationComplete();
                !staggerTime && styles && Object.keys(styles).length > 0 && (timings.transitionDuration || (element.css("transition", timings.animationDuration + "s linear all"), 
                appliedStyles.push("transition")), element.css(styles));
                var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay), maxDelayTime = maxDelay * ONE_SECOND;
                if (appliedStyles.length > 0) {
                    var oldStyle = node.getAttribute("style") || "";
                    ";" !== oldStyle.charAt(oldStyle.length - 1) && (oldStyle += ";"), node.setAttribute("style", oldStyle + " " + style);
                }
                var staggerTimeout, startTime = Date.now(), css3AnimationEvents = ANIMATIONEND_EVENT + " " + TRANSITIONEND_EVENT, animationTime = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER, totalTime = (staggerTime + animationTime) * ONE_SECOND;
                return staggerTime > 0 && ($$jqLite.addClass(element, pendingClassName), staggerTimeout = $timeout(function() {
                    staggerTimeout = null, timings.transitionDuration > 0 && blockTransitions(node, !1), 
                    timings.animationDuration > 0 && blockAnimations(node, !1), $$jqLite.addClass(element, activeClassName), 
                    $$jqLite.removeClass(element, pendingClassName), styles && (0 === timings.transitionDuration && element.css("transition", timings.animationDuration + "s linear all"), 
                    element.css(styles), appliedStyles.push("transition"));
                }, staggerTime * ONE_SECOND, !1)), element.on(css3AnimationEvents, onAnimationProgress), 
                elementData.closeAnimationFns.push(function() {
                    onEnd(), activeAnimationComplete();
                }), elementData.running++, animationCloseHandler(element, totalTime), onEnd;
            }
            function blockTransitions(node, bool) {
                node.style[TRANSITION_PROP + PROPERTY_KEY] = bool ? "none" : "";
            }
            function blockAnimations(node, bool) {
                node.style[ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY] = bool ? "paused" : "";
            }
            function animateBefore(animationEvent, element, className, styles) {
                return animateSetup(animationEvent, element, className, styles) ? function(cancelled) {
                    cancelled && animateClose(element, className);
                } : void 0;
            }
            function animateAfter(animationEvent, element, className, afterAnimationComplete, styles) {
                return element.data(NG_ANIMATE_CSS_DATA_KEY) ? animateRun(animationEvent, element, className, afterAnimationComplete, styles) : (animateClose(element, className), 
                void afterAnimationComplete());
            }
            function animate(animationEvent, element, className, animationComplete, options) {
                var preReflowCancellation = animateBefore(animationEvent, element, className, options.from);
                if (!preReflowCancellation) return clearCacheAfterReflow(), void animationComplete();
                var cancel = preReflowCancellation;
                return afterReflow(element, function() {
                    cancel = animateAfter(animationEvent, element, className, animationComplete, options.to);
                }), function(cancelled) {
                    (cancel || noop)(cancelled);
                };
            }
            function animateClose(element, className) {
                $$jqLite.removeClass(element, className);
                var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
                data && (data.running && data.running--, data.running && 0 !== data.running || element.removeData(NG_ANIMATE_CSS_DATA_KEY));
            }
            function suffixClasses(classes, suffix) {
                var className = "";
                return classes = isArray(classes) ? classes : classes.split(/\s+/), forEach(classes, function(klass, i) {
                    klass && klass.length > 0 && (className += (i > 0 ? " " : "") + klass + suffix);
                }), className;
            }
            var TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT, CSS_PREFIX = "";
            window.ontransitionend === undefined && window.onwebkittransitionend !== undefined ? (CSS_PREFIX = "-webkit-", 
            TRANSITION_PROP = "WebkitTransition", TRANSITIONEND_EVENT = "webkitTransitionEnd transitionend") : (TRANSITION_PROP = "transition", 
            TRANSITIONEND_EVENT = "transitionend"), window.onanimationend === undefined && window.onwebkitanimationend !== undefined ? (CSS_PREFIX = "-webkit-", 
            ANIMATION_PROP = "WebkitAnimation", ANIMATIONEND_EVENT = "webkitAnimationEnd animationend") : (ANIMATION_PROP = "animation", 
            ANIMATIONEND_EVENT = "animationend");
            var cancelAnimationReflow, DURATION_KEY = "Duration", PROPERTY_KEY = "Property", DELAY_KEY = "Delay", ANIMATION_ITERATION_COUNT_KEY = "IterationCount", ANIMATION_PLAYSTATE_KEY = "PlayState", NG_ANIMATE_PARENT_KEY = "$$ngAnimateKey", NG_ANIMATE_CSS_DATA_KEY = "$$ngAnimateCSS3Data", ELAPSED_TIME_MAX_DECIMAL_PLACES = 3, CLOSING_TIME_BUFFER = 1.5, ONE_SECOND = 1e3, lookupCache = {}, parentCounter = 0, animationReflowQueue = [], closingTimer = null, closingTimestamp = 0, animationElementQueue = [];
            return {
                animate: function(element, className, from, to, animationCompleted, options) {
                    return options = options || {}, options.from = from, options.to = to, animate("animate", element, className, animationCompleted, options);
                },
                enter: function(element, animationCompleted, options) {
                    return options = options || {}, animate("enter", element, "ng-enter", animationCompleted, options);
                },
                leave: function(element, animationCompleted, options) {
                    return options = options || {}, animate("leave", element, "ng-leave", animationCompleted, options);
                },
                move: function(element, animationCompleted, options) {
                    return options = options || {}, animate("move", element, "ng-move", animationCompleted, options);
                },
                beforeSetClass: function(element, add, remove, animationCompleted, options) {
                    options = options || {};
                    var className = suffixClasses(remove, "-remove") + " " + suffixClasses(add, "-add"), cancellationMethod = animateBefore("setClass", element, className, options.from);
                    return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), 
                    void animationCompleted());
                },
                beforeAddClass: function(element, className, animationCompleted, options) {
                    options = options || {};
                    var cancellationMethod = animateBefore("addClass", element, suffixClasses(className, "-add"), options.from);
                    return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), 
                    void animationCompleted());
                },
                beforeRemoveClass: function(element, className, animationCompleted, options) {
                    options = options || {};
                    var cancellationMethod = animateBefore("removeClass", element, suffixClasses(className, "-remove"), options.from);
                    return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), 
                    void animationCompleted());
                },
                setClass: function(element, add, remove, animationCompleted, options) {
                    options = options || {}, remove = suffixClasses(remove, "-remove"), add = suffixClasses(add, "-add");
                    var className = remove + " " + add;
                    return animateAfter("setClass", element, className, animationCompleted, options.to);
                },
                addClass: function(element, className, animationCompleted, options) {
                    return options = options || {}, animateAfter("addClass", element, suffixClasses(className, "-add"), animationCompleted, options.to);
                },
                removeClass: function(element, className, animationCompleted, options) {
                    return options = options || {}, animateAfter("removeClass", element, suffixClasses(className, "-remove"), animationCompleted, options.to);
                }
            };
        } ]);
    } ]);
}(window, window.angular), function(undefined) {
    function dfl(a, b, c) {
        switch (arguments.length) {
          case 2:
            return null != a ? a : b;

          case 3:
            return null != a ? a : null != b ? b : c;

          default:
            throw new Error("Implement me");
        }
    }
    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }
    function defaultParsingFlags() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        };
    }
    function printMsg(msg) {
        moment.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + msg);
    }
    function deprecate(msg, fn) {
        var firstTime = !0;
        return extend(function() {
            return firstTime && (printMsg(msg), firstTime = !1), fn.apply(this, arguments);
        }, fn);
    }
    function deprecateSimple(name, msg) {
        deprecations[name] || (printMsg(msg), deprecations[name] = !0);
    }
    function padToken(func, count) {
        return function(a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function(a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }
    function Locale() {}
    function Moment(config, skipOverflow) {
        skipOverflow !== !1 && checkOverflow(config), copyConfig(this, config), this._d = new Date(+config._d);
    }
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months = normalizedInput.month || 0, weeks = normalizedInput.week || 0, days = normalizedInput.day || 0, hours = normalizedInput.hour || 0, minutes = normalizedInput.minute || 0, seconds = normalizedInput.second || 0, milliseconds = normalizedInput.millisecond || 0;
        this._milliseconds = +milliseconds + 1e3 * seconds + 6e4 * minutes + 36e5 * hours, 
        this._days = +days + 7 * weeks, this._months = +months + 3 * quarters + 12 * years, 
        this._data = {}, this._locale = moment.localeData(), this._bubble();
    }
    function extend(a, b) {
        for (var i in b) hasOwnProp(b, i) && (a[i] = b[i]);
        return hasOwnProp(b, "toString") && (a.toString = b.toString), hasOwnProp(b, "valueOf") && (a.valueOf = b.valueOf), 
        a;
    }
    function copyConfig(to, from) {
        var i, prop, val;
        if ("undefined" != typeof from._isAMomentObject && (to._isAMomentObject = from._isAMomentObject), 
        "undefined" != typeof from._i && (to._i = from._i), "undefined" != typeof from._f && (to._f = from._f), 
        "undefined" != typeof from._l && (to._l = from._l), "undefined" != typeof from._strict && (to._strict = from._strict), 
        "undefined" != typeof from._tzm && (to._tzm = from._tzm), "undefined" != typeof from._isUTC && (to._isUTC = from._isUTC), 
        "undefined" != typeof from._offset && (to._offset = from._offset), "undefined" != typeof from._pf && (to._pf = from._pf), 
        "undefined" != typeof from._locale && (to._locale = from._locale), momentProperties.length > 0) for (i in momentProperties) prop = momentProperties[i], 
        val = from[prop], "undefined" != typeof val && (to[prop] = val);
        return to;
    }
    function absRound(number) {
        return 0 > number ? Math.ceil(number) : Math.floor(number);
    }
    function leftZeroFill(number, targetLength, forceSign) {
        for (var output = "" + Math.abs(number), sign = number >= 0; output.length < targetLength; ) output = "0" + output;
        return (sign ? forceSign ? "+" : "" : "-") + output;
    }
    function positiveMomentsDifference(base, other) {
        var res = {
            milliseconds: 0,
            months: 0
        };
        return res.months = other.month() - base.month() + 12 * (other.year() - base.year()), 
        base.clone().add(res.months, "M").isAfter(other) && --res.months, res.milliseconds = +other - +base.clone().add(res.months, "M"), 
        res;
    }
    function momentsDifference(base, other) {
        var res;
        return other = makeAs(other, base), base.isBefore(other) ? res = positiveMomentsDifference(base, other) : (res = positiveMomentsDifference(other, base), 
        res.milliseconds = -res.milliseconds, res.months = -res.months), res;
    }
    function createAdder(direction, name) {
        return function(val, period) {
            var dur, tmp;
            return null === period || isNaN(+period) || (deprecateSimple(name, "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period)."), 
            tmp = val, val = period, period = tmp), val = "string" == typeof val ? +val : val, 
            dur = moment.duration(val, period), addOrSubtractDurationFromMoment(this, dur, direction), 
            this;
        };
    }
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds, days = duration._days, months = duration._months;
        updateOffset = null == updateOffset ? !0 : updateOffset, milliseconds && mom._d.setTime(+mom._d + milliseconds * isAdding), 
        days && rawSetter(mom, "Date", rawGetter(mom, "Date") + days * isAdding), months && rawMonthSetter(mom, rawGetter(mom, "Month") + months * isAdding), 
        updateOffset && moment.updateOffset(mom, days || months);
    }
    function isArray(input) {
        return "[object Array]" === Object.prototype.toString.call(input);
    }
    function isDate(input) {
        return "[object Date]" === Object.prototype.toString.call(input) || input instanceof Date;
    }
    function compareArrays(array1, array2, dontConvert) {
        var i, len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0;
        for (i = 0; len > i; i++) (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) && diffs++;
        return diffs + lengthDiff;
    }
    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, "$1");
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }
    function normalizeObjectUnits(inputObject) {
        var normalizedProp, prop, normalizedInput = {};
        for (prop in inputObject) hasOwnProp(inputObject, prop) && (normalizedProp = normalizeUnits(prop), 
        normalizedProp && (normalizedInput[normalizedProp] = inputObject[prop]));
        return normalizedInput;
    }
    function makeList(field) {
        var count, setter;
        if (0 === field.indexOf("week")) count = 7, setter = "day"; else {
            if (0 !== field.indexOf("month")) return;
            count = 12, setter = "month";
        }
        moment[field] = function(format, index) {
            var i, getter, method = moment._locale[field], results = [];
            if ("number" == typeof format && (index = format, format = undefined), getter = function(i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || "");
            }, null != index) return getter(index);
            for (i = 0; count > i; i++) results.push(getter(i));
            return results;
        };
    }
    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        return 0 !== coercedNumber && isFinite(coercedNumber) && (value = coercedNumber >= 0 ? Math.floor(coercedNumber) : Math.ceil(coercedNumber)), 
        value;
    }
    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }
    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([ year, 11, 31 + dow - doy ]), dow, doy).week;
    }
    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }
    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
    function checkOverflow(m) {
        var overflow;
        m._a && -2 === m._pf.overflow && (overflow = m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH : m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE : m._a[HOUR] < 0 || m._a[HOUR] > 24 || 24 === m._a[HOUR] && (0 !== m._a[MINUTE] || 0 !== m._a[SECOND] || 0 !== m._a[MILLISECOND]) ? HOUR : m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE : m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND : m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND : -1, 
        m._pf._overflowDayOfYear && (YEAR > overflow || overflow > DATE) && (overflow = DATE), 
        m._pf.overflow = overflow);
    }
    function isValid(m) {
        return null == m._isValid && (m._isValid = !isNaN(m._d.getTime()) && m._pf.overflow < 0 && !m._pf.empty && !m._pf.invalidMonth && !m._pf.nullInput && !m._pf.invalidFormat && !m._pf.userInvalidated, 
        m._strict && (m._isValid = m._isValid && 0 === m._pf.charsLeftOver && 0 === m._pf.unusedTokens.length && m._pf.bigHour === undefined)), 
        m._isValid;
    }
    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace("_", "-") : key;
    }
    function chooseLocale(names) {
        for (var j, next, locale, split, i = 0; i < names.length; ) {
            for (split = normalizeLocale(names[i]).split("-"), j = split.length, next = normalizeLocale(names[i + 1]), 
            next = next ? next.split("-") : null; j > 0; ) {
                if (locale = loadLocale(split.slice(0, j).join("-"))) return locale;
                if (next && next.length >= j && compareArrays(split, next, !0) >= j - 1) break;
                j--;
            }
            i++;
        }
        return null;
    }
    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) try {
            oldLocale = moment.locale(), require("./locale/" + name), moment.locale(oldLocale);
        } catch (e) {}
        return locales[name];
    }
    function makeAs(input, model) {
        var res, diff;
        return model._isUTC ? (res = model.clone(), diff = (moment.isMoment(input) || isDate(input) ? +input : +moment(input)) - +res, 
        res._d.setTime(+res._d + diff), moment.updateOffset(res, !1), res) : moment(input).local();
    }
    function removeFormattingTokens(input) {
        return input.match(/\[[\s\S]/) ? input.replace(/^\[|\]$/g, "") : input.replace(/\\/g, "");
    }
    function makeFormatFunction(format) {
        var i, length, array = format.match(formattingTokens);
        for (i = 0, length = array.length; length > i; i++) array[i] = formatTokenFunctions[array[i]] ? formatTokenFunctions[array[i]] : removeFormattingTokens(array[i]);
        return function(mom) {
            var output = "";
            for (i = 0; length > i; i++) output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            return output;
        };
    }
    function formatMoment(m, format) {
        return m.isValid() ? (format = expandFormat(format, m.localeData()), formatFunctions[format] || (formatFunctions[format] = makeFormatFunction(format)), 
        formatFunctions[format](m)) : m.localeData().invalidDate();
    }
    function expandFormat(format, locale) {
        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }
        var i = 5;
        for (localFormattingTokens.lastIndex = 0; i >= 0 && localFormattingTokens.test(format); ) format = format.replace(localFormattingTokens, replaceLongDateFormatTokens), 
        localFormattingTokens.lastIndex = 0, i -= 1;
        return format;
    }
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
          case "Q":
            return parseTokenOneDigit;

          case "DDDD":
            return parseTokenThreeDigits;

          case "YYYY":
          case "GGGG":
          case "gggg":
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;

          case "Y":
          case "G":
          case "g":
            return parseTokenSignedNumber;

          case "YYYYYY":
          case "YYYYY":
          case "GGGGG":
          case "ggggg":
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;

          case "S":
            if (strict) return parseTokenOneDigit;

          case "SS":
            if (strict) return parseTokenTwoDigits;

          case "SSS":
            if (strict) return parseTokenThreeDigits;

          case "DDD":
            return parseTokenOneToThreeDigits;

          case "MMM":
          case "MMMM":
          case "dd":
          case "ddd":
          case "dddd":
            return parseTokenWord;

          case "a":
          case "A":
            return config._locale._meridiemParse;

          case "x":
            return parseTokenOffsetMs;

          case "X":
            return parseTokenTimestampMs;

          case "Z":
          case "ZZ":
            return parseTokenTimezone;

          case "T":
            return parseTokenT;

          case "SSSS":
            return parseTokenDigits;

          case "MM":
          case "DD":
          case "YY":
          case "GG":
          case "gg":
          case "HH":
          case "hh":
          case "mm":
          case "ss":
          case "ww":
          case "WW":
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;

          case "M":
          case "D":
          case "d":
          case "H":
          case "h":
          case "m":
          case "s":
          case "w":
          case "W":
          case "e":
          case "E":
            return parseTokenOneOrTwoDigits;

          case "Do":
            return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;

          default:
            return a = new RegExp(regexpEscape(unescapeFormat(token.replace("\\", "")), "i"));
        }
    }
    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = string.match(parseTokenTimezone) || [], tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [], parts = (tzChunk + "").match(parseTimezoneChunker) || [ "-", 0, 0 ], minutes = +(60 * parts[1]) + toInt(parts[2]);
        return "+" === parts[0] ? -minutes : minutes;
    }
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;
        switch (token) {
          case "Q":
            null != input && (datePartArray[MONTH] = 3 * (toInt(input) - 1));
            break;

          case "M":
          case "MM":
            null != input && (datePartArray[MONTH] = toInt(input) - 1);
            break;

          case "MMM":
          case "MMMM":
            a = config._locale.monthsParse(input, token, config._strict), null != a ? datePartArray[MONTH] = a : config._pf.invalidMonth = input;
            break;

          case "D":
          case "DD":
            null != input && (datePartArray[DATE] = toInt(input));
            break;

          case "Do":
            null != input && (datePartArray[DATE] = toInt(parseInt(input.match(/\d{1,2}/)[0], 10)));
            break;

          case "DDD":
          case "DDDD":
            null != input && (config._dayOfYear = toInt(input));
            break;

          case "YY":
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;

          case "YYYY":
          case "YYYYY":
          case "YYYYYY":
            datePartArray[YEAR] = toInt(input);
            break;

          case "a":
          case "A":
            config._isPm = config._locale.isPM(input);
            break;

          case "h":
          case "hh":
            config._pf.bigHour = !0;

          case "H":
          case "HH":
            datePartArray[HOUR] = toInt(input);
            break;

          case "m":
          case "mm":
            datePartArray[MINUTE] = toInt(input);
            break;

          case "s":
          case "ss":
            datePartArray[SECOND] = toInt(input);
            break;

          case "S":
          case "SS":
          case "SSS":
          case "SSSS":
            datePartArray[MILLISECOND] = toInt(1e3 * ("0." + input));
            break;

          case "x":
            config._d = new Date(toInt(input));
            break;

          case "X":
            config._d = new Date(1e3 * parseFloat(input));
            break;

          case "Z":
          case "ZZ":
            config._useUTC = !0, config._tzm = timezoneMinutesFromString(input);
            break;

          case "dd":
          case "ddd":
          case "dddd":
            a = config._locale.weekdaysParse(input), null != a ? (config._w = config._w || {}, 
            config._w.d = a) : config._pf.invalidWeekday = input;
            break;

          case "w":
          case "ww":
          case "W":
          case "WW":
          case "d":
          case "e":
          case "E":
            token = token.substr(0, 1);

          case "gggg":
          case "GGGG":
          case "GGGGG":
            token = token.substr(0, 2), input && (config._w = config._w || {}, config._w[token] = toInt(input));
            break;

          case "gg":
          case "GG":
            config._w = config._w || {}, config._w[token] = moment.parseTwoDigitYear(input);
        }
    }
    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;
        w = config._w, null != w.GG || null != w.W || null != w.E ? (dow = 1, doy = 4, weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year), 
        week = dfl(w.W, 1), weekday = dfl(w.E, 1)) : (dow = config._locale._week.dow, doy = config._locale._week.doy, 
        weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year), week = dfl(w.w, 1), 
        null != w.d ? (weekday = w.d, dow > weekday && ++week) : weekday = null != w.e ? w.e + dow : dow), 
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow), config._a[YEAR] = temp.year, 
        config._dayOfYear = temp.dayOfYear;
    }
    function dateFromConfig(config) {
        var i, date, currentDate, yearToUse, input = [];
        if (!config._d) {
            for (currentDate = currentDateArray(config), config._w && null == config._a[DATE] && null == config._a[MONTH] && dayOfYearFromWeekInfo(config), 
            config._dayOfYear && (yearToUse = dfl(config._a[YEAR], currentDate[YEAR]), config._dayOfYear > daysInYear(yearToUse) && (config._pf._overflowDayOfYear = !0), 
            date = makeUTCDate(yearToUse, 0, config._dayOfYear), config._a[MONTH] = date.getUTCMonth(), 
            config._a[DATE] = date.getUTCDate()), i = 0; 3 > i && null == config._a[i]; ++i) config._a[i] = input[i] = currentDate[i];
            for (;7 > i; i++) config._a[i] = input[i] = null == config._a[i] ? 2 === i ? 1 : 0 : config._a[i];
            24 === config._a[HOUR] && 0 === config._a[MINUTE] && 0 === config._a[SECOND] && 0 === config._a[MILLISECOND] && (config._nextDay = !0, 
            config._a[HOUR] = 0), config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input), 
            null != config._tzm && config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm), 
            config._nextDay && (config._a[HOUR] = 24);
        }
    }
    function dateFromObject(config) {
        var normalizedInput;
        config._d || (normalizedInput = normalizeObjectUnits(config._i), config._a = [ normalizedInput.year, normalizedInput.month, normalizedInput.day || normalizedInput.date, normalizedInput.hour, normalizedInput.minute, normalizedInput.second, normalizedInput.millisecond ], 
        dateFromConfig(config));
    }
    function currentDateArray(config) {
        var now = new Date();
        return config._useUTC ? [ now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() ] : [ now.getFullYear(), now.getMonth(), now.getDate() ];
    }
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) return void parseISO(config);
        config._a = [], config._pf.empty = !0;
        var i, parsedInput, tokens, token, skipped, string = "" + config._i, stringLength = string.length, totalParsedInputLength = 0;
        for (tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [], 
        i = 0; i < tokens.length; i++) token = tokens[i], parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0], 
        parsedInput && (skipped = string.substr(0, string.indexOf(parsedInput)), skipped.length > 0 && config._pf.unusedInput.push(skipped), 
        string = string.slice(string.indexOf(parsedInput) + parsedInput.length), totalParsedInputLength += parsedInput.length), 
        formatTokenFunctions[token] ? (parsedInput ? config._pf.empty = !1 : config._pf.unusedTokens.push(token), 
        addTimeToArrayFromToken(token, parsedInput, config)) : config._strict && !parsedInput && config._pf.unusedTokens.push(token);
        config._pf.charsLeftOver = stringLength - totalParsedInputLength, string.length > 0 && config._pf.unusedInput.push(string), 
        config._pf.bigHour === !0 && config._a[HOUR] <= 12 && (config._pf.bigHour = undefined), 
        config._isPm && config._a[HOUR] < 12 && (config._a[HOUR] += 12), config._isPm === !1 && 12 === config._a[HOUR] && (config._a[HOUR] = 0), 
        dateFromConfig(config), checkOverflow(config);
    }
    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function makeDateFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore;
        if (0 === config._f.length) return config._pf.invalidFormat = !0, void (config._d = new Date(0/0));
        for (i = 0; i < config._f.length; i++) currentScore = 0, tempConfig = copyConfig({}, config), 
        null != config._useUTC && (tempConfig._useUTC = config._useUTC), tempConfig._pf = defaultParsingFlags(), 
        tempConfig._f = config._f[i], makeDateFromStringAndFormat(tempConfig), isValid(tempConfig) && (currentScore += tempConfig._pf.charsLeftOver, 
        currentScore += 10 * tempConfig._pf.unusedTokens.length, tempConfig._pf.score = currentScore, 
        (null == scoreToBeat || scoreToBeat > currentScore) && (scoreToBeat = currentScore, 
        bestMoment = tempConfig));
        extend(config, bestMoment || tempConfig);
    }
    function parseISO(config) {
        var i, l, string = config._i, match = isoRegex.exec(string);
        if (match) {
            for (config._pf.iso = !0, i = 0, l = isoDates.length; l > i; i++) if (isoDates[i][1].exec(string)) {
                config._f = isoDates[i][0] + (match[6] || " ");
                break;
            }
            for (i = 0, l = isoTimes.length; l > i; i++) if (isoTimes[i][1].exec(string)) {
                config._f += isoTimes[i][0];
                break;
            }
            string.match(parseTokenTimezone) && (config._f += "Z"), makeDateFromStringAndFormat(config);
        } else config._isValid = !1;
    }
    function makeDateFromString(config) {
        parseISO(config), config._isValid === !1 && (delete config._isValid, moment.createFromInputFallback(config));
    }
    function map(arr, fn) {
        var i, res = [];
        for (i = 0; i < arr.length; ++i) res.push(fn(arr[i], i));
        return res;
    }
    function makeDateFromInput(config) {
        var matched, input = config._i;
        input === undefined ? config._d = new Date() : isDate(input) ? config._d = new Date(+input) : null !== (matched = aspNetJsonRegex.exec(input)) ? config._d = new Date(+matched[1]) : "string" == typeof input ? makeDateFromString(config) : isArray(input) ? (config._a = map(input.slice(0), function(obj) {
            return parseInt(obj, 10);
        }), dateFromConfig(config)) : "object" == typeof input ? dateFromObject(config) : "number" == typeof input ? config._d = new Date(input) : moment.createFromInputFallback(config);
    }
    function makeDate(y, m, d, h, M, s, ms) {
        var date = new Date(y, m, d, h, M, s, ms);
        return 1970 > y && date.setFullYear(y), date;
    }
    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        return 1970 > y && date.setUTCFullYear(y), date;
    }
    function parseWeekday(input, locale) {
        if ("string" == typeof input) if (isNaN(input)) {
            if (input = locale.weekdaysParse(input), "number" != typeof input) return null;
        } else input = parseInt(input, 10);
        return input;
    }
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }
    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(), seconds = round(duration.as("s")), minutes = round(duration.as("m")), hours = round(duration.as("h")), days = round(duration.as("d")), months = round(duration.as("M")), years = round(duration.as("y")), args = seconds < relativeTimeThresholds.s && [ "s", seconds ] || 1 === minutes && [ "m" ] || minutes < relativeTimeThresholds.m && [ "mm", minutes ] || 1 === hours && [ "h" ] || hours < relativeTimeThresholds.h && [ "hh", hours ] || 1 === days && [ "d" ] || days < relativeTimeThresholds.d && [ "dd", days ] || 1 === months && [ "M" ] || months < relativeTimeThresholds.M && [ "MM", months ] || 1 === years && [ "y" ] || [ "yy", years ];
        return args[2] = withoutSuffix, args[3] = +posNegDuration > 0, args[4] = locale, 
        substituteTimeAgo.apply({}, args);
    }
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var adjustedMoment, end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();
        return daysToDayOfWeek > end && (daysToDayOfWeek -= 7), end - 7 > daysToDayOfWeek && (daysToDayOfWeek += 7), 
        adjustedMoment = moment(mom).add(daysToDayOfWeek, "d"), {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var daysToAdd, dayOfYear, d = makeUTCDate(year, 0, 1).getUTCDay();
        return d = 0 === d ? 7 : d, weekday = null != weekday ? weekday : firstDayOfWeek, 
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (firstDayOfWeek > d ? 7 : 0), 
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1, {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }
    function makeMoment(config) {
        var res, input = config._i, format = config._f;
        return config._locale = config._locale || moment.localeData(config._l), null === input || format === undefined && "" === input ? moment.invalid({
            nullInput: !0
        }) : ("string" == typeof input && (config._i = input = config._locale.preparse(input)), 
        moment.isMoment(input) ? new Moment(input, !0) : (format ? isArray(format) ? makeDateFromStringAndArray(config) : makeDateFromStringAndFormat(config) : makeDateFromInput(config), 
        res = new Moment(config), res._nextDay && (res.add(1, "d"), res._nextDay = undefined), 
        res));
    }
    function pickBy(fn, moments) {
        var res, i;
        if (1 === moments.length && isArray(moments[0]) && (moments = moments[0]), !moments.length) return moment();
        for (res = moments[0], i = 1; i < moments.length; ++i) moments[i][fn](res) && (res = moments[i]);
        return res;
    }
    function rawMonthSetter(mom, value) {
        var dayOfMonth;
        return "string" == typeof value && (value = mom.localeData().monthsParse(value), 
        "number" != typeof value) ? mom : (dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value)), 
        mom._d["set" + (mom._isUTC ? "UTC" : "") + "Month"](value, dayOfMonth), mom);
    }
    function rawGetter(mom, unit) {
        return mom._d["get" + (mom._isUTC ? "UTC" : "") + unit]();
    }
    function rawSetter(mom, unit, value) {
        return "Month" === unit ? rawMonthSetter(mom, value) : mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value);
    }
    function makeAccessor(unit, keepTime) {
        return function(value) {
            return null != value ? (rawSetter(this, unit, value), moment.updateOffset(this, keepTime), 
            this) : rawGetter(this, unit);
        };
    }
    function daysToYears(days) {
        return 400 * days / 146097;
    }
    function yearsToDays(years) {
        return 146097 * years / 400;
    }
    function makeDurationGetter(name) {
        moment.duration.fn[name] = function() {
            return this._data[name];
        };
    }
    function makeGlobal(shouldDeprecate) {
        "undefined" == typeof ender && (oldGlobalMoment = globalScope.moment, globalScope.moment = shouldDeprecate ? deprecate("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", moment) : moment);
    }
    for (var moment, oldGlobalMoment, i, VERSION = "2.8.4", globalScope = "undefined" != typeof global ? global : this, round = Math.round, hasOwnProperty = Object.prototype.hasOwnProperty, YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, locales = {}, momentProperties = [], hasModule = "undefined" != typeof module && module && module.exports, aspNetJsonRegex = /^\/?Date\((\-?\d+)/i, aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, parseTokenOneOrTwoDigits = /\d\d?/, parseTokenOneToThreeDigits = /\d{1,3}/, parseTokenOneToFourDigits = /\d{1,4}/, parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, parseTokenDigits = /\d+/, parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, parseTokenT = /T/i, parseTokenOffsetMs = /[\+\-]?\d+/, parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, parseTokenOneDigit = /\d/, parseTokenTwoDigits = /\d\d/, parseTokenThreeDigits = /\d{3}/, parseTokenFourDigits = /\d{4}/, parseTokenSixDigits = /[+-]?\d{6}/, parseTokenSignedNumber = /[+-]?\d+/, isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, isoFormat = "YYYY-MM-DDTHH:mm:ssZ", isoDates = [ [ "YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/ ], [ "YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/ ], [ "GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/ ], [ "GGGG-[W]WW", /\d{4}-W\d{2}/ ], [ "YYYY-DDD", /\d{4}-\d{3}/ ] ], isoTimes = [ [ "HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/ ], [ "HH:mm:ss", /(T| )\d\d:\d\d:\d\d/ ], [ "HH:mm", /(T| )\d\d:\d\d/ ], [ "HH", /(T| )\d\d/ ] ], parseTimezoneChunker = /([\+\-]|\d\d)/gi, unitMillisecondFactors = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"), 
    {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }), unitAliases = {
        ms: "millisecond",
        s: "second",
        m: "minute",
        h: "hour",
        d: "day",
        D: "date",
        w: "week",
        W: "isoWeek",
        M: "month",
        Q: "quarter",
        y: "year",
        DDD: "dayOfYear",
        e: "weekday",
        E: "isoWeekday",
        gg: "weekYear",
        GG: "isoWeekYear"
    }, camelFunctions = {
        dayofyear: "dayOfYear",
        isoweekday: "isoWeekday",
        isoweek: "isoWeek",
        weekyear: "weekYear",
        isoweekyear: "isoWeekYear"
    }, formatFunctions = {}, relativeTimeThresholds = {
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    }, ordinalizeTokens = "DDD w W M D d".split(" "), paddedTokens = "M D H h m s w W".split(" "), formatTokenFunctions = {
        M: function() {
            return this.month() + 1;
        },
        MMM: function(format) {
            return this.localeData().monthsShort(this, format);
        },
        MMMM: function(format) {
            return this.localeData().months(this, format);
        },
        D: function() {
            return this.date();
        },
        DDD: function() {
            return this.dayOfYear();
        },
        d: function() {
            return this.day();
        },
        dd: function(format) {
            return this.localeData().weekdaysMin(this, format);
        },
        ddd: function(format) {
            return this.localeData().weekdaysShort(this, format);
        },
        dddd: function(format) {
            return this.localeData().weekdays(this, format);
        },
        w: function() {
            return this.week();
        },
        W: function() {
            return this.isoWeek();
        },
        YY: function() {
            return leftZeroFill(this.year() % 100, 2);
        },
        YYYY: function() {
            return leftZeroFill(this.year(), 4);
        },
        YYYYY: function() {
            return leftZeroFill(this.year(), 5);
        },
        YYYYYY: function() {
            var y = this.year(), sign = y >= 0 ? "+" : "-";
            return sign + leftZeroFill(Math.abs(y), 6);
        },
        gg: function() {
            return leftZeroFill(this.weekYear() % 100, 2);
        },
        gggg: function() {
            return leftZeroFill(this.weekYear(), 4);
        },
        ggggg: function() {
            return leftZeroFill(this.weekYear(), 5);
        },
        GG: function() {
            return leftZeroFill(this.isoWeekYear() % 100, 2);
        },
        GGGG: function() {
            return leftZeroFill(this.isoWeekYear(), 4);
        },
        GGGGG: function() {
            return leftZeroFill(this.isoWeekYear(), 5);
        },
        e: function() {
            return this.weekday();
        },
        E: function() {
            return this.isoWeekday();
        },
        a: function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), !0);
        },
        A: function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), !1);
        },
        H: function() {
            return this.hours();
        },
        h: function() {
            return this.hours() % 12 || 12;
        },
        m: function() {
            return this.minutes();
        },
        s: function() {
            return this.seconds();
        },
        S: function() {
            return toInt(this.milliseconds() / 100);
        },
        SS: function() {
            return leftZeroFill(toInt(this.milliseconds() / 10), 2);
        },
        SSS: function() {
            return leftZeroFill(this.milliseconds(), 3);
        },
        SSSS: function() {
            return leftZeroFill(this.milliseconds(), 3);
        },
        Z: function() {
            var a = -this.zone(), b = "+";
            return 0 > a && (a = -a, b = "-"), b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
        },
        ZZ: function() {
            var a = -this.zone(), b = "+";
            return 0 > a && (a = -a, b = "-"), b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
        },
        z: function() {
            return this.zoneAbbr();
        },
        zz: function() {
            return this.zoneName();
        },
        x: function() {
            return this.valueOf();
        },
        X: function() {
            return this.unix();
        },
        Q: function() {
            return this.quarter();
        }
    }, deprecations = {}, lists = [ "months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin" ]; ordinalizeTokens.length; ) i = ordinalizeTokens.pop(), 
    formatTokenFunctions[i + "o"] = ordinalizeToken(formatTokenFunctions[i], i);
    for (;paddedTokens.length; ) i = paddedTokens.pop(), formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3), extend(Locale.prototype, {
        set: function(config) {
            var prop, i;
            for (i in config) prop = config[i], "function" == typeof prop ? this[i] = prop : this["_" + i] = prop;
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source);
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(m) {
            return this._months[m.month()];
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(m) {
            return this._monthsShort[m.month()];
        },
        monthsParse: function(monthName, format, strict) {
            var i, mom, regex;
            for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), 
            i = 0; 12 > i; i++) {
                if (mom = moment.utc([ 2e3, i ]), strict && !this._longMonthsParse[i] && (this._longMonthsParse[i] = new RegExp("^" + this.months(mom, "").replace(".", "") + "$", "i"), 
                this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(mom, "").replace(".", "") + "$", "i")), 
                strict || this._monthsParse[i] || (regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, ""), 
                this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i")), strict && "MMMM" === format && this._longMonthsParse[i].test(monthName)) return i;
                if (strict && "MMM" === format && this._shortMonthsParse[i].test(monthName)) return i;
                if (!strict && this._monthsParse[i].test(monthName)) return i;
            }
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(m) {
            return this._weekdays[m.day()];
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(m) {
            return this._weekdaysShort[m.day()];
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(m) {
            return this._weekdaysMin[m.day()];
        },
        weekdaysParse: function(weekdayName) {
            var i, mom, regex;
            for (this._weekdaysParse || (this._weekdaysParse = []), i = 0; 7 > i; i++) if (this._weekdaysParse[i] || (mom = moment([ 2e3, 1 ]).day(i), 
            regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, ""), 
            this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i")), this._weekdaysParse[i].test(weekdayName)) return i;
        },
        _longDateFormat: {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY LT",
            LLLL: "dddd, MMMM D, YYYY LT"
        },
        longDateFormat: function(key) {
            var output = this._longDateFormat[key];
            return !output && this._longDateFormat[key.toUpperCase()] && (output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(val) {
                return val.slice(1);
            }), this._longDateFormat[key] = output), output;
        },
        isPM: function(input) {
            return "p" === (input + "").toLowerCase().charAt(0);
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function(hours, minutes, isLower) {
            return hours > 11 ? isLower ? "pm" : "PM" : isLower ? "am" : "AM";
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(key, mom, now) {
            var output = this._calendar[key];
            return "function" == typeof output ? output.apply(mom, [ now ]) : output;
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return "function" == typeof output ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
        },
        pastFuture: function(diff, output) {
            var format = this._relativeTime[diff > 0 ? "future" : "past"];
            return "function" == typeof format ? format(output) : format.replace(/%s/i, output);
        },
        ordinal: function(number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal: "%d",
        _ordinalParse: /\d{1,2}/,
        preparse: function(string) {
            return string;
        },
        postformat: function(string) {
            return string;
        },
        week: function(mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },
        _week: {
            dow: 0,
            doy: 6
        },
        _invalidDate: "Invalid date",
        invalidDate: function() {
            return this._invalidDate;
        }
    }), moment = function(input, format, locale, strict) {
        var c;
        return "boolean" == typeof locale && (strict = locale, locale = undefined), c = {}, 
        c._isAMomentObject = !0, c._i = input, c._f = format, c._l = locale, c._strict = strict, 
        c._isUTC = !1, c._pf = defaultParsingFlags(), makeMoment(c);
    }, moment.suppressDeprecationWarnings = !1, moment.createFromInputFallback = deprecate("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(config) {
        config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
    }), moment.min = function() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isBefore", args);
    }, moment.max = function() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isAfter", args);
    }, moment.utc = function(input, format, locale, strict) {
        var c;
        return "boolean" == typeof locale && (strict = locale, locale = undefined), c = {}, 
        c._isAMomentObject = !0, c._useUTC = !0, c._isUTC = !0, c._l = locale, c._i = input, 
        c._f = format, c._strict = strict, c._pf = defaultParsingFlags(), makeMoment(c).utc();
    }, moment.unix = function(input) {
        return moment(1e3 * input);
    }, moment.duration = function(input, key) {
        var sign, ret, parseIso, diffRes, duration = input, match = null;
        return moment.isDuration(input) ? duration = {
            ms: input._milliseconds,
            d: input._days,
            M: input._months
        } : "number" == typeof input ? (duration = {}, key ? duration[key] = input : duration.milliseconds = input) : (match = aspNetTimeSpanJsonRegex.exec(input)) ? (sign = "-" === match[1] ? -1 : 1, 
        duration = {
            y: 0,
            d: toInt(match[DATE]) * sign,
            h: toInt(match[HOUR]) * sign,
            m: toInt(match[MINUTE]) * sign,
            s: toInt(match[SECOND]) * sign,
            ms: toInt(match[MILLISECOND]) * sign
        }) : (match = isoDurationRegex.exec(input)) ? (sign = "-" === match[1] ? -1 : 1, 
        parseIso = function(inp) {
            var res = inp && parseFloat(inp.replace(",", "."));
            return (isNaN(res) ? 0 : res) * sign;
        }, duration = {
            y: parseIso(match[2]),
            M: parseIso(match[3]),
            d: parseIso(match[4]),
            h: parseIso(match[5]),
            m: parseIso(match[6]),
            s: parseIso(match[7]),
            w: parseIso(match[8])
        }) : "object" == typeof duration && ("from" in duration || "to" in duration) && (diffRes = momentsDifference(moment(duration.from), moment(duration.to)), 
        duration = {}, duration.ms = diffRes.milliseconds, duration.M = diffRes.months), 
        ret = new Duration(duration), moment.isDuration(input) && hasOwnProp(input, "_locale") && (ret._locale = input._locale), 
        ret;
    }, moment.version = VERSION, moment.defaultFormat = isoFormat, moment.ISO_8601 = function() {}, 
    moment.momentProperties = momentProperties, moment.updateOffset = function() {}, 
    moment.relativeTimeThreshold = function(threshold, limit) {
        return relativeTimeThresholds[threshold] === undefined ? !1 : limit === undefined ? relativeTimeThresholds[threshold] : (relativeTimeThresholds[threshold] = limit, 
        !0);
    }, moment.lang = deprecate("moment.lang is deprecated. Use moment.locale instead.", function(key, value) {
        return moment.locale(key, value);
    }), moment.locale = function(key, values) {
        var data;
        return key && (data = "undefined" != typeof values ? moment.defineLocale(key, values) : moment.localeData(key), 
        data && (moment.duration._locale = moment._locale = data)), moment._locale._abbr;
    }, moment.defineLocale = function(name, values) {
        return null !== values ? (values.abbr = name, locales[name] || (locales[name] = new Locale()), 
        locales[name].set(values), moment.locale(name), locales[name]) : (delete locales[name], 
        null);
    }, moment.langData = deprecate("moment.langData is deprecated. Use moment.localeData instead.", function(key) {
        return moment.localeData(key);
    }), moment.localeData = function(key) {
        var locale;
        if (key && key._locale && key._locale._abbr && (key = key._locale._abbr), !key) return moment._locale;
        if (!isArray(key)) {
            if (locale = loadLocale(key)) return locale;
            key = [ key ];
        }
        return chooseLocale(key);
    }, moment.isMoment = function(obj) {
        return obj instanceof Moment || null != obj && hasOwnProp(obj, "_isAMomentObject");
    }, moment.isDuration = function(obj) {
        return obj instanceof Duration;
    };
    for (i = lists.length - 1; i >= 0; --i) makeList(lists[i]);
    moment.normalizeUnits = function(units) {
        return normalizeUnits(units);
    }, moment.invalid = function(flags) {
        var m = moment.utc(0/0);
        return null != flags ? extend(m._pf, flags) : m._pf.userInvalidated = !0, m;
    }, moment.parseZone = function() {
        return moment.apply(null, arguments).parseZone();
    }, moment.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
    }, extend(moment.fn = Moment.prototype, {
        clone: function() {
            return moment(this);
        },
        valueOf: function() {
            return +this._d + 6e4 * (this._offset || 0);
        },
        unix: function() {
            return Math.floor(+this / 1e3);
        },
        toString: function() {
            return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },
        toDate: function() {
            return this._offset ? new Date(+this) : this._d;
        },
        toISOString: function() {
            var m = moment(this).utc();
            return 0 < m.year() && m.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : formatMoment(m, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : formatMoment(m, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
        },
        toArray: function() {
            var m = this;
            return [ m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds() ];
        },
        isValid: function() {
            return isValid(this);
        },
        isDSTShifted: function() {
            return this._a ? this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0 : !1;
        },
        parsingFlags: function() {
            return extend({}, this._pf);
        },
        invalidAt: function() {
            return this._pf.overflow;
        },
        utc: function(keepLocalTime) {
            return this.zone(0, keepLocalTime);
        },
        local: function(keepLocalTime) {
            return this._isUTC && (this.zone(0, keepLocalTime), this._isUTC = !1, keepLocalTime && this.add(this._dateTzOffset(), "m")), 
            this;
        },
        format: function(inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },
        add: createAdder(1, "add"),
        subtract: createAdder(-1, "subtract"),
        diff: function(input, units, asFloat) {
            var diff, output, daysAdjust, that = makeAs(input, this), zoneDiff = 6e4 * (this.zone() - that.zone());
            return units = normalizeUnits(units), "year" === units || "month" === units ? (diff = 432e5 * (this.daysInMonth() + that.daysInMonth()), 
            output = 12 * (this.year() - that.year()) + (this.month() - that.month()), daysAdjust = this - moment(this).startOf("month") - (that - moment(that).startOf("month")), 
            daysAdjust -= 6e4 * (this.zone() - moment(this).startOf("month").zone() - (that.zone() - moment(that).startOf("month").zone())), 
            output += daysAdjust / diff, "year" === units && (output /= 12)) : (diff = this - that, 
            output = "second" === units ? diff / 1e3 : "minute" === units ? diff / 6e4 : "hour" === units ? diff / 36e5 : "day" === units ? (diff - zoneDiff) / 864e5 : "week" === units ? (diff - zoneDiff) / 6048e5 : diff), 
            asFloat ? output : absRound(output);
        },
        from: function(time, withoutSuffix) {
            return moment.duration({
                to: this,
                from: time
            }).locale(this.locale()).humanize(!withoutSuffix);
        },
        fromNow: function(withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },
        calendar: function(time) {
            var now = time || moment(), sod = makeAs(now, this).startOf("day"), diff = this.diff(sod, "days", !0), format = -6 > diff ? "sameElse" : -1 > diff ? "lastWeek" : 0 > diff ? "lastDay" : 1 > diff ? "sameDay" : 2 > diff ? "nextDay" : 7 > diff ? "nextWeek" : "sameElse";
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },
        isLeapYear: function() {
            return isLeapYear(this.year());
        },
        isDST: function() {
            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone();
        },
        day: function(input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != input ? (input = parseWeekday(input, this.localeData()), this.add(input - day, "d")) : day;
        },
        month: makeAccessor("Month", !0),
        startOf: function(units) {
            switch (units = normalizeUnits(units)) {
              case "year":
                this.month(0);

              case "quarter":
              case "month":
                this.date(1);

              case "week":
              case "isoWeek":
              case "day":
                this.hours(0);

              case "hour":
                this.minutes(0);

              case "minute":
                this.seconds(0);

              case "second":
                this.milliseconds(0);
            }
            return "week" === units ? this.weekday(0) : "isoWeek" === units && this.isoWeekday(1), 
            "quarter" === units && this.month(3 * Math.floor(this.month() / 3)), this;
        },
        endOf: function(units) {
            return units = normalizeUnits(units), units === undefined || "millisecond" === units ? this : this.startOf(units).add(1, "isoWeek" === units ? "week" : units).subtract(1, "ms");
        },
        isAfter: function(input, units) {
            var inputMs;
            return units = normalizeUnits("undefined" != typeof units ? units : "millisecond"), 
            "millisecond" === units ? (input = moment.isMoment(input) ? input : moment(input), 
            +this > +input) : (inputMs = moment.isMoment(input) ? +input : +moment(input), inputMs < +this.clone().startOf(units));
        },
        isBefore: function(input, units) {
            var inputMs;
            return units = normalizeUnits("undefined" != typeof units ? units : "millisecond"), 
            "millisecond" === units ? (input = moment.isMoment(input) ? input : moment(input), 
            +input > +this) : (inputMs = moment.isMoment(input) ? +input : +moment(input), +this.clone().endOf(units) < inputMs);
        },
        isSame: function(input, units) {
            var inputMs;
            return units = normalizeUnits(units || "millisecond"), "millisecond" === units ? (input = moment.isMoment(input) ? input : moment(input), 
            +this === +input) : (inputMs = +moment(input), +this.clone().startOf(units) <= inputMs && inputMs <= +this.clone().endOf(units));
        },
        min: deprecate("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function(other) {
            return other = moment.apply(null, arguments), this > other ? this : other;
        }),
        max: deprecate("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function(other) {
            return other = moment.apply(null, arguments), other > this ? this : other;
        }),
        zone: function(input, keepLocalTime) {
            var localAdjust, offset = this._offset || 0;
            return null == input ? this._isUTC ? offset : this._dateTzOffset() : ("string" == typeof input && (input = timezoneMinutesFromString(input)), 
            Math.abs(input) < 16 && (input = 60 * input), !this._isUTC && keepLocalTime && (localAdjust = this._dateTzOffset()), 
            this._offset = input, this._isUTC = !0, null != localAdjust && this.subtract(localAdjust, "m"), 
            offset !== input && (!keepLocalTime || this._changeInProgress ? addOrSubtractDurationFromMoment(this, moment.duration(offset - input, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, 
            moment.updateOffset(this, !0), this._changeInProgress = null)), this);
        },
        zoneAbbr: function() {
            return this._isUTC ? "UTC" : "";
        },
        zoneName: function() {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },
        parseZone: function() {
            return this._tzm ? this.zone(this._tzm) : "string" == typeof this._i && this.zone(this._i), 
            this;
        },
        hasAlignedHourOffset: function(input) {
            return input = input ? moment(input).zone() : 0, (this.zone() - input) % 60 === 0;
        },
        daysInMonth: function() {
            return daysInMonth(this.year(), this.month());
        },
        dayOfYear: function(input) {
            var dayOfYear = round((moment(this).startOf("day") - moment(this).startOf("year")) / 864e5) + 1;
            return null == input ? dayOfYear : this.add(input - dayOfYear, "d");
        },
        quarter: function(input) {
            return null == input ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (input - 1) + this.month() % 3);
        },
        weekYear: function(input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return null == input ? year : this.add(input - year, "y");
        },
        isoWeekYear: function(input) {
            var year = weekOfYear(this, 1, 4).year;
            return null == input ? year : this.add(input - year, "y");
        },
        week: function(input) {
            var week = this.localeData().week(this);
            return null == input ? week : this.add(7 * (input - week), "d");
        },
        isoWeek: function(input) {
            var week = weekOfYear(this, 1, 4).week;
            return null == input ? week : this.add(7 * (input - week), "d");
        },
        weekday: function(input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return null == input ? weekday : this.add(input - weekday, "d");
        },
        isoWeekday: function(input) {
            return null == input ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },
        isoWeeksInYear: function() {
            return weeksInYear(this.year(), 1, 4);
        },
        weeksInYear: function() {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },
        get: function(units) {
            return units = normalizeUnits(units), this[units]();
        },
        set: function(units, value) {
            return units = normalizeUnits(units), "function" == typeof this[units] && this[units](value), 
            this;
        },
        locale: function(key) {
            var newLocaleData;
            return key === undefined ? this._locale._abbr : (newLocaleData = moment.localeData(key), 
            null != newLocaleData && (this._locale = newLocaleData), this);
        },
        lang: deprecate("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(key) {
            return key === undefined ? this.localeData() : this.locale(key);
        }),
        localeData: function() {
            return this._locale;
        },
        _dateTzOffset: function() {
            return 15 * Math.round(this._d.getTimezoneOffset() / 15);
        }
    }), moment.fn.millisecond = moment.fn.milliseconds = makeAccessor("Milliseconds", !1), 
    moment.fn.second = moment.fn.seconds = makeAccessor("Seconds", !1), moment.fn.minute = moment.fn.minutes = makeAccessor("Minutes", !1), 
    moment.fn.hour = moment.fn.hours = makeAccessor("Hours", !0), moment.fn.date = makeAccessor("Date", !0), 
    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor("Date", !0)), 
    moment.fn.year = makeAccessor("FullYear", !0), moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor("FullYear", !0)), 
    moment.fn.days = moment.fn.day, moment.fn.months = moment.fn.month, moment.fn.weeks = moment.fn.week, 
    moment.fn.isoWeeks = moment.fn.isoWeek, moment.fn.quarters = moment.fn.quarter, 
    moment.fn.toJSON = moment.fn.toISOString, extend(moment.duration.fn = Duration.prototype, {
        _bubble: function() {
            var seconds, minutes, hours, milliseconds = this._milliseconds, days = this._days, months = this._months, data = this._data, years = 0;
            data.milliseconds = milliseconds % 1e3, seconds = absRound(milliseconds / 1e3), 
            data.seconds = seconds % 60, minutes = absRound(seconds / 60), data.minutes = minutes % 60, 
            hours = absRound(minutes / 60), data.hours = hours % 24, days += absRound(hours / 24), 
            years = absRound(daysToYears(days)), days -= absRound(yearsToDays(years)), months += absRound(days / 30), 
            days %= 30, years += absRound(months / 12), months %= 12, data.days = days, data.months = months, 
            data.years = years;
        },
        abs: function() {
            return this._milliseconds = Math.abs(this._milliseconds), this._days = Math.abs(this._days), 
            this._months = Math.abs(this._months), this._data.milliseconds = Math.abs(this._data.milliseconds), 
            this._data.seconds = Math.abs(this._data.seconds), this._data.minutes = Math.abs(this._data.minutes), 
            this._data.hours = Math.abs(this._data.hours), this._data.months = Math.abs(this._data.months), 
            this._data.years = Math.abs(this._data.years), this;
        },
        weeks: function() {
            return absRound(this.days() / 7);
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * toInt(this._months / 12);
        },
        humanize: function(withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());
            return withSuffix && (output = this.localeData().pastFuture(+this, output)), this.localeData().postformat(output);
        },
        add: function(input, val) {
            var dur = moment.duration(input, val);
            return this._milliseconds += dur._milliseconds, this._days += dur._days, this._months += dur._months, 
            this._bubble(), this;
        },
        subtract: function(input, val) {
            var dur = moment.duration(input, val);
            return this._milliseconds -= dur._milliseconds, this._days -= dur._days, this._months -= dur._months, 
            this._bubble(), this;
        },
        get: function(units) {
            return units = normalizeUnits(units), this[units.toLowerCase() + "s"]();
        },
        as: function(units) {
            var days, months;
            if (units = normalizeUnits(units), "month" === units || "year" === units) return days = this._days + this._milliseconds / 864e5, 
            months = this._months + 12 * daysToYears(days), "month" === units ? months : months / 12;
            switch (days = this._days + Math.round(yearsToDays(this._months / 12)), units) {
              case "week":
                return days / 7 + this._milliseconds / 6048e5;

              case "day":
                return days + this._milliseconds / 864e5;

              case "hour":
                return 24 * days + this._milliseconds / 36e5;

              case "minute":
                return 24 * days * 60 + this._milliseconds / 6e4;

              case "second":
                return 24 * days * 60 * 60 + this._milliseconds / 1e3;

              case "millisecond":
                return Math.floor(24 * days * 60 * 60 * 1e3) + this._milliseconds;

              default:
                throw new Error("Unknown unit " + units);
            }
        },
        lang: moment.fn.lang,
        locale: moment.fn.locale,
        toIsoString: deprecate("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", function() {
            return this.toISOString();
        }),
        toISOString: function() {
            var years = Math.abs(this.years()), months = Math.abs(this.months()), days = Math.abs(this.days()), hours = Math.abs(this.hours()), minutes = Math.abs(this.minutes()), seconds = Math.abs(this.seconds() + this.milliseconds() / 1e3);
            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (years ? years + "Y" : "") + (months ? months + "M" : "") + (days ? days + "D" : "") + (hours || minutes || seconds ? "T" : "") + (hours ? hours + "H" : "") + (minutes ? minutes + "M" : "") + (seconds ? seconds + "S" : "") : "P0D";
        },
        localeData: function() {
            return this._locale;
        }
    }), moment.duration.fn.toString = moment.duration.fn.toISOString;
    for (i in unitMillisecondFactors) hasOwnProp(unitMillisecondFactors, i) && makeDurationGetter(i.toLowerCase());
    moment.duration.fn.asMilliseconds = function() {
        return this.as("ms");
    }, moment.duration.fn.asSeconds = function() {
        return this.as("s");
    }, moment.duration.fn.asMinutes = function() {
        return this.as("m");
    }, moment.duration.fn.asHours = function() {
        return this.as("h");
    }, moment.duration.fn.asDays = function() {
        return this.as("d");
    }, moment.duration.fn.asWeeks = function() {
        return this.as("weeks");
    }, moment.duration.fn.asMonths = function() {
        return this.as("M");
    }, moment.duration.fn.asYears = function() {
        return this.as("y");
    }, moment.locale("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
            var b = number % 10, output = 1 === toInt(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return number + output;
        }
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("af", {
            months: "Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),
            weekdaysShort: "Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),
            weekdaysMin: "So_Ma_Di_Wo_Do_Vr_Sa".split("_"),
            meridiem: function(hours, minutes, isLower) {
                return 12 > hours ? isLower ? "vm" : "VM" : isLower ? "nm" : "NM";
            },
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Vandag om] LT",
                nextDay: "[Môre om] LT",
                nextWeek: "dddd [om] LT",
                lastDay: "[Gister om] LT",
                lastWeek: "[Laas] dddd [om] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "oor %s",
                past: "%s gelede",
                s: "'n paar sekondes",
                m: "'n minuut",
                mm: "%d minute",
                h: "'n uur",
                hh: "%d ure",
                d: "'n dag",
                dd: "%d dae",
                M: "'n maand",
                MM: "%d maande",
                y: "'n jaar",
                yy: "%d jaar"
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function(number) {
                return number + (1 === number || 8 === number || number >= 20 ? "ste" : "de");
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("ar-ma", {
            months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            weekdays: "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {
                dow: 6,
                doy: 12
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "١",
            "2": "٢",
            "3": "٣",
            "4": "٤",
            "5": "٥",
            "6": "٦",
            "7": "٧",
            "8": "٨",
            "9": "٩",
            "0": "٠"
        }, numberMap = {
            "١": "1",
            "٢": "2",
            "٣": "3",
            "٤": "4",
            "٥": "5",
            "٦": "6",
            "٧": "7",
            "٨": "8",
            "٩": "9",
            "٠": "0"
        };
        return moment.defineLocale("ar-sa", {
            months: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            meridiem: function(hour) {
                return 12 > hour ? "ص" : "م";
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            preparse: function(string) {
                return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function(match) {
                    return numberMap[match];
                }).replace(/،/g, ",");
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                }).replace(/,/g, "،");
            },
            week: {
                dow: 6,
                doy: 12
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "١",
            "2": "٢",
            "3": "٣",
            "4": "٤",
            "5": "٥",
            "6": "٦",
            "7": "٧",
            "8": "٨",
            "9": "٩",
            "0": "٠"
        }, numberMap = {
            "١": "1",
            "٢": "2",
            "٣": "3",
            "٤": "4",
            "٥": "5",
            "٦": "6",
            "٧": "7",
            "٨": "8",
            "٩": "9",
            "٠": "0"
        }, pluralForm = function(n) {
            return 0 === n ? 0 : 1 === n ? 1 : 2 === n ? 2 : n % 100 >= 3 && 10 >= n % 100 ? 3 : n % 100 >= 11 ? 4 : 5;
        }, plurals = {
            s: [ "أقل من ثانية", "ثانية واحدة", [ "ثانيتان", "ثانيتين" ], "%d ثوان", "%d ثانية", "%d ثانية" ],
            m: [ "أقل من دقيقة", "دقيقة واحدة", [ "دقيقتان", "دقيقتين" ], "%d دقائق", "%d دقيقة", "%d دقيقة" ],
            h: [ "أقل من ساعة", "ساعة واحدة", [ "ساعتان", "ساعتين" ], "%d ساعات", "%d ساعة", "%d ساعة" ],
            d: [ "أقل من يوم", "يوم واحد", [ "يومان", "يومين" ], "%d أيام", "%d يومًا", "%d يوم" ],
            M: [ "أقل من شهر", "شهر واحد", [ "شهران", "شهرين" ], "%d أشهر", "%d شهرا", "%d شهر" ],
            y: [ "أقل من عام", "عام واحد", [ "عامان", "عامين" ], "%d أعوام", "%d عامًا", "%d عام" ]
        }, pluralize = function(u) {
            return function(number, withoutSuffix) {
                var f = pluralForm(number), str = plurals[u][pluralForm(number)];
                return 2 === f && (str = str[withoutSuffix ? 0 : 1]), str.replace(/%d/i, number);
            };
        }, months = [ "كانون الثاني يناير", "شباط فبراير", "آذار مارس", "نيسان أبريل", "أيار مايو", "حزيران يونيو", "تموز يوليو", "آب أغسطس", "أيلول سبتمبر", "تشرين الأول أكتوبر", "تشرين الثاني نوفمبر", "كانون الأول ديسمبر" ];
        return moment.defineLocale("ar", {
            months: months,
            monthsShort: months,
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            meridiem: function(hour) {
                return 12 > hour ? "ص" : "م";
            },
            calendar: {
                sameDay: "[اليوم عند الساعة] LT",
                nextDay: "[غدًا عند الساعة] LT",
                nextWeek: "dddd [عند الساعة] LT",
                lastDay: "[أمس عند الساعة] LT",
                lastWeek: "dddd [عند الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "بعد %s",
                past: "منذ %s",
                s: pluralize("s"),
                m: pluralize("m"),
                mm: pluralize("m"),
                h: pluralize("h"),
                hh: pluralize("h"),
                d: pluralize("d"),
                dd: pluralize("d"),
                M: pluralize("M"),
                MM: pluralize("M"),
                y: pluralize("y"),
                yy: pluralize("y")
            },
            preparse: function(string) {
                return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function(match) {
                    return numberMap[match];
                }).replace(/،/g, ",");
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                }).replace(/,/g, "،");
            },
            week: {
                dow: 6,
                doy: 12
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var suffixes = {
            1: "-inci",
            5: "-inci",
            8: "-inci",
            70: "-inci",
            80: "-inci",
            2: "-nci",
            7: "-nci",
            20: "-nci",
            50: "-nci",
            3: "-üncü",
            4: "-üncü",
            100: "-üncü",
            6: "-ncı",
            9: "-uncu",
            10: "-uncu",
            30: "-uncu",
            60: "-ıncı",
            90: "-ıncı"
        };
        return moment.defineLocale("az", {
            months: "yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),
            monthsShort: "yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),
            weekdays: "Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),
            weekdaysShort: "Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),
            weekdaysMin: "Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[bugün saat] LT",
                nextDay: "[sabah saat] LT",
                nextWeek: "[gələn həftə] dddd [saat] LT",
                lastDay: "[dünən] LT",
                lastWeek: "[keçən həftə] dddd [saat] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s sonra",
                past: "%s əvvəl",
                s: "birneçə saniyyə",
                m: "bir dəqiqə",
                mm: "%d dəqiqə",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir il",
                yy: "%d il"
            },
            meridiem: function(hour) {
                return 4 > hour ? "gecə" : 12 > hour ? "səhər" : 17 > hour ? "gündüz" : "axşam";
            },
            ordinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
            ordinal: function(number) {
                if (0 === number) return number + "-ıncı";
                var a = number % 10, b = number % 100 - a, c = number >= 100 ? 100 : null;
                return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function plural(word, num) {
            var forms = word.split("_");
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : num % 10 >= 2 && 4 >= num % 10 && (10 > num % 100 || num % 100 >= 20) ? forms[1] : forms[2];
        }
        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                mm: withoutSuffix ? "хвіліна_хвіліны_хвілін" : "хвіліну_хвіліны_хвілін",
                hh: withoutSuffix ? "гадзіна_гадзіны_гадзін" : "гадзіну_гадзіны_гадзін",
                dd: "дзень_дні_дзён",
                MM: "месяц_месяцы_месяцаў",
                yy: "год_гады_гадоў"
            };
            return "m" === key ? withoutSuffix ? "хвіліна" : "хвіліну" : "h" === key ? withoutSuffix ? "гадзіна" : "гадзіну" : number + " " + plural(format[key], +number);
        }
        function monthsCaseReplace(m, format) {
            var months = {
                nominative: "студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),
                accusative: "студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")
            }, nounCase = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(format) ? "accusative" : "nominative";
            return months[nounCase][m.month()];
        }
        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                nominative: "нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),
                accusative: "нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")
            }, nounCase = /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(format) ? "accusative" : "nominative";
            return weekdays[nounCase][m.day()];
        }
        return moment.defineLocale("be", {
            months: monthsCaseReplace,
            monthsShort: "студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),
            weekdays: weekdaysCaseReplace,
            weekdaysShort: "нд_пн_ат_ср_чц_пт_сб".split("_"),
            weekdaysMin: "нд_пн_ат_ср_чц_пт_сб".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY г.",
                LLL: "D MMMM YYYY г., LT",
                LLLL: "dddd, D MMMM YYYY г., LT"
            },
            calendar: {
                sameDay: "[Сёння ў] LT",
                nextDay: "[Заўтра ў] LT",
                lastDay: "[Учора ў] LT",
                nextWeek: function() {
                    return "[У] dddd [ў] LT";
                },
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                      case 3:
                      case 5:
                      case 6:
                        return "[У мінулую] dddd [ў] LT";

                      case 1:
                      case 2:
                      case 4:
                        return "[У мінулы] dddd [ў] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "праз %s",
                past: "%s таму",
                s: "некалькі секунд",
                m: relativeTimeWithPlural,
                mm: relativeTimeWithPlural,
                h: relativeTimeWithPlural,
                hh: relativeTimeWithPlural,
                d: "дзень",
                dd: relativeTimeWithPlural,
                M: "месяц",
                MM: relativeTimeWithPlural,
                y: "год",
                yy: relativeTimeWithPlural
            },
            meridiem: function(hour) {
                return 4 > hour ? "ночы" : 12 > hour ? "раніцы" : 17 > hour ? "дня" : "вечара";
            },
            ordinalParse: /\d{1,2}-(і|ы|га)/,
            ordinal: function(number, period) {
                switch (period) {
                  case "M":
                  case "d":
                  case "DDD":
                  case "w":
                  case "W":
                    return number % 10 !== 2 && number % 10 !== 3 || number % 100 === 12 || number % 100 === 13 ? number + "-ы" : number + "-і";

                  case "D":
                    return number + "-га";

                  default:
                    return number;
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("bg", {
            months: "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),
            weekdaysShort: "нед_пон_вто_сря_чет_пет_съб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "D.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Днес в] LT",
                nextDay: "[Утре в] LT",
                nextWeek: "dddd [в] LT",
                lastDay: "[Вчера в] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                      case 3:
                      case 6:
                        return "[В изминалата] dddd [в] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[В изминалия] dddd [в] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "след %s",
                past: "преди %s",
                s: "няколко секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дни",
                M: "месец",
                MM: "%d месеца",
                y: "година",
                yy: "%d години"
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function(number) {
                var lastDigit = number % 10, last2Digits = number % 100;
                return 0 === number ? number + "-ев" : 0 === last2Digits ? number + "-ен" : last2Digits > 10 && 20 > last2Digits ? number + "-ти" : 1 === lastDigit ? number + "-ви" : 2 === lastDigit ? number + "-ри" : 7 === lastDigit || 8 === lastDigit ? number + "-ми" : number + "-ти";
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "১",
            "2": "২",
            "3": "৩",
            "4": "৪",
            "5": "৫",
            "6": "৬",
            "7": "৭",
            "8": "৮",
            "9": "৯",
            "0": "০"
        }, numberMap = {
            "১": "1",
            "২": "2",
            "৩": "3",
            "৪": "4",
            "৫": "5",
            "৬": "6",
            "৭": "7",
            "৮": "8",
            "৯": "9",
            "০": "0"
        };
        return moment.defineLocale("bn", {
            months: "জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),
            monthsShort: "জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),
            weekdays: "রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),
            weekdaysShort: "রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),
            weekdaysMin: "রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),
            longDateFormat: {
                LT: "A h:mm সময়",
                LTS: "A h:mm:ss সময়",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[আজ] LT",
                nextDay: "[আগামীকাল] LT",
                nextWeek: "dddd, LT",
                lastDay: "[গতকাল] LT",
                lastWeek: "[গত] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s পরে",
                past: "%s আগে",
                s: "কএক সেকেন্ড",
                m: "এক মিনিট",
                mm: "%d মিনিট",
                h: "এক ঘন্টা",
                hh: "%d ঘন্টা",
                d: "এক দিন",
                dd: "%d দিন",
                M: "এক মাস",
                MM: "%d মাস",
                y: "এক বছর",
                yy: "%d বছর"
            },
            preparse: function(string) {
                return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function(match) {
                    return numberMap[match];
                });
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                });
            },
            meridiem: function(hour) {
                return 4 > hour ? "রাত" : 10 > hour ? "শকাল" : 17 > hour ? "দুপুর" : 20 > hour ? "বিকেল" : "রাত";
            },
            week: {
                dow: 0,
                doy: 6
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "༡",
            "2": "༢",
            "3": "༣",
            "4": "༤",
            "5": "༥",
            "6": "༦",
            "7": "༧",
            "8": "༨",
            "9": "༩",
            "0": "༠"
        }, numberMap = {
            "༡": "1",
            "༢": "2",
            "༣": "3",
            "༤": "4",
            "༥": "5",
            "༦": "6",
            "༧": "7",
            "༨": "8",
            "༩": "9",
            "༠": "0"
        };
        return moment.defineLocale("bo", {
            months: "ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),
            monthsShort: "ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),
            weekdays: "གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),
            weekdaysShort: "ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),
            weekdaysMin: "ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),
            longDateFormat: {
                LT: "A h:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[དི་རིང] LT",
                nextDay: "[སང་ཉིན] LT",
                nextWeek: "[བདུན་ཕྲག་རྗེས་མ], LT",
                lastDay: "[ཁ་སང] LT",
                lastWeek: "[བདུན་ཕྲག་མཐའ་མ] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s ལ་",
                past: "%s སྔན་ལ",
                s: "ལམ་སང",
                m: "སྐར་མ་གཅིག",
                mm: "%d སྐར་མ",
                h: "ཆུ་ཚོད་གཅིག",
                hh: "%d ཆུ་ཚོད",
                d: "ཉིན་གཅིག",
                dd: "%d ཉིན་",
                M: "ཟླ་བ་གཅིག",
                MM: "%d ཟླ་བ",
                y: "ལོ་གཅིག",
                yy: "%d ལོ"
            },
            preparse: function(string) {
                return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function(match) {
                    return numberMap[match];
                });
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                });
            },
            meridiem: function(hour) {
                return 4 > hour ? "མཚན་མོ" : 10 > hour ? "ཞོགས་ཀས" : 17 > hour ? "ཉིན་གུང" : 20 > hour ? "དགོང་དག" : "མཚན་མོ";
            },
            week: {
                dow: 0,
                doy: 6
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function relativeTimeWithMutation(number, withoutSuffix, key) {
            var format = {
                mm: "munutenn",
                MM: "miz",
                dd: "devezh"
            };
            return number + " " + mutation(format[key], number);
        }
        function specialMutationForYears(number) {
            switch (lastNumber(number)) {
              case 1:
              case 3:
              case 4:
              case 5:
              case 9:
                return number + " bloaz";

              default:
                return number + " vloaz";
            }
        }
        function lastNumber(number) {
            return number > 9 ? lastNumber(number % 10) : number;
        }
        function mutation(text, number) {
            return 2 === number ? softMutation(text) : text;
        }
        function softMutation(text) {
            var mutationTable = {
                m: "v",
                b: "v",
                d: "z"
            };
            return mutationTable[text.charAt(0)] === undefined ? text : mutationTable[text.charAt(0)] + text.substring(1);
        }
        return moment.defineLocale("br", {
            months: "Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),
            monthsShort: "Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),
            weekdays: "Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),
            weekdaysShort: "Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),
            longDateFormat: {
                LT: "h[e]mm A",
                LTS: "h[e]mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D [a viz] MMMM YYYY",
                LLL: "D [a viz] MMMM YYYY LT",
                LLLL: "dddd, D [a viz] MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Hiziv da] LT",
                nextDay: "[Warc'hoazh da] LT",
                nextWeek: "dddd [da] LT",
                lastDay: "[Dec'h da] LT",
                lastWeek: "dddd [paset da] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "a-benn %s",
                past: "%s 'zo",
                s: "un nebeud segondennoù",
                m: "ur vunutenn",
                mm: relativeTimeWithMutation,
                h: "un eur",
                hh: "%d eur",
                d: "un devezh",
                dd: relativeTimeWithMutation,
                M: "ur miz",
                MM: relativeTimeWithMutation,
                y: "ur bloaz",
                yy: specialMutationForYears
            },
            ordinalParse: /\d{1,2}(añ|vet)/,
            ordinal: function(number) {
                var output = 1 === number ? "añ" : "vet";
                return number + output;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + " ";
            switch (key) {
              case "m":
                return withoutSuffix ? "jedna minuta" : "jedne minute";

              case "mm":
                return result += 1 === number ? "minuta" : 2 === number || 3 === number || 4 === number ? "minute" : "minuta";

              case "h":
                return withoutSuffix ? "jedan sat" : "jednog sata";

              case "hh":
                return result += 1 === number ? "sat" : 2 === number || 3 === number || 4 === number ? "sata" : "sati";

              case "dd":
                return result += 1 === number ? "dan" : "dana";

              case "MM":
                return result += 1 === number ? "mjesec" : 2 === number || 3 === number || 4 === number ? "mjeseca" : "mjeseci";

              case "yy":
                return result += 1 === number ? "godina" : 2 === number || 3 === number || 4 === number ? "godine" : "godina";
            }
        }
        return moment.defineLocale("bs", {
            months: "januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[u] [nedjelju] [u] LT";

                      case 3:
                        return "[u] [srijedu] [u] LT";

                      case 6:
                        return "[u] [subotu] [u] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[u] dddd [u] LT";
                    }
                },
                lastDay: "[jučer u] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                      case 3:
                        return "[prošlu] dddd [u] LT";

                      case 6:
                        return "[prošle] [subote] [u] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[prošli] dddd [u] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "par sekundi",
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: "dan",
                dd: translate,
                M: "mjesec",
                MM: translate,
                y: "godinu",
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("ca", {
            months: "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),
            monthsShort: "gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),
            weekdays: "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),
            weekdaysShort: "dg._dl._dt._dc._dj._dv._ds.".split("_"),
            weekdaysMin: "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: function() {
                    return "[avui a " + (1 !== this.hours() ? "les" : "la") + "] LT";
                },
                nextDay: function() {
                    return "[demà a " + (1 !== this.hours() ? "les" : "la") + "] LT";
                },
                nextWeek: function() {
                    return "dddd [a " + (1 !== this.hours() ? "les" : "la") + "] LT";
                },
                lastDay: function() {
                    return "[ahir a " + (1 !== this.hours() ? "les" : "la") + "] LT";
                },
                lastWeek: function() {
                    return "[el] dddd [passat a " + (1 !== this.hours() ? "les" : "la") + "] LT";
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "fa %s",
                s: "uns segons",
                m: "un minut",
                mm: "%d minuts",
                h: "una hora",
                hh: "%d hores",
                d: "un dia",
                dd: "%d dies",
                M: "un mes",
                MM: "%d mesos",
                y: "un any",
                yy: "%d anys"
            },
            ordinalParse: /\d{1,2}(r|n|t|è|a)/,
            ordinal: function(number, period) {
                var output = 1 === number ? "r" : 2 === number ? "n" : 3 === number ? "r" : 4 === number ? "t" : "è";
                return ("w" === period || "W" === period) && (output = "a"), number + output;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function plural(n) {
            return n > 1 && 5 > n && 1 !== ~~(n / 10);
        }
        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + " ";
            switch (key) {
              case "s":
                return withoutSuffix || isFuture ? "pár sekund" : "pár sekundami";

              case "m":
                return withoutSuffix ? "minuta" : isFuture ? "minutu" : "minutou";

              case "mm":
                return withoutSuffix || isFuture ? result + (plural(number) ? "minuty" : "minut") : result + "minutami";

              case "h":
                return withoutSuffix ? "hodina" : isFuture ? "hodinu" : "hodinou";

              case "hh":
                return withoutSuffix || isFuture ? result + (plural(number) ? "hodiny" : "hodin") : result + "hodinami";

              case "d":
                return withoutSuffix || isFuture ? "den" : "dnem";

              case "dd":
                return withoutSuffix || isFuture ? result + (plural(number) ? "dny" : "dní") : result + "dny";

              case "M":
                return withoutSuffix || isFuture ? "měsíc" : "měsícem";

              case "MM":
                return withoutSuffix || isFuture ? result + (plural(number) ? "měsíce" : "měsíců") : result + "měsíci";

              case "y":
                return withoutSuffix || isFuture ? "rok" : "rokem";

              case "yy":
                return withoutSuffix || isFuture ? result + (plural(number) ? "roky" : "let") : result + "lety";
            }
        }
        var months = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"), monthsShort = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");
        return moment.defineLocale("cs", {
            months: months,
            monthsShort: monthsShort,
            monthsParse: function(months, monthsShort) {
                var i, _monthsParse = [];
                for (i = 0; 12 > i; i++) _monthsParse[i] = new RegExp("^" + months[i] + "$|^" + monthsShort[i] + "$", "i");
                return _monthsParse;
            }(months, monthsShort),
            weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
            weekdaysShort: "ne_po_út_st_čt_pá_so".split("_"),
            weekdaysMin: "ne_po_út_st_čt_pá_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[dnes v] LT",
                nextDay: "[zítra v] LT",
                nextWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[v neděli v] LT";

                      case 1:
                      case 2:
                        return "[v] dddd [v] LT";

                      case 3:
                        return "[ve středu v] LT";

                      case 4:
                        return "[ve čtvrtek v] LT";

                      case 5:
                        return "[v pátek v] LT";

                      case 6:
                        return "[v sobotu v] LT";
                    }
                },
                lastDay: "[včera v] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[minulou neděli v] LT";

                      case 1:
                      case 2:
                        return "[minulé] dddd [v] LT";

                      case 3:
                        return "[minulou středu v] LT";

                      case 4:
                      case 5:
                        return "[minulý] dddd [v] LT";

                      case 6:
                        return "[minulou sobotu v] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "před %s",
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("cv", {
            months: "кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),
            monthsShort: "кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),
            weekdays: "вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),
            weekdaysShort: "выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),
            weekdaysMin: "вр_тн_ыт_юн_кç_эр_шм".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD-MM-YYYY",
                LL: "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]",
                LLL: "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT",
                LLLL: "dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"
            },
            calendar: {
                sameDay: "[Паян] LT [сехетре]",
                nextDay: "[Ыран] LT [сехетре]",
                lastDay: "[Ĕнер] LT [сехетре]",
                nextWeek: "[Çитес] dddd LT [сехетре]",
                lastWeek: "[Иртнĕ] dddd LT [сехетре]",
                sameElse: "L"
            },
            relativeTime: {
                future: function(output) {
                    var affix = /сехет$/i.exec(output) ? "рен" : /çул$/i.exec(output) ? "тан" : "ран";
                    return output + affix;
                },
                past: "%s каялла",
                s: "пĕр-ик çеккунт",
                m: "пĕр минут",
                mm: "%d минут",
                h: "пĕр сехет",
                hh: "%d сехет",
                d: "пĕр кун",
                dd: "%d кун",
                M: "пĕр уйăх",
                MM: "%d уйăх",
                y: "пĕр çул",
                yy: "%d çул"
            },
            ordinalParse: /\d{1,2}-мĕш/,
            ordinal: "%d-мĕш",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("cy", {
            months: "Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),
            monthsShort: "Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),
            weekdays: "Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),
            weekdaysShort: "Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Heddiw am] LT",
                nextDay: "[Yfory am] LT",
                nextWeek: "dddd [am] LT",
                lastDay: "[Ddoe am] LT",
                lastWeek: "dddd [diwethaf am] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "mewn %s",
                past: "%s yn ôl",
                s: "ychydig eiliadau",
                m: "munud",
                mm: "%d munud",
                h: "awr",
                hh: "%d awr",
                d: "diwrnod",
                dd: "%d diwrnod",
                M: "mis",
                MM: "%d mis",
                y: "blwyddyn",
                yy: "%d flynedd"
            },
            ordinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
            ordinal: function(number) {
                var b = number, output = "", lookup = [ "", "af", "il", "ydd", "ydd", "ed", "ed", "ed", "fed", "fed", "fed", "eg", "fed", "eg", "eg", "fed", "eg", "eg", "fed", "eg", "fed" ];
                return b > 20 ? output = 40 === b || 50 === b || 60 === b || 80 === b || 100 === b ? "fed" : "ain" : b > 0 && (output = lookup[b]), 
                number + output;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("da", {
            months: "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd [d.] D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[I dag kl.] LT",
                nextDay: "[I morgen kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[I går kl.] LT",
                lastWeek: "[sidste] dddd [kl] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "%s siden",
                s: "få sekunder",
                m: "et minut",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dage",
                M: "en måned",
                MM: "%d måneder",
                y: "et år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function processRelativeTime(number, withoutSuffix, key) {
            var format = {
                m: [ "eine Minute", "einer Minute" ],
                h: [ "eine Stunde", "einer Stunde" ],
                d: [ "ein Tag", "einem Tag" ],
                dd: [ number + " Tage", number + " Tagen" ],
                M: [ "ein Monat", "einem Monat" ],
                MM: [ number + " Monate", number + " Monaten" ],
                y: [ "ein Jahr", "einem Jahr" ],
                yy: [ number + " Jahre", number + " Jahren" ]
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }
        return moment.defineLocale("de-at", {
            months: "Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Heute um] LT [Uhr]",
                sameElse: "L",
                nextDay: "[Morgen um] LT [Uhr]",
                nextWeek: "dddd [um] LT [Uhr]",
                lastDay: "[Gestern um] LT [Uhr]",
                lastWeek: "[letzten] dddd [um] LT [Uhr]"
            },
            relativeTime: {
                future: "in %s",
                past: "vor %s",
                s: "ein paar Sekunden",
                m: processRelativeTime,
                mm: "%d Minuten",
                h: processRelativeTime,
                hh: "%d Stunden",
                d: processRelativeTime,
                dd: processRelativeTime,
                M: processRelativeTime,
                MM: processRelativeTime,
                y: processRelativeTime,
                yy: processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function processRelativeTime(number, withoutSuffix, key) {
            var format = {
                m: [ "eine Minute", "einer Minute" ],
                h: [ "eine Stunde", "einer Stunde" ],
                d: [ "ein Tag", "einem Tag" ],
                dd: [ number + " Tage", number + " Tagen" ],
                M: [ "ein Monat", "einem Monat" ],
                MM: [ number + " Monate", number + " Monaten" ],
                y: [ "ein Jahr", "einem Jahr" ],
                yy: [ number + " Jahre", number + " Jahren" ]
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }
        return moment.defineLocale("de", {
            months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Heute um] LT [Uhr]",
                sameElse: "L",
                nextDay: "[Morgen um] LT [Uhr]",
                nextWeek: "dddd [um] LT [Uhr]",
                lastDay: "[Gestern um] LT [Uhr]",
                lastWeek: "[letzten] dddd [um] LT [Uhr]"
            },
            relativeTime: {
                future: "in %s",
                past: "vor %s",
                s: "ein paar Sekunden",
                m: processRelativeTime,
                mm: "%d Minuten",
                h: processRelativeTime,
                hh: "%d Stunden",
                d: processRelativeTime,
                dd: processRelativeTime,
                M: processRelativeTime,
                MM: processRelativeTime,
                y: processRelativeTime,
                yy: processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("el", {
            monthsNominativeEl: "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),
            monthsGenitiveEl: "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),
            months: function(momentToFormat, format) {
                return /D/.test(format.substring(0, format.indexOf("MMMM"))) ? this._monthsGenitiveEl[momentToFormat.month()] : this._monthsNominativeEl[momentToFormat.month()];
            },
            monthsShort: "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),
            weekdays: "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),
            weekdaysShort: "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
            weekdaysMin: "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
            meridiem: function(hours, minutes, isLower) {
                return hours > 11 ? isLower ? "μμ" : "ΜΜ" : isLower ? "πμ" : "ΠΜ";
            },
            isPM: function(input) {
                return "μ" === (input + "").toLowerCase()[0];
            },
            meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendarEl: {
                sameDay: "[Σήμερα {}] LT",
                nextDay: "[Αύριο {}] LT",
                nextWeek: "dddd [{}] LT",
                lastDay: "[Χθες {}] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 6:
                        return "[το προηγούμενο] dddd [{}] LT";

                      default:
                        return "[την προηγούμενη] dddd [{}] LT";
                    }
                },
                sameElse: "L"
            },
            calendar: function(key, mom) {
                var output = this._calendarEl[key], hours = mom && mom.hours();
                return "function" == typeof output && (output = output.apply(mom)), output.replace("{}", hours % 12 === 1 ? "στη" : "στις");
            },
            relativeTime: {
                future: "σε %s",
                past: "%s πριν",
                s: "λίγα δευτερόλεπτα",
                m: "ένα λεπτό",
                mm: "%d λεπτά",
                h: "μία ώρα",
                hh: "%d ώρες",
                d: "μία μέρα",
                dd: "%d μέρες",
                M: "ένας μήνας",
                MM: "%d μήνες",
                y: "ένας χρόνος",
                yy: "%d χρόνια"
            },
            ordinalParse: /\d{1,2}η/,
            ordinal: "%dη",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("en-au", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(number) {
                var b = number % 10, output = 1 === ~~(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
                return number + output;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("en-ca", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "YYYY-MM-DD",
                LL: "D MMMM, YYYY",
                LLL: "D MMMM, YYYY LT",
                LLLL: "dddd, D MMMM, YYYY LT"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(number) {
                var b = number % 10, output = 1 === ~~(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
                return number + output;
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("en-gb", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(number) {
                var b = number % 10, output = 1 === ~~(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
                return number + output;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("eo", {
            months: "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),
            weekdays: "Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),
            weekdaysShort: "Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "YYYY-MM-DD",
                LL: "D[-an de] MMMM, YYYY",
                LLL: "D[-an de] MMMM, YYYY LT",
                LLLL: "dddd, [la] D[-an de] MMMM, YYYY LT"
            },
            meridiem: function(hours, minutes, isLower) {
                return hours > 11 ? isLower ? "p.t.m." : "P.T.M." : isLower ? "a.t.m." : "A.T.M.";
            },
            calendar: {
                sameDay: "[Hodiaŭ je] LT",
                nextDay: "[Morgaŭ je] LT",
                nextWeek: "dddd [je] LT",
                lastDay: "[Hieraŭ je] LT",
                lastWeek: "[pasinta] dddd [je] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "je %s",
                past: "antaŭ %s",
                s: "sekundoj",
                m: "minuto",
                mm: "%d minutoj",
                h: "horo",
                hh: "%d horoj",
                d: "tago",
                dd: "%d tagoj",
                M: "monato",
                MM: "%d monatoj",
                y: "jaro",
                yy: "%d jaroj"
            },
            ordinalParse: /\d{1,2}a/,
            ordinal: "%da",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var monthsShortDot = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"), monthsShort = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");
        return moment.defineLocale("es", {
            months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
            monthsShort: function(m, format) {
                return /-MMM-/.test(format) ? monthsShort[m.month()] : monthsShortDot[m.month()];
            },
            weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
            weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
            weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY LT",
                LLLL: "dddd, D [de] MMMM [de] YYYY LT"
            },
            calendar: {
                sameDay: function() {
                    return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT";
                },
                nextDay: function() {
                    return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT";
                },
                nextWeek: function() {
                    return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT";
                },
                lastDay: function() {
                    return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT";
                },
                lastWeek: function() {
                    return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT";
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function processRelativeTime(number, withoutSuffix, key, isFuture) {
            var format = {
                s: [ "mõne sekundi", "mõni sekund", "paar sekundit" ],
                m: [ "ühe minuti", "üks minut" ],
                mm: [ number + " minuti", number + " minutit" ],
                h: [ "ühe tunni", "tund aega", "üks tund" ],
                hh: [ number + " tunni", number + " tundi" ],
                d: [ "ühe päeva", "üks päev" ],
                M: [ "kuu aja", "kuu aega", "üks kuu" ],
                MM: [ number + " kuu", number + " kuud" ],
                y: [ "ühe aasta", "aasta", "üks aasta" ],
                yy: [ number + " aasta", number + " aastat" ]
            };
            return withoutSuffix ? format[key][2] ? format[key][2] : format[key][1] : isFuture ? format[key][0] : format[key][1];
        }
        return moment.defineLocale("et", {
            months: "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),
            monthsShort: "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
            weekdays: "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),
            weekdaysShort: "P_E_T_K_N_R_L".split("_"),
            weekdaysMin: "P_E_T_K_N_R_L".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Täna,] LT",
                nextDay: "[Homme,] LT",
                nextWeek: "[Järgmine] dddd LT",
                lastDay: "[Eile,] LT",
                lastWeek: "[Eelmine] dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s pärast",
                past: "%s tagasi",
                s: processRelativeTime,
                m: processRelativeTime,
                mm: processRelativeTime,
                h: processRelativeTime,
                hh: processRelativeTime,
                d: processRelativeTime,
                dd: "%d päeva",
                M: processRelativeTime,
                MM: processRelativeTime,
                y: processRelativeTime,
                yy: processRelativeTime
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("eu", {
            months: "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
            monthsShort: "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
            weekdays: "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
            weekdaysShort: "ig._al._ar._az._og._ol._lr.".split("_"),
            weekdaysMin: "ig_al_ar_az_og_ol_lr".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "YYYY-MM-DD",
                LL: "YYYY[ko] MMMM[ren] D[a]",
                LLL: "YYYY[ko] MMMM[ren] D[a] LT",
                LLLL: "dddd, YYYY[ko] MMMM[ren] D[a] LT",
                l: "YYYY-M-D",
                ll: "YYYY[ko] MMM D[a]",
                lll: "YYYY[ko] MMM D[a] LT",
                llll: "ddd, YYYY[ko] MMM D[a] LT"
            },
            calendar: {
                sameDay: "[gaur] LT[etan]",
                nextDay: "[bihar] LT[etan]",
                nextWeek: "dddd LT[etan]",
                lastDay: "[atzo] LT[etan]",
                lastWeek: "[aurreko] dddd LT[etan]",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s barru",
                past: "duela %s",
                s: "segundo batzuk",
                m: "minutu bat",
                mm: "%d minutu",
                h: "ordu bat",
                hh: "%d ordu",
                d: "egun bat",
                dd: "%d egun",
                M: "hilabete bat",
                MM: "%d hilabete",
                y: "urte bat",
                yy: "%d urte"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "۱",
            "2": "۲",
            "3": "۳",
            "4": "۴",
            "5": "۵",
            "6": "۶",
            "7": "۷",
            "8": "۸",
            "9": "۹",
            "0": "۰"
        }, numberMap = {
            "۱": "1",
            "۲": "2",
            "۳": "3",
            "۴": "4",
            "۵": "5",
            "۶": "6",
            "۷": "7",
            "۸": "8",
            "۹": "9",
            "۰": "0"
        };
        return moment.defineLocale("fa", {
            months: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            monthsShort: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysShort: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            meridiem: function(hour) {
                return 12 > hour ? "قبل از ظهر" : "بعد از ظهر";
            },
            calendar: {
                sameDay: "[امروز ساعت] LT",
                nextDay: "[فردا ساعت] LT",
                nextWeek: "dddd [ساعت] LT",
                lastDay: "[دیروز ساعت] LT",
                lastWeek: "dddd [پیش] [ساعت] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "در %s",
                past: "%s پیش",
                s: "چندین ثانیه",
                m: "یک دقیقه",
                mm: "%d دقیقه",
                h: "یک ساعت",
                hh: "%d ساعت",
                d: "یک روز",
                dd: "%d روز",
                M: "یک ماه",
                MM: "%d ماه",
                y: "یک سال",
                yy: "%d سال"
            },
            preparse: function(string) {
                return string.replace(/[۰-۹]/g, function(match) {
                    return numberMap[match];
                }).replace(/،/g, ",");
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                }).replace(/,/g, "،");
            },
            ordinalParse: /\d{1,2}م/,
            ordinal: "%dم",
            week: {
                dow: 6,
                doy: 12
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function translate(number, withoutSuffix, key, isFuture) {
            var result = "";
            switch (key) {
              case "s":
                return isFuture ? "muutaman sekunnin" : "muutama sekunti";

              case "m":
                return isFuture ? "minuutin" : "minuutti";

              case "mm":
                result = isFuture ? "minuutin" : "minuuttia";
                break;

              case "h":
                return isFuture ? "tunnin" : "tunti";

              case "hh":
                result = isFuture ? "tunnin" : "tuntia";
                break;

              case "d":
                return isFuture ? "päivän" : "päivä";

              case "dd":
                result = isFuture ? "päivän" : "päivää";
                break;

              case "M":
                return isFuture ? "kuukauden" : "kuukausi";

              case "MM":
                result = isFuture ? "kuukauden" : "kuukautta";
                break;

              case "y":
                return isFuture ? "vuoden" : "vuosi";

              case "yy":
                result = isFuture ? "vuoden" : "vuotta";
            }
            return result = verbalNumber(number, isFuture) + " " + result;
        }
        function verbalNumber(number, isFuture) {
            return 10 > number ? isFuture ? numbersFuture[number] : numbersPast[number] : number;
        }
        var numbersPast = "nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "), numbersFuture = [ "nolla", "yhden", "kahden", "kolmen", "neljän", "viiden", "kuuden", numbersPast[7], numbersPast[8], numbersPast[9] ];
        return moment.defineLocale("fi", {
            months: "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
            monthsShort: "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),
            weekdays: "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
            weekdaysShort: "su_ma_ti_ke_to_pe_la".split("_"),
            weekdaysMin: "su_ma_ti_ke_to_pe_la".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD.MM.YYYY",
                LL: "Do MMMM[ta] YYYY",
                LLL: "Do MMMM[ta] YYYY, [klo] LT",
                LLLL: "dddd, Do MMMM[ta] YYYY, [klo] LT",
                l: "D.M.YYYY",
                ll: "Do MMM YYYY",
                lll: "Do MMM YYYY, [klo] LT",
                llll: "ddd, Do MMM YYYY, [klo] LT"
            },
            calendar: {
                sameDay: "[tänään] [klo] LT",
                nextDay: "[huomenna] [klo] LT",
                nextWeek: "dddd [klo] LT",
                lastDay: "[eilen] [klo] LT",
                lastWeek: "[viime] dddd[na] [klo] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s päästä",
                past: "%s sitten",
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("fo", {
            months: "januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),
            weekdaysShort: "sun_mán_týs_mik_hós_frí_ley".split("_"),
            weekdaysMin: "su_má_tý_mi_hó_fr_le".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D. MMMM, YYYY LT"
            },
            calendar: {
                sameDay: "[Í dag kl.] LT",
                nextDay: "[Í morgin kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[Í gjár kl.] LT",
                lastWeek: "[síðstu] dddd [kl] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "um %s",
                past: "%s síðani",
                s: "fá sekund",
                m: "ein minutt",
                mm: "%d minuttir",
                h: "ein tími",
                hh: "%d tímar",
                d: "ein dagur",
                dd: "%d dagar",
                M: "ein mánaði",
                MM: "%d mánaðir",
                y: "eitt ár",
                yy: "%d ár"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("fr-ca", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "YYYY-MM-DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Aujourd'hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            ordinalParse: /\d{1,2}(er|)/,
            ordinal: function(number) {
                return number + (1 === number ? "er" : "");
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("fr", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Aujourd'hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            ordinalParse: /\d{1,2}(er|)/,
            ordinal: function(number) {
                return number + (1 === number ? "er" : "");
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("gl", {
            months: "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),
            monthsShort: "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),
            weekdays: "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),
            weekdaysShort: "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),
            weekdaysMin: "Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: function() {
                    return "[hoxe " + (1 !== this.hours() ? "ás" : "á") + "] LT";
                },
                nextDay: function() {
                    return "[mañá " + (1 !== this.hours() ? "ás" : "á") + "] LT";
                },
                nextWeek: function() {
                    return "dddd [" + (1 !== this.hours() ? "ás" : "a") + "] LT";
                },
                lastDay: function() {
                    return "[onte " + (1 !== this.hours() ? "á" : "a") + "] LT";
                },
                lastWeek: function() {
                    return "[o] dddd [pasado " + (1 !== this.hours() ? "ás" : "a") + "] LT";
                },
                sameElse: "L"
            },
            relativeTime: {
                future: function(str) {
                    return "uns segundos" === str ? "nuns segundos" : "en " + str;
                },
                past: "hai %s",
                s: "uns segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "unha hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un ano",
                yy: "%d anos"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("he", {
            months: "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),
            monthsShort: "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
            weekdays: "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
            weekdaysShort: "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
            weekdaysMin: "א_ב_ג_ד_ה_ו_ש".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D [ב]MMMM YYYY",
                LLL: "D [ב]MMMM YYYY LT",
                LLLL: "dddd, D [ב]MMMM YYYY LT",
                l: "D/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY LT",
                llll: "ddd, D MMM YYYY LT"
            },
            calendar: {
                sameDay: "[היום ב־]LT",
                nextDay: "[מחר ב־]LT",
                nextWeek: "dddd [בשעה] LT",
                lastDay: "[אתמול ב־]LT",
                lastWeek: "[ביום] dddd [האחרון בשעה] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "בעוד %s",
                past: "לפני %s",
                s: "מספר שניות",
                m: "דקה",
                mm: "%d דקות",
                h: "שעה",
                hh: function(number) {
                    return 2 === number ? "שעתיים" : number + " שעות";
                },
                d: "יום",
                dd: function(number) {
                    return 2 === number ? "יומיים" : number + " ימים";
                },
                M: "חודש",
                MM: function(number) {
                    return 2 === number ? "חודשיים" : number + " חודשים";
                },
                y: "שנה",
                yy: function(number) {
                    return 2 === number ? "שנתיים" : number + " שנים";
                }
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "१",
            "2": "२",
            "3": "३",
            "4": "४",
            "5": "५",
            "6": "६",
            "7": "७",
            "8": "८",
            "9": "९",
            "0": "०"
        }, numberMap = {
            "१": "1",
            "२": "2",
            "३": "3",
            "४": "4",
            "५": "5",
            "६": "6",
            "७": "7",
            "८": "8",
            "९": "9",
            "०": "0"
        };
        return moment.defineLocale("hi", {
            months: "जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),
            monthsShort: "जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),
            weekdays: "रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {
                LT: "A h:mm बजे",
                LTS: "A h:mm:ss बजे",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[कल] LT",
                nextWeek: "dddd, LT",
                lastDay: "[कल] LT",
                lastWeek: "[पिछले] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s में",
                past: "%s पहले",
                s: "कुछ ही क्षण",
                m: "एक मिनट",
                mm: "%d मिनट",
                h: "एक घंटा",
                hh: "%d घंटे",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महीने",
                MM: "%d महीने",
                y: "एक वर्ष",
                yy: "%d वर्ष"
            },
            preparse: function(string) {
                return string.replace(/[१२३४५६७८९०]/g, function(match) {
                    return numberMap[match];
                });
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                });
            },
            meridiem: function(hour) {
                return 4 > hour ? "रात" : 10 > hour ? "सुबह" : 17 > hour ? "दोपहर" : 20 > hour ? "शाम" : "रात";
            },
            week: {
                dow: 0,
                doy: 6
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + " ";
            switch (key) {
              case "m":
                return withoutSuffix ? "jedna minuta" : "jedne minute";

              case "mm":
                return result += 1 === number ? "minuta" : 2 === number || 3 === number || 4 === number ? "minute" : "minuta";

              case "h":
                return withoutSuffix ? "jedan sat" : "jednog sata";

              case "hh":
                return result += 1 === number ? "sat" : 2 === number || 3 === number || 4 === number ? "sata" : "sati";

              case "dd":
                return result += 1 === number ? "dan" : "dana";

              case "MM":
                return result += 1 === number ? "mjesec" : 2 === number || 3 === number || 4 === number ? "mjeseca" : "mjeseci";

              case "yy":
                return result += 1 === number ? "godina" : 2 === number || 3 === number || 4 === number ? "godine" : "godina";
            }
        }
        return moment.defineLocale("hr", {
            months: "sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),
            monthsShort: "sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[u] [nedjelju] [u] LT";

                      case 3:
                        return "[u] [srijedu] [u] LT";

                      case 6:
                        return "[u] [subotu] [u] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[u] dddd [u] LT";
                    }
                },
                lastDay: "[jučer u] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                      case 3:
                        return "[prošlu] dddd [u] LT";

                      case 6:
                        return "[prošle] [subote] [u] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[prošli] dddd [u] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "par sekundi",
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: "dan",
                dd: translate,
                M: "mjesec",
                MM: translate,
                y: "godinu",
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function translate(number, withoutSuffix, key, isFuture) {
            var num = number;
            switch (key) {
              case "s":
                return isFuture || withoutSuffix ? "néhány másodperc" : "néhány másodperce";

              case "m":
                return "egy" + (isFuture || withoutSuffix ? " perc" : " perce");

              case "mm":
                return num + (isFuture || withoutSuffix ? " perc" : " perce");

              case "h":
                return "egy" + (isFuture || withoutSuffix ? " óra" : " órája");

              case "hh":
                return num + (isFuture || withoutSuffix ? " óra" : " órája");

              case "d":
                return "egy" + (isFuture || withoutSuffix ? " nap" : " napja");

              case "dd":
                return num + (isFuture || withoutSuffix ? " nap" : " napja");

              case "M":
                return "egy" + (isFuture || withoutSuffix ? " hónap" : " hónapja");

              case "MM":
                return num + (isFuture || withoutSuffix ? " hónap" : " hónapja");

              case "y":
                return "egy" + (isFuture || withoutSuffix ? " év" : " éve");

              case "yy":
                return num + (isFuture || withoutSuffix ? " év" : " éve");
            }
            return "";
        }
        function week(isFuture) {
            return (isFuture ? "" : "[múlt] ") + "[" + weekEndings[this.day()] + "] LT[-kor]";
        }
        var weekEndings = "vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");
        return moment.defineLocale("hu", {
            months: "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
            monthsShort: "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),
            weekdays: "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
            weekdaysShort: "vas_hét_kedd_sze_csüt_pén_szo".split("_"),
            weekdaysMin: "v_h_k_sze_cs_p_szo".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "YYYY.MM.DD.",
                LL: "YYYY. MMMM D.",
                LLL: "YYYY. MMMM D., LT",
                LLLL: "YYYY. MMMM D., dddd LT"
            },
            meridiem: function(hours, minutes, isLower) {
                return 12 > hours ? isLower === !0 ? "de" : "DE" : isLower === !0 ? "du" : "DU";
            },
            calendar: {
                sameDay: "[ma] LT[-kor]",
                nextDay: "[holnap] LT[-kor]",
                nextWeek: function() {
                    return week.call(this, !0);
                },
                lastDay: "[tegnap] LT[-kor]",
                lastWeek: function() {
                    return week.call(this, !1);
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "%s múlva",
                past: "%s",
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function monthsCaseReplace(m, format) {
            var months = {
                nominative: "հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),
                accusative: "հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")
            }, nounCase = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(format) ? "accusative" : "nominative";
            return months[nounCase][m.month()];
        }
        function monthsShortCaseReplace(m) {
            var monthsShort = "հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");
            return monthsShort[m.month()];
        }
        function weekdaysCaseReplace(m) {
            var weekdays = "կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");
            return weekdays[m.day()];
        }
        return moment.defineLocale("hy-am", {
            months: monthsCaseReplace,
            monthsShort: monthsShortCaseReplace,
            weekdays: weekdaysCaseReplace,
            weekdaysShort: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            weekdaysMin: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY թ.",
                LLL: "D MMMM YYYY թ., LT",
                LLLL: "dddd, D MMMM YYYY թ., LT"
            },
            calendar: {
                sameDay: "[այսօր] LT",
                nextDay: "[վաղը] LT",
                lastDay: "[երեկ] LT",
                nextWeek: function() {
                    return "dddd [օրը ժամը] LT";
                },
                lastWeek: function() {
                    return "[անցած] dddd [օրը ժամը] LT";
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "%s հետո",
                past: "%s առաջ",
                s: "մի քանի վայրկյան",
                m: "րոպե",
                mm: "%d րոպե",
                h: "ժամ",
                hh: "%d ժամ",
                d: "օր",
                dd: "%d օր",
                M: "ամիս",
                MM: "%d ամիս",
                y: "տարի",
                yy: "%d տարի"
            },
            meridiem: function(hour) {
                return 4 > hour ? "գիշերվա" : 12 > hour ? "առավոտվա" : 17 > hour ? "ցերեկվա" : "երեկոյան";
            },
            ordinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
            ordinal: function(number, period) {
                switch (period) {
                  case "DDD":
                  case "w":
                  case "W":
                  case "DDDo":
                    return 1 === number ? number + "-ին" : number + "-րդ";

                  default:
                    return number;
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("id", {
            months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
            weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
            weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "LT.ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] LT",
                LLLL: "dddd, D MMMM YYYY [pukul] LT"
            },
            meridiem: function(hours) {
                return 11 > hours ? "pagi" : 15 > hours ? "siang" : 19 > hours ? "sore" : "malam";
            },
            calendar: {
                sameDay: "[Hari ini pukul] LT",
                nextDay: "[Besok pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kemarin pukul] LT",
                lastWeek: "dddd [lalu pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lalu",
                s: "beberapa detik",
                m: "semenit",
                mm: "%d menit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function plural(n) {
            return n % 100 === 11 ? !0 : n % 10 === 1 ? !1 : !0;
        }
        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + " ";
            switch (key) {
              case "s":
                return withoutSuffix || isFuture ? "nokkrar sekúndur" : "nokkrum sekúndum";

              case "m":
                return withoutSuffix ? "mínúta" : "mínútu";

              case "mm":
                return plural(number) ? result + (withoutSuffix || isFuture ? "mínútur" : "mínútum") : withoutSuffix ? result + "mínúta" : result + "mínútu";

              case "hh":
                return plural(number) ? result + (withoutSuffix || isFuture ? "klukkustundir" : "klukkustundum") : result + "klukkustund";

              case "d":
                return withoutSuffix ? "dagur" : isFuture ? "dag" : "degi";

              case "dd":
                return plural(number) ? withoutSuffix ? result + "dagar" : result + (isFuture ? "daga" : "dögum") : withoutSuffix ? result + "dagur" : result + (isFuture ? "dag" : "degi");

              case "M":
                return withoutSuffix ? "mánuður" : isFuture ? "mánuð" : "mánuði";

              case "MM":
                return plural(number) ? withoutSuffix ? result + "mánuðir" : result + (isFuture ? "mánuði" : "mánuðum") : withoutSuffix ? result + "mánuður" : result + (isFuture ? "mánuð" : "mánuði");

              case "y":
                return withoutSuffix || isFuture ? "ár" : "ári";

              case "yy":
                return plural(number) ? result + (withoutSuffix || isFuture ? "ár" : "árum") : result + (withoutSuffix || isFuture ? "ár" : "ári");
            }
        }
        return moment.defineLocale("is", {
            months: "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
            weekdays: "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),
            weekdaysShort: "sun_mán_þri_mið_fim_fös_lau".split("_"),
            weekdaysMin: "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY [kl.] LT",
                LLLL: "dddd, D. MMMM YYYY [kl.] LT"
            },
            calendar: {
                sameDay: "[í dag kl.] LT",
                nextDay: "[á morgun kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[í gær kl.] LT",
                lastWeek: "[síðasta] dddd [kl.] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "eftir %s",
                past: "fyrir %s síðan",
                s: translate,
                m: translate,
                mm: translate,
                h: "klukkustund",
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("it", {
            months: "gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),
            monthsShort: "gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),
            weekdays: "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),
            weekdaysShort: "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
            weekdaysMin: "D_L_Ma_Me_G_V_S".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Oggi alle] LT",
                nextDay: "[Domani alle] LT",
                nextWeek: "dddd [alle] LT",
                lastDay: "[Ieri alle] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[la scorsa] dddd [alle] LT";

                      default:
                        return "[lo scorso] dddd [alle] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: function(s) {
                    return (/^[0-9].+$/.test(s) ? "tra" : "in") + " " + s;
                },
                past: "%s fa",
                s: "alcuni secondi",
                m: "un minuto",
                mm: "%d minuti",
                h: "un'ora",
                hh: "%d ore",
                d: "un giorno",
                dd: "%d giorni",
                M: "un mese",
                MM: "%d mesi",
                y: "un anno",
                yy: "%d anni"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("ja", {
            months: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
            weekdaysShort: "日_月_火_水_木_金_土".split("_"),
            weekdaysMin: "日_月_火_水_木_金_土".split("_"),
            longDateFormat: {
                LT: "Ah時m分",
                LTS: "LTs秒",
                L: "YYYY/MM/DD",
                LL: "YYYY年M月D日",
                LLL: "YYYY年M月D日LT",
                LLLL: "YYYY年M月D日LT dddd"
            },
            meridiem: function(hour) {
                return 12 > hour ? "午前" : "午後";
            },
            calendar: {
                sameDay: "[今日] LT",
                nextDay: "[明日] LT",
                nextWeek: "[来週]dddd LT",
                lastDay: "[昨日] LT",
                lastWeek: "[前週]dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s後",
                past: "%s前",
                s: "数秒",
                m: "1分",
                mm: "%d分",
                h: "1時間",
                hh: "%d時間",
                d: "1日",
                dd: "%d日",
                M: "1ヶ月",
                MM: "%dヶ月",
                y: "1年",
                yy: "%d年"
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function monthsCaseReplace(m, format) {
            var months = {
                nominative: "იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),
                accusative: "იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")
            }, nounCase = /D[oD] *MMMM?/.test(format) ? "accusative" : "nominative";
            return months[nounCase][m.month()];
        }
        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                nominative: "კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),
                accusative: "კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")
            }, nounCase = /(წინა|შემდეგ)/.test(format) ? "accusative" : "nominative";
            return weekdays[nounCase][m.day()];
        }
        return moment.defineLocale("ka", {
            months: monthsCaseReplace,
            monthsShort: "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),
            weekdays: weekdaysCaseReplace,
            weekdaysShort: "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),
            weekdaysMin: "კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[დღეს] LT[-ზე]",
                nextDay: "[ხვალ] LT[-ზე]",
                lastDay: "[გუშინ] LT[-ზე]",
                nextWeek: "[შემდეგ] dddd LT[-ზე]",
                lastWeek: "[წინა] dddd LT-ზე",
                sameElse: "L"
            },
            relativeTime: {
                future: function(s) {
                    return /(წამი|წუთი|საათი|წელი)/.test(s) ? s.replace(/ი$/, "ში") : s + "ში";
                },
                past: function(s) {
                    return /(წამი|წუთი|საათი|დღე|თვე)/.test(s) ? s.replace(/(ი|ე)$/, "ის წინ") : /წელი/.test(s) ? s.replace(/წელი$/, "წლის წინ") : void 0;
                },
                s: "რამდენიმე წამი",
                m: "წუთი",
                mm: "%d წუთი",
                h: "საათი",
                hh: "%d საათი",
                d: "დღე",
                dd: "%d დღე",
                M: "თვე",
                MM: "%d თვე",
                y: "წელი",
                yy: "%d წელი"
            },
            ordinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
            ordinal: function(number) {
                return 0 === number ? number : 1 === number ? number + "-ლი" : 20 > number || 100 >= number && number % 20 === 0 || number % 100 === 0 ? "მე-" + number : number + "-ე";
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("km", {
            months: "មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
            monthsShort: "មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
            weekdays: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            weekdaysShort: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            weekdaysMin: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[ថ្ងៃនៈ ម៉ោង] LT",
                nextDay: "[ស្អែក ម៉ោង] LT",
                nextWeek: "dddd [ម៉ោង] LT",
                lastDay: "[ម្សិលមិញ ម៉ោង] LT",
                lastWeek: "dddd [សប្តាហ៍មុន] [ម៉ោង] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%sទៀត",
                past: "%sមុន",
                s: "ប៉ុន្មានវិនាទី",
                m: "មួយនាទី",
                mm: "%d នាទី",
                h: "មួយម៉ោង",
                hh: "%d ម៉ោង",
                d: "មួយថ្ងៃ",
                dd: "%d ថ្ងៃ",
                M: "មួយខែ",
                MM: "%d ខែ",
                y: "មួយឆ្នាំ",
                yy: "%d ឆ្នាំ"
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("ko", {
            months: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            monthsShort: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            weekdays: "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
            weekdaysShort: "일_월_화_수_목_금_토".split("_"),
            weekdaysMin: "일_월_화_수_목_금_토".split("_"),
            longDateFormat: {
                LT: "A h시 m분",
                LTS: "A h시 m분 s초",
                L: "YYYY.MM.DD",
                LL: "YYYY년 MMMM D일",
                LLL: "YYYY년 MMMM D일 LT",
                LLLL: "YYYY년 MMMM D일 dddd LT"
            },
            meridiem: function(hour) {
                return 12 > hour ? "오전" : "오후";
            },
            calendar: {
                sameDay: "오늘 LT",
                nextDay: "내일 LT",
                nextWeek: "dddd LT",
                lastDay: "어제 LT",
                lastWeek: "지난주 dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s 후",
                past: "%s 전",
                s: "몇초",
                ss: "%d초",
                m: "일분",
                mm: "%d분",
                h: "한시간",
                hh: "%d시간",
                d: "하루",
                dd: "%d일",
                M: "한달",
                MM: "%d달",
                y: "일년",
                yy: "%d년"
            },
            ordinalParse: /\d{1,2}일/,
            ordinal: "%d일",
            meridiemParse: /(오전|오후)/,
            isPM: function(token) {
                return "오후" === token;
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function processRelativeTime(number, withoutSuffix, key) {
            var format = {
                m: [ "eng Minutt", "enger Minutt" ],
                h: [ "eng Stonn", "enger Stonn" ],
                d: [ "een Dag", "engem Dag" ],
                M: [ "ee Mount", "engem Mount" ],
                y: [ "ee Joer", "engem Joer" ]
            };
            return withoutSuffix ? format[key][0] : format[key][1];
        }
        function processFutureTime(string) {
            var number = string.substr(0, string.indexOf(" "));
            return eifelerRegelAppliesToNumber(number) ? "a " + string : "an " + string;
        }
        function processPastTime(string) {
            var number = string.substr(0, string.indexOf(" "));
            return eifelerRegelAppliesToNumber(number) ? "viru " + string : "virun " + string;
        }
        function eifelerRegelAppliesToNumber(number) {
            if (number = parseInt(number, 10), isNaN(number)) return !1;
            if (0 > number) return !0;
            if (10 > number) return number >= 4 && 7 >= number ? !0 : !1;
            if (100 > number) {
                var lastDigit = number % 10, firstDigit = number / 10;
                return eifelerRegelAppliesToNumber(0 === lastDigit ? firstDigit : lastDigit);
            }
            if (1e4 > number) {
                for (;number >= 10; ) number /= 10;
                return eifelerRegelAppliesToNumber(number);
            }
            return number /= 1e3, eifelerRegelAppliesToNumber(number);
        }
        return moment.defineLocale("lb", {
            months: "Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),
            weekdaysShort: "So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mé_Dë_Më_Do_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "H:mm [Auer]",
                LTS: "H:mm:ss [Auer]",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Haut um] LT",
                sameElse: "L",
                nextDay: "[Muer um] LT",
                nextWeek: "dddd [um] LT",
                lastDay: "[Gëschter um] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 2:
                      case 4:
                        return "[Leschten] dddd [um] LT";

                      default:
                        return "[Leschte] dddd [um] LT";
                    }
                }
            },
            relativeTime: {
                future: processFutureTime,
                past: processPastTime,
                s: "e puer Sekonnen",
                m: processRelativeTime,
                mm: "%d Minutten",
                h: processRelativeTime,
                hh: "%d Stonnen",
                d: processRelativeTime,
                dd: "%d Deeg",
                M: processRelativeTime,
                MM: "%d Méint",
                y: processRelativeTime,
                yy: "%d Joer"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function translateSeconds(number, withoutSuffix, key, isFuture) {
            return withoutSuffix ? "kelios sekundės" : isFuture ? "kelių sekundžių" : "kelias sekundes";
        }
        function translateSingular(number, withoutSuffix, key, isFuture) {
            return withoutSuffix ? forms(key)[0] : isFuture ? forms(key)[1] : forms(key)[2];
        }
        function special(number) {
            return number % 10 === 0 || number > 10 && 20 > number;
        }
        function forms(key) {
            return units[key].split("_");
        }
        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + " ";
            return 1 === number ? result + translateSingular(number, withoutSuffix, key[0], isFuture) : withoutSuffix ? result + (special(number) ? forms(key)[1] : forms(key)[0]) : isFuture ? result + forms(key)[1] : result + (special(number) ? forms(key)[1] : forms(key)[2]);
        }
        function relativeWeekDay(moment, format) {
            var nominative = -1 === format.indexOf("dddd HH:mm"), weekDay = weekDays[moment.day()];
            return nominative ? weekDay : weekDay.substring(0, weekDay.length - 2) + "į";
        }
        var units = {
            m: "minutė_minutės_minutę",
            mm: "minutės_minučių_minutes",
            h: "valanda_valandos_valandą",
            hh: "valandos_valandų_valandas",
            d: "diena_dienos_dieną",
            dd: "dienos_dienų_dienas",
            M: "mėnuo_mėnesio_mėnesį",
            MM: "mėnesiai_mėnesių_mėnesius",
            y: "metai_metų_metus",
            yy: "metai_metų_metus"
        }, weekDays = "sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_");
        return moment.defineLocale("lt", {
            months: "sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),
            monthsShort: "sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),
            weekdays: relativeWeekDay,
            weekdaysShort: "Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),
            weekdaysMin: "S_P_A_T_K_Pn_Š".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "YYYY-MM-DD",
                LL: "YYYY [m.] MMMM D [d.]",
                LLL: "YYYY [m.] MMMM D [d.], LT [val.]",
                LLLL: "YYYY [m.] MMMM D [d.], dddd, LT [val.]",
                l: "YYYY-MM-DD",
                ll: "YYYY [m.] MMMM D [d.]",
                lll: "YYYY [m.] MMMM D [d.], LT [val.]",
                llll: "YYYY [m.] MMMM D [d.], ddd, LT [val.]"
            },
            calendar: {
                sameDay: "[Šiandien] LT",
                nextDay: "[Rytoj] LT",
                nextWeek: "dddd LT",
                lastDay: "[Vakar] LT",
                lastWeek: "[Praėjusį] dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "po %s",
                past: "prieš %s",
                s: translateSeconds,
                m: translateSingular,
                mm: translate,
                h: translateSingular,
                hh: translate,
                d: translateSingular,
                dd: translate,
                M: translateSingular,
                MM: translate,
                y: translateSingular,
                yy: translate
            },
            ordinalParse: /\d{1,2}-oji/,
            ordinal: function(number) {
                return number + "-oji";
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function format(word, number, withoutSuffix) {
            var forms = word.split("_");
            return withoutSuffix ? number % 10 === 1 && 11 !== number ? forms[2] : forms[3] : number % 10 === 1 && 11 !== number ? forms[0] : forms[1];
        }
        function relativeTimeWithPlural(number, withoutSuffix, key) {
            return number + " " + format(units[key], number, withoutSuffix);
        }
        var units = {
            mm: "minūti_minūtes_minūte_minūtes",
            hh: "stundu_stundas_stunda_stundas",
            dd: "dienu_dienas_diena_dienas",
            MM: "mēnesi_mēnešus_mēnesis_mēneši",
            yy: "gadu_gadus_gads_gadi"
        };
        return moment.defineLocale("lv", {
            months: "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
            weekdays: "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),
            weekdaysShort: "Sv_P_O_T_C_Pk_S".split("_"),
            weekdaysMin: "Sv_P_O_T_C_Pk_S".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "YYYY. [gada] D. MMMM",
                LLL: "YYYY. [gada] D. MMMM, LT",
                LLLL: "YYYY. [gada] D. MMMM, dddd, LT"
            },
            calendar: {
                sameDay: "[Šodien pulksten] LT",
                nextDay: "[Rīt pulksten] LT",
                nextWeek: "dddd [pulksten] LT",
                lastDay: "[Vakar pulksten] LT",
                lastWeek: "[Pagājušā] dddd [pulksten] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s vēlāk",
                past: "%s agrāk",
                s: "dažas sekundes",
                m: "minūti",
                mm: relativeTimeWithPlural,
                h: "stundu",
                hh: relativeTimeWithPlural,
                d: "dienu",
                dd: relativeTimeWithPlural,
                M: "mēnesi",
                MM: relativeTimeWithPlural,
                y: "gadu",
                yy: relativeTimeWithPlural
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("mk", {
            months: "јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),
            weekdaysShort: "нед_пон_вто_сре_чет_пет_саб".split("_"),
            weekdaysMin: "нe_пo_вт_ср_че_пе_сa".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "D.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Денес во] LT",
                nextDay: "[Утре во] LT",
                nextWeek: "dddd [во] LT",
                lastDay: "[Вчера во] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                      case 3:
                      case 6:
                        return "[Во изминатата] dddd [во] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[Во изминатиот] dddd [во] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "после %s",
                past: "пред %s",
                s: "неколку секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дена",
                M: "месец",
                MM: "%d месеци",
                y: "година",
                yy: "%d години"
            },
            ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function(number) {
                var lastDigit = number % 10, last2Digits = number % 100;
                return 0 === number ? number + "-ев" : 0 === last2Digits ? number + "-ен" : last2Digits > 10 && 20 > last2Digits ? number + "-ти" : 1 === lastDigit ? number + "-ви" : 2 === lastDigit ? number + "-ри" : 7 === lastDigit || 8 === lastDigit ? number + "-ми" : number + "-ти";
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("ml", {
            months: "ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),
            monthsShort: "ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),
            weekdays: "ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),
            weekdaysShort: "ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),
            weekdaysMin: "ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),
            longDateFormat: {
                LT: "A h:mm -നു",
                LTS: "A h:mm:ss -നു",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[ഇന്ന്] LT",
                nextDay: "[നാളെ] LT",
                nextWeek: "dddd, LT",
                lastDay: "[ഇന്നലെ] LT",
                lastWeek: "[കഴിഞ്ഞ] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s കഴിഞ്ഞ്",
                past: "%s മുൻപ്",
                s: "അൽപ നിമിഷങ്ങൾ",
                m: "ഒരു മിനിറ്റ്",
                mm: "%d മിനിറ്റ്",
                h: "ഒരു മണിക്കൂർ",
                hh: "%d മണിക്കൂർ",
                d: "ഒരു ദിവസം",
                dd: "%d ദിവസം",
                M: "ഒരു മാസം",
                MM: "%d മാസം",
                y: "ഒരു വർഷം",
                yy: "%d വർഷം"
            },
            meridiem: function(hour) {
                return 4 > hour ? "രാത്രി" : 12 > hour ? "രാവിലെ" : 17 > hour ? "ഉച്ച കഴിഞ്ഞ്" : 20 > hour ? "വൈകുന്നേരം" : "രാത്രി";
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "१",
            "2": "२",
            "3": "३",
            "4": "४",
            "5": "५",
            "6": "६",
            "7": "७",
            "8": "८",
            "9": "९",
            "0": "०"
        }, numberMap = {
            "१": "1",
            "२": "2",
            "३": "3",
            "४": "4",
            "५": "5",
            "६": "6",
            "७": "7",
            "८": "8",
            "९": "9",
            "०": "0"
        };
        return moment.defineLocale("mr", {
            months: "जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),
            monthsShort: "जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),
            weekdays: "रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {
                LT: "A h:mm वाजता",
                LTS: "A h:mm:ss वाजता",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[उद्या] LT",
                nextWeek: "dddd, LT",
                lastDay: "[काल] LT",
                lastWeek: "[मागील] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s नंतर",
                past: "%s पूर्वी",
                s: "सेकंद",
                m: "एक मिनिट",
                mm: "%d मिनिटे",
                h: "एक तास",
                hh: "%d तास",
                d: "एक दिवस",
                dd: "%d दिवस",
                M: "एक महिना",
                MM: "%d महिने",
                y: "एक वर्ष",
                yy: "%d वर्षे"
            },
            preparse: function(string) {
                return string.replace(/[१२३४५६७८९०]/g, function(match) {
                    return numberMap[match];
                });
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                });
            },
            meridiem: function(hour) {
                return 4 > hour ? "रात्री" : 10 > hour ? "सकाळी" : 17 > hour ? "दुपारी" : 20 > hour ? "सायंकाळी" : "रात्री";
            },
            week: {
                dow: 0,
                doy: 6
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("ms-my", {
            months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
            monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
            weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
            weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
            weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "LT.ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] LT",
                LLLL: "dddd, D MMMM YYYY [pukul] LT"
            },
            meridiem: function(hours) {
                return 11 > hours ? "pagi" : 15 > hours ? "tengahari" : 19 > hours ? "petang" : "malam";
            },
            calendar: {
                sameDay: "[Hari ini pukul] LT",
                nextDay: "[Esok pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kelmarin pukul] LT",
                lastWeek: "dddd [lepas pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lepas",
                s: "beberapa saat",
                m: "seminit",
                mm: "%d minit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "၁",
            "2": "၂",
            "3": "၃",
            "4": "၄",
            "5": "၅",
            "6": "၆",
            "7": "၇",
            "8": "၈",
            "9": "၉",
            "0": "၀"
        }, numberMap = {
            "၁": "1",
            "၂": "2",
            "၃": "3",
            "၄": "4",
            "၅": "5",
            "၆": "6",
            "၇": "7",
            "၈": "8",
            "၉": "9",
            "၀": "0"
        };
        return moment.defineLocale("my", {
            months: "ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),
            monthsShort: "ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),
            weekdays: "တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),
            weekdaysShort: "နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
            weekdaysMin: "နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[ယနေ.] LT [မှာ]",
                nextDay: "[မနက်ဖြန်] LT [မှာ]",
                nextWeek: "dddd LT [မှာ]",
                lastDay: "[မနေ.က] LT [မှာ]",
                lastWeek: "[ပြီးခဲ့သော] dddd LT [မှာ]",
                sameElse: "L"
            },
            relativeTime: {
                future: "လာမည့် %s မှာ",
                past: "လွန်ခဲ့သော %s က",
                s: "စက္ကန်.အနည်းငယ်",
                m: "တစ်မိနစ်",
                mm: "%d မိနစ်",
                h: "တစ်နာရီ",
                hh: "%d နာရီ",
                d: "တစ်ရက်",
                dd: "%d ရက်",
                M: "တစ်လ",
                MM: "%d လ",
                y: "တစ်နှစ်",
                yy: "%d နှစ်"
            },
            preparse: function(string) {
                return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function(match) {
                    return numberMap[match];
                });
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                });
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("nb", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "søn_man_tirs_ons_tors_fre_lør".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "H.mm",
                LTS: "LT.ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY [kl.] LT",
                LLLL: "dddd D. MMMM YYYY [kl.] LT"
            },
            calendar: {
                sameDay: "[i dag kl.] LT",
                nextDay: "[i morgen kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[i går kl.] LT",
                lastWeek: "[forrige] dddd [kl.] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "for %s siden",
                s: "noen sekunder",
                m: "ett minutt",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dager",
                M: "en måned",
                MM: "%d måneder",
                y: "ett år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var symbolMap = {
            "1": "१",
            "2": "२",
            "3": "३",
            "4": "४",
            "5": "५",
            "6": "६",
            "7": "७",
            "8": "८",
            "9": "९",
            "0": "०"
        }, numberMap = {
            "१": "1",
            "२": "2",
            "३": "3",
            "४": "4",
            "५": "5",
            "६": "6",
            "७": "7",
            "८": "8",
            "९": "9",
            "०": "0"
        };
        return moment.defineLocale("ne", {
            months: "जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),
            monthsShort: "जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),
            weekdays: "आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),
            weekdaysShort: "आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),
            weekdaysMin: "आइ._सो._मङ्_बु._बि._शु._श.".split("_"),
            longDateFormat: {
                LT: "Aको h:mm बजे",
                LTS: "Aको h:mm:ss बजे",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            preparse: function(string) {
                return string.replace(/[१२३४५६७८९०]/g, function(match) {
                    return numberMap[match];
                });
            },
            postformat: function(string) {
                return string.replace(/\d/g, function(match) {
                    return symbolMap[match];
                });
            },
            meridiem: function(hour) {
                return 3 > hour ? "राती" : 10 > hour ? "बिहान" : 15 > hour ? "दिउँसो" : 18 > hour ? "बेलुका" : 20 > hour ? "साँझ" : "राती";
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[भोली] LT",
                nextWeek: "[आउँदो] dddd[,] LT",
                lastDay: "[हिजो] LT",
                lastWeek: "[गएको] dddd[,] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%sमा",
                past: "%s अगाडी",
                s: "केही समय",
                m: "एक मिनेट",
                mm: "%d मिनेट",
                h: "एक घण्टा",
                hh: "%d घण्टा",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महिना",
                MM: "%d महिना",
                y: "एक बर्ष",
                yy: "%d बर्ष"
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var monthsShortWithDots = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"), monthsShortWithoutDots = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_");
        return moment.defineLocale("nl", {
            months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
            monthsShort: function(m, format) {
                return /-MMM-/.test(format) ? monthsShortWithoutDots[m.month()] : monthsShortWithDots[m.month()];
            },
            weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
            weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
            weekdaysMin: "Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD-MM-YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[vandaag om] LT",
                nextDay: "[morgen om] LT",
                nextWeek: "dddd [om] LT",
                lastDay: "[gisteren om] LT",
                lastWeek: "[afgelopen] dddd [om] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "over %s",
                past: "%s geleden",
                s: "een paar seconden",
                m: "één minuut",
                mm: "%d minuten",
                h: "één uur",
                hh: "%d uur",
                d: "één dag",
                dd: "%d dagen",
                M: "één maand",
                MM: "%d maanden",
                y: "één jaar",
                yy: "%d jaar"
            },
            ordinalParse: /\d{1,2}(ste|de)/,
            ordinal: function(number) {
                return number + (1 === number || 8 === number || number >= 20 ? "ste" : "de");
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("nn", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),
            weekdaysShort: "sun_mån_tys_ons_tor_fre_lau".split("_"),
            weekdaysMin: "su_må_ty_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[I dag klokka] LT",
                nextDay: "[I morgon klokka] LT",
                nextWeek: "dddd [klokka] LT",
                lastDay: "[I går klokka] LT",
                lastWeek: "[Føregåande] dddd [klokka] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "for %s sidan",
                s: "nokre sekund",
                m: "eit minutt",
                mm: "%d minutt",
                h: "ein time",
                hh: "%d timar",
                d: "ein dag",
                dd: "%d dagar",
                M: "ein månad",
                MM: "%d månader",
                y: "eit år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function plural(n) {
            return 5 > n % 10 && n % 10 > 1 && ~~(n / 10) % 10 !== 1;
        }
        function translate(number, withoutSuffix, key) {
            var result = number + " ";
            switch (key) {
              case "m":
                return withoutSuffix ? "minuta" : "minutę";

              case "mm":
                return result + (plural(number) ? "minuty" : "minut");

              case "h":
                return withoutSuffix ? "godzina" : "godzinę";

              case "hh":
                return result + (plural(number) ? "godziny" : "godzin");

              case "MM":
                return result + (plural(number) ? "miesiące" : "miesięcy");

              case "yy":
                return result + (plural(number) ? "lata" : "lat");
            }
        }
        var monthsNominative = "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"), monthsSubjective = "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");
        return moment.defineLocale("pl", {
            months: function(momentToFormat, format) {
                return /D MMMM/.test(format) ? monthsSubjective[momentToFormat.month()] : monthsNominative[momentToFormat.month()];
            },
            monthsShort: "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
            weekdays: "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
            weekdaysShort: "nie_pon_wt_śr_czw_pt_sb".split("_"),
            weekdaysMin: "N_Pn_Wt_Śr_Cz_Pt_So".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Dziś o] LT",
                nextDay: "[Jutro o] LT",
                nextWeek: "[W] dddd [o] LT",
                lastDay: "[Wczoraj o] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[W zeszłą niedzielę o] LT";

                      case 3:
                        return "[W zeszłą środę o] LT";

                      case 6:
                        return "[W zeszłą sobotę o] LT";

                      default:
                        return "[W zeszły] dddd [o] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "%s temu",
                s: "kilka sekund",
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: "1 dzień",
                dd: "%d dni",
                M: "miesiąc",
                MM: translate,
                y: "rok",
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("pt-br", {
            months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
            monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
            weekdays: "domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),
            weekdaysShort: "dom_seg_ter_qua_qui_sex_sáb".split("_"),
            weekdaysMin: "dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY [às] LT",
                LLLL: "dddd, D [de] MMMM [de] YYYY [às] LT"
            },
            calendar: {
                sameDay: "[Hoje às] LT",
                nextDay: "[Amanhã às] LT",
                nextWeek: "dddd [às] LT",
                lastDay: "[Ontem às] LT",
                lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT";
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "%s atrás",
                s: "segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº"
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("pt", {
            months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
            monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
            weekdays: "domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),
            weekdaysShort: "dom_seg_ter_qua_qui_sex_sáb".split("_"),
            weekdaysMin: "dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY LT",
                LLLL: "dddd, D [de] MMMM [de] YYYY LT"
            },
            calendar: {
                sameDay: "[Hoje às] LT",
                nextDay: "[Amanhã às] LT",
                nextWeek: "dddd [às] LT",
                lastDay: "[Ontem às] LT",
                lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT";
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "há %s",
                s: "segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            ordinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                mm: "minute",
                hh: "ore",
                dd: "zile",
                MM: "luni",
                yy: "ani"
            }, separator = " ";
            return (number % 100 >= 20 || number >= 100 && number % 100 === 0) && (separator = " de "), 
            number + separator + format[key];
        }
        return moment.defineLocale("ro", {
            months: "ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),
            monthsShort: "ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),
            weekdays: "duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),
            weekdaysShort: "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
            weekdaysMin: "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY H:mm",
                LLLL: "dddd, D MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[azi la] LT",
                nextDay: "[mâine la] LT",
                nextWeek: "dddd [la] LT",
                lastDay: "[ieri la] LT",
                lastWeek: "[fosta] dddd [la] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "peste %s",
                past: "%s în urmă",
                s: "câteva secunde",
                m: "un minut",
                mm: relativeTimeWithPlural,
                h: "o oră",
                hh: relativeTimeWithPlural,
                d: "o zi",
                dd: relativeTimeWithPlural,
                M: "o lună",
                MM: relativeTimeWithPlural,
                y: "un an",
                yy: relativeTimeWithPlural
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function plural(word, num) {
            var forms = word.split("_");
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : num % 10 >= 2 && 4 >= num % 10 && (10 > num % 100 || num % 100 >= 20) ? forms[1] : forms[2];
        }
        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                mm: withoutSuffix ? "минута_минуты_минут" : "минуту_минуты_минут",
                hh: "час_часа_часов",
                dd: "день_дня_дней",
                MM: "месяц_месяца_месяцев",
                yy: "год_года_лет"
            };
            return "m" === key ? withoutSuffix ? "минута" : "минуту" : number + " " + plural(format[key], +number);
        }
        function monthsCaseReplace(m, format) {
            var months = {
                nominative: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
                accusative: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")
            }, nounCase = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(format) ? "accusative" : "nominative";
            return months[nounCase][m.month()];
        }
        function monthsShortCaseReplace(m, format) {
            var monthsShort = {
                nominative: "янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),
                accusative: "янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")
            }, nounCase = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(format) ? "accusative" : "nominative";
            return monthsShort[nounCase][m.month()];
        }
        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                nominative: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),
                accusative: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")
            }, nounCase = /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(format) ? "accusative" : "nominative";
            return weekdays[nounCase][m.day()];
        }
        return moment.defineLocale("ru", {
            months: monthsCaseReplace,
            monthsShort: monthsShortCaseReplace,
            weekdays: weekdaysCaseReplace,
            weekdaysShort: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            monthsParse: [ /^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i ],
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY г.",
                LLL: "D MMMM YYYY г., LT",
                LLLL: "dddd, D MMMM YYYY г., LT"
            },
            calendar: {
                sameDay: "[Сегодня в] LT",
                nextDay: "[Завтра в] LT",
                lastDay: "[Вчера в] LT",
                nextWeek: function() {
                    return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT";
                },
                lastWeek: function(now) {
                    if (now.week() === this.week()) return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT";
                    switch (this.day()) {
                      case 0:
                        return "[В прошлое] dddd [в] LT";

                      case 1:
                      case 2:
                      case 4:
                        return "[В прошлый] dddd [в] LT";

                      case 3:
                      case 5:
                      case 6:
                        return "[В прошлую] dddd [в] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "через %s",
                past: "%s назад",
                s: "несколько секунд",
                m: relativeTimeWithPlural,
                mm: relativeTimeWithPlural,
                h: "час",
                hh: relativeTimeWithPlural,
                d: "день",
                dd: relativeTimeWithPlural,
                M: "месяц",
                MM: relativeTimeWithPlural,
                y: "год",
                yy: relativeTimeWithPlural
            },
            meridiemParse: /ночи|утра|дня|вечера/i,
            isPM: function(input) {
                return /^(дня|вечера)$/.test(input);
            },
            meridiem: function(hour) {
                return 4 > hour ? "ночи" : 12 > hour ? "утра" : 17 > hour ? "дня" : "вечера";
            },
            ordinalParse: /\d{1,2}-(й|го|я)/,
            ordinal: function(number, period) {
                switch (period) {
                  case "M":
                  case "d":
                  case "DDD":
                    return number + "-й";

                  case "D":
                    return number + "-го";

                  case "w":
                  case "W":
                    return number + "-я";

                  default:
                    return number;
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function plural(n) {
            return n > 1 && 5 > n;
        }
        function translate(number, withoutSuffix, key, isFuture) {
            var result = number + " ";
            switch (key) {
              case "s":
                return withoutSuffix || isFuture ? "pár sekúnd" : "pár sekundami";

              case "m":
                return withoutSuffix ? "minúta" : isFuture ? "minútu" : "minútou";

              case "mm":
                return withoutSuffix || isFuture ? result + (plural(number) ? "minúty" : "minút") : result + "minútami";

              case "h":
                return withoutSuffix ? "hodina" : isFuture ? "hodinu" : "hodinou";

              case "hh":
                return withoutSuffix || isFuture ? result + (plural(number) ? "hodiny" : "hodín") : result + "hodinami";

              case "d":
                return withoutSuffix || isFuture ? "deň" : "dňom";

              case "dd":
                return withoutSuffix || isFuture ? result + (plural(number) ? "dni" : "dní") : result + "dňami";

              case "M":
                return withoutSuffix || isFuture ? "mesiac" : "mesiacom";

              case "MM":
                return withoutSuffix || isFuture ? result + (plural(number) ? "mesiace" : "mesiacov") : result + "mesiacmi";

              case "y":
                return withoutSuffix || isFuture ? "rok" : "rokom";

              case "yy":
                return withoutSuffix || isFuture ? result + (plural(number) ? "roky" : "rokov") : result + "rokmi";
            }
        }
        var months = "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"), monthsShort = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");
        return moment.defineLocale("sk", {
            months: months,
            monthsShort: monthsShort,
            monthsParse: function(months, monthsShort) {
                var i, _monthsParse = [];
                for (i = 0; 12 > i; i++) _monthsParse[i] = new RegExp("^" + months[i] + "$|^" + monthsShort[i] + "$", "i");
                return _monthsParse;
            }(months, monthsShort),
            weekdays: "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),
            weekdaysShort: "ne_po_ut_st_št_pi_so".split("_"),
            weekdaysMin: "ne_po_ut_st_št_pi_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[dnes o] LT",
                nextDay: "[zajtra o] LT",
                nextWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[v nedeľu o] LT";

                      case 1:
                      case 2:
                        return "[v] dddd [o] LT";

                      case 3:
                        return "[v stredu o] LT";

                      case 4:
                        return "[vo štvrtok o] LT";

                      case 5:
                        return "[v piatok o] LT";

                      case 6:
                        return "[v sobotu o] LT";
                    }
                },
                lastDay: "[včera o] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[minulú nedeľu o] LT";

                      case 1:
                      case 2:
                        return "[minulý] dddd [o] LT";

                      case 3:
                        return "[minulú stredu o] LT";

                      case 4:
                      case 5:
                        return "[minulý] dddd [o] LT";

                      case 6:
                        return "[minulú sobotu o] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "pred %s",
                s: translate,
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: translate,
                dd: translate,
                M: translate,
                MM: translate,
                y: translate,
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function translate(number, withoutSuffix, key) {
            var result = number + " ";
            switch (key) {
              case "m":
                return withoutSuffix ? "ena minuta" : "eno minuto";

              case "mm":
                return result += 1 === number ? "minuta" : 2 === number ? "minuti" : 3 === number || 4 === number ? "minute" : "minut";

              case "h":
                return withoutSuffix ? "ena ura" : "eno uro";

              case "hh":
                return result += 1 === number ? "ura" : 2 === number ? "uri" : 3 === number || 4 === number ? "ure" : "ur";

              case "dd":
                return result += 1 === number ? "dan" : "dni";

              case "MM":
                return result += 1 === number ? "mesec" : 2 === number ? "meseca" : 3 === number || 4 === number ? "mesece" : "mesecev";

              case "yy":
                return result += 1 === number ? "leto" : 2 === number ? "leti" : 3 === number || 4 === number ? "leta" : "let";
            }
        }
        return moment.defineLocale("sl", {
            months: "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
            weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
            weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split("_"),
            weekdaysMin: "ne_po_to_sr_če_pe_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danes ob] LT",
                nextDay: "[jutri ob] LT",
                nextWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[v] [nedeljo] [ob] LT";

                      case 3:
                        return "[v] [sredo] [ob] LT";

                      case 6:
                        return "[v] [soboto] [ob] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[v] dddd [ob] LT";
                    }
                },
                lastDay: "[včeraj ob] LT",
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                      case 3:
                      case 6:
                        return "[prejšnja] dddd [ob] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[prejšnji] dddd [ob] LT";
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "čez %s",
                past: "%s nazaj",
                s: "nekaj sekund",
                m: translate,
                mm: translate,
                h: translate,
                hh: translate,
                d: "en dan",
                dd: translate,
                M: "en mesec",
                MM: translate,
                y: "eno leto",
                yy: translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("sq", {
            months: "Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),
            monthsShort: "Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),
            weekdays: "E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),
            weekdaysShort: "Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),
            weekdaysMin: "D_H_Ma_Më_E_P_Sh".split("_"),
            meridiem: function(hours) {
                return 12 > hours ? "PD" : "MD";
            },
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Sot në] LT",
                nextDay: "[Nesër në] LT",
                nextWeek: "dddd [në] LT",
                lastDay: "[Dje në] LT",
                lastWeek: "dddd [e kaluar në] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "në %s",
                past: "%s më parë",
                s: "disa sekonda",
                m: "një minutë",
                mm: "%d minuta",
                h: "një orë",
                hh: "%d orë",
                d: "një ditë",
                dd: "%d ditë",
                M: "një muaj",
                MM: "%d muaj",
                y: "një vit",
                yy: "%d vite"
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var translator = {
            words: {
                m: [ "један минут", "једне минуте" ],
                mm: [ "минут", "минуте", "минута" ],
                h: [ "један сат", "једног сата" ],
                hh: [ "сат", "сата", "сати" ],
                dd: [ "дан", "дана", "дана" ],
                MM: [ "месец", "месеца", "месеци" ],
                yy: [ "година", "године", "година" ]
            },
            correctGrammaticalCase: function(number, wordKey) {
                return 1 === number ? wordKey[0] : number >= 2 && 4 >= number ? wordKey[1] : wordKey[2];
            },
            translate: function(number, withoutSuffix, key) {
                var wordKey = translator.words[key];
                return 1 === key.length ? withoutSuffix ? wordKey[0] : wordKey[1] : number + " " + translator.correctGrammaticalCase(number, wordKey);
            }
        };
        return moment.defineLocale("sr-cyrl", {
            months: [ "јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар" ],
            monthsShort: [ "јан.", "феб.", "мар.", "апр.", "мај", "јун", "јул", "авг.", "сеп.", "окт.", "нов.", "дец." ],
            weekdays: [ "недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота" ],
            weekdaysShort: [ "нед.", "пон.", "уто.", "сре.", "чет.", "пет.", "суб." ],
            weekdaysMin: [ "не", "по", "ут", "ср", "че", "пе", "су" ],
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[данас у] LT",
                nextDay: "[сутра у] LT",
                nextWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[у] [недељу] [у] LT";

                      case 3:
                        return "[у] [среду] [у] LT";

                      case 6:
                        return "[у] [суботу] [у] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[у] dddd [у] LT";
                    }
                },
                lastDay: "[јуче у] LT",
                lastWeek: function() {
                    var lastWeekDays = [ "[прошле] [недеље] [у] LT", "[прошлог] [понедељка] [у] LT", "[прошлог] [уторка] [у] LT", "[прошле] [среде] [у] LT", "[прошлог] [четвртка] [у] LT", "[прошлог] [петка] [у] LT", "[прошле] [суботе] [у] LT" ];
                    return lastWeekDays[this.day()];
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "за %s",
                past: "пре %s",
                s: "неколико секунди",
                m: translator.translate,
                mm: translator.translate,
                h: translator.translate,
                hh: translator.translate,
                d: "дан",
                dd: translator.translate,
                M: "месец",
                MM: translator.translate,
                y: "годину",
                yy: translator.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var translator = {
            words: {
                m: [ "jedan minut", "jedne minute" ],
                mm: [ "minut", "minute", "minuta" ],
                h: [ "jedan sat", "jednog sata" ],
                hh: [ "sat", "sata", "sati" ],
                dd: [ "dan", "dana", "dana" ],
                MM: [ "mesec", "meseca", "meseci" ],
                yy: [ "godina", "godine", "godina" ]
            },
            correctGrammaticalCase: function(number, wordKey) {
                return 1 === number ? wordKey[0] : number >= 2 && 4 >= number ? wordKey[1] : wordKey[2];
            },
            translate: function(number, withoutSuffix, key) {
                var wordKey = translator.words[key];
                return 1 === key.length ? withoutSuffix ? wordKey[0] : wordKey[1] : number + " " + translator.correctGrammaticalCase(number, wordKey);
            }
        };
        return moment.defineLocale("sr", {
            months: [ "januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar" ],
            monthsShort: [ "jan.", "feb.", "mar.", "apr.", "maj", "jun", "jul", "avg.", "sep.", "okt.", "nov.", "dec." ],
            weekdays: [ "nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota" ],
            weekdaysShort: [ "ned.", "pon.", "uto.", "sre.", "čet.", "pet.", "sub." ],
            weekdaysMin: [ "ne", "po", "ut", "sr", "če", "pe", "su" ],
            longDateFormat: {
                LT: "H:mm",
                LTS: "LT:ss",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                      case 0:
                        return "[u] [nedelju] [u] LT";

                      case 3:
                        return "[u] [sredu] [u] LT";

                      case 6:
                        return "[u] [subotu] [u] LT";

                      case 1:
                      case 2:
                      case 4:
                      case 5:
                        return "[u] dddd [u] LT";
                    }
                },
                lastDay: "[juče u] LT",
                lastWeek: function() {
                    var lastWeekDays = [ "[prošle] [nedelje] [u] LT", "[prošlog] [ponedeljka] [u] LT", "[prošlog] [utorka] [u] LT", "[prošle] [srede] [u] LT", "[prošlog] [četvrtka] [u] LT", "[prošlog] [petka] [u] LT", "[prošle] [subote] [u] LT" ];
                    return lastWeekDays[this.day()];
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "pre %s",
                s: "nekoliko sekundi",
                m: translator.translate,
                mm: translator.translate,
                h: translator.translate,
                hh: translator.translate,
                d: "dan",
                dd: translator.translate,
                M: "mesec",
                MM: translator.translate,
                y: "godinu",
                yy: translator.translate
            },
            ordinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("sv", {
            months: "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
            weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split("_"),
            weekdaysMin: "sö_må_ti_on_to_fr_lö".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "YYYY-MM-DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Idag] LT",
                nextDay: "[Imorgon] LT",
                lastDay: "[Igår] LT",
                nextWeek: "dddd LT",
                lastWeek: "[Förra] dddd[en] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "för %s sedan",
                s: "några sekunder",
                m: "en minut",
                mm: "%d minuter",
                h: "en timme",
                hh: "%d timmar",
                d: "en dag",
                dd: "%d dagar",
                M: "en månad",
                MM: "%d månader",
                y: "ett år",
                yy: "%d år"
            },
            ordinalParse: /\d{1,2}(e|a)/,
            ordinal: function(number) {
                var b = number % 10, output = 1 === ~~(number % 100 / 10) ? "e" : 1 === b ? "a" : 2 === b ? "a" : "e";
                return number + output;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("ta", {
            months: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            monthsShort: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            weekdays: "ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),
            weekdaysShort: "ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),
            weekdaysMin: "ஞா_தி_செ_பு_வி_வெ_ச".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[இன்று] LT",
                nextDay: "[நாளை] LT",
                nextWeek: "dddd, LT",
                lastDay: "[நேற்று] LT",
                lastWeek: "[கடந்த வாரம்] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s இல்",
                past: "%s முன்",
                s: "ஒரு சில விநாடிகள்",
                m: "ஒரு நிமிடம்",
                mm: "%d நிமிடங்கள்",
                h: "ஒரு மணி நேரம்",
                hh: "%d மணி நேரம்",
                d: "ஒரு நாள்",
                dd: "%d நாட்கள்",
                M: "ஒரு மாதம்",
                MM: "%d மாதங்கள்",
                y: "ஒரு வருடம்",
                yy: "%d ஆண்டுகள்"
            },
            ordinalParse: /\d{1,2}வது/,
            ordinal: function(number) {
                return number + "வது";
            },
            meridiem: function(hour) {
                return hour >= 6 && 10 >= hour ? " காலை" : hour >= 10 && 14 >= hour ? " நண்பகல்" : hour >= 14 && 18 >= hour ? " எற்பாடு" : hour >= 18 && 20 >= hour ? " மாலை" : hour >= 20 && 24 >= hour ? " இரவு" : hour >= 0 && 6 >= hour ? " வைகறை" : void 0;
            },
            week: {
                dow: 0,
                doy: 6
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("th", {
            months: "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),
            monthsShort: "มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),
            weekdays: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
            weekdaysShort: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),
            weekdaysMin: "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
            longDateFormat: {
                LT: "H นาฬิกา m นาที",
                LTS: "LT s วินาที",
                L: "YYYY/MM/DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY เวลา LT",
                LLLL: "วันddddที่ D MMMM YYYY เวลา LT"
            },
            meridiem: function(hour) {
                return 12 > hour ? "ก่อนเที่ยง" : "หลังเที่ยง";
            },
            calendar: {
                sameDay: "[วันนี้ เวลา] LT",
                nextDay: "[พรุ่งนี้ เวลา] LT",
                nextWeek: "dddd[หน้า เวลา] LT",
                lastDay: "[เมื่อวานนี้ เวลา] LT",
                lastWeek: "[วัน]dddd[ที่แล้ว เวลา] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "อีก %s",
                past: "%sที่แล้ว",
                s: "ไม่กี่วินาที",
                m: "1 นาที",
                mm: "%d นาที",
                h: "1 ชั่วโมง",
                hh: "%d ชั่วโมง",
                d: "1 วัน",
                dd: "%d วัน",
                M: "1 เดือน",
                MM: "%d เดือน",
                y: "1 ปี",
                yy: "%d ปี"
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("tl-ph", {
            months: "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),
            monthsShort: "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),
            weekdays: "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),
            weekdaysShort: "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),
            weekdaysMin: "Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "MM/D/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY LT",
                LLLL: "dddd, MMMM DD, YYYY LT"
            },
            calendar: {
                sameDay: "[Ngayon sa] LT",
                nextDay: "[Bukas sa] LT",
                nextWeek: "dddd [sa] LT",
                lastDay: "[Kahapon sa] LT",
                lastWeek: "dddd [huling linggo] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "sa loob ng %s",
                past: "%s ang nakalipas",
                s: "ilang segundo",
                m: "isang minuto",
                mm: "%d minuto",
                h: "isang oras",
                hh: "%d oras",
                d: "isang araw",
                dd: "%d araw",
                M: "isang buwan",
                MM: "%d buwan",
                y: "isang taon",
                yy: "%d taon"
            },
            ordinalParse: /\d{1,2}/,
            ordinal: function(number) {
                return number;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        var suffixes = {
            1: "'inci",
            5: "'inci",
            8: "'inci",
            70: "'inci",
            80: "'inci",
            2: "'nci",
            7: "'nci",
            20: "'nci",
            50: "'nci",
            3: "'üncü",
            4: "'üncü",
            100: "'üncü",
            6: "'ncı",
            9: "'uncu",
            10: "'uncu",
            30: "'uncu",
            60: "'ıncı",
            90: "'ıncı"
        };
        return moment.defineLocale("tr", {
            months: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
            monthsShort: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
            weekdays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
            weekdaysShort: "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
            weekdaysMin: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[bugün saat] LT",
                nextDay: "[yarın saat] LT",
                nextWeek: "[haftaya] dddd [saat] LT",
                lastDay: "[dün] LT",
                lastWeek: "[geçen hafta] dddd [saat] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s sonra",
                past: "%s önce",
                s: "birkaç saniye",
                m: "bir dakika",
                mm: "%d dakika",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir yıl",
                yy: "%d yıl"
            },
            ordinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
            ordinal: function(number) {
                if (0 === number) return number + "'ıncı";
                var a = number % 10, b = number % 100 - a, c = number >= 100 ? 100 : null;
                return number + (suffixes[a] || suffixes[b] || suffixes[c]);
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("tzm-latn", {
            months: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            monthsShort: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            weekdays: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysShort: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysMin: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[asdkh g] LT",
                nextDay: "[aska g] LT",
                nextWeek: "dddd [g] LT",
                lastDay: "[assant g] LT",
                lastWeek: "dddd [g] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dadkh s yan %s",
                past: "yan %s",
                s: "imik",
                m: "minuḍ",
                mm: "%d minuḍ",
                h: "saɛa",
                hh: "%d tassaɛin",
                d: "ass",
                dd: "%d ossan",
                M: "ayowr",
                MM: "%d iyyirn",
                y: "asgas",
                yy: "%d isgasn"
            },
            week: {
                dow: 6,
                doy: 12
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("tzm", {
            months: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            monthsShort: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            weekdays: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysShort: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysMin: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[ⴰⵙⴷⵅ ⴴ] LT",
                nextDay: "[ⴰⵙⴽⴰ ⴴ] LT",
                nextWeek: "dddd [ⴴ] LT",
                lastDay: "[ⴰⵚⴰⵏⵜ ⴴ] LT",
                lastWeek: "dddd [ⴴ] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
                past: "ⵢⴰⵏ %s",
                s: "ⵉⵎⵉⴽ",
                m: "ⵎⵉⵏⵓⴺ",
                mm: "%d ⵎⵉⵏⵓⴺ",
                h: "ⵙⴰⵄⴰ",
                hh: "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
                d: "ⴰⵙⵙ",
                dd: "%d oⵙⵙⴰⵏ",
                M: "ⴰⵢoⵓⵔ",
                MM: "%d ⵉⵢⵢⵉⵔⵏ",
                y: "ⴰⵙⴳⴰⵙ",
                yy: "%d ⵉⵙⴳⴰⵙⵏ"
            },
            week: {
                dow: 6,
                doy: 12
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        function plural(word, num) {
            var forms = word.split("_");
            return num % 10 === 1 && num % 100 !== 11 ? forms[0] : num % 10 >= 2 && 4 >= num % 10 && (10 > num % 100 || num % 100 >= 20) ? forms[1] : forms[2];
        }
        function relativeTimeWithPlural(number, withoutSuffix, key) {
            var format = {
                mm: "хвилина_хвилини_хвилин",
                hh: "година_години_годин",
                dd: "день_дні_днів",
                MM: "місяць_місяці_місяців",
                yy: "рік_роки_років"
            };
            return "m" === key ? withoutSuffix ? "хвилина" : "хвилину" : "h" === key ? withoutSuffix ? "година" : "годину" : number + " " + plural(format[key], +number);
        }
        function monthsCaseReplace(m, format) {
            var months = {
                nominative: "січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),
                accusative: "січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")
            }, nounCase = /D[oD]? *MMMM?/.test(format) ? "accusative" : "nominative";
            return months[nounCase][m.month()];
        }
        function weekdaysCaseReplace(m, format) {
            var weekdays = {
                nominative: "неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),
                accusative: "неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),
                genitive: "неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")
            }, nounCase = /(\[[ВвУу]\]) ?dddd/.test(format) ? "accusative" : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(format) ? "genitive" : "nominative";
            return weekdays[nounCase][m.day()];
        }
        function processHoursFunction(str) {
            return function() {
                return str + "о" + (11 === this.hours() ? "б" : "") + "] LT";
            };
        }
        return moment.defineLocale("uk", {
            months: monthsCaseReplace,
            monthsShort: "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),
            weekdays: weekdaysCaseReplace,
            weekdaysShort: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY р.",
                LLL: "D MMMM YYYY р., LT",
                LLLL: "dddd, D MMMM YYYY р., LT"
            },
            calendar: {
                sameDay: processHoursFunction("[Сьогодні "),
                nextDay: processHoursFunction("[Завтра "),
                lastDay: processHoursFunction("[Вчора "),
                nextWeek: processHoursFunction("[У] dddd ["),
                lastWeek: function() {
                    switch (this.day()) {
                      case 0:
                      case 3:
                      case 5:
                      case 6:
                        return processHoursFunction("[Минулої] dddd [").call(this);

                      case 1:
                      case 2:
                      case 4:
                        return processHoursFunction("[Минулого] dddd [").call(this);
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "за %s",
                past: "%s тому",
                s: "декілька секунд",
                m: relativeTimeWithPlural,
                mm: relativeTimeWithPlural,
                h: "годину",
                hh: relativeTimeWithPlural,
                d: "день",
                dd: relativeTimeWithPlural,
                M: "місяць",
                MM: relativeTimeWithPlural,
                y: "рік",
                yy: relativeTimeWithPlural
            },
            meridiem: function(hour) {
                return 4 > hour ? "ночі" : 12 > hour ? "ранку" : 17 > hour ? "дня" : "вечора";
            },
            ordinalParse: /\d{1,2}-(й|го)/,
            ordinal: function(number, period) {
                switch (period) {
                  case "M":
                  case "d":
                  case "DDD":
                  case "w":
                  case "W":
                    return number + "-й";

                  case "D":
                    return number + "-го";

                  default:
                    return number;
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("uz", {
            months: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
            monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
            weekdays: "Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),
            weekdaysShort: "Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),
            weekdaysMin: "Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "D MMMM YYYY, dddd LT"
            },
            calendar: {
                sameDay: "[Бугун соат] LT [да]",
                nextDay: "[Эртага] LT [да]",
                nextWeek: "dddd [куни соат] LT [да]",
                lastDay: "[Кеча соат] LT [да]",
                lastWeek: "[Утган] dddd [куни соат] LT [да]",
                sameElse: "L"
            },
            relativeTime: {
                future: "Якин %s ичида",
                past: "Бир неча %s олдин",
                s: "фурсат",
                m: "бир дакика",
                mm: "%d дакика",
                h: "бир соат",
                hh: "%d соат",
                d: "бир кун",
                dd: "%d кун",
                M: "бир ой",
                MM: "%d ой",
                y: "бир йил",
                yy: "%d йил"
            },
            week: {
                dow: 1,
                doy: 7
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("vi", {
            months: "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),
            monthsShort: "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),
            weekdays: "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),
            weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "LT:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM [năm] YYYY",
                LLL: "D MMMM [năm] YYYY LT",
                LLLL: "dddd, D MMMM [năm] YYYY LT",
                l: "DD/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY LT",
                llll: "ddd, D MMM YYYY LT"
            },
            calendar: {
                sameDay: "[Hôm nay lúc] LT",
                nextDay: "[Ngày mai lúc] LT",
                nextWeek: "dddd [tuần tới lúc] LT",
                lastDay: "[Hôm qua lúc] LT",
                lastWeek: "dddd [tuần rồi lúc] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s tới",
                past: "%s trước",
                s: "vài giây",
                m: "một phút",
                mm: "%d phút",
                h: "một giờ",
                hh: "%d giờ",
                d: "một ngày",
                dd: "%d ngày",
                M: "một tháng",
                MM: "%d tháng",
                y: "một năm",
                yy: "%d năm"
            },
            ordinalParse: /\d{1,2}/,
            ordinal: function(number) {
                return number;
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("zh-cn", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "Ah点mm",
                LTS: "Ah点m分s秒",
                L: "YYYY-MM-DD",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日LT",
                LLLL: "YYYY年MMMD日ddddLT",
                l: "YYYY-MM-DD",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日LT",
                llll: "YYYY年MMMD日ddddLT"
            },
            meridiem: function(hour, minute) {
                var hm = 100 * hour + minute;
                return 600 > hm ? "凌晨" : 900 > hm ? "早上" : 1130 > hm ? "上午" : 1230 > hm ? "中午" : 1800 > hm ? "下午" : "晚上";
            },
            calendar: {
                sameDay: function() {
                    return 0 === this.minutes() ? "[今天]Ah[点整]" : "[今天]LT";
                },
                nextDay: function() {
                    return 0 === this.minutes() ? "[明天]Ah[点整]" : "[明天]LT";
                },
                lastDay: function() {
                    return 0 === this.minutes() ? "[昨天]Ah[点整]" : "[昨天]LT";
                },
                nextWeek: function() {
                    var startOfWeek, prefix;
                    return startOfWeek = moment().startOf("week"), prefix = this.unix() - startOfWeek.unix() >= 604800 ? "[下]" : "[本]", 
                    0 === this.minutes() ? prefix + "dddAh点整" : prefix + "dddAh点mm";
                },
                lastWeek: function() {
                    var startOfWeek, prefix;
                    return startOfWeek = moment().startOf("week"), prefix = this.unix() < startOfWeek.unix() ? "[上]" : "[本]", 
                    0 === this.minutes() ? prefix + "dddAh点整" : prefix + "dddAh点mm";
                },
                sameElse: "LL"
            },
            ordinalParse: /\d{1,2}(日|月|周)/,
            ordinal: function(number, period) {
                switch (period) {
                  case "d":
                  case "D":
                  case "DDD":
                    return number + "日";

                  case "M":
                    return number + "月";

                  case "w":
                  case "W":
                    return number + "周";

                  default:
                    return number;
                }
            },
            relativeTime: {
                future: "%s内",
                past: "%s前",
                s: "几秒",
                m: "1分钟",
                mm: "%d分钟",
                h: "1小时",
                hh: "%d小时",
                d: "1天",
                dd: "%d天",
                M: "1个月",
                MM: "%d个月",
                y: "1年",
                yy: "%d年"
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
    }), function(factory) {
        factory(moment);
    }(function(moment) {
        return moment.defineLocale("zh-tw", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "Ah點mm",
                LTS: "Ah點m分s秒",
                L: "YYYY年MMMD日",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日LT",
                LLLL: "YYYY年MMMD日ddddLT",
                l: "YYYY年MMMD日",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日LT",
                llll: "YYYY年MMMD日ddddLT"
            },
            meridiem: function(hour, minute) {
                var hm = 100 * hour + minute;
                return 900 > hm ? "早上" : 1130 > hm ? "上午" : 1230 > hm ? "中午" : 1800 > hm ? "下午" : "晚上";
            },
            calendar: {
                sameDay: "[今天]LT",
                nextDay: "[明天]LT",
                nextWeek: "[下]ddddLT",
                lastDay: "[昨天]LT",
                lastWeek: "[上]ddddLT",
                sameElse: "L"
            },
            ordinalParse: /\d{1,2}(日|月|週)/,
            ordinal: function(number, period) {
                switch (period) {
                  case "d":
                  case "D":
                  case "DDD":
                    return number + "日";

                  case "M":
                    return number + "月";

                  case "w":
                  case "W":
                    return number + "週";

                  default:
                    return number;
                }
            },
            relativeTime: {
                future: "%s內",
                past: "%s前",
                s: "幾秒",
                m: "一分鐘",
                mm: "%d分鐘",
                h: "一小時",
                hh: "%d小時",
                d: "一天",
                dd: "%d天",
                M: "一個月",
                MM: "%d個月",
                y: "一年",
                yy: "%d年"
            }
        });
    }), moment.locale("en"), hasModule ? module.exports = moment : "function" == typeof define && define.amd ? (define("moment", function(require, exports, module) {
        return module.config && module.config() && module.config().noGlobal === !0 && (globalScope.moment = oldGlobalMoment), 
        moment;
    }), makeGlobal(!0)) : makeGlobal();
}.call(this), function() {
    "use strict";
    function angularMoment(angular, moment) {
        return angular.module("angularMoment", []).constant("angularMomentConfig", {
            preprocess: null,
            timezone: "",
            format: null
        }).constant("moment", moment).constant("amTimeAgoConfig", {
            withoutSuffix: !1,
            serverTime: null,
            titleFormat: null
        }).directive("amTimeAgo", [ "$window", "moment", "amMoment", "amTimeAgoConfig", "angularMomentConfig", function($window, moment, amMoment, amTimeAgoConfig, angularMomentConfig) {
            return function(scope, element, attr) {
                function getNow() {
                    var now;
                    if (amTimeAgoConfig.serverTime) {
                        var localNow = new Date().getTime(), nowMillis = localNow - localDate + amTimeAgoConfig.serverTime;
                        now = moment(nowMillis);
                    } else now = moment();
                    return now;
                }
                function cancelTimer() {
                    activeTimeout && ($window.clearTimeout(activeTimeout), activeTimeout = null);
                }
                function updateTime(momentInstance) {
                    if (element.text(momentInstance.from(getNow(), withoutSuffix)), titleFormat && !element.attr("title") && element.attr("title", momentInstance.local().format(titleFormat)), 
                    !isBindOnce) {
                        var howOld = Math.abs(getNow().diff(momentInstance, "minute")), secondsUntilUpdate = 3600;
                        1 > howOld ? secondsUntilUpdate = 1 : 60 > howOld ? secondsUntilUpdate = 30 : 180 > howOld && (secondsUntilUpdate = 300), 
                        activeTimeout = $window.setTimeout(function() {
                            updateTime(momentInstance);
                        }, 1e3 * secondsUntilUpdate);
                    }
                }
                function updateDateTimeAttr(value) {
                    isTimeElement && element.attr("datetime", value);
                }
                function updateMoment() {
                    if (cancelTimer(), currentValue) {
                        var momentValue = amMoment.preprocessDate(currentValue, preprocess, currentFormat);
                        updateTime(momentValue), updateDateTimeAttr(momentValue.toISOString());
                    }
                }
                var currentValue, unwatchChanges, activeTimeout = null, currentFormat = angularMomentConfig.format, withoutSuffix = amTimeAgoConfig.withoutSuffix, titleFormat = amTimeAgoConfig.titleFormat, localDate = new Date().getTime(), preprocess = angularMomentConfig.preprocess, modelName = attr.amTimeAgo.replace(/^::/, ""), isBindOnce = 0 === attr.amTimeAgo.indexOf("::"), isTimeElement = "TIME" === element[0].nodeName.toUpperCase();
                unwatchChanges = scope.$watch(modelName, function(value) {
                    return "undefined" == typeof value || null === value || "" === value ? (cancelTimer(), 
                    void (currentValue && (element.text(""), updateDateTimeAttr(""), currentValue = null))) : (currentValue = value, 
                    updateMoment(), void (void 0 !== value && isBindOnce && unwatchChanges()));
                }), angular.isDefined(attr.amWithoutSuffix) && scope.$watch(attr.amWithoutSuffix, function(value) {
                    "boolean" == typeof value ? (withoutSuffix = value, updateMoment()) : withoutSuffix = amTimeAgoConfig.withoutSuffix;
                }), attr.$observe("amFormat", function(format) {
                    "undefined" != typeof format && (currentFormat = format, updateMoment());
                }), attr.$observe("amPreprocess", function(newValue) {
                    preprocess = newValue, updateMoment();
                }), scope.$on("$destroy", function() {
                    cancelTimer();
                }), scope.$on("amMoment:localeChanged", function() {
                    updateMoment();
                });
            };
        } ]).service("amMoment", [ "moment", "$rootScope", "$log", "angularMomentConfig", function(moment, $rootScope, $log, angularMomentConfig) {
            var that = this;
            this.preprocessors = {
                utc: moment.utc,
                unix: moment.unix
            }, this.changeLocale = function(locale) {
                var result = (moment.locale || moment.lang)(locale);
                return angular.isDefined(locale) && ($rootScope.$broadcast("amMoment:localeChanged"), 
                $rootScope.$broadcast("amMoment:languageChange")), result;
            }, this.changeLanguage = function(lang) {
                return $log.warn("angular-moment: Usage of amMoment.changeLanguage() is deprecated. Please use changeLocale()"), 
                that.changeLocale(lang);
            }, this.preprocessDate = function(value, preprocess, format) {
                return angular.isUndefined(preprocess) && (preprocess = angularMomentConfig.preprocess), 
                this.preprocessors[preprocess] ? this.preprocessors[preprocess](value, format) : (preprocess && $log.warn("angular-moment: Ignoring unsupported value for preprocess: " + preprocess), 
                !isNaN(parseFloat(value)) && isFinite(value) ? moment(parseInt(value, 10)) : moment(value, format));
            }, this.applyTimezone = function(aMoment) {
                var timezone = angularMomentConfig.timezone;
                return aMoment && timezone && (aMoment.tz ? aMoment = aMoment.tz(timezone) : $log.warn("angular-moment: timezone specified but moment.tz() is undefined. Did you forget to include moment-timezone.js?")), 
                aMoment;
            };
        } ]).filter("amCalendar", [ "moment", "amMoment", function(moment, amMoment) {
            return function(value, preprocess) {
                if ("undefined" == typeof value || null === value) return "";
                value = amMoment.preprocessDate(value, preprocess);
                var date = moment(value);
                return date.isValid() ? amMoment.applyTimezone(date).calendar() : "";
            };
        } ]).filter("amDateFormat", [ "moment", "amMoment", function(moment, amMoment) {
            return function(value, format, preprocess) {
                if ("undefined" == typeof value || null === value) return "";
                value = amMoment.preprocessDate(value, preprocess);
                var date = moment(value);
                return date.isValid() ? amMoment.applyTimezone(date).format(format) : "";
            };
        } ]).filter("amDurationFormat", [ "moment", function(moment) {
            return function(value, format, suffix) {
                return "undefined" == typeof value || null === value ? "" : moment.duration(value, format).humanize(suffix);
            };
        } ]).filter("amTimeAgo", [ "moment", "amMoment", function(moment, amMoment) {
            return function(value, preprocess, suffix) {
                if ("undefined" == typeof value || null === value) return "";
                value = amMoment.preprocessDate(value, preprocess);
                var date = moment(value);
                return date.isValid() ? amMoment.applyTimezone(date).fromNow(suffix) : "";
            };
        } ]);
    }
    "function" == typeof define && define.amd ? define("angular-moment", [ "angular", "moment" ], angularMoment) : "undefined" != typeof module && module && module.exports ? angularMoment(angular, require("moment")) : angularMoment(angular, window.moment);
}(), function(define) {
    define([ "jquery" ], function($) {
        return function() {
            function error(message, title, optionsOverride) {
                return notify({
                    type: toastType.error,
                    iconClass: getOptions().iconClasses.error,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }
            function getContainer(options, create) {
                return options || (options = getOptions()), $container = $("#" + options.containerId), 
                $container.length ? $container : (create && ($container = createContainer(options)), 
                $container);
            }
            function info(message, title, optionsOverride) {
                return notify({
                    type: toastType.info,
                    iconClass: getOptions().iconClasses.info,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }
            function subscribe(callback) {
                listener = callback;
            }
            function success(message, title, optionsOverride) {
                return notify({
                    type: toastType.success,
                    iconClass: getOptions().iconClasses.success,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }
            function warning(message, title, optionsOverride) {
                return notify({
                    type: toastType.warning,
                    iconClass: getOptions().iconClasses.warning,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }
            function clear($toastElement) {
                var options = getOptions();
                $container || getContainer(options), clearToast($toastElement, options) || clearContainer(options);
            }
            function remove($toastElement) {
                var options = getOptions();
                return $container || getContainer(options), $toastElement && 0 === $(":focus", $toastElement).length ? void removeToast($toastElement) : void ($container.children().length && $container.remove());
            }
            function clearContainer(options) {
                for (var toastsToClear = $container.children(), i = toastsToClear.length - 1; i >= 0; i--) clearToast($(toastsToClear[i]), options);
            }
            function clearToast($toastElement, options) {
                return $toastElement && 0 === $(":focus", $toastElement).length ? ($toastElement[options.hideMethod]({
                    duration: options.hideDuration,
                    easing: options.hideEasing,
                    complete: function() {
                        removeToast($toastElement);
                    }
                }), !0) : !1;
            }
            function createContainer(options) {
                return $container = $("<div/>").attr("id", options.containerId).addClass(options.positionClass).attr("aria-live", "polite").attr("role", "alert"), 
                $container.appendTo($(options.target)), $container;
            }
            function getDefaults() {
                return {
                    tapToDismiss: !0,
                    toastClass: "toast",
                    containerId: "toast-container",
                    debug: !1,
                    showMethod: "fadeIn",
                    showDuration: 300,
                    showEasing: "swing",
                    onShown: void 0,
                    hideMethod: "fadeOut",
                    hideDuration: 1e3,
                    hideEasing: "swing",
                    onHidden: void 0,
                    extendedTimeOut: 1e3,
                    iconClasses: {
                        error: "toast-error",
                        info: "toast-info",
                        success: "toast-success",
                        warning: "toast-warning"
                    },
                    iconClass: "toast-info",
                    positionClass: "toast-top-right",
                    timeOut: 5e3,
                    titleClass: "toast-title",
                    messageClass: "toast-message",
                    target: "body",
                    closeHtml: "<button>&times;</button>",
                    newestOnTop: !0,
                    preventDuplicates: !1,
                    progressBar: !1
                };
            }
            function publish(args) {
                listener && listener(args);
            }
            function notify(map) {
                function hideToast(override) {
                    return !$(":focus", $toastElement).length || override ? (clearTimeout(progressBar.intervalId), 
                    $toastElement[options.hideMethod]({
                        duration: options.hideDuration,
                        easing: options.hideEasing,
                        complete: function() {
                            removeToast($toastElement), options.onHidden && "hidden" !== response.state && options.onHidden(), 
                            response.state = "hidden", response.endTime = new Date(), publish(response);
                        }
                    })) : void 0;
                }
                function delayedHideToast() {
                    (options.timeOut > 0 || options.extendedTimeOut > 0) && (intervalId = setTimeout(hideToast, options.extendedTimeOut), 
                    progressBar.maxHideTime = parseFloat(options.extendedTimeOut), progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime);
                }
                function stickAround() {
                    clearTimeout(intervalId), progressBar.hideEta = 0, $toastElement.stop(!0, !0)[options.showMethod]({
                        duration: options.showDuration,
                        easing: options.showEasing
                    });
                }
                function updateProgress() {
                    var percentage = (progressBar.hideEta - new Date().getTime()) / progressBar.maxHideTime * 100;
                    $progressElement.width(percentage + "%");
                }
                var options = getOptions(), iconClass = map.iconClass || options.iconClass;
                if (options.preventDuplicates) {
                    if (map.message === previousToast) return;
                    previousToast = map.message;
                }
                "undefined" != typeof map.optionsOverride && (options = $.extend(options, map.optionsOverride), 
                iconClass = map.optionsOverride.iconClass || iconClass), toastId++, $container = getContainer(options, !0);
                var intervalId = null, $toastElement = $("<div/>"), $titleElement = $("<div/>"), $messageElement = $("<div/>"), $progressElement = $("<div/>"), $closeElement = $(options.closeHtml), progressBar = {
                    intervalId: null,
                    hideEta: null,
                    maxHideTime: null
                }, response = {
                    toastId: toastId,
                    state: "visible",
                    startTime: new Date(),
                    options: options,
                    map: map
                };
                return map.iconClass && $toastElement.addClass(options.toastClass).addClass(iconClass), 
                map.title && ($titleElement.append(map.title).addClass(options.titleClass), $toastElement.append($titleElement)), 
                map.message && ($messageElement.append(map.message).addClass(options.messageClass), 
                $toastElement.append($messageElement)), options.closeButton && ($closeElement.addClass("toast-close-button").attr("role", "button"), 
                $toastElement.prepend($closeElement)), options.progressBar && ($progressElement.addClass("toast-progress"), 
                $toastElement.prepend($progressElement)), $toastElement.hide(), options.newestOnTop ? $container.prepend($toastElement) : $container.append($toastElement), 
                $toastElement[options.showMethod]({
                    duration: options.showDuration,
                    easing: options.showEasing,
                    complete: options.onShown
                }), options.timeOut > 0 && (intervalId = setTimeout(hideToast, options.timeOut), 
                progressBar.maxHideTime = parseFloat(options.timeOut), progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime, 
                options.progressBar && (progressBar.intervalId = setInterval(updateProgress, 10))), 
                $toastElement.hover(stickAround, delayedHideToast), !options.onclick && options.tapToDismiss && $toastElement.click(hideToast), 
                options.closeButton && $closeElement && $closeElement.click(function(event) {
                    event.stopPropagation ? event.stopPropagation() : void 0 !== event.cancelBubble && event.cancelBubble !== !0 && (event.cancelBubble = !0), 
                    hideToast(!0);
                }), options.onclick && $toastElement.click(function() {
                    options.onclick(), hideToast();
                }), publish(response), options.debug && console && console.log(response), $toastElement;
            }
            function getOptions() {
                return $.extend({}, getDefaults(), toastr.options);
            }
            function removeToast($toastElement) {
                $container || ($container = getContainer()), $toastElement.is(":visible") || ($toastElement.remove(), 
                $toastElement = null, 0 === $container.children().length && $container.remove());
            }
            var $container, listener, previousToast, toastId = 0, toastType = {
                error: "error",
                info: "info",
                success: "success",
                warning: "warning"
            }, toastr = {
                clear: clear,
                remove: remove,
                error: error,
                getContainer: getContainer,
                info: info,
                options: {},
                subscribe: subscribe,
                success: success,
                version: "2.1.0",
                warning: warning
            };
            return toastr;
        }();
    });
}("function" == typeof define && define.amd ? define : function(deps, factory) {
    "undefined" != typeof module && module.exports ? module.exports = factory(require("jquery")) : window.toastr = factory(window.jQuery);
}), angular.module("toastr", []).directive("toast", [ "$compile", "$interval", "toastr", function($compile, $interval, toastr) {
    return {
        replace: !0,
        templateUrl: "templates/toastr/toastr.html",
        link: function(scope, element) {
            function createTimeout(time) {
                return $interval(function() {
                    toastr.remove(scope.toastId);
                }, time, 1);
            }
            var timeout;
            if (scope.toastClass = scope.options.toastClass, scope.titleClass = scope.options.titleClass, 
            scope.messageClass = scope.options.messageClass, scope.options.closeHtml) {
                var button = angular.element(scope.options.closeHtml);
                button.addClass("toast-close-button"), button.attr("ng-click", "close()"), $compile(button)(scope), 
                element.prepend(button);
            }
            scope.init = function() {
                scope.options.timeOut && (timeout = createTimeout(scope.options.timeOut));
            }, element.on("mouseenter", function() {
                timeout && $interval.cancel(timeout);
            }), scope.tapToast = function() {
                scope.options.tapToDismiss && scope.close();
            }, scope.close = function() {
                toastr.remove(scope.toastId);
            }, element.on("mouseleave", function() {
                (0 !== scope.options.timeOut || 0 !== scope.options.extendedTimeOut) && (timeout = createTimeout(scope.options.extendedTimeOut));
            });
        }
    };
} ]).constant("toastrConfig", {
    allowHtml: !1,
    closeButton: !1,
    closeHtml: "<button>&times;</button>",
    containerId: "toast-container",
    extendedTimeOut: 1e3,
    iconClasses: {
        error: "toast-error",
        info: "toast-info",
        success: "toast-success",
        warning: "toast-warning"
    },
    messageClass: "toast-message",
    newestOnTop: !0,
    positionClass: "toast-top-right",
    tapToDismiss: !0,
    timeOut: 5e3,
    titleClass: "toast-title",
    toastClass: "toast"
}).factory("toastr", [ "$animate", "$compile", "$document", "$rootScope", "$sce", "toastrConfig", "$q", function($animate, $compile, $document, $rootScope, $sce, toastrConfig, $q) {
    function clear(toast) {
        if (toast) remove(toast.toastId); else for (var i = 0; i < toasts.length; i++) remove(toasts[i].toastId);
    }
    function error(message, title, optionsOverride) {
        return _notify({
            iconClass: _getOptions().iconClasses.error,
            message: message,
            optionsOverride: optionsOverride,
            title: title
        });
    }
    function info(message, title, optionsOverride) {
        return _notify({
            iconClass: _getOptions().iconClasses.info,
            message: message,
            optionsOverride: optionsOverride,
            title: title
        });
    }
    function success(message, title, optionsOverride) {
        return _notify({
            iconClass: _getOptions().iconClasses.success,
            message: message,
            optionsOverride: optionsOverride,
            title: title
        });
    }
    function warning(message, title, optionsOverride) {
        return _notify({
            iconClass: _getOptions().iconClasses.warning,
            message: message,
            optionsOverride: optionsOverride,
            title: title
        });
    }
    function _getOptions() {
        return angular.extend({}, toastrConfig);
    }
    function _setContainer(options) {
        if (container) return containerDefer.promise;
        container = angular.element("<div></div>"), container.attr("id", options.containerId), 
        container.addClass(options.positionClass), container.css({
            "pointer-events": "auto"
        });
        var body = $document.find("body").eq(0);
        return $animate.enter(container, body).then(function() {
            containerDefer.resolve();
        }), containerDefer.promise;
    }
    function _notify(map) {
        function createScope(toast, map, options) {
            options.allowHtml ? (toast.scope.allowHtml = !0, toast.scope.title = $sce.trustAsHtml(map.title), 
            toast.scope.message = $sce.trustAsHtml(map.message)) : (toast.scope.title = map.title, 
            toast.scope.message = map.message), toast.scope.toastType = toast.iconClass, toast.scope.toastId = toast.toastId, 
            toast.scope.options = {
                extendedTimeOut: options.extendedTimeOut,
                messageClass: options.messageClass,
                tapToDismiss: options.tapToDismiss,
                timeOut: options.timeOut,
                titleClass: options.titleClass,
                toastClass: options.toastClass
            }, options.closeButton && (toast.scope.options.closeHtml = options.closeHtml);
        }
        function createToast(scope) {
            var angularDomEl = angular.element("<div toast></div>");
            return $compile(angularDomEl)(scope);
        }
        var options = _getOptions(), newToast = {
            toastId: index++,
            scope: $rootScope.$new()
        };
        return newToast.iconClass = map.iconClass, map.optionsOverride && (options = angular.extend(options, map.optionsOverride), 
        newToast.iconClass = map.optionsOverride.iconClass || newToast.iconClass), createScope(newToast, map, options), 
        newToast.el = createToast(newToast.scope), toasts.push(newToast), _setContainer(options).then(function() {
            options.newestOnTop ? $animate.enter(newToast.el, container).then(function() {
                newToast.scope.init();
            }) : $animate.enter(newToast.el, container, container[0].lastChild).then(function() {
                newToast.scope.init();
            });
        }), newToast;
    }
    function remove(toastIndex) {
        function findToast(toastId) {
            for (var i = 0; i < toasts.length; i++) if (toasts[i].toastId === toastId) return toasts[i];
        }
        var toast = findToast(toastIndex);
        toast && $animate.leave(toast.el).then(function() {
            toast.scope.$destroy(), container && 0 === container.children().length && (toasts = [], 
            container.remove(), container = null, containerDefer = $q.defer());
        });
    }
    var container, index = 0, toasts = [], containerDefer = $q.defer(), toastr = {
        clear: clear,
        error: error,
        info: info,
        remove: remove,
        success: success,
        warning: warning
    };
    return toastr;
} ]), angular.module("toastr").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("templates/toastr/toastr.html", '<div class="{{toastClass}} {{toastType}}" ng-click="tapToast()">\n  <div ng-switch on="allowHtml">\n    <div ng-switch-default ng-if="title" class="{{titleClass}}">{{title}}</div>\n    <div ng-switch-default class="{{messageClass}}">{{message}}</div>\n    <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>\n    <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>\n  </div>\n</div>');
} ]);