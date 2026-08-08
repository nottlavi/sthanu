# location flow

 ## 1. when in incident mode
- user gets a sliding screen w following options:
	1) fetch live
	2) use permanent
	3) use recents (3 locations max)

	### the flow
	- set location
 		1. zepto type form for live location fetch
  		2. or permanent address selection
  		3. recently three used location
  	- the finalized address gets stored temporarily
  	- when the incident is raised on the system
  	- this address gets linked to that incident.


## 2. when setting permanent address
- user gets to set permanent address 
- either using live location or typing it down manually.
  
	### the flow
	- frontend creates a zepto like address form.
	- on click "save" backend api gets called.
    - the user's table saves this address for once and all (can be edited later).
