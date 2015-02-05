## nuca-webapp

#### Dev mode

```
npm install -g grunt-cli
npm install
grunt dev
```

#### Prod mode

```
npm install -g grunt-cli
npm install
grunt prod
```

### Behind the scenes

* nodejs to bring dev dependencies (using npm only)
* bower to get all the frontend dependencies
* grunt for running tasks
* scss compiles to css (including bootstrap)
* coffee-script compiles js
* uglify to mimify the compiled js
* protractor for testing
