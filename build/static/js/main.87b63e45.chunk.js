(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{267:function(e,t,a){e.exports=a(567)},347:function(e,t,a){},411:function(e,t,a){},414:function(e,t,a){},461:function(e,t,a){},556:function(e,t,a){},562:function(e,t,a){},564:function(e,t,a){},567:function(e,t,a){"use strict";a.r(t);a(268),a(273),a(275),a(278),a(284),a(302),a(304);var n=a(0),r=a.n(n),o=a(3),c=a.n(o),l=a(576),s=a(265),i=a(24),u=a(25),m=a(27),h=a(26),p=a(28),d=a(578),f=a(575),v=a(573),g=a(577),b=a(32),y=r.a.createContext(),S=function(e,t){switch(t.type){case"SET_DEVICES":return Object(b.a)({},e,{devices:t.payload});case"SHOW_TABLE_LOADING_OVERLAY":return Object(b.a)({},e,{tableResultsAreLoading:t.payload});case"SHOW_RESULTS_TABLE":return Object(b.a)({},e,{showResultsTable:t.payload});case"SET_COUNTRIES":return Object(b.a)({},e,{countryList:t.payload});case"SET_CREDENTIALS":return Object(b.a)({},e,{credentialsList:t.payload});default:return e}},O=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).state={devices:[],countryList:[],credentialsList:[],tableResultsAreLoading:!1,showResultsTable:!1,dispatch:function(e){return a.setState(function(t){return S(t,e)})}},a}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=Object(b.a)({},this.state),t=this.props.children;return r.a.createElement(y.Provider,{value:e},t)}}]),t}(n.Component),E=(y.Consumer,a(212),a(95)),w=a(2),C=a.n(w),k=(a(569),a(61)),j=a(571),T=a(572),N=(a(347),function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).state={selectedMenuItem:"",isMobileNavExapnded:!1},a.getSelectedClass=function(e){return a.state.selectedMenuItem===e?"selected":""},a.expandCollapseNav=function(e){e.preventDefault();var t=a.state.isMobileNavExapnded;a.setState({isMobileNavExapnded:!t})},a.signout=function(e){var t=a.props.history;e.preventDefault(),localStorage.removeItem("auth"),localStorage.removeItem("roles"),t.push("/public/login")},a}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.history;this.setActiveMenuItem(),this.historyUnlisten=t.listen(function(t,a){e.setActiveMenuItem()})}},{key:"componentWillUnmount",value:function(){this.historyUnlisten()}},{key:"setActiveMenuItem",value:function(){var e=Object(j.a)(window.location.pathname,{path:"/:section",strict:!1});e&&this.setState({selectedMenuItem:e.params.section})}},{key:"render",value:function(){var e=this.state.selectedMenuItem;return r.a.createElement(r.a.Fragment,null,r.a.createElement(k.a,{selectedKeys:[e],mode:"horizontal",theme:"dark"},r.a.createElement(k.a.Item,{key:"search1"},r.a.createElement(T.a,{to:"/search1"},"Search 1")),r.a.createElement(k.a.Item,{key:"search2"},r.a.createElement(T.a,{to:"/search2"},"Search 2"))))}}]),t}(n.Component)),R=Object(g.a)(N),A=(a(405),a(254)),D=(a(408),a(263)),F=(a(411),function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).state={isDarkMode:!1},a.componentWillMount=function(){var e=JSON.parse(localStorage.getItem("dsm-dark-mode"));e&&(document.querySelector("body").className="".concat(e?"dark-theme":"light-theme"),a.setState({isDarkMode:e}))},a.signout=function(e){var t=a.props.history;e.preventDefault(),localStorage.removeItem("auth"),localStorage.removeItem("roles"),t.push("/public/login")},a.handleJiraScriptError=function(){D.a.error("Unfortunately there was an error related to the JIRA issue collector - you will not be able to report any issues.")},a.handleJiraScriptLoad=function(){window.ATL_JQ_PAGE_PROPS={triggerFunction:function(e){document.querySelectorAll(".reportBugLink").forEach(function(t){t.addEventListener("click",function(t){window.ATL_JQ_PAGE_PROPS.fieldValues.summary="[Bug]: ",t.preventDefault(),e()})}),document.querySelectorAll(".reportNewFeatureLink").forEach(function(t){t.addEventListener("click",function(t){window.ATL_JQ_PAGE_PROPS.fieldValues.summary="[NewFeature]: ",t.preventDefault(),e()})})},fieldValues:{summary:"[Bug]: "}}},a.changeTheme=function(e){var t=a.state.isDarkMode;a.setState({isDarkMode:!t},function(){var e=a.state.isDarkMode;document.querySelector("body").className="".concat(e?"dark-theme":"light-theme"),localStorage.setItem("dsm-dark-mode",JSON.stringify(e))})},a}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.state.isDarkMode;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"user-menu"},r.a.createElement("div",{className:"theme-switch"},r.a.createElement("label",null,"Dark"),r.a.createElement(A.a,{checked:e,onChange:this.changeTheme}))))}}]),t}(n.Component)),I=Object(g.a)(F),L=(a(414),E.a.Header);var M=function(){return r.a.createElement(L,{className:"global-header"},r.a.createElement("a",{className:"brand",href:"/"},r.a.createElement("span",{className:"name"},"LambdaDB")),r.a.createElement(R,null),r.a.createElement(I,null))},_=(a(162),a(39)),x=(a(418),a(4)),z=(a(226),a(96)),P=a(175),W=a.n(P),H=a(256),U=(a(425),a(127)),V=(a(163),a(30)),K=a(257),q=a(60),J=a.n(q),B=window.__env,G=B.apiDomain1,Q=B.apiDomain2;J.a.interceptors.request.use(function(e){return e},function(e){return Promise.reject(e)});var Y=function(){var e=1;return window.location.href.indexOf("search2")>=0&&(e=2),1===e?G:Q},X=function(e,t,a,n){var r=Y();return J.a.get("".concat(r,"search/?").concat(t,"=").concat(e,"&page=").concat(a.page,"&pagesize=").concat(a.pageSize).concat(a.sorting).concat(a.filtering),n)},Z=function(e,t,a){var n=Y();return J.a.get("".concat(n,"typeahead/").concat(t,"/?typeahead=").concat(e,"&limit=").concat(a))},$=function(e,t,a,n,r){var o=Y();return J.a.get("".concat(o,"typeahead/").concat(r,"/?").concat(e,"=").concat(t).concat(a,"&limit=15"))},ee=(a(568),a(262)),te=a(264),ae=(a(461),function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(r)))).componentDidMount=function(){},a.handleResize=function(e){return function(t,n){var r=n.size;a.setState(function(t){var a=t.columns,n=Object(te.a)(a);return n[e]=Object(b.a)({},n[e],{width:r.width}),{columns:n}})}},a.hostNameClick=function(){console.log("hostNameClick...")},a.handleTableChange=function(e,t,n){(0,a.props.onTableChange)(e,t,n)},a}return Object(p.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.rowData,a=e.colDefs,n=e.totalItems,o=e.tableHeight,c=e.page,l=e.isLoading;return r.a.createElement("div",{className:"data-table-wrapper"},r.a.createElement(ee.a,{className:"data-table",components:this.components,dataSource:t,columns:a,loading:l,onChange:this.handleTableChange,pagination:{hideOnSinglePage:!0,defaultPageSize:20,pageSizeOptions:["10","20","50","100"],total:n,current:c,showSizeChanger:!0},scroll:{x:!1,y:o,scrollToFirstRowOnChange:!0}}))}}]),t}(n.Component));ae.defaultProps={isLoading:!0,totalItems:0,page:1,tableHeight:500};var ne=ae,re=(a(556),V.a.Option),oe=U.a.OptGroup,ce=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,o=new Array(n),c=0;c<n;c++)o[c]=arguments[c];return(a=Object(m.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(o)))).signal=J.a.CancelToken.source(),a.defaultColumnDefs={suppressMenu:!0},a.searchFilterOptions={IPv4:"&contains-value_type=ipv4_address",Hostname:"&contains-value_type=hostname"},a.state={tableHeight:500,serachOptions:[{Title:"Search",value:"search"},{Title:"IPv4",value:"IPv4"},{Title:"Hostname",value:"Hostname"},{Title:"Regex",value:"regex"},{Title:"Contains",value:"contains"},{Title:"Starts with",value:"startswith"},{Title:"Match",value:"match"}],filterOptions:[{Title:"Contains",value:"contains"},{Title:"Starts with",value:"startswith"},{Title:"Match",value:"match"},{Title:"Not Contains",value:"!contains"},{Title:"Not Starts with",value:"!startswith"},{Title:"Not Match",value:"!match"},{Title:"Any Contains",value:"any_contains"},{Title:"Any Starts with",value:"any_startswith"},{Title:"Any Match",value:"any_match"}],serachOption:"search",searchResults:[],searchColumns:[],searchView:"table",showResultsTable:!1,isLoading:!1,searchValue:"",autoCompleteDataSource:{suggessions:[]},totalItems:0,page:1,pageSize:20,sortingKey:"",sortOrder:"",filters:{},reqTime:0,metaFields:[]},a.tableWrapperRef=r.a.createRef(),a.debouncedOnChange=Object(K.debounce)(function(){a.setState({page:1,sortingKey:"",sortOrder:""}),a.getSearchResults()},100),a.onAutoCompleteChange=function(e){a.setState({searchValue:e||""},function(){a.debouncedOnChange()}),e?Z(e||"","value",1).then(function(e){a.setState({autoCompleteDataSource:{suggessions:e.data?e.data:[]}})}).catch(function(e){a.setState({autoCompleteDataSource:{suggessions:[]}})}):a.setState({autoCompleteDataSource:{suggessions:[]}})},a.handleTableChange=function(e,t,n){a.setState({page:e.current,pageSize:e.pageSize,sortingKey:n.columnKey,sortOrder:n.order,filters:t},function(){a.getSearchResults()})},a.getSearchResults=Object(H.a)(W.a.mark(function e(){var t,n,r,o,c,l,s,i,u,m,h,p,d;return W.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.state,n=t.searchValue,r=t.page,o=t.pageSize,c=t.sortingKey,l=t.sortOrder,s=t.filters,i=a.state.serachOption,a.handleWindowResize(),u={},a.lastSession=u,a.setState({showResultsTable:!0,isLoading:!0}),e.prev=6,m="","ascend"===l&&(m="&sortby=".concat(c)),"descend"===l&&(m="&sortby=-".concat(c)),h=[],s&&(h=Object.keys(s).map(function(e){var t=s[e].value?s[e].value:"",a=s[e].option?s[e].option:"contains";return"&".concat(a,"-").concat(e,"=").concat(t)})),"IPv4"!==i&&"Hostname"!==i||(h.unshift(a.searchFilterOptions[i]),i="search"),p=h.join(""),e.next=16,X(n,i,{page:r,pageSize:o,sorting:c?m:"",filtering:p},{cancelToken:a.signal.token});case 16:if(d=e.sent,a.lastSession===u){e.next=19;break}return e.abrupt("return");case 19:a.onGetSearchSuccess(d),e.next=25;break;case 22:e.prev=22,e.t0=e.catch(6),a.onSearchEmpty();case 25:case"end":return e.stop()}},e,null,[[6,22]])})),a.onGetSearchSuccess=function(e){a.parseTableData(e.data?e.data:[]),a.setState({isLoading:!1,totalItems:e.headers["total-items"]?e.headers["total-items"]:100,reqTime:e.headers["query-duration"]?e.headers["query-duration"]:"50ms"})},a.clickApplyFilters=function(){a.getSearchResults()},a.clickResetFilters=function(){var e=a.state.filters,t={};Object.keys(e).map(function(a){return t[a]=Object(b.a)({},e[a],{value:""}),a}),a.setState({filters:t},function(){a.getSearchResults()})},a.onColumnFilterKeyUpFocus=function(e,t,n){var r="";r=e&&e.target?e.target.value:e;var o=a.state.filters;e&&13===e.keyCode||n?(o[t].value=r,a.setState({filters:o},function(){a.getSearchResults()})):(o[t].value=r,o[t].autoCompleteOptions=[],a.setState({filters:o},function(){a.onColumnFilterAutocomplete(e,t)}))},a.onColumnFilterAutocomplete=function(e,t){var n=a.state,r=n.filters,o=n.serachOption,c=n.searchValue,l=e,s=[];r&&(s=Object.keys(r).map(function(e){var t=r[e].value?r[e].value:"",a=r[e].option?r[e].option:"contains";return"&".concat(a,"-").concat(e,"=").concat(t)}));var i=s.join("");$(o,c,i,l,t).then(function(e){r[t].autoCompleteOptions=e.data?e.data:[],a.setState({filters:r})}).catch(function(e){r[t].autoCompleteOptions=[],a.setState({filters:r})})},a.onColumnFilterOptionChange=function(e,t){var n=a.state.filters;n[t].option!==e&&(n[t].option=e,a.setState({filters:n}),n[t].value&&a.getSearchResults())},a.renderTitleWithFilter=function(e,t){var n=a.state,o=n.filterOptions,c=n.filters;return c[e]?r.a.createElement("div",{className:"custom-hd-wrp"},r.a.createElement("div",{className:"hd-label"},t),r.a.createElement("div",{onClick:function(e){e.stopPropagation()}},r.a.createElement(V.a,{placeholder:"Select Option",dropdownClassName:"table-filter-dropdown",defaultValue:"contains",onSelect:function(t){a.onColumnFilterOptionChange(t,e)}},o.map(function(e){return r.a.createElement(re,{value:e.value,key:e.value},e.Title)})),r.a.createElement(U.a,{dataSource:c[e].autoCompleteOptions,style:{width:200},defaultActiveFirstOption:!1,dropdownClassName:"column-filter-dropdown",value:c[e].value,onSelect:function(t){a.onColumnFilterKeyUpFocus(t,e,!0)},onSearch:function(t){a.onColumnFilterKeyUpFocus(t,e)},placeholder:t},r.a.createElement(z.a,{onKeyUp:function(t){a.onColumnFilterKeyUpFocus(t,e)},onFocus:function(t){a.onColumnFilterKeyUpFocus(t,e)}})))):""},a.createColDefs=function(){var e=a.state.metaFields,t=[];return e.map(function(e){e.isShow&&t.push({title:a.renderTitleWithFilter(e.name,e.label),dataIndex:e.name,key:e.name,className:e.name,sorter:!0,width:e.width?e.width:130})}),t},a.parseTableData=function(e){var t=e.meta,n=a.state.filters;e.meta.fields.forEach(function(e,t){n[e.name]||(n[e.name]={option:"contains",value:"",autoCompleteOptions:[]})}),a.setState({filters:n,metaFields:t.fields},function(){var n=e.data.map(function(e,t){return Object(b.a)({},e,{key:t})});a.setState({searchResults:n,searchView:t.view,showResultsTable:!0})})},a.onSearchEmpty=function(){a.setState({searchResults:[],searchView:"table",showResultsTable:!0,isLoading:!1,page:0,totalItems:0})},a.setTableDimensions=function(){var e=a.tableWrapperRef.current.getBoundingClientRect().top,t=window.innerHeight-e-70-115;a.setState({tableHeight:t})},a.handleWindowResize=function(){a.setTableDimensions()},a.searchOptionChange=function(e){a.setState({serachOption:e},function(){a.debouncedOnChange()})},a.renderOption=function(){var e=a.state.autoCompleteDataSource;return Object.keys(e).map(function(t){return r.a.createElement(oe,{key:t,label:"suggessions"===t?"Suggestions":"Recent Searches"},e[t].map(function(e){return r.a.createElement(re,{key:e,text:e},"loading"===e?r.a.createElement(x.a,{type:"loading"}):r.a.createElement("div",{className:"global-search-item"},r.a.createElement("span",{className:"global-search-item-desc"},e),"resentSearch"===t?r.a.createElement("span",{className:"search-history-remove"},"Remove"):""))}))})},a}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentWillMount",value:function(){window.addEventListener("resize",this.handleWindowResize),this.setState({autoCompleteDataSource:{suggessions:[]}})}},{key:"componentWillUnmount",value:function(){this.signal.cancel("Canceled"),window.removeEventListener("resize",this.handleWindowResize)}},{key:"render",value:function(){var e=this,t=this.state,a=t.isLoading,o=t.reqTime,c=t.serachOptions,l=t.serachOption,s=t.searchResults,i=t.autoCompleteDataSource,u=t.tableHeight,m=t.searchView,h=t.showResultsTable,p=t.totalItems,d=t.page,f=this.createColDefs();return r.a.createElement(n.Fragment,null,r.a.createElement("div",{className:"search-input-wrapper initial-search-done clearfix"},r.a.createElement("div",{className:"top-option-box"},r.a.createElement(V.a,{placeholder:"Select Option",className:"search-select-options",onSelect:this.searchOptionChange,value:l},c.map(function(e){return r.a.createElement(re,{value:e.value,key:e.value},e.Title)})),0!==p&&r.a.createElement("div",{className:"search-info ".concat(a?"loading":"")},a&&r.a.createElement("span",{className:"loading"},r.a.createElement(x.a,{type:"loading"})),r.a.createElement("span",null,"About "),parseInt(p,0).toLocaleString(),r.a.createElement("span",null," results ("),o,r.a.createElement("span",null,")"))),r.a.createElement("div",{className:"top-search-box"},r.a.createElement("div",{className:"global-search-wrapper"},r.a.createElement(U.a,{className:"search-input",size:"large",dataSource:i.suggessions,style:{width:"100%"},dropdownClassName:"column-filter-dropdown",defaultActiveFirstOption:!1,allowClear:!0,onSelect:function(t){return e.onAutoCompleteChange(t)},onSearch:function(t){return e.onAutoCompleteChange(t)},autoFocus:!0},r.a.createElement(z.a,{className:"search-input",placeholder:"Search...",prefix:r.a.createElement(x.a,{type:"search",style:{color:"rgba(0,0,0,.25)"}}),size:"large"}))))),r.a.createElement("div",{className:"search-filter-wrapper"},r.a.createElement(_.a,{className:"ant-btn-primary",onClick:this.clickResetFilters},r.a.createElement(x.a,{type:"filter"}),"Reset"),r.a.createElement(_.a,{className:"ant-btn-primary",onClick:this.clickApplyFilters},"Apply")),r.a.createElement("div",{className:"search-table-wrapper"},r.a.createElement("div",{ref:this.tableWrapperRef,className:"search-results"},"table"===m&&h&&r.a.createElement(ne,{colDefs:f,rowData:s,tableHeight:u,totalItems:p,page:d,isLoading:a,onTableChange:this.handleTableChange}))))}}]),t}(n.Component);var le=function(){return r.a.createElement(n.Fragment,null,r.a.createElement(ce,null))};var se=function(){return r.a.createElement(n.Fragment,null,r.a.createElement(le,null))};var ie=function(){return r.a.createElement(n.Fragment,null,r.a.createElement(le,null))},ue=(a(562),E.a.Content),me=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,o=new Array(n),c=0;c<n;c++)o[c]=arguments[c];return(a=Object(m.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(o)))).routes=function(){return r.a.createElement(d.a,null,r.a.createElement(v.a,{exact:!0,path:"/search1",component:se}),r.a.createElement(v.a,{path:"/search2",component:ie}),r.a.createElement(v.a,{render:function(){return r.a.createElement(f.a,{to:{pathname:"/search1"}})}}))},a}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentWillMount",value:function(){}},{key:"render",value:function(){var e=this.props.location,t=C()("global-content",{"global-content-search":"/search"===e.pathname,"global-content-devices":"/devices"===e.pathname,"global-content-policies":"/policies"===e.pathname,"global-content-admin":0===e.pathname.indexOf("/admin/")});return r.a.createElement(E.a,{className:"global-layout"},r.a.createElement(M,null),r.a.createElement(ue,{className:t},this.routes()))}}]),t}(n.Component),he=Object(g.a)(me),pe=(a(564),function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(m.a)(this,Object(h.a)(t).call(this))).state={},e.webPingTimer=null,e.showNotification=!0,e}return Object(p.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){}},{key:"componentWillUnmount",value:function(){}},{key:"render",value:function(){return r.a.createElement(O,null,r.a.createElement(d.a,null,r.a.createElement(de,{path:"/",component:he}),r.a.createElement(f.a,{to:"/"})))}}]),t}(r.a.Component)),de=function(e){var t=e.component,a=Object(s.a)(e,["component"]);return r.a.createElement(v.a,Object.assign({},a,{render:function(e){return r.a.createElement(t,e)}}))},fe=Object(g.a)(pe);c.a.render(r.a.createElement(l.a,null,r.a.createElement(fe,null)),document.getElementById("root"))}},[[267,2,1]]]);
//# sourceMappingURL=main.87b63e45.chunk.js.map