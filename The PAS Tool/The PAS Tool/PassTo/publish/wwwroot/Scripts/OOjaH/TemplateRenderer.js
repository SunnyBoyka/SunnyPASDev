/////////////////////////////////////////////////////////////////////
/// This class has be at a global scope like in the <head></head>
/// OOjaH Stands for Object Oriented JavaScript and HTML
/// Templates once downloaded will remain in memory for the entire life cycle of the application , 
/// meaning until user presses Refresh, thanks to ALT`SPA. caching a compiled templates are optional
/////////////////////////////////////////////////////////////////////
class TemplateRenderer {
    static templates = {};
    static tagVSCompiledHTML = {};
    static init = false;
    constructor(jData, tagOrJID, templatePath, HTMLTemplate, templateEngine, cacheCompiledTemplate) { //templateEngine = true: use underscore , templateEngine = false: use handlebars
        this.data = jData; this.tagOrJID = tagOrJID; this.templatePath = templatePath.replace('~/', '');
        this.templateEngine = (templateEngine === undefined || templateEngine) ? true : false;
        TemplateRenderer.InitHandlebarHelpers();
        if (!cacheCompiledTemplate) this.clever = true;
        if (!HTMLTemplate) return;
        TemplateRenderer.templates[this.templatePath] = HTMLTemplate;
    }
    start_action() {
        if (!TemplateRenderer.templates[this.templatePath]) {
            return new Promise((resolve, reject) => {
                $.ajax({ context: this, cache: false, url: config.contextPath + this.templatePath, })
                    .then(htmlTemplate => {
                        if (this.clever) {
                            TemplateRenderer.templates[this.templatePath] = htmlTemplate;
                            this.renderClever();
                        }
                        else {
                            TemplateRenderer.templates[this.templatePath] = htmlTemplate.replace(/~\//g, config.contextPath);
                            this.render();
                        }
                        //if (this.callback) this.callback("Finished appending HTML");
                        resolve("Template for tag <" + this.tagOrJID + "> NOT IN cache");
                    }).fail((xhr, status, error) => reject(xhr, status, error));
            });
        }
        else {
            if (this.clever) this.renderClever();
            else this.render();
            return new Promise((resolve, reject) => resolve("Template for tag <" + this.tagOrJID + ">  in cache"));
        }
    }
    render() {
        let compiledHTML = null;

        if (this.templateEngine) compiledHTML = _.template(TemplateRenderer.templates[this.templatePath])({ theList: this.data });
        else compiledHTML = Handlebars.compile(TemplateRenderer.templates[this.templatePath])(this.data);

        if (!TemplateRenderer.tagVSCompiledHTML[this.tagOrJID]) TemplateRenderer.tagVSCompiledHTML[this.tagOrJID] = compiledHTML;

        $(this.tagOrJID).html(compiledHTML);
    }
    renderClever() {
        if (!TemplateRenderer.tagVSCompiledHTML[this.tagOrJID]) {
            let compiledHTML = null;

            if (this.templateEngine) compiledHTML = _.template(TemplateRenderer.templates[this.templatePath])({ theList: this.data });
            else compiledHTML = Handlebars.compile(TemplateRenderer.templates[this.templatePath])(this.data);

            $(this.tagOrJID).html(compiledHTML);
            this.doCleverReplacementsAndCacheTemplate();
        }
        else $(this.tagOrJID).html(TemplateRenderer.tagVSCompiledHTML[this.tagOrJID]);
    }
    doCleverReplacementsAndCacheTemplate() {
        this.doLinkReplacements("img", "src"); this.doLinkReplacements("a", "href");
        this.doLinkReplacements("audio", "src"); this.doLinkReplacements("video", "src");
        TemplateRenderer.tagVSCompiledHTML[this.tagOrJID] = $(this.tagOrJID).html();
    }
    shouldLinkReplacementsBeDoneAtAll(actualLink) {
        if (actualLink.startsWith(config.contextPath) || actualLink.startsWith('http')
            || actualLink.startsWith('https') || actualLink.startsWith('mail') || actualLink.startsWith('#')
        ) return false;
        return true;
    }
    doLinkReplacements(tag, attrib) {
        let findersKeepers = $(this.tagOrJID).find(tag);
        tag = tag.toLowerCase();
        if (tag === "video" || tag == "audio") findersKeepers = findersKeepers.find("source")
        let that = this;
        $.each(findersKeepers, (index, ele) => {
            let actualLink = $(ele).attr(attrib); if (!actualLink) return;
            let finalLink = config.contextPath + actualLink;
            if (!that.shouldLinkReplacementsBeDoneAtAll(actualLink)) return;
            if (actualLink.startsWith("/")) finalLink = config.contextPath + actualLink.replace('/', '');
            else if (actualLink.startsWith("~/")) finalLink = config.contextPath + actualLink.replace('~/', '');
            let newAttrib = {}; newAttrib[attrib] = finalLink
            $(ele).attr(newAttrib);
        });
    }
    static InitHandlebarHelpers() {
        if (TemplateRenderer.init) return;
        TemplateRenderer.init = true;
        if (this.templateEngine) TemplateRenderer.InitHandlebarHelpers();
        Handlebars.registerHelper('Stringify', (obj) => JSON.stringify(obj));
        Handlebars.registerHelper('isdefined', function (value) {
            if (value) return true;
            return false;
        });
        Handlebars.registerHelper('math', function (lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue); rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        });

        Handlebars.registerHelper('split', (str, index, char) => {
            return str.split(char)[index];
        });
        Handlebars.registerHelper('new_line', (str, chars) => {
            var regex = new RegExp(chars, "g");
            return str.replace(regex, "<br/>").replace(/&as/g, "'");
        });
        Handlebars.registerHelper('check', function (value, comparator) {
            return (value === comparator) ? 'No content' : value;
        });
        Handlebars.registerHelper('times', function (s, n, block) {
            var accum = '';
            for (var i = s; i < n; ++i)
                accum += block.fn(i);
            return accum;
        });
        Handlebars.registerHelper('isArray', function (bone) {
            return Array.isArray(bone);
        });
    }
}