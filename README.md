# grunt-html-inheritance

> The engine to build htmls with replacing, inserting or modifing separated tags only using small html patches.

##The problem

In some kinds of single page apps (AngularJS for example) the templates is just small pieces of html code stored in project folder. Sometimes you need to customize this html for different versions of app: main and version for other client, for example. Bad way to customize html is using a lot of IF: if (ver==main) <-- some tags --> else <--other tags-->. 

This module provide better xslt-like way to customize html files: in main version you place "business logic attributes" bl-* in tags you want to customize:
```html
<div bl-mycustomtag>Here is main version</div>
```
And then you create child file _file_name._version_name.html, where you customize this tag:
```html
<div bl-mycustomtag="replace">Here is custom version</div>
```


## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html-inheritance --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-inheritance');
```

### Options

#### options.modules
Type: `Array`

A array of string described what modules you like to build.

#### options.dstDir
Type: `String`
Default value: `dist`

A path to directory to place builded html

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  html_inheritance: {
      main: {
          files: files, //array of files to process or grunt-compatible file selector like '**/*.html'
          options: {
              modules: ["version1", "version2"], //array of modules you want to build additionall to "main"
              dstDir: "../dist",
          },
      },
  },
});
```

##Syntax definition

###will be added later