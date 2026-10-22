import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fallbackProducts,sortProducts,movers,marketSummary,bn,categories} from '../src/lib/catalog';
test('every product has a valid category, unique slug and market prices',()=>{const slugs=new Set();for(const p of fallbackProducts){assert(!slugs.has(p.slug));slugs.add(p.slug);assert(categories.some(c=>c.slug===p.category),p.category);assert(p.markets.length>0);for(const m of p.markets)assert(m.min<=m.max);}});
test('numeric price sorting handles 99 and 148 correctly without mutating the input',()=>{const data=[fallbackProducts[0],fallbackProducts[1]];assert.deepEqual(sortProducts(data,'asc').map(p=>p.today),[99,148]);assert.deepEqual(sortProducts(data,'desc').map(p=>p.today),[148,99]);assert.equal(data[0].today,148);});
test('risers and fallers have correct direction and greatest changes first',()=>{for(const direction of ['up','down'] as const){const list=movers(fallbackProducts,direction);assert.equal(list.length,6);assert(list.every(p=>p.change.dir===direction));for(let i=1;i<list.length;i++)assert(Math.abs(list[i-1].change.pct)>=Math.abs(list[i].change.pct));}});
test('summary uses actual market minimum, maximum and mean of market midpoints',()=>{const p={...fallbackProducts[0],markets:[{market:'ক',division:'ঢাকা',min:10,max:20},{market:'খ',division:'ঢাকা',min:20,max:50}]};assert.deepEqual(marketSummary(p),{min:10,max:50,average:25});});
test('prices display Bengali numerals',()=>{assert.equal(bn(148),'১৪৮');assert.equal(bn(1850),'১,৮৫০');assert.equal(bn(63.5,2),'৬৩.৫');});
