// @vitest-environment jsdom
import {it,expect,vi,afterEach} from 'vitest';
import {artwork} from './artwork';
afterEach(()=>vi.unstubAllGlobals());
it('keeps a channel cover on image failure and rejects late previous image loads',()=>{
 const images:HTMLImageElement[]=[];
 vi.stubGlobal('Image',function(){const i=document.createElement('img');images.push(i);return i});
 const a=artwork({id:'kbs-22',name:'KBS HappyFM',providerId:'kbs'},'mark');
 a.update({title:'A',image:'https://programres.kbs.co.kr/a.jpg',endsAt:1});
 images[0].dispatchEvent(new Event('error'));expect(a.element.textContent).toContain('HappyFM');
 a.update({title:'B',image:'https://programres.kbs.co.kr/b.jpg',endsAt:2});
 images[0].dispatchEvent(new Event('load'));expect(a.element.querySelector('img')).toBeNull();
 images[1].dispatchEvent(new Event('load'));expect(a.element.querySelector('img')?.alt).toBe('B 프로그램 이미지');
 a.update();expect(a.element.textContent).toContain('HappyFM');expect(a.element.querySelector('img')).toBeNull();
});
