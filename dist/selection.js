export const editableTarget=e=>!!e?.closest?.('input,textarea,select,[contenteditable="true"]');
export function snapshotSelection(selected,selection){return {selected,selection:[...selection]};}
export function restoreSelection(state,doc){const ids=new Set(doc.blocks.map(b=>b.id));const selection=(state.selection||[]).filter(id=>ids.has(id));return {selection,selected:ids.has(state.selected)?state.selected:selection.at(-1)||null};}
