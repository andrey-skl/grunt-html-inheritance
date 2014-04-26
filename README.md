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
          files: { 
            src:'**.html' //array of files to process or grunt-compatible file selector like '**/*.html'
          },
          options: {
              modules: ["version1", "version2"], //array of modules you want to build additionall to "main"
              dstDir: "../dist",
          },
      },
  },
});
```

##Syntax definition
The engine have just four modes of inheritance.

###1. Replace

Okay. Lets imagine you have main version of your html file "myfile.html" with text "Here is main version" in a div.

```html
<div>
	Blah blah blah
	<div>Here is main version</div>
</div>
```

And now you want to customize this file for version called "myver" to replace target div with other elements. You can create any count of custom versions you want. All what you need is just few steps:

1. Add business logic attribute to tag you want to customize. Business logic tag starting with "bl-":

```html
<div>
	Blah blah blah
	<div bl-mytesttag>Here is main version</div>
</div>
```

2. Create child file with html patch to you main file. Call it using pattern "__your_file_name__.__version_name__.html". In this example name should be "myfile.myver.html". Place file in same folder as original file. Define html code to replace main version tag like this:

```html
<div bl-mytesttag="replace">Here is MYVER version <!--any html here--></div>
```

The "replace" value of business logic attribute means this div will be replaced by child element

###2. Remove

Sometimes you need to remove parent element in customized version. You can do it pretty easy:

Main html not changed:
```html
<div>
	Blah blah blah
	<div bl-mytesttag>Here is main version</div>
</div>
```

Child html:
```html
<div bl-mytesttag="remove"></div>
```

###3. Insert

Other case is you want no elements in main version, but custom element in custom version - insert element in any position in custom version.

In main html you have to specify that you dont want to see that element in main version using keyword "removable":
```html
<div>
	Blah blah blah
	<div bl-mytesttag="removable"></div>
</div>
```

In child html you inserting your tags to place you defined in main html:
```html
<div bl-mytesttag="insert">Inserted html in MYVER version</div>
```

###4.Attributes modification

In this case you dont want to change parent tag, but you want to add/change/remove some attributes or classes.

Main html not changed:
```html
<div>
	Blah blah blah
	<div bl-mytesttag data-attributetoremove class="myClass">Here is main version</div>
</div>
```

You can change attributes and classes in child using "modify" keyword and json-like syntax:


```html
<div bl-filterblock='modify={"addattr":{"test1":"test2", "test3":"test4"}, "removeattr":"test1 test2", "addclass":"testaddedfclass", "removeclass":"testclass"}'></div>
```

Let's see closer to syntax:

####addattr
Adding attributes with values:
```html
<div bl-filterblock='modify={"addattr":{"test1":"test2", "test3":"test4"}'></div>
```
This code will add "test1" attribute with "test2" value and "test3" attribute with "test4" value

####removeattr
Removing attributes:
```html
<div bl-filterblock='modify={"removeattr":"test1 test2"}'></div>
```
This code will remove "test1" and "test2" attributes

####addclass
Adding classes:
```html
<div bl-filterblock='modify={"addclass":"testaddedfclass"}'></div>
```
This code will remove "testaddedfclass" class

####removeclass
Removing classes:
```html
<div bl-filterblock='modify={"removeclass":"testclass"}'></div>
```
This code will remove "testclass" class

