// version 1.0 - dependencies $
//feature depricated : Auto call of start_action is removed, feature added : hard coded (transitionSpeed) 500 ms fade-in , fade-out animation , isAnimationRequired -true, false;
var NavComponent = {
    transitionSpeed: 500,
    isAnimationRequired: true,
    actualTag: "specialTag",
    replaceStartTag: "",
    replaceEndTag: "",
    len: 0,
    documentLocationID: "log_me_in",
    logInUrl: config.contextPath + "Home/Login",
    Log_in_page: false,
    xhr: null,
    start_action: function () {
        var _orgAjax = jQuery.ajaxSettings.xhr;
        jQuery.ajaxSettings.xhr = function () {
            NavComponent.xhr = _orgAjax();
            return NavComponent.xhr;
        };

        //Uncomment the below if you have scoped css in not enabled in your project
        NavComponent.replaceStartTag = "<" + NavComponent.actualTag + ">"; //<specialtag b-iu0kr9uvdj="">
        NavComponent.replaceEndTag = "</" + NavComponent.actualTag + ">";
        //uncomment the above if you have scoped css in your project

        // Scoped css is a feature of css that allows you to scope your css to a particular element,
        // In scoped css feature all elements get an attribute {like this  'b-jm7via0gdy'}, so that the css is applied only to that element.
        //this way you can have same class names in different elements without any conflict.
        //If you dont want this you open your csproj file and add <ScopedCssEnabled>false</ScopedCssEnabled> in the first property group {<PropertyGroup> </PropertyGroup>}
        //NavComponent.replaceStartTag = "<!--#specialTag_Start-->"; 
        //NavComponent.replaceEndTag = "<!--#specialTag_End-->";


        NavComponent.len = NavComponent.replaceStartTag.length;
        
        $(document).on("click", "a[zora]", NavComponent.home_click);
        window.onpopstate = function (event) {
            //alert("location: " + document.location + ", state: " + JSON.stringify(event.state)); //as per MDN
            if (event == null || event.state == null) return;
            let loc = document.location.href;
            let domainName = document.location.hostname;
            NavComponent.navigate(loc, event.state.id, false);
        };
    },
    replaceHTML: function (homehtml) {
        //first update history then replace body, this way the document.ready of this page will fire after hostoryupdation               
        var newBody = homehtml.substring(homehtml.indexOf(NavComponent.replaceStartTag) + NavComponent.len, homehtml.indexOf(NavComponent.replaceEndTag));
        //var newBody = $(homehtml).filter(NavComponent.actualTag);//if u do this document.ready never gets fired.
        if (!NavComponent.isAnimationRequired) {
            //for smooth page transition
            $("body").hide();
            $(NavComponent.actualTag).html(newBody);
            $("body").show();
        }
        else {
            //$("body").fadeOut(NavComponent.transitionSpeed / 3, function () {
            //    $(NavComponent.actualTag).html(newBody);
            //    $("body").fadeIn(NavComponent.transitionSpeed);
            //});
            $("#specialTag").fadeOut(NavComponent.transitionSpeed, function () {
                $(NavComponent.actualTag).html(newBody);
                $("#specialTag").fadeIn(NavComponent.transitionSpeed);
            });
        }
        $("title").text(homehtml.substring(homehtml.indexOf("<title>") + 7, homehtml.indexOf("</title>")));
    },
    navigate: function (Url, pushID, Push) {
        var puShId = pushID; var theUrl = Url; var toPush = Push;

        $.ajax({
            url: theUrl,
            cache: false,//needed for IE 11 only. yeah !!! IE caches get requests
            // 'xhr' option overrides jQuery's default , this is needed if you want
            // to make ajax calls and make it look like a browser request, u just need to remove 
            // 'X-Requested-With' key from the request header. 
            // factory for the XMLHttpRequest object.
            // Use either in global settings or individual call as shown here.
            xhr: function () {
                // Get new xhr object using default factory
                var xhr = jQuery.ajaxSettings.xhr();
                // Copy the browser's native setRequestHeader method
                var setRequestHeader = xhr.setRequestHeader;
                // Replace with a wrapper
                xhr.setRequestHeader = function (name, value) {
                    // Ignore the X-Requested-With header
                    if (name == 'X-Requested-With') return;
                    // Otherwise call the native setRequestHeader method
                    // Note: setRequestHeader requires its 'this' to be the xhr object,
                    // which is what 'this' is here when executed.
                    setRequestHeader.call(this, name, value);
                }
                // pass it on to jQuery
                return xhr;
            },
            //IE caches a get response if the request url is same accross multiple calls, one way to overcome this IE stupidity is, add a query string that keeps varing, this way IE won't cache the response
            //data: { 'uniq_param': (new Date()).getTime(), },             
            success: function (homehtml) {
                var pObj = {}; pObj.id = puShId;
                if (toPush) window.history.pushState(pObj, "No Browser Uses this", theUrl);
                //var urlPath = window.location.pathname;
                if (NavComponent.xhr.responseURL != window.location.href && NavComponent.xhr.responseURL.indexOf(NavComponent.logInUrl) !== -1) {
                    //alert("Detected a redirect\n" + NavComponent.xhr.responseURL + "\n" +  window.location.href);
                    //we detected a redirect, and that redirect is to the above configured logInUrl, so lets refresh the page
                    //alert(NavComponent.xhr.responseURL.indexOf(NavComponent.logInUrl));
                    if (NavComponent.documentLocationID) NavComponent.logInUrl += (NavComponent.documentLocationID) ? "#" + NavComponent.documentLocationID : "";
                    window.location.href = NavComponent.logInUrl;
                }
                else NavComponent.replaceHTML(homehtml);
                // var urlPath = window.location.pathname;
                //if (NavComponent.Log_in_page && -1 !== homehtml.indexOf("Log_in_page"))window.location.href = NavComponent.logInUrl;
                //else NavComponent.replaceHTML(homehtml);
            },
            error: function (a, b, c) {
                if (a.status == 401 || a.status == 403) { //means forbidden so, u have logged out
                    try {
                        var respObject = JSON.parse(a.responseText);
                        window.location.href = respObject.LogOnUrl;
                    }
                    catch (m) {
                        window.location.href = NavComponent.logInUrl;
                    }
                }
                else NavComponent.replaceHTML("<title>" + b + "</title>" + NavComponent.replaceStartTag + "<div class='jumbotron'><h1 class='display-4'>OOPS !!! We have status -  " + a.responseText + c + " &nbsp; " + "</h1><p class='lead'>This is definetly an issue, with error-code &nbsp;" + a.status + "&nbsp; , our solemn condolences.</p><hr class= 'my-4' ><p>You can contact <a href='mailto:ravindrakumar.v@alstomgroup.com'>Ravindrakumar V</a> to solve your problems</p></div>" + NavComponent.replaceEndTag);
            }
        });

    },
    SetView: function (url, jtagOrId) {
        $.ajax({ url: url, cache: false }).done(function (jData) {
            $(jtagOrId).html(jData);
        });
    },
    home_click: function (e) {
        e.preventDefault(); let anchorTag = $(e.target).closest("a"); let href = anchorTag.attr("href"); if (!href || anchorTag.length <= 0) console.log("Check the ATlSPA home_click function href or anchorTag is empty")
        NavComponent.navigate(href, Math.random() * 10000 + 1, true);
    },
}
$(document).ready(NavComponent.start_action);