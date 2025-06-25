PPG UI Application
===========

Overview
--------
This is the code for the UI of Crown Commercial Service's (_CCS_)
Public Procurement Gateway (_PPG_).

Technology Overview
---------
The project is implemented as an [Angular CLI](https://github.com/angular/angular-cli) web application, implemented using NPM.

The core technologies for the project are:

* [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2
* NPM for package management
* [Karma](https://karma-runner.github.io) for unit testing
* [Protractor](http://www.protractortest.org/) for end-to-end testing

Building and Running Locally
----------------------------
To run the application locally, you will first need to ensure that the following APIs are running locally:
* Security API
* Core API – Dashboard API
* Notification API
* Buyer Validation API
* Configuration API
* Contact API
* User API
* Organisation API

You will need to be supplied with a local secrets file (`environment.ts`) to enable the project to run, which can be supplied by any member of the development team.

As a pre-requisite to running you will need to run **npm install** to install the application's dependencies.

Once the above has been completed, you can run the application by running **npm start**.  It can then be accessed via the URL and port reported in the command's output - generally this is http://localhost:4200/.

Branches
--------
When picking up tickets, branches should be created using the **_feature/*_** format.

When completed, these branches should be pull requested against _**develop**_ for review and approval.  _**develop**_ is then built out onto the **Development** environment.

The **Test** and **Pre-Production** environments are controlled via means of release and hotfix branches.

Release branches should be created from _**develop**_ using the **_release/*_** format, whilst hotfixes should be created from _**main**_ using the **_hotfix/*_** format.  These branches can then be built out to **Test** and **Pre-Production** as appropriate.

When releases/hotfixes are ready for deployment to **Production**, the **_release/*_** or **_hotfix/*_** branch in question should be pull requested against the _**main**_ branch for review and approval.  This branch should then be built out to **Production**.

Once a release/hotfix has been completed you should be sure to merge _**main**_ back down into _**develop**_.