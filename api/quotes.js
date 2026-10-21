// 代抓報價：Brent、黃金、四大指數、台灣加權、BTC、ETH（來源：Yahoo 公開報價，非官方保證）
const SYMS = ["BZ=F","GC=F","^DJI","^GSPC","^IXIC","^SOX","^TWII","BTC-USD","ETH-USD"];
async function one(s){
  try{
    const r = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/"+encodeURIComponent(s)+"?interval=1m&range=1d",{headers:{"User-Agent":"Mozilla/5.0"}});
    const m = (await r.json()).chart.result[0].meta;
    return [s,{price:m.regularMarketPrice,prev:m.chartPreviousClose,time:m.regularMarketTime}];
  }catch(e){ return [s,null]; }
}
export default async function handler(req,res){
  const out = Object.fromEntries(await Promise.all(SYMS.map(one)));
  res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate=30");
  res.status(200).json(out);
}
