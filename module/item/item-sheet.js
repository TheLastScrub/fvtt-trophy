/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TrophyItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
        classes: ["trophy", "sheet", "item"],
        width: 520,
        height: 200,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  /** @override */
  async getData() {
    const data = super.getData();
    data.enrichedDescription = await TextEditor.enrichHTML(this.object.system.description, {async: true});

    this._prepareItemData(data);

    return data;
  }

  _prepareItemData(data){
    
    
  }

  /** @override */
  get template() {
    const path = "systems/trophy/templates/item";
    
    // unique item sheet by type, like `item-type-sheet.html`.
    if(this.item.type === 'spell' || this.item.type === 'skill'){
        return `${path}/item-skill-or-spell-sheet.html`;
    }
    else{
        return `${path}/item-${this.item.type}-sheet.html`;
    }
  }

}