# Student Choice

## US Political donations
## The link to the visualization can be found [here](https://demo-political.heavy.ai/mapd/dashboard/50)

![dashboard](/images/posts/studentchoice/dashboard.png)

___

## Purpose

This dashboard visualizes the political donations contributed by various sources for a time period of 2001-2016. The data is visualized using the world map and is aggregated by the donations recipients, the recipients party. The visulization also shows a time-series representation at the bottom. This dashboard intends to unearth political funding trends and give a wholistic perspective to the election campaigns. The user can select a particular region, recipient and the amount of contribution to compare the fundings.

___


## Source of Data

The data used for creating the dashboard is collected by the Federal Election Commission of the United States of America. The data can be found [here](https://www.fec.gov). The data contains **101M** records of donations dating back to 2001. The dataset is kept updated with the current donations however the visualization has only considered upto 2016 as it was created during that year.

The data can be found under:
* Campaign finance data
    * All data
        * Bulk data and other sources
            * Individual contributions

The link to this page can be found [here](https://www.fec.gov/data/browse-data/?tab=bulk-data). There are other data to play with too which can be used for another visualization. The data is not pure and will need many manipulations to deal make it visualizable.

The data page is as follows:

![data_page](/images/posts/studentchoice/data_page.png)


___

## Users the visualization was made for

The dashboard is created for anyone who's interested in understanding the financial aspect of politics. It can help various agencies to see trends in the political funding of various regions and can also help the political parties to find their strong as well as weak regions based on contributions. People can also analyse which PAC or candidate raised how much from their area of interest. Professors can use this tool to explain the impact of various candidates, their strategies and lacking regions.

___

## Some questions

* How did the ActBlue that broke FECs servers worked for democrats?
* What is the inclinaiton of a certain county/state/pincode?
* How well did Trump perform in 2016 as opposed to Romney in 2012

___

## How to find answers with this tool

This tool has various types of filters:
* Global filters
    * These filters apply on the data input to the dashboard and can be used to set context to the data like in case of performance of Trump vs Romney we can globally filter him and then globally filter Romney. It can be done using the filter icon on the extreme right
    <br>
    ![global_filter](/images/posts/studentchoice/global_filters.png)
    <br>
* Chart filters
    * These filters are crossfilters which dynamically change all the visualizations based on the filter applied on one of the charts which allows the user to view data from multiple dimensions.

    * The user can apply filter on various charts however these filters will be cascaded. Supposedly if you want to see data for Democrats for the years 2014-2016 then you can filter democrates from the pie chart to show only democrats data and then filter out the dates.

    * The map is also used a filter if you want to see a particular region/state/pincode you can just type it in the text box named "zoom to" and the data will be filtered according to that. For example Chicago

    <br>
    ![mapfilter_box](/images/posts/studentchoice/mapfilter_box.png)
    <br>

    ![mapfilter](/images/posts/studentchoice/mapfilter.png)

    <br>

    For more information on how to use a filter can be found in the below view:

<br>
* Now lets answer one of the questions above: 
    * How did ActBlue worked for democrats? <br>
    What is ActBlue? <br>
    Act Blue famously broke the FEC’s servers in the 2014 campaign due to huge number of donors wanting to donate small amounts of money via the mobile-friendly technology platform newly suggested by the Democrats that enabled both subscription giving and micro-giving. This app transformed the game for Democratic candidates across the land. Bernie Sanders used the platform to raise close to $200M in 2015-2016 the vast majority of it in small ($26 average) increments. <br>

    1. To answer this we'll try to filter donations with lower amounts than 200$ using the global filter. 
    
![eg1](/images/posts/studentchoice/eg1.png)

    2. Filter Country to USA using the text box

![eg2](/images/posts/studentchoice/eg2.png)

    3. Change the date range to 1y and then brush the dates from Jan 01 2015 - Jan 01 2017

![eg3](/images/posts/studentchoice/eg3.png)

The dashboard looks like the following:
![eg4](/images/posts/studentchoice/eg4.png)

This clearly shows that the Repulicans didn't utilize the power of smaller donations given by a number of people.

![eg5](/images/posts/studentchoice/eg5.png)


## What works?

* The color scheme used is very simple, classic and depicts the difference in parties in quite interpretable manner.
* The way visualizations don't add any misrepresentation or an false dimension to the data leading to incorrect/false assumptions
* The ability for the user to change the granularity of the information is also quite nice
* The cross filters and global filters give the user to view the data through various dimensions

## Improvements

* The legends in the in the map and the line charts could be more interpretable
* There is an unknown party for donations by party which is not clarifies
* Although the colors are with colorblindness the color palatte doesn't have effective distinction for Tritanope
* Sometimes due to big data processing issues the dashboard doesn't work and needs to be reloaded