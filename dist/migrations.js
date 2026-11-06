export const SCHEMA_VERSION=2;
export function migrateDocument(raw){const doc=structuredClone(raw);if(doc.schemaVersion===undefined||doc.schemaVersion===1){doc.schemaVersion=2;for(const block of doc.blocks||[]){if(block.rotation===undefined)block.rotation=0;}doc.guides??=[];}return doc;}
