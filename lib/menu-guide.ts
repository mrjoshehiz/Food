import menu from './menu.json';
export function menuGuide(message:string){
 const q=message.toLowerCase();
 const result=(reply:string,dishIds:string[]=[],action='')=>({reply,dishIds,action,mode:'guide' as const});
 if(/allerg|groundnut|peanut|shellfish|gluten|vegan|vegetarian/.test(q))return result('Please confirm ingredients with the restaurant before ordering. Suya contains groundnuts; egusi and efo riro list fish and shellfish, and moi moi lists fish and egg. I cannot confirm a dish is safe for an allergy.',['suya','egusi','moimoi'],'Help');
 if(/book|reserv|table/.test(q))return result('You can choose a date, time and party size in Book a table. Sign in to save your request. A request is confirmed only when the restaurant accepts it.',[],'Reserve');
 if(/deliver|pickup|collection|payment|pay\b/.test(q))return result('The app offers pickup and Victoria Island delivery, with a ₦2,500 delivery fee. Payment is on collection or delivery. These are demonstration requests until the restaurant is connected.',[],'Bag');
 if(/address|location|hours|open|phone|contact/.test(q))return result('ILÉ is based on a Victoria Island, Lagos restaurant concept. The exact address, opening hours and contact details are still awaiting restaurant approval.',[],'Help');
 let matches=menu.filter(m=>q.includes(m.id)||q.includes(m.short.toLowerCase())||(m.id==='croaker'&&/fish/.test(q))||(m.id==='peppersoup'&&/pepper soup/.test(q))||(m.id==='moimoi'&&/moi moi/.test(q))||(m.id==='efo'&&/amala/.test(q)));
 const budget=q.match(/(?:under|below|budget|less than|up to)\s*(?:₦|ngn|naira)?\s*([\d,]+)(k)?/);
 if(budget){const amount=Number(budget[1].replaceAll(',',''))*(budget[2]?1000:1);matches=menu.filter(m=>m.price<=amount&&m.cat!=='Drinks').sort((a,b)=>b.price-a.price).slice(0,3);if(!matches.length)return result('There is no food item within that budget on this menu. Moi moi starts at ₦2,500.',['moimoi']);}
 if(/drink|refresh|thirst/.test(q))matches=menu.filter(m=>m.cat==='Drinks');
 if(/recommend|suggest|first|favourite|popular|start|hungry/.test(q)&&!matches.length)matches=menu.filter(m=>['jollof','egusi','suya'].includes(m.id));
 if(matches.length){const picks=matches.slice(0,3);return result(picks.map(m=>`${m.name} — ₦${m.price.toLocaleString('en-NG')}. ${m.description}`).join('\n\n')+'\n\nTap a dish below to choose your options.',picks.map(m=>m.id));}
 if(/hello|hi\b|hey|welcome/.test(q))return result('Welcome to ILÉ! Pull up a chair. I can help you explore our Nigerian dishes, check prices or find the booking page. What are you in the mood for?',['jollof','suya','egusi']);
 return result('I can help with menu dishes, prices, drinks, bookings and delivery information. Try “Recommend something”, “Food under ₦7,000” or the name of a dish.',[],'Menu');
}
