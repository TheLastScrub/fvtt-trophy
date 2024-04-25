/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TrophyActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    /** @override */
    get template() {
        if(data.type === "trophy-gold"){
            return "systems/trophy/templates/actor/trophy-gold-sheet.html";
        }
        else{
            return "systems/trophy/templates/actor/trophy-dark-sheet.html";
        }
        
    }

    /** @override */
    static async create(data, options={}) {

        data.prototypeToken = data.prototypeToken || {};
        
        if ( data.type === "trophy-dark" || data.type === "trophy-gold") {
            mergeObject(data.prototypeToken, {
                actorLink: true  // this will make the 'Link Actor Data' option for a token is checked by default. So changes to the token sheet will reflect to the actor sheet.
            }, {overwrite: false});            
        }

        return super.create(data, options);
    }

}