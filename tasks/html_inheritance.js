/*
 * grunt-html-inheritance
 * https://github.com/askladchikov/grunt-template-inherit
 *
 * Copyright (c) 2014 Andrey Skladchikov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var fs = require('fs');
  var cheerio = require('cheerio');

  var dstpath, dstDir, modules=[];

  var dstDir = "../dist";

  //var modules = ["main", "megafon", "astral"];

  var findAllBlElements = function (container) {
      return container.find("*").filter(function (index) {
          var el = this[0];
          for (var i in el.attribs) {
              if (i.indexOf("bl-") != -1) {
                  this.data("bl-attr", i);
                  return true;
              }
          }
      });
  };

  var processBuildTags = function(container, $parent) {
      container.each(function (i, el) {
          var attrname = el.data["bl-attr"];
          var method = el.attribs[attrname];
          var sel = "*[" + attrname + "]";
          this.removeAttr(attrname);

          var parentEl = $parent.find(sel);

          var fakeParent = cheerio("<div></div>");
          fakeParent.append(this);

          if (method == "replace") {
              grunt.log.writeln("replacing element ", sel);
              parentEl.replaceWith(fakeParent.html());
          }
          if (method == "remove") {
              grunt.log.writeln("removing element ", sel);

              parentEl.remove();
          }
          if (method == "insert") {
              grunt.log.writeln("inserting element ", sel);

              parentEl.replaceWith(fakeParent.html());
          }
          if (method.indexOf("modify=") != -1) {
              grunt.log.writeln("modifing element ", sel);

              var data = JSON.parse(method.replace("modify=", ""));
              if (data.addattr) {
                  for (var i in data.addattr) {
                      parentEl.addAttr(i, data.addattr[i]);
                  }
              }
              if (data.removeattr) {
                  parentEl.attr(data.removeattr, null);
              }
              if (data.addclass) {
                  parentEl.addClass(data.addclass);
              }
              if (data.removeclass) {
                  parentEl.removeClass(data.removeclass);
              }
          }
      });
  };

  var cleanFromBlTags = function (content) {
      var removableRegex = /bl-[a-z]+="removable"/ig;
      var cleanRegex = /bl-[a-z]+(="[^"]+")?/ig;
      var isRemovable = removableRegex.test(content);
      if (!isRemovable) {
          return content.replace(cleanRegex, "");
      } else {
          var $container = cheerio("<div>" + content + "</div>");
          var allBlElements = findAllBlElements($container);
          
          allBlElements.filter(function (i) {
              var el = this[0];
              var attrname = el.data["bl-attr"];
              var method = el.attribs[attrname];
              this.removeAttr(attrname);
              return method == "removable";
          }).remove();
          
          return $container.html();
      }
  };

  var moduleToShowInfo = "";

  var processFile = function (content, srcpath) {

      var module = "main";
      
      //npm_modules не копируем
      if (srcpath.indexOf("npm_modules") != -1) {
          return false;
      }
      
      for (var i =0, moduleslen=modules.length; i<moduleslen;i++) {
          //определение текущего модуля
          if (dstpath.indexOf(dstDir + "/" + modules[i]) != -1) {
              module = modules[i];
          }
          //Если это дочерний HTML, то не копируем его
          if (srcpath.indexOf("." + modules[i] + ".html") != -1) {
              return false;
          }
      }
      
      //если это главный модуль - удаляем bl- аттрибуты
      if (module == "main") {
          return cleanFromBlTags(content);
      }
      
      if (moduleToShowInfo != module) {
          moduleToShowInfo = module;
          grunt.log.subhead("Processing module: "+module);
      }

      //Если есть дочерний файл, создаём его DOM, иначе возвращаем очищенный шаблон
      var childPath = srcpath.replace(".html", "." + module + ".html");
      if (!fs.existsSync(childPath)) {
          return cleanFromBlTags(content);
      }
      var childContent = String(fs.readFileSync(childPath));
      var $child = cheerio("<div>" + childContent + "</div>");
      
      //создаём DOM - элемент из текущего файла
      var $parent = cheerio(cheerio("<div>"+content+"</div>"));
      
      var blElements = findAllBlElements($child);
         
      var msg = " - "+srcpath + " - elements = " + blElements.length;
      grunt.log.writeln(msg.cyan);

      processBuildTags(blElements, $parent);

      return $parent.html();
      
  };


  grunt.registerMultiTask('html_inheritance', 'The engine to build htmls with replacing, inserting or modifing separated tags only using small html patches.', function() {
    var kindOf = grunt.util.kindOf;



        var options = this.options({
            encoding: grunt.file.defaultEncoding,
            // processContent/processContentExclude deprecated renamed to process/noProcess
            processContent: false,
            processContentExclude: [],
            mode: false
        });

        var copyOptions = {
            encoding: options.encoding,
            process: processFile,
            noProcess: options.noProcess || options.processContentExclude,
        };

        //Adding provided modules
        if (options.modules){
          modules = ["main"].concat(options.modules);
        }
        //saving destination directory
        dstDir = options.dstDir;

        var dest;
        var tally = {
            dirs: 0,
            files: 0
        };

        var copyFunction =function(src, dst, isExpandedPair){
          if (detectDestType(dst) === 'directory') {
              dstpath = dest = (isExpandedPair) ? dst : unixifyPath(path.join(dst, src));
          } else {
              dstpath = dest = dst;
          }


          if (grunt.file.isDir(src)) {

              grunt.verbose.writeln('Creating ' + dest.cyan);
              grunt.file.mkdir(dest);
              tally.dirs++;
          } else {
              grunt.verbose.writeln('Copying ' + src.cyan + ' -> ' + dest.cyan);
              grunt.file.copy(src, dest, copyOptions);
              if (options.mode !== false) {
                  fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
              }
              tally.files++;
          }

        }

        this.files.forEach(function (filePair) {
            var isExpandedPair = filePair.orig.expand || false;

            filePair.src.forEach(function (src) {
              debugger;

              for (var i in modules){
                var dstModulePath = dstDir+"/"+modules[i]+"/"+src;
                copyFunction(src, dstModulePath, isExpandedPair);
              }

/*
                if (detectDestType(filePair.dest) === 'directory') {
                    dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
                } else {
                    dest = filePair.dest;
                    dstpath = dest;
                }


                if (grunt.file.isDir(src)) {

                    grunt.verbose.writeln('Creating ' + dest.cyan);
                    grunt.file.mkdir(dest);
                    tally.dirs++;
                } else {
                    grunt.verbose.writeln('Copying ' + src.cyan + ' -> ' + dest.cyan);
                    grunt.file.copy(src, dest, copyOptions);
                    if (options.mode !== false) {
                        fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
                    }
                    tally.files++;
                }*/
            });
        });

        if (tally.dirs) {
            grunt.log.write('Created ' + tally.dirs.toString().cyan + ' directories');
        }

        if (tally.files) {
            grunt.log.write((tally.dirs ? ', copied ' : 'Copied ') + tally.files.toString().cyan + ' files');
        }

        grunt.log.writeln();
    });

  var detectDestType = function (dest) {
        if (grunt.util._.endsWith(dest, '/')) {
            return 'directory';
        } else {
            return 'file';
        }
    };

    var unixifyPath = function (filepath) {
        if (process.platform === 'win32') {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    };

};
