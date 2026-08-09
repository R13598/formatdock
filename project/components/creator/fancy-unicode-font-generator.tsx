'use client';

import { useState } from 'react';
import { Type } from 'lucide-react';
import CopyButton from '@/components/ui/copy-button';
import { cn } from '@/lib/utils';

// Unicode mapping tables
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const a = 'abcdefghijklmnopqrstuvwxyz';
const n = '0123456789';

const styles: { name: string; upper: string; lower: string; num?: string }[] = [
  { name: 'Bold', upper: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭', lower: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇' },
  { name: 'Italic', upper: '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡', lower: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻' },
  { name: 'Bold Italic', upper: '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕', lower: '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯' },
  { name: 'Script', upper: '𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵', lower: '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏' },
  { name: 'Bold Script', upper: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩', lower: '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃' },
  { name: 'Fraktur', upper: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ', lower: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷' },
  { name: 'Bold Fraktur', upper: '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅', lower: '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟' },
  { name: 'Double-Struck', upper: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄𝕅𝕆𝕇ℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ', lower: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫', num: '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡' },
  { name: 'Sans Bold', upper: '𝟭𝘽𝘾𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭', lower: '𝟭𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯' },
  { name: 'Monospace', upper: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉', lower: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣', num: '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿' },
  { name: 'Circled', upper: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ', lower: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ', num: '⓪①②③④⑤⑥⑦⑧⑨' },
  { name: 'Squared', upper: '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉', lower: '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉' },
  { name: 'Small Caps', upper: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ', lower: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ' },
  { name: 'Bubble', upper: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ', lower: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ' },
  { name: 'Inverted', upper: 'ɐqɔpǝɟƃɥᴉɾʞlɯndoɹsʇnʌʍxʎz', lower: 'ɐqɔpǝɟƃɥᴉɾʞlɯndoɹsʇnʌʍxʎz' },
  { name: 'Wide', upper: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ', lower: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ', num: '０１２３４５６７８９' },
];

function convert(text: string, s: { upper: string; lower: string; num?: string }): string {
  let result = '';
  for (const ch of text) {
    const upIdx = A.indexOf(ch);
    const loIdx = a.indexOf(ch);
    const nuIdx = n.indexOf(ch);
    if (upIdx >= 0) result += s.upper[upIdx] ?? ch;
    else if (loIdx >= 0) result += s.lower[loIdx] ?? ch;
    else if (nuIdx >= 0 && s.num) result += s.num[nuIdx] ?? ch;
    else result += ch;
  }
  return result;
}

export default function FancyUnicodeFontGenerator() {
  const [input, setInput] = useState('Type your text here...');

  return (
    <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Type className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Fancy Unicode Font Generator</h2>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Type something..."
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {styles.map((s, idx) => {
          const converted = convert(input, s);
          return (
            <div
              key={s.name}
              className="group relative rounded-xl border border-border bg-muted/20 p-4 transition-all hover:border-primary/40"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.name}</span>
                <CopyButton
                  text={converted}
                  className="h-7 w-7 justify-center"
                  iconClassName="h-3.5 w-3.5"
                />
              </div>
              <p className="break-words text-base text-foreground">{converted}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
