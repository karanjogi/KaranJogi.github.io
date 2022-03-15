# CTA Subway Data Visualization
#### Authors: Abhijeet Chintakunta, Karan Jogi

___

The dashboard is hosted on shinyapps.io and can be accessed from [here](https://abhijeet2596.shinyapps.io/Project2/)


___
## Walkthrough video

___
## Background
  
The dashboard is designed to visualize and compare ridership data of all the CTA Stations for the all lines: Red, Blue, Pink, Orange, Yellow, Green, Brown and Purple. This project was developed in RStudio using R programming language and Shinyapp to deploy as an application. This application was designed to run on a touchscreen with resolution 11,520 x 3,240 without scrolling.

  
___

## Requirements

1. Running the dashboard
    * Internet connection and [link](https://karanjogi.shinyapps.io/Chicago-CTA-Subway/)

2. Running the [source code](https://github.com/karanjogi/Chicago-CTA-Subway):
    * Clone the repository from github
    * R(version 4.1.2) and Rstudio to edit and run the code
    * **R packages required:** htmlwidgets(1.5.4), DT(0.20), shinyWidgets(0.6.4), shinythemes(1.2.0), scales(1.1.1), gridExtra(2.3), forcats(0.5.1), stringr(1.4.0), dplyr(1.0.7), purrr(0.3.4), readr(2.1.1), tidyr(1.1.4), tibble(3.1.6), tidyverse(1.3.1), leaflet.providers(1.9.0), leaflet(2.0.4.1), ggplot2(3.3.5), lubridate(1.8.0), shinydashboard(0.7.2), shiny (1.7.1)            


        * Any required package can be installed using:  
          
    ```R
    install.packages("package_name")
    ```
    * Shinyapps account

___

## Data
1. The CTA Subway data is publicy available at [Chicago Data Portal](https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Daily-Totals/5neh-572f). The dataset consists of **1.09M** datapoints containing all the CTA Subway stations of all the lines.  
A gist of the dataset can be seen below:  
    ### Column Preview:
    ![column_data](/images/posts/cta_subway/columns_data.png)

    ### Table Preview:
    ![tabular_data](/images/posts/cta_subway/table_preview.png)

2. The location and line details for each station is also available at [Chicago Data Portal](https://data.cityofchicago.org/Transportation/CTA-System-Information-List-of-L-Stops/8pix-ypme). This dataset consists of locations and directions for **148** currently working stations and is updated on regular basis.
    ### Column Preview:
    ![column_data](/images/posts/Project_2/column_data.png)

    ### Table Preview:
    ![table_data](/images/posts/Project_2/table_data.png)


___
## Processing
* There are 2 files one for riderships and the other for location and line information. Hence to process data in a single dataframe we merge these two as follows:

```R
library(tidyverse)
library(dplyr) 

ctaloc<- read.csv(file="CTA_-System_Information-List_ofL_Stops.csv")
cta<-read.delim(file="CTA_-Ridership-_LStation_Entries-_Daily_Totals.tsv",sep="\t",quote="")

names(cta)[1]<-"station_id"

ctaloc1 <-ctaloc[,c(6:17)]

ctaloc1 <- ctaloc1 %>% distinct(MAP_ID,.keep_all=TRUE)

ctadl <- merge(cta,ctaloc1,by.x="station_id",by.y = "MAP_ID",all=FALSE)
```
* As the latitudes and longitudes are in are stored as a string they need to be extracted from the Location value into seperate columns.

```R
ctadl$Latitude <- lapply(ctadl$Location, function(x) str_extract(x, "[0-9]+[.][0-9]+(?=[,])"))
ctadl$Longitude <- lapply(ctadl$Location, function(x) str_extract(x,"[-][0-9]+[.][0-9]+(?=[)])"))

ctadl$Latitude <- as.double(ctadl$Latitude)
ctadl$Longitude <- as.double(ctadl$Longitude)
```

* Once our single dataframe is ready we can export it to a tsv by the following command:

```R
write.table(ctadl,"CTA.tsv",sep="\t")
```

* The data is first chuncked into a number of smaller sized which will enable us to upload them on the free shiny server(5Mb). This is done by running the bash script.

```bash
awk -v lines="30000" -v pre="awk_part_" '
        NR==1 { header=$0; next}
        (NR-1) % lines ==1 { fname=pre c++; print header > fname}
        {print > fname}' CTA.tsv
```

Once the data is split you can move the original dataset to a different filepath to reduce the data redundancy.  
To read all the chuncked file the following code is used:
```R
temp = list.files(pattern="*.tsv")
allData <- lapply(temp,read.delim)
ctaloc <- do.call(rbind, allData)
```
* If we used ```R table.read()``` then we will be missing most of our data as there's a **quote(')** in the dataset.  


* When we check the dataframe the dates are not intrepreted by R as dates. So we need to use **lubridate** package to convert all the date values to R-interpretable format. This helps us aggregate and label the months and days easily.

```R
ctaloc <- ctaloc %>% 
  mutate(date = mdy(date))
```

* We have to plot the ridership data for various stations for the year 2021 as well as for the year selected in the date input so we stored them seperately which helps save time when processing the data as the dataframe has limited rows

```R
cta_2021 <- ctaloc %>% filter(year(date) == "2021") %>% select("stationname", "date", "rides")
cta_rides <- ctaloc %>% select("stationname", "date", "rides")
```
___
## Dashboard

* The About Page gives a high-level overview of the application, the dataset used, and the Authors. 
![about](/images/posts/Project_2/about.png)

* To access the dashboard go to the [link](https://abhijeet2596.shinyapps.io/Project2/).  
The first page which opens is the Main page.
![dashboard](/images/posts/Project_2/dashboard.png)
The Main page is divided into three sections:
    1. The first section consists of a leaflet map displaying all the stations which are coloured according to the line they are connected to. The map tiles are customizable and can be changed according to the users choice. <br> <br>
    ![map](/images/posts/Project_2/map_default.png) <br> <br>
    The map in Railway tile: <br> <br>
    ![railway_map](/images/posts/Project_2/map_railway.png)

    1. The second section plots the ridership for May 23, 2021 by default in alphabetical order. Which also can be changed by the input given. The user can select between displaying a table or a graph as required. <br> <br>
    ![plot_all](/images/posts/Project_2/plot_all.png)<br> <br>
    The user can change the date selected by either using the date input which is provided or can compare the riderships of the various stations by clicking on next/previous day button.
    The user can select a station from the input selection dropdown or by clicking on the leaflet map and the textbox below displays all the lines which that staion is connected to.<br> <br>
    ![lines_station](/images/posts/Project_2/lines_station.png)<br>
    
    1. The third section displays various graphs for the selected station: Yearly ridership, daily ridership for 2021, Month ridership for the year selected in the date, Weekday ridership for the year selected in the date. It also allows the user to peek into the data by displaying the tables for each. <br><br>
    ![plots](/images/posts/Project_2/plots.png)

___
