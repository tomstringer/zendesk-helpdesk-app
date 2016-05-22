"use strict";
angular.module("v2App", []).config(["$routeProvider",
    function (a) {
        a.when("/", {
            templateUrl: "web-help/views/main",
            controller: "MainCtrl"
        }).when("/request/:stream/:itsService", {
            templateUrl: "web-help/views/request",
            controller: "RequestCtrl"
        }).when("/thankyou/:ticketId", {
            templateUrl: "web-help/views/thankyou",
            controller: "ThankyouCtrl"
        }).otherwise({
            redirectTo: "/"
        })
    }
]);

// Landing page category filter
var zendesk = angular.module("v2App").controller("MainCtrl", ["$scope",
    function (a) {
        a.refine = {
            analytics: !1,
            content: !1,
            design: !1,
            accessibility: !1,
            technology: !1
        }, a.checkEmpty = function () {
            for (var a = angular.element(document.getElementsByClassName("list-results")), b = 0; b < a.length; b++) a[b].parentElement.style.display = a[b].children[0] && !a[b].children[0].children.length ? "none" : "block"
        }
	}
]);

zendesk.filter("refineFilter", function () {
    return function (a, b) {
        for (var c in b)
            if (b[c] === !0) {
                var d = [];
                for (var e in a) b[a[e].itemType] && d.push(a[e]);
                return d
            }
        return a
    }
}), zendesk.filter("urlStrip", function () {
    return function (a) {
        return a = a.replace(/&/g, "").trim().replace(/  | /g, "-"), angular.lowercase(a)
    }
}), zendesk.filter("urlUnstrip", function () {
    return function (a) {
        return a = a.replace(/-/g, " "), angular.lowercase(a)
    }
}), zendesk.filter("capitalise", function () {
    return function (a) {
        return a.replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase()
        }).replace(/-/g, " ")
    }
}),

// Request page control
	zendesk.controller("RequestCtrl", ["$scope", "$route", "$routeParams", "$http",
    function (a, b, c, d) {
        a.stream = c.stream || "", a.itsService = c.itsService || "", a.currentItem = a.getEntry(a.stream, a.itsService), a.submitForm = function () {
            d({
                method: "POST",
                url: "https://weapon.its.unimelb.edu.au/zendesk/ticket",
                data: a.ticketForm,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
        }
    }
]), 

// Thank you page control
	zendesk.controller("ThankyouCtrl", ["$scope", "$route", "$routeParams",
    function (a, b, c) {
        a.ticketId = c.ticketId || ""
    }
]), 


// Global control - form elements
	zendesk.controller("GlobalCtrl", ["$scope", "$filter", "$compile",
    function (a, b, c) {
        a.ticketForm = {}, 
        a.userInfo = {
            username: "",
            email: "",
            fName: "",
            lName: "",
            userAgent: "",
            matrixUserID: "",
            matrixUserType: ""
        }, a.init = function (b) {
            a.userInfo = b
        }, a.getUserinfo = function (b) {
            return "email" === b ? a.userInfo[b] : ""
        }, a.prefill = function () {
            a.ticketForm.email = a.userInfo.email, a.ticketForm.name = a.userInfo.fName.length > 1 ? a.userInfo.fName + " " + a.userInfo.lName : a.userInfo.displayName
        }, a.chkDict = function (a) {
            return void 0 !== a
        }, a.compileElem = function (b) {
            return c(b)(a), b
        }, a.getEntry = function (a, c) {
            for (var d in this.serviceList)
                if (b("urlStrip")(d) === a)
                    for (var e in this.serviceList[d].content)
                        if (b("urlStrip")(this.serviceList[d].content[e].name) === c) return this.serviceList[d].content[e]
        }, a.getFaq = function (a, c) {
            for (var d in this.serviceList)
                if (b("urlStrip")(d) === a)
                    for (var e in this.serviceList[d].content)
                        if (b("urlStrip")(this.serviceList[d].content[e].name) === c) return this.faqs[this.serviceList[d].content[e].faq]
        }, a.genForm = function (d, e) {
            var f = this.getEntry(d, e),
                g = {},
                h = "";
            for (var i in f.form) {
                var j = this.formElements[f.form[i]],
                    k = function () {
                        var b = '<div><label for="' + f.form[i] + '">' + j.label + "</label></div>";
                        if ("text" === j.type) return b + '<input ng-model="ticketForm.' + f.form[i] + '" class="field-select" ' + ("yes" === j.req ? "required" : "") + ' type="text"  name="' + f.form[i] + '" placeholder="' + a.getUserinfo(f.form[i]) + '">';
                        if ("select" === j.type) {
                        	h = b + '<fieldset><div><div class="styled-select"><select ng-model="ticketForm.' + f.form[i] + '" class="field-select" data-order="1" name="' + f.form[i] + '"  ' + ("yes" === j.req ? 'required="required"' : '') + '><option ng-selected="true" value="">Please select</option>';
                            for (var c in j.options) h += '<option value="' + j.options[c] + '">' + j.options[c] + "</option>";
                            return a.chkDict(j.sub) && console.log("options present"), h
                        }
                    //    if ("date" === j.type) return b + '<input type="date" ng-model="ticketForm.' + f.form[i] + '" class="field-date" name="' + f.form[i] + '"  ' + ("yes" === j.req ? "required" : "") + ' >';
                        
                        return "radio" === j.type ? (h = b, h += '<label class="checkbox"><input ng-model="ticketForm.' + f.form[i] + '" ' + ("yes" === j.req ? "required" : "") + ' type="checkbox" value="" id="checkbox2" data-toggle="checkbox" name="' + f.form[i] + '" value="' + j.options[0] + '"><span class="icons"><span class="first-icon fui-checkbox-unchecked"></span><span class="second-icon fui-checkbox-checked"></span></span></label>') : "multi" === j.type ? b + '<textarea ng-model="ticketForm.' + f.form[i] + '" ' + ("yes" === j.req ? "required" : "") + ' class="field-select" col="50" rows="10" value="" name="' + f.form[i] + '"></textarea>' : void 0
                    };
                "undefined" == typeof g[j.section] && (g[j.section] = "<h2>" + j.section + "</h2>"), g[j.section] += k()
            }
            g.hidden = "", g.hidden += '<input type="hidden" name="name" value="' + a.userInfo.fName + " " + a.userInfo.lName + '">', g.hidden += '<input type="hidden" name="email" value="' + a.userInfo.email + '">', g.hidden += '<input type="hidden" name="group" value="' + a.groups[f.group] + '">', g.hidden += '<input type="hidden" name="tags" value="' + f.tags + '">', g.hidden += '<input type="hidden" name="userAgent" value="' + a.userInfo.userAgent + '">', g.hidden += '<input type="hidden" name="matrixUserID" value="' + a.userInfo.matrixUserID + '">', g.hidden += '<input type="hidden" name="matrixUserType" value="' + a.userInfo.matrixUserType + '">', g.hidden += '<input type="hidden" name="type" value="' + ("undefined" != typeof f.enquiryType ? f.enquiryType : "task") + '">', g.hidden += '<input type="hidden" name="category" value="' + b("urlUnstrip")(d) + '">', g.hidden += '<input type="hidden" name="service" value="' + b("urlUnstrip")(e) + '">';
            var l = angular.element(document.getElementById("form_content"));
            for (var m in g) l.append(g[m]);
            return c(l.contents())(a), a.prefill(), g
        },                
                
        // Request form - supplementary information        
        a.ticketId = "", a.faqs = [
        	// #0 Access issues - Editing or administrative access
        	{
	            "Relevant governance and guidelines": ["Access to edit or administer websites at the University generally requires some form of training."],
	            "Things to include": ["If you're asking for editing or admin access to a University website or application, your request will need to be approved by the relevant faculty/divisional web manager or site owner (you'll need to provide their contact details here)."],
	            "Self-help resources": ["For information about available training, please refer to our <a href='https://webhelp.staff.unimelb.edu.au/hc/en-gb' target='_blank'>help documentation and community forum</a>."]
	        }, 
	        // #1 Access issues - Access to view a password-protected site
	        {
	            "Things to include": ["Please let us know which site or page you are trying to reach, and what happens when you try to access it."],
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
        	// #2 Feedback - Content updates and corrections
        	{
	            "Things to include": ["Please provide the URL for the location of the content that needs to be changed, and anything else that will help us find the text to be altered. Please also let us know what needs to be changed, or ask us to call you to discuss."]
	        }, 
	        // #3 Feedback - Feedback on a site or feature
        	{
	            "Things to include": ["Please provide the URL for the location of the website or feature.", "Let us know what you like or don't like about it and why."]
	        },
	        // #4 Feedback - Suggestions for improvement
        	{
	            "Things to include": ["Please provide the URL for the location of the website or feature that you think could be improved.", "Let us know how you think an improvement could be made."]
	        },
	        // #5 Feedback - Other
        	{
	            "Things to include": ["Please provide as much detail as you can so we know where to look and can work out how best to respond to your query."],
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
	        // #6 Training - Matrix CMS training
        	{
            "Training resources": ["We provide a <a href='https://webhelp.staff.unimelb.edu.au/hc/en-gb/categories/200076734-Training' target='_blank'>range of online training resources</a> for both authors and administrators."],
            //"Author training": ["Author training takes place online and provides the resources to perform the most common web publishing tasks using the Matrix CMS Edit+ tool.", "There is no charge for Author training."],
            //"Administrator training": ["Admin training is classroom-based and provides a background in the more advanced elements of the system required to manage a site.", "Admin training costs $165 per participant."],
            "Custom training": ["In addition to training in Matrix CMS, we can also assist with Bespoke CMS, WordPress CMS and Pursuit. If you're not sure what sort of training you need, or if you're after some form of customised training, please let us know what you need to be able to do and we'll help work out the best way to proceed."]
			},
        	// #7 Training - Analytics
        	{
	            "Relevant governance and guidelines": ["The Web Enhancement Program is standardising and centralising the deployment and tracking of web analytics across the University.", "All sites with the new template header and footer injection have the centralised analytics tracking included automatically.", "For more information, please see the <a href='https://its.unimelb.edu.au/about/projects/web-enhancement-program/work-streams/reporting-and-analytics-stream' target='_blank'>Reporting and Analytics work stream</a> of the Web Enhancement Program."],
	            "Things to include": ["Please describe how you use (or expect to use) analytics as part of your work", "Please provide any other specific requirements or techniques."],
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
	        // #8 Training - Accessibility
	        {
	            "Relevant governance and guidelines": ["See the <a href='http://www.unimelb.edu.au/accessibility/standards.html' target='_blank'>University's web accessibility standards statement</a>"],
	            "Things to include": ["Please provide the details of the site or web application you’re working on, as well as information about its current stage of development."],
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
	        // #9 Website management - Troubleshooting
	        {
	            "Things to include": ["Please let us know as much information as you can about what the problem is, including the steps you've taken to try to fix or replicate it.", "Please let us know what web browser and version you're using.", "If you have screenshots or other files to include, submit this request, and then reply to the receipt email with the files attached."],
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
	        // #10 Website management - Analytics
	        {
	            "Things to include": ["Please provide the URL of the site you need assistance with."],
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
	        // #11 Website management - Accessibility
	        {
	            "Things to include": ["Please provide the URL of the site you need assistance with."],
	            "Self-help resources": ["<a href='http://www.unimelb.edu.au/accessibility/training/top-ten.htm' target='_blank'>Top 10 accessibility tips</a>", 'Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!'],
	            "Relevant governance and guidelines": ["See the <a href='http://www.unimelb.edu.au/accessibility/standards.html' target='_blank'>University's web accessibility standards statement</a>"]
	        },
	        // #12 Website management - Implementing or developing new features
	        {
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
	        // #13 Website management - (sub)Domains and DNS
        	{
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!'],
	            "New subdomains": ["If you are requesting a new unimelb subdomain, it must be approved by the faculty/divisional web manager (you’ll need to provide their contact details here).", "Please provide information about the purpose of the new subdomain."],
	            "New 'marketing' URLs": ["Requests for new marketing URLs must be approved by the faculty/divisional web manager (you'll need to provide their contact details here).", "Marketing URLs are for print usage only and must closely and unambiguously match the website’s title.", "We cannot provide marketing URLs for external domains (ie – non unimelb domains)."],
	            "Relevant governance and guidelines": ["The University has a set of guidelines for the approval and allocation of unimelb subdomains. Please <a href='https://webhelp.staff.unimelb.edu.au/hc/en-gb/articles/200179144-Subdomain-approvals-and-governance' target='_blank'>read these guidelines</a> carefully before submitting your request."]
	        }, 
	        // #14 Website management - Hosting
        	{
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!'],
	            "Things to include": ["Please describe any specific requirements that you might have (ie – server specifications etc). If you’re unsure, let us know what you plan to do with the hosting provided, and we’ll help you find the most suitable solution."]
	        }, 
        	// #15 Website management - Design and templates
        	{
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!'],
	            "Relevant governance and guidelines": ["All websites on the unimelb.edu.au domain must meet University branding requirements."]
	        }, 
	        // #16 Website management - Standards, guidelines and policies
        	{
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!'],
	            "Relevant governance and guidelines": ["The University has a range of standards and policies that govern our web presence. See the <a href='https://its.unimelb.edu.au/wep' target='_blank'>Web Enhancement Program website</a> for more information."]
	        }, 
	        // #17 Website management - New sites or redesigns
        	{
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!'],
	            "Relevant governance and guidelines": ["All websites on the unimelb.edu.au domain must meet University branding requirements.", "The University's Digital Design System documentation can be found at <a href='http://web.unimelb.edu.au' target='_blank'>web.unimelb</a>."],
	            "Things to include": ["Please let us know the purpose of the new site or redesign, and what sort of assistance you're looking for."]
	        }, 
	        // #18 Website management - Archiving and retiring
        	{
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!']
	        },
	        // #19 Website management - Content development
        	{
	            "Self-help resources": ['Before submitting your request, have a look through our <a href="https://webhelp.staff.unimelb.edu.au/hc/en-gb" target="_blank">help documentation and the community forum</a> – you might find your question has already been asked and answered by someone else!'],
	            "Things to include": ["Please let us know what sort of content help you’re looking for, including the URL(s) of any relevant site(s)."]
	        }, 
        ],
        
        // Service categories, request elements and settings        
        a.serviceList = {
            "Access issues": {
	        	name: "Access issues",
	        	description: "We can help arrange or troubleshoot access to websites, servers and other applications.",
	        	class: "access",
	        	content: [{
		        	name: "Access a University website or application",
					description: "We can help organise and troubleshoot access to read, edit or administer websites and applications from around the University.",
					owner: "online services",
					faq: 0,
					itemType: "technology",
					group: "misc",
					form: ["web_manager", "web_manager_contact", "platform", "url", "details", "priority"]     	
		        }]
        	},
            "Feedback, updates and suggestions": {
	        	name: "Feedback, updates and suggestions",
	        	description: "Let us know if something needs to be corrected, or could be improved.",
	        	class: "feedback",
	        	content: [{
		        	name: "Content updates, corrections, feedback and suggestions",
					description: "Let us know if you've found something that needs to be updated, corrected or improved.",
					owner: "online services",
					faq: 2,
					itemType: "content",
					group: "misc",
					form: ["url", "details", "priority"]     	
		        }, {
			        name: "Other - General request",
			        description: "Not sure where else to ask a question or request assistance? Use this form and we'll see what we can do.",
			        owner: "online services",
					faq: 5,
					itemType: "misc",
					group: "misc",
					form: ["details", "priority"]  
		        }]
        	},
        	"Training": {
	        	name: "Training",
	        	description: "We offer training for a number of different systems and skills.",
	        	class: "training",
	        	content: [{
		        	name: "Web editor training",
					description: "We provide a range of classroom, online and ad hoc training for the University's web publishing platforms.",
					owner: "online services",
					faq: 6,
					itemType: "technology",
					group: "misc",
					form: ["details", "training", "priority"]
		        }]
        	},
        	"Website management": {
        		name: "Website management",
        		description: "We can help with a range of web management issues. Select one of the following to get help with:",
        		class: "management",
	        	content: [{
	        		name: "Troubleshooting",
					description: "We can help you troubleshoot issues across a wide range of websites and applications.",
					owner: "online services",
					faq: 9,
					itemType: "misc",
					group: "misc",
					form: ["details", "priority"]
				}, {
					name: "Analytics and Search Engine Optimisation (SEO)",
					description: "We operate the University's central Google Analytics account and can help you implement, report or interpret analytics for your site. We can also provide advice on SEO best practice for your site.",
					owner: "online services",
					faq: 10,
					itemType: "analytics",
					group: "misc",
					form: ["url", "details", "priority"]
				}, {
					name: "Accessibility standards (WCAG 2.0 AA)",
					description: "We can help you ensure your website or application adheres to the University's adopted accessibility standards (WCAG 2.0 Level AA).",
					owner: "online services",
					faq: 11,
					itemType: "accessibility",
					group: "misc",
					form: ["url", "details", "priority"]					
				}, {
					name: "Subdomains and DNS",
					description: "We manage the approval and allocation of unimelb.edu.au subdomains.",
					owner: "online services",
					faq: 13,
					group: "misc",
					itemType: "technology",
					form: ["domain", "hosting", "details", "web_manager", "web_manager_contact", "priority"]
				}, {
					name: "New sites or redesigns",
					description: "We can provide advice and guidance if you're considering creating a new website or redesigning an existing site.",
					owner: "online services",
					faq: 17,
					itemType: "design",
					form: ["details", "priority"]
				}, {
					name: "Archiving and retiring",
					description: "We can help you retire and archive old or obsolete websites.",
					owner: "online services",
					faq: 18,
					itemType: "misc",
					form: ["url", "details", "priority"]
				}, {
					name: "Content development",
					description: "We can help you assess, organise and develop the content for your website.",
					owner: "online services",
					faq: 19,
					itemType: "content",
					form: ["details", "priority"]
				}]					        	
        	},
        }, 
        
        // Form elements
        a.formElements = {
            name: {
                label: "Your name",
                type: "text",
                req: "yes",
                section: "Contact details",
                prefill: a.userInfo.fName.length > 1 ? a.userInfo.fName + " " + a.userInfo.lName : a.userInfo.displayName
            },
            email: {
                label: "Your Unimelb e-mail address",
                type: "text",
                req: "yes",
                prefill: "",
                section: "Contact details"
            },
            domain: {
                label: "Desired domain name",
                type: "text",
                req: "yes",
                section: "Domain details"
            },
            platform: {
                label: "Hosting platform",
                type: "select",
                req: "",
                options: ["Matrix CMS", "Wordpress CMS", "Bespoke", "Pursuit", "events.unimelb", "Confluence Wiki", "Webfarm", "Custom Application", "Other - please specify in the description", "Not sure"],
                section: "Platform"
            },
            current_site: {
                label: "Current site URL (if already created)",
                type: "text",
                req: "no",
                section: "Description"
            },
            position: {
                label: "Job title",
                type: "text",
                req: "yes",
                section: "Contact details"
            },
            url: {
                label: "URL (location) of content",
                type: "text",
                req: "yes",
                section: "Description"
            },
            marketing_url: {
                label: "The desired marketing URL",
                type: "text",
                req: "yes",
                section: "Description"
            },
            marketing_url_target: {
                label: "The full URL that the marketing URL will redirect to (please include any <a href='https://support.google.com/analytics/answer/1033867?rd=2'>Google campaign tracking code in this</a>).",
                type: "text",
                req: "yes",
                section: "Description"
            },
            currenturl: {
                label: "Current site URL (if exists)",
                type: "text",
                req: "no",
                section: "Description"
            },
            hosting: {
                label: "Where will the site be hosted?",
                type: "select",
                req: "yes",
                options: ["Matrix CMS", "Web farm", "Other - Please specify in the description"],
                sub: {
                    Other: {
                        label: "If hosted externally, where will the site be hosted?",
                        type: "multi",
                        triggers: ["Other - Internal", "Other - External"]
                    }
                },
                section: "Domain details"
            },
            designtype: {
                label: "What kind of assistance do you require?",
                type: "select",
                req: "no",
                options: ["New site design", "Existing site redesign", "Upgrade to new templates"],
                section: "Domain details"
            },
            domain_email: {
                label: "Do you need a general e-mail alias to accompany the domain requested?",
                type: "radio",
                options: ["Yes", "No"],
                section: "Domain details"
            },
            retire: {
                label: "Retire / review date",
                type: "select",
                req: "no",
                options: ["1 year", "2 years", "3 years", "4 years", "5 years"],
                section: "Domain details"
            },
            details: {
                label: "Request details - please provide as much information as you can.",
                type: "multi",
                req: "yes",
                section: "Description"
            },
            training: {
                label: "Training type",
                type: "select",
                req: "yes",
                options: ["Editor (Matrix Edit+)", "Administrator (Matrix CMS)", "Custom training (Bespoke CMS etc)", "Not sure"],
                section: "Description"
            },
            formid: {
                label: "Form ID",
                type: "text",
                req: "yes",
                section: "Description"
            },
            priority: {
	            label:  "How quickly do you need a response?<br /><em><strong>Low</strong> - one to two weeks<br /><strong>Normal</strong> - two working days<br /><strong>High</strong> - one working day<br /><strong>Urgent</strong> - today</em>",
	            type: "select",
	            req: "no",
	            options: ["low", "normal", "high", "urgent"],
	            section: "Priority"
            },
            due_at: {
                label: "Due date",
                type: "date",
                req: "no",
                section: "Description"
            },
            web_manager: {
                label: "The faculty/divisional web manager for this site",
                type: "text",
                req: "no",
                section: "Authorisation"
            },
            web_manager_contact: {
                label: "Contact details for the faculty/divisional web manager",
                type: "text",
                req: "no",
                section: "Authorisation"
            }
        }, 
        
        // Zendesk support groups
        a.groups = {
            accessibility: "20538035",
            analytics: "20488779",
            domains: "20600660",
            testing: "20488639",
            content: "20496964",
            design: "20600890",
            matrix: "21043294",
            hosting: "20600880",
            misc: "20537955"
        }
    }  
]) // End Form Control