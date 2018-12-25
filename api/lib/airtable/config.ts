import Airtable from 'airtable';

Airtable.configure({ apiKey: process.env.airtable_api_key });
export const base = Airtable.base(process.env.airtable_base_id);
