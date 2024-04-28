import { TrophyRollDialog } from "../roll/roll.js";
import { TrophyRuinRoll } from "../roll/roll.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class TrophyDarkActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ["trophy", "sheet", "actor"],
        template: "systems/trophy/templates/actor/trophy-dark-sheet.html",
        width: 400,
        height: 900,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
        });
    }

    /** @override */
    get template() {
        //if(this.actor.type === 'trophy-dark'){
            return "systems/trophy/templates/actor/trophy-dark-sheet.html";
        //}
        //else{
        //    return "systems/trophy/templates/actor/trophy-dark-sheet.html";
        //}        
    }

    /** @override */
    async getData() {

        const data = super.getData();

        // maybe allow overriding this as a system setting?
        data.actor.system.maxNumberOfRituals = 3;
        
        let ritualCount = 0;

        for(const i of data.actor.items){
            if(i.type === 'ritual'){
                ritualCount += 1;
            }
        }

        data.actor.system.ritualCount = ritualCount;

        if(ritualCount >= data.actor.system.ruin){
            data.actor.system.ruin = ritualCount + 1;
        }

        if(data.actor.system.ruin < 1)
        {
            data.actor.system.ruin = 1;
        }

        if(ritualCount >= data.actor.system.maxNumberOfRituals){
            data.actor.system.hasMaxNumberOfRituals = true;
        }
        else{
            data.actor.system.hasMaxNumberOfRituals = false;
        }

        data.drive = await TextEditor.enrichHTML(this.object.system.drive, {async: true});

        console.log(data);
        
        return data;
    }

    async _prepareCharacterItems(sheetData){

    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) return;

        html.find('.item-create').click(this._onItemCreate.bind(this));

        html.find('.ruin-die-sheet-icon').click(ev => {

            const el = $(ev.currentTarget);
            
            let newRuin = el.data('ruin');

            if(newRuin < this.actor.system.ritualCount + 1){
                newRuin = this.actor.system.ritualCount + 1;
            }
            
            let updatedData = duplicate(this.actor.system);

            updatedData.ruin = newRuin;

            this.actor.update({'data': updatedData});
        });

        html.find('.roll-ruin').click(async ev => {

            const el = $(ev.currentTarget);                        
            
            let currentRuin = el.data('ruin');

            let roll = new TrophyRuinRoll("1d6", {actor: this.actor});

            await roll.evaluate({ async: true });

            roll.toMessage();

            if(roll.total > this.actor.system.ruin){
                let updatedData = duplicate(this.actor.system);

                updatedData.ruin += 1;

                this.actor.update({'data': updatedData});
            }

        });

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            //const el = ev.currentTarget;
            const el = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(el.data('item-id'));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            //const el = ev.currentTarget;
            const el = $(ev.currentTarget).parents(".item");
            let options = {};
            this.actor.deleteEmbeddedDocuments("Item", [el.data('item-id')], options);
        });
    }

  _onItemCreate(event) {

    event.preventDefault();

    const header = event.currentTarget;

    // Get the type of item to create.
    const type = header.dataset.type;

    // Initialize a default name.
    const name = `New ${type.capitalize()}`;

    // Prepare the item object.
    const itemData = {
        name: name,
        type: type,
        system: {}
    };

    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  _getHeaderButtons(){

    let buttons = super._getHeaderButtons();

    const rollDialog = new TrophyRollDialog(this.actor);

    buttons = [{
        label: 'Rolls',
        class: "trophy-roll",
        icon: "fas fa-dice",
        onclick: (ev) => rollDialog.showRollDialog()
      }].concat(buttons);
    
    return buttons;
  }

}

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class TrophyGoldActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ["trophy", "sheet", "actor"],
        template: "systems/trophy/templates/actor/trophy-dark-sheet.html",
        width: 800,
        height: 800,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
        });
    }

    /** @override */
    get template() {
        //if(this.actor.type === 'trophy-gold'){
            return "systems/trophy/templates/actor/trophy-gold-sheet.html";
        //}
        //else{
        //    return "systems/trophy/templates/actor/trophy-dark-sheet.html";
        //        
    }

    /** @override */
    async getData() {

        const data = super.getData();

        data.actor.system.maxNumberOfRituals = 3;
        
        let ritualCount = 0;

        for(const i of data.actor.items){
            if(i.type === 'ritual'){
                ritualCount += 1;
            }
        }

        if(ritualCount > data.actor.system.ruin){
            data.actor.system.ruin = ritualCount;
        }

        if(data.actor.system.ruin < 1)
        {
            data.actor.system.ruin = 1;
        }

        if(ritualCount >= data.actor.system.maxNumberOfRituals){
            data.actor.system.hasMaxNumberOfRituals = true;
        }
        else{
            data.actor.system.hasMaxNumberOfRituals = false;
        }

        data.drive = await TextEditor.enrichHTML(this.object.system.drive, {async: true});

        console.log(data);
        
        return data;
    }

    async _prepareCharacterItems(sheetData){

    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) return;

        html.find('.item-create').click(this._onItemCreate.bind(this));

        html.find('.ruin-die-sheet-icon').click(ev => {

            const el = $(ev.currentTarget);
            
            let newRuin = el.data('ruin');

            let updatedData = duplicate(this.actor.system);
            updatedData.ruin = newRuin;
            this.actor.update({'data': updatedData});
        });

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            //const el = ev.currentTarget;
            const el = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(el.data('item-id'));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            //const el = ev.currentTarget;
            const el = $(ev.currentTarget).parents(".item");
            let options = {};
            this.actor.deleteEmbeddedDocuments("Item", [el.data('item-id')], options);
        });
    }

  _onItemCreate(event) {

    event.preventDefault();

    const header = event.currentTarget;

    // Get the type of item to create.
    const type = header.dataset.type;

    // Initialize a default name.
    const name = `New ${type.capitalize()}`;

    // Prepare the item object.
    const itemData = {
        name: name,
        type: type,
        system: {}
    };

    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  _getHeaderButtons(){
    let buttons = super._getHeaderButtons();

    /* buttons = [{
        label: 'd3',
        class: "d3-roll",
        icon: "fas fa-dice",
        onclick: (ev) => simpleDiceRoll(this.actor, 'd3', 'd3')
      }].concat(buttons); */

    return buttons;
  }

}