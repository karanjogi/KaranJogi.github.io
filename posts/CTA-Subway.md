# CTA Subway Data Visualization
#### Author: Karan Jogi

___

The dashboard is hosted on shinyapps.io and can be accessed from [here](https://karanjogi.shinyapps.io/Chicago-CTA-Subway/)


___
## Walkthrough video

___
## Background
  
    The dashboard is designed to visualize and compare passenger entries for various CTA Stations viz. UIC Halsted, O'Hare and Rosemont. This project was developed in RStudio using R programming language and Shinyapp to deploy as an application. This application was designed to run on a touchscreen with resolution 5,760 x 3,240.

  
___

## Requirements

1. Running the dashboard
    * Interent connection and [link](https://karanjogi.shinyapps.io/Chicago-CTA-Subway/)

2. Running the [source code](https://github.com/karanjogi/Chicago-CTA-Subway):
    * Clone the repository from github
    * R and Rstudio to edit and run the code
    * R packages required: shiny, shinythemes, ggplot2, lubridate, dplyr, scales
        * Any required package can be installed using:  
          
    ```R
    install.packages("package_name")
    ```
    * Shinyapps account

___

## Data
The CTA Subway data is publicy available at [Chicago Data Portal](https://data.cityofchicago.org/Transportation/CTA-Ridership-L-Station-Entries-Daily-Totals/5neh-572f). The dataset consists of **1.09M** datapoints containing all the CTA Subway stations of all the lines.  
A gist of the dataset can be seen below:  
### Column Preview:
![column_data](/images/posts/cta_subway/columns_data.png)

### Table Preview:
![tabular_data](/images/posts/cta_subway/table_preview.png)

___
## Processing
* The data is first chuncked into a number of smaller sized which will enable us to upload them on the free shiny server(5Mb). This is done by running the bash script **split_shiny.sh**.  
Once the data is split you can move the original dataset to a different filepath to reduce the data redundancy.  
To read all the chuncked file the following code is used:
```R
temp_df = list.files(pattern="*.tsv")
cta_temp <- lapply(temp_df, read.delim)
cta_data <- do.call(rbind, cta_temp)
```
* If we used ```R table.read()``` then we will be missing most of our data as there's a **quote(')** in the dataset.  
As the dataset has all the subway stations in it, however for this project I have considered only 3 stations:
1. UIC Halsted
1. O'Hare Ariport
1. Rosemont

* It's better to filter them out and process. This will help to render and process the plots faster.
```R
cta_stations = cta_data %>% filter(stationname %in% c("UIC-Halsted", "O'Hare Airport", "Rosemont"))
```

* When we check the dataframe the dates are not intrepreted by R as dates. So we need to use **lubridate** package to convert all the date values to R-interpretable format. This helps us aggregate and label the months and days easily.

```R
cta_stations <- cta_stations %>% 
  mutate(date = mdy(date))
```

* For interesting dates we need to filter out data for various stations and for different timelines. It is recommended to do this for a particular session of R becuase when the application is live and when we scale it. These values will be fixed for a particualar R session and not for each user. Additionally, processing in the shiny app is not recommended as it makes the data rendering slow.

```R
cta_uic <- cta_stations %>% filter(stationname == "UIC-Halsted") %>% select("date", "rides")
cta_ros <- cta_stations %>% filter(stationname == "Rosemont") %>% select("date", "rides")
cta_oha <- cta_stations %>% filter(stationname == "O'Hare Airport") %>% select("date", "rides")

cta_uic_2020 <- cta_uic %>% filter(year(date) == 2020)
cta_uic_2021 <- cta_uic %>% filter(year(date) == 2021)
cta_uic_2014 <- cta_oha %>% filter(year(date) == 2014)
cta_uic_2002 <- cta_oha %>% filter(year(date) == 2002)

cta_ros_2019 <-  cta_ros %>% filter(year(date) == 2019)
cta_ros_2001 <- cta_ros %>% filter(year(date) == 2001)
cta_ros_2006 <-  cta_ros %>% filter(year(date) == 2006)
cta_ros_2008 <-  cta_ros %>% filter(year(date) == 2008)

cta_oha_2019 <- cta_oha %>% filter(year(date) == 2019)
cta_oha_2017 <- cta_oha %>% filter(year(date) == 2017)
cta_oha_2014 <- cta_oha %>% filter(year(date) == 2014)
```

___
## Dashboard
* To access the dashboard go to the [link](https://karanjogi.shinyapps.io/Chicago-CTA-Subway/).  
The first page which opens is the About page.
![about_dashboard](/images/posts/cta_subway/about_dashboard.png)
It gives a high-level overview of the application, the dataset used, and the Author.

* In the Visualization tab the user is presented with 2 customizatable stations(UIC Halsted and O'Hare):
![visual_dashboard](/images/posts/cta_subway/visualization_dashboard.png)

The layout is very intuitive and easy to use. At the top we have yearly entries of 2 stations which are selected. It provides summary of how the stations have been doing over the years lately. The colour chosen is steel blue which is clearly visible on the white background.  
The user has an option to select a particular year or aggregation(month/weekday) or a station. Upon selection the graph(s) and table will dynamically change according to the given input.  
### Monthly distribution for UIC Halsted and Weekday distribution for O'Hare
![timeframe_dashboard](/images/posts/cta_subway/timeframe_dashboard.png)
___

## Interesting Dates
1. **Covid 19: December 2020**  
Due to the covid-19 restrictions entries at the UIC-Halsted decreased by a huge margin. This is clearly visible in the year of 2020 as the restrictions began.
![covid_19](/images/posts/cta_subway/interesting_dates/date1.png)

1. **Online lectures for Fall-2020: August - December 2020**  
Due to the online lectures during Fall-2020 the entries at UIC-Halsted decreased by a huge margin. This can be observed by a marginal increase in entries during the August-December period.
![covid_19](/images/posts/cta_subway/interesting_dates/date2.png)

1. **Begining of Fall 2021 semester in-person: August 23, 2021**  
Due to the in-person lectures at UIC the entries at UIC-Halsted increased by a huge margin. This can be observed by the spike from the month of August 23 i.e Fall semester starting date for UIC
![covid_19](/images/posts/cta_subway/interesting_dates/date3.png)

1. **Surge at Rosemont due to O'Hare Shutdown: September 28, 2019**  
Due to the shutdown of O'Hare station from September 27 for repairs. As there were free shuttles to Rosemont it is clearly that these people were diverted to Rosemont for the CTA.
![covid_19](/images/posts/cta_subway/interesting_dates/date4.png)

1. **Pantera Setlist Concert at Rosemont: July 3, 2001**  
Pantera Setlist, a famous metalband, had a concert at Rosemont on July 3 which explains a huge spike of entries on that day
![covid_19](/images/posts/cta_subway/interesting_dates/date5.png)

1. **NLDS Cubs match: October 9, 2021**  
One of the major league division seires was being held in Chicago, Wrigley Field. Naturally, many people will come to watch the match from various states. Hence there's a surge in entries from O'Hare near that period.
![covid_19](/images/posts/cta_subway/interesting_dates/date6.png)

1. **Train Collision: March 24, 2014**  
Due to train collision at O'Hare station it was closed for a brief period during that time.
![covid_19](/images/posts/cta_subway/interesting_dates/date7.png)

1. **UIC Halsted reconstruction as part of Circle Interchange project: March 27, 2014**  
Construction project going at UIC Halsted station due to which we see lower/no entries during that time. 
![covid_19](/images/posts/cta_subway/interesting_dates/date8.png)

1. **Wizard World Chicago Convention on August 4: August 4, 2006**  
Wizard World Convention was being held at Rosemont which is one of the major convention of fiction series and comics. Due to which lots people were gathered at Rosemont.
![covid_19](/images/posts/cta_subway/interesting_dates/date9.png)

1. **Suspension of part of the Blue Line for Three Weeks: July 9, 2008**  
Due to technical difficulties the blue line was suspended between O'Hare and Rosemont. However shuttles were running due to which we see a huge increase in the entries at Rosemont.
![covid_19](/images/posts/cta_subway/interesting_dates/date10.png)

___
