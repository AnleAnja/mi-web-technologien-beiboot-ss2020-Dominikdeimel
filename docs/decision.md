# Deciding on PWA features

[Lighthouse](https://developers.google.com/web/ilt/pwa/lighthouse-pwa-analysis-tool) is an open-source tool from Google that audits a web app for PWA features. It provides a set of metrics to help guide in building a PWA with a full application-like experience for users.

In order to decide which PWA features should be implemented, a Lighthouse report was generated. Within this report, Lighthouse checks for the fulfillment of various features and explains their relevance.

The Google Lighthouse report was used for the implementation of the PWA. The goal was to work through the different aspects of the report. Every aspect was fulfilled in order to provide the best possible progressive web application.

## Fast and reliable

#### Page load is fast enough on mobile networks
A fast page load over a cellular network ensures a good mobile user experience.
#### Current page responds with a 200 when offline
If you're building a Progressive Web App, consider using a service worker so that your app can work offline.
#### `start_url` responds with a 200 when offline
A service worker enables your web app to be reliable in unpredictable network conditions.

## Installable

#### Uses HTTPS
All sites should be protected with HTTPS, even ones that don't handle sensitive data. This includes avoiding mixed content, where some resources are loaded over HTTP despite the initial request being servedover HTTPS. HTTPS prevents intruders from tampering with or passively listening in on the communications between your app and your users, and is a prerequisite for HTTP/2 and many new web platform APIs.
#### Registers a service worker that controls page and `start_url`
The service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications.
#### Web app manifest meets the installability requirements
Browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement.

## PWA Optimized

#### Redirects HTTP traffic to HTTPS
If you've already set up HTTPS, make sure that you redirect all HTTP traffic to HTTPS in order to enable secure web features for all your users.
#### Configured for a custom splash screen
A themed splash screen ensures a high-quality experience when users launch your app from their homescreens.
#### Sets a theme color for the address bar.
The browser address bar can be themed to match your site.
#### Content is sized correctly for the viewport
If the width of your app's content doesn't match the width of the viewport, your app might not be optimized for mobile screens.
#### Has a `<meta name="viewport">` tag with `width` or `initial-scale`
Add a `<meta name="viewport">` tag to optimize your app for mobile screens.
#### Contains some content when JavaScript is not available
Your app should display some content when JavaScript is disabled, even if it's just a warning to the user that JavaScript is required to use the app.
#### Provides a valid `apple-touch-icon`
For ideal appearance on iOS when users add a progressive web app to the home screen, define an `apple-touch-icon`. It must point to a non-transparent 192px (or 180px) square PNG.
#### Manifest has a maskable icon
A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device.

## Caching

To allow the PWA to be used in offline mode and to intercept possible errors, the caching has been optimized.

At the first usage of the application a picture, its metadata and a quote from the API are cached. If the first request fails, the application uses a default picture with its gradient and a default quote.
