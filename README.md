# asset-build-template
A template node.js project with assets compiler &amp; tests.

## Requirements
* Java - For the [node-minify](http://npm.im/node-minify) library

## Usage

This project can be used with a CI such as [Travis](https://travis-ci.org/), [CircleCI](https://circleci.com/) or [CodeShip](https://codeship.com/), using the `npm test` command.

It will minify all CSS and JavaScript files (you can also include libraries such as jQuery separately to your application)

**To run tests on both JavaScript and CSS assets run:**
```shell
$ npm test

> asset-build-template@1.0.0 test /home/ubuntu/asset-build-template
> node assets --both-test

Starting assets build for CSS, JS libraries and JS app...
NOTICE: Build is error sensitive!
> Built library JavaScripts in 20.900ms
> Built CSS in 187.663ms
> Built JavaScripts in 470.311ms
> Assets build status: OK

```

**To run tests on just JavaScript assets (both application and libraries) run:** `npm run test-js`

**To run tests on just CSS assets run:** `npm run test-css`

## Notes

Using the npm scripts, the build will be error sensitive and fail if the minify library fails.

You can override this by requireing the `assets.js` file and calling the `latestBuild` function.

I will probably add an example of this in the future and document the function better.