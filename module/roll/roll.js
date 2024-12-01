export class TrophyRuinRoll extends Roll{
  
  constructor(formula, data = {}, options = {}) {    
    super("1d6[dark]", data, options);
    this.data = data;
    this.options = options;
    this.actor = data.actor;
  }

  async toMessage(){

    const rollMode = this.options.rollMode || game.settings.get("core", "rollMode");
    const chatFlavor = null; //`${this.actor.name} Rolls Ruin, Current Ruin: ${this.actor.system.ruin}`;  

    let isBlind = false;
    let isSynchronized = true;

    if(rollMode === 'blindroll'){
      isBlind = true;
    }
    else if(rollMode === 'gmroll'){
      isSynchronized = false
    }

    let rollResult = '';
    
    if(this.total > this.actor.system.ruin){
      if(this.actor.system.ruin + 1 < 6){
        rollResult = `RUIN INCREASED TO ${this.actor.system.ruin + 1}`;
      }
      else{
        rollResult = `RUIN INCREASED TO 6, ${this.actor.name.toUpperCase()} IS LOST.}`;
      }
    }
    else{
      rollResult = `RUIN DOES NOT INCREASE`;
    }

    const templateBackingData = {
      total: this.total,
      ruin: this.actor.system.ruin,
      ruinRollResult: rollResult
    }

    const template = "systems/trophy/templates/roll/ruin-roll-chat-message.html";
    const chatHtml = await renderTemplate(template, templateBackingData);

    const chatData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: chatHtml,
      flavor: chatFlavor,
      type: 5, // CHAT_MESSAGE_TYPES.ROLL,
      roll: this,
      rollMode,
    };
    
    if(typeof game.dice3d !== 'undefined'){
      //console.log(game.dice3d);
      game.dice3d.showForRoll(this, game.user, isSynchronized, null, isBlind, null, chatData);
    }

    return ChatMessage.create(chatData);
  }

}

export class TrophyRollDialog{

  constructor(actor) {
    
    this.actor = actor;

  }

  async showRollDialog() {

    //console.log(this.actor.system.ruin);

    const backingData = {
      ruin: this.actor.system.ruin
    };

    const template = "systems/trophy/templates/roll/risk-roll-dialog.html";
    const content = await renderTemplate(template, backingData);
   
    return new Promise((resolve, reject) => {
      new Dialog({
        content,
        title: "Roll",
        default: "roll",
        buttons:{
          roll: {
            label: "Roll",
            callback: async (html) => {

              let darkDie = html.find("[name='darkDie']").val();
              let lightDie = html.find("[name='lightDie']").val();

              let roll = new Roll(lightDie + "d6kh[light] + " + darkDie + "d6kh[dark]", this.actor.system);
              
              await roll.evaluate();                            

              let highestLightDie = roll.terms[0].total;
              let highestDarkDie = roll.terms[2].total;
              let highestDie = Math.max(highestLightDie, highestDarkDie);

              roll._total = Math.max(highestLightDie, highestDarkDie);

              roll.toMessage();              
            }
          }
        },
      }).render(true);
    });
  }
}