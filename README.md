# Evaluating Transit Poverty: A Comparative Spatial Study of London and New York


---

## Project Overview
This project is an interactive data visualization dashboard designed to explore the concepts of "Spatial Penalty" and "Transit Poverty." By comparing the fare structures of Transport for London (TfL) and the New York Metropolitan Transportation Authority (MTA), the project examines how different transit pricing systems impact low-income communities. 

While London relies on a distance-based Zonal Fare Matrix that increases costs for commuters living in peripheral areas (up to Zone 6), New York City uses a Flat-Fare system that charges a uniform rate regardless of distance. This dashboard maps transport networks against socioeconomic data to visualize how these different systems distribute the financial burden of daily commuting.

* Source Code Repository: https://github.com/Gracie-H/London-Data-Visualization
* Live Demonstration: https://gracie-h.github.io/London-Data-Visualization/

---

## Key Features and Pages
The application is built as a multi-page web interface with a top navigation bar, split into three main sections:

### 1. Theoretical Background (Page 1)
An introductory page that explains the urban geography theories behind transit poverty and spatial isolation, setting the context for the data tools in the following pages.

### 2. Interactive GIS Map Terminal (Page 2)
A map-based interface built with Mapbox GL JS for spatial auditing.
* **Interactive Map:** Visualizes London Underground stations using GeoJSON data, with station markers color-coded by their TfL fare zone (Zones 1-6).
* **Postcode Search:** Connects to the `postcodes.io` API to look up valid London postcodes. It uses the Haversine formula to calculate distances and automatically snap the map to the nearest station.
* **Live Telemetry HUD:** Selecting a station updates a dashboard showing its active zone, annual travelcard costs based on 2026 TfL fares, estimated daily commute times, and a live comparison metric showing the cost difference versus New York's flat-fare system.
* **Borough-Level Analysis:** Uses `PapaParse` to read regional economic data (`london_borough_data.csv`) and render a Chart.js bubble plot. It charts average annual income against transit cost burdens, with bubble sizes scaled by local poverty rates.

### 3. Social Stratum Matrix (Page 3)
An abstract data visualization built with D3.js that replaces geographical maps with a high-density 30×N grid.
* **Horizontal Axis (Geography):** Sorts transit stations linearly from central metropolitan areas (left) to outer peripheral stations (right).
* **Vertical Axis (Income Groups):** Divides household incomes into 30 distinct percentile bands (from the 5th to the 92nd percentile) based on ONS distribution curves.
* **Interactive Grid:** Hovering over individual grid points displays data for specific demographic profiles, calculating exactly what percentage of a household's annual income is consumed by transit fares.

---

## Mathematical Formula and Cost Thresholds
The dashboard processes every data point in the D3 grid using a standard ratio formula to determine the financial impact of transit costs:

$$\text{Fare Burden Ratio (\%)} = \left( \frac{\text{Annual Transit Cost}}{\text{Baseline Income} \times \text{ONS Percentile Coefficient}} \right) \times 100$$

The resulting percentages are mapped to a color scale to rank economic pressure:
* **Red (> 9.0%):** Critical Exploitation. Fares take up an unsustainable portion of disposable income.
* **Yellow (6.0% - 9.0%):** High Friction. Puts noticeable strain on household budgets.
* **Blue (4.5% - 6.0%):** Moderate. Within standard operating ranges for major metropolitan areas.
* **Teal (< 4.5%):** Low Burden. Indicates good transit affordability and strong financial insulation.

---

## Project Structure
```text
├── index.html                             # Main entry point with navigation and Mapbox GIS layers
├── summary.html                           # D3.js social stratum grid visualization page
├── script.js                              # Core logic for Mapbox, geocoding, and HUD dashboard updates
├── style.css                              # UI dark-mode configurations and sidebar layouts
├── london_borough_data.csv                # Borough-level income and poverty data for Chart.js
├── data/                                  # Cleaned and processed datasets
│   ├── processed_matrix_data_london.csv   # Post-interpolation incomes and stations for London
│   └── processed_matrix_data_ny.csv       # Post-interpolation incomes and stations for New York
└── data_processing/                       # Data pre-processing scripts
   
