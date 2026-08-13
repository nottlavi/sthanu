# location flow

 ## 1. when in incident mode
- user gets a sliding screen w following options:
	1) fetch live
	2) use permanent
	3) use recents (3 locations max)

	### the flow
	- set location
 		1. button to access coords using gps.
  		2. or permanent address selection
  		3. or recently three used location
  	- the finalized location gets stored temporarily
  	- when the incident is raised on the system
  	- this location gets linked to that incident.


## 2. when setting permanent address
- user gets to set permanent address 
- either using live location or typing it down manually.
  
	### the flow
	- frontend creates a zepto like address form.
	- on click "save" backend api gets called.
    - the user's table saves this address for once and all (can be edited later).

## 3. expected payload from the frontend
```
{
  "addressLine": "Flat 402, B-Wing, Royal Palms",
  "landmark": "Near Goodluck Cafe",
  "city": "Pune",
  "state": "Maharashtra",
  "pincode": "411004",
  "latitude": 18.5204303,
  "longitude": 73.8567437
}
```

