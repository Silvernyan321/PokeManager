'use strict';
/*
_______________________________________
		MAIN
---------------------------------------

*/

// Prep

var data = require("./parser.js")

var movedex = data.movedex

var pokedex = data.pokedex

var learnsets = data.learnsets

var formatdata = data.formatdata

function log(color, message) {
	var colors = require("colors/safe")
	var d = new Date()
	if (d.getHours() > 12) {
		console.log("[" + String(d.getMonth() + 1) + "/" + String(d.getDate()) + "/" + String(d.getFullYear()) + " " + String(d.getHours() - 12) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds()) + " PM] " + colors[color](message))
	}
	else {
		console.log("[" + String(d.getMonth() + 1) + "/" + String(d.getDate()) + "/" + String(d.getFullYear()) + " " + String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds()) + " AM] " + colors[color](message))
	}
}

Array.prototype.includes = function(element) {
	for (var i = 0; i < this.length - 1; i++) {
		if (this[i] === element) {
			return true;
		}
	}
	return false;
}

Object.prototype.getValues = function() {
	var keys = Object.keys(this)
	var values = []
	for (var i = 0; i < keys.length; i++) {
		values.push(this[keys[i]])
	}
	return values;
}

function upperFirstArrayLetter(array) {
	for (var i = 0; i < array.length; i++) {
		array[i] = array[i].substring(0, 1).toUpperCase() + array[i].substring(1, array[i].length)
	}
	return array;
}

exports.getPokeLearnset = function(poke) {
	return Object.keys(learnsets[poke.toLowerCase()].learnset);
}

exports.pokeCanLearn = function(poke, move) {
	return Object.keys(learnsets[poke.toLowerCase()].learnset).includes(move.toLowerCase());
}

Array.prototype.toLowerCase = function() {
	return this.join("65323fjkhf3899729rhfhdgih98377917r98iyedf9e87493").toLowerCase().split("65323fjkhf3899729rhfhdgih98377917r98iyedf9e87493")
}

var uploadToHastebin = function(toUpload, callback) {
    if (typeof callback !== 'function') return false;
        var reqOpts = {
            hostname: 'hastebin.com',
            method: 'POST',
            path: '/documents'
    };

    var req = require('http').request(reqOpts, function(res) {
        res.on('data', function(chunk) {
            var filename;
            try {
                var filename = JSON.parse(chunk).key;
            }
            catch (e) {
                    if (typeof chunk === 'string' && /^[^\<]*\<!DOCTYPE html\>/.test(chunk)) {
                        callback('Cloudflare-related error uploading to Hastebin: ' + e.message);
                    }
                    else {
                        callback('Unknown error uploading to Hastebin: ' + e.message);
                    }
            }
            callback('http://hastebin.com/raw/' + filename);
        });
    });
    req.on('error', function(e) {
        callback('Error uploading to Hastebin: ' + e.message);
            //throw e;
    });
    req.write(toUpload);
    req.end();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.pokemon = class Pokemon {
	constructor(name) {
		this.name = name.toLowerCase().replace(/ /g, "")
		this.dexEntry = pokedex[this.name]
		this.pokemonName = this.dexEntry.species
		this.movesetDisplay = upperFirstArrayLetter(Object.keys(learnsets[this.name].learnset))
		this.moveset = Object.keys(learnsets[this.name].learnset)
		this.evos = this.dexEntry.evos
		this.dexNumber = this.dexEntry.num
		this.types = this.dexEntry.types
		this.genderRatio = this.dexEntry.genderRatio
		this.baseStatsObj = this.dexEntry.baseStats
		this.baseStats = this.dexEntry.baseStats.getValues()
		this.abilities = this.dexEntry.abilities
		this.pokeHeight = this.dexEntry.heightm 
		this.pokeKilograms = this.dexEntry.weightkg
		this.pokePounds = this.pokeKilograms * 2.20462
		this.eggGroups = this.dexEntry.eggGroups
		this.battleFormats = formatdata[this.name]
		this.eggGroupsId = this.eggGroups.join("1fosjr82981ihdiq23wfrg").toLowerCase().split("1fosjr82981ihdiq23wfrg")
		this.string = JSON.stringify(this)
	}
	getPrevos() {
		if (this.dexEntry.prevo) {
			this.prevos = []
			var prevo = this.dexEntry.prevo
			if (pokedex[prevo].prevo) {
				this.prevos.push(pokedex[prevo].prevo)
			}
			this.prevos.push(prevo)
			return this.prevos;
		}
		else {
			return;
		}
	}
	getEvos() {
		if (this.dexEntry.evos) {
			this.evos = []
			var evo = this.dexEntry.evos
			this.evos.push(evo)
			if (pokedex[evo].evos) {
				this.evos.push(pokedex[evo].evos)
			}
			return this.evos;
		}
		else {
			return;
		}
	}
	pokeCanLearn(move) {
		return Object.keys(learnsets[this.name].learnset).includes(move.toLowerCase());
	}
	log() {
		this.getPrevos()
		this.getEvos()
		console.log(this.pokemonName)
		console.log("-------------------------")
		console.log("#" + this.dexNumber)
		console.log("Egg groups: " + this.eggGroups.join(", "))
		console.log("Types: " + this.types.join(", "))
		var baseStats = ""
		var stats = ["HP", "Attack", "Defense", "SpA", "SpD", "Speed"]
		for (var i = 0; i < 5; i++) {
			var baseStats = baseStats + stats[i] + ": " + this.baseStats[i] + ", "
		}
		var baseStats = baseStats + stats[i] + ": " + this.baseStats[i]
		console.log("Base stats: " + baseStats)
		if (this.evos && this.prevos) {
			console.log("Evolution line: " + this.prevos.join(" > ") + " > " + this.name + " > " + this.evos.join(" > "))
		}
		if (this.prevos && !this.evos) {
			console.log("Evolution line: " + this.prevos.join(" > ") + " > " + this.name)
		}
		if (this.evos && !this.prevos) {
			console.log("Evolution line: " + this.name + " > " + this.evos.join(" > "))
		}
		console.log("Weight: " + this.pokePounds + " lbs , Height: " + this.pokeHeight + " meters")
		uploadToHastebin(
			"Moveset for " + this.pokemonName + "\n" + "-----------------------------------\n" + 
			this.movesetDisplay.join(", ") + ".", function (link) {
			console.log("Moveset: " + link)
		});
		if (this.genderRatio) {
			var maleChance = this.genderRatio.M * 100 
			var femaleChance = this.genderRatio.F * 100 
			console.log("Gender ratio: " + maleChance + "% chance of being male, " + femaleChance + "% of being female.")
		}
		var abilities = this.abilities.getValues()
		var abilities = abilities.splice(abilities.length - 2, 1)
		if (abilities.length > 1 && typeof abilities != "string") {
			abilities = abilities.join(", ")
		}
		console.log("Abilities: " + abilities + ", Hidden abilities: " + this.abilities.getValues()[Object.keys(this.abilities).length - 1])
	}
}

exports.move = class Move {
	constructor(name) {
		this.name = name.toLowerCase().replace(/ /g, "")
		this.dexEntry = movedex[this.name]
		this.displayName = this.dexEntry.name
		this.typeMove = this.dexEntry.type
		this.typeId = this.dexEntry.type.toLowerCase()
		this.desc = this.dexEntry.desc
		this.briefDesc = this.dexEntry.shortDesc
		this.pp = this.dexEntry.pp
		this.flags = this.dexEntry.flags
		this.drain = this.dexEntry.drain
		this.target = this.dexEntry.target
		this.accuracy = this.dexEntry.accuracy
		this.basePower = this.dexEntry.basePower
		var learnableBy = []
		for (var i = 0; i < Object.keys(learnsets).length; i++) {
			if (Object.keys(learnsets[Object.keys(learnsets)[i]].learnset).includes(this.name)) {
				learnableBy.push(Object.keys(learnsets)[i])
			}
		}
		this.learnableBy = learnableBy
		this.string = JSON.stringify(this)
	}
}
