## Web help - Zendesk ticket helpdesk in the Staff Hub

This is an angular.js application, originally written and developed by Val Lyashov, adapted by Tom Stringer for Online Services in 2014.

https://staff.unimelb.edu.au/services/it-support/web-help

### Settings

The app is hosted on Matrix CMS, using the Design Customisation #1216409.

The files in this repo are held in the CMS under asset #1231032.

### Build and operation

The application uses a base template (the "Request web help" page) and inserts specific views into it, based on the actions triggered by the user. The basic views are:

1. __main__: this contains the majority of the initial loading page HTML layout
2. __request__: the HTML layout for the request pages
3. __thankyou__: the HTML layout for the thankyou and ticket submission confirmation screen

Each view contains angular binding points that receive content from the main scripts.js controller (#1231067).

[scripts.js (#1231067)](https://github.com/tomstringer/zendesk-helpdesk-app/blob/master/utilities-1231053/js-combined-1231060/scripts-1231067.js) contains the angular controllers and is the main asset required to update, add and delete forms for the application.
