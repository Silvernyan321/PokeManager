prompt = require("readline-sync").question

dex = require("./index.js")

var choice = prompt("Choose a pokemon: ")

poke = new dex.pokemon(choice)

poke.log()