'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.Config=undefined;var _dns=require('dns');var _dns2=_interopRequireDefault(_dns);var _fs=require('fs');var _fs2=_interopRequireDefault(_fs);var _os=require('os');var _os2=_interopRequireDefault(_os);var _net=require('net');var _net2=_interopRequireDefault(_net);var _utils=require('../utils');var _constants=require('./constants');var _dnsCache=require('./dns-cache');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function mkdir(dir){try{_fs2.default.lstatSync(dir)}catch(err){if(err.code==='ENOENT'){_fs2.default.mkdirSync(dir)}}}mkdir(_constants.BLINKSOCKS_DIR);mkdir(_constants.LOG_DIR);class Config{static validate(json){if(typeof json!=='object'||Array.isArray(json)){throw Error('Invalid configuration file')}if(typeof json.host!=='string'||json.host===''){throw Error('\'host\' must be provided and is not empty')}if(!(0,_utils.isValidPort)(json.port)){throw Error('\'port\' is invalid')}if(typeof json.servers!=='undefined'){if(!Array.isArray(json.servers)){throw Error('\'servers\' must be provided as an array')}const servers=json.servers.filter(server=>server.enabled===true);if(servers.length<1){throw Error('\'servers\' must have at least one enabled item')}servers.forEach(this.validateServer)}else{this.validateServer(json)}if(typeof json.dns!=='undefined'){if(!Array.isArray(json.dns)){throw Error('\'dns\' must be an array')}var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=json.dns[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){const ip=_step.value;if(!_net2.default.isIP(ip)){throw Error(`"${ip}" is not an ip address`)}}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}if(typeof json.redirect==='string'&&json.redirect!==''){const address=json.redirect.split(':');if(address.length!==2||!(0,_utils.isValidPort)(+address[1])){throw Error('\'redirect\' is an invalid address')}}if(typeof json.timeout!=='number'){throw Error('\'timeout\' must be a number')}if(json.timeout<1){throw Error('\'timeout\' must be greater than 0')}if(json.timeout<60){console.warn(`==> [config] 'timeout' is too short, is ${json.timeout}s expected?`)}if(typeof json.workers!=='undefined'){if(typeof json.workers!=='number'){throw Error('\'workers\' must be a number')}if(json.workers<0){throw Error('\'workers\' must be an integer')}if(json.workers>_os2.default.cpus().length){console.warn(`==> [config] 'workers' is greater than the number of cpus, is ${json.workers} workers expected?`)}}if(typeof json.dns_expire!=='undefined'){if(typeof json.dns_expire!=='number'){throw Error('\'dns_expire\' must be a number')}if(json.dns_expire<0){throw Error('\'dns_expire\' must be greater or equal to 0')}if(json.dns_expire>24*60*60){console.warn(`==> [config] 'dns_expire' is too long, is ${json.dns_expire}s expected?`)}}}static validateServer(server){if(typeof server.transport!=='string'){throw Error('\'server.transport\' must be a string')}if(!['tcp','udp'].includes(server.transport.toLowerCase())){throw Error('\'server.transport\' must be one of "tcp" or "udp"')}if(typeof server.host!=='string'||server.host===''){throw Error('\'server.host\' must be provided and is not empty')}if(!(0,_utils.isValidPort)(server.port)){throw Error('\'server.port\' is invalid')}if(typeof server.key!=='string'){throw Error('\'server.key\' must be a string')}if(server.key===''){throw Error('\'server.key\' cannot be empty')}if(!Array.isArray(server.presets)){throw Error('\'server.presets\' must be an array')}if(server.presets.length<1){throw Error('\'server.presets\' must contain at least one preset')}var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=server.presets[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){const preset=_step2.value;const name=preset.name,params=preset.params;if(typeof name==='undefined'){throw Error('\'server.presets[].name\' must be a string')}if(name===''){throw Error('\'server.presets[].name\' cannot be empty')}if(typeof params!=='undefined'){if(typeof params!=='object'||params===null){throw Error('\'server.presets[].params\' must be an object and not null')}}const ps=require(`../presets/${preset.name}`).default;delete new ps(params||{})}}catch(err){_didIteratorError2=true;_iteratorError2=err}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return()}}finally{if(_didIteratorError2){throw _iteratorError2}}}}static init(json){this.validate(json);global.__LOCAL_HOST__=json.host;global.__LOCAL_PORT__=json.port;if(typeof json.servers!=='undefined'){global.__SERVERS__=json.servers.filter(server=>server.enabled);global.__IS_CLIENT__=true}else{global.__IS_CLIENT__=false;this.initServer(json)}global.__IS_SERVER__=!global.__IS_CLIENT__;global.__REDIRECT__=json.redirect;global.__TIMEOUT__=json.timeout*1e3;global.__WORKERS__=json.workers!==undefined?json.workers:0;global.__LOG_LEVEL__=json.log_level||_constants.DEFAULT_LOG_LEVEL;global.__DNS_EXPIRE__=json.dns_expire!==undefined?json.dns_expire*1e3:_dnsCache.DNS_DEFAULT_EXPIRE;global.__ALL_CONFIG__=json;if(typeof json.dns!=='undefined'&&json.dns.length>0){global.__DNS__=json.dns;_dns2.default.setServers(json.dns)}}static initServer(server){this.validateServer(server);global.__TRANSPORT__=server.transport;global.__SERVER_HOST__=server.host;global.__SERVER_PORT__=server.port;global.__KEY__=server.key;global.__PRESETS__=server.presets}}exports.Config=Config;