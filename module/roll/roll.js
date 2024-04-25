export class TrophyRoll extends Roll{
  
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);
  }

  async createMessage(content, flavor, rollMode) {
    const chatData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content,
      flavor,
      type: 5, // CHAT_MESSAGE_TYPES.ROLL,
      roll: this,
      rollMode,
    };

    // play the dice rolling sound, like a regular in-chat roll
    AudioHelper.play(
      { src: "sounds/dice.wav", volume: 0.8, autoplay: true, loop: false },
      true,
    );
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

    const template = "systems/trophy/templates/dialog/roll-dialog.html";
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
              
              await roll.evaluate({ async: true });                            

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