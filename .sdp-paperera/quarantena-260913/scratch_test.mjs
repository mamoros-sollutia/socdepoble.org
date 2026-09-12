import fs from 'fs';
const url = 'https://adjlvwtxhpclgmnsvwpm.supabase.co/rest/v1/section_submissions?select=*';
const key = 'sb_publishable_zJySgRnb4ACyAKWxtmVV3w_pxqIhbtY';
fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
}).catch(console.error);
