# TigerRank
![Definitive ranking of all Princeton students](https://i.imgur.com/0hvWVX3.png "Definitive ranking of all Princeton students")
## What's TigerRank?
**TigerRank** was allegedly a "new, convenient way to view the definitive rankings of all students at Princeton University". In reality, of course, it was nothing more than a random ordering of names of all 5000+ students at Princeton University.

The mystery behind it though was enough to lure **2270+ Princeton students** in a matter of around 6 hours. The website received **over 5000 unique sessions** the day it was launched, initially from Princeton and later from other parts of the USA.

There's a demo website running on the TigerRank domain now at https://tigerrank.herokuapp.com/. It is filled with randomly generated fake names and is devoid of CAS authentication and server-side rank updates.

The project was a product of the wonderful minds at [TigerMag](http://www.tigermag.com/2019/04/tigermag-claims-responsibility-for-tigerrank-notre-dame/)⁠—one of America's oldest college humor magazines.

This repo will allow you to create your own version of TigerRank, if you ever desire to do so for whatever reason! If you do, please use it responsibly—as innocent as a list of names can be, it is still private information one should do its best to keep safe. 

## Features
Even though the platform was completely bogus and was written by me in a couple of hours, there are a number of features included in TigerRank to ensure everything is fair and square.

* **CAS Authentication:** All the data can be protected under a CAS protocol.
* **MongoDB Database support:** For a simple, easy to manipulate data.
* **Complaints:** In the unlikely scenario that one disagrees with the ranking, they have the option to file a complaint. 
* **Punishments:** The system, on the other hand, has the ability to punish the unthankful complainer by dropping their rank along with some lovely animations. [Try it yourself](http://tigerrank.herokuapp.com/rankings).

and more!

## Setting up your own TigerRank server.
Setting up and customizing TigerRank is easy. It requires *a NodeJS server*and *a MongoDB database*. You may create support for other database types if you would like.
1. Clone the repository and install the dependencies through ```npm install```.
2. Rename ```config_sample.json``` to ```config.json``` and fill in the appropriate fields. You have the option to change names, colors, and more. All to your liking and purpose.
3. *Putting the names into the database*: there is a ```scripts/import.js``` script to put names from a JSON file into the MongoDB database. You may also shuffle your JSON for a random ordering with ```scripts/shuffle.py```.
4. After everything is done, run ```npm start```.

You are all set. If you ever decide to do your own version of the TigerRank prank at your college or university (something which I totally *do not* endorse), let me know!

***Note of caution:*** you are responsible for making sure whatever data you are displaying with this platform is properly protected, ideally encrypted too. Please be careful when using this software with sensitive data. Our prank was designed to be short-lived and not known outside our campus to ensure any attempts of wrongdoing are minimized and I would recommend for you to do the same. It is also not the most unit-tested platform, so take things with a grain of salt.