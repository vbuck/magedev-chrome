# Magento Developer Tools
## Environment Tagging

How many times have you changed something on production but thought you were working
from your dev environment? If you said "never," you lied.

This Chrome browser extension provides page tagging for Magento developers, so that 
whatever tab you have open to a page, its tab icon and page content will be specially
marked according to its environment type:

* Development
* Staging
* Production

Currently these three environments are supported. Submit an issue for additional
support or a PR if you can add it yourself!

## Screenshots

![Browser bar icon](https://raw.githubusercontent.com/vbuck/magedev-chrome/master/screenshots/fig1.png)

![Environment setup](https://raw.githubusercontent.com/vbuck/magedev-chrome/master/screenshots/fig2.png)

![Visual on-page environment cues](https://raw.githubusercontent.com/vbuck/magedev-chrome/master/screenshots/fig3.png)

## Installation

Coming soon to the Chrome Web Store.

For manual installations, see here:

* Download or clone this reposity to your local machine
* Browse to chrome://extensions/
* Enable **Developer Mode** at top, right
* Select **Load unpacked extension...**
* Browse to the download folder

Once installed, you should see a Magento icon in your browser bar. You will then setup
your environments. Right-click on that icon and select **Options**.

To add an environment:

* Click **Add**
* Enter any PCRE pattern to match on your environment URL
* Select an environment type
* Click **Save Changes**

Then, browse to one of your environments, and you should see the visual cues appear.