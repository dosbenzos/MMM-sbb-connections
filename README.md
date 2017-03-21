# MMM-sbb-connections
Module of the magic mirror project for swiss public transportation (sbb)

# Module: SBB-connections
The `sbb-connections` module allows you to display the next connections from your station on your MagicMirror.


## Using the module

To use `SBB-Connections` module, add it to the modules array in the `config/config.js` file with the following settings:
````javascript

modules: [
    {
			module: 'MMM-sbb-connections',
			position: 'top_left',	// This can be any of the regions.
			config: {
				from: 'Rotkreuz',
				to: 'Luzern',
				limit: '6',
				direct: '1' // 1 = true ; 0 = false
			}
		},
]

````


## Setup

* Clone the module into your `modules` folder in the MagicMirror's code location by running this command:

````
git clone https://github.com/dosbenzos/MMM-sbb-connections.git
````
