# Image-size as a library to get the size of an image bugger 

* Status: Accepted

## Context and Problem Statement
In preparation for Issue 7, the API has been extended to return images in portrait and landscape format.
In order to recognize the corresponding formats, the dimensions of the images must be determined.

## Considered Options

* image-size
* buffer-image-size

## Decision Outcome
Chosen Option: **image-size**

* Good implementation
* Low overhead
* buffer-image-size is just a compromised fork of image-size 

### Positive Consequences
* Fast implmentation
* The returned object of image-size can directly be reused

 


