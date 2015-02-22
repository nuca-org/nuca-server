fs = require("fs")

module.exports = (grunt) ->

  BUILD_PATH = process.env.BUILD_PATH || "../public/"
  BASE_HREF = process.env.BASE_HREF || "/"
  
  BUILD_APP_JS = "#{BUILD_PATH}scripts/app.js"
  BUILD_VENDOR_JS = "#{BUILD_PATH}scripts/vendor.js"
  BUILD_MAIN_JS = "#{BUILD_PATH}scripts/main.min.js"

  # the order in which these files are loaded is important
  # imagine if the services are loaded before angular.module("nuca")
  COFFEE_FILES = {}
  COFFEE_FILES[BUILD_APP_JS] = [
    "src/scripts/*.coffee"
    "src/scripts/**/*.coffee"
  ]

  VENDOR_FILES = {}
  VENDOR_FILES[BUILD_VENDOR_JS] = [
    "bower_components/angular/angular.js"
    "bower_components/angular-route/angular-route.js"
    "bower_components/angular-resource/angular-resource.js"
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.js"
    "bower_components/angular-animate/angular-animate.js"
    "bower_components/moment/min/moment-with-locales.js"
    "bower_components/angular-moment/angular-moment.js"
    "bower_components/toastr/toastr.js"
    "bower_components/angular-toastr/dist/angular-toastr.js"
    "bower_components/angular-ui-utils/ui-utils.js"
    "bower_components/lodash/dist/lodash.js"
    "bower_components/angular-google-maps/dist/angular-google-maps.js"
    #"bower_components/angular-facebook/angular-facebook.js"
  ]

  MAIN_FILES = {}
  MAIN_FILES[BUILD_MAIN_JS] = VENDOR_FILES[BUILD_VENDOR_JS].concat(BUILD_APP_JS)

  TARGET_HTML_FILES = {}
  TARGET_HTML_FILES["#{BUILD_PATH}index.html"] = "src/index.html"

  STATIC_FILES = [
    "views/**"
    "imgs/**"
    "scripts/directives/*.html"
    "styles/img/*" #images, as refferenced in the CSS
  ]

  COMPONENT_CSS_FILES = [
    "font-awesome/fonts/*"
    "font-awesome/css/*"
    "angular-xeditable/xeditable.css"
  ]
  
  LESS_FILES = {}
  LESS_FILES["#{BUILD_PATH}styles/main.css"] = "src/styles/**/*.less"

  grunt.initConfig
    copy:
      main:
        files: [
          {
            expand: true
            cwd: "src/"
            # any files which will not be "compiled" need to be moved to the
            # build directory
            src: STATIC_FILES
            dest: BUILD_PATH
          }
          #copy components CSS files to the style folder
          {
            expand: true
            cwd: "bower_components/"
            src: COMPONENT_CSS_FILES
            dest: BUILD_PATH + "styles/"
          }
        ]

    coffee:
      compile:
        options:
          bare: true
        files: COFFEE_FILES

    less:
      main:
        files: LESS_FILES

    revision:
      options:
        property: "meta.revision"
        ref: "HEAD"
        short: true

    targethtml:
      dev:
        options:
          curlyTags:
            baseHref: BASE_HREF
        files: TARGET_HTML_FILES
      prod:
        options:
          curlyTags:
            baseHref: BASE_HREF
            version: "<%= meta.revision %>"
        files: TARGET_HTML_FILES

    uglify:
      dev:
        options:
          mangle: false
          beautify: true
        files: VENDOR_FILES
      prod:
        options:
          mangle: true
        files: MAIN_FILES        

    cssmin:
      target:
        src: "#{BUILD_PATH}styles/main.css"
        dest: "#{BUILD_PATH}styles/main.min.css"

    clean:
      options:
        force: true
      build:
        src: [ "#{BUILD_PATH}/*", "#{BUILD_PATH}/*/**", "!#{BUILD_PATH}/uploads/**" ]
      css:
        src: [ "#{BUILD_PATH}styles/*.css", "!#{BUILD_PATH}styles/*.min.css" ]
      js:
        src: [ "#{BUILD_PATH}scripts/*.js", "!#{BUILD_PATH}scripts/*.min.js" ]

    # nospawn makes watching blazing fast (TM)
    watch:
      less:
        files: "./src/styles/**/*.less"
        tasks: ["less:main"]
        options:
          nospawn: true 
      coffee:
        files: "./src/scripts/**/*.coffee"
        tasks: ["coffee"]
        options:
          nospawn: true
      targethtml:
        files: [
          "src/index.html"
        ]
        tasks: ["targethtml:dev"] 
        options:
          nospawn: true
      static:
        files: [
          "src/**/*.html"
          "imgs/**/*"
          "styles/img/*"
        ]
        tasks: ["copy:main"]
        options:
          nospawn: true

    bower:
      install:
        options:
          targetDir: "./bower_components"

    coffeelint:
      options:
        max_line_length:
          level: "ignore"
      app: ["src/**/*.coffee"]


  grunt.registerTask("build", ["bower", "clean:build", "copy:main", "less:main", "coffee"])
  grunt.registerTask("build:dev", ["build", "uglify:dev", "targethtml:dev"])
  grunt.registerTask("build:prod", ["build", "uglify:prod", "revision", "targethtml:prod", "clean:js", "cssmin", "clean:css"]) #"revision", 
  
  grunt.registerTask("dev", ["build:dev", "watch"])
  grunt.registerTask("prod", ["build:prod"])  

  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-cssmin"
  grunt.loadNpmTasks "grunt-targethtml"
  grunt.loadNpmTasks "grunt-contrib-less"  
  grunt.loadNpmTasks "grunt-git-revision"
