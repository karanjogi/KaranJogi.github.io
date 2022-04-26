# CTA Subway Data Visualization
#### Authors: Abhijeet Chintakunta, Karan Jogi

___

The dashboard is hosted on shinyapps.io and can be accessed from [here](http://shiny.evl.uic.edu:3838/g9/abjo/)


___
## Walkthrough video

___
## Background
  
The dashboard is designed to visualize and compare the ridership for various community areas and taxi companies in Chicago. It also displays a region for outside of Chicago Community as it was not part of the scope. This project was developed in RStudio using R programming language and Shinyapp to deploy as an application on EVL shiny server. This application was designed to run on a touchscreen with resolution 11,520 x 3,240 without scrolling.

  
___

## Requirements

1. Running the dashboard
    * Internet connection and [link](http://shiny.evl.uic.edu:3838/g9/abjo/)

2. Running the [source code](https://github.com/karanjogi/Chicago-Taxi):
    * Clone the repository from github
    * R(version 4.1.2) and Rstudio to edit and run the code
        * Instructions on how to install R and Rstudio are [here](https://rstudio-education.github.io/hopr/starting.html)
    * **R packages required:** DT(0.20), forcats(0.5.1), stringr(1.4.0), dplyr(1.0.7), purrr(0.3.4), readr(2.1.1), tidyr(1.1.4), tibble(3.1.6), tidyverse(1.3.1), leaflet.providers(1.9.0), shinydashboard(0.7.2), shiny(1.7.1), leaflet(2.0.4.1), ggplot2(3.3.5), lubridate(1.8.0)

        * Any required package can be installed using:  
          
    ```R
    install.packages("package_name")
    ```
    * Run app.R from the unzipped folder of the repository
    * Shinyapps account/server connection: For deployment we used the UIC Lab server however you can deploy the app on the Free Tier shiny. As the file is quite big and the app is a little processing heavy on Free Tier. But the app should run fine on the local machine.

___

## Data
1. The Taxi data is publicy available at [Chicago Data Portal](https://data.cityofchicago.org/Transportation/Taxi-Trips-2019/h4cq-z3dy). The dataset consists of **16.5M** datapoints containing information about various taxi rides either originating or terminating within the Chicago City. The original file which is downloaded from the above link is quite large(7 GigaBytes) and we only require a subset of the dataset which we abstracted using the **preprocessing.py**
A gist of the dataset can be seen below:  
    ### Column Preview:
    ![column_data](/images/posts/chicago_taxi/columns_data.png)

    ### Table Preview:
    ![tabular_data](/images/posts/chicago_taxi/table_data.png)

2. The location and community area details for each area is also available at [Chicago Data Portal](https://data.cityofchicago.org/Facilities-Geographic-Boundaries/Boundaries-Community-Areas-current-/cauq-8yn6). This GeoJSON file consists of locations polygons and a few information about **77** community areas in Chicago.

![geojson](/images/posts/chicago_taxi/geojson.png)


___
## Processing
* The original dataset is quite wide and we do not use all 23 columns from it for the dashboard for which we trim the unsed columns using python and pandas(A data processing package in Python):
    * The file used for processing the original data is preprocessing.py and can be found [here]().
    In this file we read the original dataset and drop the unused columns. We converted the Trip Start Time to a datetime as it makes it easier to work with lubridate. We also filter out outliers such as extremely short and long rides based on both distance and time. Additionally, we replace the outside community area (currently NA) to 100 which helps remove the NA values from the dataset and then downcast the column data-type to unsigned int which helps working with the data easier. Taxi company names are the ones which take up most space and are tricky to deal with so we map the original names to a shorter name while trying to retain the nuances between different companies.

    ```Python

    import pandas as pd

    taxi= pd.read_csv("Taxi_Trips_-_2019.tsv",sep="\t",quotechar='"')


    # Trip Start Timestamp (string -> date and time)
    # Trip Seconds (int)
    # Trip Miles (float)
    # Pickup Community Area (int)
    # Drop-off community Area (int)
    # Company (string)

    select_cols = ["Trip Start Timestamp", "Trip Seconds", "Trip Miles", "Pickup Community Area", "Dropoff Community Area", "Company"]

    taxi = taxi.loc[:, select_cols]

    #Filter out extremely short and long trips
    taxi = taxi[(taxi["Trip Miles"]>=0.50) & (taxi["Trip Miles"]<=100)]
    taxi = taxi[(taxi["Trip Seconds"]>=60) & (taxi["Trip Seconds"]<=18000)]

    #Convert Trip Start time to a datetime
    taxi["Trip Start Timestamp"] = pd.to_datetime(taxi["Trip Start Timestamp"])

    #Convert the time stamp to Hour for usability
    taxi["Trip Start Timestamp"] = taxi["Trip Start Timestamp"].dt.floor(freq="H")

    #Downcast the columns to a workable datatype
    taxi["Trip Seconds"] = pd.to_numeric(taxi["Trip Seconds"], downcast="unsigned")
    taxi["Trip Miles"] = pd.to_numeric(taxi["Trip Miles"], downcast="float")
    taxi["Pickup Community Area"] = taxi["Pickup Community Area"].fillna(100)
    taxi["Dropoff Community Area"] = taxi["Dropoff Community Area"].fillna(100)
    taxi["Pickup Community Area"] = pd.to_numeric(taxi["Pickup Community Area"], downcast="unsigned")
    taxi["Dropoff Community Area"] = pd.to_numeric(taxi["Dropoff Community Area"], downcast="unsigned")
    taxi["Trip Start Timestamp"] = pd.to_datetime(taxi['Trip Start Timestamp'], format='%Y-%m-%d %H:%M:%S.%f')


    #Change taxi names to shorter names to save more space and downcast it to category
    len(taxi.Company.unique())
    company_names = {
        'Flash Cab' : 'Flash Cab', 
        'Star North Management LLC' : 'Star North',
        'Taxi Affiliation Services' : 'Taxi Affiliation', 
        'Choice Taxi Association' : 'Choice Taxi',
        'Chicago Independents' : 'Chicago Independents', 
        'Blue Ribbon Taxi Association Inc.': 'Blue Ribbon Inc.',
        'Taxicab Insurance Agency, LLC' : 'Taxicab Insurance',
        'Top Cab Affiliation' : 'Top Cab',
        'KOAM Taxi Association' : 'KOAM', 
        '1085 - 72312 N and W Cab Co' : 'N and W Cab Co',
        'Chicago Medallion Management' : 'Chicago Medallion', 
        '24 Seven Taxi' : '24 Seven Taxi',
        'Chicago Carriage Cab Corp' : 'Chicago Carriage', 
        'Chicago Taxicab' : 'Chicago Taxicab', 
        'Sun Taxi' : 'Sun Taxi',
        'Globe Taxi' : 'Global Taxi', 
        'Patriot Taxi Dba Peace Taxi Associat' : 'Patriot Taxi',
        'City Service' : 'City Service', 
        'Medallion Leasin' : 'Medallion Leasin',
        'Taxi Affiliation Service Yellow' : 'Taxi Affiliation Yellow', 
        'Blue Diamond' : 'Blue Diamond',
        'Nova Taxi Affiliation Llc' : 'Nova LLC', 
        'Gold Coast Taxi' : 'Gold Coast Taxi', 
        'Yellow Cab' : 'Yellow Cab',
        '312 Medallion Management Corp' : 'Medallion Corp',
        'Metro Jet Taxi A' : 'Metro Jet',
        'Checker Taxi Affiliation' : 'Checker Taxi Affiliation', 
        '5 Star Taxi' : '5 Star Taxi', 
        'Checker Taxi' : 'Checker Taxi',
        '6742 - 83735 Tasha ride inc' : 'Tasha Ride', 
        'Setare Inc' : 'Setare Inc',
        'American United Taxi Affiliation' : 'American United Affiliation', 
        '1469 - 64126 Omar Jada' : 'Omar Jada',
        'American United' : 'American United',
        '6743 - 78771 Luhak Corp' : 'Luhak Corp',
        'Leonard Cab Co' : 'Leonard Cab Co',
        '4053 - 40193 Adwar H. Nikola' : 'Adwar H. Nikola', 
        '3011 - 66308 JBL Cab Inc.' : 'JBL Cab Inc.',
        '4623 - 27290 Jay Kim' : 'Jay Kim', 
        '3094 - 24059 G.L.B. Cab Co' : 'G.L.B. Cab Co',
        '2092 - 61288 Sbeih company' : 'Sbeih company',
        '2733 - 74600 Benny Jona' : 'Benny Jona',
        '6574 - Babylon Express Inc.' : 'Babylon Express Inc',
        '3623 - 72222 Arrington Enterprises' : 'Arrington Enterprises',
        'Chicago Star Taxicab' : 'Chicago Star',
        '4787 - 56058 Reny Cab Co' : 'Reny Cab Co',
        '3721 - Santamaria Express, Alvaro Santamaria' : 'Santamaria Express',
        '5006 - 39261 Salifu Bawa' : 'Salifu Bawa' , 
        '5062 - 34841 Sam Mestas' : 'Sam Mestas',
        '5074 - 54002 Ahzmi Inc' : 'Ahzmi Inc',
        '3620 - 52292 David K. Cab Corp.' : 'David K. Cab Corp.',
        '5874 - 73628 Sergey Cab Corp.' : 'Sergey Cab Corp.', 
        '3591 - 63480 Chuks Cab' : 'Chuks Cab',
        'Petani Cab Corp' : 'Petani Cab Corp', 
        'U Taxicab' : 'U Taxicab', 
        '3556 - 36214 RC Andrews Cab' : 'RC Andrews Cab'
    }
    taxi["Company"] =taxi["Company"].map(company_names, na_action='ignore').astype("category")


    #Check the memory usage and the datatypes to make sure everything is correct
    taxi.info()
    taxi.dtypes

    #Save the dataset to taxi.tsv
    taxi.to_csv("taxi.tsv",sep='\t',index=False)
    ```

* There is a GeoJSON file which stores the location of the commnity areas however it doesn't have an outside community location and area number so we have to incorporate it:


```R
neighborhoods_geojson <- "Boundaries - Community Areas (current).geojson"

neighborhoods_raw <- sf::read_sf(neighborhoods_geojson)

neighborhoods_df <- tibble(neighborhoods_raw)
areas <- tibble(neighborhoods_df$area_numbe, tolower(neighborhoods_df$community))

names(areas) <- c("area_no", "community_name")
areas$area_no <- sapply(areas$area_no, as.integer)

```
* To work with data in a reactive way we create a reactive DataFrame function which dynamically selects the data based on the input

```R
area_community <- eventReactive({
    input$community
    input$outside
  },if(input$community!="All"){
    area_community <- subset(areas,community_name==input$community)[[1]]
    area_community
  }
  )
  
  taxi_outside_filter <- eventReactive({
    input$outside
    input$community
  },
  if(input$outside == 'Enable'){
    taxi
  }
  else{
    taxi %>% filter(Pickup_Community_Area != 100 & Dropoff_Community_Area != 100)
  }
  )
  
  taxi_filter_company <- eventReactive({
    input$taxi
    input$outside
  },
  if(input$taxi != 'All'){
    taxi_outside_filter() %>% filter(Company == input$taxi)
  }
  else{
    taxi_outside_filter()
  }
  )
```

* If you want to deploy your app on free tier shiny server you need to first chunck the data into a number of smaller sized(max 5Mb) which will enable us to upload. This is done by running the bash script.

```bash
awk -v lines="30000" -v pre="awk_part_" '
        NR==1 { header=$0; next}
        (NR-1) % lines ==1 { fname=pre c++; print header > fname}
        {print > fname}' taxi.tsv
```

Once the data is split you can move the original dataset to a different filepath to reduce the data redundancy.  
To read all the chuncked file the following code is used instead of the original read line:
```R
temp = list.files(pattern="*.tsv")
allData <- lapply(temp,read.delim)
taxi <- do.call(rbind, allData)
```

* For the percentage of rides to and from a particular community we need to merge the taxi community data with the GeoJSON data stored in neighborhoods_raw:

```R
taxi_community["n"] <- (taxi_community["n"]/length)*100
    names(taxi_community) <- c("area_numbe","Rides")
    neighborhoods_raw <- merge(neighborhoods_raw,taxi_community,by="area_numbe",all.x=TRUE)
```

* As the neighborhoods file doesn't contain an area for outside community we need to add a rectangle for it which makes sense to the user this is done as follows:

```R
leaflet::leaflet() %>%
        addTiles()  %>% 
        leaflet::addRectangles(
          lng1=-87.542883, lat1=41.892358,
          lng2=-87.490020, lat2=41.806340,
          fillColor = "transparent"
        )
```
___
## Dashboard

* The About Page gives a high-level overview of the application, the dataset used, and the Authors. 
![about](/images/posts/chicago_taxi/about.png)

* To access the dashboard go to the [link](http://shiny.evl.uic.edu:3838/g9/abjo/).  
The first page which opens is the Main page.
![dashboard](/images/posts/chicago_taxi/dashboard.jpeg)
The Main page is divided into three sections:
    1. The first section consists of the input for the dashboard on the sidebar which helps the user to filter in and out the community areas, company names and change the format of time and distance. <br> <br>
    ![map](/images/posts/chicago_taxi/input.png) <br> <br>

    2. The second section bar plots of the rides for all the community areas and companies, also binned ride milage and time. <br> <br>
    ![plot_all](/images/posts/chicago_taxi/dashboard.jpeg) <br> <br>
    ![plots](/images/posts/chicago_taxi/binned.png) <br> <br>
    
    3. The third section displays a bar plot for rides to/from each community depending upon the option selected and a map which displays a heatmap of rides to/from respectively for the given community area and company selected if available. <br><br>
    ![plots](/images/posts/chicago_taxi/map.png) <br> <br>

___
## Interesting questions

1. Which areas is a particular cab company getting more rides to/from
For this the user should select the cab company which they are interested in and check the map as well as the bar plot as per the community below. This helps the company to make an informed decision if they are trying to increase their services in a particular region

![cab_company](/images/posts/chicago_taxi/cab.png) <br> <br>
The Flash cab is performing really well Logan Sqaure and Mount Greenwood. However they aren't great in the rest of chicago. Their potential growing spots are Oakland, Kenwood and Ohare

2. Why did the number of rides dropped during a particular time or date

For this the user should select the cab company which they are interested in and check the bar graphs as well as the tables to see granular information. This helps the company to check their performance during different Q-on-Q basis.
![cab_company](/images/posts/chicago_taxi/cab_performance.png) <br> <br>

We can see the U Taxicab when began their services were not quite popular. However they made good progress during the months November and December.
