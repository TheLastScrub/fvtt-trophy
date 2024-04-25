import { TrophyActor } from "./actor/actor.js";
import { TrophyDarkActorSheet } from "./actor/actor-sheet.js";
import { TrophyGoldActorSheet } from "./actor/actor-sheet.js";
import { TrophyItem } from "./item/item.js";
import { TrophyItemSheet } from "./item/item-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";

Hooks.once('init', async function() {

    game.trophy = {
        TrophyActor,
        TrophyItem
    };

    // Define custom Entity classes
    CONFIG.Actor.documentClass = TrophyActor;
    CONFIG.Item.documentClass = TrophyItem;

    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    Actors.registerSheet("trophy", TrophyDarkActorSheet, { makeDefault: true });
    Actors.registerSheet("trophy", TrophyGoldActorSheet, { makeDefault: false });
    Items.registerSheet("trophy", TrophyItemSheet, { makeDefault: true });

    preloadHandlebarsTemplates();

    // Add Handlebars helpers
    Handlebars.registerHelper('concat', function() {
        var outStr = '';

        for (var arg in arguments) {
        if (typeof arguments[arg] != 'object') {
            outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });
    
    Handlebars.registerHelper('if_not_eq', function(a, b, opts) {
        if (a != b) { return opts.fn(this); }
        return opts.inverse(this);
    });

 

    Handlebars.registerHelper('remove_html_tags', function(str, opts) {
        if(str === null){
            return null;
        }
        else{
            str = str.toString();
            return str.replace(/(<([^>]+)>)/ig, '');
        }
    });

    // check if indicated 'value' is lower than or equal to current ruin
    // if so, returns the class to stylize a die on the actor sheet as a dark die, otherwise
    // returns the CSS class for a light die
    Handlebars.registerHelper('GetRuinDiceCssClass', function(value, opts) {
        if (value === null || value === 'null') {
            return '';
        }
        
        if(this.actor.system.ruin >= value){
            return "ruin-dark-die"
        }
        else{
            return "ruin-light-die"
        }
    });
});

Hooks.on("ready", ()=> {});

Hooks.on('createActor', async function(actor, options, userId){});

Hooks.once('diceSoNiceReady', (dice3d) => {
    
    dice3d.addSystem({ id: "trophy", name: "Trophy Dark" }, true);
    
    console.log('dice so nice!!!');

    dice3d.addDicePreset({
        type: "d6",
        labels: [
        "1","2","3","4","5","systems/trophy/assets/Designed-for-Trophy-Dark-White.webp"
        ],
        system: "trophy"
    });
  
    dice3d.addColorset({
        name: 'dark',
        description: "Dark Die",
        category: "Trophy Dark",
        foreground: '#B7950B',
        background: 'black',
        texture: 'paper',
        edge: '#7D8A92',
        material: 'wood',
        font: 'SourceSans3',
        fontScale:{
           "d6":2.0
        },
        visibility: 'hidden'
    },"default");
    
    dice3d.addColorset({
        name: 'light',
        description: "Light Die",
        category: "Trophy Dark",
        foreground: '#5F4211',
        background: "#e3dac9",
        texture: 'paper',
        edge: '#7D8A92',
        material: 'wood',
        font: 'SourceSans3',
        fontScale:{
           "d6":2.0
        },
        visibility: 'hidden'
    },"default");

});